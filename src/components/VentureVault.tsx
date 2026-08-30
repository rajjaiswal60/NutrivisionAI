import React, { useState } from 'react';
import { DeliverableSuite, UserSettings } from '../types';
import { exportSuiteToWord, exportSuiteToPowerPoint, exportSuiteToPDF, exportSuiteToMarkdown } from '../utils/documentExportUtils';

interface VentureVaultProps {
  suites: DeliverableSuite[];
  settings: UserSettings;
  onOpenSuiteInChat: (suite: DeliverableSuite) => void;
  onShareWhatsApp: (suite: DeliverableSuite) => void;
  onDispatchGmail: (suite: DeliverableSuite) => void;
  onSaveCloudVault: (suite: DeliverableSuite) => void;
  onExportMarkdown: (suite: DeliverableSuite) => void;
  onDeleteSuite: (suiteId: string) => void;
  onRenameSuite?: (suiteId: string, newTitle: string, newTagline?: string) => void;
}

export const VentureVault: React.FC<VentureVaultProps> = ({
  suites,
  settings,
  onOpenSuiteInChat,
  onShareWhatsApp,
  onDispatchGmail,
  onSaveCloudVault,
  onExportMarkdown,
  onDeleteSuite,
  onRenameSuite
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [editingSuiteId, setEditingSuiteId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editTagline, setEditTagline] = useState('');
  
  const userCountry = settings.location.country || 'Global';

  const filteredSuites = suites.filter(s =>
    s.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.tagline.toLowerCase().includes(searchFilter.toLowerCase()) ||
    (s.legalFramework?.jurisdiction || '').toLowerCase().includes(searchFilter.toLowerCase())
  );

  const startEditing = (suite: DeliverableSuite) => {
    setEditingSuiteId(suite.id);
    setEditTitle(suite.title);
    setEditTagline(suite.tagline);
  };

  const cancelEditing = () => {
    setEditingSuiteId(null);
    setEditTitle('');
    setEditTagline('');
  };

  const saveEditing = (suiteId: string) => {
    if (editTitle.trim() && onRenameSuite) {
      onRenameSuite(suiteId, editTitle.trim(), editTagline.trim() || undefined);
    }
    setEditingSuiteId(null);
  };

  return (
    <div id="venture-vault-view" className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-amber-50/40 p-6 shadow-xl ring-1 ring-black/5 dark:border-zinc-800 dark:from-zinc-950 dark:via-zinc-900/90 dark:to-amber-950/20 dark:ring-white/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-300 ring-1 ring-amber-500/40">
              <i className="fa-solid fa-folder-tree text-xl"></i>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">
                  Venture Factory Vault
                </h1>
                <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                  {suites.length} Distinct Blueprints
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-zinc-300">
                Manage, rename, and launch your executive commercial dossiers, execution architectures, and 5-level legal frameworks.
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="w-full sm:w-72">
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-xs text-slate-400 dark:text-zinc-400"></i>
              <input
                type="text"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                placeholder="Search by name, idea, or jurisdiction..."
                className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-white dark:placeholder:text-zinc-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Deliverable Suites */}
      <div className="mt-8">
        {filteredSuites.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-zinc-800/80 dark:bg-zinc-900/40">
            <i className="fa-solid fa-box-open mb-3 text-3xl text-slate-400 dark:text-zinc-600 block"></i>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {searchFilter ? 'No blueprints matched your search' : 'No Strategic Blueprints in Vault'}
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
              {searchFilter ? 'Try clearing the search filter.' : 'Brainstorm with the Strategic Advisor and click "Approve & Generate Suite" on any pitch card to archive it here.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {filteredSuites.map((suite, index) => {
              const isEditing = editingSuiteId === suite.id;
              const formattedDate = new Date(suite.createdAt).toLocaleDateString();
              const formattedTime = new Date(suite.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div
                  key={suite.id}
                  id={`vault-card-${suite.id}`}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-lg transition-all hover:border-amber-400 hover:shadow-amber-500/5 dark:border-zinc-800/90 dark:bg-zinc-900/80 dark:hover:border-amber-500/40 dark:hover:bg-zinc-900"
                >
                  <div>
                    {/* Top Row: Index Badge, Executive Blueprint Tag, and Exact Timestamp */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-1.5">
                        <span className="rounded bg-slate-900 px-2 py-0.5 font-mono text-[10px] font-extrabold text-amber-400 dark:bg-zinc-800">
                          #{String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="inline-flex items-center space-x-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                          <i className="fa-solid fa-crown text-[8px]"></i>
                          <span>Executive Blueprint</span>
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 dark:text-zinc-400">
                        <i className="fa-regular fa-clock text-[10px]"></i>
                        <span>{formattedDate} • {formattedTime}</span>
                      </div>
                    </div>

                    {/* Title & Tagline or Inline Rename Input */}
                    {isEditing ? (
                      <div className="mt-3 space-y-2 rounded-xl border border-amber-500/40 bg-amber-500/5 p-3">
                        <div>
                          <label className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-300">
                            Venture Name / Title:
                          </label>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                            placeholder="e.g. DhvaniAstro Vedic App"
                            autoFocus
                            onKeyDown={e => {
                              if (e.key === 'Enter') saveEditing(suite.id);
                              if (e.key === 'Escape') cancelEditing();
                            }}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-zinc-400">
                            Tagline / Subtitle:
                          </label>
                          <input
                            type="text"
                            value={editTagline}
                            onChange={e => setEditTagline(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-900 focus:border-amber-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                            placeholder="e.g. Low-latency AI digital twin astrologers"
                            onKeyDown={e => {
                              if (e.key === 'Enter') saveEditing(suite.id);
                              if (e.key === 'Escape') cancelEditing();
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-end space-x-2 pt-1">
                          <button
                            onClick={cancelEditing}
                            className="rounded px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 dark:text-zinc-400 dark:hover:bg-zinc-800"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => saveEditing(suite.id)}
                            className="rounded bg-amber-500 px-3 py-1 text-xs font-bold text-zinc-950 hover:bg-amber-400"
                          >
                            <i className="fa-solid fa-check mr-1"></i> Save Name
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 group">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            {suite.title}
                          </h3>
                          <button
                            onClick={() => startEditing(suite)}
                            className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-amber-600 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-amber-400"
                            title="Rename this Blueprint"
                          >
                            <i className="fa-solid fa-pencil text-xs"></i>
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-slate-600 dark:text-zinc-300 italic">
                          "{suite.tagline}"
                        </p>
                      </div>
                    )}

                    {/* Highlight Metrics */}
                    <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-center dark:border-zinc-800 dark:bg-zinc-950/60">
                      <div>
                        <span className="text-[10px] text-slate-500 dark:text-zinc-400 uppercase">Year 1 Target</span>
                        <p className="mt-0.5 text-[11px] font-bold text-slate-900 dark:text-white truncate">
                          {suite.executiveSummary.financialModel.year1Revenue}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 dark:text-zinc-400 uppercase">EBITDA Margin</span>
                        <p className="mt-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 truncate">
                          {suite.executiveSummary.financialModel.ebitdaMargin}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 dark:text-zinc-400 uppercase">Break-Even</span>
                        <p className="mt-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-300 truncate">
                          {suite.executiveSummary.financialModel.breakEvenMonth}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Vault Action Buttons */}
                  <div className="mt-5 border-t border-slate-200 dark:border-zinc-800 pt-4 space-y-3">
                    {/* Direct Document Export Row */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        onClick={() => exportSuiteToWord(suite, userCountry)}
                        className="flex items-center space-x-1 rounded-lg border border-blue-500/40 bg-blue-500/10 px-2 py-1 text-[11px] font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-500/20 active:scale-95 transition"
                        title="Download Word Document (.doc)"
                      >
                        <i className="fa-solid fa-file-word text-blue-500 dark:text-blue-400"></i>
                        <span>Word (.doc)</span>
                      </button>
                      <button
                        onClick={() => exportSuiteToPowerPoint(suite, userCountry)}
                        className="flex items-center space-x-1 rounded-lg border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 active:scale-95 transition"
                        title="Download Native PowerPoint Deck (.pptx)"
                      >
                        <i className="fa-solid fa-file-powerpoint text-amber-500 dark:text-amber-400"></i>
                        <span>Slides (.pptx)</span>
                      </button>
                      <button
                        onClick={() => exportSuiteToPDF(suite, userCountry)}
                        className="flex items-center space-x-1 rounded-lg border border-rose-500/40 bg-rose-500/10 px-2 py-1 text-[11px] font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-500/20 active:scale-95 transition"
                        title="Print or Save PDF"
                      >
                        <i className="fa-solid fa-file-pdf text-rose-500 dark:text-rose-400"></i>
                        <span>PDF</span>
                      </button>
                      <button
                        onClick={() => exportSuiteToMarkdown(suite, userCountry)}
                        className="flex items-center space-x-1 rounded-lg border border-slate-200 bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 active:scale-95 transition"
                        title="Export Markdown"
                      >
                        <i className="fa-solid fa-download text-amber-500 dark:text-amber-400"></i>
                        <span>Markdown</span>
                      </button>
                    </div>

                    {/* Primary Actions Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <button
                        onClick={() => onOpenSuiteInChat(suite)}
                        className="flex items-center space-x-1.5 rounded-lg border border-amber-500 bg-amber-500/20 px-3.5 py-1.5 text-xs font-bold text-amber-700 shadow-sm hover:bg-amber-500 hover:text-zinc-950 dark:border-amber-400/60 dark:bg-amber-500/15 dark:text-amber-300 dark:hover:bg-amber-400 dark:hover:text-zinc-950 active:scale-95 transition"
                        title="Open this blueprint in the Strategic Dossier Canvas"
                      >
                        <i className="fa-solid fa-expand text-xs"></i>
                        <span>Open in Dossier Canvas</span>
                      </button>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => startEditing(suite)}
                          className="rounded-lg border border-slate-200 bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-amber-400"
                          title="Rename Blueprint"
                        >
                          <i className="fa-solid fa-pen-to-square text-xs"></i>
                        </button>

                        <button
                          onClick={() => onShareWhatsApp(suite)}
                          className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400"
                          title="Share via WhatsApp"
                        >
                          <i className="fa-brands fa-whatsapp text-xs"></i>
                        </button>

                        <button
                          onClick={() => onDispatchGmail(suite)}
                          className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-rose-600 hover:bg-rose-500/20 dark:text-rose-400"
                          title="Dispatch via Gmail"
                        >
                          <i className="fa-solid fa-envelope text-xs"></i>
                        </button>

                        <button
                          onClick={() => onSaveCloudVault(suite)}
                          className="rounded-lg border border-violet-500/30 bg-violet-500/10 p-2 text-violet-600 hover:bg-violet-500/20 dark:text-violet-400"
                          title="Save to Cloud Drive"
                        >
                          <i className="fa-solid fa-cloud-arrow-up text-xs"></i>
                        </button>

                        <button
                          onClick={() => onDeleteSuite(suite.id)}
                          className="rounded-lg border border-slate-200 bg-slate-100 p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500 dark:hover:text-rose-400"
                          title="Delete from Vault"
                        >
                          <i className="fa-solid fa-trash-can text-xs"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
