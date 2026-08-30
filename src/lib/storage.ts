import { DailyFoodLogEntry, FoodAnalysis, GroceryItem, UserProfile, WearableMetrics, WeeklyMealPlan } from '../types';
import { INITIAL_USER, INITIAL_WEARABLE_METRICS } from '../data/mockData';

const KEYS = {
  USER: 'nutrivision_user_profile',
  WEARABLES: 'nutrivision_wearable_metrics',
  MEAL_PLAN: 'nutrivision_weekly_meal_plan',
  GROCERY_LIST: 'nutrivision_grocery_list',
  FOOD_LOGS: 'nutrivision_food_logs',
  SCANNED_RECENT: 'nutrivision_recent_scans',
};

export const storage = {
  getUser: (): UserProfile => {
    try {
      const data = localStorage.getItem(KEYS.USER);
      if (data) {
        const u = JSON.parse(data);
        if (
          u.avatarUrl?.includes('unsplash') ||
          u.email?.toLowerCase().includes('rajjaiswal') ||
          u.email?.toLowerCase().includes('raj4uoltm') ||
          u.name?.toLowerCase().includes('raj jaiswal')
        ) {
          u.avatarUrl = 'https://unavatar.io/linkedin/rajjaiswal0910';
        }
        return u;
      }
      return INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  },
  setUser: (user: UserProfile) => {
    try {
      if (
        user.avatarUrl?.includes('unsplash') ||
        user.email?.toLowerCase().includes('rajjaiswal') ||
        user.email?.toLowerCase().includes('raj4uoltm') ||
        user.name?.toLowerCase().includes('raj jaiswal')
      ) {
        user.avatarUrl = 'https://unavatar.io/linkedin/rajjaiswal0910';
      }
      localStorage.setItem(KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  },

  getWearables: (): WearableMetrics => {
    try {
      const data = localStorage.getItem(KEYS.WEARABLES);
      return data ? JSON.parse(data) : INITIAL_WEARABLE_METRICS;
    } catch {
      return INITIAL_WEARABLE_METRICS;
    }
  },
  setWearables: (metrics: WearableMetrics) => {
    try {
      localStorage.setItem(KEYS.WEARABLES, JSON.stringify(metrics));
    } catch (e) {
      console.error(e);
    }
  },

  getMealPlan: (): WeeklyMealPlan | null => {
    try {
      const data = localStorage.getItem(KEYS.MEAL_PLAN);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setMealPlan: (plan: WeeklyMealPlan) => {
    try {
      localStorage.setItem(KEYS.MEAL_PLAN, JSON.stringify(plan));
    } catch (e) {
      console.error(e);
    }
  },

  getGroceryList: (): GroceryItem[] => {
    try {
      const data = localStorage.getItem(KEYS.GROCERY_LIST);
      return data ? JSON.parse(data) : getDefaultGroceryItems();
    } catch {
      return getDefaultGroceryItems();
    }
  },
  setGroceryList: (items: GroceryItem[]) => {
    try {
      localStorage.setItem(KEYS.GROCERY_LIST, JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  },

  getFoodLogs: (): DailyFoodLogEntry[] => {
    try {
      const data = localStorage.getItem(KEYS.FOOD_LOGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  setFoodLogs: (logs: DailyFoodLogEntry[]) => {
    try {
      localStorage.setItem(KEYS.FOOD_LOGS, JSON.stringify(logs));
    } catch (e) {
      console.error(e);
    }
  },

  getRecentScans: (): FoodAnalysis[] => {
    try {
      const data = localStorage.getItem(KEYS.SCANNED_RECENT);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveScan: (scan: FoodAnalysis) => {
    try {
      const existing = storage.getRecentScans();
      const updated = [scan, ...existing.filter((s) => s.id !== scan.id)].slice(0, 20);
      localStorage.setItem(KEYS.SCANNED_RECENT, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  },
};

export function getDefaultGroceryItems(): GroceryItem[] {
  return [
    { id: 'g-1', name: 'Fresh Atlantic Salmon Fillet', quantity: '500g', category: 'Proteins & Meat', checked: false, sourceDish: 'Mediterranean Salmon Bowl' },
    { id: 'g-2', name: 'Organic Tri-Color Quinoa', quantity: '1 pack (400g)', category: 'Grains & Pasta', checked: true, inPantry: true },
    { id: 'g-3', name: 'Baby Spinach & Wild Arugula', quantity: '200g', category: 'Produce & Greens', checked: false, sourceDish: 'Mediterranean Salmon Bowl' },
    { id: 'g-4', name: 'Extra Virgin Olive Oil (Cold Pressed)', quantity: '1 bottle (500ml)', category: 'Healthy Fats & Oils', checked: true, inPantry: true },
    { id: 'g-5', name: 'Kalamata Pitted Olives', quantity: '1 jar', category: 'Pantry & Spices', checked: false },
    { id: 'g-6', name: 'Greek Strained Yogurt 0%', quantity: '500g tub', category: 'Dairy & Plant Milk', checked: false, sourceDish: 'Breakfast Parfait' },
    { id: 'g-7', name: 'Organic Hass Avocados', quantity: '4 count', category: 'Produce & Greens', checked: false, sourceDish: 'Avocado Toast' },
    { id: 'g-8', name: 'Fresh Blueberries & Blackberries', quantity: '250g', category: 'Produce & Greens', checked: false },
    { id: 'g-9', name: 'Raw California Walnuts', quantity: '150g bag', category: 'Snacks & Seeds', checked: false },
    { id: 'g-10', name: 'Pasture-Raised Organic Eggs', quantity: '1 dozen', category: 'Dairy & Plant Milk', checked: false, sourceDish: 'Breakfast' },
  ];
}
