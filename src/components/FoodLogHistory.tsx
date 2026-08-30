import React from 'react';
import { 
  Utensils, Trash2, Flame, Clock, Calendar, 
  ArrowRight, Sparkles, ChevronRight, PlusCircle 
} from 'lucide-react';
import { DailyFoodLogEntry, FoodAnalysis, UserProfile } from '../types';

interface FoodLogHistoryProps {
  logs: DailyFoodLogEntry[];
  onRemoveLog: (id: string) => void;
  onSelectEntry: (analysis: FoodAnalysis) => void;
  onScanNewFood: () => void;
  user: UserProfile;
}

export const FoodLogHistory: React.FC<FoodLogHistoryProps> = ({
  logs,
  onRemoveLog,
  onSelectEntry,
  onScanNewFood,
  user,
}) => {
  const totalCalories = logs.reduce(
    (acc, log) => acc + Math.round(log.foodAnalysis.calories * log.portionMultiplier),
    0
  );
  const totalProtein = logs.reduce(
    (acc, log) => acc + Math.round(log.foodAnalysis.proteinG * log.portionMultiplier),
    0
  );
  const totalCarbs = logs.reduce(
    (acc, log) => acc + Math.round(log.foodAnalysis.carbsG * log.portionMultiplier),
    0
  );
  const totalFat = logs.reduce(
    (acc, log) => acc + Math.round(log.foodAnalysis.fatG * log.portionMultiplier),
    0
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#161616] border border-[#262626] text-[#D4FF44] text-[10px] font-black uppercase tracking-widest mb-2">
            <Utensils className="w-3.5 h-3.5" />
            <span>Daily Nutritional Diary & Scan History</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#F5F5F5] font-display uppercase tracking-tight">
            Today's <span className="text-[#D4FF44]">Food Diary</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#888888] mt-1 font-medium">
            Tracks total calories and nutrients logged from Food Lens scans.
          </p>
        </div>

        <button
          onClick={onScanNewFood}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#D4FF44] hover:bg-[#C0F030] text-[#0A0A0A] font-black text-xs uppercase tracking-wider shadow-lg shadow-[#D4FF44]/20 transition-all hover:scale-105 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Scan Another Meal</span>
        </button>
      </div>

      {/* Daily Total Summary Card */}
      <div className="bg-[#111111] border border-[#222222] rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#222222] pb-3">
          <div className="text-[10px] font-black text-[#888888] uppercase tracking-[0.2em]">
            Today's Nutritional Intake
          </div>
          <div className="text-xs font-black text-[#D4FF44] uppercase tracking-wider">
            {totalCalories} / {user.dailyCalorieTarget} kcal Target
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-[#222222] text-center">
            <div className="text-[9px] uppercase font-black tracking-wider text-[#888888]">Calories</div>
            <div className="text-2xl font-black text-[#D4FF44] mt-0.5">
              {totalCalories}
            </div>
            <div className="text-[9px] font-bold text-[#666666] uppercase">kcal</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-[#222222] text-center">
            <div className="text-[9px] uppercase font-black tracking-wider text-[#888888]">Protein</div>
            <div className="text-2xl font-black text-[#F5F5F5] mt-0.5">
              {totalProtein}g
            </div>
            <div className="text-[9px] font-bold text-[#666666] uppercase">Target: ~120g</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-[#222222] text-center">
            <div className="text-[9px] uppercase font-black tracking-wider text-[#888888]">Carbohydrates</div>
            <div className="text-2xl font-black text-[#F5F5F5] mt-0.5">
              {totalCarbs}g
            </div>
            <div className="text-[9px] font-bold text-[#666666] uppercase">Target: ~220g</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-[#222222] text-center">
            <div className="text-[9px] uppercase font-black tracking-wider text-[#888888]">Fats</div>
            <div className="text-2xl font-black text-[#F5F5F5] mt-0.5">
              {totalFat}g
            </div>
            <div className="text-[9px] font-bold text-[#666666] uppercase">Target: ~60g</div>
          </div>
        </div>
      </div>

      {/* Logged Meals List */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-[#888888] uppercase tracking-[0.2em]">
          Logged Food Entries ({logs.length})
        </h3>

        {logs.length === 0 ? (
          <div className="p-12 text-center bg-[#111111] border border-[#222222] rounded-3xl space-y-3">
            <Utensils className="w-10 h-10 text-[#444444] mx-auto" />
            <div className="text-sm font-black text-[#F5F5F5] uppercase tracking-wider">No meals logged today yet</div>
            <p className="text-xs text-[#888888] max-w-sm mx-auto font-medium">
              Use the Food Lens camera to snap your breakfast, lunch, or dinner, and click "Log Meal" to build your daily diary.
            </p>
            <button
              onClick={onScanNewFood}
              className="mt-2 px-6 py-2.5 rounded-2xl bg-[#D4FF44] hover:bg-[#C0F030] text-[#0A0A0A] font-black text-xs uppercase tracking-wider shadow-md"
            >
              Scan Food Now
            </button>
          </div>
        ) : (
          logs.map((entry) => {
            const cals = Math.round(entry.foodAnalysis.calories * entry.portionMultiplier);
            const protein = Math.round(entry.foodAnalysis.proteinG * entry.portionMultiplier);
            const timeStr = new Date(entry.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <div
                key={entry.id}
                className="p-4 sm:p-5 rounded-3xl bg-[#111111] border border-[#222222] hover:border-[#333333] transition-all flex items-center justify-between gap-4 shadow-md"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#0A0A0A] shrink-0 border border-[#262626]">
                    <img
                      src={entry.foodAnalysis.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=80'}
                      alt={entry.foodAnalysis.dishName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase font-black px-2.5 py-0.5 rounded-full bg-[#161616] text-[#D4FF44] border border-[#262626]">
                        {entry.mealType}
                      </span>
                      <span className="text-[10px] text-[#888888] font-bold">{timeStr}</span>
                    </div>

                    <h4 className="text-sm font-black text-[#F5F5F5] mt-1 truncate uppercase tracking-tight">
                      {entry.foodAnalysis.dishName}
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-[#888888] mt-0.5">
                      <span className="text-[#D4FF44] font-black">{cals} kcal</span>
                      <span>•</span>
                      <span>P: {protein}g</span>
                      <span>•</span>
                      <span>Portion: {entry.portionMultiplier}x</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onSelectEntry(entry.foodAnalysis)}
                    className="px-3.5 py-2 rounded-2xl bg-[#0A0A0A] hover:bg-[#161616] text-[#F5F5F5] text-xs font-black uppercase tracking-wider flex items-center gap-1 border border-[#222222] transition-all"
                  >
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onRemoveLog(entry.id)}
                    className="p-2 rounded-xl text-[#666666] hover:text-rose-400 hover:bg-[#161616] transition-colors"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
