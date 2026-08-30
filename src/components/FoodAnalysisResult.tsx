import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Flame, Sparkles, HeartPulse, ShieldAlert, Clock, ChefHat, 
  Plus, Check, Play, Pause, RotateCcw, MessageSquare, Send, CheckCircle2,
  Share2, ShoppingBag, Activity, Info, Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FoodAnalysis, Ingredient, CookingStep, GroceryItem, UserProfile } from '../types';

interface FoodAnalysisResultProps {
  analysis: FoodAnalysis;
  onBack: () => void;
  onLogMeal: (analysis: FoodAnalysis, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack', portion: number) => void;
  onAddToGrocery: (items: GroceryItem[]) => void;
  user?: UserProfile;
}

export const FoodAnalysisResult: React.FC<FoodAnalysisResultProps> = ({
  analysis,
  onBack,
  onLogMeal,
  onAddToGrocery,
  user,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'nutrition' | 'ingredients' | 'recipe' | 'ask_chef'>('nutrition');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [portionMultiplier, setPortionMultiplier] = useState<number>(1);
  const [isLogged, setIsLogged] = useState(false);
  const [groceriesAdded, setGroceriesAdded] = useState(false);
  
  // Cooking step checkboxes
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // Interactive cooking timer
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [activeTimerLabel, setActiveTimerLabel] = useState<string>('Timer');

  // AI Chef interactive chat
  const [chefQuestion, setChefQuestion] = useState('');
  const [chefChatHistory, setChefChatHistory] = useState<{ role: 'user' | 'chef'; text: string }[]>([
    {
      role: 'chef',
      text: `Hello! I'm your AI Executive Chef & Nutritionist. Ask me anything about preparing this ${analysis.dishName}, ingredient substitutions, or tailoring it to your macros!`,
    },
  ]);
  const [isAskingChef, setIsAskingChef] = useState(false);

  // Timer countdown hook
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            // Play subtle beep alert if available
            try {
              const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = ctx.createOscillator();
              osc.connect(ctx.destination);
              osc.frequency.value = 880;
              osc.start();
              osc.stop(ctx.currentTime + 0.5);
            } catch (e) {
              console.warn(e);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const startStepTimer = (minutes: number, stepTitle: string) => {
    setTimerSeconds(minutes * 60);
    setActiveTimerLabel(stepTitle);
    setIsTimerRunning(true);
    setActiveSubTab('recipe');
  };

  const handleToggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNumber) ? prev.filter((s) => s !== stepNumber) : [...prev, stepNumber]
    );
  };

  const handleLogMealClick = () => {
    onLogMeal(analysis, mealType, portionMultiplier);
    setIsLogged(true);
    confetti({ particleCount: 60, spread: 55, origin: { y: 0.8 } });
  };

