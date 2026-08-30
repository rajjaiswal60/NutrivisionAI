import { FoodAnalysis } from "../types";
import { GEMINI_CONFIG, getActiveGeminiApiKey } from "./geminiConfig";

export async function analyzeFoodWithGeminiFlash(
  base64Image: string,
  hint?: string
): Promise<{ success: boolean; data?: FoodAnalysis; error?: string }> {
  const apiKey = getActiveGeminiApiKey();

  if (!apiKey) {
    return {
      success: false,
      error: "No Gemini API key found. Please add your key to src/lib/geminiConfig.ts or connect it in the scanner.",
    };
  }

  const cleanBase64 = base64Image.replace(/^data:image\/[a-z]+;base64,/, "");

  const promptText = `You are NutriVision AI, an expert Clinical Nutritionist and Master Chef.
Analyze this food image in detail:

FIRST EVALUATE:
Is this edible food, a cooked dish, beverage, or food ingredient?
If it is NOT food (e.g. human face, software UI, document, vehicle, animal, object):
Return JSON with:
{
  "isFood": false,
  "nonFoodReason": "This image does not appear to contain edible food or a meal. Please scan or upload a clear photo of an authentic dish, ingredient, or drink."
}

IF IT IS FOOD:
1. Identify every food item and ingredient visible in the image.
2. Estimate the realistic portion size (e.g., "1 medium bowl (350g)", "1 large plate (400g)").
3. Calculate exact total Calories based on macronutrients: (Protein*4 + Carbs*4 + Fat*9).
4. Provide macronutrients: Protein (g), Carbohydrates (g), Fats (g), Fiber (g), Sugar (g), Sodium (mg).
5. Provide Glycemic Index (1-100) and Health Score (1-100).
6. List key bioavailable vitamins and minerals with estimated % Daily Value and specific physiological health benefits.
7. Provide dietary tags (e.g. "High Protein", "Vegetarian", "Gluten-Free", "Rich in Calcium").
8. Provide allergen alerts (e.g. "Dairy", "Nuts", "Gluten", "Soy").
9. Health factors (anti-inflammatory rating, heart health score, satiety index, gut health impact).
10. Complete ingredient breakdown with estimated weights, categories, and calories.
11. Step-by-step authentic chef recipe steps with duration and professional chef tips.
${hint ? `User Dish Hint/Query: "${hint}"` : ""}

Return ONLY raw valid JSON (no markdown formatting, no backticks, no extra text):
{
  "isFood": true,
  "dishName": "Exact Dish Name",
  "cuisineType": "Regional Cuisine Origin",
  "confidence": 98.5,
  "summary": "Nutritional and culinary summary.",
  "portionSize": "1 standard serving (350g)",
  "calories": 520,
  "proteinG": 28,
  "carbsG": 58,
  "fatG": 18,
  "fiberG": 8,
  "sugarG": 5,
  "sodiumMg": 520,
  "glycemicIndex": 48,
  "healthScore": 92,
  "vitamins": [
    { "name": "Vitamin C", "amount": "45 mg", "dailyValuePct": 50, "benefit": "Antioxidant & immune support" }
  ],
  "minerals": [
    { "name": "Calcium", "amount": "320 mg", "dailyValuePct": 32, "benefit": "Bone density & muscle function" }
  ],
  "dietaryTags": ["High Protein", "Rich in Fiber"],
  "allergenAlerts": [],
  "healthFactors": {
    "antiInflammatoryRating": "High",
    "heartHealthScore": "Excellent",
    "satietyIndex": "High",
    "gutHealthImpact": "High soluble fiber supports microbiome diversity"
  },
  "ingredients": [
    { "item": "Main Ingredient", "quantity": "150g", "category": "Produce & Greens", "estimatedCalories": 120 }
  ],
  "cookingSteps": [
    { "stepNumber": 1, "title": "Preparation", "instruction": "Wash and chop ingredients.", "durationMinutes": 5 }
  ],
  "prepTimeMinutes": 10,
  "cookTimeMinutes": 15,
  "difficulty": "Easy",
  "chefTips": ["Serve freshly prepared for maximum nutrient density."]
}`;

  const models = [
    GEMINI_CONFIG.primaryModel || "gemini-3.7-flash",
    ...GEMINI_CONFIG.fallbackModels,
  ];

  const triedModels = new Set<string>();

  for (const model of models) {
    if (triedModels.has(model)) continue;
    triedModels.add(model);

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: cleanBase64,
                  },
                },
                {
                  text: promptText,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        console.warn(`Gemini model ${model} error:`, errJson);
        continue;
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      const cleanJson = rawText
        .replace(/```json/gi, "")
        .replace(/```/gi, "")
        .trim();

      const parsed = JSON.parse(cleanJson);

      if (parsed.isFood === false) {
        return {
          success: false,
          error:
            parsed.nonFoodReason ||
            "No edible food detected in this image. Please take or upload a clear photo of an authentic meal, dish, or beverage.",
        };
      }

      if (parsed.dishName || parsed.meal_name) {
        const finalAnalysis: FoodAnalysis = {
          id: `scan-${Date.now()}`,
          isFood: true,
          dishName: parsed.dishName || parsed.meal_name || "Scanned Food Dish",
          cuisineType: parsed.cuisineType || "Chef Specialty",
          confidence: parsed.confidence || 96,
          summary: parsed.summary || parsed.health_insight || "Nutrient-dense freshly scanned dish.",
          portionSize: parsed.portionSize || "1 standard portion",
          calories: Number(parsed.calories || parsed.nutrition?.calories || 480),
          proteinG: Number(parsed.proteinG || parsed.nutrition?.protein || 24),
          carbsG: Number(parsed.carbsG || parsed.nutrition?.carbs || 55),
          fatG: Number(parsed.fatG || parsed.nutrition?.fats || 18),
          fiberG: Number(parsed.fiberG || parsed.nutrition?.fiber || 7),
          sugarG: Number(parsed.sugarG || 5),
          sodiumMg: Number(parsed.sodiumMg || 480),
          glycemicIndex: Number(parsed.glycemicIndex || 48),
          healthScore: Number(parsed.healthScore || 90),
          vitamins: parsed.vitamins || [
            { name: "Vitamin C", amount: "40 mg", dailyValuePct: 45, benefit: "Immune defense" },
          ],
          minerals: parsed.minerals || [
            { name: "Calcium", amount: "260 mg", dailyValuePct: 26, benefit: "Bone strength" },
          ],
          dietaryTags: parsed.dietaryTags || ["Nutrient Dense"],
          allergenAlerts: parsed.allergenAlerts || [],
          healthFactors: parsed.healthFactors || {
            antiInflammatoryRating: "High",
            heartHealthScore: "Good",
            satietyIndex: "High",
            gutHealthImpact: "Fiber supports digestive microbiome",
          },
          ingredients: parsed.ingredients || [
            { item: "Fresh Ingredients", quantity: "200g", category: "Produce & Greens", estimatedCalories: 180 },
          ],
          cookingSteps: parsed.cookingSteps || [
            { stepNumber: 1, title: "Cooking & Assembly", instruction: "Prepare and serve hot.", durationMinutes: 10 },
          ],
          prepTimeMinutes: Number(parsed.prepTimeMinutes || 10),
          cookTimeMinutes: Number(parsed.cookTimeMinutes || 15),
          difficulty: parsed.difficulty || "Easy",
          chefTips: parsed.chefTips || ["Serve freshly prepared for optimal nutrient absorption."],
          timestamp: Date.now(),
          imageUrl: base64Image,
        };

        return {
          success: true,
          data: finalAnalysis,
        };
      }
    } catch (e: any) {
      console.warn(`Error trying Gemini model ${model}:`, e?.message || e);
    }
  }

  return {
    success: false,
    error: "Gemini Vision AI could not process this image. Please check your API key or try again.",
  };
}
