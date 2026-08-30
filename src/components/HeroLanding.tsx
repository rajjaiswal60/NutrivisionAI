import React, { useState } from 'react';
import { UserProfile } from '../types';

interface HeroLandingProps {
  onSignInWithGoogle: () => void;
  onContinueAsGuest: () => void;
  onSelectPromptTemplate: (prompt: string) => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onSignInWithGoogle,
  onContinueAsGuest,
  onSelectPromptTemplate
}) => {
  const [customEmail, setCustomEmail] = useState('');
  const [showCustomLogin, setShowCustomLogin] = useState(false);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    onSignInWithGoogle();
  };

  const starterTemplates = [
    {
      title: 'B2B AI Workflow Arbitrage',
      tagline: '78% Gross Margin Model',
      prompt: 'Help me design a cross-border AI Workflow & Agentic Ops venture serving US healthcare & legal clients using specialized Bangalore talent.',
      icon: 'fa-solid fa-microchip',
      badge: 'High Margin'
    },
    {
      title: 'Micro-GCC as a Service',
      tagline: '€180k LTV European Mid-Caps',
      prompt: 'Architect a Turnkey 10-person captive R&D tech center model in Hyderabad for German & Nordic SaaS scale-ups facing engineering shortages.',
      icon: 'fa-solid fa-building-shield',
      badge: 'B2B Retainer'
    },
    {
      title: 'Global Export D2C Brand',
      tagline: '82% Margin Botanicals & FMCG',
      prompt: 'Develop an indie-origin Ayurvedic & functional wellness export brand targeting affluent consumers in Dubai and London with air fulfillment.',
      icon: 'fa-solid fa-gem',
      badge: 'Cross-Border'
    },
    {
      title: 'Bharat B2B Hyperlocal Micro-Hubs',
      tagline: 'Tier-2/3 MSME Supply Network',
      prompt: 'Structure the unit economics and micro-warehouse SOPs for a B2B hardware spares distribution network connecting Tier-3 factories to metropolitan buyers.',
      icon: 'fa-solid fa-truck-fast',
      badge: 'Domestic Scale'
    }
  ];

  return (
    <div id="vyuha-hero-landing" className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      {/* Ambient background glow & grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-70"></div>
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[32rem] w-[50rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-amber-500/10 via-indigo-600/15 to-transparent blur-3xl"></div>
      <div className="pointer-events-none absolute bottom-0 right-10 -z-10 h-72 w-72 rounded-full bg-amber-500/5 blur-3xl"></div>

      <div className="mx-auto max-w-5xl">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center space-x-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 shadow-inner">
            <i className="fa-solid fa-shield-halved text-amber-500 dark:text-amber-400 text-xs"></i>
            <span>Autonomous Strategic Advisory & Venture Factory</span>
          </div>
          <div className="inline-flex items-center space-x-1.5 rounded-full border border-indigo-500/30 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Zero-Friction Fallback Active</span>
          </div>
        </div>

        {/* Main Headline & Tagline */}
        <div className="mt-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
            From Strategic Chat to{' '}
            <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 bg-clip-text text-transparent">
              Commercial Blueprints
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base font-normal leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
            Formulate high-margin business models, uncover structural Indian market arbitrage, 
            and transform exploratory conversations into institutional-grade execution blueprints with instant 1-click WhatsApp & email dispatch.
          </p>
        </div>

        {/* Central Sign-In & Instant Launch Card */}
        <div className="mx-auto mt-10 max-w-md">
          <div className="relative rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-2xl shadow-amber-950/5 backdrop-blur-xl ring-1 ring-black/5 dark:border-slate-800/90 dark:bg-slate-900/80 dark:ring-white/10 sm:p-8">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 overflow-hidden items-center justify-center rounded-2xl border border-amber-500/40 bg-zinc-950 p-0.5 shadow-xl shadow-amber-500/20 ring-1 ring-white/10">
                <img src="/logo.jpg" alt="Vyuha AI" className="h-full w-full object-cover rounded-xl scale-110" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Access Strategic Deck</h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Persist blueprints to LocalStorage or sync with Google Drive
              </p>
            </div>

            <div className="mt-6 space-y-3">
              {/* Continue with Google */}
              <button
                id="btn-google-signin"
                onClick={onSignInWithGoogle}
                className="group relative flex w-full items-center justify-center space-x-3 rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-800 shadow-md transition-all hover:border-amber-400/50 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800/90 dark:text-white dark:hover:bg-slate-700 active:scale-[0.99]"
              >
                <i className="fa-brands fa-google text-red-500 text-base"></i>
                <span>Continue with Google</span>
                <span className="absolute right-4 text-xs text-slate-400 group-hover:text-amber-500 dark:group-hover:text-amber-300">
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
              </button>

              {/* Guest / Direct Start */}
              <button
                id="btn-guest-start"
                onClick={onContinueAsGuest}
                className="flex w-full items-center justify-center space-x-2 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:brightness-110 active:scale-[0.99]"
              >
                <i className="fa-solid fa-bolt text-slate-950"></i>
                <span>Start Brainstorming Instantly (Guest)</span>
              </button>
            </div>

            {/* Zero-friction note */}
            <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-center dark:border-slate-800/80 dark:bg-slate-950/60">
              <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                <i className="fa-solid fa-wand-magic-sparkles mr-1 text-amber-500 dark:text-amber-400"></i>
                <strong className="text-slate-800 dark:text-slate-300">Zero-Friction Guarantee:</strong> No mandatory API keys or cloud credentials required to generate complete blueprints.
              </p>
            </div>
          </div>
        </div>

        {/* Starter Strategic Templates */}
        <div className="mt-14">
          <div className="mb-4 text-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Or Launch with a Pre-Configured Strategic Lens
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {starterTemplates.map((item, idx) => (
              <button
                key={idx}
                id={`btn-starter-template-${idx}`}
                onClick={() => onSelectPromptTemplate(item.prompt)}
                className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-amber-400 hover:bg-amber-50/40 hover:shadow-lg dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-amber-500/40 dark:hover:bg-slate-900/90 active:scale-[0.98]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:bg-slate-800 dark:text-amber-400 group-hover:bg-amber-500/20">
                      <i className={`${item.icon} text-sm`}></i>
                    </div>
                    <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                      {item.badge}
                    </span>
                  </div>
                  <h4 className="mt-3 text-sm font-bold text-slate-900 group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-300">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {item.tagline}
                  </p>
                </div>
                <div className="mt-4 flex items-center text-[11px] font-semibold text-slate-500 group-hover:text-amber-600 dark:text-slate-500 dark:group-hover:text-amber-400">
                  <span>Explore Blueprint</span>
                  <i className="fa-solid fa-chevron-right ml-1 text-[9px] transition-transform group-hover:translate-x-0.5"></i>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Feature Pillars */}
        <div className="mt-16 grid grid-cols-1 gap-6 border-t border-slate-200 pt-10 sm:grid-cols-3 dark:border-slate-800/80">
          <div className="flex items-start space-x-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500/30">
              <i className="fa-solid fa-chart-line"></i>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Indian Market Arbitrage</h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Identify 4x-7x cost-to-value deltas across cross-border talent, manufacturing, and supply chains.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/30">
              <i className="fa-solid fa-file-invoice-dollar"></i>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">3-Part Deliverable Suite</h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Generates Executive Summary, Pin-to-Plane Architecture, and Skills E-Book on every approved pitch.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30">
              <i className="fa-brands fa-whatsapp"></i>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">1-Click WhatsApp & Gmail Dispatch</h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Instant sharing to investors, partners, and team members with structured briefs and cloud backup.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
