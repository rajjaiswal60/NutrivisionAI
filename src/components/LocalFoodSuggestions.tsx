import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, Flame, RefreshCw, ChefHat, Plus, Check, Utensils, Zap, BookOpen, AlertCircle, ShoppingBag } from 'lucide-react';
import { FoodAnalysis, GroceryItem, LocalFoodSuggestion, UserProfile } from '../types';
import { DEFAULT_LOCAL_SUGGESTIONS } from '../data/mockData';

interface LocalFoodSuggestionsProps {
  user: UserProfile;
  onSelectDish: (analysis: FoodAnalysis) => void;
  onAddToGrocery: (items: GroceryItem[]) => void;
  onLogMeal?: (analysis: FoodAnalysis, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack', portion: number) => void;
  onOpenLocationModal: () => void;
}

export const LocalFoodSuggestions: React.FC<LocalFoodSuggestionsProps> = ({
  user,
  onSelectDish,
  onAddToGrocery,
  onLogMeal,
  onOpenLocationModal,
}) => {
  const [suggestions, setSuggestions] = useState<LocalFoodSuggestion[]>([]);
  const [locationInfo, setLocationInfo] = useState<{
    city: string;
    state: string;
    country: string;
    cuisineHeritage: string;
    climateNutritionTip: string;
  }>({
    city: user.city || 'Mumbai',
    state: user.state || 'Maharashtra',
    country: user.country || 'India',
    cuisineHeritage: `${user.city || 'Mumbai'}, ${user.state || 'Maharashtra'} Culinary Heritage`,
    climateNutritionTip: `Traditional preparations in ${user.city || 'Mumbai'} incorporate indigenous herbs and seasonal produce for optimal gut digestion and energy.`,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [addedGroceryIds, setAddedGroceryIds] = useState<Record<string, boolean>>({});
  const [loggedMealIds, setLoggedMealIds] = useState<Record<string, boolean>>({});

  // Fetch local food suggestions when user city/state/country or dietary goal changes
  const fetchSuggestions = async () => {
    setIsLoading(true);
    setError(null);

    const city = user.city || 'Mumbai';
    const state = user.state || 'Maharashtra';
    const country = user.country || 'India';

    try {
      const res = await fetch('/api/local-food-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user.geminiApiKey ? { 'x-gemini-api-key': user.geminiApiKey } : {}),
          'x-gemini-model': user.selectedModel || 'gemini-3.6-flash',
        },
        body: JSON.stringify({
          city,
          state,
          country,
          dietaryGoal: user.dietaryGoal,
          dietaryPreference: user.dietaryPreference,
          calorieTarget: user.dailyCalorieTarget,
          allergies: user.allergies,
          apiKey: user.geminiApiKey,
          model: user.selectedModel || 'gemini-3.6-flash',
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setSuggestions(json.data.suggestions || []);
        if (json.data.locationInfo) {
          setLocationInfo(json.data.locationInfo);
        }
      } else {
        throw new Error(json.error || 'Failed to load local food suggestions');
      }
    } catch (err: any) {
      console.warn('Using fallback local food suggestions:', err);
      // Use preset fallback matching city or default
      const fallbackList = DEFAULT_LOCAL_SUGGESTIONS[city] || DEFAULT_LOCAL_SUGGESTIONS['Mumbai'] || [];
      setSuggestions(fallbackList);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [user.city, user.state, user.country, user.dietaryGoal, user.dietaryPreference]);

  // Convert LocalFoodSuggestion to full FoodAnalysis for scanning/cooking view
  const handleViewDishRecipe = (sug: LocalFoodSuggestion) => {
    const analysis: FoodAnalysis = {
      id: sug.id,
      dishName: sug.dishName,
      cuisineType: sug.cuisine,
      confidence: 0.98,
      summary: sug.summary,
      portionSize: '1 authentic serving',
      calories: sug.calories,
      proteinG: sug.proteinG,
      carbsG: sug.carbsG,
      fatG: sug.fatG,
      fiberG: sug.fiberG || 6,
      sugarG: 3,
      sodiumMg: 380,
      glycemicIndex: 42,
      healthScore: sug.healthScore,
      vitamins: [
        { name: 'Vitamin C', amount: '28 mg', dailyValuePct: 35, benefit: 'Antioxidant & immune defense' },
        { name: 'Vitamin B6', amount: '0.8 mg', dailyValuePct: 47, benefit: 'Protein metabolism & energy synthesis' },
        { name: 'Vitamin A', amount: '320 mcg', dailyValuePct: 36, benefit: 'Eye and cellular mucosal health' },
      ],
      minerals: [
        { name: 'Iron', amount: '3.8 mg', dailyValuePct: 21, benefit: 'Hemoglobin oxygenation in muscle tissues' },
        { name: 'Potassium', amount: '640 mg', dailyValuePct: 18, benefit: 'Fluid balance and cardiovascular tone' },
        { name: 'Magnesium', amount: '85 mg', dailyValuePct: 21, benefit: 'Enzymatic activation and muscle repair' },
      ],
      dietaryTags: sug.dietaryTags || ['High Protein', 'Locally Sourced'],
      allergenAlerts: [],
      healthFactors: {
        antiInflammatoryRating: 'High',
        heartHealthScore: 'Excellent',
        satietyIndex: 'High',
        gutHealthImpact: sug.healthBenefit || 'Contains traditional bioactive polyphenols and prebiotics.',
      },
      ingredients: (sug.ingredients && sug.ingredients.length > 0)
        ? sug.ingredients.map(i => ({ item: i.item, quantity: i.quantity, category: i.category || 'Local Produce', estimatedCalories: i.estimatedCalories || 80 }))
        : (sug.keyLocalIngredients || []).map(item => ({ item, quantity: '1 standard portion', category: 'Local Spices & Produce', estimatedCalories: 60 })),
      cookingSteps: (sug.cookingSteps && sug.cookingSteps.length > 0)
        ? sug.cookingSteps
        : [
            { stepNumber: 1, title: 'Prep Native Aromatics', instruction: `Assemble fresh local spices and aromatics native to ${user.city}. Wash and dice produce.` },
            { stepNumber: 2, title: 'Cook Traditional Base', instruction: 'Gently heat cold-pressed oil and temper local whole spices until aromatic.' },
            { stepNumber: 3, title: 'Simmer & Season', instruction: 'Simmer protein and vegetables with seasoning until tender and flavors meld.' },
            { stepNumber: 4, title: 'Fresh Garnish & Serve', instruction: 'Garnish with freshly chopped local herbs and serve hot.' },
          ],
      prepTimeMinutes: 12,
      cookTimeMinutes: 20,
      difficulty: 'Medium',
      chefTips: [
        `Use authentic ${user.state || user.country} cold-pressed oils for traditional aromatics.`,
        sug.healthBenefit || 'Enjoy immediately after preparation to preserve heat-sensitive antioxidants.',
      ],
      timestamp: Date.now(),
      imageUrl: sug.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    };

    onSelectDish(analysis);
  };

  // Add dish ingredients to grocery list
  const handleAddDishToGrocery = (sug: LocalFoodSuggestion) => {
    const items: GroceryItem[] = (sug.ingredients && sug.ingredients.length > 0)
      ? sug.ingredients.map((ing, idx) => ({
          id: `loc-groc-${sug.id}-${idx}`,
          name: ing.item,
          quantity: ing.quantity,
          category: (ing.category as any) || 'Produce & Greens',
          checked: false,
          sourceDish: sug.dishName,
        }))
      : (sug.keyLocalIngredients || []).map((item, idx) => ({
          id: `loc-groc-${sug.id}-${idx}`,
          name: item,
          quantity: '1 pack / bunch',
          category: 'Produce & Greens',
          checked: false,
          sourceDish: sug.dishName,
        }));

    onAddToGrocery(items);
    setAddedGroceryIds((prev) => ({ ...prev, [sug.id]: true }));
    setTimeout(() => {
      setAddedGroceryIds((prev) => ({ ...prev, [sug.id]: false }));
    }, 2500);
  };

  // Log to food diary
  const handleQuickLog = (sug: LocalFoodSuggestion) => {
    if (!onLogMeal) return;
    const analysis: FoodAnalysis = {
      id: sug.id,
      dishName: sug.dishName,
      cuisineType: sug.cuisine,
      confidence: 0.98,
      summary: sug.summary,
      portionSize: '1 serving',
      calories: sug.calories,
      proteinG: sug.proteinG,
      carbsG: sug.carbsG,
      fatG: sug.fatG,
      fiberG: sug.fiberG || 6,
      sugarG: 3,
      sodiumMg: 380,
      glycemicIndex: 40,
      healthScore: sug.healthScore,
      vitamins: [],
      minerals: [],
      dietaryTags: sug.dietaryTags,
      allergenAlerts: [],
      healthFactors: {
        antiInflammatoryRating: 'High',
        heartHealthScore: 'Good',
        satietyIndex: 'High',
        gutHealthImpact: 'Rich in traditional spices and fiber.',
      },
      ingredients: [],
      cookingSteps: [],
      prepTimeMinutes: 10,
      cookTimeMinutes: 15,
      difficulty: 'Easy',
      chefTips: [],
      timestamp: Date.now(),
    };

    const mealTypeMap: Record<string, 'breakfast' | 'lunch' | 'dinner' | 'snack'> = {
      'Breakfast': 'breakfast',
      'Lunch': 'lunch',
      'Dinner': 'dinner',
      'Snack': 'snack',
      'Street Delicacy': 'snack',
    };

    onLogMeal(analysis, mealTypeMap[sug.mealType] || 'lunch', 1);
    setLoggedMealIds((prev) => ({ ...prev, [sug.id]: true }));
    setTimeout(() => {
      setLoggedMealIds((prev) => ({ ...prev, [sug.id]: false }));
    }, 2500);
  };

  const filterOptions = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Street Delicacy', 'Snack'];
  const filteredSuggestions = selectedFilter === 'All'
    ? suggestions
    : suggestions.filter((s) => s.mealType.toLowerCase() === selectedFilter.toLowerCase());

  return (
    <div className="space-y-6 pt-6">
      
      {/* Section Header with Location Pill & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#111111] border border-[#222222]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#161616] border border-[#262626] text-[10px] font-black uppercase tracking-wider text-[#D4FF44]">
              <Sparkles className="w-3 h-3" /> Hyper-Local AI Culinary Engine
            </span>
            <span className="text-[10px] font-black uppercase text-[#888888]">
              Target: {user.dailyCalorieTarget} kcal • {user.dietaryGoal.replace('_', ' ')}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#F5F5F5] font-display uppercase tracking-tight flex items-center gap-2">
            <span>Authentic Food Suggestions in</span>
            <span className="text-[#D4FF44]">{user.city || 'Mumbai'}, {user.state || 'Maharashtra'}</span>
          </h2>
          <p className="text-xs text-[#888888] mt-0.5 font-medium">
            AI-curated regional recipes, nutrition macros, and local street classics tailored to your location in {user.country || 'India'}.
          </p>
        </div>

        {/* Location Switcher & Refresh Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenLocationModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#161616] hover:bg-[#222222] border border-[#262626] text-xs font-black uppercase tracking-wider text-[#F5F5F5] transition-all hover:border-[#D4FF44]/60"
            title="Change City, State, or Country"
          >
            <MapPin className="w-3.5 h-3.5 text-[#D4FF44]" />
            <span>{user.city || 'Mumbai'}, {user.country || 'India'}</span>
          </button>

          <button
            onClick={fetchSuggestions}
            disabled={isLoading}
            className="p-2.5 rounded-2xl bg-[#161616] hover:bg-[#222222] border border-[#262626] text-[#D4FF44] transition-all hover:border-[#D4FF44] disabled:opacity-40"
            title="Refresh local suggestions"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Regional Climate & Nutrition Insight Banner */}
      {locationInfo.climateNutritionTip && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#161616] border border-[#262626]">
          <div className="w-8 h-8 rounded-xl bg-[#D4FF44]/10 border border-[#D4FF44]/30 flex items-center justify-center shrink-0 text-[#D4FF44] mt-0.5">
            <ChefHat className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-black text-[#D4FF44] uppercase tracking-widest">
              {locationInfo.cuisineHeritage}
            </div>
            <p className="text-xs text-[#F5F5F5] font-medium leading-relaxed mt-0.5">
              {locationInfo.climateNutritionTip}
            </p>
          </div>
        </div>
      )}

      {/* Meal Type Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {filterOptions.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              selectedFilter === filter
                ? 'bg-[#D4FF44] text-[#0A0A0A] shadow-[0_0_12px_rgba(212,255,68,0.3)]'
                : 'bg-[#111111] text-[#888888] border border-[#222222] hover:text-[#F5F5F5] hover:border-[#333333]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="p-5 rounded-3xl bg-[#111111] border border-[#222222] animate-pulse space-y-3">
              <div className="h-4 bg-[#222222] rounded w-3/4"></div>
              <div className="h-3 bg-[#222222] rounded w-1/2"></div>
              <div className="h-16 bg-[#161616] rounded-2xl"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-[#222222] rounded-xl flex-1"></div>
                <div className="h-8 bg-[#222222] rounded-xl w-24"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredSuggestions.length === 0 ? (
        <div className="p-8 text-center rounded-3xl bg-[#111111] border border-[#222222] space-y-3">
          <AlertCircle className="w-8 h-8 text-[#888888] mx-auto" />
          <p className="text-sm font-bold text-[#F5F5F5]">No dishes found for "{selectedFilter}" in {user.city}.</p>
          <button
            onClick={() => setSelectedFilter('All')}
            className="px-4 py-2 rounded-xl bg-[#D4FF44] text-[#0A0A0A] text-xs font-black uppercase"
          >
            Show All Dishes
          </button>
        </div>
      ) : (
        /* Dishes Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSuggestions.map((dish) => {
            const isGroceryAdded = addedGroceryIds[dish.id];
            const isLogged = loggedMealIds[dish.id];

            return (
              <div
                key={dish.id}
                className="group flex flex-col justify-between p-5 rounded-3xl bg-[#111111] hover:bg-[#161616] border border-[#222222] hover:border-[#D4FF44]/60 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(212,255,68,0.1)]"
              >
                <div>
                  {/* Top Tags & Meal Type */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#161616] border border-[#262626] text-[9px] font-black uppercase tracking-wider text-[#D4FF44]">
                      {dish.mealType}
                    </span>
                    <span className="text-[10px] font-bold text-[#888888] truncate max-w-[180px]">
                      📍 {dish.city}, {dish.state}
                    </span>
                  </div>

                  {/* Dish Title & Native Script */}
                  <div className="mb-2">
                    <h3 className="text-base font-black text-[#F5F5F5] group-hover:text-[#D4FF44] transition-colors leading-snug">
                      {dish.dishName}
                    </h3>
                    {dish.localName && (
                      <div className="text-xs text-[#888888] font-medium italic mt-0.5">
                        {dish.localName}
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-[#A3A3A3] font-medium leading-relaxed mb-3.5">
                    {dish.summary}
                  </p>

                  {/* Nutrition Stat Pills */}
                  <div className="grid grid-cols-4 gap-1.5 p-2.5 rounded-2xl bg-[#0A0A0A] border border-[#222222] mb-3.5 text-center">
                    <div>
                      <div className="text-[9px] text-[#888888] uppercase font-bold">Calories</div>
                      <div className="text-xs font-black text-[#D4FF44]">{dish.calories}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-[#888888] uppercase font-bold">Protein</div>
                      <div className="text-xs font-black text-[#F5F5F5]">{dish.proteinG}g</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-[#888888] uppercase font-bold">Carbs</div>
                      <div className="text-xs font-black text-[#888888]">{dish.carbsG}g</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-[#888888] uppercase font-bold">Fat</div>
                      <div className="text-xs font-black text-[#888888]">{dish.fatG}g</div>
                    </div>
                  </div>

                  {/* Key Local Ingredients */}
                  {dish.keyLocalIngredients && dish.keyLocalIngredients.length > 0 && (
                    <div className="mb-3">
                      <div className="text-[9px] font-black uppercase tracking-wider text-[#666666] mb-1.5">
                        Key Local Ingredients
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {dish.keyLocalIngredients.slice(0, 4).map((ing, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-lg bg-[#161616] text-[10px] text-[#CCCCCC] border border-[#262626] font-medium"
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Health Benefit Insight */}
                  {dish.healthBenefit && (
                    <div className="p-2.5 rounded-xl bg-[#D4FF44]/5 border border-[#D4FF44]/20 text-[11px] text-[#D4FF44] mb-4 leading-relaxed font-medium">
                      💡 {dish.healthBenefit}
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="flex items-center gap-2 pt-3 border-t border-[#222222]">
                  {/* View Full Recipe / Cook */}
                  <button
                    onClick={() => handleViewDishRecipe(dish)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#D4FF44] hover:bg-[#C0F030] text-[#0A0A0A] text-xs font-black uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95 shadow-md shadow-[#D4FF44]/15"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>View Recipe & Steps</span>
                  </button>

                  {/* Add Ingredients to Grocery */}
                  <button
                    onClick={() => handleAddDishToGrocery(dish)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-xl border text-xs font-black uppercase tracking-wider transition-all ${
                      isGroceryAdded
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                        : 'bg-[#161616] hover:bg-[#222222] border-[#262626] text-[#F5F5F5] hover:border-[#333333]'
                    }`}
                    title="Add ingredients to Grocery List"
                  >
                    {isGroceryAdded ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ShoppingBag className="w-3.5 h-3.5 text-[#D4FF44]" />}
                    <span className="hidden sm:inline">{isGroceryAdded ? 'Added' : 'Grocery'}</span>
                  </button>

                  {/* Log in Diary */}
                  {onLogMeal && (
                    <button
                      onClick={() => handleQuickLog(dish)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-xl border text-xs font-black uppercase tracking-wider transition-all ${
                        isLogged
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                          : 'bg-[#161616] hover:bg-[#222222] border-[#262626] text-[#F5F5F5] hover:border-[#333333]'
                      }`}
                      title="Log meal to Food Diary"
                    >
                      {isLogged ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Utensils className="w-3.5 h-3.5 text-[#D4FF44]" />}
                      <span className="hidden sm:inline">{isLogged ? 'Logged' : 'Log'}</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
