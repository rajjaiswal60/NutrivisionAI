import React, { useState } from 'react';
import { DeliverableSuite, UserSettings } from '../types';
import { generateEmailPayload } from '../utils/strategicAdvisorEngine';

interface GmailDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  suite: DeliverableSuite | null;
  settings: UserSettings;
  onOpenSettings: () => void;
}

export const GmailDispatchModal: React.FC<GmailDispatchModalProps> = ({
  isOpen,
  onClose,
  suite,
  settings,
  onOpenSettings
}) => {
  const [recipient, setRecipient] = useState(settings.gmailRecipientEmail || 'rajjaiswal60@gmail.com');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen || !suite) return null;

  const emailPayload = generateEmailPayload(suite, recipient, settings.gmailSenderName);

  const handleSendApi = async () => {
    setIsSending(true);
    try {
      const res = await fetch('/api/integrations/dispatch-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: recipient,
          suiteTitle: suite.title,
          senderName: settings.gmailSenderName || 'Vyuha AI Advisor'
        })
      });
      const data = await res.json();
      setIsSending(false);
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        onClose();
      }, 1500);
    } catch (e) {
      setIsSending(false);
      // Fallback to mailto
      window.location.href = emailPayload.mailtoUrl;
      onClose();
    }
  };

  const handleMailtoLaunch = () => {
    window.location.href = emailPayload.mailtoUrl;
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-rose-500/40 bg-slate-900 shadow-2xl shadow-rose-950/40 ring-1 ring-rose-500/30">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-rose-950/20 p-5">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/40">
              <i className="fa-solid fa-envelope text-xl"></i>
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Gmail Executive Dispatch</h2>
              <p className="text-xs text-rose-300/80">Send complete executive blueprint directly to inbox</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-white">
            <i className="fa-solid fa-xmark text-base"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {!settings.gmailAutoDispatch && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-200 flex items-start space-x-2">
              <i className="fa-solid fa-triangle-exclamation text-amber-400 mt-0.5 shrink-0"></i>
              <div>
                <span>Gmail auto-dispatch is currently in client-mode. You can dispatch via your local mail client or enable background automation in Settings.</span>
                <button
                  onClick={() => {
                    onClose();
                    onOpenSettings();
                  }}
                  className="mt-1 block font-bold text-amber-300 underline hover:text-amber-200"
                >
                  Configure Gmail Auto-Dispatch in Settings →
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Target Recipient Email
            </label>
            <input
              type="email"
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
              placeholder="e.g. partner@firm.com"
              className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Email Subject Line:
            </label>
            <div className="mt-1 rounded-lg border border-slate-800 bg-slate-950/80 p-2 text-xs font-medium text-slate-200 truncate">
              {emailPayload.subject}
            </div>
          </div>

          {/* Email Preview */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Structured Body Preview:
            </label>
            <div className="mt-1.5 max-h-40 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/80 p-3 font-mono text-[11px] leading-relaxed text-slate-300 whitespace-pre-wrap">
              {emailPayload.body}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/50 p-4">
          <button
            onClick={handleMailtoLaunch}
            className="text-xs font-semibold text-slate-400 hover:text-slate-200"
          >
            <i className="fa-solid fa-arrow-up-right-from-square mr-1"></i>
            Open in Default Mail Client
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </button>
            <button
              id="btn-confirm-gmail-dispatch"
              onClick={handleSendApi}
              disabled={isSending}
              className="flex items-center space-x-2 rounded-xl border border-rose-400/50 bg-gradient-to-r from-rose-500 to-rose-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:brightness-110 active:scale-95"
            >
              {isSending ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Dispatching...</span>
                </>
              ) : sentSuccess ? (
                <>
                  <i className="fa-solid fa-check text-emerald-300"></i>
                  <span>Email Dispatched!</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane text-xs"></i>
                  <span>Dispatch Blueprint</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
