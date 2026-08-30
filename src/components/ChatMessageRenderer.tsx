import React from 'react';

interface ChatMessageRendererProps {
  content: string;
}

export const ChatMessageRenderer: React.FC<ChatMessageRendererProps> = ({ content }) => {
  // If content is a raw JSON string, try to parse and format gracefully
  const tryParseJSON = (text: string) => {
    const trimmed = text.trim();
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      try {
        const parsed = JSON.parse(trimmed);
        return parsed;
      } catch {
        return null;
      }
    }
    return null;
  };

  const parsedJson = tryParseJSON(content);

  if (parsedJson) {
    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          <i className="fa-solid fa-layer-group text-xs"></i>
          <span>Structured Commercial Intelligence</span>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {Object.entries(parsedJson).map(([key, val], idx) => {
            if (typeof val === 'string' || typeof val === 'number') {
              return (
                <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-zinc-800 dark:bg-zinc-950/60">
                  <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-zinc-400">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <p className="mt-0.5 text-xs font-semibold text-slate-900 dark:text-white">
                    {String(val)}
                  </p>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  }

  // Parse custom Markdown-like lines
  const lines = content.split('\n');

  const renderInlineStyles = (text: string) => {
    // Replace **bold** with <strong>
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
        return <em key={i} className="italic text-slate-700 dark:text-zinc-300">{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-amber-600 dark:bg-zinc-800 dark:text-amber-300">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: React.ReactNode[] = [];

  const flushList = () => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="my-2 space-y-1.5 pl-1">
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // 1. Headers (### or ## or #)
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <div key={index} className="mt-3 mb-1.5 flex items-center space-x-2 border-b border-amber-500/20 pb-1">
          <span className="h-2 w-2 rounded-full bg-amber-500"></span>
          <h4 className="text-xs font-black uppercase tracking-wide text-slate-900 dark:text-white">
            {trimmed.replace(/^###\s+/, '')}
          </h4>
        </div>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <div key={index} className="mt-3 mb-2 flex items-center space-x-2 border-b border-slate-200 pb-1 dark:border-zinc-800">
          <span className="h-2.5 w-2.5 rounded-md bg-gradient-to-br from-amber-500 to-amber-600"></span>
          <h3 className="text-sm font-black text-slate-900 dark:text-white">
            {trimmed.replace(/^##\s+/, '')}
          </h3>
        </div>
      );
      return;
    }

    // 2. Numbered Items (e.g. 1. Title: Description)
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numberedMatch) {
      flushList();
      const num = numberedMatch[1];
      const itemContent = numberedMatch[2];
      elements.push(
        <div key={index} className="my-1.5 flex items-start space-x-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 dark:border-zinc-800/80 dark:bg-zinc-950/40">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-[10px] font-extrabold text-amber-700 dark:text-amber-300">
            {num}
          </span>
          <div className="flex-1 text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
            {renderInlineStyles(itemContent)}
          </div>
        </div>
      );
      return;
    }

    // 3. Bullet points (* or -)
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      inList = true;
      const bulletText = trimmed.replace(/^[\*\-]\s+/, '');
      listItems.push(
        <li key={index} className="flex items-start space-x-2 text-xs text-slate-700 dark:text-zinc-300">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500"></span>
          <span className="flex-1 leading-relaxed">{renderInlineStyles(bulletText)}</span>
        </li>
      );
      return;
    }

    // 4. Horizontal dividers (---)
    if (trimmed === '---' || trimmed === '***') {
      flushList();
      elements.push(<hr key={index} className="my-3 border-slate-200 dark:border-zinc-800" />);
      return;
    }

    // 5. Normal paragraphs or empty lines
    flushList();
    if (trimmed === '') {
      elements.push(<div key={index} className="h-1.5" />);
    } else {
      elements.push(
        <p key={index} className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
          {renderInlineStyles(trimmed)}
        </p>
      );
    }
  });

  flushList();

  return <div className="space-y-1">{elements}</div>;
};

