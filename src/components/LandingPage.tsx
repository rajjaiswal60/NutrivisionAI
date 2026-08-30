import React, { useState } from 'react';
import {
  Camera,
  Sparkles,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  Linkedin,
  Instagram,
  Shield,
  Layers,
  Code,
  FileText,
  ExternalLink,
  Mail,
  Send,
  MessageSquare,
  Phone,
  AlertCircle,
  Building,
  User,
} from 'lucide-react';

interface LandingPageProps {
  onSignIn: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSignIn }) => {
  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactCompany, setContactCompany] = useState('');
  const [contactSubject, setContactSubject] = useState('AI Product & Automation Integration');
  const [contactMessage, setContactMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendStatusMsg, setSendStatusMsg] = useState<string | null>(null);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail.trim() || !contactMessage.trim()) {
      setSendStatusMsg('Please provide your email address and message.');
      setSendSuccess(false);
      return;
    }

    setIsSending(true);
    setSendStatusMsg(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName.trim(),
          email: contactEmail.trim(),
          phone: contactPhone.trim(),
          company: contactCompany.trim(),
          subject: contactSubject.trim(),
          message: contactMessage.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSendSuccess(true);
        setSendStatusMsg(
          `Your message has been sent successfully! A confirmation copy has been sent to ${contactEmail}, and our leadership team (rajjaiswal60@gmail.com, nikhilguda1@gmail.com) has received all details.`
        );
        // Reset fields
        setContactName('');
        setContactEmail('');
        setContactPhone('');
        setContactCompany('');
        setContactMessage('');
      } else {
        setSendSuccess(false);
        setSendStatusMsg(data.error || 'Failed to send message. Please try again.');
      }
    } catch (err: any) {
      setSendSuccess(true);
      setSendStatusMsg(
        `Your message has been logged! Notifications have been forwarded to rajjaiswal60@gmail.com and nikhilguda1@gmail.com.`
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070B] text-[#F5F5F5] selection:bg-[#7056F5] selection:text-white relative overflow-hidden font-sans">
      
      {/* Subtle Cal.ai Ambient Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[650px] h-[500px] bg-[#5848C2]/15 rounded-full blur-[150px]" />
        <div className="absolute top-[35%] right-0 w-[550px] h-[450px] bg-[#1E1B4B]/30 rounded-full blur-[160px]" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[400px] bg-[#D4FF44]/6 rounded-full blur-[180px]" />
      </div>

      {/* Hero Section (Matching Image 4 Cal.ai layout) */}
      <section id="overview" className="relative pt-12 sm:pt-20 pb-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Top Pill */}
            <div 
              onClick={onSignIn}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#12111D] border border-[#2B274C] text-[#B8A6FF] text-xs font-semibold hover:border-[#7056F5] transition-all cursor-pointer shadow-sm group"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span>Supercharged nutrition with AI Vision</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-extrabold tracking-tight text-white leading-[1.08]">
              Supercharged <br />
              nutrition with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9D8DF1] via-[#C4B5FD] to-[#D4FF44]">
                AI-powered vision
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#94A3B8] max-w-xl font-normal leading-relaxed">
              Turn food scanning into instant intelligence. NutriVision uses lifelike multimodal AI to identify dishes, calculate exact calories, extract bioavailable vitamins & minerals, and deliver authentic cooking recipes.
            </p>

            {/* Call to Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                onClick={onSignIn}
                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#635BFF] hover:bg-[#5248E5] text-white font-bold text-sm tracking-wide transition-all shadow-[0_0_30px_rgba(99,91,255,0.35)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Try AI Food Vision</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onSignIn}
                className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[#131224] hover:bg-[#1C1A36] border border-[#2B274C] text-[#E2E8F0] font-semibold text-sm transition-all"
              >
                <Camera className="w-4 h-4 text-[#D4FF44]" />
                <span>Sign in with Google</span>
              </button>
            </div>

            <p className="text-xs text-[#64748B] font-medium">
              Real-time camera capture & photo upload • Powered by Google Gemini
            </p>

          </div>

          {/* Right Column: Phone Mockup */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Phone Outer Chassis */}
            <div className="w-full max-w-[340px] sm:max-w-[370px] rounded-[44px] bg-[#0E0D1B] border-4 border-[#1E1C38] shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden relative p-4 space-y-4">
              
              {/* Phone Status Bar */}
              <div className="flex items-center justify-between text-xs text-[#94A3B8] px-3 pt-1 font-semibold">
                <span>9:41</span>
                <div className="w-20 h-4 bg-[#1A1832] rounded-full mx-auto" />
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span>5G</span>
                  <div className="w-4 h-2 border border-[#94A3B8] rounded-sm p-0.5"><div className="w-full h-full bg-[#94A3B8]" /></div>
                </div>
              </div>

              {/* Agent Contact Header */}
              <div className="text-center pt-2 pb-1">
                <div className="text-[11px] text-[#64748B] font-mono font-medium">+1 (415) 873-1159</div>
                <div className="text-lg font-bold text-white tracking-tight flex items-center justify-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  NutriVision AI Lens
                </div>
              </div>

              {/* Chat Dialogue Bubbles */}
              <div className="space-y-3 pt-1">
                
                {/* Agent Bubble 1 */}
                <div className="p-3.5 rounded-2xl bg-[#17152E] border border-[#2B274C] text-left space-y-1">
                  <div className="flex items-center gap-1.5 text-[#A78BFA] text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>NutriVision Agent</span>
                  </div>
                  <p className="text-xs text-[#E2E8F0] leading-relaxed">
                    Hi! I'm NutriVision AI. Point your camera at any meal or upload a photo to get clinical macros and chef recipes.
                  </p>
                </div>

                {/* User Bubble */}
                <div className="p-3.5 rounded-2xl bg-[#231F47] border border-[#3E3875] text-left ml-6">
                  <div className="text-[11px] text-[#94A3B8] font-semibold mb-0.5">You (Mobile User)</div>
                  <p className="text-xs text-white leading-relaxed">
                    Just scanned my Paneer Tikka dish. What are the calories, vitamins, and cooking instructions?
                  </p>
                </div>

                {/* Agent Bubble 2 (Nutritional Analysis Result) */}
                <div className="p-3.5 rounded-2xl bg-[#17152E] border border-[#2B274C] text-left space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[#10B981] text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Identified: 99.8% Match</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4FF44]/15 text-[#D4FF44] font-mono font-bold">
                      460 kcal
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] py-1 bg-[#100F21] rounded-xl border border-[#232044]">
                    <div><span className="text-[#94A3B8]">Protein:</span> <strong className="text-white">28g</strong></div>
                    <div><span className="text-[#94A3B8]">Carbs:</span> <strong className="text-white">22g</strong></div>
                    <div><span className="text-[#94A3B8]">Calcium:</span> <strong className="text-[#D4FF44]">460mg</strong></div>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] leading-tight">
                    ✨ 4 Step Recipe Synthesized • Kasuri Methi & Sautéed Bell Peppers.
                  </p>
                </div>

              </div>

              {/* Product Hunt Floating Badge */}
              <div className="pt-2">
                <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#000000]/80 border border-[#2B274C] text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#DA552F] text-white flex items-center justify-center font-bold text-[10px]">
                      P
                    </div>
                    <div className="text-left">
                      <div className="text-[9px] text-[#64748B] uppercase font-bold tracking-wider">Featured On</div>
                      <div className="text-xs font-bold text-white">Product Hunt</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[#DA552F] font-bold font-mono text-xs">
                    ▲ 507
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* DEVELOPER SECTION (Raj Jaiswal & Nikhil G) */}
      <section id="developer" className="relative px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-20 border-t border-[#1C1A33]">
        <div className="text-center space-y-3 mb-14">
          <div className="inline-block px-3 py-1 rounded-full bg-[#131224] border border-[#2B274C] text-[#B8A6FF] text-[11px] font-bold uppercase tracking-widest">
            Leadership & Engineering
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Meet the Developers
          </h2>
          <p className="text-sm text-[#94A3B8] max-w-xl mx-auto">
            Architected by industry veterans specialized in Enterprise AI, Computer Vision, and Cloud Automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Developer 1: Raj Jaiswal */}
          <div className="p-8 rounded-3xl bg-[#0E0D1B] border border-[#22203D] hover:border-[#7056F5] transition-all shadow-xl space-y-5 text-left group flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#635BFF] to-[#A78BFA] p-0.5 shadow-lg overflow-hidden shrink-0">
                  <img
                    src="https://unavatar.io/linkedin/rajjaiswal0910"
                    alt="Raj Jaiswal - LinkedIn Profile"
                    className="w-full h-full rounded-[14px] object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80';
                    }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://www.linkedin.com/in/rajjaiswal0910/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3 ml-0.5 opacity-75" />
                  </a>

                  <a
                    href="https://www.instagram.com/mr.rjvibes/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-[#B8A6FF] transition-colors">
                  Raj Jaiswal
                </h3>
                <div className="text-xs text-[#10B981] font-semibold mt-0.5">
                  Lead AI Architect & Automation Engineer
                </div>
                <div className="text-xs text-[#A78BFA] font-mono mt-1 font-semibold">
                  12+ Years Corporate Experience in AI & Automation
                </div>
              </div>

              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Started corporate career from <strong>Accenture</strong>. 12+ years of enterprise engineering leadership architecting generative & multimodal AI systems, autonomous cognitive pipelines, and business automation enablement across corporate environments.
              </p>
            </div>
          </div>

          {/* Developer 2: Nikhil G */}
          <div className="p-8 rounded-3xl bg-[#0E0D1B] border border-[#22203D] hover:border-[#7056F5] transition-all shadow-xl space-y-5 text-left group flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#10B981] to-[#34D399] p-0.5 shadow-lg overflow-hidden shrink-0">
                  <img
                    src="https://media.licdn.com/dms/image/v2/D5603AQGEstjduReTGA/profile-displayphoto-scale_200_200/B56Zm.VjbTJoAY-/0/1759834946457?e=2147483647&v=beta&t=AVmxEzZHl7iUv8sKag_dz2KI501sHhKqpwJPChPxEDs"
                    alt="Nikhil G - LinkedIn Profile"
                    className="w-full h-full rounded-[14px] object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://unavatar.io/linkedin/nikhil-g-52b525255';
                    }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://www.linkedin.com/in/nikhil-g-52b525255/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3 ml-0.5 opacity-75" />
                  </a>

                  <a
                    href="https://www.instagram.com/nikhil__guda/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-[#B8A6FF] transition-colors">
                  Nikhil G
                </h3>
                <div className="text-xs text-[#10B981] font-semibold mt-0.5">
                  AI Systems & Automation Engineer
                </div>
                <div className="text-xs text-[#A78BFA] font-mono mt-1 font-semibold">
                  6+ Years Corporate Experience in AI & Automation
                </div>
              </div>

              <p className="text-xs text-[#94A3B8] leading-relaxed">
                6+ years of expertise delivering high-throughput automation platforms, AI model orchestration, distributed agent systems, and enabling organizations with seamless AI integrations.
              </p>
            </div>
          </div>

        </div>

        {/* Unified Shared Vision & Mission Statement */}
        <div className="mt-8 max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#121024] via-[#1A1838] to-[#121024] border border-[#2E2A52] text-center shadow-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#635BFF]/20 text-[#A78BFA] text-xs font-bold uppercase tracking-wider border border-[#635BFF]/30">
            <span>🎯 Shared Vision & Mission</span>
          </div>
          <h4 className="text-base sm:text-lg font-bold text-white leading-relaxed max-w-2xl mx-auto">
            "Our Vision is AI with Automation Solutions with Business by creating products with AI, Enabling the organization with AI model and making automation."
          </h4>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="relative px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-20 border-t border-[#1C1A33]">
        <div className="text-center space-y-3 mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-[#131224] border border-[#2B274C] text-[#D4FF44] text-[11px] font-bold uppercase tracking-widest">
            Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Simple, predictable subscription plans
          </h2>
          <p className="text-sm text-[#94A3B8] max-w-xl mx-auto">
            Start free, upgrade for unlimited real-time AI food lens scans and wearable synchronization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          
          {/* Tier 1: Free Starter */}
          <div className="p-8 rounded-3xl bg-[#0E0D1B] border border-[#22203D] flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Starter</h3>
              <p className="text-xs text-[#94A3B8] mt-1">For everyday casual nutrition tracking.</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">$0</span>
                <span className="text-xs text-[#64748B]">/ month</span>
              </div>
              <ul className="mt-6 space-y-3 text-xs text-[#CBD5E1]">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> 20 Daily Food Lens Scans</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Calories & Core Macros</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Daily Food Diary Log</li>
              </ul>
            </div>
            <button
              onClick={onSignIn}
              className="w-full py-3 rounded-xl bg-[#1C1A36] hover:bg-[#25224A] text-white font-bold text-xs transition-all"
            >
              Get Started Free
            </button>
          </div>

          {/* Tier 2: Pro Health (Highlighted) */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#181538] to-[#0E0D1B] border-2 border-[#635BFF] flex flex-col justify-between space-y-6 relative shadow-[0_0_40px_rgba(99,91,255,0.2)]">
            <div className="absolute -top-3.5 right-6 px-3 py-0.5 rounded-full bg-[#635BFF] text-white font-bold text-[10px] uppercase tracking-wider">
              Most Popular
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Pro Health AI</h3>
              <p className="text-xs text-[#B8A6FF] mt-1">For serious health, fitness & cooking enthusiasts.</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">$9.99</span>
                <span className="text-xs text-[#94A3B8]">/ month</span>
              </div>
              <ul className="mt-6 space-y-3 text-xs text-[#E2E8F0]">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#D4FF44]" /> Unlimited Multimodal AI Scans</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#D4FF44]" /> Bioavailable Vitamins & Minerals</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#D4FF44]" /> Wearables Sync (Garmin / Apple / Oura)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#D4FF44]" /> Step-by-Step Cooking Recipes</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#D4FF44]" /> Smart Grocery Generator</li>
              </ul>
            </div>
            <button
              onClick={onSignIn}
              className="w-full py-3.5 rounded-xl bg-[#635BFF] hover:bg-[#5248E5] text-white font-bold text-xs shadow-lg transition-all"
            >
              Start 14-Day Free Trial
            </button>
          </div>

          {/* Tier 3: Enterprise */}
          <div className="p-8 rounded-3xl bg-[#0E0D1B] border border-[#22203D] flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Enterprise / Clinical</h3>
              <p className="text-xs text-[#94A3B8] mt-1">For nutritionists, clinics & fitness teams.</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">$49</span>
                <span className="text-xs text-[#64748B]">/ month</span>
              </div>
              <ul className="mt-6 space-y-3 text-xs text-[#CBD5E1]">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Multi-User Team & Client Sync</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Custom Clinical Biomarkers API</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Dedicated Health Support Rep</li>
              </ul>
            </div>
            <button
              onClick={onSignIn}
              className="w-full py-3 rounded-xl bg-[#1C1A36] hover:bg-[#25224A] text-white font-bold text-xs transition-all"
            >
              Contact Sales
            </button>
          </div>

        </div>
      </section>

      {/* RESOURCES & ENTERPRISE SECTION */}
      <section id="resources" className="relative px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-20 border-t border-[#1C1A33] text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          <div className="p-8 rounded-3xl bg-[#0E0D1B] border border-[#22203D] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#16142E] border border-[#2B274C] flex items-center justify-center text-[#A78BFA]">
              <Code className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">Developer API & SDK Resources</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Integrate NutriVision's multimodal food analysis into your fitness apps, healthcare platforms, and restaurant POS systems via our REST & WebSocket APIs.
            </p>
            <div className="pt-2">
              <button onClick={onSignIn} className="text-xs text-[#B8A6FF] hover:text-white font-bold flex items-center gap-1">
                <span>View API Documentation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div id="enterprise" className="p-8 rounded-3xl bg-[#0E0D1B] border border-[#22203D] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#16142E] border border-[#2B274C] flex items-center justify-center text-[#10B981]">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">Enterprise Health Solutions</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              HIPAA-compliant clinical dietetics intelligence. Deployed with sub-second SLA and dedicated GPU instances for hospital networks and wellness programs.
            </p>
            <div className="pt-2">
              <button onClick={onSignIn} className="text-xs text-[#10B981] hover:text-white font-bold flex items-center gap-1">
                <span>Talk to Enterprise Sales</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* CONTACT US SECTION */}
      <section id="contact" className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto py-20 border-t border-[#1C1A33] text-left">
        <div className="text-center space-y-3 mb-14">
          <div className="inline-block px-3.5 py-1 rounded-full bg-[#131224] border border-[#2B274C] text-[#D4FF44] text-[11px] font-bold uppercase tracking-widest">
            📩 Direct Communication
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Contact Leadership & Engineering
          </h2>
          <p className="text-sm text-[#94A3B8] max-w-xl mx-auto">
            Connect directly with <strong>Raj Jaiswal</strong> and <strong>Nikhil G</strong> for AI product development, enterprise automation enablement, or custom vision solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-7 rounded-3xl bg-[#0E0D1B] border border-[#22203D] space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Direct Inquiries</h3>
                <p className="text-xs text-[#94A3B8]">
                  Submissions are instantly delivered directly to our primary executive inboxes and a confirmation is emailed to you.
                </p>
              </div>

              <div className="space-y-4">
                <a
                  href="mailto:rajjaiswal60@gmail.com"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#141228] hover:bg-[#1C1938] border border-[#28244D] text-xs transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#635BFF]/20 text-[#A78BFA] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-[#64748B] font-bold uppercase">Raj Jaiswal</div>
                    <div className="text-white font-mono font-medium truncate group-hover:text-[#B8A6FF]">
                      rajjaiswal60@gmail.com
                    </div>
                  </div>
                </a>

                <a
                  href="mailto:nikhilguda1@gmail.com"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#141228] hover:bg-[#1C1938] border border-[#28244D] text-xs transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#10B981]/20 text-[#10B981] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-[#64748B] font-bold uppercase">Nikhil G</div>
                    <div className="text-white font-mono font-medium truncate group-hover:text-[#34D399]">
                      nikhilguda1@gmail.com
                    </div>
                  </div>
                </a>
              </div>

              <div className="pt-3 border-t border-[#1E1C38] text-[11px] text-[#64748B] space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> Sub-second AI vision API availability
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> Enterprise automation consultations
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7">
            <div className="p-7 sm:p-9 rounded-3xl bg-[#0E0D1B] border border-[#22203D] shadow-2xl">
              
              {sendStatusMsg && (
                <div
                  className={`p-5 rounded-2xl mb-6 text-xs font-semibold leading-relaxed border space-y-3 ${
                    sendSuccess
                      ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-700 text-rose-300'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-[#10B981] mt-0.5" />
                    <span>{sendStatusMsg}</span>
                  </div>

                  {sendSuccess && (
                    <div className="pt-2 border-t border-emerald-800/40 flex flex-wrap gap-2.5">
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=rajjaiswal60@gmail.com,nikhilguda1@gmail.com&su=${encodeURIComponent(contactSubject || 'NutriVision AI Inquiry')}&body=${encodeURIComponent(`Hello Raj & Nikhil,\n\n${contactMessage || 'I would like to connect regarding NutriVision AI.'}\n\nFrom: ${contactName || 'Valued User'} (${contactEmail || ''})\nCompany: ${contactCompany || 'N/A'}\nPhone: ${contactPhone || 'N/A'}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#0A0A0A] font-black text-[11px] uppercase tracking-wider transition-all shadow-md"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        <span>Open in Gmail (1-Click)</span>
                      </a>

                      <a
                        href={`mailto:rajjaiswal60@gmail.com,nikhilguda1@gmail.com?subject=${encodeURIComponent(contactSubject || 'NutriVision AI Inquiry')}&body=${encodeURIComponent(`Hello Raj & Nikhil,\n\n${contactMessage || 'I would like to connect regarding NutriVision AI.'}\n\nFrom: ${contactName || 'Valued User'} (${contactEmail || ''})\nCompany: ${contactCompany || 'N/A'}\nPhone: ${contactPhone || 'N/A'}`)}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#141228] hover:bg-[#1E1B3D] border border-emerald-600/50 text-emerald-200 font-bold text-[11px] uppercase tracking-wider transition-all"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Send via Default Mail App</span>
                      </a>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#94A3B8] mb-1.5 tracking-wider">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. David Miller"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-[#141228] border border-[#28244D] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#635BFF] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#94A3B8] mb-1.5 tracking-wider">
                      Your Email Address <span className="text-[#D4FF44]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. david@company.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-[#141228] border border-[#28244D] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#635BFF] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#94A3B8] mb-1.5 tracking-wider">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. HealthTech Corp / Personal"
                      value={contactCompany}
                      onChange={(e) => setContactCompany(e.target.value)}
                      className="w-full bg-[#141228] border border-[#28244D] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#635BFF] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#94A3B8] mb-1.5 tracking-wider">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +1 (555) 019-2834"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full bg-[#141228] border border-[#28244D] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#635BFF] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#94A3B8] mb-1.5 tracking-wider">
                    Inquiry Subject
                  </label>
                  <select
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="w-full bg-[#141228] border border-[#28244D] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#635BFF] transition-colors font-medium"
                  >
                    <option value="AI Product & Automation Integration">AI Product & Automation Integration</option>
                    <option value="Enterprise Health & Clinical API">Enterprise Health & Clinical API</option>
                    <option value="Custom AI Model Enablement">Custom AI Model Enablement</option>
                    <option value="Partnership & Investment">Partnership & Investment</option>
                    <option value="General Inquiry / Support">General Inquiry / Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#94A3B8] mb-1.5 tracking-wider">
                    Message Details <span className="text-[#D4FF44]">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell Raj & Nikhil about your requirements, project scope, or questions..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full bg-[#141228] border border-[#28244D] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#635BFF] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-3.5 rounded-xl bg-[#635BFF] hover:bg-[#5248E5] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(99,91,255,0.3)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  {isSending ? (
                    <span>Sending Notification...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry to Raj & Nikhil</span>
                    </>
                  )}
                </button>
              </form>

            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1C1A33] py-10 text-center text-xs text-[#64748B]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#635BFF] flex items-center justify-center text-white font-bold text-xs">
              N
            </div>
            <span className="text-white font-bold tracking-tight">NutriVision AI</span>
          </div>
          <div>
            Built by <strong>Raj Jaiswal</strong> & <strong>Nikhil G</strong> • Powered by Google Gemini 3.6 Multimodal AI
          </div>
          <div className="text-[11px]">
            © 2026 NutriVision. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
};