  const handleAddGroceriesClick = () => {
    const newItems: GroceryItem[] = (analysis.ingredients || []).map((ing, idx) => ({
      id: `ing-${Date.now()}-${idx}`,
      name: ing.item,
      quantity: ing.quantity,
      category: (ing.category as any) || 'Produce & Greens',
      checked: false,
      sourceDish: analysis.dishName,
    }));
    onAddToGrocery(newItems);
    setGroceriesAdded(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  const handleAskChefSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chefQuestion.trim() || isAskingChef) return;

    const q = chefQuestion.trim();
    setChefQuestion('');
    setChefChatHistory((prev) => [...prev, { role: 'user', text: q }]);
    setIsAskingChef(true);

    try {
      const res = await fetch('/api/recipe-ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.geminiApiKey ? { 'x-gemini-api-key': user.geminiApiKey } : {}),
          'x-gemini-model': user?.selectedModel || 'gemini-3.6-flash',
        },
        body: JSON.stringify({
          question: q,
          currentDish: analysis.dishName,
          apiKey: user?.geminiApiKey,
          model: user?.selectedModel || 'gemini-3.6-flash',
          context: {
            cuisine: analysis.cuisineType,
            calories: analysis.calories,
            ingredients: analysis.ingredients.map((i) => i.item),
          },
        }),
      });
      const data = await res.json();
      setChefChatHistory((prev) => [
        ...prev,
        { role: 'chef', text: data.answer || 'Here is your culinary guidance.' },
      ]);
    } catch {
      setChefChatHistory((prev) => [
        ...prev,
        {
          role: 'chef',
          text: 'To modify this recipe, you can swap dairy for plant-based alternatives or reduce salt by adding more citrus zest and fresh herbs.',
        },
      ]);
    } finally {
      setIsAskingChef(false);
    }
  };

  const adjustedCalories = Math.round(analysis.calories * portionMultiplier);
  const adjustedProtein = Math.round(analysis.proteinG * portionMultiplier);
  const adjustedCarbs = Math.round(analysis.carbsG * portionMultiplier);
  const adjustedFat = Math.round(analysis.fatG * portionMultiplier);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Bar with Back button and Quick Actions */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#111111] hover:bg-[#1A1A1A] text-[#888888] hover:text-[#F5F5F5] border border-[#222222] text-xs font-black uppercase tracking-wider transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Scanner</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleAddGroceriesClick}
            disabled={groceriesAdded}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${
              groceriesAdded
                ? 'bg-[#D4FF44]/20 text-[#D4FF44] border border-[#D4FF44]/40'
                : 'bg-[#111111] hover:bg-[#1A1A1A] text-[#F5F5F5] border border-[#222222]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#D4FF44]" />
            <span>{groceriesAdded ? 'Groceries Added ✓' : 'Add to Grocery'}</span>
          </button>

          <button
            onClick={handleLogMealClick}
            disabled={isLogged}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg transition-all ${
              isLogged
                ? 'bg-[#1A1A1A] text-[#D4FF44] border border-[#D4FF44]/50'
                : 'bg-[#D4FF44] hover:bg-[#C0F030] text-[#0A0A0A] shadow-[0_0_15px_rgba(212,255,68,0.25)] hover:scale-105 active:scale-95'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{isLogged ? 'Logged to Diary ✓' : 'Log This Meal'}</span>
          </button>
        </div>
      </div>

      {/* Main Food Summary Header Card */}
      <div className="bg-[#111111] border border-[#222222] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Column: Image & Health Score Badge */}
          <div className="lg:col-span-4 relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#161616] border border-[#262626] shadow-md">
              <img
                src={analysis.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'}
                alt={analysis.dishName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full bg-[#0A0A0A]/90 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-[#D4FF44] border border-[#222222]">
                {analysis.cuisineType} Cuisine
              </div>
            </div>

            {/* Health Score Pill */}
            <div className="mt-3 flex items-center justify-between p-3.5 rounded-2xl bg-[#0A0A0A] border border-[#222222]">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-[#D4FF44]" />
                <span className="text-xs font-black uppercase tracking-wider text-[#F5F5F5]">Health Score</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-[#222222] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D4FF44] rounded-full"
                    style={{ width: `${Math.min(100, analysis.healthScore || 85)}%` }}
                  />
                </div>
                <span className="text-xs font-black text-[#D4FF44]">
                  {analysis.healthScore || 88}<span className="text-[10px] text-[#888]">/100</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Calories, Macros, and Summary */}
          <div className="lg:col-span-8 space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#888888]">
                  Portion: {analysis.portionSize || '1 standard serving'}
                </span>
                <span className="text-[#333]">•</span>
                <span className="text-[10px] uppercase tracking-wider text-[#D4FF44] font-black flex items-center gap-1">
                  <Check className="w-3 h-3" /> Real Caloric Breakdown
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-[#F5F5F5] font-display uppercase tracking-tight">
                {analysis.dishName}
              </h1>

              <p className="text-xs sm:text-sm text-[#A3A3A3] mt-2 leading-relaxed font-medium">
                {analysis.summary}
              </p>
            </div>

            {/* Dietary Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              {(analysis.dietaryTags || []).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-[#161616] border border-[#262626] text-[#D4FF44] text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}

              {(analysis.allergenAlerts || []).map((allergen, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-rose-950/50 border border-rose-800 text-rose-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-3 h-3" />
                  Contains: {allergen}
                </span>
              ))}
            </div>

            {/* Main Calories & Macronutrient Cards - Bold Typography */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-[#222222] text-center">
                <div className="text-[9px] uppercase font-black text-[#888888] tracking-[0.2em]">Calories</div>
                <div className="text-2xl sm:text-3xl font-black text-[#D4FF44] leading-none mt-1">
                  {adjustedCalories}
                </div>
                <div className="text-[9px] uppercase font-bold text-[#666666] tracking-wider mt-0.5">kcal</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-[#222222] text-center">
                <div className="text-[9px] uppercase font-black text-[#888888] tracking-[0.2em]">Protein</div>
                <div className="text-2xl sm:text-3xl font-black text-[#F5F5F5] leading-none mt-1">
                  {adjustedProtein}g
                </div>
                <div className="text-[9px] uppercase font-bold text-[#666666] tracking-wider mt-0.5">{Math.round((adjustedProtein * 4 / adjustedCalories) * 100) || 30}% cals</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-[#222222] text-center">
                <div className="text-[9px] uppercase font-black text-[#888888] tracking-[0.2em]">Carbs</div>
                <div className="text-2xl sm:text-3xl font-black text-[#F5F5F5] leading-none mt-1">
                  {adjustedCarbs}g
                </div>
                <div className="text-[9px] uppercase font-bold text-[#666666] tracking-wider mt-0.5">{analysis.fiberG || 0}g fiber</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-[#222222] text-center">
                <div className="text-[9px] uppercase font-black text-[#888888] tracking-[0.2em]">Fats</div>
                <div className="text-2xl sm:text-3xl font-black text-[#F5F5F5] leading-none mt-1">
                  {adjustedFat}g
                </div>
                <div className="text-[9px] uppercase font-bold text-[#666666] tracking-wider mt-0.5">{analysis.sodiumMg || 0}mg Na</div>
              </div>
            </div>

            {/* Quick Portion & Meal Selector for Logging */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#222222]">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-[#888888] font-black">Portion:</span>
                {[0.5, 1, 1.5, 2].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPortionMultiplier(p)}
                    className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                      portionMultiplier === p
                        ? 'bg-[#D4FF44] text-[#0A0A0A]'
                        : 'bg-[#161616] text-[#888888] hover:text-[#F5F5F5] border border-[#262626]'
                    }`}
                  >
                    {p}x
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-[#888888] font-black">Log as:</span>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as any)}
                  className="bg-[#161616] border border-[#262626] rounded-xl px-3 py-1.5 text-xs text-[#F5F5F5] font-bold focus:outline-none focus:border-[#D4FF44] uppercase tracking-wider"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs - Bold Typography Style */}
      <div className="flex border-b border-[#222222] gap-2 sm:gap-4 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveSubTab('nutrition')}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-xs font-black uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
            activeSubTab === 'nutrition'
              ? 'border-[#D4FF44] text-[#D4FF44]'
              : 'border-transparent text-[#888888] hover:text-[#F5F5F5]'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Vitamins, Minerals & Health</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ingredients')}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-xs font-black uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
            activeSubTab === 'ingredients'
              ? 'border-[#D4FF44] text-[#D4FF44]'
              : 'border-transparent text-[#888888] hover:text-[#F5F5F5]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Ingredients Breakdown ({analysis.ingredients?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('recipe')}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-xs font-black uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
            activeSubTab === 'recipe'
              ? 'border-[#D4FF44] text-[#D4FF44]'
              : 'border-transparent text-[#888888] hover:text-[#F5F5F5]'
          }`}
        >
          <ChefHat className="w-4 h-4" />
          <span>Recipe & Timers ({analysis.cookingSteps?.length || 0} Steps)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ask_chef')}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-xs font-black uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
            activeSubTab === 'ask_chef'
              ? 'border-[#D4FF44] text-[#D4FF44]'
              : 'border-transparent text-[#888888] hover:text-[#F5F5F5]'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Ask AI Chef</span>
        </button>
      </div>

      {/* Sub-Tab 1: Nutrition & Micronutrients */}
      {activeSubTab === 'nutrition' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Health Factors Bar */}
          {analysis.healthFactors && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-5 rounded-3xl bg-[#111111] border border-[#222222] border-l-2 border-l-[#D4FF44]">
                <div className="text-[9px] uppercase font-black tracking-[0.2em] text-[#888888]">Anti-Inflammatory Index</div>
                <div className="text-lg font-black text-[#D4FF44] mt-1 flex items-center gap-1.5 uppercase">
                  <Sparkles className="w-4 h-4" /> {analysis.healthFactors.antiInflammatoryRating} Rating
                </div>
                <div className="text-xs text-[#888888] mt-1 font-medium">Rich in protective antioxidants & natural bioflavonoids.</div>
              </div>

              <div className="p-5 rounded-3xl bg-[#111111] border border-[#222222] border-l-2 border-l-[#D4FF44]">
                <div className="text-[9px] uppercase font-black tracking-[0.2em] text-[#888888]">Heart Health Impact</div>
                <div className="text-lg font-black text-[#F5F5F5] mt-1 flex items-center gap-1.5 uppercase">
                  <HeartPulse className="w-4 h-4 text-[#D4FF44]" /> {analysis.healthFactors.heartHealthScore}
                </div>
                <div className="text-xs text-[#888888] mt-1 font-medium">Favorable lipid profile with low saturated fats.</div>
              </div>

              <div className="p-5 rounded-3xl bg-[#111111] border border-[#222222] border-l-2 border-l-[#D4FF44]">
                <div className="text-[9px] uppercase font-black tracking-[0.2em] text-[#888888]">Satiety Index</div>
                <div className="text-lg font-black text-[#D4FF44] mt-1 flex items-center gap-1.5 uppercase">
                  <Flame className="w-4 h-4" /> {analysis.healthFactors.satietyIndex}
                </div>
                <div className="text-xs text-[#888888] mt-1 font-medium">{analysis.healthFactors.gutHealthImpact || 'High fullness factor.'}</div>
              </div>
            </div>
          )}

          {/* Vitamins & Minerals Two-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Vitamins Section */}
            <div className="bg-[#111111] border border-[#222222] rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#222222] pb-3">
                <h3 className="text-sm font-black text-[#F5F5F5] font-display uppercase tracking-wide flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4FF44]" />
                  <span>Vitamins Profile</span>
                </h3>
                <span className="text-[9px] text-[#888888] uppercase font-black tracking-widest">% Daily Value (DV)</span>
              </div>

              <div className="space-y-3">
                {(analysis.vitamins || []).map((vit, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-[#161616] border border-[#262626] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-black text-[#F5F5F5]">{vit.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#888888] font-bold text-xs">{vit.amount}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#D4FF44] text-[#0A0A0A] font-black text-[10px] uppercase">
                          {vit.dailyValuePct}% DV
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-[#222222] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#D4FF44] rounded-full"
                        style={{ width: `${Math.min(100, vit.dailyValuePct)}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-[#888888] font-medium">
                      💡 {vit.benefit}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Minerals Section */}
            <div className="bg-[#111111] border border-[#222222] rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#222222] pb-3">
                <h3 className="text-sm font-black text-[#F5F5F5] font-display uppercase tracking-wide flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#D4FF44]" />
                  <span>Essential Minerals</span>
                </h3>
                <span className="text-[9px] text-[#888888] uppercase font-black tracking-widest">% Daily Value (DV)</span>
              </div>

              <div className="space-y-3">
                {(analysis.minerals || []).map((min, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-[#161616] border border-[#262626] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-black text-[#F5F5F5]">{min.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#888888] font-bold text-xs">{min.amount}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#D4FF44] text-[#0A0A0A] font-black text-[10px] uppercase">
                          {min.dailyValuePct}% DV
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-[#222222] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#D4FF44] rounded-full"
                        style={{ width: `${Math.min(100, min.dailyValuePct)}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-[#888888] font-medium">
                      💡 {min.benefit}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Sub-Tab 2: Ingredients Breakdown */}
      {activeSubTab === 'ingredients' && (
        <div className="bg-[#111111] border border-[#222222] rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[9px] uppercase tracking-[0.25em] font-black text-[#888888] mb-1">Visual Recognition Breakdown</h2>
              <h3 className="text-xl font-black text-[#F5F5F5] font-display uppercase tracking-tight">
                Ingredient Attribution & Caloric Share
              </h3>
            </div>
            <button
              onClick={handleAddGroceriesClick}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#D4FF44] hover:bg-[#C0F030] text-[#0A0A0A] font-black text-xs uppercase tracking-wider shadow-md transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Export All to Grocery</span>
            </button>
          </div>

          <div className="divide-y divide-[#222222] border border-[#222222] rounded-2xl overflow-hidden bg-[#0A0A0A]">
            {(analysis.ingredients || []).map((ing, idx) => (
              <div
                key={idx}
                className="p-4 flex items-center justify-between gap-4 hover:bg-[#161616] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#161616] border border-[#262626] text-[#D4FF44] flex items-center justify-center font-black text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-sm font-black text-[#F5F5F5]">{ing.item}</div>
                    <div className="text-xs text-[#888888] flex items-center gap-2 mt-0.5 font-medium">
                      <span>Qty: {ing.quantity}</span>
                      <span>•</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#161616] border border-[#262626] text-[10px] font-bold text-[#A3A3A3] uppercase tracking-wider">
                        {ing.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-[#D4FF44]">
                    ~{ing.estimatedCalories} <span className="text-[10px] text-[#888] uppercase">kcal</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Cooking Recipe & Timers */}
      {activeSubTab === 'recipe' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Recipe Meta Info Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-5 rounded-3xl bg-[#111111] border border-[#222222] flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#161616] border border-[#262626] flex items-center justify-center text-[#D4FF44]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[9px] uppercase font-black tracking-widest text-[#888888]">Prep & Cook Time</div>
                <div className="text-sm font-black text-[#F5F5F5] mt-0.5 uppercase">
                  {analysis.prepTimeMinutes || 10}m prep • {analysis.cookTimeMinutes || 15}m cook
                </div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#111111] border border-[#222222] flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#161616] border border-[#262626] flex items-center justify-center text-[#D4FF44]">
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[9px] uppercase font-black tracking-widest text-[#888888]">Cooking Difficulty</div>
                <div className="text-sm font-black text-[#F5F5F5] mt-0.5 uppercase">{analysis.difficulty || 'Easy'}</div>
              </div>
            </div>

            {/* Active Live Timer Card */}
            <div className="p-5 rounded-3xl bg-[#111111] border border-[#D4FF44]/40 flex items-center justify-between shadow-[0_0_15px_rgba(212,255,68,0.1)]">
              <div>
                <div className="text-[9px] uppercase font-black tracking-widest text-[#D4FF44]">
                  {activeTimerLabel}
                </div>
                <div className="text-2xl font-black text-[#F5F5F5] mt-0.5 font-mono">
                  {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {timerSeconds > 0 && (
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="p-2.5 rounded-xl bg-[#D4FF44] hover:bg-[#C0F030] text-[#0A0A0A] transition-all font-black"
                  >
                    {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                )}
                {timerSeconds > 0 && (
                  <button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimerSeconds(0);
                    }}
                    className="p-2.5 rounded-xl bg-[#161616] hover:bg-[#222222] text-[#888888] transition-all border border-[#262626]"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Cooking Steps Interactive List */}
          <div className="bg-[#111111] border border-[#222222] rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-xl font-black text-[#F5F5F5] font-display uppercase tracking-tight">
              Step-by-Step Culinary Instructions
            </h3>

            <div className="space-y-4">
              {(analysis.cookingSteps || []).map((step) => {
                const isDone = completedSteps.includes(step.stepNumber);
                return (
                  <div
                    key={step.stepNumber}
                    className={`p-5 rounded-2xl border transition-all ${
                      isDone
                        ? 'bg-[#0A0A0A]/40 border-[#D4FF44]/30 opacity-70'
                        : 'bg-[#161616] border-[#262626] hover:border-[#333333]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <button
                          onClick={() => handleToggleStep(step.stepNumber)}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-all mt-0.5 ${
                            isDone
                              ? 'bg-[#D4FF44] text-[#0A0A0A]'
                              : 'bg-[#0A0A0A] border border-[#262626] text-[#888888] hover:border-[#D4FF44]'
                          }`}
                        >
                          {isDone ? <Check className="w-4 h-4" /> : step.stepNumber}
                        </button>
                        <div>
                          <h4
                            className={`text-sm font-black uppercase tracking-tight ${
                              isDone ? 'line-through text-[#666666]' : 'text-[#F5F5F5]'
                            }`}
                          >
                            {step.title}
                          </h4>
                          <p className="text-xs text-[#A3A3A3] mt-1.5 leading-relaxed font-medium">
                            {step.instruction}
                          </p>
                          {step.tips && (
                            <div className="mt-2.5 text-[11px] text-[#D4FF44] bg-[#0A0A0A] border border-[#222222] px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 font-bold">
                              <span>💡 Chef Tip:</span> {step.tips}
                            </div>
                          )}
                        </div>
                      </div>

                      {step.durationMinutes && (
                        <button
                          onClick={() => startStepTimer(step.durationMinutes!, `Step ${step.stepNumber}: ${step.title}`)}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0A0A0A] hover:bg-[#D4FF44] hover:text-[#0A0A0A] border border-[#262626] text-[#D4FF44] text-xs font-black uppercase tracking-wider shrink-0 transition-all"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>{step.durationMinutes}m Timer</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chef Pro Tips */}
            {analysis.chefTips && analysis.chefTips.length > 0 && (
              <div className="mt-6 p-5 rounded-2xl bg-[#161616] border border-[#262626] border-l-2 border-l-[#D4FF44] space-y-2">
                <div className="text-xs font-black uppercase tracking-wider text-[#D4FF44] flex items-center gap-2">
                  <ChefHat className="w-4 h-4" />
                  <span>Master Chef Secrets & Techniques</span>
                </div>
                <ul className="space-y-1.5 text-xs text-[#A3A3A3] font-medium">
                  {analysis.chefTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#D4FF44] font-black">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Ask AI Chef */}
      {activeSubTab === 'ask_chef' && (
        <div className="bg-[#111111] border border-[#222222] rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[9px] uppercase tracking-[0.25em] font-black text-[#888888] mb-1">Instant Culinary Intelligence</h2>
              <h3 className="text-xl font-black text-[#F5F5F5] font-display uppercase tracking-tight flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#D4FF44]" />
                <span>Interactive AI Executive Chef & Nutritionist</span>
              </h3>
            </div>
          </div>

          {/* Chat Bubble History */}
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {chefChatHistory.map((chat, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {chat.role === 'chef' && (
                  <div className="w-8 h-8 rounded-full bg-[#161616] text-[#D4FF44] flex items-center justify-center shrink-0 border border-[#262626]">
                    <ChefHat className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-4 rounded-2xl max-w-lg text-xs leading-relaxed ${
                    chat.role === 'user'
                      ? 'bg-[#D4FF44] text-[#0A0A0A] font-bold rounded-br-none'
                      : 'bg-[#161616] border border-[#262626] text-[#F5F5F5] rounded-bl-none font-medium'
                  }`}
                >
                  {chat.text}
                </div>
              </div>
            ))}
            {isAskingChef && (
              <div className="flex gap-3 items-center text-xs text-[#888888]">
                <div className="w-8 h-8 rounded-full bg-[#161616] flex items-center justify-center animate-pulse">
                  <ChefHat className="w-4 h-4 text-[#D4FF44]" />
                </div>
                <span className="font-bold uppercase tracking-wider text-[10px]">Chef is thinking of the best culinary solution...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleAskChefSubmit} className="flex gap-2">
            <input
              type="text"
              value={chefQuestion}
              onChange={(e) => setChefQuestion(e.target.value)}
              placeholder="e.g. Can I substitute quinoa for wild rice? How to cook this in an air fryer?"
              className="flex-1 bg-[#0A0A0A] border border-[#262626] rounded-2xl px-4 py-3.5 text-xs text-[#F5F5F5] placeholder-[#666666] focus:outline-none focus:border-[#D4FF44] font-medium"
            />
            <button
              type="submit"
              disabled={!chefQuestion.trim() || isAskingChef}
              className="px-6 py-3.5 rounded-2xl bg-[#D4FF44] hover:bg-[#C0F030] text-[#0A0A0A] font-black text-xs uppercase tracking-wider transition-all disabled:opacity-40 flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,255,68,0.2)]"
            >
              <Send className="w-4 h-4" />
              <span>Ask</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
