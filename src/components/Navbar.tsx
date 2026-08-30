import React, { useState } from 'react';
import {
  Camera,
  Activity,
  Calendar,
  ShoppingBag,
  Utensils,
  Sparkles,
  Flame,
  LogOut,
  ArrowRight,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { UserProfile, WearableMetrics } from '../types';

interface NavbarProps {
  activeTab: 'home' | 'scanner' | 'wearables' | 'mealplan' | 'grocery' | 'history';
  setActiveTab: (tab: 'home' | 'scanner' | 'wearables' | 'mealplan' | 'grocery' | 'history') => void;
  user: UserProfile;
  wearableMetrics: WearableMetrics;
  todayCaloriesEaten: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  wearableMetrics,
  todayCaloriesEaten,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const netCalories = todayCaloriesEaten - wearableMetrics.totalCaloriesBurned;

  const handleNavClick = (sectionId: string) => {
    setActiveTab('home');
    setIsMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#222222]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Main Top Header Bar (Always visible for all users) */}
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Brand Logo & Beta Badge */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                if (user.isGoogleConnected) {
                  setActiveTab('scanner');
                } else {
                  handleNavClick('overview');
                }
              }}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="relative shrink-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#635BFF] to-[#D4FF44] p-0.5 shadow-[0_0_15px_rgba(99,91,255,0.25)] group-hover:scale-105 transition-transform shrink-0">
                  <div className="w-full h-full bg-[#0A0A0A] rounded-[10px] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4FF44]" />
                  </div>
                </div>
                <span className="absolute -top-1 -right-1 px-1 py-0.2 bg-[#D4FF44] text-[#0A0A0A] text-[8px] font-black rounded tracking-tighter shadow-sm border border-[#0A0A0A] uppercase leading-tight">
                  BETA
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg sm:text-2xl font-black tracking-tighter text-[#F5F5F5] flex items-center font-display leading-none">
                    NUTRI<span className="text-[#D4FF44]">VISION</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-[#D4FF44]/20 text-[#D4FF44] border border-[#D4FF44]/40 shadow-[0_0_8px_rgba(212,255,68,0.2)]">
                    BETA
                  </span>
                </div>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#888888] block mt-0.5 sm:mt-1 font-black">
                  AI Food Lens & Health Sync
                </span>
              </div>
            </button>
          </div>

          {/* Central Main Navigation Links (Always Visible on Desktop) */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-[13px] text-[#94A3B8] font-medium shrink-0">
            <button
              onClick={() => handleNavClick('overview')}
              className={`hover:text-white transition-colors ${
                activeTab === 'home' ? 'text-white font-bold' : ''
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('enterprise')}
              className="hover:text-white transition-colors"
            >
              Enterprise
            </button>

            <button
              onClick={() => handleNavClick('developer')}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Developer</span>
              <ChevronDown className="w-3 h-3 text-[#64748B]" />
            </button>

            <button
              onClick={() => handleNavClick('resources')}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Resources</span>
              <ChevronDown className="w-3 h-3 text-[#64748B]" />
            </button>

            <button
              onClick={() => handleNavClick('pricing')}
              className="hover:text-white transition-colors"
            >
              Pricing
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className="hover:text-[#D4FF44] transition-colors font-semibold"
            >
              Contact Us
            </button>
          </div>

          {/* Right Action Area */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Direct Snap Food Action Button */}
            <button
              onClick={() => setActiveTab('scanner')}
              className="flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#D4FF44] hover:bg-[#C0F030] text-[#0A0A0A] font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(212,255,68,0.35)] hover:scale-105 active:scale-95 shrink-0"
            >
              <Camera className="w-4 h-4" />
              <span>Snap Food</span>
            </button>

            {/* Quick Calorie Burn vs Eaten Indicator */}
            <button
              onClick={() => setActiveTab('wearables')}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111111] border border-[#222222] hover:border-[#333333] transition-all text-xs shrink-0"
              title="Today's Net Calorie Balance"
            >
              <div className="flex items-center gap-1 text-[#F5F5F5] font-black">
                <Flame className="w-3.5 h-3.5 text-[#D4FF44]" />
                <span>{wearableMetrics.totalCaloriesBurned}</span>
                <span className="text-[9px] text-[#888] uppercase tracking-wider font-bold">Burn</span>
              </div>
              <span className="text-[#333333]">|</span>
              <div className="flex items-center gap-1 text-[#D4FF44] font-black">
                <span>{todayCaloriesEaten}</span>
                <span className="text-[9px] text-[#888] uppercase tracking-wider font-bold">In</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                netCalories <= 0 ? 'bg-[#D4FF44]/20 text-[#D4FF44] border border-[#D4FF44]/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {netCalories > 0 ? `+${netCalories}` : netCalories} kcal
              </span>
            </button>

            {/* 3-Bar Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 sm:p-2.5 rounded-xl bg-[#161616] hover:bg-[#222222] border border-[#2B274C] hover:border-[#D4FF44] text-[#F5F5F5] transition-all shrink-0 flex items-center justify-center"
              title="Open Navigation Menu"
            >
              {isMenuOpen ? <X className="w-5 h-5 text-[#D4FF44]" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Feature Navigation Tabs (Always Visible) */}
        <div className="flex items-center justify-start sm:justify-center gap-2 py-2.5 border-t border-[#222222] overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              activeTab === 'scanner'
                ? 'bg-[#D4FF44] text-[#0A0A0A] shadow-[0_0_15px_rgba(212,255,68,0.3)]'
                : 'text-[#888888] hover:text-[#F5F5F5] hover:bg-[#1A1A1A]'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Food Lens</span>
          </button>

          <button
            onClick={() => setActiveTab('wearables')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              activeTab === 'wearables'
                ? 'bg-[#D4FF44] text-[#0A0A0A] shadow-[0_0_15px_rgba(212,255,68,0.3)]'
                : 'text-[#888888] hover:text-[#F5F5F5] hover:bg-[#1A1A1A]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Wearables</span>
          </button>

          <button
            onClick={() => setActiveTab('mealplan')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              activeTab === 'mealplan'
                ? 'bg-[#D4FF44] text-[#0A0A0A] shadow-[0_0_15px_rgba(212,255,68,0.3)]'
                : 'text-[#888888] hover:text-[#F5F5F5] hover:bg-[#1A1A1A]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Weekly Plan</span>
          </button>

          <button
            onClick={() => setActiveTab('grocery')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              activeTab === 'grocery'
                ? 'bg-[#D4FF44] text-[#0A0A0A] shadow-[0_0_15px_rgba(212,255,68,0.3)]'
                : 'text-[#888888] hover:text-[#F5F5F5] hover:bg-[#1A1A1A]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Grocery</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              activeTab === 'history'
                ? 'bg-[#D4FF44] text-[#0A0A0A] shadow-[0_0_15px_rgba(212,255,68,0.3)]'
                : 'text-[#888888] hover:text-[#F5F5F5] hover:bg-[#1A1A1A]'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Diary</span>
          </button>
        </div>

      </div>

      {/* 3-Bar Dropdown Drawer Menu */}
      {isMenuOpen && (
        <div className="fixed inset-x-0 top-16 sm:top-20 z-50 bg-[#0E0D1B]/95 backdrop-blur-xl border-b border-[#28244D] p-6 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="max-w-xl mx-auto space-y-5">
            
            {/* Quick App Status Card */}
            <div className="p-4 rounded-2xl bg-[#141228] border border-[#2B274C] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4FF44]/20 text-[#D4FF44] flex items-center justify-center font-black">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>NutriVision AI</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#D4FF44]/20 text-[#D4FF44] font-black border border-[#D4FF44]/30 uppercase">
                      Beta
                    </span>
                  </div>
                  <div className="text-xs text-[#94A3B8]">AI Vision Food Intelligence</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveTab('scanner');
                  setIsMenuOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-[#D4FF44] hover:bg-[#C0F030] text-[#0A0A0A] font-black text-xs uppercase tracking-wider transition-all"
              >
                Scan Now
              </button>
            </div>

            {/* Navigation Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => {
                  setActiveTab('scanner');
                  setIsMenuOpen(false);
                }}
                className="p-3 rounded-xl bg-[#16142E] hover:bg-[#201D40] border border-[#28244D] text-left text-xs font-bold text-white flex items-center gap-2 transition-all"
              >
                <Camera className="w-4 h-4 text-[#D4FF44]" />
                <span>Food Lens</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('wearables');
                  setIsMenuOpen(false);
                }}
                className="p-3 rounded-xl bg-[#16142E] hover:bg-[#201D40] border border-[#28244D] text-left text-xs font-bold text-white flex items-center gap-2 transition-all"
              >
                <Activity className="w-4 h-4 text-[#635BFF]" />
                <span>Wearables</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('mealplan');
                  setIsMenuOpen(false);
                }}
                className="p-3 rounded-xl bg-[#16142E] hover:bg-[#201D40] border border-[#28244D] text-left text-xs font-bold text-white flex items-center gap-2 transition-all"
              >
                <Calendar className="w-4 h-4 text-[#A78BFA]" />
                <span>Weekly Plan</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('grocery');
                  setIsMenuOpen(false);
                }}
                className="p-3 rounded-xl bg-[#16142E] hover:bg-[#201D40] border border-[#28244D] text-left text-xs font-bold text-white flex items-center gap-2 transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-[#34D399]" />
                <span>Grocery List</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('history');
                  setIsMenuOpen(false);
                }}
                className="p-3 rounded-xl bg-[#16142E] hover:bg-[#201D40] border border-[#28244D] text-left text-xs font-bold text-white flex items-center gap-2 transition-all"
              >
                <Utensils className="w-4 h-4 text-[#F59E0B]" />
                <span>Food Diary</span>
              </button>

              <button
                onClick={() => handleNavClick('contact')}
                className="p-3 rounded-xl bg-[#16142E] hover:bg-[#201D40] border border-[#28244D] text-left text-xs font-bold text-white flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#D4FF44]" />
                <span>Contact Us</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </header>
  );
};
