import React, { useState, useEffect } from 'react';
import { ChatSession, DeliverableSuite } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  onSelectSession: (sessionId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  sessions,
  onSelectSession
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredSessions = sessions.filter(s => {
    const titleMatch = s.title.toLowerCase().includes(query.toLowerCase());
    const msgMatch = s.messages.some(m => m.text.toLowerCase().includes(query.toLowerCase()));
    return titleMatch || msgMatch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/80 p-4 pt-20 backdrop-blur-md">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl shadow-black/80 ring-1 ring-white/10">
        
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/80 px-4 py-3">
          <i className="fa-solid fa-magnifying-glass mr-3 text-sm text-amber-400"></i>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search strategic chats, venture pitches, models (e.g. 'arbitrage', 'D2C', 'GCC')..."
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          <kbd className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filteredSessions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              <i className="fa-solid fa-folder-open mb-2 text-2xl text-slate-600 block"></i>
              No strategic threads found matching "{query}"
            </div>
          ) : (
            <div className="space-y-1">
              {filteredSessions.map(sess => {
                const pitchCount = sess.messages.filter(m => m.pitchCard).length;
                const suiteCount = sess.messages.filter(m => m.deliverableSuite).length;
                return (
                  <button
                    key={sess.id}
                    id={`search-item-${sess.id}`}
                    onClick={() => {
                      onSelectSession(sess.id);
                      onClose();
                    }}
                    className="flex w-full items-center justify-between rounded-xl p-3 text-left transition hover:bg-slate-800/80 active:bg-slate-800"
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-amber-400">
                        <i className="fa-solid fa-comments text-xs"></i>
                      </div>
                      <div className="truncate">
                        <h4 className="text-xs font-bold text-white truncate">{sess.title}</h4>
                        <p className="text-[10px] text-slate-400 truncate">
                          {sess.messages.length} messages • Updated {new Date(sess.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center space-x-1.5 pl-2">
                      {pitchCount > 0 && (
                        <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-300">
                          {pitchCount} Pitch
                        </span>
                      )}
                      {suiteCount > 0 && (
                        <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300">
                          Suite Active
                        </span>
                      )}
                      <i className="fa-solid fa-chevron-right text-[10px] text-slate-500"></i>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
