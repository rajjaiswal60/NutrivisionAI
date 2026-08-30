import React, { useState } from 'react';
import { DeliverableSuite, UserSettings } from '../types';
import { formatWhatsAppShareText, generateWhatsAppLink } from '../utils/strategicAdvisorEngine';

interface WhatsAppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  suite: DeliverableSuite | null;
  settings: UserSettings;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  isOpen,
  onClose,
  suite,
  settings
}) => {
  const [phoneNumber, setPhoneNumber] = useState(settings.whatsappPhoneNumber || '');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !suite) return null;

  const formattedText = formatWhatsAppShareText(suite);
  const waLink = generateWhatsAppLink(suite, phoneNumber);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunch = () => {
    window.open(waLink, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-emerald-500/40 bg-slate-900 shadow-2xl shadow-emerald-950/40 ring-1 ring-emerald-500/30">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-emerald-950/20 p-5">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40">
              <i className="fa-brands fa-whatsapp text-xl"></i>
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Instant WhatsApp Briefing</h2>
              <p className="text-xs text-emerald-300/80">1-Click Zero-Friction Document Sharing</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-white">
            <i className="fa-solid fa-xmark text-base"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Target Phone Number (Optional with Country Code)
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              placeholder="e.g. +91 98765 43210 or leave blank for contact picker"
              className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Leaving this empty allows choosing any contact or group on WhatsApp.
            </p>
          </div>

          {/* Formatted Message Preview */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Live Formatted Payload Preview:
              </label>
              <button
                onClick={handleCopy}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                <i className={copied ? "fa-solid fa-check mr-1" : "fa-regular fa-copy mr-1"}></i>
                {copied ? 'Copied' : 'Copy Text'}
              </button>
            </div>
            <div className="mt-1.5 max-h-48 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/80 p-3 font-mono text-[11px] leading-relaxed text-slate-300 whitespace-pre-wrap">
              {formattedText}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-2.5 border-t border-slate-800 bg-slate-950/50 p-4">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            Cancel
          </button>
          <button
            id="btn-launch-whatsapp-modal"
            onClick={handleLaunch}
            className="flex items-center space-x-2 rounded-xl border border-emerald-400/50 bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:brightness-110 active:scale-95"
          >
            <i className="fa-brands fa-whatsapp text-sm"></i>
            <span>Launch WhatsApp Message</span>
          </button>
        </div>

      </div>
    </div>
  );
};
