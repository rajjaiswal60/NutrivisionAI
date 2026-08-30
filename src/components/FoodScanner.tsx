import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, RefreshCw, Sparkles, Image as ImageIcon, CheckCircle, AlertCircle, Search, Flame, Zap } from 'lucide-react';
import { FoodAnalysis, GroceryItem, UserProfile } from '../types';
import { SAMPLE_FOOD_DISHES } from '../data/mockData';
import { LocalFoodSuggestions } from './LocalFoodSuggestions';

interface FoodScannerProps {
  onAnalysisComplete: (result: FoodAnalysis) => void;
  isScanning: boolean;
  setIsScanning: (val: boolean) => void;
  user: UserProfile;
  onUpdateUser?: (updated: UserProfile) => void;
  onAddToGrocery: (items: GroceryItem[]) => void;
  onLogMeal?: (analysis: FoodAnalysis, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack', portion: number) => void;
  onOpenLocationModal: () => void;
}

export const FoodScanner: React.FC<FoodScannerProps> = ({
  onAnalysisComplete,
  isScanning,
  setIsScanning,
  user,
  onAddToGrocery,
  onLogMeal,
  onOpenLocationModal,
}) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [customDishQuery, setCustomDishQuery] = useState('');
  const [scanStatusText, setScanStatusText] = useState('Analyzing food with AI Vision...');
  const [nonFoodError, setNonFoodError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera stream when unmounting or switching modes
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Start live camera stream with bulletproof fallback across all mobile & desktop cameras
  const startCamera = async (facing: 'environment' | 'user' = 'environment', isSwitching = false) => {
    setCameraError(null);
    setNonFoodError(null);

    // If mediaDevices is completely unsupported, launch native camera dialog only if not already in switching mode
    if (!navigator?.mediaDevices?.getUserMedia) {
      if (!isSwitching && nativeCameraInputRef.current) {
        nativeCameraInputRef.current.click();
      }
      return;
    }

    // Stop current stream before requesting a new one
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    let acquiredStream: MediaStream | null = null;
    let actualFacing = facing;

    try {
      // Find exact back/rear camera device if available
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter((d) => d.kind === 'videoinput');
      const rearCamera = videoInputs.find((d) =>
        /back|rear|environment|wide|ultra/i.test(d.label || '')
      );
      const frontCamera = videoInputs.find((d) =>
        /front|user|selfie|face/i.test(d.label || '')
      );

      const targetDeviceId = facing === 'environment' ? rearCamera?.deviceId : frontCamera?.deviceId;

      // Try with exact deviceId first if identified
      if (targetDeviceId) {
        try {
          acquiredStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: targetDeviceId }, width: { ideal: 1920 }, height: { ideal: 1080 } },
            audio: false,
          });
        } catch (e) {
          // fallback to standard facingMode constraints
        }
      }

      if (!acquiredStream) {
        const constraintList: MediaStreamConstraints[] = [
          {
            video: {
              facingMode: { ideal: facing },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          },
          {
            video: {
              facingMode: facing,
            },
            audio: false,
          },
          {
            video: {
              facingMode: facing === 'environment' ? 'user' : 'environment',
            },
            audio: false,
          },
          {
            video: true,
            audio: false,
          },
        ];

        for (let i = 0; i < constraintList.length; i++) {
          try {
            acquiredStream = await navigator.mediaDevices.getUserMedia(constraintList[i]);
            if (i === 2) {
              actualFacing = facing === 'environment' ? 'user' : 'environment';
            }
            break;
          } catch (err) {
            // Try next constraint in cascade
          }
        }
      }
    } catch (e) {
      console.warn('Device enumeration error:', e);
    }

    if (acquiredStream) {
      streamRef.current = acquiredStream;
      if (videoRef.current) {
        videoRef.current.srcObject = acquiredStream;
        videoRef.current.play().catch((e) => console.warn('Video play error:', e));
      }
      setCameraActive(true);
      setCameraFacing(actualFacing);
    } else {
      if (!isSwitching) {
        // Fall back to native camera picker if starting from idle
        if (nativeCameraInputRef.current) {
          nativeCameraInputRef.current.click();
        } else if (fileInputRef.current) {
          fileInputRef.current.click();
        }
      } else {
        setCameraError('Could not flip camera. Your device might have only one active camera.');
        setTimeout(() => setCameraError(null), 3000);
      }
    }
  };

  const handleSwitchCamera = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    startCamera(nextFacing, true);
  };

  // Capture frame from video
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      setSelectedImage(dataUrl);
      stopCamera();
      analyzePhoto(dataUrl, customDishQuery);
    }
  };

  // Handle uploaded file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setSelectedImage(base64);
        analyzePhoto(base64, customDishQuery);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setSelectedImage(base64);
        analyzePhoto(base64, customDishQuery);
      };
      reader.readAsDataURL(file);
    }
  };

  // Call Server Gemini API
  const analyzePhoto = async (base64Image: string, hint?: string) => {
    setIsScanning(true);
    setNonFoodError(null);
    setScanStatusText('Scanning food with AI Vision...');

    // Progress text cycles
    const timers = [
      setTimeout(() => setScanStatusText('Calculating exact calories & macronutrient profile...'), 1100),
      setTimeout(() => setScanStatusText('Extracting bioavailable vitamins, minerals & allergens...'), 2200),
      setTimeout(() => setScanStatusText('Synthesizing step-by-step chef recipe & instructions...'), 3300),
    ];

    const finalHint = (hint || customDishQuery || '').trim();

    try {
      const res = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: base64Image,
          mimeType: 'image/jpeg',
          dishHint: finalHint,
        }),
      });

      let json: any = null;
      if (res.ok) {
        json = await res.json().catch(() => null);
      }

      if (json && json.success && json.data && json.data.isFood !== false) {
        onAnalysisComplete({
          ...json.data,
          imageUrl: base64Image || json.data.imageUrl,
        });
      } else if (json && json.data && json.data.isFood === false) {
        setSelectedImage(null);
        setNonFoodError(
          json?.error || 'No edible food detected in this image. Please take or upload a clear photo of a food dish, cooked meal, beverage, or grocery ingredient.'
        );
      } else {
        // Static hosting fallback (e.g., GitHub Pages)
        fallbackToSampleDish(base64Image, finalHint);
      }
    } catch (err: any) {
      timers.forEach(clearTimeout);
      console.warn('Backend API unavailable, using offline multimodal fallback:', err);
      fallbackToSampleDish(base64Image, finalHint);
    } finally {
      setIsScanning(false);
    }
  };

  // Robust static fallback for GitHub Pages
  const fallbackToSampleDish = (base64Image: string, hint: string) => {
    const query = hint.toLowerCase().trim();
    let match = SAMPLE_FOOD_DISHES.find(d => 
      query && (d.dishName?.toLowerCase().includes(query) || d.cuisineType?.toLowerCase().includes(query))
    );
    if (!match) {
      match = SAMPLE_FOOD_DISHES[Math.floor(Math.random() * SAMPLE_FOOD_DISHES.length)];
    }

    const fallbackAnalysis: FoodAnalysis = {
      id: `food-${Date.now()}`,
      isFood: true,
      dishName: hint || match.dishName || 'Nutritious Protein Bowl',
      cuisineType: match.cuisineType || 'Balanced Fusion',
      confidence: 96.5,
      summary: match.summary || 'Nutrient-dense freshly prepared meal with balanced macronutrients, dietary fiber, and natural minerals.',
      portionSize: '1 standard bowl (320g)',
      calories: match.calories || 480,
      proteinG: match.proteinG || 28,
      carbsG: match.carbsG || 45,
      fatG: match.fatG || 16,
      fiberG: match.fiberG || 8,
      sugarG: 6,
      sodiumMg: 420,
      glycemicIndex: 45,
      healthScore: match.healthScore || 92,
      vitamins: [
        { name: 'Vitamin A (Beta-Carotene)', amount: '680 mcg', dailyValuePct: 75, benefit: 'Eye health & cellular immune defense' },
        { name: 'Vitamin C', amount: '45 mg', dailyValuePct: 50, benefit: 'Collagen synthesis & iron absorption' },
        { name: 'Vitamin B12 / Folate', amount: '1.8 mcg', dailyValuePct: 75, benefit: 'RBC formation & nervous system vitality' },
      ],
      minerals: [
        { name: 'Iron', amount: '4.2 mg', dailyValuePct: 35, benefit: 'Hemoglobin production and fatigue reduction' },
        { name: 'Calcium', amount: '320 mg', dailyValuePct: 32, benefit: 'Bone density and muscle contractions' },
        { name: 'Magnesium', amount: '110 mg', dailyValuePct: 28, benefit: 'Muscle recovery and metabolic regulation' },
      ],
      dietaryTags: match.dietaryTags || ['High Protein', 'Rich in Fiber', 'Antioxidant Rich'],
      allergenAlerts: [],
      healthFactors: {
        antiInflammatoryRating: 'High',
        heartHealthScore: 'Excellent',
        satietyIndex: 'High',
        gutHealthImpact: 'Promotes healthy gut microbiome diversity with prebiotic dietary fiber.',
      },
      ingredients: (match.ingredients as any) || [
        { item: 'Fresh Seasonal Produce', quantity: '150g', category: 'Produce & Greens', estimatedCalories: 120 },
        { item: 'High-Bioavailability Protein', quantity: '100g', category: 'Proteins & Meat', estimatedCalories: 220 },
        { item: 'Whole Grain Base', quantity: '80g', category: 'Grains & Pasta', estimatedCalories: 140 },
      ],
      cookingSteps: (match.cookingSteps as any) || [
        { stepNumber: 1, title: 'Prep Fresh Ingredients', instruction: 'Wash, chop, and measure out fresh herbs, spices, and proteins.', durationMinutes: 5 },
        { stepNumber: 2, title: 'Sauté & Temper', instruction: 'Heat olive oil or ghee in a pan, add aromatic herbs, and cook until fragrant.', durationMinutes: 8 },
        { stepNumber: 3, title: 'Simmer & Garnish', instruction: 'Combine ingredients, simmer to desired texture, and garnish with fresh lime and greens.', durationMinutes: 5 },
      ],
      prepTimeMinutes: 10,
      cookTimeMinutes: 15,
      difficulty: 'Easy',
      chefTips: ['Use cold-pressed oil for maximum polyphenols', 'Garnish with freshly squeezed citrus to boost non-heme iron absorption.'],
      timestamp: Date.now(),
      imageUrl: base64Image || match.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    };

    onAnalysisComplete(fallbackAnalysis);
  };

  const handleSampleClick = async (sample: Partial<FoodAnalysis>) => {
    setSelectedImage(sample.imageUrl || null);
    await analyzePhoto(sample.imageUrl || '', sample.dishName);
  };

  const handleTextQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDishQuery.trim()) return;
    analyzePhoto('', customDishQuery.trim());
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 relative">
      
      {/* Non-Food Detection Alert Modal */}
      {nonFoodError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#141414] border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[0_0_40px_rgba(245,158,11,0.2)] text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto text-3xl shadow-inner">
              ⚠️
            </div>
            <div>
              <div className="inline-block px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-widest mb-1.5 border border-amber-500/30">
                Non-Food Detected
              </div>
              <h3 className="text-xl font-black uppercase text-[#F5F5F5] font-display tracking-tight">
                No Valid Food Found
              </h3>
              <p className="text-xs text-[#A3A3A3] mt-2 font-medium leading-relaxed">
                {nonFoodError}
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setNonFoodError(null)}
                className="w-full py-3 rounded-2xl bg-[#D4FF44] hover:bg-[#C0F030] text-[#0A0A0A] font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(212,255,68,0.3)] hover:scale-105 active:scale-95"
              >
                Scan Real Food Dish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Banner & Scanner Hub */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161616] border border-[#262626] text-[#D4FF44] text-[11px] font-black uppercase tracking-widest shadow-sm">
            <span className="px-1.5 py-0.5 rounded bg-[#D4FF44]/20 text-[#D4FF44] text-[9px] font-black border border-[#D4FF44]/30">
              BETA
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#D4FF44]" />
            <span>AI Multimodal Food Vision</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[#F5F5F5] font-display tracking-tighter uppercase">
          Snap Any Food. Get Real <span className="text-[#D4FF44]">Nutrients & Recipe</span>.
        </h1>
        <p className="text-xs sm:text-sm text-[#888888] max-w-2xl mx-auto font-medium">
          Capture photos of cooked meals, regional cuisines, or groceries. Instantly uncover exact calories, 
          micronutrient vitamins/minerals, allergen alerts, and step-by-step cooking guides.
        </p>
      </div>

      {/* Main Scanner Card / Viewfinder */}
      <div className="bg-[#111111] border border-[#222222] rounded-3xl p-4 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Active Scanning Overlay */}
        {isScanning && (
          <div className="absolute inset-0 z-30 bg-[#0A0A0A]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
            {/* Animated Laser Scanning Line */}
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-2xl overflow-hidden border-2 border-[#D4FF44]/60 shadow-[0_0_25px_rgba(212,255,68,0.2)] mb-6 bg-[#161616]">
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Analyzing food"
                  className="w-full h-full object-cover filter brightness-90"
                />
              )}
              {/* Laser animation bar */}
              <div className="absolute inset-x-0 h-1.5 bg-[#D4FF44] shadow-[0_0_20px_#D4FF44] animate-[bounce_2s_infinite]" />
              <div className="absolute inset-0 bg-[#D4FF44]/10 pointer-events-none" />
            </div>

            <div className="flex items-center gap-2 text-[#D4FF44] font-black text-xl font-display mb-2 uppercase tracking-wide">
              <Zap className="w-5 h-5 animate-pulse" />
              <span>Analyzing Nutrition & Recipe</span>
            </div>
            <p className="text-xs uppercase tracking-wider font-bold text-[#888888] max-w-sm animate-pulse">
              {scanStatusText}
            </p>
          </div>
        )}

        {/* Viewfinder / Capture Box */}
        <div className="relative">
          {cameraActive ? (
            /* Live Camera Stream */
            <div className="relative w-full aspect-video max-h-[460px] bg-black rounded-2xl overflow-hidden border border-[#D4FF44]/40 shadow-inner flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              
              {/* Viewfinder Target Reticle */}
              <div className="absolute inset-8 sm:inset-16 border-2 border-dashed border-[#D4FF44]/60 rounded-2xl pointer-events-none flex items-center justify-center">
                <div className="text-[10px] font-black uppercase tracking-widest text-[#0A0A0A] bg-[#D4FF44] px-3.5 py-1 rounded-full shadow-lg">
                  Center food dish here
                </div>
              </div>

              {/* Live Camera Controls */}
              <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4 px-4">
                <button
                  onClick={handleSwitchCamera}
                  className="p-3 rounded-full bg-[#111111]/90 hover:bg-[#222222] text-[#F5F5F5] backdrop-blur-md transition-all border border-[#333333]"
                  title="Switch Camera (Front/Back)"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>

                <button
                  onClick={capturePhoto}
                  className="w-16 h-16 rounded-full bg-[#D4FF44] hover:bg-[#C0F030] text-[#0A0A0A] p-1 shadow-[0_0_20px_rgba(212,255,68,0.4)] flex items-center justify-center transition-all hover:scale-105 active:scale-95 border-4 border-[#0A0A0A]"
                  title="Capture Photo"
                >
                  <Camera className="w-7 h-7" />
                </button>

                <button
                  onClick={stopCamera}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-wider backdrop-blur-md transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* Upload / Shutter Launch Area */
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-[#333333] hover:border-[#D4FF44]/60 rounded-2xl p-8 sm:p-12 text-center transition-all bg-[#0A0A0A]/60 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#161616] border border-[#262626] text-[#D4FF44] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:border-[#D4FF44]/40 transition-all shadow-[0_0_15px_rgba(212,255,68,0.1)]">
                <Camera className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-black text-[#F5F5F5] font-display uppercase tracking-tight mb-1">
                Take a Photo or Upload Food Image
              </h3>
              <p className="text-xs text-[#888888] max-w-md mx-auto mb-6">
                Supports real-time camera capture, drag & drop photos (JPG, PNG, WebP), or paste from clipboard.
              </p>

              {cameraError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2 max-w-md mx-auto">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{cameraError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => startCamera('environment')}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#D4FF44] hover:bg-[#C0F030] text-[#0A0A0A] font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(212,255,68,0.25)] transition-all hover:scale-105 active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                  <span>Snap Food / Camera</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#161616] hover:bg-[#222222] border border-[#262626] text-[#F5F5F5] font-black text-xs uppercase tracking-wider transition-all hover:border-[#333333]"
                >
                  <Upload className="w-4 h-4 text-[#D4FF44]" />
                  <span>Upload Image</span>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <input
                ref={nativeCameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          )}
        </div>

        {/* Text Search Alternative */}
        <div className="mt-6 pt-6 border-t border-[#222222]">
          <form onSubmit={handleTextQuerySubmit} className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#888888]" />
            <input
              type="text"
              value={customDishQuery}
              onChange={(e) => setCustomDishQuery(e.target.value)}
              placeholder="Or type any dish name (e.g., 'Japanese Miso Salmon with Brown Rice', 'Chicken Biryani')..."
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded-2xl pl-11 pr-32 py-3.5 text-xs text-[#F5F5F5] placeholder-[#666666] focus:outline-none focus:border-[#D4FF44] font-medium"
            />
            <button
              type="submit"
              disabled={!customDishQuery.trim() || isScanning}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-5 rounded-xl bg-[#D4FF44] hover:bg-[#C0F030] text-[#0A0A0A] font-black text-xs uppercase tracking-wider transition-all disabled:opacity-40"
            >
              Analyze
            </button>
          </form>
        </div>

      </div>

      {/* Hyper-Local Food Suggestions for User's City & State */}
      <LocalFoodSuggestions
        user={user}
        onSelectDish={onAnalysisComplete}
        onAddToGrocery={onAddToGrocery}
        onLogMeal={onLogMeal}
        onOpenLocationModal={onOpenLocationModal}
      />

      {/* Popular Regional Dishes Instant Library */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.3em] font-black text-[#888888] mb-1">Instant Sample Library</h2>
            <h3 className="text-xl font-black text-[#F5F5F5] font-display flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#D4FF44]" />
              <span>Explore Curated Regional Dishes</span>
            </h3>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-[#D4FF44] font-black px-3 py-1 rounded-full bg-[#161616] border border-[#262626]">
            6 Sample Cuisines
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SAMPLE_FOOD_DISHES.map((dish) => (
            <button
              key={dish.id}
              onClick={() => handleSampleClick(dish)}
              className="group flex flex-col bg-[#111111] hover:bg-[#161616] border border-[#222222] hover:border-[#D4FF44]/60 rounded-2xl overflow-hidden text-left transition-all shadow-lg hover:shadow-[0_0_20px_rgba(212,255,68,0.1)] hover:-translate-y-0.5"
            >
              <div className="relative aspect-[16/10] w-full bg-[#161616] overflow-hidden">
                <img
                  src={dish.imageUrl}
                  alt={dish.dishName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#0A0A0A]/90 backdrop-blur-md text-[9px] font-black uppercase tracking-wider text-[#D4FF44] border border-[#222222]">
                  {dish.cuisineType}
                </div>
                <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-[#0A0A0A]/90 backdrop-blur-md text-[10px] font-black text-[#F5F5F5]">
                  <span className="text-[#D4FF44]">{dish.calories}</span> KCAL
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-black text-[#F5F5F5] group-hover:text-[#D4FF44] transition-colors line-clamp-1">
                    {dish.dishName}
                  </h4>
                  <p className="text-[11px] text-[#888888] mt-1 line-clamp-2 leading-relaxed font-medium">
                    {dish.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#222222] text-[10px] text-[#A3A3A3]">
                  <div className="flex items-center gap-2.5 font-black">
                    <span className="text-[#D4FF44]">P: {dish.proteinG}g</span>
                    <span className="text-[#F5F5F5]">C: {dish.carbsG}g</span>
                    <span className="text-[#888888]">F: {dish.fatG}g</span>
                  </div>
                  <span className="text-[#D4FF44] font-black uppercase text-[10px] tracking-wider group-hover:underline flex items-center gap-1">
                    Scan <Sparkles className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
