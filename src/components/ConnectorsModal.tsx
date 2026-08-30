import React, { useState } from 'react';
import { ConnectorsConfig, AIProvider, DriveProvider, MailProvider, SocialAccountProvider, AIVideoProvider } from '../types';

interface ConnectorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectors: ConnectorsConfig;
  onSaveConnectors: (updated: ConnectorsConfig) => void;
}

const AI_MODELS_BY_PROVIDER: Record<AIProvider, { id: string; name: string; tag: string }[]> = {
  gemini: [
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash (Recommended - Ultra-Fast)', tag: 'Recommended' },
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro (Deep Strategic Reasoning)', tag: 'High-Rigor' },
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash (Fast Live Multimodal)', tag: 'Fast' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Stable Legacy)', tag: 'Stable' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (Complex Context)', tag: 'Pro' }
  ],
  openai: [
    { id: 'gpt-4o', name: 'GPT-4o (Omni Multimodal Flagship)', tag: 'Flagship' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Cost Efficient & Fast)', tag: 'Efficient' },
    { id: 'o3-mini', name: 'o3-mini (High Mathematical & Reasoning)', tag: 'Reasoning' },
    { id: 'o1', name: 'o1 (Deep Chain-of-Thought)', tag: 'Pro Reasoning' }
  ],
  claude: [
    { id: 'claude-3-7-sonnet', name: 'Claude 3.7 Sonnet (Hybrid Reasoning & Vision)', tag: 'Latest' },
    { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet (Strategic Architecture)', tag: 'Standard' },
    { id: 'claude-3-5-haiku', name: 'Claude 3.5 Haiku (Lightning Response)', tag: 'Fast' }
  ],
  deepseek: [
    { id: 'deepseek-chat', name: 'DeepSeek V3 (State of Art MoE Chat)', tag: 'Cost Arbitrage' },
    { id: 'deepseek-reasoner', name: 'DeepSeek R1 (Autonomous Mathematical Reasoning)', tag: 'Deep Thinking' }
  ],
  mistral: [
    { id: 'mistral-large-latest', name: 'Mistral Large 2 (Top Tier Reasoning)', tag: 'Enterprise' },
    { id: 'mistral-small-latest', name: 'Mistral Small (Fast Enterprise API)', tag: 'Lightweight' },
    { id: 'codestral-latest', name: 'Codestral (SOP & Code Generation)', tag: 'Technical' }
  ],
  groq: [
    { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B on Groq (800 T/s LPUs)', tag: 'Supercharged' },
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B (Ultra-Low Latency)', tag: 'Fast' }
  ],
  perplexity: [
    { id: 'sonar-pro', name: 'Sonar Pro (Live Web Search & Arbitrage Grounding)', tag: 'Live Data' },
    { id: 'sonar', name: 'Sonar (Fast Web Search)', tag: 'Search' },
    { id: 'sonar-reasoning', name: 'Sonar Reasoning (Deep Research Web Grounded)', tag: 'Research' }
  ]
};

const VIDEO_MODELS_BY_PROVIDER: Record<AIVideoProvider, { id: string; name: string }[]> = {
  runway: [
    { id: 'gen3a_turbo', name: 'Runway Gen-3 Alpha Turbo (High Fidelity Cinema)' },
    { id: 'gen2', name: 'Runway Gen-2 Commercial' }
  ],
  sora: [
    { id: 'sora-1.0-turbo', name: 'OpenAI Sora Turbo (Hyper-realistic Physics)' },
    { id: 'sora-1.0-commercial', name: 'OpenAI Sora Commercial (1080p Studio)' }
  ],
  pika: [
    { id: 'pika-2.0', name: 'Pika 2.0 Turbo (Creative VFX & Physics)' },
    { id: 'pika-1.5', name: 'Pika 1.5 Commercial' }
  ],
  kling: [
    { id: 'kling-v1.5-pro', name: 'Kling AI v1.5 Pro (High Resolution Fluid Avatar)' },
    { id: 'kling-v1.0', name: 'Kling AI v1.0 Standard' }
  ],
  heygen: [
    { id: 'avatar-iv-pro', name: 'HeyGen Interactive Avatar IV (Real-time LipSync)' },
    { id: 'photo-avatar-v3', name: 'HeyGen Studio Executive' }
  ],
  did: [
    { id: 'did-agent-studio', name: 'D-ID Real-time Conversational Agent' },
    { id: 'did-talk-v2', name: 'D-ID Expressive Avatar Video' }
  ],
  synthesia: [
    { id: 'studio-avatar-v4', name: 'Synthesia Studio Executive v4' },
    { id: 'expressive-multilingual', name: 'Synthesia Global Multilingual' }
  ],
  elevenlabs: [
    { id: 'eleven_multilingual_v2', name: 'ElevenLabs Voice & Video Sync Multilingual v2' },
    { id: 'eleven_turbo_v2_5', name: 'ElevenLabs Low-Latency Realtime' }
  ]
};

const SOCIAL_ACCOUNT_OPTIONS: { id: SocialAccountProvider; name: string; icon: string; defaultPlaceholder: string }[] = [
  { id: 'linkedin', name: 'LinkedIn Company / Executive Feed', icon: 'fa-brands fa-linkedin text-[#0a66c2]', defaultPlaceholder: 'https://linkedin.com/company/...' },
  { id: 'reddit', name: 'Reddit Industry Subreddits & Discussions', icon: 'fa-brands fa-reddit text-[#ff4500]', defaultPlaceholder: 'r/startups, r/entrepreneur, r/business' },
  { id: 'twitter', name: 'X / Twitter High-Signal Lists & Creators', icon: 'fa-brands fa-x-twitter text-slate-200', defaultPlaceholder: '@venturecapital, @techcrunch' },
  { id: 'hackernews', name: 'Hacker News Show HN & Ask HN', icon: 'fa-brands fa-y-combinator text-[#ff6600]', defaultPlaceholder: 'news.ycombinator.com/show' },
  { id: 'producthunt', name: 'Product Hunt Launch Stream', icon: 'fa-brands fa-product-hunt text-[#da552f]', defaultPlaceholder: 'producthunt.com/daily' },
  { id: 'substack', name: 'Substack & Tech Publication Feeds', icon: 'fa-solid fa-bookmark text-[#ff6719]', defaultPlaceholder: 'thegeneralist.substack.com' },
  { id: 'whatsapp', name: 'WhatsApp Business Broadcast Channel', icon: 'fa-brands fa-whatsapp text-[#25d366]', defaultPlaceholder: '+1 555 0192 837' },
  { id: 'telegram', name: 'Telegram Alpha & Strategic Groups', icon: 'fa-brands fa-telegram text-[#229ed9]', defaultPlaceholder: 't.me/venture_alpha_signals' },
  { id: 'slack', name: 'Slack Executive Pipeline Channel', icon: 'fa-brands fa-slack text-[#e01e5a]', defaultPlaceholder: '#market-arbitrage-alerts' },
  { id: 'discord', name: 'Discord Builder Community', icon: 'fa-brands fa-discord text-[#5865f2]', defaultPlaceholder: 'discord.gg/venturefactory' }
];

const AI_PROVIDER_METADATA: Record<AIProvider, { placeholder: string; hint: string; docUrl: string; docLabel: string; prefix: string }> = {
  gemini: {
    placeholder: 'AIzaSy...',
    hint: 'Google Gemini API key starting with AIzaSy...',
    docUrl: 'https://aistudio.google.com/app/apikey',
    docLabel: 'Get Gemini Key from Google AI Studio',
    prefix: 'AIzaSy'
  },
  claude: {
    placeholder: 'sk-ant-api03-...',
    hint: 'Anthropic Claude key starting with sk-ant-... (Direct browser access enabled)',
    docUrl: 'https://console.anthropic.com/settings/keys',
    docLabel: 'Get Claude Key from Anthropic Console',
    prefix: 'sk-ant'
  },
  openai: {
    placeholder: 'sk-proj-... or sk-...',
    hint: 'OpenAI key starting with sk-proj-... or sk-...',
    docUrl: 'https://platform.openai.com/api-keys',
    docLabel: 'Get OpenAI Key from platform.openai.com',
    prefix: 'sk-'
  },
  deepseek: {
    placeholder: 'dsk-...',
    hint: 'DeepSeek API key starting with dsk-... or sk-...',
    docUrl: 'https://platform.deepseek.com/api_keys',
    docLabel: 'Get DeepSeek Key from DeepSeek Platform',
    prefix: 'dsk'
  },
  groq: {
    placeholder: 'gsk_...',
    hint: 'Groq LPU speed API key starting with gsk_...',
    docUrl: 'https://console.groq.com/keys',
    docLabel: 'Get Groq Key from Groq Console',
    prefix: 'gsk_'
  },
  mistral: {
    placeholder: 'sk_mistral_...',
    hint: 'Mistral API key from La Plateforme',
    docUrl: 'https://console.mistral.ai/api-keys',
    docLabel: 'Get Mistral Key from Mistral Console',
    prefix: 'sk_'
  },
  perplexity: {
    placeholder: 'pplx-...',
    hint: 'Perplexity search grounding key starting with pplx-...',
    docUrl: 'https://www.perplexity.ai/settings/api',
    docLabel: 'Get Perplexity Key from Settings',
    prefix: 'pplx'
  }
};

export const ConnectorsModal: React.FC<ConnectorsModalProps> = ({
  isOpen,
  onClose,
  connectors,
  onSaveConnectors
}) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'social_accounts' | 'video' | 'drive' | 'mail'>('ai');
  const [formData, setFormData] = useState<ConnectorsConfig>(connectors);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAIProviderChange = (provider: AIProvider) => {
    const defaultModel = AI_MODELS_BY_PROVIDER[provider]?.[0]?.id || '';
    setFormData(prev => ({
      ...prev,
      ai: {
        ...prev.ai,
        provider,
        model: defaultModel
      }
    }));
    try {
      localStorage.setItem('connAiPlatform', provider);
      localStorage.setItem('connAiModel', defaultModel);
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

  const handleVideoProviderChange = (provider: AIVideoProvider) => {
    const defaultModel = VIDEO_MODELS_BY_PROVIDER[provider]?.[0]?.id || '';
    setFormData(prev => ({
      ...prev,
      video: {
        ...prev.video,
        provider,
        model: defaultModel
      }
    }));
  };

  const toggleSocialAccount = (provider: SocialAccountProvider) => {
    setFormData(prev => {
      const currentAccounts = prev.socialAccounts || {};
      const existing = currentAccounts[provider];
      const isCurrentlyEnabled = existing ? existing.isEnabled : (provider === 'linkedin' || provider === 'reddit' || provider === 'twitter');

      return {
        ...prev,
        socialAccounts: {
          ...currentAccounts,
          [provider]: {
            provider,
            accountHandleOrUrl: existing?.accountHandleOrUrl || '',
            apiKeyOrToken: existing?.apiKeyOrToken || '',
            isEnabled: !isCurrentlyEnabled
          }
        }
      };
    });
  };

  const handleSave = () => {
    onSaveConnectors(formData);
    try {
      localStorage.setItem('connAiPlatform', formData.ai.provider);
      localStorage.setItem('connAiApiKey', formData.ai.apiKey);
      localStorage.setItem('connAiModel', formData.ai.model);
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div id="connectors-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div 
        id="connectors-modal-card" 
        className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 text-slate-100 shadow-2xl ring-1 ring-white/10 dark:bg-black"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/60 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/25">
              <i className="fa-solid fa-plug text-lg"></i>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white sm:text-lg">Connectors & External Integrations</h2>
                <span className="rounded-full bg-violet-500/20 border border-violet-500/30 px-2 py-0.5 text-[10px] font-semibold text-violet-300">
                  Universal Hub
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Configure your custom AI models, Social Media Feeds for OmniPulse, AI Video engines, and Cloud storage.
              </p>
            </div>
          </div>
          <button
            id="btn-close-connectors"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/30 px-6 pt-2 overflow-x-auto">
          <button
            id="tab-conn-ai"
            onClick={() => setActiveTab('ai')}
            className={`flex items-center space-x-2 border-b-2 px-4 py-3 text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'ai'
                ? 'border-violet-400 text-violet-300 bg-violet-500/10'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <i className="fa-solid fa-brain text-sm"></i>
            <span>AI Platform & Models</span>
          </button>

          <button
            id="tab-conn-social"
            onClick={() => setActiveTab('social_accounts')}
            className={`flex items-center space-x-2 border-b-2 px-4 py-3 text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'social_accounts'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <i className="fa-solid fa-satellite-dish text-sm"></i>
            <span>Social Accounts / Feeds</span>
            <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-bold text-emerald-300">
              OmniPulse
            </span>
          </button>

          <button
            id="tab-conn-video"
            onClick={() => setActiveTab('video')}
            className={`flex items-center space-x-2 border-b-2 px-4 py-3 text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'video'
                ? 'border-pink-400 text-pink-300 bg-pink-500/10'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <i className="fa-solid fa-film text-sm"></i>
            <span>AI Video Engines</span>
          </button>

          <button
            id="tab-conn-drive"
            onClick={() => setActiveTab('drive')}
            className={`flex items-center space-x-2 border-b-2 px-4 py-3 text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'drive'
                ? 'border-blue-400 text-blue-300 bg-blue-500/10'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <i className="fa-solid fa-cloud text-sm"></i>
            <span>Cloud Storage</span>
          </button>

          <button
            id="tab-conn-mail"
            onClick={() => setActiveTab('mail')}
            className={`flex items-center space-x-2 border-b-2 px-4 py-3 text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'mail'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <i className="fa-solid fa-envelope text-sm"></i>
            <span>Mail Dispatch</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: AI PLATFORMS & MODELS */}
          {activeTab === 'ai' && (
            <div className="space-y-5">
              <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/20 text-violet-400">
                    <i className="fa-solid fa-microchip"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">AI Provider & Dynamic Model Identifier</h4>
                    <p className="text-xs text-zinc-400">
                      Select your strategic intelligence provider. Models dynamically update based on the chosen platform.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">Select AI Platform</label>
                  <select
                    id="select-ai-provider"
                    value={formData.ai.provider}
                    onChange={(e) => handleAIProviderChange(e.target.value as AIProvider)}
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-200 focus:border-violet-500 focus:outline-none"
                  >
                    <option value="gemini">Google Gemini (Gemini 2.5 Flash / Pro)</option>
                    <option value="openai">OpenAI (GPT-4o / GPT-4o-mini / o3-mini / o1)</option>
                    <option value="claude">Anthropic Claude (Claude 3.7 Sonnet / 3.5 Haiku)</option>
                    <option value="deepseek">DeepSeek AI (DeepSeek V3 / DeepSeek R1)</option>
                    <option value="groq">Groq LPU (Llama 3.3 70B / Mixtral 8x7B)</option>
                    <option value="mistral">Mistral AI (Mistral Large 2 / Codestral)</option>
                    <option value="perplexity">Perplexity AI (Sonar Pro / Sonar Reasoning)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    Model Identifier <span className="text-violet-400">(Available on {formData.ai.provider.toUpperCase()})</span>
                  </label>
                  <select
                    id="select-ai-model"
                    value={formData.ai.model}
                    onChange={(e) => setFormData({
                      ...formData,
                      ai: { ...formData.ai, model: e.target.value }
                    })}
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-200 focus:border-violet-500 focus:outline-none"
                  >
                    {(AI_MODELS_BY_PROVIDER[formData.ai.provider] || []).map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} [{m.tag}]
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-zinc-300">
                    API Key for {formData.ai.provider.toUpperCase()}
                  </label>
                  <a
                    href={AI_PROVIDER_METADATA[formData.ai.provider]?.docUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-medium text-violet-400 hover:text-violet-300 underline flex items-center space-x-1"
                  >
                    <span>{AI_PROVIDER_METADATA[formData.ai.provider]?.docLabel || 'Get API Key'}</span>
                    <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                  </a>
                </div>
                
                <div className="mt-1.5 relative flex items-center">
                  <input
                    id="input-ai-apikey"
                    type="password"
                    value={formData.ai.apiKey}
                    onChange={(e) => setFormData({
                      ...formData,
                      ai: { ...formData.ai, apiKey: e.target.value, isEnabled: true }
                    })}
                    placeholder={AI_PROVIDER_METADATA[formData.ai.provider]?.placeholder || "Apply You API Key"}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:border-violet-500 focus:outline-none font-mono"
                  />
                  {formData.ai.apiKey && formData.ai.apiKey !== 'Apply You API Key' && (
                    <span className="absolute right-3 rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      Key Set
                    </span>
                  )}
                </div>
                
                <div className="mt-1.5 flex flex-wrap items-center justify-between gap-1 text-[11px]">
                  <span className="text-zinc-400 font-mono">
                    Format: {AI_PROVIDER_METADATA[formData.ai.provider]?.hint}
                  </span>
                  <span className="text-zinc-500">
                    Fallback: Built-in Strategic Engine active if empty or guest mode.
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  Custom Base URL / API Gateway Endpoint (Optional)
                </label>
                <input
                  type="text"
                  value={formData.ai.apiEndpoint || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    ai: { ...formData.ai, apiEndpoint: e.target.value }
                  })}
                  placeholder="https://api.openai.com/v1 or custom proxy..."
                  className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:border-violet-500 focus:outline-none font-mono"
                />
              </div>
            </div>
          )}

          {/* TAB 2: SOCIAL ACCOUNTS / FEEDS (OMNIPULSE FEEDS) */}
          {activeTab === 'social_accounts' && (
            <div className="space-y-5">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                    <i className="fa-solid fa-satellite-dish"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Social Accounts & Signal Stream Feeds</h4>
                    <p className="text-xs text-zinc-400">
                      Configure which social channels you actively follow. <strong>Only the enabled channels here will appear as filter options in OmniPulse Miner.</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {SOCIAL_ACCOUNT_OPTIONS.map((item) => {
                  const cfg = formData.socialAccounts?.[item.id];
                  // Default enable LinkedIn, Reddit, Twitter, HackerNews if not yet configured
                  const isEnabled = cfg !== undefined ? cfg.isEnabled : (item.id === 'linkedin' || item.id === 'reddit' || item.id === 'twitter' || item.id === 'hackernews');

                  return (
                    <div
                      key={item.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border p-3.5 transition ${
                        isEnabled
                          ? 'border-emerald-500/40 bg-emerald-950/15'
                          : 'border-zinc-800 bg-zinc-900/40 opacity-70'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-base">
                          <i className={item.icon}></i>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-white">{item.name}</span>
                            {isEnabled && (
                              <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-bold text-emerald-300">
                                Active Filter
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-zinc-400">
                            Signal Miner & Live Arbitrage Scanner
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={cfg?.accountHandleOrUrl || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              socialAccounts: {
                                ...(prev.socialAccounts || {}),
                                [item.id]: {
                                  provider: item.id,
                                  accountHandleOrUrl: val,
                                  apiKeyOrToken: cfg?.apiKeyOrToken || '',
                                  isEnabled: isEnabled
                                }
                              }
                            }));
                          }}
                          placeholder={item.defaultPlaceholder}
                          className="w-full sm:w-64 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => toggleSocialAccount(item.id)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition whitespace-nowrap ${
                            isEnabled
                              ? 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400'
                              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                          }`}
                        >
                          {isEnabled ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: AI VIDEO ENGINES */}
          {activeTab === 'video' && (
            <div className="space-y-5">
              <div className="rounded-xl border border-pink-500/20 bg-pink-500/5 p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-500/20 text-pink-400">
                    <i className="fa-solid fa-clapperboard"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Autonomous AI Video Studio Engine</h4>
                    <p className="text-xs text-zinc-400">
                      Select your commercial video generation provider. Models and avatars adjust automatically to your selection.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">Select Video Provider</label>
                  <select
                    id="select-video-provider"
                    value={formData.video.provider}
                    onChange={(e) => handleVideoProviderChange(e.target.value as AIVideoProvider)}
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-200 focus:border-pink-500 focus:outline-none"
                  >
                    <option value="runway">Runway ML (Gen-3 Alpha Turbo)</option>
                    <option value="sora">OpenAI Sora (High-Fidelity Cinema)</option>
                    <option value="kling">Kling AI (Photorealistic Motion & Physics)</option>
                    <option value="pika">Pika 2.0 (Dynamic Camera & VFX)</option>
                    <option value="heygen">HeyGen (Executive Studio Avatar)</option>
                    <option value="did">D-ID (Expressive Conversational Avatar)</option>
                    <option value="synthesia">Synthesia (Enterprise Commercials)</option>
                    <option value="elevenlabs">ElevenLabs (Voice & LipSync Studio)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    Video Model Identifier <span className="text-pink-400">(for {formData.video.provider.toUpperCase()})</span>
                  </label>
                  <select
                    id="select-video-model"
                    value={formData.video.model || VIDEO_MODELS_BY_PROVIDER[formData.video.provider]?.[0]?.id}
                    onChange={(e) => setFormData({
                      ...formData,
                      video: { ...formData.video, model: e.target.value }
                    })}
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-200 focus:border-pink-500 focus:outline-none"
                  >
                    {(VIDEO_MODELS_BY_PROVIDER[formData.video.provider] || []).map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  API Key for {formData.video.provider.toUpperCase()}
                </label>
                <input
                  type="password"
                  value={formData.video.apiKey}
                  onChange={(e) => setFormData({
                    ...formData,
                    video: { ...formData.video, apiKey: e.target.value, isEnabled: true }
                  })}
                  placeholder="Apply You API Key"
                  className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:border-pink-500 focus:outline-none font-mono"
                />
              </div>
            </div>
          )}

          {/* TAB 4: CLOUD STORAGE */}
          {activeTab === 'drive' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">Cloud Storage Provider</label>
                  <select
                    value={formData.drive.provider}
                    onChange={(e) => setFormData({
                      ...formData,
                      drive: { ...formData.drive, provider: e.target.value as DriveProvider }
                    })}
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-200 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="googledrive">Google Drive (Workspace / Shared Drive)</option>
                    <option value="sharepoint">Microsoft OneDrive & SharePoint</option>
                    <option value="awss3">Amazon Web Services (AWS S3 Bucket)</option>
                    <option value="dropbox">Dropbox Business</option>
                    <option value="box">Box.com Enterprise</option>
                    <option value="notion">Notion Workspace Database</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300">Target Folder / Bucket Path</label>
                  <input
                    type="text"
                    value={formData.drive.bucketOrFolder}
                    onChange={(e) => setFormData({
                      ...formData,
                      drive: { ...formData.drive, bucketOrFolder: e.target.value }
                    })}
                    placeholder="/VyuhaAI/Ventures"
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-200 focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300">Access Token / Service Secret</label>
                <input
                  type="password"
                  value={formData.drive.apiKey}
                  onChange={(e) => setFormData({
                    ...formData,
                    drive: { ...formData.drive, apiKey: e.target.value, isEnabled: true }
                  })}
                  placeholder="Apply You API Key"
                  className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:border-blue-500 focus:outline-none font-mono"
                />
              </div>
            </div>
          )}

          {/* TAB 5: MAIL DISPATCH */}
          {activeTab === 'mail' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">Mail Dispatch Provider</label>
                  <select
                    value={formData.mail.provider}
                    onChange={(e) => setFormData({
                      ...formData,
                      mail: { ...formData.mail, provider: e.target.value as MailProvider }
                    })}
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-200 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="gmail">Gmail API / OAuth</option>
                    <option value="outlook">Microsoft Outlook 365</option>
                    <option value="sendgrid">Twilio SendGrid API</option>
                    <option value="resend">Resend.com Developer API</option>
                    <option value="proton">ProtonMail Bridge</option>
                    <option value="smtp">Custom SMTP Server</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300">Default Recipient Email</label>
                  <input
                    type="email"
                    value={formData.mail.defaultRecipientEmail}
                    onChange={(e) => setFormData({
                      ...formData,
                      mail: { ...formData.mail, defaultRecipientEmail: e.target.value }
                    })}
                    placeholder="rajjaiswal60@gmail.com"
                    className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300">API Key / SMTP App Password</label>
                <input
                  type="password"
                  value={formData.mail.apiKey}
                  onChange={(e) => setFormData({
                    ...formData,
                    mail: { ...formData.mail, apiKey: e.target.value, isEnabled: true }
                  })}
                  placeholder="Apply You API Key"
                  className="mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:border-amber-500 focus:outline-none font-mono"
                />
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-900/80 px-6 py-4">
          <div className="flex items-center space-x-2 text-xs text-zinc-400">
            {savedSuccess ? (
              <span className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                <i className="fa-solid fa-check"></i>
                <span>Connectors saved successfully!</span>
              </span>
            ) : (
              <span>Values persist securely in your local environment.</span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              id="btn-cancel-connectors"
              onClick={onClose}
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 transition"
            >
              Cancel
            </button>
            <button
              id="btn-save-connectors"
              onClick={handleSave}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-indigo-500 active:scale-95 transition"
            >
              <i className="fa-solid fa-floppy-disk"></i>
              <span>Save Connectors</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
