import React, { useState } from 'react';
import { OmniPulseSignal, SocialAccountProvider, UserSettings } from '../types';
import { generateOmniPulseSignals } from '../utils/strategicAdvisorEngine';

interface OmniPulseMinerProps {
  onTurnIntoVenturePitch: (signal: OmniPulseSignal) => void;
  settings: UserSettings;
  onOpenConnectors?: () => void;
}

const ALL_CHANNEL_DEFS: { id: SocialAccountProvider; label: string; icon: string; badge: string }[] = [
  { id: 'linkedin', label: 'LinkedIn Enterprise & Founders', icon: 'fa-brands fa-linkedin text-[#0a66c2]', badge: 'B2B Signals' },
  { id: 'reddit', label: 'Reddit (r/startups, r/business)', icon: 'fa-brands fa-reddit text-[#ff4500]', badge: 'Pain Points' },
  { id: 'twitter', label: 'X / Tech Scale-ups', icon: 'fa-brands fa-x-twitter text-slate-200', badge: 'Realtime Pulse' },
  { id: 'hackernews', label: 'HackerNews & Show HN', icon: 'fa-brands fa-y-combinator text-[#ff6600]', badge: 'Deep Tech' },
  { id: 'producthunt', label: 'ProductHunt Launches', icon: 'fa-brands fa-product-hunt text-[#da552f]', badge: 'GTM Launches' },
  { id: 'substack', label: 'Substack & Tech Publications', icon: 'fa-solid fa-bookmark text-[#ff6719]', badge: 'Thesis & Ops' },
  { id: 'whatsapp', label: 'WhatsApp Executive Channel', icon: 'fa-brands fa-whatsapp text-[#25d366]', badge: 'Direct Wire' },
  { id: 'telegram', label: 'Telegram Alpha Feeds', icon: 'fa-brands fa-telegram text-[#229ed9]', badge: 'Alpha Group' },
  { id: 'slack', label: 'Slack Pipeline Alerts', icon: 'fa-brands fa-slack text-[#e01e5a]', badge: 'Enterprise' },
  { id: 'discord', label: 'Discord Builder Communities', icon: 'fa-brands fa-discord text-[#5865f2]', badge: 'Dev Community' }
];

