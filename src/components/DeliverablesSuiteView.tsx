import React, { useState } from 'react';
import { DeliverableSuite, UserSettings } from '../types';
import { exportSuiteToWord, exportSuiteToPowerPoint, exportSuiteToPDF } from '../utils/documentExportUtils';
import { generateLegalGovernanceFramework } from '../utils/strategicAdvisorEngine';

interface DeliverablesSuiteViewProps {
  suite: DeliverableSuite;
  settings: UserSettings;
  onShareWhatsApp: (suite: DeliverableSuite) => void;
  onDispatchGmail: (suite: DeliverableSuite) => void;
  onSaveCloudVault: (suite: DeliverableSuite) => void;
  onExportMarkdown: (suite: DeliverableSuite) => void;
  onOpenVideoStudio?: (suite: DeliverableSuite) => void;
}

export const DeliverablesSuiteView: React.FC<DeliverablesSuiteViewProps> = ({
  suite,
  settings,
  onShareWhatsApp,
  onDispatchGmail,
  onSaveCloudVault,
  onExportMarkdown,
  onOpenVideoStudio
}) => {
  const [activeTab, setActiveTab] = useState<'exec' | 'arch' | 'skills' | 'video' | 'legal'>('exec');
  const [selectedLegalLevel, setSelectedLegalLevel] = useState<number>(1);
  const [checkedChecklist, setCheckedChecklist] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopySection = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleChecklist = (itemKey: string) => {
    setCheckedChecklist(prev => ({ ...prev, [itemKey]: !prev[itemKey] }));
  };

  const videoData = suite.videoDeliverable;
  const userCountry = settings.location.country || 'Global';
  const legalFramework = suite.legalFramework || generateLegalGovernanceFramework({
    id: suite.id,
    title: suite.title,
    tagline: suite.tagline,
    userCountry
  } as any, userCountry);

  return (
    <div 
      id={`deliverables-suite-${suite.id}`}
      className="my-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-black/5 dark:border-zinc-800/90 dark:bg-zinc-950/95 dark:ring-white/10"
    >
      {/* Header Banner */}
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-amber-50/50 p-5 dark:border-zinc-800 dark:from-zinc-950 dark:via-zinc-900/90 dark:to-amber-950/25">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                <i className="fa-solid fa-crown text-[9px]"></i>
                <span>Executive Strategic Blueprint Suite</span>
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400">
                Generated {new Date(suite.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {userCountry}
              </span>
            </div>
            <h2 className="mt-1.5 text-lg font-extrabold text-slate-900 dark:text-white sm:text-xl">
              {suite.title}
            </h2>
            <p className="mt-0.5 text-xs text-slate-600 dark:text-zinc-300">
              {suite.tagline}
            </p>
          </div>

          {/* Quick Direct Document Export Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Word Document (.doc) */}
            <button
              id={`btn-export-word-${suite.id}`}
              onClick={() => exportSuiteToWord(suite, userCountry)}
              className="flex items-center space-x-1.5 rounded-lg border border-blue-500/40 bg-blue-500/10 px-2.5 py-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-500/20 active:scale-95 transition"
              title="Download Microsoft Word Document (.doc)"
            >
              <i className="fa-solid fa-file-word text-blue-500 dark:text-blue-400 text-xs"></i>
              <span className="hidden sm:inline">Word</span>
            </button>

            {/* PowerPoint Slide Deck (.pptx) */}
            <button
              id={`btn-export-ppt-${suite.id}`}
              onClick={() => exportSuiteToPowerPoint(suite, userCountry)}
              className="flex items-center space-x-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 active:scale-95 transition"
              title="Download Native PowerPoint Deck (.pptx)"
            >
              <i className="fa-solid fa-file-powerpoint text-amber-500 dark:text-amber-400 text-xs"></i>
              <span className="hidden sm:inline">PowerPoint (.pptx)</span>
            </button>

            {/* PDF Print / Export */}
            <button
              id={`btn-export-pdf-${suite.id}`}
              onClick={() => exportSuiteToPDF(suite, userCountry)}
              className="flex items-center space-x-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-2.5 py-1.5 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-500/20 active:scale-95 transition"
              title="Print or Save as PDF"
            >
              <i className="fa-solid fa-file-pdf text-rose-500 dark:text-rose-400 text-xs"></i>
              <span className="hidden sm:inline">PDF</span>
            </button>

            {/* AI Video Studio Button */}
            {onOpenVideoStudio && (
              <button
                onClick={() => onOpenVideoStudio(suite)}
                className="flex items-center space-x-1.5 rounded-lg border border-pink-500/40 bg-pink-500/20 px-3 py-1.5 text-xs font-bold text-pink-700 dark:text-pink-300 hover:bg-pink-500/30 active:scale-95 transition"
                title="Launch AI Video Commercial Studio"
              >
                <i className="fa-solid fa-clapperboard text-pink-500 dark:text-pink-400 text-xs"></i>
                <span>Video Studio</span>
              </button>
            )}
          </div>
        </div>

        {/* 5 Deliverable Navigation Tabs */}
        <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-200 pt-4 sm:grid-cols-3 lg:grid-cols-5 dark:border-zinc-800/80">
          <button
            id={`tab-deliv-exec-${suite.id}`}
            onClick={() => setActiveTab('exec')}
            className={`flex items-center justify-center space-x-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
              activeTab === 'exec'
                ? 'bg-amber-500/20 text-amber-700 shadow-md ring-1 ring-amber-500/50 dark:text-amber-300'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200'
            }`}
          >
            <i className="fa-solid fa-file-contract text-sm text-amber-500"></i>
            <span>Executive Summary</span>
          </button>

          <button
            id={`tab-deliv-arch-${suite.id}`}
            onClick={() => setActiveTab('arch')}
            className={`flex items-center justify-center space-x-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
              activeTab === 'arch'
                ? 'bg-amber-500/20 text-amber-700 shadow-md ring-1 ring-amber-500/50 dark:text-amber-300'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200'
            }`}
          >
            <i className="fa-solid fa-network-wired text-sm text-blue-500"></i>
            <span>Architecture (180-Day)</span>
          </button>

          <button
            id={`tab-deliv-skills-${suite.id}`}
            onClick={() => setActiveTab('skills')}
            className={`flex items-center justify-center space-x-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
              activeTab === 'skills'
                ? 'bg-amber-500/20 text-amber-700 shadow-md ring-1 ring-amber-500/50 dark:text-amber-300'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200'
            }`}
          >
            <i className="fa-solid fa-book-open-reader text-sm text-emerald-500"></i>
            <span>Skills E-Book</span>
          </button>

          <button
            id={`tab-deliv-video-${suite.id}`}
            onClick={() => setActiveTab('video')}
            className={`flex items-center justify-center space-x-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
              activeTab === 'video'
                ? 'bg-amber-500/20 text-amber-700 shadow-md ring-1 ring-amber-500/50 dark:text-amber-300'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200'
            }`}
          >
            <i className="fa-solid fa-clapperboard text-sm text-pink-500"></i>
            <span>AI Commercial Video</span>
          </button>

          <button
            id={`tab-deliv-legal-${suite.id}`}
            onClick={() => setActiveTab('legal')}
            className={`flex items-center justify-center space-x-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
              activeTab === 'legal'
                ? 'bg-amber-500/20 text-amber-700 shadow-md ring-1 ring-amber-500/50 dark:text-amber-300'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200'
            }`}
          >
            <i className="fa-solid fa-scale-balanced text-sm text-indigo-500"></i>
            <span>Legal & Governance (5 Levels)</span>
          </button>
        </div>
      </div>

      {/* Tab Content Body */}
      <div className="p-5 sm:p-6">
        
        {/* TAB 1: EXECUTIVE SUMMARY */}
        {activeTab === 'exec' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    <i className="fa-solid fa-eye mr-1.5"></i> Executive Vision
                  </h4>
                  <button
                    onClick={() => handleCopySection(suite.executiveSummary.vision, 'vision')}
                    className="text-zinc-500 hover:text-amber-400"
                  >
                    <i className={copiedKey === 'vision' ? "fa-solid fa-check text-emerald-400" : "fa-regular fa-copy"}></i>
                  </button>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-zinc-200">
                  {suite.executiveSummary.vision}
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">
                    <i className="fa-solid fa-triangle-exclamation mr-1.5"></i> Problem Statement
                  </h4>
                  <button
                    onClick={() => handleCopySection(suite.executiveSummary.problemStatement, 'problem')}
                    className="text-zinc-500 hover:text-rose-400"
                  >
                    <i className={copiedKey === 'problem' ? "fa-solid fa-check text-emerald-400" : "fa-regular fa-copy"}></i>
                  </button>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-zinc-200">
                  {suite.executiveSummary.problemStatement}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-950/15 p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  <i className="fa-solid fa-scale-balanced mr-1.5"></i> Market Arbitrage Thesis & Value Delta
                </h4>
                <button
                  onClick={() => handleCopySection(suite.executiveSummary.marketArbitrageThesis, 'thesis')}
                  className="text-zinc-400 hover:text-amber-300"
                >
                  <i className={copiedKey === 'thesis' ? "fa-solid fa-check text-emerald-400" : "fa-regular fa-copy"}></i>
                </button>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-zinc-200">
                {suite.executiveSummary.marketArbitrageThesis}
              </p>
            </div>

            {/* Financial Model Target Matrix */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                Financial Model Target Matrix
              </h4>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-center">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Year 1 Target</span>
                  <div className="mt-1 text-sm font-black text-amber-300">{suite.executiveSummary.financialModel.year1Revenue}</div>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-center">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Year 2 Target</span>
                  <div className="mt-1 text-sm font-black text-white">{suite.executiveSummary.financialModel.year2Revenue}</div>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-center">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Year 3 Target</span>
                  <div className="mt-1 text-sm font-black text-white">{suite.executiveSummary.financialModel.year3Revenue}</div>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-center">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Break-Even</span>
                  <div className="mt-1 text-sm font-black text-emerald-400">{suite.executiveSummary.financialModel.breakEvenMonth}</div>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-center">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">EBITDA Margin</span>
                  <div className="mt-1 text-sm font-black text-violet-400">{suite.executiveSummary.financialModel.ebitdaMargin}</div>
                </div>
              </div>
            </div>

            {/* Competitive Moats */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                Structural Moats & Defensibility
              </h4>
              <ul className="space-y-1.5">
                {suite.executiveSummary.competitiveMoats.map((moat, i) => (
                  <li key={i} className="flex items-start space-x-2 text-xs text-zinc-300">
                    <i className="fa-solid fa-shield-halved text-amber-400 mt-0.5 text-[11px]"></i>
                    <span>{moat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: PIN-TO-PLANE EXECUTION ARCHITECTURE */}
        {activeTab === 'arch' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {/* Phase 1 */}
              <div className="rounded-xl border border-amber-500/30 bg-zinc-900/80 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                    Phase 1: 0–30 Days
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">Pilot Sprint</span>
                </div>
                <ul className="space-y-2">
                  {suite.pinToPlaneArchitecture.phase1_30Days.map((item, i) => (
                    <li key={i} className="flex items-start space-x-2 text-xs text-zinc-200">
                      <i className="fa-solid fa-circle-check text-amber-400 mt-0.5 text-[11px]"></i>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Phase 2 */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-violet-500/20 px-2.5 py-0.5 text-[10px] font-bold text-violet-300">
                    Phase 2: 30–90 Days
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">Scale & GTM</span>
                </div>
                <ul className="space-y-2">
                  {suite.pinToPlaneArchitecture.phase2_90Days.map((item, i) => (
                    <li key={i} className="flex items-start space-x-2 text-xs text-zinc-200">
                      <i className="fa-solid fa-circle-check text-violet-400 mt-0.5 text-[11px]"></i>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Phase 3 */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                    Phase 3: 90–180 Days
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">Autonomous Scale</span>
                </div>
                <ul className="space-y-2">
                  {suite.pinToPlaneArchitecture.phase3_180Days.map((item, i) => (
                    <li key={i} className="flex items-start space-x-2 text-xs text-zinc-200">
                      <i className="fa-solid fa-circle-check text-emerald-400 mt-0.5 text-[11px]"></i>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Operational SOPs */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-3">
                Operational Standard Operating Procedures (SOPs)
              </h4>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {suite.pinToPlaneArchitecture.operationalSOPs.map((sop, i) => (
                  <div key={i} className="flex items-start space-x-2 rounded-lg bg-zinc-950 p-2.5 text-xs text-zinc-300">
                    <span className="font-bold text-amber-400">{i + 1}.</span>
                    <span>{sop}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: OPERATIONAL SKILLS & HIRING E-BOOK */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                Core Organizational Pod Roles & Target Compensation
              </h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {suite.skillsEBook.coreRoles.map((role, i) => (
                  <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-amber-300">{role.role}</span>
                      <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-300">
                        {role.salaryRange}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {role.profile}
                    </p>
                    <div className="text-[11px] text-zinc-400">
                      <strong className="text-zinc-300">Source:</strong> {role.sourcePool}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* KPI Cadence */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-3">
                Execution KPI Cadence & Monitoring
              </h4>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {suite.skillsEBook.kpiCadence.map((kpi, i) => (
                  <div key={i} className="rounded-lg bg-zinc-950 p-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-white">{kpi.metric}</span>
                      <span className="rounded bg-zinc-800 px-1.5 py-0.2 text-[9px] text-amber-400 font-bold uppercase">{kpi.frequency}</span>
                    </div>
                    <div className="mt-1 text-xs text-emerald-400 font-semibold">{kpi.target}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COMMERCIAL AI VIDEO DELIVERABLE */}
        {activeTab === 'video' && videoData && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-pink-500/30 bg-pink-950/20 p-4">
              <div className="flex items-center space-x-3">
                <img
                  src={videoData.avatarThumbnailUrl}
                  alt={videoData.characterName}
                  className="h-12 w-12 rounded-xl object-cover ring-2 ring-pink-500/50"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{videoData.title}</h4>
                  <p className="text-xs text-pink-300">
                    Narrated by <strong>{videoData.characterName}</strong> ({videoData.characterRole}) • {videoData.durationSeconds}s Duration
                  </p>
                </div>
              </div>

              {onOpenVideoStudio && (
                <button
                  onClick={() => onOpenVideoStudio(suite)}
                  className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-pink-500/20 hover:from-pink-500 hover:to-rose-500 active:scale-95 transition"
                >
                  <i className="fa-solid fa-play text-xs"></i>
                  <span>Launch Interactive Video Player</span>
                </button>
              )}
            </div>

            {/* Storyboard Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {videoData.storyboard.map((scene) => (
                <div key={scene.id} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-pink-300">Scene {scene.sceneNumber}</span>
                    <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-300">{scene.timecode}</span>
                  </div>
                  <div className="rounded-lg bg-zinc-950 p-2.5 text-xs text-zinc-200 italic border-l-2 border-amber-400">
                    "{scene.voiceoverScript}"
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    <strong className="text-zinc-300">Visual:</strong> {scene.visualPrompt}
                  </p>
                  <div className="text-[10px] text-amber-300/80 font-semibold">
                    Overlay: {scene.onScreenText}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: LEGAL & CORPORATE GOVERNANCE (5 LEVELS) */}
        {activeTab === 'legal' && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 ring-1 ring-indigo-500/40">
                    <i className="fa-solid fa-scale-balanced text-lg"></i>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Sovereign Legal, Regulatory & Governance Architecture
                      </h4>
                      <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-300">
                        {legalFramework.jurisdiction}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-zinc-400">
                      {legalFramework.frameworkSummary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => exportSuiteToWord(suite, userCountry)}
                    className="flex items-center space-x-1 rounded-lg border border-blue-500/40 bg-blue-500/10 px-2.5 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-300 hover:bg-blue-500/20"
                    title="Export Legal Contracts (.doc)"
                  >
                    <i className="fa-solid fa-file-word text-blue-500"></i>
                    <span>Legal Pack (.doc)</span>
                  </button>
                  <button
                    onClick={() => exportSuiteToPowerPoint(suite, userCountry)}
                    className="flex items-center space-x-1 rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-300 hover:bg-amber-500/20"
                    title="Export Legal Slides (.pptx)"
                  >
                    <i className="fa-solid fa-file-powerpoint text-amber-500"></i>
                    <span>Slides (.pptx)</span>
                  </button>
                </div>
              </div>

              {/* 5-Level Pill Selector */}
              <div className="mt-4 grid grid-cols-2 gap-1.5 sm:grid-cols-5">
                {legalFramework.levels.map((lvl) => (
                  <button
                    key={lvl.levelNumber}
                    onClick={() => setSelectedLegalLevel(lvl.levelNumber)}
                    className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-center transition-all ${
                      selectedLegalLevel === lvl.levelNumber
                        ? 'border border-indigo-400 bg-indigo-500/20 text-indigo-700 shadow-md ring-1 ring-indigo-400/40 dark:text-indigo-300'
                        : 'border border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300 hover:text-slate-900 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:text-zinc-200'
                    }`}
                  >
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-500">
                      Level {lvl.levelNumber}
                    </span>
                    <span className="mt-0.5 text-xs font-bold truncate w-full">
                      {lvl.levelNumber === 1 ? 'Foundation & IP' : lvl.levelNumber === 2 ? 'Entity & Tax' : lvl.levelNumber === 3 ? 'Product & Privacy' : lvl.levelNumber === 4 ? 'Likeness & Contracts' : 'Payments & Governance'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Level Content Details */}
            {(() => {
              const curLevel = legalFramework.levels.find(l => l.levelNumber === selectedLegalLevel) || legalFramework.levels[0];
              if (!curLevel) return null;

              return (
                <div className="space-y-5">
                  {/* Level Header Info */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase">
                          Enforceable Compliance Tier {curLevel.levelNumber}
                        </span>
                        <h3 className="mt-1.5 text-base font-bold text-slate-900 dark:text-white">
                          {curLevel.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-zinc-400">
                          {curLevel.subtitle}
                        </p>
                      </div>

                      <button
                        onClick={() => handleCopySection(
                          curLevel.keyClauses.map(c => `${c.clauseTitle}\nAct: ${c.enforceableAct}\n\n${c.content}`).join('\n\n---\n\n'),
                          `level-${curLevel.levelNumber}`
                        )}
                        className="flex items-center space-x-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                      >
                        <i className={`fa-solid ${copiedKey === `level-${curLevel.levelNumber}` ? 'fa-check text-emerald-400' : 'fa-copy text-amber-400'} text-xs`}></i>
                        <span>{copiedKey === `level-${curLevel.levelNumber}` ? 'Copied Clauses!' : 'Copy Level Clauses'}</span>
                      </button>
                    </div>

                    {/* Statutory Authorities Badges */}
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-200 dark:border-zinc-800/80">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                        Statutory Regulatory Bodies:
                      </span>
                      {curLevel.statutoryBodies.map((body, bIdx) => (
                        <span
                          key={bIdx}
                          className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:text-indigo-300"
                        >
                          <i className="fa-solid fa-landmark mr-1 text-[8px]"></i>
                          {body}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Enforceable Clauses Grid */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center">
                      <i className="fa-solid fa-file-contract text-amber-500 mr-2"></i>
                      Statutory Clauses & Enforceable Provisions ({curLevel.keyClauses.length})
                    </h4>

                    <div className="grid grid-cols-1 gap-3">
                      {curLevel.keyClauses.map((clause, cIdx) => (
                        <div
                          key={cIdx}
                          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-amber-400 dark:border-zinc-800 dark:bg-zinc-950/70"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center space-x-2">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                                {cIdx + 1}
                              </span>
                              <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                                {clause.clauseTitle}
                              </h5>
                            </div>
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
                              <i className="fa-solid fa-gavel text-amber-500 mr-1 text-[8px]"></i>
                              {clause.enforceableAct}
                            </span>
                          </div>

                          <div className="mt-2.5 rounded-lg border-l-2 border-amber-500 bg-slate-50 p-3 text-xs leading-relaxed text-slate-700 dark:bg-zinc-900/80 dark:text-zinc-300">
                            {clause.content}
                          </div>

                          <div className="mt-2 flex justify-end">
                            <button
                              onClick={() => handleCopySection(clause.content, `clause-${curLevel.levelNumber}-${cIdx}`)}
                              className="text-[11px] font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 flex items-center space-x-1"
                            >
                              <i className={`fa-solid ${copiedKey === `clause-${curLevel.levelNumber}-${cIdx}` ? 'fa-check text-emerald-500' : 'fa-copy'} text-[10px]`}></i>
                              <span>{copiedKey === `clause-${curLevel.levelNumber}-${cIdx}` ? 'Copied' : 'Copy Clause'}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Statutory Action Checklist */}
                  <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center">
                      <i className="fa-solid fa-list-check text-emerald-500 mr-2"></i>
                      Statutory Action Checklist & Compliance Milestones
                    </h4>
                    <div className="mt-3 space-y-2">
                      {curLevel.actionChecklist.map((item, aIdx) => {
                        const itemKey = `${curLevel.levelNumber}-${aIdx}`;
                        const isDone = !!checkedChecklist[itemKey];

                        return (
                          <div
                            key={aIdx}
                            onClick={() => toggleChecklist(itemKey)}
                            className={`flex items-start space-x-3 rounded-lg border p-2.5 cursor-pointer transition ${
                              isDone
                                ? 'border-emerald-500/40 bg-emerald-500/10 text-slate-900 dark:text-white'
                                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300 dark:hover:bg-zinc-900'
                            }`}
                          >
                            <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                              isDone
                                ? 'border-emerald-500 bg-emerald-500 text-white'
                                : 'border-slate-400 bg-white dark:border-zinc-600 dark:bg-zinc-800'
                            }`}>
                              {isDone && <i className="fa-solid fa-check text-[10px]"></i>}
                            </div>
                            <span className={`text-xs ${isDone ? 'line-through text-slate-400 dark:text-zinc-400' : ''}`}>
                              {item}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 bg-zinc-950 p-4 sm:px-6">
        <div className="flex items-center space-x-2 text-xs text-zinc-400">
          <i className="fa-solid fa-share-nodes text-amber-400"></i>
          <span className="font-medium">1-Click Dispatch & Collaboration:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Action 1: Share via WhatsApp */}
          <button
            id={`btn-share-whatsapp-${suite.id}`}
            onClick={() => onShareWhatsApp(suite)}
            className="flex items-center space-x-2 rounded-xl border border-emerald-500/40 bg-emerald-600/20 px-3.5 py-2 text-xs font-bold text-emerald-300 shadow-sm transition-all hover:bg-emerald-600/30 active:scale-95"
            title="Generate WhatsApp brief & link"
          >
            <i className="fa-brands fa-whatsapp text-emerald-400 text-sm"></i>
            <span>Share via WhatsApp</span>
          </button>

          {/* Action 2: Dispatch via Mail */}
          <button
            id={`btn-dispatch-gmail-${suite.id}`}
            onClick={() => onDispatchGmail(suite)}
            className="flex items-center space-x-2 rounded-xl border border-rose-500/40 bg-rose-600/20 px-3.5 py-2 text-xs font-bold text-rose-300 shadow-sm transition-all hover:bg-rose-600/30 active:scale-95"
            title="Send executive blueprint via Mail"
          >
            <i className="fa-solid fa-envelope text-rose-400 text-sm"></i>
            <span>Dispatch via Mail</span>
          </button>

          {/* Action 3: Save to Cloud Vault */}
          <button
            id={`btn-save-vault-${suite.id}`}
            onClick={() => onSaveCloudVault(suite)}
            className="flex items-center space-x-2 rounded-xl border border-violet-500/40 bg-violet-600/20 px-3.5 py-2 text-xs font-bold text-violet-300 shadow-sm transition-all hover:bg-violet-600/30 active:scale-95"
            title="Save to Cloud Storage"
          >
            <i className="fa-solid fa-cloud-arrow-up text-violet-400 text-sm"></i>
            <span>Save to Cloud</span>
          </button>

          {/* Action 4: Markdown Export */}
          <button
            id={`btn-export-markdown-${suite.id}`}
            onClick={() => onExportMarkdown(suite)}
            className="flex items-center space-x-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 active:scale-95"
            title="Export Markdown file"
          >
            <i className="fa-solid fa-download text-xs text-amber-400"></i>
            <span>Markdown</span>
          </button>
        </div>
      </div>
    </div>
  );
};
