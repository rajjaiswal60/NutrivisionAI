export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  isGoogleConnected?: boolean;
  googleId?: string;
  country: string;
  state: string;
  city: string;
  gender?: 'male' | 'female' | 'other';
  age?: number;
  weightKg?: number;
  heightCm?: number;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  dietaryGoal: 'weight_loss' | 'muscle_gain' | 'maintain_health' | 'keto' | 'diabetic_care' | 'heart_health';
  dietaryPreference: 'all' | 'vegetarian' | 'vegan' | 'pescatarian' | 'halal' | 'kosher' | 'low_carb' | 'high_protein';
  regionPreference: string;
  dailyCalorieTarget: number;
  allergies: string[];
  selectedModel?: string;
  geminiApiKey?: string;
  aiProvider?: 'gemini' | 'claude' | 'openai' | 'local';
}

export interface LocalFoodSuggestion {
  id: string;
  dishName: string;
  localName?: string;
  cuisine: string;
  city: string;
  state: string;
  country: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Street Delicacy';
  summary: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  healthScore: number;
  dietaryTags: string[];
  keyLocalIngredients: string[];
  healthBenefit: string;
  imageUrl?: string;
  cookingSteps?: CookingStep[];
  ingredients?: { item: string; quantity: string; category: string; estimatedCalories?: number }[];
}

export interface Micronutrient {
  name: string;
  amount: string;
  dailyValuePct: number;
  benefit: string;
}

export interface Ingredient {
  item: string;
  quantity: string;
  category: string;
  estimatedCalories: number;
  substitutions?: string[];
}

export interface CookingStep {
  stepNumber: number;
  title: string;
  instruction: string;
  durationMinutes?: number;
  tips?: string;
}

export interface FoodAnalysis {
  id: string;
  isFood?: boolean;
  nonFoodReason?: string;
  dishName: string;
  cuisineType: string;
  confidence: number;
  summary: string;
  portionSize: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  sugarG: number;
  sodiumMg: number;
  glycemicIndex: number;
  healthScore: number; // 1 to 100
  vitamins: Micronutrient[];
  minerals: Micronutrient[];
  dietaryTags: string[];
  allergenAlerts: string[];
  healthFactors: {
    antiInflammatoryRating: 'High' | 'Moderate' | 'Low';
    heartHealthScore: 'Excellent' | 'Good' | 'Moderate';
    satietyIndex: 'Very High' | 'High' | 'Medium' | 'Low';
    gutHealthImpact: string;
  };
  ingredients: Ingredient[];
  cookingSteps: CookingStep[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  chefTips: string[];
  timestamp: number;
  imageUrl?: string;
}

export interface MealItem {
  id: string;
  name: string;
  cuisine: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  prepTimeMin: number;
  description: string;
  ingredients: string[];
  cookingBrief: string[];
  tags: string[];
}

export interface DayPlan {
  dayName: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  dateStr?: string;
  meals: {
    breakfast: MealItem;
    lunch: MealItem;
    dinner: MealItem;
    snack: MealItem;
  };
  dailyTotalCalories: number;
  dailyMacros: {
    proteinG: number;
    carbsG: number;
    fatG: number;
  };
  hydrationGoalLiters: number;
}

export interface WeeklyMealPlan {
  weekId: string;
  generatedDate: string;
  region: string;
  dietGoal: string;
  targetDailyCalories: number;
  days: DayPlan[];
  regionInsight: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: string;
  category: 'Produce & Greens' | 'Proteins & Meat' | 'Dairy & Plant Milk' | 'Grains & Pasta' | 'Pantry & Spices' | 'Healthy Fats & Oils' | 'Snacks & Seeds';
  checked: boolean;
  sourceDish?: string;
  inPantry?: boolean;
}

export type WearableDeviceType = 'Apple Health' | 'Google Fit' | 'Fitbit' | 'Garmin' | 'Whoop' | 'Oura Ring' | 'Web Bluetooth HR' | 'None';

export interface HeartRatePoint {
  time: string;
  bpm: number;
  zone: 'Rest' | 'Warmup' | 'FatBurn' | 'Cardio' | 'Peak';
}

export interface WearableMetrics {
  connectedDevice: WearableDeviceType;
  deviceName?: string;
  isSyncing: boolean;
  lastSynced: string;
  batteryLevel: number;
  stepsToday: number;
  stepGoal: number;
  distanceKm: number;
  activeMinutes: number;
  walkingPaceMinPerKm: number;
  currentHeartRate: number;
  restingHeartRate: number;
  maxHeartRateToday: number;
  heartRateHistory: HeartRatePoint[];
  activeCaloriesBurned: number;
  bmrCalories: number;
  totalCaloriesBurned: number;
  hourlySteps: { hour: string; steps: number }[];
  sleepHours?: number;
  recoveryScore?: number;
}

export interface DailyFoodLogEntry {
  id: string;
  foodAnalysis: FoodAnalysis;
  loggedAt: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  portionMultiplier: number;
}
