import React from 'react';
import { VenturePitchCardData } from '../types';

interface VenturePitchCardProps {
  pitch: VenturePitchCardData;
  onApproveAndGenerate: (pitch: VenturePitchCardData) => void;
  isGenerating?: boolean;
}

export const VenturePitchCard: React.FC<VenturePitchCardProps> = ({
  pitch,
  onApproveAndGenerate,
  isGenerating = false,
}) => {
  return (
    <div 
      id={`venture-pitch-card-${pitch.id}`}
      className="my-4 overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/30 p-5 shadow-xl shadow-amber-950/20 ring-1 ring-amber-500/20"
    >
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/20 pb-3.5">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40">
            <i className="fa-solid fa-rocket text-sm"></i>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Opportunity Detected
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300">
                Commercial Grade
              </span>
            </div>
            <h3 className="text-base font-bold text-white">
              {pitch.title}
            </h3>
          </div>
        </div>

        {/* Arbitrage Badge */}
        <div className="inline-flex items-center space-x-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-300">
          <i className="fa-solid fa-scale-balanced text-amber-400"></i>
          <span>{pitch.arbitrageMultiplier}</span>
        </div>
      </div>

      {/* Tagline */}
      <p className="mt-3 text-xs text-slate-300 italic">
        "{pitch.tagline}"
      </p>

      {/* Core Metrics Grid */}
      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {/* TAM / SAM / SOM */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Market Sizing (TAM)</span>
          <p className="mt-0.5 text-xs font-bold text-white truncate">{pitch.tam}</p>
          <span className="text-[10px] text-amber-400/90 font-medium">SOM: {pitch.som}</span>
        </div>

        {/* Target Margin */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Gross Margin</span>
          <p className="mt-0.5 text-sm font-extrabold text-emerald-400">{pitch.grossMargin}</p>
          <span className="text-[10px] text-slate-400 font-medium">High Cash Conversion</span>
        </div>

        {/* Unit Economics LTV/CAC */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Payback & LTV</span>
          <p className="mt-0.5 text-xs font-bold text-white">{pitch.paybackPeriod}</p>
          <span className="text-[10px] text-indigo-300 font-medium truncate block">LTV: {pitch.ltv}</span>
        </div>

        {/* Capital Required */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Pilot Capital</span>
          <p className="mt-0.5 text-xs font-bold text-amber-300">{pitch.capitalRequired}</p>
          <span className="text-[10px] text-slate-400 font-medium">Seed Stage Lean</span>
        </div>
      </div>

      {/* Arbitrage Rationale & Thesis */}
      <div className="mt-3.5 rounded-xl border border-slate-800/80 bg-slate-950/40 p-3">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-300">
          <i className="fa-solid fa-lightbulb text-amber-400"></i>
          <span>Strategic Arbitrage Leverage</span>
        </div>
        <p className="mt-1 text-xs text-slate-300 leading-relaxed">
          {pitch.arbitrageRationale}
        </p>
      </div>

      {/* Approve & Generate CTA */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center space-x-2 text-[11px] text-slate-400">
          <i className="fa-solid fa-layer-group text-amber-400"></i>
          <span>Output: Executive Summary, Pin-to-Plane Architecture & Team E-Book</span>
        </div>

        <button
          id={`btn-approve-suite-${pitch.id}`}
          onClick={() => onApproveAndGenerate(pitch)}
          disabled={isGenerating || pitch.approved}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-md active:scale-95 ${
            pitch.approved
              ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-300 cursor-default'
              : isGenerating
              ? 'border border-amber-500/40 bg-amber-500/20 text-amber-300 cursor-wait'
              : 'border border-amber-400/50 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-slate-950 hover:brightness-110 shadow-amber-500/20'
          }`}
        >
          {isGenerating ? (
            <>
              <i className="fa-solid fa-spinner fa-spin text-amber-300"></i>
              <span>Synthesizing Strategic Blueprint...</span>
            </>
          ) : pitch.approved ? (
            <>
              <i className="fa-solid fa-check text-emerald-400"></i>
              <span>Suite Generated Below</span>
            </>
          ) : (
            <>
              <i className="fa-solid fa-wand-magic-sparkles text-slate-950"></i>
              <span>Approve & Generate Suite</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
