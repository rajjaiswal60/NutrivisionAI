import { 
  AIVideoDeliverable, 
  DeliverableSuite, 
  LegalComplianceLevel,
  LegalGovernanceFramework,
  OmniPulseSignal, 
  QuickChoiceChip,
  SocialChannel, 
  VenturePitchCardData, 
  VideoScene,
  UserSettings
} from '../types';

export interface InteractiveAdvisoryResult {
  replyText: string;
  quickOptions?: QuickChoiceChip[];
  shouldAutoGenerateSuite?: boolean;
  pitchCard?: VenturePitchCardData | null;
}

export function getInteractiveAdvisoryPlan(
  prompt: string,
  history: Array<{ role: string; content: string }>,
  userCountry: string = 'India'
): InteractiveAdvisoryResult {
  const cleanPrompt = prompt.trim().toLowerCase();
  
  // 1. Casual Chat & Distinct Conversational Intents
  
  // 1A. "How are you" / "How's it going"
  if (/^(how are you|how r u|how are u|how's it going|hows it going|how do you do)[\.!\s\?]*$/i.test(cleanPrompt)) {
    return {
      replyText: `⚡ **I'm operating at peak performance!** 

Currently monitoring cross-border market shifts and regional arbitrage opportunities in **${userCountry}**.

I'm ready to collaborate—have you got a specific startup idea in mind, or would you like to explore high-ROI opportunities?`,
      quickOptions: [
        { label: 'Suggest Top 3 Arbitrage Ideas', actionPrompt: 'Suggest the top 3 highest ROI venture arbitrage business opportunities right now', icon: 'fa-solid fa-dice', isPrimary: true },
        { label: 'Explore B2B AI Workflows', actionPrompt: 'Structure a B2B AI agent workflow operations pod connecting US clients with Indian talent', icon: 'fa-solid fa-robot' },
        { label: 'Explore Cross-Border FinTech', actionPrompt: 'Evaluate a cross-border payment and FX settlement engine for software exporters', icon: 'fa-solid fa-credit-card' }
      ],
      shouldAutoGenerateSuite: false,
      pitchCard: null
    };
  }

  // 1B. "Who are you" / "Tell me about yourself"
  if (/^(who are you|tell me about you|what is vyuha|who made you|about you)[\.!\s\?]*$/i.test(cleanPrompt)) {
    return {
      replyText: `🏛️ **I'm Vyuha AI — an Autonomous Strategic Advisor & Venture Factory.**

I act as your institutional co-founder and strategy partner. Together, we analyze market asymmetries, unit economics (75%+ gross margins), 30-day GTM roadmaps, and 5-level legal compliance to transform early concepts into execution-ready venture blueprints in **${userCountry}**.

What industry or problem would you like to build around?`,
      quickOptions: [
        { label: 'Surprise Me: High-ROI Ideas', actionPrompt: 'Suggest the top 3 highest ROI venture arbitrage business opportunities right now', icon: 'fa-solid fa-dice', isPrimary: true },
        { label: 'AI Vedic Astrology Platform', actionPrompt: 'I want to build an AI Vedic astrology app with real-time conversational voice avatars', icon: 'fa-solid fa-star-and-crescent' },
        { label: 'Export D2C Wellness Brand', actionPrompt: 'Design a high-margin functional D2C export brand to Dubai and London', icon: 'fa-solid fa-box' }
      ],
      shouldAutoGenerateSuite: false,
      pitchCard: null
    };
  }

  // 1C. "What can you do" / "Help" / "Features"
  if (/^(what can you do|help|features|capabilities|how does this work)[\.!\s\?]*$/i.test(cleanPrompt)) {
    return {
      replyText: `🛠️ **Here is how we can collaborate to build a venture in ${userCountry}:**

1. **Brainstorm & Validate:** Stress-test target customer ICP, TAM/SAM/SOM, and pricing power.
2. **Model Unit Economics:** Structure B2B retainers ($2,500–$5,000/mo) with **75%+ gross margins** and sub-60-day payback.
3. **Generate 5-Layer Blueprints:** 1-Click synthesis of executive memos, 180-day tech roadmaps, hiring SOPs, video commercial scripts, and sovereign legal contracts.

Tell me an industry you're passionate about, or pick a starter idea below:`,
      quickOptions: [
        { label: 'B2B AI Automation Pod', actionPrompt: 'Structure a B2B AI agent workflow operations pod connecting US clients with Indian talent', icon: 'fa-solid fa-robot' },
        { label: 'Cross-Border B2B FX Rail', actionPrompt: 'Evaluate a cross-border payment and FX settlement engine for software exporters', icon: 'fa-solid fa-credit-card' },
        { label: 'Surprise Me with Top Ideas', actionPrompt: 'Suggest the top 3 highest ROI venture arbitrage business opportunities right now', icon: 'fa-solid fa-dice', isPrimary: true }
      ],
      shouldAutoGenerateSuite: false,
      pitchCard: null
    };
  }

  // 1D. Casual Greetings ("hi", "hello", "hey")
  const isCasualGreeting = /^(hi|hello|hey|start|hola|good morning|good afternoon|good evening|what's up|whats up)[\.!\s\?]*$/i.test(cleanPrompt);
  if (isCasualGreeting || cleanPrompt.length < 3) {
    const isReturning = history.filter(h => h.role === 'user').length > 1;
    return {
      replyText: isReturning
        ? `👋 **Hey there! Ready when you are.**\n\nTell me an industry or business idea you'd like to evaluate in **${userCountry}**, or choose a high-margin track below:`
        : `👋 **Hello! I'm Vyuha AI, your Strategic Advisor & Venture Architect.**\n\nI'm here to help you brainstorm, validate, and build high-margin business models in **${userCountry}**.\n\nWhat industry, problem, or startup idea would you like to explore today?`,
      quickOptions: [
        { label: 'AI Vedic Astrology Platform', actionPrompt: 'I want to build an AI Vedic astrology app with real-time conversational voice avatars', icon: 'fa-solid fa-star-and-crescent' },
        { label: 'B2B AI Workflow Factory', actionPrompt: 'Structure a B2B AI agent workflow operations pod connecting US clients with Indian talent', icon: 'fa-solid fa-robot' },
        { label: 'Cross-Border B2B FinTech', actionPrompt: 'Evaluate a cross-border payment and FX settlement engine for software exporters', icon: 'fa-solid fa-credit-card' },
        { label: 'High-Margin D2C Export', actionPrompt: 'Design a high-margin functional D2C export brand to Dubai and London', icon: 'fa-solid fa-box' },
        { label: 'Surprise Me: High-ROI Arbitrage Idea', actionPrompt: 'Suggest the top 3 highest ROI venture arbitrage business opportunities right now', icon: 'fa-solid fa-dice', isPrimary: true }
      ],
      shouldAutoGenerateSuite: false,
      pitchCard: null
    };
  }

  // 1.5. Surprise Me / Opportunity Discovery Intent
  const isSurpriseOrRecommend = /surprise me|suggest|recommend|what should i build|give me an idea|profitable business|best idea|new idea|ideas/i.test(cleanPrompt);
  if (isSurpriseOrRecommend) {
    return {
      replyText: `✨ **Here are the Top 3 High-Arbitrage Venture Opportunities in ${userCountry} for 2026:**

1. **AI Astrological Digital Twins (>84% Gross Margin):** Replacing call centers with sub-650ms WebRTC voice avatars targeting US/GCC diaspora.
2. **Dedicated B2B AI Workflow Pods (6.4x Talent Arbitrage):** $3,900/mo turnkey AI automation pods for US healthcare & legal firms.
3. **Cross-Border FX Settlement Rails (3.5% Fee Delta):** T+0 local currency payout accounts for software and SaaS exporters.

Which opportunity aligns closest with your vision?`,
      quickOptions: [
        { label: 'AI Astrological Voice Twins', actionPrompt: 'I want to build an AI Vedic astrology app with real-time conversational voice avatars', icon: 'fa-solid fa-star-and-crescent' },
        { label: 'Dedicated B2B AI Agency Pod ($3,900/mo)', actionPrompt: 'Offer dedicated 3-person AI workflow pod at $3,900/month for seed/Series A startups.', icon: 'fa-solid fa-laptop-code' },
        { label: 'Cross-Border B2B Settlement Engine', actionPrompt: 'Evaluate a cross-border payment and FX settlement engine for software exporters', icon: 'fa-solid fa-credit-card' },
        { label: 'Generate Strategic Blueprint Now', actionPrompt: 'Generate the complete executive strategic blueprint and 5-level legal framework for this venture now.', icon: 'fa-solid fa-wand-magic-sparkles', isPrimary: true }
      ],
      shouldAutoGenerateSuite: false,
      pitchCard: null
    };
  }

  // 2. Explicit Generation Command
  const isGenerateCommand = /generate|create blueprint|build canvas|synthesize|approve|generate suite|make blueprint|populate canvas|ready to build|build it/i.test(cleanPrompt);

  // Extract user-only discussion history to accurately detect the true active venture topic
  const userMeaningfulTurns = history
    .filter(h => h.role === 'user')
    .map(h => h.content.trim())
    .filter(text => !/^(generate|create blueprint|build canvas|synthesize|approve|generate suite|view|download|inspect|hi|hello|hey)/i.test(text));

  const activeUserTopic = userMeaningfulTurns.length > 0
    ? userMeaningfulTurns[userMeaningfulTurns.length - 1]
    : cleanPrompt;

  const userContextString = (userMeaningfulTurns.slice(-4).join(' ') + ' ' + cleanPrompt).toLowerCase();

  if (isGenerateCommand) {
    const detectedPitch = detectVentureOpportunity(activeUserTopic, userContextString, userCountry, 'aggressive') || {
      id: 'pitch_' + Math.random().toString(36).substring(2, 9),
      title: 'Autonomous Business Venture',
      tagline: `High-margin commercial model in ${userCountry}`,
      targetMarket: `Target customers in ${userCountry} and global markets`,
      tam: '$4.2B Global Addressable Market',
      sam: '$850M Addressable Segment',
      som: '$45M Target SOM',
      grossMargin: '78.5%',
      cac: '$45',
      ltv: '$380',
      paybackPeriod: '1.5 Months',
      capitalRequired: '$25,000',
      arbitrageMultiplier: '5.8x',
      arbitrageRationale: `Optimized cost-to-value differential in ${userCountry}.`,
      keyRisks: ['Customer acquisition CAC scaling', 'Operational compliance']
    };

    return {
      replyText: `🚀 **Venture Parameters Confirmed! Synthesizing Your Complete Blueprint.**

I have formulated your **Executive Strategic Blueprint, 180-Day Architecture Roadmap, Team Skills E-Book, and 5-Level ${userCountry} Legal Suite** for **"${detectedPitch.title}"**.

👉 *The **Dossier Canvas** on the right has been activated and populated!*`,
      quickOptions: [
        { label: 'View 180-Day Roadmap', actionPrompt: 'Break down the Phase 1 30-day MVP execution milestones', icon: 'fa-solid fa-network-wired' },
        { label: 'Inspect Legal Level 3 (DPDP/Privacy)', actionPrompt: 'Explain our Level 3 Consumer Protection and Data Privacy safeguards in detail', icon: 'fa-solid fa-scale-balanced' },
        { label: 'Download Word & Slide Deck', actionPrompt: 'Summarize the executive takeaways for investor presentation', icon: 'fa-solid fa-download' }
      ],
      shouldAutoGenerateSuite: true,
      pitchCard: detectedPitch
    };
  }

  // 3. Conversational Brainstorming Branches (Short, Natural, Engaging)
  if (cleanPrompt.includes('astro') || cleanPrompt.includes('vedic') || cleanPrompt.includes('spiritual') || cleanPrompt.includes('pandit') || cleanPrompt.includes('horoscope') || cleanPrompt.includes('kundali')) {
    return {
      replyText: `🌌 **An AI Vedic Astrology platform has massive potential (>80% gross margins).**

By replacing traditional human astrologer call centers with sub-650ms conversational AI voice avatars, you eliminate 60% revenue-share commissions and offer 24/7 instant consultations.

To shape this together:
* Are you targeting **domestic users in India with vernacular voice calls (₹25–₹40/min)**, or the **global Indian diaspora (US, GCC, UK) with $29/mo premium memberships**?`,
      quickOptions: [
        { label: 'India Domestic + Per-Minute Voice', actionPrompt: 'Focus on India Domestic Tier-1/2 users with per-minute voice calls and vernacular languages.', icon: 'fa-solid fa-phone' },
        { label: 'Global NRI (US/GCC) + $29/mo Sub', actionPrompt: 'Target affluent Global NRI diaspora in US, UK, GCC with $29/mo premium membership and deep Vedic consultations.', icon: 'fa-solid fa-globe' },
        { label: 'Celebrity Astrologer Digital Twins', actionPrompt: 'Build exclusive digital twin licenses with renowned celebrity astrologers with revenue share.', icon: 'fa-solid fa-microphone-lines' },
        { label: 'Generate Strategic Blueprint Now', actionPrompt: 'Generate the complete executive strategic blueprint and 5-level legal framework for this venture now.', icon: 'fa-solid fa-wand-magic-sparkles', isPrimary: true }
      ],
      shouldAutoGenerateSuite: false,
      pitchCard: null
    };
  }

  if (cleanPrompt.includes('automation') || cleanPrompt.includes('workflow') || cleanPrompt.includes('agent') || cleanPrompt.includes('agency') || cleanPrompt.includes('ai ops')) {
    return {
      replyText: `🤖 **AI workflow operations and automation represent a massive 6.4x arbitrage.**

Western enterprises spend $140k/yr per FTE on repetitive cognitive tasks. By building specialized AI-augmented execution pods in **${userCountry}**, you deliver higher accuracy at 75%+ gross margins.

Which angle interests you most?
* **Vertical B2B Ops:** Healthcare & medical billing, or legal contract triage?
* **Turnkey AI Agency Pods:** Providing dedicated 3-person AI workflow pods at **$3,500–$4,500/month**?`,
      quickOptions: [
        { label: 'US Healthcare & Medical Billing Pod', actionPrompt: 'Focus on US Healthcare and clinical billing operations with strict HIPAA compliance.', icon: 'fa-solid fa-hospital' },
        { label: 'Dedicated B2B Agency Pod ($3,900/mo)', actionPrompt: 'Offer dedicated 3-person AI workflow pod at $3,900/month for seed/Series A startups.', icon: 'fa-solid fa-laptop-code' },
        { label: 'Legal & Compliance Contract Triage', actionPrompt: 'Target mid-size law firms for high-speed contract triage and compliance linting.', icon: 'fa-solid fa-scale-balanced' },
        { label: 'Generate Strategic Blueprint Now', actionPrompt: 'Generate the complete executive strategic blueprint and 5-level legal framework for this venture now.', icon: 'fa-solid fa-wand-magic-sparkles', isPrimary: true }
      ],
      shouldAutoGenerateSuite: false,
      pitchCard: null
    };
  }

  if (cleanPrompt.includes('fintech') || cleanPrompt.includes('payment') || cleanPrompt.includes('fx') || cleanPrompt.includes('bank') || cleanPrompt.includes('cross-border')) {
    return {
      replyText: `💳 **Cross-Border B2B Settlement is a $120B+ market bleeding 3.5% in hidden bank FX fees.**

Software and service exporters in **${userCountry}** want same-day local currency settlements with sub-0.5% FX spreads.

How would you like to position this?
* **Mid-Market SaaS Exporters ($500k–$10M ARR)** with automated invoice factoring?
* **Freelancer & Creator Payout Rails** with instant local virtual account settlement?`,
      quickOptions: [
        { label: 'Mid-Market SaaS Exporters ($500k+)', actionPrompt: 'Focus on mid-market SaaS and tech agencies with automated invoice factoring and low FX spread.', icon: 'fa-solid fa-building' },
        { label: 'Flat 0.45% FX Margin Rail', actionPrompt: 'Monetize with flat 0.45% FX margin and instant T+0 settlement to local currency current accounts.', icon: 'fa-solid fa-bolt' },
        { label: 'Generate Strategic Blueprint Now', actionPrompt: 'Generate the complete executive strategic blueprint and 5-level legal framework for this venture now.', icon: 'fa-solid fa-wand-magic-sparkles', isPrimary: true }
      ],
      shouldAutoGenerateSuite: false,
      pitchCard: null
    };
  }

  if (cleanPrompt.includes('d2c') || cleanPrompt.includes('ecommerce') || cleanPrompt.includes('product') || cleanPrompt.includes('export') || cleanPrompt.includes('brand')) {
    return {
      replyText: `📦 **Exporting high-margin consumer products from ${userCountry} unlocks an 80%+ gross margin delta.**

Formulating functional botanicals, premium wellness goods, or organic spices locally at low cost and selling at luxury retail pricing in Dubai, London, and the US creates fast cashflow.

What category are you considering?
* **Functional Wellness & Clean Beauty**
* **Specialty Heritage Foods & Single-Origin Spices**`,
      quickOptions: [
        { label: 'Functional Wellness & Clean Beauty', actionPrompt: 'Focus on premium Ayurvedic & botanical clean beauty exports with air express delivery.', icon: 'fa-solid fa-spa' },
        { label: 'Specialty Food & Single-Origin Spices', actionPrompt: 'Export high-grade single origin spices with luxury Western packaging.', icon: 'fa-solid fa-mortar-pestle' },
        { label: 'Generate Strategic Blueprint Now', actionPrompt: 'Generate the complete executive strategic blueprint and 5-level legal framework for this venture now.', icon: 'fa-solid fa-wand-magic-sparkles', isPrimary: true }
      ],
      shouldAutoGenerateSuite: false,
      pitchCard: null
    };
  }

  // 4. Specific Strategic Intent Handlers (Scope, Market Size, Pricing, Tech Stack, Competitors)
  
  // A. Market Scope & Digital Platform Potential Questions
  if (/scope|market size|how big|tam|industry|digital platform|potential|future|demand|opportunity size/i.test(cleanPrompt)) {
    return {
      replyText: `📈 **Digital Platform & Industry Scope Analysis in ${userCountry}:**

Transitioning this domain into an autonomous digital platform unlocks three primary asymmetric advantages:

1. **Marginal Cost Collapse:** Traditional execution is bottlenecked by physical capacity and human labor. Digital platform architecture collapses marginal delivery cost to near-zero, lifting gross margins from **~30% to 78%–85%**.
2. **Global Geographic Arbitrage:** By building delivery infrastructure in **${userCountry}**, you capture high-ARPU demand across Western and GCC markets while maintaining a lean operational cost footprint.
3. **Compounding Defensibility (Data & Workflows):** Every customer transaction trains proprietary routing, client workflows, and domain-specific models, creating a strong retention moat against legacy competitors.

Which angle would you like to model next?`,
      quickOptions: [
        { label: 'Model TAM / SAM / SOM Metrics', actionPrompt: 'Calculate the TAM, SAM, and Year-1 capturable SOM market sizing for this platform.', icon: 'fa-solid fa-chart-pie' },
        { label: 'Structure High-Margin Retainer Tiers', actionPrompt: 'Break down the pricing tiers, gross margins, and LTV/CAC payback model.', icon: 'fa-solid fa-money-bill-trend-up' },
        { label: 'Generate Strategic Blueprint Now', actionPrompt: 'Generate the complete executive strategic blueprint and 5-level legal framework for this venture now.', icon: 'fa-solid fa-wand-magic-sparkles', isPrimary: true }
      ],
      shouldAutoGenerateSuite: false,
      pitchCard: null
    };
  }

  // B. Pricing, Monetization & Unit Economics Questions
  if (/pric|monetiz|charge|cost|revenue model|how much|fee|margin/i.test(cleanPrompt)) {
    return {
      replyText: `💰 **Strategic Monetization & Unit Economics Blueprint:**

To maximize valuation and free cash flow in **${userCountry}**, we recommend a dual-tier monetization architecture:

1. **Core Predictable Cashflow (B2B Retainers / Subscriptions):**
   * High-ticket recurring retainers ($2,500–$5,000/mo) with upfront quarterly invoicing to secure negative working capital.
2. **Usage / Volume Upsell Rail:**
   * Metered consumption fee or transaction spread (0.5%–2.5%) as client throughput scales.
3. **Unit Economics Targets:**
   * **Gross Margin:** **76%–84%**
   * **Payback Horizon:** <2.0 months
   * **Target LTV / CAC:** > 7:1

Would you like to review the 30-day go-to-market plan or generate the full dossier blueprint?`,
      quickOptions: [
        { label: '30-Day Pilot GTM Roadmap', actionPrompt: 'Outline the 30-day go-to-market pilot sprint to sign first 3 paying design partners.', icon: 'fa-solid fa-rocket' },
        { label: 'Inspect Legal Compliance & Contracts', actionPrompt: 'Review the enforceable commercial contracts and client MSAs.', icon: 'fa-solid fa-scale-balanced' },
        { label: 'Generate Strategic Blueprint Now', actionPrompt: 'Generate the complete executive strategic blueprint and 5-level legal framework for this venture now.', icon: 'fa-solid fa-wand-magic-sparkles', isPrimary: true }
      ],
      shouldAutoGenerateSuite: false,
      pitchCard: null
    };
  }

  // C. Tech Stack & Architecture Questions
  if (/tech stack|architecture|how to build|infrastructure|developer|engineering|code|software/i.test(cleanPrompt)) {
    return {
      replyText: `⚙️ **Recommended Sovereign Execution Architecture:**

For high-velocity deployment with minimum infrastructure overhead:

1. **Frontend & Client Cockpit:** Next.js / React with TailwindCSS and WebSockets for real-time streaming interfaces.
2. **Backend & Orchestration Layer:** FastAPI / Node.js with asynchronous job queues, LangChain / DSPy execution pipelines, and WebRTC audio streaming.
3. **Data & Vector Memory:** PostgreSQL with ` + '`pgvector`' + ` for semantic retrieval, tenant isolation, and strict role-based access controls.
4. **Target Launch Timeline:** 30-day functional MVP sprint with 3 anchor design partners.`,
      quickOptions: [
        { label: 'View 180-Day Architecture Roadmap', actionPrompt: 'Break down the Phase 1, Phase 2, and Phase 3 technical architecture milestones.', icon: 'fa-solid fa-network-wired' },
        { label: 'Hiring & Pod Skills E-Book', actionPrompt: 'Review core engineering pod roles, talent sourcing, and compensation benchmarks.', icon: 'fa-solid fa-users-gear' },
        { label: 'Generate Strategic Blueprint Now', actionPrompt: 'Generate the complete executive strategic blueprint and 5-level legal framework for this venture now.', icon: 'fa-solid fa-wand-magic-sparkles', isPrimary: true }
      ],
      shouldAutoGenerateSuite: false,
      pitchCard: null
    };
  }

  // D. Customer Acquisition, GTM, Sales & Growth Questions
  if (/gtm|customer|client|cac|market|lead|sales|acquisition|first 10|outbound|funnel|growth/i.test(cleanPrompt)) {
    return {
      replyText: `🚀 **Target Go-To-Market (GTM) & Client Acquisition Sprint:**

To acquire your first 10 high-value enterprise accounts in **${userCountry}** with sub-60-day payback:

1. **Phase 1 (Days 1–15): The 3-Design Partner Anchor Sprint**
   * Target 20 mid-market decision-makers with a bespoke "Workflow ROI Audit".
   * Offer an exclusive 50% discount on the first quarter in exchange for an upfront retainer commitment and public case study.
2. **Phase 2 (Days 15–30): Outbound Funnel & Performance Rails**
   * Account-Based Outreach (LinkedIn & verified direct executive messaging) targeting companies with 20–250 FTEs.
   * Target CAC: **$450–$950** per B2B client vs **$24,000–$36,000** 3-Year LTV.
3. **Target Conversion Velocity:** 2 to 3 paying clients closed every 30 days.`,
      quickOptions: [
        { label: 'View 30-Day Launch Roadmap', actionPrompt: 'Break down the exact 30-day MVP execution milestones and daily actions.', icon: 'fa-solid fa-calendar-check' },
        { label: 'Model Retainer Pricing & Unit Economics', actionPrompt: 'Break down the pricing tiers, gross margins, and LTV/CAC payback model.', icon: 'fa-solid fa-money-bill-trend-up' },
        { label: 'Generate Strategic Blueprint Now', actionPrompt: 'Generate the complete executive strategic blueprint and 5-level legal framework for this venture now.', icon: 'fa-solid fa-wand-magic-sparkles', isPrimary: true }
      ],
      shouldAutoGenerateSuite: false,
      pitchCard: null
    };
  }

  // E. Competitive Moats, Defensibility & Risks Questions
  if (/compet|moat|defens|risk|copy|barrier|protect|threat/i.test(cleanPrompt)) {
    return {
      replyText: `🛡️ **Structural Defensibility & Competitive Moat Framework:**

Why legacy incumbents cannot easily copy or displace this model:

1. **Asymmetric Delivery Cost Basis:** Operating execution hubs in **${userCountry}** delivers a 5.8x cost-to-value differential, allowing you to price at 50% of Western competitors while maintaining **75%+ gross margins**.
2. **Proprietary Workflow & Data Flywheel:** Standardized SOPs and client telemetry create heavy switching costs (>92% annual retention).
3. **Sovereign Statutory Compliance:** Fully locked 5-level legal agreements, DPDP Act adherence, and cross-border tax shields create a strong barrier to entry.`,
      quickOptions: [
        { label: 'Inspect 5-Level Legal Framework', actionPrompt: 'Explain our Level 3 Consumer Protection and Data Privacy safeguards in detail', icon: 'fa-solid fa-scale-balanced' },
        { label: 'Review Key Operational SOPs', actionPrompt: 'List the core operational standard operating procedures for zero-defect execution.', icon: 'fa-solid fa-list-check' },
        { label: 'Generate Strategic Blueprint Now', actionPrompt: 'Generate the complete executive strategic blueprint and 5-level legal framework for this venture now.', icon: 'fa-solid fa-wand-magic-sparkles', isPrimary: true }
      ],
      shouldAutoGenerateSuite: false,
      pitchCard: null
    };
  }

  // F. Funding, Investors & Capital Sizing Questions
  if (/fund|invest|capital|pitch|valuation|raise|angel|seed|vc|dilution/i.test(cleanPrompt)) {
    return {
      replyText: `💎 **Institutional Capital Sizing & Investor Thesis:**

* **Recommended Launch Capital:** **$25,000–$35,000 (₹20L–₹30L)** for a self-sustaining 30-day MVP pilot sprint.
* **Cashflow Self-Sufficiency:** Achieved by Month 2 via 50% advance retainers on client sign-ups.
* **Investor Pitch Angle:** Positioning as an asset-light, high-gross-margin platform yielding 70%+ steady-state EBITDA, commanding a **6x–9x ARR exit multiple**.`,
      quickOptions: [
        { label: 'Financial Target Matrix (Years 1-3)', actionPrompt: 'Calculate the Year 1, Year 2, and Year 3 revenue and EBITDA projections.', icon: 'fa-solid fa-chart-line' },
        { label: 'Download Word & Slide Deck', actionPrompt: 'Summarize the executive takeaways for investor presentation', icon: 'fa-solid fa-download' },
        { label: 'Generate Strategic Blueprint Now', actionPrompt: 'Generate the complete executive strategic blueprint and 5-level legal framework for this venture now.', icon: 'fa-solid fa-wand-magic-sparkles', isPrimary: true }
      ],
      shouldAutoGenerateSuite: false,
      pitchCard: null
    };
  }

  // G. Healthcare & Medical Workflows
  if (/health|medical|clinic|hospital|doctor|patient|pharma|biotech|dental|billing/i.test(cleanPrompt)) {
    return {
      replyText: `🏥 **Healthcare & Clinical Operations Arbitrage in ${userCountry}:**

Western and regional healthcare networks face skyrocketing administrative costs ($140k+/yr per clinical coordinator) and crippling insurance claim rejections.

By deploying specialized AI clinical operations pods in **${userCountry}**, you deliver higher turnaround accuracy at **78%+ gross margins**:

* **Target Commercial Vectors:**
  1. **US Medical Billing & Prior-Authorization Pods:** Dedicated $3,800/mo pods handling claim coding and appeals with strict HIPAA/SOC-2 compliance.
  2. **Doctor Clinical Documentation Co-Pilots:** Sub-second ambient voice-to-EHR charting for busy outpatient clinics.
* **Payback Velocity:** 1.5 to 2 months per contracted clinic.`,
      quickOptions: [
        { label: 'US Medical Billing Pod ($3,800/mo)', actionPrompt: 'Focus on US Healthcare and clinical billing operations with strict HIPAA compliance.', icon: 'fa-solid fa-hospital' },
        { label: 'Ambient Clinical Charting AI', actionPrompt: 'Structure ambient AI doctor voice charting app with EHR integration.', icon: 'fa-solid fa-notes-medical' },
        { label: 'HIPAA & Legal Level 3 Compliance', actionPrompt: 'Explain our Level 3 Consumer Protection and Data Privacy safeguards in detail', icon: 'fa-solid fa-shield-halved' },
        { label: 'Generate Strategic Blueprint Now', actionPrompt: 'Generate the complete executive strategic blueprint and 5-level legal framework for this venture now.', icon: 'fa-solid fa-wand-magic-sparkles', isPrimary: true }
      ],
      shouldAutoGenerateSuite: false,
      pitchCard: null
    };
  }

  // H. Real Estate, PropTech & Construction
  if (/real estate|property|proptech|housing|broker|construction|rental/i.test(cleanPrompt)) {
    return {
      replyText: `🏢 **PropTech & Real Estate Arbitrage Model in ${userCountry}:**

Real estate brokerages and property developers waste 40%+ of marketing budgets on unverified buyer leads and manual lease processing.

* **High-Margin Value Props:**
  1. **Autonomous Lead Qualification & AI Voice Tour Booking:** 24/7 vernacular WhatsApp and voice qualification converting casual clicks into qualified site visits.
  2. **Automated Title & Lease Due Diligence Engine:** Instant compliance and lease agreement generation.
* **Gross Margins:** **80%–86%** with per-lead or monthly SaaS retainer pricing ($1,500–$3,500/mo per agency).`,
      quickOptions: [
        { label: 'AI Voice Lead Qualifier & WhatsApp Bot', actionPrompt: 'Design real estate AI voice qualifier and WhatsApp booking engine.', icon: 'fa-solid fa-building' },
        { label: 'Per-Agency Monthly Retainer ($2,500/mo)', actionPrompt: 'Monetize with $2,500/mo retainer for mid-market brokerage firms.', icon: 'fa-solid fa-money-bill-trend-up' },
        { label: 'Generate Strategic Blueprint Now', actionPrompt: 'Generate the complete executive strategic blueprint and 5-level legal framework for this venture now.', icon: 'fa-solid fa-wand-magic-sparkles', isPrimary: true }
      ],
      shouldAutoGenerateSuite: false,
      pitchCard: null
    };
  }

  // I. Education, EdTech & Cohort Upskilling
  if (/education|edtech|course|tutor|school|college|upskill|student|learn/i.test(cleanPrompt)) {
    return {
      replyText: `🎓 **EdTech & Autonomous Upskilling Platform in ${userCountry}:**

Traditional online courses suffer from <8% completion rates. Interactive AI mentorship and localized cohort accelerators unlock deep engagement and recurring subscriptions:

* **Top Opportunities:**
  1. **Vernacular AI 1-on-1 Socratic Tutor:** 24/7 adaptive coaching in regional languages at ₹299–₹999/mo.
  2. **Enterprise AI Engineering Accelerator:** High-ticket B2B cohort training for tech teams ($1,200 per seat).
* **Unit Economics:** **82% gross margins** with zero marginal cost per active learner.`,
      quickOptions: [
        { label: 'Vernacular 1-on-1 AI Tutor App', actionPrompt: 'Design vernacular AI Socratic tutor with adaptive micro-lessons.', icon: 'fa-solid fa-graduation-cap' },
        { label: 'B2B Enterprise Upskilling ($1.2k/seat)', actionPrompt: 'Structure B2B executive AI training programs with enterprise billing.', icon: 'fa-solid fa-chalkboard-user' },
        { label: 'Generate Strategic Blueprint Now', actionPrompt: 'Generate the complete executive strategic blueprint and 5-level legal framework for this venture now.', icon: 'fa-solid fa-wand-magic-sparkles', isPrimary: true }
      ],
      shouldAutoGenerateSuite: false,
      pitchCard: null
    };
  }

  // J. Logistics, Freight & Supply Chain
  if (/logistics|freight|warehouse|shipping|trucking|fleet|supply chain/i.test(cleanPrompt)) {
    return {
      replyText: `🚚 **Supply Chain & Logistics Optimization in ${userCountry}:**

MSMEs and regional distributors struggle with fragmented fleets, manual e-way bill reconciliations, and 30+ day payment delays.

* **Key Arbitrage Opportunities:**
  1. **Hyperlocal Micro-Warehouse Distribution:** On-demand inventory staging unlocking same-day delivery at 30%+ net margins.
  2. **Automated Freight Invoice & POD Triage:** Reducing billing turnaround from 21 days to T+0.`,
      quickOptions: [
        { label: 'Hyperlocal Micro-Warehousing Network', actionPrompt: 'Create a micro-warehouse distribution network for regional MSMEs with 30%+ gross margin.', icon: 'fa-solid fa-truck-fast' },
        { label: 'Freight Invoice Factoring Rails', actionPrompt: 'Structure automated freight invoice audit and instant payment factoring.', icon: 'fa-solid fa-receipt' },
        { label: 'Generate Strategic Blueprint Now', actionPrompt: 'Generate the complete executive strategic blueprint and 5-level legal framework for this venture now.', icon: 'fa-solid fa-wand-magic-sparkles', isPrimary: true }
      ],
      shouldAutoGenerateSuite: false,
      pitchCard: null
    };
  }

  // 5. Intelligent Dynamic Custom Idea Assessment (Natural, Conversational, Clean)
  const cleanIdea = prompt
    .replace(/^(i want to build|i want to create|i want to make|i want to start|evaluate|create|launch|build|a|an|the|app|platform|for|how to make|business idea for|in|on|about|with|venture|startup)\s+/gi, '')
    .replace(/^(in|on|about|for|with|a|an|the)\s+/gi, '')
    .trim();

  const domainWord = cleanIdea
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ') || 'Venture';

  return {
    replyText: `💡 **Exploring ${domainWord} in ${userCountry}:**

Building an autonomous platform or specialized operations hub in **${domainWord}** offers strong commercial leverage:

* **Gross Margin Target:** **74%–82%** by deploying asset-light digital delivery and AI-augmented workflows.
* **Fast Payback (<60 Days):** Structuring with upfront design-partner retainers ($2,500–$4,500/mo) creates negative working capital from Day 1.
* **Scalable Moat:** Embedding proprietary customer telemetry and regulatory compliance into client workflows.

How would you like to refine this?
1. Focus on high-ticket B2B enterprise contracts?
2. Or target mass-market volume with digital subscriptions?`,
    quickOptions: [
      { label: `Target B2B ${domainWord} Retainers`, actionPrompt: `Structure high-ticket recurring B2B monthly retainers and enterprise SLAs for ${domainWord}.`, icon: 'fa-solid fa-handshake' },
      { label: '30-Day MVP Launch Sprint', actionPrompt: `Map out the 30-day MVP execution milestones and launch budget for ${domainWord}.`, icon: 'fa-solid fa-rocket' },
      { label: 'Model LTV/CAC & Unit Economics', actionPrompt: 'Break down the pricing tiers, gross margins, and LTV/CAC payback model.', icon: 'fa-solid fa-money-bill-trend-up' },
      { label: 'Generate Strategic Blueprint Now', actionPrompt: 'Generate the complete executive strategic blueprint and 5-level legal framework for this venture now.', icon: 'fa-solid fa-wand-magic-sparkles', isPrimary: true }
    ],
    shouldAutoGenerateSuite: false,
    pitchCard: null
  };
}

export function generateDynamicQuickOptions(prompt: string, userCountry: string = 'India'): QuickChoiceChip[] {
  const clean = prompt.toLowerCase();

  if (clean.includes('health') || clean.includes('medical') || clean.includes('doctor') || clean.includes('clinic')) {
    return [
      { label: 'US Medical Billing Pod ($3,800/mo)', actionPrompt: 'Focus on US Healthcare and clinical billing operations with strict HIPAA compliance.', icon: 'fa-solid fa-hospital' },
      { label: 'Ambient Clinical Charting AI', actionPrompt: 'Structure ambient AI doctor voice charting app with EHR integration.', icon: 'fa-solid fa-notes-medical' },
      { label: 'HIPAA & Legal Level 3 Compliance', actionPrompt: 'Explain our Level 3 Consumer Protection and Data Privacy safeguards in detail', icon: 'fa-solid fa-shield-halved' },
      { label: 'Generate Strategic Blueprint Now', actionPrompt: 'Generate the complete executive strategic blueprint and 5-level legal framework for this venture now.', icon: 'fa-solid fa-wand-magic-sparkles', isPrimary: true }
    ];
  }

  if (clean.includes('automation') || clean.includes('workflow') || clean.includes('agent') || clean.includes('agency')) {
    return [
      { label: 'US Healthcare & Clinical Billing Pod', actionPrompt: 'Focus on US Healthcare and clinical billing operations with strict HIPAA compliance.', icon: 'fa-solid fa-hospital' },
      { label: 'Dedicated B2B Agency Pod ($3,900/mo)', actionPrompt: 'Offer dedicated 3-person AI workflow pod at $3,900/month for seed/Series A startups.', icon: 'fa-solid fa-laptop-code' },
      { label: 'Legal & Compliance Contract Triage', actionPrompt: 'Target mid-size law firms for high-speed contract triage and compliance linting.', icon: 'fa-solid fa-scale-balanced' },
      { label: 'Generate Strategic Blueprint Now', actionPrompt: 'Generate the complete executive strategic blueprint and 5-level legal framework for this venture now.', icon: 'fa-solid fa-wand-magic-sparkles', isPrimary: true }
    ];
  }

  if (clean.includes('fintech') || clean.includes('payment') || clean.includes('fx') || clean.includes('bank')) {
    return [
      { label: 'Mid-Market SaaS Exporters ($500k+)', actionPrompt: 'Focus on mid-market SaaS and tech agencies with automated invoice factoring and low FX spread.', icon: 'fa-solid fa-building' },
      { label: 'Flat 0.45% FX Margin Rail', actionPrompt: 'Monetize with flat 0.45% FX margin and instant T+0 settlement to local currency current accounts.', icon: 'fa-solid fa-bolt' },
      { label: 'Generate Strategic Blueprint Now', actionPrompt: 'Generate the complete executive strategic blueprint and 5-level legal framework for this venture now.', icon: 'fa-solid fa-wand-magic-sparkles', isPrimary: true }
    ];
  }

  return [
    { label: 'Structure 30-Day GTM Roadmap', actionPrompt: 'Map out the 30-day MVP execution milestones and launch budget.', icon: 'fa-solid fa-rocket' },
    { label: 'Model Retainer Unit Economics', actionPrompt: 'Break down the pricing tiers, gross margins, and LTV/CAC payback model.', icon: 'fa-solid fa-money-bill-trend-up' },
    { label: 'Inspect Legal Compliance', actionPrompt: 'Explain our Level 3 Consumer Protection and Data Privacy safeguards in detail', icon: 'fa-solid fa-scale-balanced' },
    { label: 'Generate Strategic Blueprint Now', actionPrompt: 'Generate the complete executive strategic blueprint and 5-level legal framework for this venture now.', icon: 'fa-solid fa-wand-magic-sparkles', isPrimary: true }
  ];
}

export function detectVentureOpportunity(
  prompt: string, 
  responseText: string,
  userCountry: string = 'India',
  opportunitySensitivity: 'high' | 'medium' | 'aggressive' = 'high'
): VenturePitchCardData | null {
  const cleanPrompt = prompt.trim().toLowerCase();
  
  // 1. Immediately ignore greetings and chit-chat
  const isGreeting = /^(hi|hello|hey|greetings|howdy|what's up|who are you|what can you do|help|ok|thanks|thank you|start|test)[\.!\s]*$/i.test(cleanPrompt);
  if (isGreeting || cleanPrompt.length < 8) {
    return null;
  }

  // 2. Keyword signals for venture detection in prompt
  const commercialSignals = [
    'arbitrage', 'b2b', 'saas', 'margin', 'venture', 'business model', 
    'startup', 'gcc', 'export', 'd2c', 'tam', 'monetiz', 'pricing', 
    'revenue', 'market', 'tier 2', 'automation', 'cross-border', 'opportunity',
    'idea', 'supply chain', 'fintech', 'agency', 'platform', 'marketplace',
    'app', 'service', 'client', 'founder', 'workflow', 'ai', 'build',
    'software', 'manufacturing', 'e-commerce', 'ecommerce', 'product',
    'evaluate', 'analyze', 'blueprint', 'cost', 'profit'
  ];

  const hasPromptSignal = commercialSignals.some(kw => cleanPrompt.includes(kw));
  if (!hasPromptSignal && opportunitySensitivity !== 'aggressive') {
    return null;
  }

  const combined = (cleanPrompt + ' ' + responseText.toLowerCase());

  // Origin market comparison vs userCountry
  let originMarket = 'United States & Western Europe';
  if (userCountry.toLowerCase().includes('united states') || userCountry.toLowerCase().includes('us')) {
    originMarket = 'Emerging Tech Hubs & Asia-Pacific Markets';
  } else if (userCountry.toLowerCase().includes('dubai') || userCountry.toLowerCase().includes('uae')) {
    originMarket = 'Silicon Valley & Scandinavian Scale-Ups';
  }

  // Derive dynamic details from prompt
  let title = 'Cross-Border Strategic Arbitrage Venture';
  let tagline = `High-margin commercial model exploiting asymmetric talent & tech deltas in ${userCountry}`;
  let targetMarket = 'US / EMEA Mid-Market & High-Growth Scale-Ups';
  let tam = '$4.2B Global Addressable Market';
  let sam = '$850M Addressable Service Segment';
  let som = '$42M Capturable SOM (Year 3)';
  let grossMargin = '74.5%';
  let cac = '$1,200 (Outbound & Inbound Partner Funnel)';
  let ltv = '$28,500 (3-Yr Retention, 6.2% Churn)';
  let paybackPeriod = '2.4 Months';
  let capitalRequired = '$35,000 Initial Pilot Capital';
  let arbitrageMultiplier = '5.8x Cost-to-Value Arbitrage';
  let arbitrageRationale = `Delivers tier-1 enterprise grade execution at 22% of onshore cost basis while maintaining >70% gross margins. Unique opportunity in ${userCountry}.`;
  let keyRisks = [
    'Client timezone overlap requiring synchronized SLA management',
    'Talent churn mitigation via equity vesting & performance retention',
    'Cross-border tax compliance (Transfer Pricing & GST 18% refund cycles)'
  ];

  // Extract proper name or title if user mentioned one
  const namedMatch = prompt.match(/(?:build|create|launch|scale|name is|called)\s+([A-Z][A-Za-z0-9]+(?:\s+[A-Z][A-Za-z0-9]+)?)/i) ||
                     prompt.match(/\b([A-Z][a-z0-9]+[A-Z][a-z0-9]+)\b/); // CamelCase like DhvaniAstro
  const customVentureName = namedMatch ? namedMatch[1] : null;

  const promptLower = cleanPrompt;
  const contextLower = (cleanPrompt + ' ' + responseText.toLowerCase());

  // Check specific intent signals from user discussion
  const isAstro = /astro|vedic|spiritual|pandit|kundali|dhvani|horoscope/i.test(promptLower) || 
                  (/astro|vedic|spiritual|dhvani/i.test(contextLower) && /astro|vedic|spiritual|dhvani/i.test(promptLower));

  const isAutomation = /automation|workflow|agent|agency|b2b ops|medical billing|legal triage|pod|ai ops|task automation|operations/i.test(promptLower) ||
                       (/automation|workflow|agent|agency|b2b ops|medical billing|legal triage|pod/i.test(contextLower) && !isAstro);

  const isFintech = /fintech|bank|payment|wealth|fx|settlement|cross-border|treasury|remittance|invoicing/i.test(promptLower) ||
                    (/fintech|payment|fx|settlement|treasury/i.test(contextLower) && !isAstro && !isAutomation);

  const isD2C = /d2c|ecommerce|product|consumer|beauty|wellness|spice|botanical|export brand/i.test(promptLower) ||
                (/d2c|ecommerce|beauty|wellness|spice|botanical/i.test(contextLower) && !isAstro && !isAutomation && !isFintech);

  const isGCC = /gcc|captive|offshore|talent hub|engineering center/i.test(promptLower) ||
                (/gcc|captive|offshore|talent hub/i.test(contextLower) && !isAstro && !isAutomation && !isFintech && !isD2C);

  const isRegional = /tier 2|tier 3|rural|bharat|hyperlocal|logistics|supply chain/i.test(promptLower) ||
                     (/tier 2|tier 3|rural|bharat|hyperlocal/i.test(contextLower) && !isAstro && !isAutomation);

  if (isAstro) {
    title = customVentureName ? `${customVentureName} — AI Vedic Spiritual Platform` : 'DhvaniAstro — Real-Time Conversational AI Vedic Platform';
    tagline = 'Low-latency (<650ms) AI digital twin astrologers delivering empathetic astrological guidance via WebRTC';
    targetMarket = `Global Indian Diaspora (US, UK, GCC) & Tier-1/2 spiritual seekers in ${userCountry}`;
    tam = '$4.5B Global Astrology & Spiritual Tech Market';
    sam = '$850M Conversational Vedic Guidance & Kundali Consultations';
    som = '$52M High-Ticket AI Voice/Video Consultations';
    grossMargin = '84.0%';
    cac = '$14 (Meta / Vernacular Influencer funnels)';
    ltv = '$185 (Micro-subscriptions & Puja upsells)';
    paybackPeriod = 'Instant (First Call ROAS 1.6x)';
    capitalRequired = '$30,000 WebRTC & Voice Pod Pilot Sprint';
    arbitrageMultiplier = '9.2x Scalability Delta vs Human Astrologer Marketplaces';
    arbitrageRationale = `Zero human revenue share (saving 60% traditional commission fees); 24/7 instant availability across global timezones with zero wait time.`;
    keyRisks = ['Voice latency WebRTC jitter under 4G', 'Empathetic conversation safety & sensitivity guardrails'];
  } else if (isAutomation) {
    title = customVentureName ? `${customVentureName} — Autonomous AI Operations` : 'Agentic AI Workflow Arbitrage Factory';
    tagline = `Human-in-the-loop autonomous workflow ops connecting Western enterprise with top talent in ${userCountry}`;
    targetMarket = 'US SaaS, Healthcare Ops & Legal Practices (50-500 FTEs)';
    tam = '$18.6B AI Operations & Process Automation';
    sam = '$2.1B Outsourceable Repetitive Cognitive Workflows';
    som = '$65M High-Margin Segment';
    grossMargin = '78.2%';
    cac = '$950 per enterprise pilot';
    ltv = '$36,000 ARR with 120% Net Revenue Retention';
    paybackPeriod = '1.8 Months';
    capitalRequired = '$25,000 for infra & pilot sprint';
    arbitrageMultiplier = '6.4x Operational Delta';
    arbitrageRationale = `Selling at $65/hr equivalent value in the US while executing at $11/hr fully-loaded cost in ${userCountry}. High unmet regional demand.`;
    keyRisks = ['LLM hallucination SLA guardrails', 'Data privacy compliance (SOC2 Type II & HIPAA)'];
  } else if (isFintech) {
    title = customVentureName ? `${customVentureName} — Cross-Border FinTech Engine` : 'Cross-Border B2B Settlement & Treasury Engine';
    tagline = `Frictionless cross-border multi-currency payment rails between ${userCountry} exporters and global buyers`;
    targetMarket = `120,000 mid-market software and service exporters in ${userCountry}`;
    tam = '$24.8B Global B2B Cross-Border Payments';
    sam = '$3.2B India-US/UK SMB Exporter FX Volume';
    som = '$75M High-Margin FX Spread & Invoicing';
    grossMargin = '88.5%';
    cac = '$380 per enterprise exporter';
    ltv = '$24,000 Lifetime Transaction Spread';
    paybackPeriod = '0.9 Months';
    capitalRequired = '$45,000 (Payment Aggregator license & escrow infra)';
    arbitrageMultiplier = '5.2x Legacy Bank FX Spread Compression';
    arbitrageRationale = `Bypasses traditional correspondent banking 3.5% FX fees with sub-1% automated escrow settlement.`;
    keyRisks = ['RBI/Central Bank compliance licensing', 'Anti-Money Laundering transaction monitoring'];
  } else if (isD2C) {
    title = customVentureName ? `${customVentureName} — High-Margin Export Brand` : 'Indie-Origin High-Margin Export D2C Brand';
    tagline = `Direct-to-consumer premium functional goods from ${userCountry} to GCC, UK & US markets`;
    targetMarket = 'Affluent urban consumers in Dubai, Riyadh, London & New York';
    tam = '$12.4B Global Clean & Functional Goods';
    sam = '$1.8B Cross-Border Heritage Premium Brands';
    som = '$24M Target Omnichannel Brand Equity';
    grossMargin = '82.0%';
    cac = '$22 (Performance Influencers & Meta Retargeting)';
    ltv = '$145 (3.4 Orders/Year Average)';
    paybackPeriod = 'Instant (First Order ROAS 1.4x)';
    capitalRequired = '$40,000 Inventory & Export Certifications';
    arbitrageMultiplier = '4.2x Currency & Raw Material Arbitrage';
    arbitrageRationale = `Raw ingredients formulated at 1/5th global cost with luxury English packaging and air express fulfillment.`;
    keyRisks = ['FDA/ESMA compliance certification delays', 'International shipping surcharge volatility'];
  } else if (isGCC) {
    title = customVentureName ? `${customVentureName} — Micro-GCC Platform` : 'Micro-GCC as a Service (Global Capability Center)';
    tagline = `Turnkey 10-50 person engineering & data centers in ${userCountry} for European Mid-Caps`;
    targetMarket = 'DACH & Nordic Tech Scale-Ups facing extreme developer shortages';
    tam = '$60B Global In-house & Captive Centers';
    sam = '$6.4B European Mid-Market Tech Teams';
    som = '$80M Specialized Captive Setup Fees & Retainers';
    grossMargin = '68.0%';
    cac = '$4,500 via account-based executive outreach';
    ltv = '$180,000 (Multi-year MSAs)';
    paybackPeriod = '3.0 Months';
    capitalRequired = '$50,000 Working Capital & Legal Entity Setup';
    arbitrageMultiplier = '4.8x Salary & Infrastructure Delta';
    arbitrageRationale = `European engineers cost €110k+; fully-loaded top 5% engineers in ${userCountry} cost €28k with managed workspace and legal compliance.`;
    keyRisks = ['Cultural synchronization in German-speaking markets', 'Initial entity incorporation regulatory hurdles'];
  } else if (isRegional) {
    title = customVentureName ? `${customVentureName} — Regional Logistics Network` : `${userCountry} Hyperlocal Micro-Fulfilment Engine`;
    tagline = 'Asset-light supply chain distribution network connecting regional MSMEs directly to metropolitan demand';
    targetMarket = '250,000 Tier-2/3 light manufacturers and processing units';
    tam = '$32B Domestic Fragmented Wholesale Supply Chain';
    sam = '$4.8B Organized Regional Logistics Corridors';
    som = '$95M High-velocity FMCG & Hardware Spares';
    grossMargin = '34.0% (High-volume negative working capital)';
    cac = '₹4,200 / $50 per verified distributor node';
    ltv = '₹380,000 / $4,500 Lifetime GMV commission';
    paybackPeriod = '1.2 Months';
    capitalRequired = '$30,000 (Tech platform & micro-hub deposits)';
    arbitrageMultiplier = '3.5x Middlemen Margin Compression';
    arbitrageRationale = `Eliminates 3 tiers of traditional middlemen distributors, splitting 18% margin savings between manufacturer and buyer.`;
    keyRisks = ['Credit collection risk in informal markets', 'Cash-on-delivery return ratios'];
  } else {
    // Dynamic Custom Venture Title formulated from user prompt
    const cleanedIdea = prompt
      .replace(/^(i want to build|i want to create|evaluate|create|launch|build|a|an|the|app|platform|for|how to make|business idea for)\s+/gi, '')
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .trim();

    const titleWords = cleanedIdea.split(/\s+/).filter(Boolean).slice(0, 4)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

    if (titleWords.length > 2) {
      title = `${titleWords} — Strategic Venture Platform`;
      tagline = `High-margin commercial model exploiting asymmetric talent & tech deltas in ${userCountry}`;
    }
  }

  return {
    id: 'pitch_' + Math.random().toString(36).substring(2, 9),
    title,
    tagline,
    targetMarket,
    tam,
    sam,
    som,
    grossMargin,
    cac,
    ltv,
    paybackPeriod,
    capitalRequired,
    arbitrageMultiplier,
    arbitrageRationale,
    keyRisks,
    isUniqueInUserCountry: true,
    userCountry,
    detectedOriginMarket: originMarket
  };
}

export function generateAIVideoDeliverable(
  pitch: VenturePitchCardData,
  settings?: UserSettings
): AIVideoDeliverable {
  const charArchetype = settings?.videoAgent?.characterArchetype || 'tech_founder';
  const aspectRatio = settings?.videoAgent?.aspectRatio || '16:9';
  const videoPlatform = settings?.connectors?.video?.provider || 'heygen';

  const characterMap = {
    tech_founder: {
      name: 'Aiden Vance',
      role: 'Founding Tech Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
    },
    mckinsey_partner: {
      name: 'Eleanor Sterling',
      role: 'Senior Strategic Partner',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'
    },
    modern_creator: {
      name: 'Kai Chen',
      role: 'Venture Growth Director',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
    },
    corporate_cfo: {
      name: 'Marcus Reynolds',
      role: 'Capital Allocator & CFO',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
    },
    ai_avatar_3d: {
      name: 'Nexus-7 AI',
      role: 'Autonomous Digital Spokesperson',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80'
    }
  };

  const selectedChar = characterMap[charArchetype] || characterMap.tech_founder;

  const scenes: VideoScene[] = [
    {
      id: 'sc_1',
      sceneNumber: 1,
      timecode: '0:00 - 0:10',
      visualPrompt: `High-energy cinematic shot: ${selectedChar.name} standing in modern minimalist glass boardroom with glowing dynamic market ticker and global data stream overlay.`,
      characterAction: 'Direct eye contact to lens, crisp gestures with confidence.',
      voiceoverScript: `What if you could capture a ${pitch.arbitrageMultiplier} cost-to-value differential while delivering enterprise execution in under 48 hours? Meet ${pitch.title}.`,
      onScreenText: `${pitch.title.toUpperCase()} • ${pitch.arbitrageMultiplier.toUpperCase()}`
    },
    {
      id: 'sc_2',
      sceneNumber: 2,
      timecode: '0:10 - 0:25',
      visualPrompt: `Split-screen visual: On the left, bloated legacy Western cost structures ($140k/yr); on the right, streamlined AI-augmented talent pod with real-time SOC-2 pipeline.`,
      characterAction: 'Pointing to animated graphic diagram of the cross-border arbitrage bridge.',
      voiceoverScript: `While legacy competitors burn 70% of revenue on domestic overhead, our autonomous architecture unlocks a ${pitch.grossMargin} gross margin and instant 2-month payback.`,
      onScreenText: `GROSS MARGIN: ${pitch.grossMargin} | PAYBACK: ${pitch.paybackPeriod}`
    },
    {
      id: 'sc_3',
      sceneNumber: 3,
      timecode: '0:25 - 0:45',
      visualPrompt: `Dynamic product dashboard tour: Fast-paced showcase of the client portal, real-time ticket execution, and automated quality-assurance linting engine.`,
      characterAction: 'Demonstrating live dashboard interactions on a floating holographic UI.',
      voiceoverScript: `Targeting a ${pitch.tam} global market, we secure high-ticket clients on recurring retainers with 98% first-time-right SLAs.`,
      onScreenText: `TAM: ${pitch.tam} • FIRST-TIME-RIGHT SLA > 98%`
    },
    {
      id: 'sc_4',
      sceneNumber: 4,
      timecode: '0:45 - 1:00',
      visualPrompt: `Inspiring closing frame: ${selectedChar.name} with team pod collaborating in background, brand logo animating with 1-click CTA button.`,
      characterAction: 'Warm, decisive smile and hand gesture inviting review of complete executive strategic blueprint.',
      voiceoverScript: `The window of commercial arbitrage is open right now. Review our complete 3-deliverable execution blueprint and launch today.`,
      onScreenText: `LAUNCH YOUR VENTURE WITH VYUHA AI`
    }
  ];

  return {
    id: 'vid_' + Math.random().toString(36).substring(2, 9),
    title: `${pitch.title} — AI Commercial & Pitch Video`,
    characterName: selectedChar.name,
    characterRole: selectedChar.role,
    characterAvatar: selectedChar.avatar,
    aspectRatio,
    durationSeconds: 60,
    adHook: `Capturing the ${pitch.arbitrageMultiplier} market delta with ${pitch.grossMargin} gross margins.`,
    fullScript: scenes.map(s => `[${s.timecode}] ${s.voiceoverScript}`).join('\n\n'),
    storyboard: scenes,
    videoPlatform,
    status: 'ready'
  };
}

export function generateLegalGovernanceFramework(
  pitch: VenturePitchCardData,
  country: string = 'India'
): LegalGovernanceFramework {
  const normCountry = country.toLowerCase();
  const isIndia = normCountry.includes('india');
  const isUS = normCountry.includes('united states') || normCountry.includes('us') || normCountry.includes('usa');
  const isUAE = normCountry.includes('uae') || normCountry.includes('dubai') || normCountry.includes('emirates');
  const isUK = normCountry.includes('uk') || normCountry.includes('united kingdom') || normCountry.includes('london') || normCountry.includes('europe');

  const jurisdictionLabel = isIndia ? 'India (MCA / DPDP / RBI)' : isUS ? 'United States (Delaware / FTC / SEC)' : isUAE ? 'United Arab Emirates (IFZA / DED / CBUAE)' : isUK ? 'United Kingdom & EU (Companies House / GDPR)' : `${country} (Sovereign Commercial Laws)`;

  // LEVEL 1
  const level1: LegalComplianceLevel = {
    levelNumber: 1,
    title: 'Level 1: Foundation & Pre-Incorporation (Setup & IP Protection)',
    subtitle: 'Founder equity split, intellectual property assignment, and trade secret shields.',
    jurisdiction: jurisdictionLabel,
    statutoryBodies: isIndia 
      ? ['Registrar of Trademarks (India)', 'Indian Patent Office (IPO)', 'Ministry of Law and Justice']
      : isUS 
      ? ['USPTO (US Patent & Trademark Office)', 'Delaware Department of State', 'US Copyright Office']
      : isUAE
      ? ['UAE Ministry of Economy (IP Dept)', 'DMCC / IFZA Registrar', 'Dubai Courts']
      : ['UK Intellectual Property Office (UKIPO)', 'High Court of Justice (Chancery Division)'],
    keyClauses: [
      {
        clauseTitle: '1.1 Comprehensive Intellectual Property Assignment Deed (Pre-Incorporation)',
        content: `All proprietary software source code, algorithmic weights, custom fine-tuned model telemetry, database architectures, and commercial trade secrets created by founders or initial contributors for "${pitch.title}" are hereby irrevocably assigned to the corporate entity with full global indemnity, extinguishing any individual moral rights claims.`,
        enforceableAct: isIndia ? 'Indian Copyright Act 1957 (Section 19) & Patents Act 1970' : isUS ? 'Title 17 U.S. Code & Delaware General Corporation Law' : 'Federal Decree-Law No. 36 of 2021 on Trademarks & Copyright'
      },
      {
        clauseTitle: '1.2 Founder Reverse Vesting & Good/Bad Leaver Covenants',
        content: `Founding equity allocations are subject to a mandatory 4-Year Linear Vesting Schedule with a standard 1-Year Cliff (25% cliff, 1/48th monthly thereafter). In the event of a voluntary departure or Termination with Cause ("Bad Leaver"), unvested equity is repurchased at nominal par value ($0.0001 / ₹0.10 per share).`,
        enforceableAct: isIndia ? 'Indian Contract Act 1872 & MCA Private Placement Guidelines' : isUS ? 'Delaware DGCL Section 202 & IRS Section 83(b)' : 'DIFC Companies Law / Freezone Shareholder Regulations'
      },
      {
        clauseTitle: '1.3 Non-Disclosure & Permissible Restrictive Covenants',
        content: `Mutual NDA enforcing strict trade secret protection over proprietary operational prompts, customer acquisition funnels, and margin models, enforceable for 36 months following termination across all active commercial jurisdictions.`,
        enforceableAct: isIndia ? 'Indian Contract Act 1872 (Section 27 Reasonable Restraints)' : isUS ? 'Uniform Trade Secrets Act (UTSA) & Defend Trade Secrets Act (DTSA)' : 'UAE Commercial Transactions Law'
      }
    ],
    actionChecklist: [
      'Execute Founder IP Assignment Agreements prior to writing first line of production code',
      'File Form TM-A for Brand Name & Wordmark protection in Class 9 (Software) & Class 42 (Tech Services)',
      'Submit IRS 83(b) tax election within strict 30-day statutory window (if US entity holds IP)'
    ]
  };

  // LEVEL 2
  const level2: LegalComplianceLevel = {
    levelNumber: 2,
    title: 'Level 2: Entity Registration & Statutory Tax Compliance',
    subtitle: 'Corporate incorporation, tax structuring, statutory registrations, and government incentive filings.',
    jurisdiction: jurisdictionLabel,
    statutoryBodies: isIndia 
      ? ['Ministry of Corporate Affairs (MCA)', 'Central Board of Indirect Taxes & Customs (CBIC - GST)', 'Department for Promotion of Industry and Internal Trade (DPIIT)']
      : isUS 
      ? ['Delaware Division of Corporations', 'Internal Revenue Service (IRS)', 'FinCEN (Financial Crimes Enforcement Network)']
      : isUAE
      ? ['Federal Tax Authority (FTA)', 'Dubai Economy and Tourism (DED)', 'IFZA Freezone Authority']
      : ['Companies House (UK)', 'HM Revenue & Customs (HMRC)', 'Information Commissioner’s Office (ICO)'],
    keyClauses: [
      {
        clauseTitle: '2.1 Statutory Incorporation & Articles of Association (AoA)',
        content: isIndia 
          ? `Incorporation as a Private Limited Company under MCA SPICe+ (Part A & B) with authorized share capital structure designed for angel/institutional equity rounds, complete with PAN, TAN, EPFO, ESIC, and Profession Tax registration.`
          : isUS 
          ? `Delaware C-Corporation incorporation with Certificate of Incorporation authorizing 10,000,000 Common Stock ($0.0001 par value) and standard indemnification provisions for Directors and Officers per DGCL Section 102(b)(7).`
          : `Freezone Limited Liability Company (FZ-LLC) under IFZA/DMCC framework with dual-tier multi-currency bank account operational authorization and zero personal income tax status.`,
        enforceableAct: isIndia ? 'Companies Act 2013 (Section 7) & SPICe+ Charter' : isUS ? 'Delaware General Corporation Law (DGCL Title 8)' : 'UAE Cabinet Decision No. 58 of 2020 on Beneficial Ownership'
      },
      {
        clauseTitle: '2.2 Goods & Services Tax (GST) & Cross-Border Export Tax Immunity',
        content: isIndia
          ? `Filing of Letter of Undertaking (LUT) per Form GST RFD-11 allowing zero-rated export of software/consulting services to foreign clients without payment of integrated GST, unlocking full input tax credit (ITC) refunds.`
          : isUS
          ? `Federal Employer Identification Number (EIN) registration via Form SS-4, state franchise tax compliance, and automated nexus tracking for multi-state SaaS economic sales tax collection.`
          : `Federal Tax Authority (FTA) Corporate Tax Registration (0% on qualifying Freezone income under Federal Decree-Law No. 47 of 2022; 9% on mainland non-qualifying revenue).`,
        enforceableAct: isIndia ? 'Central Goods and Services Tax Act 2017 (Section 16 - Zero Rated Supplies)' : isUS ? 'Internal Revenue Code (IRC) Title 26' : 'UAE Corporate Tax Law (Decree-Law No. 47 of 2022)'
      },
      {
        clauseTitle: '2.3 Startup India & Sovereign Innovation Incentive Recognition',
        content: isIndia
          ? `DPIIT Startup India Recognition application to secure eligibility for Section 80-IAC (100% Tax Holiday for 3 consecutive financial years) and Angel Tax exemption under Section 56(2)(viib).`
          : isUS
          ? `Section 1202 Qualified Small Business Stock (QSBS) qualification allowing founders and early investors up to $10M or 10x capital gains federal tax exclusion on holding stock >5 years.`
          : `UAE Golden Visa & Hub71 / In5 Tech Incubator licensing subvention qualification for core engineering leadership.`,
        enforceableAct: isIndia ? 'Income Tax Act 1961 (Section 80-IAC & Section 56(2)(viib))' : isUS ? 'Internal Revenue Code Section 1202 (QSBS)' : 'UAE Cabinet Resolution on Golden Visas'
      }
    ],
    actionChecklist: [
      'Procure Digital Signature Certificates (DSC Class 3) and Director Identification Numbers (DIN)',
      'Open Primary Corporate Multi-Currency Current Account with Automated Export Settlement Codes',
      'Execute FinCEN BOI (Beneficial Ownership Information) filing within 90 days of formation'
    ]
  };

  // LEVEL 3
  const level3: LegalComplianceLevel = {
    levelNumber: 3,
    title: 'Level 3: Product, Consumer Protection & Legal Disclaimers',
    subtitle: 'Terms of service, privacy compliance, AI safety guardrails, and customer liability caps.',
    jurisdiction: jurisdictionLabel,
    statutoryBodies: isIndia 
      ? ['Data Protection Board of India (DPBI)', 'Central Consumer Protection Authority (CCPA - India)', 'Ministry of Electronics and Information Technology (MeitY)']
      : isUS 
      ? ['Federal Trade Commission (FTC)', 'Consumer Financial Protection Bureau (CFPB)', 'California Privacy Protection Agency (CPPA)']
      : isUAE
      ? ['UAE Data Office', 'Consumer Protection Department (Ministry of Economy)', 'Telecommunications and Digital Government Regulatory Authority (TDRA)']
      : ['European Data Protection Board (EDPB)', 'UK Information Commissioner’s Office (ICO)', 'Advertising Standards Authority (ASA)'],
    keyClauses: [
      {
        clauseTitle: '3.1 Digital Personal Data Protection & Sovereign Privacy Telemetry',
        content: isIndia
          ? `Strict compliance with DPDP Act 2023: Lawful itemized consent notice prior to collecting user date/time/birth location data or enterprise telemetry. Clear data fiduciary obligations, right to erasure, and nomination of an in-country Grievance Redressal Officer.`
          : isUS
          ? `California Consumer Privacy Act (CCPA/CPRA) and COPPA-compliant privacy policy ensuring 'Do Not Sell or Share My Personal Info' controls and automated opt-out telemetry.`
          : `Compliance with UAE Personal Data Protection Law (Federal Decree-Law No. 45 of 2021) regarding cross-border data transfer security safeguards and user consent protocols.`,
        enforceableAct: isIndia ? 'Digital Personal Data Protection Act 2023 (DPDP Act)' : isUS ? 'California Consumer Privacy Act (CCPA) & COPPA 15 U.S.C.' : 'UAE Federal Decree-Law No. 45/2021 on Personal Data Protection'
      },
      {
        clauseTitle: '3.2 AI Autonomous Guidance & Entertainment Non-Liability Disclaimer',
        content: `All recommendations, voice interactions, predictions, or automated deliverables generated by "${pitch.title}" are provided strictly on an "AS-IS" and "AS-AVAILABLE" basis for informational and advisory simulation purposes. Under no circumstances shall the platform be construed as providing certified medical, legal, psychological, or fiduciary investment counsel. Maximum aggregate liability is strictly capped at fees paid by customer in the preceding 3 months.`,
        enforceableAct: isIndia ? 'Consumer Protection (E-Commerce) Rules 2020 & IT Act 2000 Section 79' : isUS ? 'Communications Decency Act Section 230 & FTC AI Advertising Guidance' : 'UAE Consumer Protection Law (Federal Law No. 15 of 2020)'
      },
      {
        clauseTitle: '3.3 Digital Subscriptions & Refund / Chargeback Policy',
        content: `Transparent digital micro-billing disclosure: Subscriptions renew automatically until canceled in user portal 24 hours prior to billing cycle. Digital voice minutes and instant synthesized deliverables are deemed consumed upon delivery, preventing chargeback exploitation.`,
        enforceableAct: isIndia ? 'RBI E-Mandate Framework & Consumer Protection Act 2019' : isUS ? 'Restore Online Shoppers Confidence Act (ROSCA 15 U.S.C.)' : 'UAE Central Bank Consumer Protection Standards'
      }
    ],
    actionChecklist: [
      'Publish clickable Master Terms of Service (ToS) and Privacy Policy on web and mobile onboarding views',
      'Implement explicit checkbox consent timestamp logging on user sign-up and checkout modals',
      'Appoint and publish official Grievance Redressal Officer contact details per statutory mandate'
    ]
  };

  // LEVEL 4
  const level4: LegalComplianceLevel = {
    levelNumber: 4,
    title: 'Level 4: Astrologer / Expert Likeness Licensing & Partner Contracts',
    subtitle: 'Voice & video digital twin licensing, personality rights, revenue splits, and ethical guardrails.',
    jurisdiction: jurisdictionLabel,
    statutoryBodies: isIndia 
      ? ['High Court of Delhi (Personality Rights Rulings)', 'Indian Copyright Office', 'Bar Council of India / Trade Associations']
      : isUS 
      ? ['SAG-AFTRA Digital Likeness Standards', 'State Courts (Right of Publicity Jurisdiction)', 'US Copyright Office']
      : isUAE
      ? ['National Media Council (NMC)', 'Dubai Media City (DMC)', 'Ministry of Economy']
      : ['Equity UK Performer Rights', 'UK High Court of Justice (Passing Off / Publicity)'],
    keyClauses: [
      {
        clauseTitle: '4.1 Exclusive AI Voice & Digital Avatar Likeness Master License',
        content: `The Expert / Astrologer grants the company an exclusive, worldwide, sublicensable commercial license to capture, synthesize, clone, and deploy their vocal timbre, likeness, personality traits, and custom consultation methodologies in AI conversational software, retaining zero claims for separate residual royalties beyond agreed revenue share.`,
        enforceableAct: isIndia ? 'Indian Copyright Act 1957 (Sections 17 & 38A Performer Rights) & Common Law Personality Rights' : isUS ? 'State Right of Publicity Statutes (e.g. California Civil Code Section 3344)' : 'UAE Copyright Law (Moral Rights Waiver Provisions)'
      },
      {
        clauseTitle: '4.2 Partner Revenue Share & Automated Settlement SLA',
        content: `Clear tiered revenue disbursement: Partner receives structured revenue share (e.g. 20%-35% of net session billings after payment gateway & infrastructure deduction) calculated on a monthly cadence, settling within T+5 business days with automated TDS / 1099 withholding certificates.`,
        enforceableAct: isIndia ? 'Income Tax Act 1961 (Section 194J TDS on Professional Fees)' : isUS ? 'IRS 1099-MISC / 1099-NEC Reporting Guidelines' : 'UAE Commercial Agency & Contract Law'
      },
      {
        clauseTitle: '4.3 Ethical Conduct & Brand Safety Safeguards',
        content: `Mandatory prohibition against generating hate speech, political propaganda, superstition-based panic, or guaranteed outcome claims. The company retains unconditional emergency kill-switch rights to suspend any digital persona exhibiting anomalous output.`,
        enforceableAct: isIndia ? 'Information Technology (Intermediary Guidelines) Rules 2021' : isUS ? 'FTC Unfair and Deceptive Practices (Section 5)' : 'UAE Cybercrime Law (Federal Decree-Law No. 34 of 2021)'
      }
    ],
    actionChecklist: [
      'Execute bilateral AI Digital Twin Likeness Master Agreements with all featured domain experts',
      'Implement voice model authentication watermarking and signed consent recording logs',
      'Set up automated net revenue disbursement escrow accounting logic'
    ]
  };

  // LEVEL 5
  const level5: LegalComplianceLevel = {
    levelNumber: 5,
    title: 'Level 5: Growth, Payment Gateway & Investor Governance',
    subtitle: 'Payment merchant agreements, FDI capital compliance, shareholder charters, and investor governance.',
    jurisdiction: jurisdictionLabel,
    statutoryBodies: isIndia 
      ? ['Reserve Bank of India (RBI)', 'Securities and Exchange Board of India (SEBI)', 'Foreign Exchange Management Act (FEMA) Cell']
      : isUS 
      ? ['Securities and Exchange Commission (SEC)', 'Payment Card Industry Security Standards Council (PCI-SSC)', 'FINRA']
      : isUAE
      ? ['Central Bank of the UAE (CBUAE)', 'Dubai Financial Services Authority (DFSA)', 'Abu Dhabi Global Market (ADGM)']
      : ['Financial Conduct Authority (FCA)', 'Prudential Regulation Authority (PRA)', 'British Business Bank'],
    keyClauses: [
      {
        clauseTitle: '5.1 Payment Gateway Aggregator Compliance & Escrow Mechanics',
        content: isIndia
          ? `Compliance with RBI Payment Aggregator Guidelines (Razorpay / Cashfree / Stripe India): PCI-DSS Level 1 tokenized card storage, 2-Factor Authentication (OTP/SMS), daily settlement reconciliation, and instant chargeback dispute management protocol.`
          : isUS
          ? `Stripe / Adyen Merchant Processing Terms adherence: SOC-2 Type II audit readiness, automated anti-fraud radar scoring, and NACHA ACH payment rules compliance.`
          : `Central Bank of UAE Stored Value Facility & Retail Payment Services compliance ensuring seamless AED/USD cross-border merchant settlement.`,
        enforceableAct: isIndia ? 'Payment and Settlement Systems Act 2007 & RBI Guidelines on Regulation of Payment Aggregators' : isUS ? 'Electronic Fund Transfer Act (Regulation E) & PCI-DSS Standards' : 'CBUAE Regulatory Framework for Stored Values'
      },
      {
        clauseTitle: '5.2 Cross-Border FDI Capital Inflow & FEMA / FIRMS Compliance',
        content: isIndia
          ? `All foreign capital investments received from US/Global angels or VC funds must be processed via the 100% Automatic FDI Route with mandatory filing of Form FC-GPR on the RBI FIRMS portal within 30 days of share allotment, backed by Chartered Accountant Valuation Certificate (DCF method).`
          : isUS
          ? `Execution of Y Combinator Post-Money SAFE (Simple Agreement for Future Equity) or Convertible Promissory Notes under SEC Regulation D (Rule 506(b)) private placement exemption with Form D filed within 15 days.`
          : `DIFC / ADGM standard Seed Investment Instruments with clean capitalization table recorded in Dubai international financial registry.`,
        enforceableAct: isIndia ? 'Foreign Exchange Management Act 1999 (FEMA 20(R)) & RBI Master Direction on Foreign Investment' : isUS ? 'Securities Act of 1933 (Regulation D Rule 506) & National Securities Markets Improvement Act' : 'DIFC Companies Law (Law No. 5 of 2018)'
      },
      {
        clauseTitle: '5.3 Comprehensive Shareholders’ Agreement (SHA) & Board Governance',
        content: `Institutional-grade governance architecture containing standard Drag-Along rights (75% investor consent), Tag-Along co-sale rights, Right of First Refusal (ROFR), 1x Non-Participating Liquidation Preference, Information Rights (quarterly unaudited P&L + annual audited balance sheet), and Board Reserved Matters.`,
        enforceableAct: isIndia ? 'Companies Act 2013 (Section 58) & Landmark Supreme Court Corporate Jurisprudence' : isUS ? 'Delaware DGCL Section 218 & NVCA Model Legal Documents' : 'ADGM / DIFC Court Enforceability Framework'
      }
    ],
    actionChecklist: [
      'Complete PCI-DSS Level 1 Self-Assessment Questionnaire (SAQ-A) with payment provider',
      'Standardize YC Post-Money SAFE and Convertible Note templates for immediate angel syndication',
      'Establish Board Resolution cadence and digital statutory registers (MGT-1, PAS-3, SH-1)'
    ]
  };

  return {
    jurisdiction: jurisdictionLabel,
    frameworkSummary: `Complete 5-Level Corporate, Legal, IP, Regulatory, and Capital Governance architecture specifically tailored for ${pitch.title} under ${jurisdictionLabel} statutes.`,
    levels: [level1, level2, level3, level4, level5]
  };
}

export function generateFullDeliverableSuite(
  pitch: VenturePitchCardData,
  settings?: UserSettings
): DeliverableSuite {
  const videoDeliverable = generateAIVideoDeliverable(pitch, settings);
  const userCountry = pitch.userCountry || settings?.location.country || 'India';
  const legalFramework = generateLegalGovernanceFramework(pitch, userCountry);

  return {
    id: 'deliv_' + Math.random().toString(36).substring(2, 9),
    pitchId: pitch.id,
    title: pitch.title,
    tagline: pitch.tagline,
    createdAt: new Date().toISOString(),
    executiveSummary: {
      vision: `Build the definitive market leader in "${pitch.title}", capitalizing on asymmetric talent costs, modern AI automation, and high-velocity international commercial channels.`,
      problemStatement: `Legacy market incumbents suffer from bloated domestic cost structures (4-6x higher operational overhead), cumbersome legacy software stacks, and sluggish turnaround times that cannot keep pace with dynamic modern requirements.`,
      solutionOverview: `An autonomous, technology-first operating architecture combining specialized talent in ${pitch.userCountry || 'India'}, proprietary AI agent pipelines, and high-touch front-of-house client management to deliver 10x faster execution at 70%+ gross margins.`,
      marketArbitrageThesis: pitch.arbitrageRationale || `Exploits the structural ${pitch.arbitrageMultiplier} valuation and cost differential between Tier-1 enterprise budgets and low-overhead high-skill operational hubs.`,
      competitiveMoats: [
        `Proprietary Human-in-the-Loop workflow tooling reducing unit labor hours by 64%`,
        `Direct sourcing contracts with zero agency intermediary markups`,
        `Pre-built SOC-2 & ISO-27001 compliant sovereign data boundary architecture`,
        `Exclusive outbound distribution partnerships with niche trade communities`
      ],
      financialModel: {
        year1Revenue: '$480,000 (40 Active Retainers / Clients)',
        year2Revenue: '$1,850,000 (150 Active Accounts, 25% Expansion)',
        year3Revenue: '$5,200,000 (Enterprise Tier Scale & Platform Licensing)',
        breakEvenMonth: 'Month 4 post-launch',
        ebitdaMargin: '58.4% at steady state'
      }
    },
    pinToPlaneArchitecture: {
      phase1_30Days: [
        `Incorporate lean dual-entity structure (Holding Company + ${pitch.userCountry || 'Indian'} Operating Subsidiary)`,
        'Build interactive MVP landing deck and benchmark case studies demonstrating 48-hour SLA turnaround',
        'Establish cold outbound funnel: 1,500 hyper-targeted ICP decision-maker contacts with personalized video audit samples',
        'Secure first 3 paid pilot LOIs with 50% upfront retainer deposit'
      ],
      phase2_90Days: [
        'Deploy production-ready operational workflow management dashboard with real-time client status tracking',
        'Hire core squad: 1 Lead Solutions Architect, 2 Senior Execution Specialists, 1 Quality Assurance Lead',
        'Implement standardized SOP playbook for client onboarding, tokenized asset handoff, and weekly reporting',
        'Scale pilot cohort from 3 to 18 active paying accounts with 95%+ CSAT rating'
      ],
      phase3_180Days: [
        'Automate 60% of routine client deliverables using internal custom AI micro-agents',
        'Launch dedicated Referral Partner Program offering 15% recurring revenue share to agency consultants',
        'Open second operational pod in tier-2 talent hub to reduce blended seat cost by further 25%',
        'Prepare Series Seed / Non-dilutive Venture Debt collateral package for aggressive outbound marketing scale'
      ],
      techStack: [
        'Backend & Engine: Node.js / TypeScript, Multi-LLM Orchestrator (Gemini / Claude / OpenAI), Express, PostgreSQL',
        'Frontend & Portal: React 19, Tailwind CSS, WebSockets for live collaborative client dashboards',
        'Video AI Engine: Runway Gen-3 / HeyGen / Sora API Pipeline for autonomous commercial generation',
        'Infrastructure: Cloud Run, Docker containers, Cloudflare Enterprise DDoS & Edge caching',
        'Integrations: Stripe Billing, Connected Cloud Drive, Custom Mail Server, Connected Social Messaging API'
      ],
      operationalSOPs: [
        'SOP-01: 24-Hour Client Intake & Scope Locking Protocol',
        'SOP-02: Multi-Layer Quality Assurance Peer-Review & Automated Code/Document Linter',
        'SOP-03: Daily 15-Minute Asynchronous Standup & Red-Flag Escalation Workflow',
        'SOP-04: Automated Weekly Value-Delivered ROI Dashboard Dispatch'
      ],
      complianceLegal: [
        'FEMA / Cross-border invoicing via Export Data Processing protocols',
        'Comprehensive Master Services Agreement (MSA) with strict IP assignment and Non-Disclosure clauses',
        'General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA) Data Processing Addendum (DPA)'
      ]
    },
    skillsEBook: {
      coreRoles: [
        {
          role: 'Founding Solutions Architect & Client Lead',
          profile: '5+ years experience translating complex enterprise client requirements into structured technical specs. High communication polish.',
          salaryRange: '₹18L - ₹26L / $24k - $35k Base + Equity Pool',
          sourcePool: 'Tier-1 Strategy & Product Leadership from Elite Advisory / Tech Firms'
        },
        {
          role: 'Senior Workflow Automation Specialist',
          profile: 'Expert in Python, TypeScript, LangChain/LLM SDKs, API integrations, and low-latency webhook orchestration.',
          salaryRange: '₹12L - ₹18L / $16k - $24k Base + Performance Bonus',
          sourcePool: 'Fast-growing B2B SaaS startups or high-growth GCC innovation labs'
        },
        {
          role: 'Operations & Quality Assurance Manager',
          profile: 'Rigorous attention to detail, ISO/Six-Sigma mindset, SLA tracking, and asynchronous client communication mastery.',
          salaryRange: '₹8L - ₹12L / $11k - $16k Base',
          sourcePool: 'Tier-1 BPO/KPO process leads and Tech Operations coordinators'
        }
      ],
      criticalSkills: [
        'Autonomous Prompt Engineering & Chain-of-Thought System Prompt Design',
        'Cross-Cultural Executive Stakeholder Management & Asynchronous Video Demos',
        'Unit Economics Modeling, Dynamic Pricing, and Margin Preservation',
        'Continuous Process Optimization & Error-Proofing (Poka-Yoke SOP Design)'
      ],
      kpiCadence: [
        { frequency: 'Daily', metric: 'Turnaround Velocity (Hours to Deliverable)', target: '< 18 Hours Average' },
        { frequency: 'Weekly', metric: 'First-Time-Right QA Score', target: '> 98.2% Pass Rate' },
        { frequency: 'Monthly', metric: 'Client Net Revenue Retention (NRR)', target: '> 115%' },
        { frequency: 'Quarterly', metric: 'Blended Gross Margin Percentage', target: '≥ 75.0%' }
      ],
      trainingChecklist: [
        'Module 1: High-Stakes Western Business Communication & Etiquette Manual',
        'Module 2: Mastering the Vyuha AI Strategic Engine & Knowledge Repositories',
        'Module 3: Security & IP Protection: Handling Confidential Client Data',
        'Module 4: Speed vs. Polish: The 3-Tier Escalation Matrix for Client Queries'
      ]
    },
    videoDeliverable,
    legalFramework
  };
}

export function generateOmniPulseSignals(channel: SocialChannel, days: number = 7): OmniPulseSignal[] {
  const allSignals: OmniPulseSignal[] = [
    {
      id: 'sig_1',
      channel: 'reddit',
      topic: 'r/startups — US founders struggling with $12k/mo Dev agency rates',
      painPoint: 'Founders complaining that US dev agencies charge $150-$200/hr with 3-month minimums and junior staff.',
      demandVolume: 'Explosive',
      arbitrageAngle: 'Fixed-fee $3,900/mo Dedicated Senior Fullstack Pod in Bangalore with 48h onboarding.',
      opportunityScore: 96,
      suggestedIdea: 'Fractional CTO + Managed Bangalore Dev Pod for YC & Seed Stage Startups',
      sentiment: 'Frustrated Users',
      timestamp: '2 hours ago'
    },
    {
      id: 'sig_2',
      channel: 'twitter',
      topic: 'X/Tech Founders — AI Legal & Compliance Document Automation gap',
      painPoint: 'Small law firms and cross-border tech companies drowning in NDA, MSA, and GDPR contract markup backlog.',
      demandVolume: 'Very High',
      arbitrageAngle: 'Proprietary Gemini/Claude contract triage engine + Indian legal paralegal verification at $40/doc (vs $400 US attorney rate).',
      opportunityScore: 92,
      suggestedIdea: 'B2B Cross-Border Contract Triage & Compliance Guardrail Agency',
      sentiment: 'High Commercial Intent',
      timestamp: '4 hours ago'
    },
    {
      id: 'sig_3',
      channel: 'linkedin',
      topic: 'Mid-Market CFOs — Software Licensing & Cloud Cost Bloat (FinOps)',
      painPoint: 'Companies with $50k-$300k/mo AWS/GCP bills lack dedicated in-house FinOps to trim idle Kubernetes & GPU instances.',
      demandVolume: 'High',
      arbitrageAngle: 'Zero upfront cost, 30% performance fee on verified monthly cloud savings executed by remote DevOps engineers.',
      opportunityScore: 89,
      suggestedIdea: 'Performance-Share Cloud FinOps & GPU Cluster Optimization Bureau',
      sentiment: 'High Commercial Intent',
      timestamp: '6 hours ago'
    },
    {
      id: 'sig_4',
      channel: 'hackernews',
      topic: 'Show HN — Demand for Instant Web Scraping & Cleaned Datasets for LLM Fine-tuning',
      painPoint: 'AI startups need high-volume, compliant specialized domain datasets without burning core engineering cycles building custom scrapers.',
      demandVolume: 'Explosive',
      arbitrageAngle: 'Turnkey data harvesting pipelines + manual edge-case cleaning squads in India at $0.002 per cleaned token.',
      opportunityScore: 95,
      suggestedIdea: 'Bespoke LLM Training Data Factory & Real-Time Web Miner',
      sentiment: 'Rising Trend',
      timestamp: '8 hours ago'
    },
    {
      id: 'sig_5',
      channel: 'producthunt',
      topic: 'Top Voted Products — High-End Shopify Custom App Migrations',
      painPoint: 'D2C merchants wanting custom checkout upsells and ERP syncing without paying Shopify Plus agencies $30k upfront.',
      demandVolume: 'High',
      arbitrageAngle: 'Modular micro-apps deployed in 72 hours for $1,500 one-time + $99/mo maintenance.',
      opportunityScore: 88,
      suggestedIdea: 'High-Velocity Shopify App Customization & Retention Lab',
      sentiment: 'Underserved B2B',
      timestamp: '12 hours ago'
    },
    {
      id: 'sig_6',
      channel: 'substack',
      topic: 'SaaS Newsletter — Extreme churn in Generic AI Wrappers; Shift to Deep Domain Verticals',
      painPoint: 'Generic AI writing tools losing users; massive appetite for hyper-specific industry tools (Real Estate Title Insurance, Dental Billing).',
      demandVolume: 'Very High',
      arbitrageAngle: 'Build vertical AI ERPs with Indian domain operations backstop to guarantee 99.9% accuracy.',
      opportunityScore: 94,
      suggestedIdea: 'Vertical AI Operating System for US Dental & Optometry Clinics',
      sentiment: 'Rising Trend',
      timestamp: '1 day ago'
    }
  ];

  if (channel) {
    const filtered = allSignals.filter(s => s.channel === channel);
    return filtered.length > 0 ? filtered : allSignals;
  }
  return allSignals;
}

export function formatSocialShareText(suite: DeliverableSuite, platformName: string = 'WhatsApp'): string {
  return `*VYUHA AI STRATEGIC VENTURE BLUEPRINT* 🚀
━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 *Venture:* ${suite.title}
💡 *Tagline:* ${suite.tagline}
📅 *Generated:* ${new Date(suite.createdAt).toLocaleDateString()}

*EXECUTIVE SUMMARY:*
• *Vision:* ${suite.executiveSummary.vision}
• *Target Market:* ${suite.executiveSummary.marketArbitrageThesis}
• *Year 1 Target:* ${suite.executiveSummary.financialModel.year1Revenue}
• *Year 3 Target:* ${suite.executiveSummary.financialModel.year3Revenue}
• *EBITDA Margin:* ${suite.executiveSummary.financialModel.ebitdaMargin}

*EXECUTION ROADMAP:*
• *0-30 Days:* ${suite.pinToPlaneArchitecture.phase1_30Days[0] || 'Entity setup & pilot funnel'}
• *30-90 Days:* ${suite.pinToPlaneArchitecture.phase2_90Days[0] || 'Core team hire & pilot delivery'}
• *90-180 Days:* ${suite.pinToPlaneArchitecture.phase3_180Days[0] || 'AI automation & partner program'}

*KEY ROLES REQUIRED:*
${suite.skillsEBook.coreRoles.map(r => `• ${r.role} (${r.salaryRange})`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━
_Crafted by Vyuha AI — Autonomous Strategic Advisor & Venture Factory_`;
}

export const formatWhatsAppShareText = formatSocialShareText;

export function generateWhatsAppLink(suite: DeliverableSuite, phoneNumber?: string): string {
  const text = encodeURIComponent(formatSocialShareText(suite, 'WhatsApp'));
  if (phoneNumber && phoneNumber.trim().length > 0) {
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanNumber}?text=${text}`;
  }
  return `https://wa.me/?text=${text}`;
}

export function generateTelegramLink(suite: DeliverableSuite): string {
  const text = encodeURIComponent(formatSocialShareText(suite, 'Telegram'));
  return `https://t.me/share/url?url=https://vyuha.ai&text=${text}`;
}

export function generateEmailPayload(
  suite: DeliverableSuite, 
  recipientEmail: string, 
  senderName: string = 'Vyuha AI Advisor'
) {
  const subject = `[Strategic Blueprint] ${suite.title} — Vyuha AI Venture Suite`;
  const body = `Dear Partner,

Here is your institutional-grade strategic venture blueprint generated autonomously by Vyuha AI.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VENTURE TITLE: ${suite.title}
TAGLINE: ${suite.tagline}
DATE: ${new Date(suite.createdAt).toLocaleDateString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. EXECUTIVE SUMMARY & ARBITRAGE MOAT
• Vision: ${suite.executiveSummary.vision}
• Problem Statement: ${suite.executiveSummary.problemStatement}
• Solution Overview: ${suite.executiveSummary.solutionOverview}
• Market Arbitrage Thesis: ${suite.executiveSummary.marketArbitrageThesis}

Financial Projections:
- Year 1 Target: ${suite.executiveSummary.financialModel.year1Revenue}
- Year 2 Target: ${suite.executiveSummary.financialModel.year2Revenue}
- Year 3 Target: ${suite.executiveSummary.financialModel.year3Revenue}
- Break-Even: ${suite.executiveSummary.financialModel.breakEvenMonth}
- Steady-State EBITDA Margin: ${suite.executiveSummary.financialModel.ebitdaMargin}

2. PIN-TO-PLANE EXECUTION ARCHITECTURE
Phase 1 (0-30 Days):
${suite.pinToPlaneArchitecture.phase1_30Days.map(item => `  - ${item}`).join('\n')}

Phase 2 (30-90 Days):
${suite.pinToPlaneArchitecture.phase2_90Days.map(item => `  - ${item}`).join('\n')}

Phase 3 (90-180 Days):
${suite.pinToPlaneArchitecture.phase3_180Days.map(item => `  - ${item}`).join('\n')}

Tech Stack:
${suite.pinToPlaneArchitecture.techStack.map(item => `  • ${item}`).join('\n')}

3. OPERATIONAL SKILLS & TEAM E-BOOK
Key Hiring Profiles:
${suite.skillsEBook.coreRoles.map(r => `  • ${r.role} (${r.salaryRange})\n    Profile: ${r.profile}`).join('\n')}

Key Execution Cadence & KPIs:
${suite.skillsEBook.kpiCadence.map(k => `  • [${k.frequency}] ${k.metric} -> Target: ${k.target}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated with Vyuha AI Autonomous Strategic Advisor & Venture Factory.
Dispatched on behalf of ${senderName}.`;

  return {
    subject,
    body,
    mailtoUrl: `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  };
}
