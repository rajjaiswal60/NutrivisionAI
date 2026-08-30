/**
 * NutriVision AI - Gemini API Configuration
 * 
 * -------------------------------------------------------------
 * 🔑 PASTE YOUR GEMINI API KEY BELOW IN THE PLACEHOLDER:
 * Get your free API key at: https://aistudio.google.com/app/apikey
 * -------------------------------------------------------------
 */
export const GEMINI_CONFIG = {
  // 👇 REPLACE THIS PLACEHOLDER WITH YOUR ACTUAL GOOGLE GEMINI API KEY 👇
  apiKey: "YOUR_GEMINI_API_KEY_HERE",

  // State-of-the-art latest Gemini Flash models
  primaryModel: "gemini-3.7-flash",
  
  // High-resilience fallback cascade across Gemini Flash generations
  fallbackModels: [
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-2.5-flash",
    "gemini-1.5-flash",
    "gemini-2.0-flash",
  ],
};

/**
 * Helper to retrieve active API key from:
 * 1. Hardcoded GEMINI_CONFIG.apiKey in this file
 * 2. Vite Environment Variables (VITE_GEMINI_API_KEY)
 * 3. Browser LocalStorage (nutrivision_gemini_key)
 */
export function getActiveGeminiApiKey(): string {
  // 1. Direct configuration in this file
  if (
    GEMINI_CONFIG.apiKey &&
    GEMINI_CONFIG.apiKey !== "YOUR_GEMINI_API_KEY_HERE" &&
    GEMINI_CONFIG.apiKey.trim().length > 10
  ) {
    return GEMINI_CONFIG.apiKey.trim();
  }

  // 2. Vite environment variable
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (envKey && envKey !== "YOUR_GEMINI_API_KEY_HERE" && envKey.trim().length > 10) {
    return envKey.trim();
  }

  // 3. Saved key in localStorage
  const localKey = localStorage.getItem("nutrivision_gemini_key") || localStorage.getItem("connAiApiKey") || "";
  if (localKey && localKey.trim().length > 10) {
    return localKey.trim();
  }

  return "";
}
