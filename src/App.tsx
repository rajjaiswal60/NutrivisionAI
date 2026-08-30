import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { FoodScanner } from './components/FoodScanner';
import { FoodAnalysisResult } from './components/FoodAnalysisResult';
import { HealthWearableDashboard } from './components/HealthWearableDashboard';
import { RegionalMealPlanner } from './components/RegionalMealPlanner';
import { GroceryListManager } from './components/GroceryListManager';
import { FoodLogHistory } from './components/FoodLogHistory';
import { DailyFoodLogEntry, FoodAnalysis, GroceryItem, UserProfile, WearableMetrics, WeeklyMealPlan } from './types';
import { storage } from './lib/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'scanner' | 'wearables' | 'mealplan' | 'grocery' | 'history'>('scanner');
  
  // App States
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = storage.getUser();
    return { ...saved, isGoogleConnected: true };
  });
  const [wearables, setWearables] = useState<WearableMetrics>(storage.getWearables());
  const [mealPlan, setMealPlan] = useState<WeeklyMealPlan | null>(storage.getMealPlan());
  const [groceryList, setGroceryList] = useState<GroceryItem[]>(storage.getGroceryList());
  const [foodLogs, setFoodLogs] = useState<DailyFoodLogEntry[]>(storage.getFoodLogs());
  
  const [currentAnalysis, setCurrentAnalysis] = useState<FoodAnalysis | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Synchronize state changes to localStorage
  useEffect(() => {
    storage.setUser(user);
  }, [user]);

  useEffect(() => {
    storage.setWearables(wearables);
  }, [wearables]);

  useEffect(() => {
    if (mealPlan) storage.setMealPlan(mealPlan);
  }, [mealPlan]);

  useEffect(() => {
    storage.setGroceryList(groceryList);
  }, [groceryList]);

  useEffect(() => {
    storage.setFoodLogs(foodLogs);
  }, [foodLogs]);

  // Calculate today's total calories consumed
  const todayCaloriesEaten = foodLogs.reduce(
    (acc, log) => acc + Math.round(log.foodAnalysis.calories * log.portionMultiplier),
    0
  );

  // Food scan completed callback
  const handleAnalysisComplete = (analysis: FoodAnalysis) => {
    setCurrentAnalysis(analysis);
    storage.saveScan(analysis);
  };

  // Log meal into daily food diary
  const handleLogMeal = (
    analysis: FoodAnalysis,
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    portion: number
  ) => {
    const newEntry: DailyFoodLogEntry = {
      id: `log-${Date.now()}`,
      foodAnalysis: analysis,
      mealType,
      portionMultiplier: portion,
      loggedAt: Date.now(),
    };
    setFoodLogs((prev) => [newEntry, ...prev]);
  };

  // Add items to grocery list
  const handleAddToGrocery = (newItems: GroceryItem[]) => {
    setGroceryList((prev) => {
      const existingNames = new Set(prev.map((i) => i.name.toLowerCase()));
      const filteredNew = newItems.filter((i) => !existingNames.has(i.name.toLowerCase()));
      return [...filteredNew, ...prev];
    });
  };

  // Remove meal log
  const handleRemoveLog = (id: string) => {
    setFoodLogs((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] flex flex-col font-sans selection:bg-[#D4FF44] selection:text-[#0A0A0A]">
      
      {/* Top Navigation Bar with Direct Tab Switching */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        wearableMetrics={wearables}
        todayCaloriesEaten={todayCaloriesEaten}
      />

      {/* Main Experience */}
      {activeTab === 'home' ? (
        <LandingPage
          onOpenScanner={() => setActiveTab('scanner')}
        />
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          
          {/* Tab 1: Food Lens Scanner & Analysis Result */}
          {activeTab === 'scanner' && (
            <div>
              {currentAnalysis ? (
                <FoodAnalysisResult
                  analysis={currentAnalysis}
                  onBack={() => setCurrentAnalysis(null)}
                  onLogMeal={handleLogMeal}
                  onAddToGrocery={handleAddToGrocery}
                  user={user}
                />
              ) : (
                <FoodScanner
                  onAnalysisComplete={handleAnalysisComplete}
                  isScanning={isScanning}
                  setIsScanning={setIsScanning}
                  user={user}
                  onAddToGrocery={handleAddToGrocery}
                  onLogMeal={handleLogMeal}
                  onOpenLocationModal={() => {}}
                />
              )}
            </div>
          )}

          {/* Tab 2: Wearables & Health Sync Dashboard */}
          {activeTab === 'wearables' && (
            <HealthWearableDashboard
              metrics={wearables}
              onUpdateMetrics={setWearables}
              user={user}
              todayCaloriesEaten={todayCaloriesEaten}
            />
          )}

          {/* Tab 3: Regional Meal Planner */}
          {activeTab === 'mealplan' && (
            <RegionalMealPlanner
              user={user}
              mealPlan={mealPlan}
              onUpdateMealPlan={setMealPlan}
              onExportToGrocery={handleAddToGrocery}
            />
          )}

          {/* Tab 4: Smart Grocery List */}
          {activeTab === 'grocery' && (
            <GroceryListManager
              items={groceryList}
              onUpdateItems={setGroceryList}
            />
          )}

          {/* Tab 5: Food Diary History */}
          {activeTab === 'history' && (
            <FoodLogHistory
              logs={foodLogs}
              onRemoveLog={handleRemoveLog}
              onSelectEntry={(analysis) => {
                setCurrentAnalysis(analysis);
                setActiveTab('scanner');
              }}
              onScanNewFood={() => {
                setCurrentAnalysis(null);
                setActiveTab('scanner');
              }}
              user={user}
            />
          )}

        </main>
      )}

    </div>
  );
}
