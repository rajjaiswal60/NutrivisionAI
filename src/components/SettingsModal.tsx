import React, { useState } from 'react';
import { UserSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSaveSettings: (updated: UserSettings) => void;
  onOpenConnectors: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onOpenConnectors
}) => {
  const [activeTab, setActiveTab] = useState<'appearance' | 'location' | 'chat_agent' | 'video_agent'>('appearance');
  const [formData, setFormData] = useState<UserSettings>(settings);
  const [locating, setLocating] = useState(false);
  const [locMessage, setLocMessage] = useState('');

  if (!isOpen) return null;

  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setLocMessage('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    setLocMessage('Requesting location permissions...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        
        let detectedCountry = 'India';
        // Approximate detection or reverse geocoding heuristic
        if (lat >= 24 && lat <= 49 && lon >= -125 && lon <= -66) {
          detectedCountry = 'United States';
        } else if (lat >= 8 && lat <= 37 && lon >= 68 && lon <= 97) {
          detectedCountry = 'India';
        } else if (lat >= 50 && lat <= 60 && lon >= -8 && lon <= 2) {
          detectedCountry = 'United Kingdom';
        } else if (lat >= 22 && lat <= 26 && lon >= 51 && lon <= 56) {
          detectedCountry = 'United Arab Emirates';
        } else if (lat >= 47 && lat <= 55 && lon >= 5 && lon <= 15) {
          detectedCountry = 'Germany';
        } else if (lat >= 1 && lat <= 2 && lon >= 103 && lon <= 104) {
          detectedCountry = 'Singapore';
        } else {
          detectedCountry = 'India';
        }

        setFormData(prev => ({
          ...prev,
          location: {
            enabled: true,
            hasGrantedPermission: true,
            country: detectedCountry,
            latitude: lat,
            longitude: lon,
            city: 'Detected Geo Region'
          }
        }));

        setLocating(false);
        setLocMessage(`Location granted! Detected region: ${detectedCountry}. Background uniqueness detector active.`);
      },
      (err) => {
        setLocating(false);
        setLocMessage('Location permission denied or unavailable. You can manually select your target country below.');
      },
      { timeout: 10000 }
    );
  };

  const handleSelectTheme = (mode: 'dark' | 'light' | 'system') => {
    setFormData(prev => ({ ...prev, themeMode: mode }));
    let isDark = true;
    if (mode === 'light') isDark = false;
    else if (mode === 'dark') isDark = true;
    else isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  };

  const handleSave = () => {
    onSaveSettings(formData);
    onClose();
  };

  return (
    <div id="settings-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div 
        id="settings-modal-card" 
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-900 dark:ring-white/10"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/70">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-indigo-600 text-slate-950 shadow-md">
              <i className="fa-solid fa-sliders text-lg text-slate-950"></i>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">System Settings & Agents</h2>
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                  Custom Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customize appearance, location-based market intelligence, AI Chat Agent knowledge, and AI Video character styles.
              </p>
            </div>
          </div>
          <button
            id="btn-close-settings"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-2">
          <button
            id="tab-set-appearance"
            onClick={() => setActiveTab('appearance')}
            className={`flex items-center space-x-2 border-b-2 px-4 py-3 text-xs font-semibold transition ${
              activeTab === 'appearance'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <i className="fa-solid fa-palette"></i>
            <span>Theme & Display</span>
          </button>

          <button
            id="tab-set-location"
            onClick={() => setActiveTab('location')}
            className={`flex items-center space-x-2 border-b-2 px-4 py-3 text-xs font-semibold transition ${
              activeTab === 'location'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <i className="fa-solid fa-location-crosshairs"></i>
            <span>Location & Market Context</span>
            {formData.location.hasGrantedPermission && (
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            )}
          </button>

          <button
            id="tab-set-chat-agent"
            onClick={() => setActiveTab('chat_agent')}
            className={`flex items-center space-x-2 border-b-2 px-4 py-3 text-xs font-semibold transition ${
              activeTab === 'chat_agent'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <i className="fa-solid fa-robot"></i>
            <span>AI Chat Agent Setup</span>
          </button>

          <button
            id="tab-set-video-agent"
            onClick={() => setActiveTab('video_agent')}
            className={`flex items-center space-x-2 border-b-2 px-4 py-3 text-xs font-semibold transition ${
              activeTab === 'video_agent'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <i className="fa-solid fa-film"></i>
            <span>AI Video Agent Setup</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: THEME & DISPLAY */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-white">Interface Theme Mode</h4>
                <p className="text-xs text-slate-400 mt-0.5">Choose your preferred visual presentation style.</p>

                <div className="mt-4 grid grid-cols-3 gap-4">
                  {/* Dark Mode */}
                  <button
                    type="button"
                    onClick={() => handleSelectTheme('dark')}
                    className={`flex flex-col items-center justify-center rounded-xl border p-4 text-center transition ${
                      formData.themeMode === 'dark'
                        ? 'border-amber-400 bg-amber-500/10 text-amber-600 dark:text-amber-300 shadow-md ring-1 ring-amber-400/30'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 border border-slate-700 text-amber-400">
                      <i className="fa-solid fa-moon text-lg"></i>
                    </div>
                    <span className="text-xs font-bold">Dark Slate</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">High-contrast executive mode</span>
                  </button>

                  {/* Light Mode */}
                  <button
                    type="button"
                    onClick={() => handleSelectTheme('light')}
                    className={`flex flex-col items-center justify-center rounded-xl border p-4 text-center transition ${
                      formData.themeMode === 'light'
                        ? 'border-amber-400 bg-amber-500/10 text-amber-600 dark:text-amber-300 shadow-md ring-1 ring-amber-400/30'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 border border-amber-200 text-amber-600">
                      <i className="fa-solid fa-sun text-lg"></i>
                    </div>
                    <span className="text-xs font-bold">Light Crisp</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Clean daylight readability</span>
                  </button>

                  {/* System Mode */}
                  <button
                    type="button"
                    onClick={() => handleSelectTheme('system')}
                    className={`flex flex-col items-center justify-center rounded-xl border p-4 text-center transition ${
                      formData.themeMode === 'system'
                        ? 'border-amber-400 bg-amber-500/10 text-amber-600 dark:text-amber-300 shadow-md ring-1 ring-amber-400/30'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 border border-indigo-200 text-indigo-600 dark:bg-slate-800 dark:border-slate-700 dark:text-indigo-400">
                      <i className="fa-solid fa-desktop text-lg"></i>
                    </div>
                    <span className="text-xs font-bold">System Default</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Match OS theme setting</span>
                  </button>
                </div>
              </div>

              {/* Quick Link to Connectors */}
              <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
                    <i className="fa-solid fa-plug"></i>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Need to configure API Keys & Cloud Storage?</h5>
                    <p className="text-[11px] text-slate-400">API keys and credentials for AI, Drive, Mail, Social, and Video are managed in the Connectors hub.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenConnectors();
                  }}
                  className="rounded-lg border border-indigo-400/40 bg-indigo-500/20 px-3.5 py-1.5 text-xs font-bold text-indigo-200 hover:bg-indigo-500/30 transition"
                >
                  Open Connectors
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: LOCATION & MARKET CONTEXT */}
          {activeTab === 'location' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                    <i className="fa-solid fa-earth-americas"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Regional Arbitrage & Uniqueness Detector</h4>
                    <p className="text-xs text-slate-400">
                      Detects if an idea discussed in chat is unique / not yet established in your country, and triggers an autonomous alert.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRequestLocation}
                  disabled={locating}
                  className="flex items-center space-x-2 rounded-lg border border-emerald-500/40 bg-emerald-500/20 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 transition disabled:opacity-50"
                >
                  {locating ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-location-arrow"></i>}
                  <span>{formData.location.hasGrantedPermission ? 'Refresh Location' : 'Allow Location'}</span>
                </button>
              </div>

              {locMessage && (
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs text-slate-300 flex items-center space-x-2">
                  <i className="fa-solid fa-info-circle text-amber-400"></i>
                  <span>{locMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300">Target Country / Local Base</label>
                  <select
                    value={formData.location.country}
                    onChange={(e) => setFormData({
                      ...formData,
                      location: { ...formData.location, country: e.target.value, hasGrantedPermission: true }
                    })}
                    className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-200 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="India">🇮🇳 India (Bangalore / Mumbai / NCR / Tier-2)</option>
                    <option value="United States">🇺🇸 United States (Silicon Valley / NY / Austin)</option>
                    <option value="United Arab Emirates">🇦🇪 United Arab Emirates (Dubai / Abu Dhabi)</option>
                    <option value="United Kingdom">🇬🇧 United Kingdom (London / Cambridge)</option>
                    <option value="Germany">🇩🇪 Germany (Berlin / Munich)</option>
                    <option value="Singapore">🇸🇬 Singapore & Southeast Asia</option>
                    <option value="Saudi Arabia">🇸🇦 Saudi Arabia (Riyadh / NEOM)</option>
                    <option value="Canada">🇨🇦 Canada (Toronto / Vancouver)</option>
                    <option value="Australia">🇦🇺 Australia (Sydney / Melbourne)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300">Opportunity Sensitivity</label>
                  <select
                    value={formData.chatAgent.opportunitySensitivity}
                    onChange={(e) => setFormData({
                      ...formData,
                      chatAgent: { ...formData.chatAgent, opportunitySensitivity: e.target.value as any }
                    })}
                    className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-200 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="aggressive">Aggressive (Triggers on any early commercial spark)</option>
                    <option value="high">High (Recommended: triggers on viable venture models)</option>
                    <option value="medium">Medium (Requires detailed business discussion)</option>
                  </select>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-300">
                  <i className="fa-solid fa-bullseye"></i>
                  <span>How the Background Intelligence Works:</span>
                </div>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  As you brainstorm in chat, the background agent matches conversational concepts against real-time global trade patterns. If an idea has achieved high revenue overseas but is nascent in <strong className="text-white">{formData.location.country}</strong>, an interactive notification badge will immediately appear with 1-click blueprint and AI video generation.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: AI CHAT AGENT SETUP */}
          {activeTab === 'chat_agent' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300">Custom Agent Persona Name</label>
                  <input
                    type="text"
                    value={formData.chatAgent.customPersonaName}
                    onChange={(e) => setFormData({
                      ...formData,
                      chatAgent: { ...formData.chatAgent, customPersonaName: e.target.value }
                    })}
                    placeholder="e.g. Vyuha Senior Strategic Partner"
                    className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-200 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300">Primary Strategic Arbitrage Lens</label>
                  <select
                    value={formData.chatAgent.arbitrageMode}
                    onChange={(e) => setFormData({
                      ...formData,
                      chatAgent: { ...formData.chatAgent, arbitrageMode: e.target.value as any }
                    })}
                    className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-200 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="india-us-crossborder">Cross-Border Arbitrage (Global Demand + Talent)</option>
                    <option value="domestic-tier2-3">Domestic Hyperlocal & Supply Chain Compression</option>
                    <option value="b2b-gcc-automation">B2B GCC & Captive Engineering Infrastructure</option>
                    <option value="d2c-premium">D2C Premium Brand Exports & Consumables</option>
                    <option value="custom">Custom Proprietary Framework</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Custom System Prompt & Directives (Feed with specific rules)
                </label>
                <textarea
                  rows={4}
                  value={formData.chatAgent.systemPrompt}
                  onChange={(e) => setFormData({
                    ...formData,
                    chatAgent: { ...formData.chatAgent, systemPrompt: e.target.value }
                  })}
                  placeholder="Define specific instructions, tone, framework rules (e.g. 'Always analyze EBITDA margins first and propose a 30-day MVP')..."
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 placeholder-slate-600 focus:border-amber-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300">
                  Knowledge Sharing & Base Context (Paste proprietary notes, company data, industry reports)
                </label>
                <textarea
                  rows={4}
                  value={formData.chatAgent.knowledgeBaseText}
                  onChange={(e) => setFormData({
                    ...formData,
                    chatAgent: { ...formData.chatAgent, knowledgeBaseText: e.target.value }
                  })}
                  placeholder="Paste proprietary knowledge, market research, ICP definitions, unit economics benchmarks..."
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 placeholder-slate-600 focus:border-amber-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Temperature / Analytical Rigor: {formData.chatAgent.temperature}</span>
                  <span className="text-slate-500 font-normal">0.0 (Strict / Deterministic) — 1.0 (Creative Venture Ideation)</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.1"
                  value={formData.chatAgent.temperature}
                  onChange={(e) => setFormData({
                    ...formData,
                    chatAgent: { ...formData.chatAgent, temperature: parseFloat(e.target.value) }
                  })}
                  className="mt-2 w-full accent-amber-400"
                />
              </div>
            </div>
          )}

          {/* TAB 4: AI VIDEO AGENT SETUP */}
          {activeTab === 'video_agent' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300">AI Character Archetype</label>
                  <select
                    value={formData.videoAgent.characterArchetype}
                    onChange={(e) => setFormData({
                      ...formData,
                      videoAgent: { ...formData.videoAgent, characterArchetype: e.target.value as any }
                    })}
                    className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-200 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="tech_founder">Aiden Vance — Tech Founder & Architect</option>
                    <option value="mckinsey_partner">Eleanor Sterling — Senior Strategic Partner</option>
                    <option value="modern_creator">Kai Chen — Modern Venture Growth Director</option>
                    <option value="corporate_cfo">Marcus Reynolds — Capital Allocator & CFO</option>
                    <option value="ai_avatar_3d">Nexus-7 — 3D Autonomous AI Spokesperson</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300">Video Format & Style</label>
                  <select
                    value={formData.videoAgent.videoStyle}
                    onChange={(e) => setFormData({
                      ...formData,
                      videoAgent: { ...formData.videoAgent, videoStyle: e.target.value as any }
                    })}
                    className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-200 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="commercial_ad">High-Energy Commercial Ad (15s–30s)</option>
                    <option value="executive_explainer">Executive Business Explainer (60s)</option>
                    <option value="pitch_deck_60s">Investor 60-Second Lightning Pitch</option>
                    <option value="product_demo">Product Demo & ROI Walkthrough</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300">Video Aspect Ratio</label>
                  <select
                    value={formData.videoAgent.aspectRatio}
                    onChange={(e) => setFormData({
                      ...formData,
                      videoAgent: { ...formData.videoAgent, aspectRatio: e.target.value as any }
                    })}
                    className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-200 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="16:9">16:9 Landscape (Desktop / YouTube / Pitch Decks)</option>
                    <option value="9:16">9:16 Vertical (Instagram Reels / TikTok / Shorts)</option>
                    <option value="1:1">1:1 Square (LinkedIn / Twitter Feeds)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300">Voice Narration Accent</label>
                  <select
                    value={formData.videoAgent.voiceAccent}
                    onChange={(e) => setFormData({
                      ...formData,
                      videoAgent: { ...formData.videoAgent, voiceAccent: e.target.value as any }
                    })}
                    className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-200 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="indian_executive">Executive Global Indian English (Polished)</option>
                    <option value="us_tech_founder">Silicon Valley US Tech Founder (Dynamic)</option>
                    <option value="british_formal">British Senior Partner (Authoritative)</option>
                    <option value="dubai_business">GCC / Middle East International Business</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300">Custom Video Prompt Template (Optional)</label>
                <textarea
                  rows={3}
                  value={formData.videoAgent.customVideoPromptTemplate}
                  onChange={(e) => setFormData({
                    ...formData,
                    videoAgent: { ...formData.videoAgent, customVideoPromptTemplate: e.target.value }
                  })}
                  placeholder="e.g. 'Cinematic lighting, high-contrast holographic data charts, confident posture with direct eye contact to camera lens'..."
                  className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 placeholder-slate-600 focus:border-amber-400 focus:outline-none font-mono"
                />
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/80 px-6 py-4">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <i className="fa-solid fa-check text-amber-400"></i>
            <span>Changes are saved automatically to your workspace profile.</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              id="btn-cancel-settings"
              onClick={onClose}
              className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              id="btn-save-settings"
              onClick={handleSave}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 active:scale-95 transition"
            >
              <i className="fa-solid fa-floppy-disk"></i>
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