export const OmniPulseMiner: React.FC<OmniPulseMinerProps> = ({
  onTurnIntoVenturePitch,
  settings,
  onOpenConnectors
}) => {
  // Determine available channels strictly from Settings > Connectors > Social Accounts
  const configuredAccounts = settings.connectors.socialAccounts || {};
  
  // Filter only those channels that are enabled by the user
  const enabledChannels = ALL_CHANNEL_DEFS.filter(ch => {
    const item = configuredAccounts[ch.id];
    if (item !== undefined) {
      return item.isEnabled;
    }
    // Default fallback if user has not yet touched connectors: LinkedIn, Reddit, Twitter, HackerNews
    return ch.id === 'linkedin' || ch.id === 'reddit' || ch.id === 'twitter' || ch.id === 'hackernews';
  });

  const [selectedChannel, setSelectedChannel] = useState<SocialAccountProvider>(
    enabledChannels[0]?.id || 'linkedin'
  );
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'custom'>('7d');
  const [customFromDate, setCustomFromDate] = useState('2026-08-18');
  const [customToDate, setCustomToDate] = useState('2026-08-25');
  const [isScanning, setIsScanning] = useState(false);
  const [signals, setSignals] = useState<OmniPulseSignal[]>(() => 
    generateOmniPulseSignals((enabledChannels[0]?.id as any) || 'linkedin', 7)
  );

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const days = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : 30;
      setSignals(generateOmniPulseSignals(selectedChannel as any, days));
      setIsScanning(false);
    }, 850);
  };

  return (
    <div id="omnipulse-miner-view" className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header Banner */}
      <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-50 via-white to-amber-50/50 p-6 shadow-xl shadow-violet-950/5 ring-1 ring-black/5 dark:from-zinc-950 dark:via-violet-950/30 dark:to-black dark:ring-white/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-600 dark:text-violet-400 ring-1 ring-violet-500/40">
              <i className="fa-solid fa-satellite-dish text-xl text-amber-500 dark:text-amber-400"></i>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">
                  OmniPulse Social Miner
                </h1>
                <span className="rounded-full bg-violet-500/20 px-2.5 py-0.5 text-[10px] font-bold text-violet-700 dark:text-violet-300">
                  Live Feed Intelligence
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-zinc-300">
                Aggregates high-signal threads, customer complaints, and commercial demand exclusively across your configured <strong>Social Accounts</strong>.
              </p>
            </div>
          </div>

          {/* Trigger Scan Button */}
          <div className="flex items-center space-x-3">
            {onOpenConnectors && (
              <button
                id="btn-manage-social-connectors"
                onClick={onOpenConnectors}
                className="flex items-center space-x-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:border-violet-500/40 hover:text-slate-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:text-white transition"
              >
                <i className="fa-solid fa-gear text-xs text-violet-500 dark:text-violet-400"></i>
                <span>Configure Social Accounts</span>
              </button>
            )}
            <button
              id="btn-trigger-omnipulse-scan"
              onClick={handleScan}
              disabled={isScanning || enabledChannels.length === 0}
              className={`flex items-center space-x-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all shadow-lg active:scale-95 ${
                isScanning
                  ? 'border border-amber-500/40 bg-amber-500/20 text-amber-700 dark:text-amber-300 cursor-wait'
                  : 'border border-amber-400/50 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-black hover:brightness-110 shadow-amber-500/20'
              }`}
            >
              {isScanning ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin text-amber-500 dark:text-amber-300"></i>
                  <span>Mining Configured Feeds...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-satellite-dish text-black"></i>
                  <span>Scan Active Channels</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-slate-200 dark:border-zinc-800/80 pt-5 lg:grid-cols-12">
          {/* Channel Selectors */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Select Connected Social Stream ({enabledChannels.length} Active in Settings):
              </span>
            </div>

            {enabledChannels.length === 0 ? (
              <div className="mt-3 flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5">
                <div className="flex items-center space-x-2.5 text-xs text-amber-700 dark:text-amber-300">
                  <i className="fa-solid fa-triangle-exclamation text-amber-500 dark:text-amber-400"></i>
                  <span>No social channels currently enabled. Enable feeds in Connectors &gt; Social Accounts to mine live data.</span>
                </div>
                {onOpenConnectors && (
                  <button
                    onClick={onOpenConnectors}
                    className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-black hover:brightness-110"
                  >
                    Open Connectors
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {enabledChannels.map(ch => (
                  <button
                    key={ch.id}
                    id={`btn-channel-${ch.id}`}
                    onClick={() => setSelectedChannel(ch.id)}
                    className={`flex items-center space-x-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                      selectedChannel === ch.id
                        ? 'border-amber-400 bg-amber-500/20 text-amber-800 shadow-md ring-1 ring-amber-400/40 dark:text-amber-200'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:text-zinc-200'
                    }`}
                  >
                    <i className={ch.icon}></i>
                    <span>{ch.label}</span>
                    <span className="rounded bg-slate-200 px-1.5 py-0.2 text-[9px] font-bold text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
                      {ch.badge}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Time Range Selector */}
          <div className="lg:col-span-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Lookback Horizon:
            </span>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {(['24h', '7d', '30d'] as const).map(range => (
                <button
                  key={range}
                  id={`btn-timerange-${range}`}
                  onClick={() => setTimeRange(range)}
                  className={`rounded-xl border py-2 text-xs font-bold uppercase transition ${
                    timeRange === range
                      ? 'border-amber-400 bg-amber-500/20 text-amber-800 shadow-md ring-1 ring-amber-400/40 dark:text-amber-300'
                      : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:text-zinc-200'
                  }`}
                >
                  {range === '24h' ? 'Last 24h' : range === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Signals Feed */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Discovered Market Arbitrage Opportunities ({signals.length})
            </h2>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
              Live Feed Grounded
            </span>
          </div>
          <span className="text-xs text-slate-500 dark:text-zinc-400">
            Synthesized across {settings.location.country || 'Target Regional Market'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {signals.map(sig => (
            <div
              key={sig.id}
              id={`signal-card-${sig.id}`}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-lg transition-all hover:border-amber-400 hover:shadow-amber-500/5 dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:hover:border-amber-500/40 dark:hover:bg-zinc-900/90"
            >
              <div>
                {/* Top Metas */}
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-slate-100 dark:bg-zinc-800 px-2.5 py-0.5 text-[10px] font-bold capitalize text-slate-700 dark:text-zinc-300">
                    <i className="fa-solid fa-hashtag mr-1 text-slate-400 dark:text-zinc-400"></i>
                    {sig.channel}
                  </span>
                  
                  {/* Opportunity Score Pill */}
                  <div className="flex items-center space-x-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-xs font-extrabold text-amber-700 dark:text-amber-300">
                    <i className="fa-solid fa-fire text-amber-500 dark:text-amber-400 text-xs"></i>
                    <span>{sig.opportunityScore} / 100</span>
                  </div>
                </div>

                {/* Topic & Pain Point */}
                <h3 className="mt-3.5 text-sm font-bold text-slate-900 dark:text-white">
                  {sig.topic}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-zinc-300">
                  <strong className="text-rose-600 dark:text-rose-400 font-semibold">Pain Point:</strong> {sig.painPoint}
                </p>

                {/* Arbitrage Angle */}
                <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-50 dark:bg-amber-950/20 p-2.5">
                  <div className="text-[11px] font-bold text-amber-700 dark:text-amber-300">
                    <i className="fa-solid fa-bolt mr-1 text-amber-500 dark:text-amber-400"></i>
                    Arbitrage Angle:
                  </div>
                  <p className="mt-0.5 text-xs text-slate-700 dark:text-zinc-300 leading-snug">
                    {sig.arbitrageAngle}
                  </p>
                </div>

                {/* Suggested Venture Pitch */}
                <div className="mt-2.5 text-xs text-slate-500 dark:text-zinc-400">
                  <span className="font-semibold text-slate-700 dark:text-zinc-300">Suggested Model:</span> {sig.suggestedIdea}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 border-t border-slate-200 dark:border-zinc-800/80 pt-3.5">
                <button
                  id={`btn-turn-into-pitch-${sig.id}`}
                  onClick={() => onTurnIntoVenturePitch(sig)}
                  className="flex w-full items-center justify-center space-x-2 rounded-xl border border-amber-500/40 bg-amber-500/10 py-2 text-xs font-bold text-amber-700 dark:text-amber-300 transition-all hover:border-amber-400 hover:bg-amber-500/20 active:scale-98"
                >
                  <i className="fa-solid fa-wand-magic-sparkles text-xs"></i>
                  <span>Turn into Venture Pitch</span>
                  <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
