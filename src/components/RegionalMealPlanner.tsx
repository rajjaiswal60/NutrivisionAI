import React, { useState, useEffect } from 'react';
import { 
  Calendar, Globe, Sparkles, RefreshCw, ShoppingBag, 
  ChevronRight, ChefHat, Flame, Clock, Check, ArrowRight,
  Info, MapPin, SlidersHorizontal, BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DayPlan, GroceryItem, MealItem, UserProfile, WeeklyMealPlan } from '../types';
import { REGIONS_LIST } from '../data/mockData';

interface RegionalMealPlannerProps {
  user: UserProfile;
  mealPlan: WeeklyMealPlan | null;
  onUpdateMealPlan: (plan: WeeklyMealPlan) => void;
  onExportToGrocery: (items: GroceryItem[]) => void;
  onSelectMealForDetail?: (meal: MealItem) => void;
}

export const RegionalMealPlanner: React.FC<RegionalMealPlannerProps> = ({
  user,
  mealPlan,
  onUpdateMealPlan,
  onExportToGrocery,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>(user.regionPreference || 'Mediterranean');
  const [selectedGoal, setSelectedGoal] = useState<string>(user.dietaryGoal || 'weight_loss');
  const [calorieTarget, setCalorieTarget] = useState<number>(user.dailyCalorieTarget || 2000);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeMealDetail, setActiveMealDetail] = useState<MealItem | null>(null);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  // Generate AI meal plan if empty or on user request
  const generatePlan = async (region = selectedRegion, goal = selectedGoal, cals = calorieTarget) => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-meal-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user.geminiApiKey ? { 'x-gemini-api-key': user.geminiApiKey } : {}),
          'x-gemini-model': user.selectedModel || 'gemini-3.6-flash',
        },
        body: JSON.stringify({
          region,
          city: user.city || 'Mumbai',
          state: user.state || 'Maharashtra',
          country: user.country || 'India',
          dietaryGoal: goal,
          dietaryPreference: user.dietaryPreference,
          calorieTarget: cals,
          allergies: user.allergies,
          apiKey: user.geminiApiKey,
          model: user.selectedModel || 'gemini-3.6-flash',
        }),
      });
      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data && data.success && data.data) {
          onUpdateMealPlan(data.data);
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
          return;
        }
      }
      // Static hosting fallback
      const fallback = createFallbackPlan(region, goal, cals);
      onUpdateMealPlan(fallback);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    } catch (err) {
      console.warn('Using client meal plan generation for static hosting:', err);
      const fallback = createFallbackPlan(region, goal, cals);
      onUpdateMealPlan(fallback);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    } finally {
      setIsGenerating(false);
    }
  };

  const createFallbackPlan = (regionName: string, goalName: string, targetCals: number): WeeklyMealPlan => {
    const daysList: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'> = [
      'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
    ];

    const days: DayPlan[] = daysList.map((dayName, idx) => ({
      dayName,
      dailyTotalCalories: targetCals,
      dailyMacros: {
        proteinG: Math.round((targetCals * 0.28) / 4),
        carbsG: Math.round((targetCals * 0.45) / 4),
        fatG: Math.round((targetCals * 0.27) / 9),
      },
      hydrationGoalLiters: 3.2,
      meals: {
        breakfast: {
          id: `bf-${idx}`,
          name: `${regionName} Energizing Morning Bowl`,
          cuisine: regionName,
          calories: Math.round(targetCals * 0.25),
          proteinG: Math.round((targetCals * 0.25 * 0.25) / 4),
          carbsG: Math.round((targetCals * 0.25 * 0.5) / 4),
          fatG: Math.round((targetCals * 0.25 * 0.25) / 9),
          prepTimeMin: 12,
          description: `Freshly prepared ${regionName} breakfast rich in complex carbohydrates and lean bioavailable protein.`,
          ingredients: ['Whole Oats / Sprouted Grains (80g)', 'Almond Milk (200ml)', 'Chia & Flax Seeds (15g)', 'Fresh Berries & Honey (50g)'],
          cookingBrief: ['Combine oats and milk in a pot.', 'Simmer on low for 6 minutes.', 'Top with superfood seeds and fresh seasonal berries.'],
          tags: ['High Fiber', 'Sustained Energy', 'Heart Healthy'],
        },
        lunch: {
          id: `lu-${idx}`,
          name: `${regionName} High-Protein Harvest Platter`,
          cuisine: regionName,
          calories: Math.round(targetCals * 0.38),
          proteinG: Math.round((targetCals * 0.38 * 0.32) / 4),
          carbsG: Math.round((targetCals * 0.38 * 0.42) / 4),
          fatG: Math.round((targetCals * 0.38 * 0.26) / 9),
          prepTimeMin: 20,
          description: `Nutrient-dense lunch featuring lean proteins, steamed legumes, and crisp antioxidant-rich greens.`,
          ingredients: ['Grilled Protein / Paneer / Tofu (180g)', 'Quinoa / Brown Basmati (100g)', 'Steamed Broccoli & Bell Peppers (120g)', 'Extra Virgin Olive Oil (1 tbsp)'],
          cookingBrief: ['Season and grill protein until tender and lightly charred.', 'Steam seasonal vegetables with garlic and sea salt.', 'Assemble bowl and drizzle with cold-pressed oil.'],
          tags: ['High Protein', 'Rich in Vitamins', 'Anti-Inflammatory'],
        },
        dinner: {
          id: `di-${idx}`,
          name: `${regionName} Restorative Evening Feast`,
          cuisine: regionName,
          calories: Math.round(targetCals * 0.25),
          proteinG: Math.round((targetCals * 0.25 * 0.3) / 4),
          carbsG: Math.round((targetCals * 0.25 * 0.4) / 4),
          fatG: Math.round((targetCals * 0.25 * 0.3) / 9),
          prepTimeMin: 18,
          description: `Light, easy-to-digest evening dish designed to promote deep sleep recovery and cellular repair.`,
          ingredients: ['Lentil / Bone Broth Soup (250ml)', 'Steamed Leafy Greens (100g)', 'Roasted Sweet Potatoes (80g)', 'Fresh Herbs & Lemon (15g)'],
          cookingBrief: ['Simmer aromatic broth with ginger and turmeric.', 'Add leafy greens and cooked sweet potato cubes.', 'Serve warm with freshly squeezed citrus.'],
          tags: ['Easy Digestion', 'Sleep Recovery', 'Low Glycemic'],
        },
        snack: {
          id: `sn-${idx}`,
          name: `Vitality Micronutrient Snack`,
          cuisine: regionName,
          calories: Math.round(targetCals * 0.12),
          proteinG: Math.round((targetCals * 0.12 * 0.2) / 4),
          carbsG: Math.round((targetCals * 0.12 * 0.4) / 4),
          fatG: Math.round((targetCals * 0.12 * 0.4) / 9),
          prepTimeMin: 5,
          description: `Wholesome mid-day fuel with essential fatty acids and minerals.`,
          ingredients: ['Roasted Almonds & Walnuts (25g)', 'Greek Yogurt / Seed Butter (40g)'],
          cookingBrief: ['Portion raw nuts and enjoy with rich protein yogurt.'],
          tags: ['Omega-3', 'Brain Fuel', 'Keto Friendly'],
        },
      },
    }));

    return {
      weekId: `week-${Date.now()}`,
      generatedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      region: regionName,
      dietGoal: goalName,
      targetDailyCalories: targetCals,
      days,
      regionInsight: `This customized weekly plan draws upon authentic ${regionName} dietary wisdom—balancing anti-inflammatory herbs, cold-pressed healthy fats, and high-bioavailability proteins tailored to ${goalName.replace('_', ' ')}.`,
    };
  };

  // Initial load if plan is null
  useEffect(() => {
    if (!mealPlan) {
      generatePlan(selectedRegion, selectedGoal, calorieTarget);
    }
  }, []);

  // Auto-detect current geolocation region
  const handleDetectLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          let detected = 'Mediterranean';
          
          if (lat >= 8 && lat <= 35 && lng >= 68 && lng <= 97) {
            detected = 'South Asian';
          } else if (lat >= 15 && lat <= 50 && lng >= 100 && lng <= 145) {
            detected = 'East Asian';
          } else if (lat <= 30 && lat >= -55 && lng <= -35 && lng >= -115) {
            detected = 'Latin American';
          } else if (lat >= 55 && lng >= 5 && lng <= 30) {
            detected = 'Nordic';
          } else if (lat >= 25 && lat <= 49 && lng <= -65 && lng >= -125) {
            detected = 'North American Clean';
          } else if (lat >= 15 && lat <= 40 && lng >= 30 && lng <= 65) {
            detected = 'Middle Eastern';
          }

          setSelectedRegion(detected);
          generatePlan(detected, selectedGoal, calorieTarget);
        },
        () => {
          generatePlan(selectedRegion, selectedGoal, calorieTarget);
        }
      );
    }
  };

  // Export all ingredients across all 7 days to grocery list
  const handleExportAllToGrocery = () => {
    if (!mealPlan || !mealPlan.days) return;

    const allGroceryItems: GroceryItem[] = [];
    mealPlan.days.forEach((day) => {
      Object.entries(day.meals).forEach(([mealType, meal]: [string, any]) => {
        if (meal && meal.ingredients) {
          meal.ingredients.forEach((ingStr: string, idx: number) => {
            let cat: GroceryItem['category'] = 'Produce & Greens';
            const lower = ingStr.toLowerCase();
            if (lower.includes('salmon') || lower.includes('chicken') || lower.includes('beef') || lower.includes('tofu') || lower.includes('tuna') || lower.includes('shrimp') || lower.includes('egg')) {
              cat = 'Proteins & Meat';
            } else if (lower.includes('yogurt') || lower.includes('milk') || lower.includes('feta') || lower.includes('cheese')) {
              cat = 'Dairy & Plant Milk';
            } else if (lower.includes('quinoa') || lower.includes('rice') || lower.includes('oat') || lower.includes('bread') || lower.includes('couscous')) {
              cat = 'Grains & Pasta';
            } else if (lower.includes('oil') || lower.includes('avocado') || lower.includes('butter') || lower.includes('seed') || lower.includes('walnut') || lower.includes('almond')) {
              cat = 'Healthy Fats & Oils';
            } else {
              cat = 'Pantry & Spices';
            }

            allGroceryItems.push({
              id: `week-ing-${day.dayName}-${mealType}-${idx}-${Date.now()}`,
              name: ingStr,
              quantity: 'As needed',
              category: cat,
              checked: false,
              sourceDish: `${meal.name} (${day.dayName})`,
            });
          });
        }
      });
    });

    onExportToGrocery(allGroceryItems);
    setExportMessage(`Exported ${allGroceryItems.length} ingredients to your Smart Grocery List!`);
    confetti({ particleCount: 65, spread: 70, origin: { y: 0.7 } });
    setTimeout(() => setExportMessage(null), 4000);
  };

  const currentDayPlan: DayPlan | undefined = mealPlan?.days?.[selectedDayIndex];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header & Regional Selector Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#161616] border border-[#262626] text-[#D4FF44] text-[10px] font-black uppercase tracking-widest mb-2">
            <Globe className="w-3.5 h-3.5" />
            <span>AI Regional Cuisine & Nutritional Meal Planner</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#F5F5F5] font-display uppercase tracking-tight">
            Personalized <span className="text-[#D4FF44]">Weekly Meal Plan</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#888888] mt-1 font-medium">
            Tailored to your {selectedRegion} regional taste, {calorieTarget} kcal target, and {selectedGoal.replace('_', ' ')} goal.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDetectLocation}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#111111] hover:bg-[#1A1A1A] text-[#F5F5F5] border border-[#222222] text-xs font-black uppercase tracking-wider transition-all hover:border-[#333333]"
            title="Auto-Detect Region from GPS"
          >
            <MapPin className="w-4 h-4 text-[#D4FF44]" />
            <span>Detect Region</span>
          </button>

          <button
            onClick={() => generatePlan(selectedRegion, selectedGoal, calorieTarget)}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#D4FF44] hover:bg-[#C0F030] text-[#0A0A0A] font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(212,255,68,0.25)] transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating AI Plan...' : 'Regenerate Plan'}</span>
          </button>
        </div>
      </div>

      {/* Export notification banner */}
      {exportMessage && (
        <div className="p-4 rounded-2xl bg-[#161616] border border-[#D4FF44]/40 text-[#D4FF44] text-xs font-bold flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#D4FF44]" />
            <span>{exportMessage}</span>
          </div>
          <span className="text-[11px] font-black text-[#D4FF44] uppercase tracking-wider underline cursor-pointer">
            View Smart Grocery Tab
          </span>
        </div>
      )}

      {/* Region & Goal Customization Bar */}
      <div className="bg-[#111111] border border-[#222222] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#222222] pb-3">
          <div className="text-[10px] font-black text-[#888888] uppercase tracking-[0.2em] flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#D4FF44]" />
            <span>Regional Cuisine & Nutritional Parameters</span>
          </div>
          <span className="text-xs text-[#D4FF44] font-black uppercase tracking-wider">
            {calorieTarget} kcal / Day Target
          </span>
        </div>

        {/* Region Pills Horizontal Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {REGIONS_LIST.map((reg) => {
            const isSelected = selectedRegion === reg.id;
            return (
              <button
                key={reg.id}
                onClick={() => {
                  setSelectedRegion(reg.id);
                  generatePlan(reg.id, selectedGoal, calorieTarget);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#D4FF44] text-[#0A0A0A] shadow-md'
                    : 'bg-[#161616] hover:bg-[#222222] text-[#888888] hover:text-[#F5F5F5] border border-[#262626]'
                }`}
              >
                <span>{reg.icon}</span>
                <span>{reg.name.split(' (')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Region Health Insight */}
        {mealPlan?.regionInsight && (
          <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-[#222222] text-xs text-[#A3A3A3] flex items-start gap-3">
            <Info className="w-4 h-4 text-[#D4FF44] shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">
              <strong className="text-[#D4FF44] font-black uppercase tracking-wider">Regional Insight:</strong> {mealPlan.regionInsight}
            </span>
          </div>
        )}
      </div>

      {/* 7-Day Interactive Day Selector Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-none">
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, idx) => {
          const isSelected = selectedDayIndex === idx;
          const dayData = mealPlan?.days?.[idx];
          return (
            <button
              key={day}
              onClick={() => setSelectedDayIndex(idx)}
              className={`flex-1 min-w-[110px] p-3 rounded-2xl border text-center transition-all ${
                isSelected
                  ? 'bg-[#161616] border-[#D4FF44] text-[#F5F5F5] shadow-lg ring-1 ring-[#D4FF44]/30'
                  : 'bg-[#111111] hover:bg-[#161616] border-[#222222] text-[#888888]'
              }`}
            >
              <div className={`text-xs font-black uppercase tracking-wider ${isSelected ? 'text-[#D4FF44]' : 'text-[#888888]'}`}>
                {day}
              </div>
              <div className="text-xs font-black text-[#F5F5F5] mt-1">
                {dayData?.dailyTotalCalories || calorieTarget} kcal
              </div>
              <div className="text-[9px] font-bold text-[#666666] uppercase mt-0.5">
                P: {dayData?.dailyMacros?.proteinG || 110}g
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Day Meals Grid (Breakfast, Lunch, Dinner, Snack) */}
      {currentDayPlan && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-black text-[#F5F5F5] font-display uppercase tracking-tight">
                {currentDayPlan.dayName}'s Curated Menu
              </h3>
              <span className="text-xs px-3 py-1 rounded-full bg-[#161616] border border-[#262626] text-[#D4FF44] font-black uppercase tracking-wider">
                {currentDayPlan.dailyTotalCalories} kcal Total
              </span>
            </div>

            <button
              onClick={handleExportAllToGrocery}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#D4FF44] hover:bg-[#C0F030] text-[#0A0A0A] font-black text-xs uppercase tracking-wider shadow-md transition-all hover:scale-105"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Export Week to Grocery List</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Breakfast Card */}
            <MealCard
              label="Breakfast"
              badgeColor="bg-[#161616] text-[#D4FF44] border-[#262626]"
              meal={currentDayPlan.meals.breakfast}
              onViewDetail={() => setActiveMealDetail(currentDayPlan.meals.breakfast)}
            />

            {/* Lunch Card */}
            <MealCard
              label="Lunch"
              badgeColor="bg-[#161616] text-[#F5F5F5] border-[#262626]"
              meal={currentDayPlan.meals.lunch}
              onViewDetail={() => setActiveMealDetail(currentDayPlan.meals.lunch)}
            />

            {/* Dinner Card */}
            <MealCard
              label="Dinner"
              badgeColor="bg-[#161616] text-[#D4FF44] border-[#262626]"
              meal={currentDayPlan.meals.dinner}
              onViewDetail={() => setActiveMealDetail(currentDayPlan.meals.dinner)}
            />

            {/* Snack Card */}
            <MealCard
              label="Nutritional Snack"
              badgeColor="bg-[#161616] text-[#888888] border-[#262626]"
              meal={currentDayPlan.meals.snack}
              onViewDetail={() => setActiveMealDetail(currentDayPlan.meals.snack)}
            />

          </div>
        </div>
      )}

      {/* Modal: Quick Recipe & Ingredients Preview for a selected meal */}
      {activeMealDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl bg-[#111111] border border-[#222222] rounded-3xl p-6 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#222222] pb-3">
              <div>
                <span className="text-[9px] uppercase font-black tracking-widest text-[#D4FF44]">
                  {activeMealDetail.cuisine} Cuisine
                </span>
                <h3 className="text-xl font-black text-[#F5F5F5] font-display uppercase tracking-tight mt-0.5">
                  {activeMealDetail.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveMealDetail(null)}
                className="w-8 h-8 rounded-full bg-[#161616] hover:bg-[#222222] text-[#888888] hover:text-[#F5F5F5] flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            {/* Nutrition Pill */}
            <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-2xl bg-[#0A0A0A] border border-[#222222] text-xs">
              <div>
                <div className="text-[9px] uppercase font-black text-[#888888] tracking-wider">Calories</div>
                <div className="font-black text-[#D4FF44] mt-1 text-sm">{activeMealDetail.calories} kcal</div>
              </div>
              <div>
                <div className="text-[9px] uppercase font-black text-[#888888] tracking-wider">Protein</div>
                <div className="font-black text-[#F5F5F5] mt-1 text-sm">{activeMealDetail.proteinG}g</div>
              </div>
              <div>
                <div className="text-[9px] uppercase font-black text-[#888888] tracking-wider">Carbs</div>
                <div className="font-black text-[#F5F5F5] mt-1 text-sm">{activeMealDetail.carbsG}g</div>
              </div>
              <div>
                <div className="text-[9px] uppercase font-black text-[#888888] tracking-wider">Fat</div>
                <div className="font-black text-[#F5F5F5] mt-1 text-sm">{activeMealDetail.fatG}g</div>
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <h4 className="text-[10px] font-black text-[#888888] uppercase tracking-[0.2em] mb-2.5">
                Ingredients Required
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#F5F5F5]">
                {(activeMealDetail.ingredients || []).map((ing, i) => (
                  <li key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0A0A0A] border border-[#222222]">
                    <span className="text-[#D4FF44] font-black">•</span>
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cooking Brief */}
            <div>
              <h4 className="text-[10px] font-black text-[#888888] uppercase tracking-[0.2em] mb-2.5">
                Quick Preparation Steps
              </h4>
              <ol className="space-y-2 text-xs text-[#A3A3A3]">
                {(activeMealDetail.cookingBrief || []).map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#0A0A0A] border border-[#222222]">
                    <span className="w-5 h-5 rounded-full bg-[#D4FF44] text-[#0A0A0A] flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed font-medium">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="pt-3 border-t border-[#222222] flex justify-end">
              <button
                onClick={() => setActiveMealDetail(null)}
                className="px-6 py-2.5 rounded-2xl bg-[#D4FF44] hover:bg-[#C0F030] text-[#0A0A0A] font-black text-xs uppercase tracking-wider shadow-md"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Sub-component for each meal item
const MealCard: React.FC<{
  label: string;
  badgeColor: string;
  meal: MealItem;
  onViewDetail: () => void;
}> = ({ label, badgeColor, meal, onViewDetail }) => {
  if (!meal) return null;

  return (
    <div className="p-5 rounded-3xl bg-[#111111] border border-[#222222] hover:border-[#D4FF44]/40 transition-all flex flex-col justify-between space-y-4 group">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
            {label}
          </span>
          <span className="text-xs font-black text-[#D4FF44]">
            {meal.calories} kcal
          </span>
        </div>

        <h4 className="text-sm font-black text-[#F5F5F5] group-hover:text-[#D4FF44] transition-colors uppercase tracking-tight">
          {meal.name}
        </h4>

        <p className="text-xs text-[#888888] mt-1 line-clamp-2 leading-relaxed font-medium">
          {meal.description}
        </p>
      </div>

      <div className="pt-3 border-t border-[#222222] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase">
          <span className="text-[#D4FF44]">P: {meal.proteinG}g</span>
          <span className="text-[#444444]">•</span>
          <span className="text-[#F5F5F5]">C: {meal.carbsG}g</span>
          <span className="text-[#444444]">•</span>
          <span className="text-[#888888]">F: {meal.fatG}g</span>
        </div>

        <button
          onClick={onViewDetail}
          className="text-[#D4FF44] font-black text-[11px] uppercase tracking-wider flex items-center gap-1 hover:underline"
        >
          <span>Recipe</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
