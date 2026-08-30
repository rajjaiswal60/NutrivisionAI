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
  onOpenAuthModal: () => void;
  onSignOut: () => void;
  wearableMetrics: WearableMetrics;
  todayCaloriesEaten: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenAuthModal,
  onSignOut,
  wearableMetrics,
  todayCaloriesEaten,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const netCalories = todayCaloriesEaten - wearableMetrics.totalCaloriesBurned;

  const getUserAvatar = (u: UserProfile) => {
    if (
      u.email?.toLowerCase().includes('rajjaiswal') ||
      u.email?.toLowerCase().includes('raj4uoltm') ||
      u.name?.toLowerCase().includes('raj jaiswal') ||
      u.email?.toLowerCase().includes('raj.')
    ) {
      return 'https://unavatar.io/linkedin/rajjaiswal0910';
    }
    if (u.email?.toLowerCase().includes('nikhil')) {
      return 'https://media.licdn.com/dms/image/v2/D5603AQGEstjduReTGA/profile-displayphoto-scale_200_200/B56Zm.VjbTJoAY-/0/1759834946457?e=2147483647&v=beta&t=AVmxEzZHl7iUv8sKag_dz2KI501sHhKqpwJPChPxEDs';
    }
    if (u.avatarUrl && !u.avatarUrl.includes('unsplash')) {
      return u.avatarUrl;
    }
    return `https://unavatar.io/${encodeURIComponent(u.email || 'user')}?fallback=https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name || 'User')}`;
  };

  const handleSignOutAndClose = () => {
    setIsMenuOpen(false);
    onSignOut();
  };

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
            
            {user.isGoogleConnected ? (
              <>
                {/* Quick Calorie Burn vs Eaten Indicator */}
                <button
                  onClick={() => setActiveTab('wearables')}
                  className="hidden 2xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111111] border border-[#222222] hover:border-[#333333] transition-all text-xs shrink-0"
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

                {/* User Avatar & Name */}
                <div className="hidden sm:flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-[#141228] border border-[#28244D] text-xs shrink-0">
                  <img
                    src={getUserAvatar(user)}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover border border-[#D4FF44]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`;
                    }}
                  />
                  <span className="font-bold text-white max-w-[100px] truncate">{user.name}</span>
                </div>

                {/* Direct Log Out Button */}
                <button
                  onClick={onSignOut}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161616] hover:bg-rose-950/60 text-rose-300 border border-rose-800/40 hover:border-rose-600 text-xs font-black uppercase tracking-wider transition-all shadow-sm shrink-0"
                  title="Log Out to Home Screen"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">Log Out</span>
                </button>

                {/* 3-Bar Hamburger Menu Button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 sm:p-2.5 rounded-xl bg-[#161616] hover:bg-[#222222] border border-[#2B274C] hover:border-[#D4FF44] text-[#F5F5F5] transition-all shrink-0 flex items-center justify-center"
                  title="Open Navigation & Profile Menu (3-Bar)"
                >
                  {isMenuOpen ? <X className="w-5 h-5 text-[#D4FF44]" /> : <Menu className="w-5 h-5" />}
                </button>
              </>
            ) : (
              /* Unauthenticated Google Sign In Buttons */
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={onOpenAuthModal}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-[#141414] hover:bg-[#1C1C1C] border border-[#262626] hover:border-[#D4FF44]/70 text-xs font-bold text-[#F5F5F5] transition-all"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Sign In</span>
                </button>

                <button
                  onClick={onOpenAuthModal}
                  className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl bg-[#635BFF] hover:bg-[#5248E5] text-white text-xs font-bold transition-all shadow-[0_0_20px_rgba(99,91,255,0.35)] hover:scale-105 active:scale-95"
                >
                  <span>Try AI Vision</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Authenticated Sub Navigation Bar (App Feature Tabs) */}
        {user.isGoogleConnected && (
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
        )}

      </div>

      {/* 3-Bar Dropdown Drawer Menu */}
      {isMenuOpen && user.isGoogleConnected && (
        <div className="fixed inset-x-0 top-16 sm:top-20 z-50 bg-[#0E0D1B]/95 backdrop-blur-xl border-b border-[#28244D] p-6 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="max-w-xl mx-auto space-y-5">
            
            {/* User Profile Card */}
            <div className="p-4 rounded-2xl bg-[#141228] border border-[#2B274C] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={getUserAvatar(user)}
                  alt={user.name}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-[#D4FF44]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`;
                  }}
                />
                <div>
                  <div className="text-base font-bold text-white flex items-center gap-1.5 flex-wrap">
                    <span>{user.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] font-bold">
                      Google Sync
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4FF44]/20 text-[#D4FF44] font-bold border border-[#D4FF44]/30">
                      Beta
                    </span>
                  </div>
                  <div className="text-xs text-[#94A3B8]">{user.email}</div>
                </div>
              </div>

              <button
                onClick={handleSignOutAndClose}
                className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-700 text-rose-200 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
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
