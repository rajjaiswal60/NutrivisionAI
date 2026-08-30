import React, { useState, useRef, useEffect } from 'react';
import { ChatSession, DeliverableSuite, Message, QuickChoiceChip, UserSettings, VenturePitchCardData } from '../types';
import { VenturePitchCard } from './VenturePitchCard';
import { DeliverablesSuiteView } from './DeliverablesSuiteView';
import { 
  detectVentureOpportunity, 
  generateDynamicQuickOptions,
  generateFullDeliverableSuite,
  getInteractiveAdvisoryPlan 
} from '../utils/strategicAdvisorEngine';
import { callAIModel } from '../utils/aiDispatcher';
import { ChatMessageRenderer } from './ChatMessageRenderer';

interface ChatViewProps {
  session: ChatSession;
  settings: UserSettings;
  onUpdateSession: (updated: ChatSession) => void;
  onShareWhatsApp: (suite: DeliverableSuite) => void;
  onDispatchGmail: (suite: DeliverableSuite) => void;
  onSaveCloudVault: (suite: DeliverableSuite) => void;
  onExportMarkdown: (suite: DeliverableSuite) => void;
  onOpenConnectors: () => void;
  onOpenSettings: () => void;
  onOpenVideoStudio: (suite: DeliverableSuite) => void;
  freeCreditsRemaining: number;
  onConsumeFreeCredit: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  session,
  settings,
  onUpdateSession,
  onShareWhatsApp,
  onDispatchGmail,
  onSaveCloudVault,
  onExportMarkdown,
  onOpenConnectors,
  onOpenSettings,
  onOpenVideoStudio,
  freeCreditsRemaining,
  onConsumeFreeCredit
}) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'split' | 'chat' | 'canvas'>('split');
  const [mobileTab, setMobileTab] = useState<'chat' | 'canvas'>('chat');
  const [isListening, setIsListening] = useState(false);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userCountry = settings.location?.country || 'India';
  const hasCustomApiKey = Boolean(settings.connectors.ai.apiKey && settings.connectors.ai.apiKey !== 'Apply You API Key');

  const sessionSuites = session.messages
    .filter(m => m.deliverableSuite)
    .map(m => m.deliverableSuite as DeliverableSuite);

  const [activeDossierSuite, setActiveDossierSuite] = useState<DeliverableSuite | null>(() => {
    return sessionSuites.length > 0 ? sessionSuites[sessionSuites.length - 1] : null;
  });

  useEffect(() => {
    if (sessionSuites.length > 0) {
      setActiveDossierSuite(sessionSuites[sessionSuites.length - 1]);
    } else {
      setActiveDossierSuite(null);
    }
  }, [session.messages]);

  const starterSuggestions = [
    {
      label: 'AI Workflow Arbitrage',
      tagline: '78% Gross Margin Model',
      icon: 'fa-solid fa-microchip',
      prompt: `Help me evaluate a B2B AI Workflow Arbitrage model connecting Western healthcare/legal clients with ops in ${userCountry}.`
    },
    {
      label: `Micro-GCC in ${userCountry}`,
      tagline: '€180k LTV European Mid-Caps',
      icon: 'fa-solid fa-building-shield',
      prompt: `Structure a 15-person Micro-GCC captive engineering center in ${userCountry} for a European scale-up with unit economics.`
    },
    {
      label: 'Export D2C Premium Brand',
      tagline: '82% Margin Botanicals & FMCG',
      icon: 'fa-solid fa-gem',
      prompt: `Design an organic wellness export brand from ${userCountry} to Dubai and London with air courier unit economics.`
    },
    {
      label: 'Hyperlocal Supply Chain',
      tagline: 'Tier-2/3 MSME Supply Network',
      icon: 'fa-solid fa-truck-fast',
      prompt: `Create a micro-warehouse distribution network for ${userCountry} regional MSMEs with 30%+ gross margin.`
    }
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    if (!hasCustomApiKey && freeCreditsRemaining <= 0) {
      onOpenConnectors();
      return;
    }

    if (!hasCustomApiKey) {
      onConsumeFreeCredit();
    }

    const userMessage: Message = {
      id: 'msg_' + Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...session.messages, userMessage];
    const isFirstUserMessage = session.messages.length === 0;
    const isGreeting = /^(hi|hello|hey|how are you|how r u|who are you|what can you do|help|start|hola)[\.!\s\?]*$/i.test(text.trim());
    const newSessionTitle = isFirstUserMessage && !isGreeting
      ? (text.length > 40 ? text.substring(0, 38) + '...' : text)
      : session.title;

    const updatedSession: ChatSession = {
      ...session,
      title: newSessionTitle,
      messages: updatedMessages,
      updatedAt: new Date().toISOString()
    };

    onUpdateSession(updatedSession);
    setInputText('');
    setAttachedFileName(null);
    setIsLoading(true);

    try {
      const historyForPlan = updatedMessages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.text
      }));

      const cleanLower = text.toLowerCase();
      const isGenerateCommand = /generate|create blueprint|build canvas|synthesize|approve|generate suite|make blueprint|populate canvas|ready to build|build it/i.test(cleanLower);
      const isGreeting = /^(hi|hello|hey|start|hola|howdy)[\.!\s\?]*$/i.test(text.trim());
      const isSurprise = /surprise me|suggest|recommend|what should i build|give me an idea|profitable business/i.test(cleanLower);

      let replyText = '';
      let quickOptions: QuickChoiceChip[] | undefined = undefined;
      let pitchCard: VenturePitchCardData | null = null;
      let fullSuiteToAttach: DeliverableSuite | undefined = undefined;

      if (isGenerateCommand) {
        const plan = getInteractiveAdvisoryPlan(text, historyForPlan, userCountry);
        replyText = plan.replyText;
        quickOptions = plan.quickOptions;
        pitchCard = plan.pitchCard || null;
        if (plan.shouldAutoGenerateSuite && plan.pitchCard) {
          fullSuiteToAttach = generateFullDeliverableSuite(plan.pitchCard, settings);
          setActiveDossierSuite(fullSuiteToAttach);
        }
      } else if (isGreeting || isSurprise) {
        const plan = getInteractiveAdvisoryPlan(text, historyForPlan, userCountry);
        replyText = plan.replyText;
        quickOptions = plan.quickOptions;
        pitchCard = plan.pitchCard || null;
      } else {
        // Multi-provider AI dispatcher for live dynamic brainstorming
        try {
          const aiResponse = await callAIModel(text, {
            provider: settings.connectors.ai.platform,
            apiKey: settings.connectors.ai.apiKey,
            model: settings.connectors.ai.model,
            userCountry,
            systemPrompt: settings.customSystemPrompt || `You are Vyuha AI Strategic Advisor & Venture Architect. Help the user brainstorm, validate, and build high-margin business models in ${userCountry}.
CRITICAL INSTRUCTIONS:
1. Provide a sharp, concise 2-3 paragraph strategic response focusing on unit economics, regional arbitrage, target customer ICP, and monetization.
2. Never dump multi-page boilerplate or generic repetitive templates.
3. End with 2 sharp diagnostic questions to continue co-creating the business model with the user.`,
            history: historyForPlan
          });

          if (aiResponse && aiResponse.text && !aiResponse.isSimulatedFallback) {
            replyText = aiResponse.text;
            pitchCard = detectVentureOpportunity(text, aiResponse.text, userCountry, 'medium');
            quickOptions = generateDynamicQuickOptions(text, userCountry);
          } else {
            const plan = getInteractiveAdvisoryPlan(text, historyForPlan, userCountry);
            replyText = plan.replyText;
            quickOptions = plan.quickOptions;
            pitchCard = plan.pitchCard || null;
          }
        } catch (aiErr) {
          console.warn('AI query fallback to local advisory planner:', aiErr);
          const plan = getInteractiveAdvisoryPlan(text, historyForPlan, userCountry);
          replyText = plan.replyText;
          quickOptions = plan.quickOptions;
          pitchCard = plan.pitchCard || null;
        }
      }

      const advisorMessage: Message = {
        id: 'msg_' + Math.random().toString(36).substring(2, 9),
        sender: 'advisor',
        text: replyText,
        timestamp: new Date().toISOString(),
        quickOptions: quickOptions,
        pitchCard: isGenerateCommand && pitchCard ? { ...pitchCard, approved: true } : (pitchCard || undefined),
        deliverableSuite: fullSuiteToAttach,
        opportunityAlert: pitchCard ? {
          isUnique: true,
          country: userCountry,
          originMarket: pitchCard.detectedOriginMarket || 'Global Markets',
          arbitrageHeadline: `Strategic venture model identified in ${userCountry}.`
        } : undefined
      };

      onUpdateSession({
        ...updatedSession,
        title: fullSuiteToAttach ? fullSuiteToAttach.title : updatedSession.title,
        messages: [...updatedMessages, advisorMessage],
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Network issue calling advisor, utilizing client fallback');
      const plan = getInteractiveAdvisoryPlan(text, [], userCountry);

      const advisorMessage: Message = {
        id: 'msg_' + Math.random().toString(36).substring(2, 9),
        sender: 'advisor',
        text: plan.replyText,
        timestamp: new Date().toISOString(),
        quickOptions: plan.quickOptions,
        pitchCard: plan.pitchCard || undefined,
        opportunityAlert: plan.pitchCard ? {
          isUnique: true,
          country: userCountry,
          originMarket: 'Global Markets',
          arbitrageHeadline: `Unique venture opportunity detected in ${userCountry}!`
        } : undefined
      };

      onUpdateSession({
        ...updatedSession,
        messages: [...updatedMessages, advisorMessage],
        updatedAt: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprovePitch = (pitch: VenturePitchCardData, messageIndex: number) => {
    const fullSuite = generateFullDeliverableSuite(pitch, settings);
    
    const updatedMessages = [...session.messages];
    const targetMsg = updatedMessages[messageIndex];
    if (targetMsg && targetMsg.pitchCard) {
      targetMsg.pitchCard = {
        ...targetMsg.pitchCard,
        approved: true
      };
      targetMsg.deliverableSuite = fullSuite;
    }

    setActiveDossierSuite(fullSuite);
    setMobileTab('canvas');

    onUpdateSession({
      ...session,
      title: fullSuite.title,
      messages: updatedMessages,
      updatedAt: new Date().toISOString()
    });
  };

  const handleVoiceToggle = () => {
    if (!isListening) {
      setIsListening(true);
      setTimeout(() => {
        setInputText(`Analyze a cross-border AI consulting agency with 80% gross margin connecting US startups with developers in ${userCountry}`);
        setIsListening(false);
      }, 2000);
    } else {
      setIsListening(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFileName(file.name);
    }
  };

  return (
    <div id="vyuha-enterprise-studio" className="flex h-[calc(100vh-4.1rem)] w-full overflow-hidden bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* ------------------------------------------------------------- */}
      {/* LEFT PANE: STRATEGIC CONVERSATIONAL COCKPIT                  */}
      {/* ------------------------------------------------------------- */}
      <div 
        className={`flex flex-col h-full border-r border-slate-200 bg-slate-50 dark:border-zinc-800/80 dark:bg-zinc-950 transition-all duration-300 ${
          layoutMode === 'chat' 
            ? 'w-full max-w-5xl mx-auto' 
            : layoutMode === 'canvas' 
            ? 'hidden' 
            : 'w-full lg:w-[44%] xl:w-[40%] shrink-0'
        } ${mobileTab === 'canvas' ? 'hidden lg:flex' : 'flex'}`}
      >
        
        {/* Minimalist Clean Executive Chat Header */}
        <div className="flex h-11 items-center justify-between border-b border-slate-200 bg-white/95 px-3.5 text-xs backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/90 gap-2 shrink-0">
          {/* Left: Active Session & Geo Pill */}
          <div className="flex items-center space-x-2 min-w-0">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 ring-2 ring-amber-500/20 animate-pulse shrink-0"></span>
            <span className="font-bold text-slate-900 dark:text-white truncate max-w-[130px] sm:max-w-[190px]" title={session.title || 'New Strategic Mastermind'}>
              {session.title || 'New Strategic Mastermind'}
            </span>
            <span className="hidden sm:inline-flex items-center space-x-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300 shrink-0">
              <i className="fa-solid fa-location-dot text-[8px]"></i>
              <span>{userCountry}</span>
            </span>
          </div>

          {/* Right: Actions & Switcher */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => handleSendMessage('Suggest the top 3 highest ROI venture arbitrage business opportunities right now')}
              className="inline-flex items-center space-x-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-700 hover:bg-amber-500/20 dark:text-amber-300 transition"
              title="1-Click Top Arbitrage Inspiration"
            >
              <i className="fa-solid fa-dice text-amber-500 text-[10px]"></i>
              <span>Surprise Me</span>
            </button>

            {/* View Mode Switcher (Desktop) */}
            <div className="hidden sm:flex items-center space-x-0.5 rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-[11px] dark:border-zinc-800 dark:bg-zinc-950/80">
              <button
                onClick={() => setLayoutMode('split')}
                className={`flex items-center space-x-1 rounded px-2 py-0.5 font-semibold transition ${
                  layoutMode === 'split' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300' : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
                title="Dual Canvas (50/50 Workspace)"
              >
                <i className="fa-solid fa-columns text-[10px]"></i>
                <span className="hidden lg:inline text-[10px]">Dual</span>
              </button>
              <button
                onClick={() => setLayoutMode('chat')}
                className={`flex items-center space-x-1 rounded px-2 py-0.5 font-semibold transition ${
                  layoutMode === 'chat' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300' : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
                title="Focus Chat Stream"
              >
                <i className="fa-solid fa-comment-dots text-[10px]"></i>
                <span className="hidden lg:inline text-[10px]">Chat</span>
              </button>
              <button
                onClick={() => setLayoutMode('canvas')}
                className={`flex items-center space-x-1 rounded px-2 py-0.5 font-semibold transition ${
                  layoutMode === 'canvas' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300' : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
                title="Maximize Strategic Dossier Canvas"
              >
                <i className="fa-solid fa-expand text-[10px]"></i>
                <span className="hidden lg:inline text-[10px]">Canvas</span>
              </button>
            </div>

            {/* Mobile View Toggle */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setMobileTab('canvas')}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500 text-zinc-950 font-bold text-xs hover:brightness-110"
              >
                <span>Canvas</span>
                <i className="fa-solid fa-arrow-right text-[9px]"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Messages Stream Scroll Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {session.messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-violet-500/20 text-amber-500 dark:text-amber-400 ring-1 ring-amber-500/30">
                <i className="fa-solid fa-chess-knight text-2xl"></i>
              </div>
              <h3 className="mt-3 text-lg font-extrabold text-slate-900 dark:text-white">
                Vyuha Strategic Cockpit
              </h3>
              <p className="mt-1 max-w-sm text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                Describe a venture concept, market arbitrage angle, or request unit economics. The advisor analyzes market deltas and renders complete blueprints in the live canvas.
              </p>

              {/* Starter Quick Actions */}
              <div className="mt-5 grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                {starterSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(item.prompt)}
                    className="group rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-amber-400 hover:bg-amber-50/50 active:scale-98 dark:border-zinc-800/90 dark:bg-zinc-900/60 dark:hover:border-amber-500/40 dark:hover:bg-zinc-900"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 group-hover:text-amber-600 dark:text-zinc-200 dark:group-hover:text-amber-300">
                      <div className="flex items-center space-x-1.5">
                        <i className={`${item.icon} text-amber-500 dark:text-amber-400 text-[11px]`}></i>
                        <span>{item.label}</span>
                      </div>
                      <i className="fa-solid fa-chevron-right text-[9px] text-slate-400 group-hover:text-amber-500 dark:text-zinc-600 dark:group-hover:text-amber-400"></i>
                    </div>
                    <div className="mt-1 text-[10px] text-slate-500 dark:text-zinc-400 truncate">{item.tagline}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            session.messages.map((msg, idx) => (
              <div key={msg.id || idx} className="space-y-1">
                {msg.sender === 'user' ? (
                  /* User Bubble (Modern Right-Aligned) */
                  <div className="flex items-end justify-end space-x-2">
                    <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-tr-xs bg-gradient-to-r from-amber-500 to-amber-600 p-3.5 text-xs font-medium text-zinc-950 shadow-md">
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                      <div className="mt-1 text-right font-mono text-[10px] text-amber-950/70">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-zinc-950 shadow-sm">
                      <i className="fa-solid fa-user text-[10px]"></i>
                    </div>
                  </div>
                ) : (
                  /* Strategic Advisor Card (Modern Left-Aligned) */
                  <div className="flex items-start space-x-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-violet-600 text-white shadow-md ring-1 ring-amber-500/40">
                      <i className="fa-solid fa-chess-knight text-sm"></i>
                    </div>

                    <div className="max-w-[92%] sm:max-w-[88%] rounded-2xl rounded-tl-xs border border-slate-200 bg-white p-4 text-slate-800 shadow-md dark:border-zinc-800/90 dark:bg-zinc-900/90 dark:text-zinc-200">
                      {/* Advisor Header */}
                      <div className="mb-2.5 flex items-center justify-between border-b border-slate-100 pb-2 dark:border-zinc-800/80">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {settings.chatAgent.customPersonaName || 'Vyuha Strategic Advisor'}
                          </span>
                          <span className="inline-flex items-center space-x-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                            <i className="fa-solid fa-crown text-[8px]"></i>
                            <span>AI Partner</span>
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 text-[10px] text-slate-400 dark:text-zinc-500">
                          <span className="font-mono">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(msg.text);
                              setCopiedMsgId(msg.id || String(idx));
                              setTimeout(() => setCopiedMsgId(null), 2000);
                            }}
                            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-zinc-800 dark:hover:text-white transition"
                            title="Copy Message"
                          >
                            {copiedMsgId === (msg.id || String(idx)) ? (
                              <i className="fa-solid fa-check text-emerald-500"></i>
                            ) : (
                              <i className="fa-regular fa-copy"></i>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Clean Rich Markdown Prose */}
                      <ChatMessageRenderer content={msg.text} />

                      {/* Opportunity Detected Notification Badge */}
                      {msg.opportunityAlert && (
                        <div className="mt-3 flex items-start space-x-2.5 rounded-xl border border-emerald-500/40 bg-emerald-50 p-2.5 text-xs text-emerald-800 shadow-sm dark:bg-emerald-950/30 dark:text-emerald-200">
                          <i className="fa-solid fa-radar mt-0.5 animate-pulse text-emerald-500 dark:text-emerald-400"></i>
                          <div className="flex-1">
                            <span className="text-[11px] font-bold text-emerald-900 dark:text-white">Regional Arbitrage Signal: </span>
                            <span className="text-[11px] text-emerald-700 dark:text-emerald-300/90">{msg.opportunityAlert.arbitrageHeadline}</span>
                          </div>
                        </div>
                      )}

                      {/* Opportunity Card Action Beacon */}
                      {msg.pitchCard && !msg.deliverableSuite && (
                        <div className="mt-3">
                          <VenturePitchCard
                            pitch={msg.pitchCard}
                            onApproveAndGenerate={() => handleApprovePitch(msg.pitchCard!, idx)}
                            isGenerating={false}
                          />
                        </div>
                      )}

                      {/* Approved Blueprint Quick Jump Bar */}
                      {msg.deliverableSuite && (
                        <div className="mt-3 flex items-center justify-between rounded-xl border border-amber-500/40 bg-amber-50 p-3 shadow-md dark:bg-gradient-to-r dark:from-amber-950/30 dark:to-zinc-900/90">
                          <div className="flex items-center space-x-2">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white">{msg.deliverableSuite.title}</div>
                              <div className="text-[10px] text-amber-700 dark:text-amber-300/90">Complete 5-Deliverable Suite Generated</div>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setActiveDossierSuite(msg.deliverableSuite!);
                              setMobileTab('canvas');
                            }}
                            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition shadow-sm ${
                              activeDossierSuite?.id === msg.deliverableSuite.id
                                ? 'bg-amber-500 text-zinc-950 ring-2 ring-amber-400/50'
                                : 'bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-zinc-800 dark:text-amber-300 dark:hover:bg-zinc-700'
                            }`}
                          >
                            <span>{activeDossierSuite?.id === msg.deliverableSuite.id ? 'Viewing in Canvas' : 'Open in Canvas'}</span>
                            <i className="fa-solid fa-arrow-right text-[10px]"></i>
                          </button>
                        </div>
                      )}

                      {/* Interactive Quick-Choice Strategy Chips */}
                      {msg.quickOptions && msg.quickOptions.length > 0 && (
                        <div className="mt-3.5 space-y-2 border-t border-slate-100 pt-3 dark:border-zinc-800/80">
                          <div className="flex items-center text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                            <i className="fa-solid fa-wand-magic-sparkles mr-1.5 text-amber-500"></i>
                            <span>Interactive Strategy Options (Tap to Select):</span>
                          </div>
                          <div className="flex flex-wrap gap-2 pt-0.5">
                            {msg.quickOptions.map((opt, oIdx) => (
                              <button
                                key={oIdx}
                                onClick={() => handleSendMessage(opt.actionPrompt)}
                                className={`flex items-center space-x-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition active:scale-95 ${
                                  opt.isPrimary
                                    ? 'border border-amber-500 bg-amber-500 font-bold text-zinc-950 shadow-md hover:bg-amber-400'
                                    : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-amber-400 hover:bg-amber-50/50 hover:text-slate-900 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-200 dark:hover:border-amber-400 dark:hover:bg-zinc-800'
                                }`}
                              >
                                {opt.icon && <i className={`${opt.icon} text-[11px]`}></i>}
                                <span>{opt.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-3 rounded-2xl border border-slate-200 bg-white p-3.5 text-xs text-amber-700 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-amber-300">
                <i className="fa-solid fa-brain fa-pulse text-amber-500 dark:text-amber-400 text-sm"></i>
                <span>Synthesizing strategic advisory analysis...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Composer Deck */}
        <div className="border-t border-slate-200 bg-white p-3 dark:border-zinc-800/80 dark:bg-zinc-950">
          {attachedFileName && (
            <div className="mb-2 inline-flex items-center space-x-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs text-amber-700 dark:text-amber-300">
              <i className="fa-solid fa-paperclip"></i>
              <span>{attachedFileName}</span>
              <button onClick={() => setAttachedFileName(null)} className="text-slate-400 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-white">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          )}

          {/* Quick Interactive Idea Starters & Prompters */}
          <div className="mb-2.5 flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              type="button"
              onClick={() => handleSendMessage('Suggest the top 3 highest ROI venture arbitrage business opportunities right now')}
              className="flex items-center space-x-1.5 whitespace-nowrap rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-[11px] font-bold text-amber-700 hover:bg-amber-500/20 dark:text-amber-300 transition shrink-0"
            >
              <i className="fa-solid fa-dice text-amber-500"></i>
              <span>🎲 Surprise Me</span>
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('I want to build an AI Vedic astrology app with real-time conversational voice avatars')}
              className="flex items-center space-x-1.5 whitespace-nowrap rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-amber-400 hover:bg-amber-50/50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition shrink-0"
            >
              <i className="fa-solid fa-star-and-crescent text-indigo-400"></i>
              <span>AI Vedic Avatars (84% Margin)</span>
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('Structure a B2B AI agent workflow operations pod connecting US clients with Indian talent')}
              className="flex items-center space-x-1.5 whitespace-nowrap rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-amber-400 hover:bg-amber-50/50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition shrink-0"
            >
              <i className="fa-solid fa-robot text-emerald-400"></i>
              <span>B2B AI Workflow Pod ($3.9k/mo)</span>
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('Evaluate a cross-border payment and FX settlement engine for software exporters')}
              className="flex items-center space-x-1.5 whitespace-nowrap rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-amber-400 hover:bg-amber-50/50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition shrink-0"
            >
              <i className="fa-solid fa-credit-card text-sky-400"></i>
              <span>Cross-Border FX Engine</span>
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('Design a high-margin functional D2C export brand to Dubai and London')}
              className="flex items-center space-x-1.5 whitespace-nowrap rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-amber-400 hover:bg-amber-50/50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition shrink-0"
            >
              <i className="fa-solid fa-box text-amber-400"></i>
              <span>Luxury D2C Export</span>
            </button>
          </div>

          <div className="relative flex items-center rounded-2xl border border-slate-300 bg-slate-100 p-1.5 shadow-lg ring-1 ring-black/5 focus-within:border-amber-500/60 focus-within:ring-amber-500/20 dark:border-zinc-800 dark:bg-zinc-900/90 dark:ring-white/5">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.docx,.txt,.csv,.json"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-500 hover:border-slate-300 hover:text-slate-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              title="Attach document or pitch deck"
            >
              <i className="fa-solid fa-paperclip text-sm"></i>
            </button>

            <div className="relative flex-1">
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Brainstorm an idea (e.g. 'I want to build an astrology app with AI') or type 'Generate'..."
                rows={1}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3.5 pr-10 text-xs text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500"
              />
              <button
                type="button"
                onClick={handleVoiceToggle}
                className={`absolute right-2.5 top-2.5 text-xs transition ${
                  isListening ? 'text-rose-500 animate-pulse' : 'text-slate-400 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-white'
                }`}
                title={isListening ? 'Listening...' : 'Voice Input'}
              >
                <i className={`fa-solid ${isListening ? 'fa-microphone-lines' : 'fa-microphone'}`}></i>
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={isLoading || (!inputText.trim() && !attachedFileName)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-zinc-950 font-bold shadow-md hover:bg-amber-400 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition"
              title="Send to Strategic Advisor"
            >
              <i className="fa-solid fa-paper-plane text-xs"></i>
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* RIGHT PANE: ENTERPRISE STRATEGIC DOSSIER CANVAS               */}
      {/* ------------------------------------------------------------- */}
      <div 
        className={`flex-1 flex-col h-full overflow-hidden bg-slate-100/70 dark:bg-zinc-950/80 transition-all duration-300 ${
          layoutMode === 'chat' 
            ? 'hidden' 
            : 'flex'
        } ${mobileTab === 'canvas' ? 'flex' : 'hidden lg:flex'}`}
      >
        {/* Mobile Header Bar */}
        <div className="flex lg:hidden items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5 text-xs dark:border-zinc-800 dark:bg-zinc-900">
          <button
            onClick={() => setMobileTab('chat')}
            className="flex items-center space-x-1.5 font-bold text-amber-600 dark:text-amber-400"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>Back to Strategic Chat</span>
          </button>
          <span className="font-bold text-slate-900 dark:text-white">Live Dossier Canvas</span>
        </div>

        {/* Desktop Stage Flow Toolbar */}
        {(() => {
          const userTurns = session.messages.filter(m => m.sender === 'user');
          const userTopicTurns = userTurns.filter(m => !/^(hi|hello|hey|how are you|how r u|how are u|who are you|what can you do|help|start)[\.!\s\?]*$/i.test(m.text.trim()));
          const isBlueprintActive = Boolean(activeDossierSuite || session.messages.some(m => m.deliverableSuite));

          const currentStage = isBlueprintActive 
            ? 4 
            : userTopicTurns.length >= 2 
            ? 3 
            : userTopicTurns.length === 1 
            ? 2 
            : 1;

          return (
            <div className="hidden lg:flex h-11 items-center justify-between border-b border-slate-200 bg-white/90 px-6 text-xs backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/90 shrink-0">
              <div className="flex items-center space-x-2 text-slate-500 dark:text-zinc-400">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                  <i className="fa-solid fa-route mr-1.5 text-amber-500"></i>Stage:
                </span>
                <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold transition ${currentStage === 1 ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/40 shadow-sm' : 'text-slate-400 dark:text-zinc-500'}`}>
                  1. Discovery & Brainstorming
                </span>
                <i className="fa-solid fa-chevron-right text-[8px] text-slate-300 dark:text-zinc-700"></i>
                <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold transition ${currentStage === 2 ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/40 shadow-sm' : 'text-slate-400 dark:text-zinc-500'}`}>
                  2. ICP & Market Scope
                </span>
                <i className="fa-solid fa-chevron-right text-[8px] text-slate-300 dark:text-zinc-700"></i>
                <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold transition ${currentStage === 3 ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/40 shadow-sm' : 'text-slate-400 dark:text-zinc-500'}`}>
                  3. Monetization & Unit Economics
                </span>
                <i className="fa-solid fa-chevron-right text-[8px] text-slate-300 dark:text-zinc-700"></i>
                <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold transition ${currentStage === 4 ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500/40 shadow-sm' : 'text-slate-400 dark:text-zinc-600'}`}>
                  4. Institutional Blueprint 🚀
                </span>
              </div>

              {!activeDossierSuite && (
                <button
                  onClick={() => handleSendMessage("Generate complete executive strategic blueprint and 5-level legal framework for this venture now")}
                  className="inline-flex items-center space-x-1.5 rounded-lg bg-amber-500 px-3 py-1 text-xs font-bold text-zinc-950 hover:bg-amber-400 active:scale-95 transition shadow-sm"
                >
                  <i className="fa-solid fa-wand-magic-sparkles text-[10px]"></i>
                  <span>⚡ Generate Blueprint</span>
                </button>
              )}
            </div>
          );
        })()}

        {/* Canvas Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          {activeDossierSuite ? (
            <DeliverablesSuiteView
              suite={activeDossierSuite}
              settings={settings}
              onShareWhatsApp={onShareWhatsApp}
              onDispatchGmail={onDispatchGmail}
              onSaveCloudVault={onSaveCloudVault}
              onExportMarkdown={onExportMarkdown}
              onOpenVideoStudio={onOpenVideoStudio}
            />
          ) : (
            /* Strategic Canvas Ready / Awaiting Synthesis Workspace */
            <div className="mx-auto max-w-4xl py-6 space-y-6">
              
              {/* Top Banner */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl ring-1 ring-black/5 dark:border-zinc-800 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-900/90 dark:to-amber-950/30 dark:ring-white/5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/40">
                      <i className="fa-solid fa-compass-drafting text-xl"></i>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                          Venture Canvas Workspace
                        </span>
                        <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono">Jurisdiction: {userCountry}</span>
                      </div>
                      <h2 className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                        Vyuha Enterprise Dossier Canvas
                      </h2>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSendMessage("Generate complete executive strategic blueprint and 5-level legal framework for this venture now")}
                    className="flex items-center space-x-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-zinc-950 shadow-md hover:bg-amber-400 active:scale-95 transition"
                  >
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                    <span>⚡ Generate Blueprint & Populate Canvas</span>
                  </button>
                </div>

                <p className="mt-3 text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                  Discuss and refine your idea in the chat on the left. The moment you click <strong>"Generate Blueprint"</strong> or type <em>"generate"</em>, this canvas will be fully populated with all 5 strategic layers tailored specifically to your inputs.
                </p>
              </div>

              {/* 5-Layer Architectural Preview Cards */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
                  <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 text-xs font-bold">
                    <i className="fa-solid fa-file-contract"></i>
                    <span>1. Executive Summary</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 dark:text-zinc-400">
                    Vision, problem-solution arbitrage thesis, competitive moats, and 3-year revenue/EBITDA projections.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
                  <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 text-xs font-bold">
                    <i className="fa-solid fa-network-wired"></i>
                    <span>2. 180-Day Architecture</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 dark:text-zinc-400">
                    Phase 1 (0-30d pilot), Phase 2 (30-90d scale), Phase 3 (90-180d automation), tech stack & operational SOPs.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
                  <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    <i className="fa-solid fa-book-open-reader"></i>
                    <span>3. Team Skills E-Book</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 dark:text-zinc-400">
                    Candidate competency profiles, compensation bands in {userCountry}, daily/weekly KPI cadences, and training manuals.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
                  <div className="flex items-center space-x-2 text-pink-600 dark:text-pink-400 text-xs font-bold">
                    <i className="fa-solid fa-clapperboard"></i>
                    <span>4. AI Commercial Video Studio</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 dark:text-zinc-400">
                    4-scene high-converting cinematic storyboard, custom AI digital spokesperson, and voiceover scripts.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-2 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                    <i className="fa-solid fa-scale-balanced"></i>
                    <span>5. 5-Level Sovereign Legal & Governance</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 dark:text-zinc-400">
                    Statutory acts ({userCountry}), Founder IP assignment, MCA/Delaware incorporation, DPDP 2023/GDPR privacy, Astrologer likeness licensing, and RBI/Stripe payment governance.
                  </p>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

    </div>
  );
};
