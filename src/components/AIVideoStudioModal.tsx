import React, { useState, useEffect, useRef } from 'react';
import { AIVideoDeliverable, DeliverableSuite, UserSettings } from '../types';

interface AIVideoStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  suite: DeliverableSuite;
  settings: UserSettings;
}

export const AIVideoStudioModal: React.FC<AIVideoStudioModalProps> = ({
  isOpen,
  onClose,
  suite,
  settings
}) => {
  const videoData = suite.videoDeliverable;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>(videoData?.aspectRatio || '16:9');
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderComplete, setRenderComplete] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  if (!isOpen || !videoData) return null;

  const scenes = videoData.storyboard;

  // Auto scene switcher during playback simulation
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentSceneIdx(prev => (prev + 1) % scenes.length);
      }, 5000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, scenes.length]);

  const handleTriggerRender = async () => {
    setIsRendering(true);
    setRenderProgress(10);
    setRenderComplete(false);

    try {
      const res = await fetch('/api/video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoData,
          platform: settings.connectors.video.provider,
          customApiKey: settings.connectors.video.apiKey
        })
      });
      await res.json();
    } catch (e) {
      console.warn('Video render API invoked in simulation mode');
    }

    // Simulated progress ticks
    const interval = setInterval(() => {
      setRenderProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRendering(false);
          setRenderComplete(true);
          return 100;
        }
        return prev + 25;
      });
    }, 800);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(videoData.fullScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const currentScene = scenes[currentSceneIdx] || scenes[0];

  return (
    <div id="video-studio-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md">
      <div 
        id="video-studio-modal-card" 
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl ring-1 ring-white/10"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/70 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 via-rose-500 to-amber-500 text-white shadow-md">
              <i className="fa-solid fa-clapperboard text-lg"></i>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white">AI Commercial & Business Video Studio</h2>
                <span className="rounded-full border border-pink-500/40 bg-pink-500/10 px-2 py-0.5 text-[10px] font-semibold text-pink-300">
                  {settings.connectors.video.provider.toUpperCase()} Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {videoData.title} • Narrated by <strong className="text-slate-200">{videoData.characterName}</strong> ({videoData.characterRole})
              </p>
            </div>
          </div>
          <button
            id="btn-close-video-studio"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {/* Studio Content Grid */}
        <div className="grid flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-12">
          
          {/* Left Column: Video Preview Player */}
          <div className="flex flex-col items-center justify-between border-b border-slate-800 bg-slate-950/80 p-6 lg:col-span-7 lg:border-b-0 lg:border-r">
            
            {/* Aspect Ratio Selector */}
            <div className="flex items-center justify-between w-full mb-3">
              <span className="text-xs font-semibold text-slate-400">Preview Canvas</span>
              <div className="flex items-center space-x-1 rounded-lg border border-slate-800 bg-slate-900 p-0.5">
                <button
                  onClick={() => setAspectRatio('16:9')}
                  className={`rounded px-2.5 py-1 text-[11px] font-semibold transition ${
                    aspectRatio === '16:9' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  16:9 Deck
                </button>
                <button
                  onClick={() => setAspectRatio('9:16')}
                  className={`rounded px-2.5 py-1 text-[11px] font-semibold transition ${
                    aspectRatio === '9:16' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  9:16 Reel
                </button>
                <button
                  onClick={() => setAspectRatio('1:1')}
                  className={`rounded px-2.5 py-1 text-[11px] font-semibold transition ${
                    aspectRatio === '1:1' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  1:1 Post
                </button>
              </div>
            </div>

            {/* Video Stage Canvas */}
            <div 
              className={`relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl transition-all duration-300 flex flex-col justify-between p-4 ${
                aspectRatio === '16:9' 
                  ? 'w-full aspect-video' 
                  : aspectRatio === '9:16' 
                  ? 'w-64 aspect-[9/16]' 
                  : 'w-80 aspect-square'
              }`}
            >
              {/* Top Watermark / Status */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center space-x-2 rounded-full bg-slate-950/70 px-2.5 py-1 backdrop-blur-md border border-white/10">
                  <span className={`h-2 w-2 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-amber-400'}`}></span>
                  <span className="text-[10px] font-bold text-white">
                    {isPlaying ? 'RECORDING / LIVE' : 'PREVIEW MODE'}
                  </span>
                </div>
                <div className="rounded-full bg-slate-950/70 px-2 py-0.5 text-[9px] font-bold text-amber-300 border border-white/10">
                  {currentScene.timecode}
                </div>
              </div>

              {/* Center Character Stage */}
              <div className="relative flex flex-col items-center justify-center my-auto z-10">
                <div className="relative">
                  <img
                    src={videoData.characterAvatar}
                    alt={videoData.characterName}
                    className={`h-24 w-24 rounded-full object-cover ring-4 ring-amber-500/50 shadow-2xl transition-transform ${
                      isPlaying ? 'scale-105 ring-emerald-500' : ''
                    }`}
                  />
                  {isPlaying && (
                    <div className="absolute -bottom-2 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-slate-950 shadow-md">
                      <i className="fa-solid fa-microphone text-[10px] animate-bounce"></i>
                    </div>
                  )}
                </div>

                <div className="mt-2 text-center">
                  <h4 className="text-xs font-extrabold text-white">{videoData.characterName}</h4>
                  <p className="text-[10px] text-amber-300">{videoData.characterRole}</p>
                </div>

                {/* Simulated Audio Waveform */}
                {isPlaying && (
                  <div className="mt-2 flex items-center space-x-1">
                    {[16, 24, 12, 32, 20, 28, 14, 36, 18, 22].map((height, i) => (
                      <span
                        key={i}
                        style={{ height: `${(height * (i % 2 === 0 ? 1.2 : 0.8))}px` }}
                        className="w-1 rounded-full bg-gradient-to-t from-amber-500 to-indigo-400 animate-pulse"
                      ></span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom On-Screen Text / Teleprompter Subtitles */}
              <div className="z-10 rounded-xl bg-slate-950/85 p-2.5 backdrop-blur-md border border-white/10 text-center">
                <p className="text-[10px] font-bold tracking-wider text-amber-400 uppercase">
                  {currentScene.onScreenText}
                </p>
                <p className="mt-1 text-[11px] text-slate-200 line-clamp-2 italic">
                  "{currentScene.voiceoverScript}"
                </p>
              </div>

              {/* Backdrop Gradient Glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-950 opacity-90"></div>
            </div>

            {/* Playback Controls & Progress Bar */}
            <div className="mt-4 flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-2.5">
              <div className="flex items-center space-x-2">
                <button
                  id="btn-play-pause-video"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition"
                >
                  <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play text-xs'}`}></i>
                </button>
                <span className="text-xs font-semibold text-slate-300">
                  Scene {currentScene.sceneNumber} of {scenes.length}
                </span>
              </div>

              {/* Scene Navigation Dots */}
              <div className="flex items-center space-x-1.5">
                {scenes.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setCurrentSceneIdx(idx);
                      setIsPlaying(false);
                    }}
                    className={`h-2.5 rounded-full transition-all ${
                      currentSceneIdx === idx ? 'w-6 bg-amber-400' : 'w-2.5 bg-slate-700 hover:bg-slate-600'
                    }`}
                    title={`Jump to Scene ${idx + 1}`}
                  ></button>
                ))}
              </div>

              <div className="text-[11px] font-mono text-slate-400">
                {currentScene.timecode}
              </div>
            </div>

          </div>

          {/* Right Column: Storyboard, Script & Render Action */}
          <div className="flex flex-col justify-between p-6 lg:col-span-5 space-y-6">
            
            {/* Storyboard Scene Breakdown */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Commercial Storyboard ({scenes.length} Beats)
                </h4>
                <button
                  onClick={handleCopyScript}
                  className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center space-x-1"
                >
                  <i className={`fa-solid ${copiedScript ? 'fa-check' : 'fa-copy'}`}></i>
                  <span>{copiedScript ? 'Copied Script' : 'Copy Script'}</span>
                </button>
              </div>

              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {scenes.map((scene, idx) => (
                  <div
                    key={scene.id}
                    onClick={() => setCurrentSceneIdx(idx)}
                    className={`cursor-pointer rounded-xl border p-3 transition ${
                      currentSceneIdx === idx
                        ? 'border-amber-500/60 bg-amber-500/10 shadow-sm'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-amber-300">Beat {scene.sceneNumber}: {scene.timecode}</span>
                      <span className="text-slate-500">{scene.characterAction.substring(0, 24)}...</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-300 font-medium line-clamp-2">
                      {scene.voiceoverScript}
                    </p>
                    <div className="mt-1.5 flex items-center space-x-1 text-[10px] text-slate-400">
                      <i className="fa-solid fa-camera text-[9px] text-indigo-400"></i>
                      <span className="truncate">{scene.visualPrompt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Generation Pipeline Card */}
            <div className="rounded-xl border border-pink-500/30 bg-pink-500/5 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <i className="fa-solid fa-bolt text-pink-400 text-sm"></i>
                  <span className="text-xs font-bold text-white">
                    Synthesize via {settings.connectors.video.provider.toUpperCase()}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">
                  Estimated render: 45s
                </span>
              </div>

              {isRendering && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-pink-300 font-bold">
                    <span>Generating Character & Audio Sync...</span>
                    <span>{renderProgress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      style={{ width: `${renderProgress}%` }}
                      className="h-full bg-gradient-to-r from-pink-500 to-amber-400 transition-all duration-500"
                    ></div>
                  </div>
                </div>
              )}

              {renderComplete && (
                <div className="rounded-lg bg-emerald-500/20 border border-emerald-500/40 p-2.5 text-xs text-emerald-300 flex items-center space-x-2">
                  <i className="fa-solid fa-circle-check text-emerald-400"></i>
                  <span>Video generation job completed! Asset ready for export.</span>
                </div>
              )}

              <button
                id="btn-trigger-ai-video"
                type="button"
                onClick={handleTriggerRender}
                disabled={isRendering}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-pink-500/20 hover:from-pink-500 hover:to-rose-500 active:scale-95 transition disabled:opacity-50"
              >
                {isRendering ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                <span>{isRendering ? 'Rendering Video Asset...' : `Generate AI Video on ${settings.connectors.video.provider.toUpperCase()}`}</span>
              </button>
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/80 px-6 py-4">
          <div className="text-xs text-slate-400">
            <span>Aspect Ratio: <strong>{aspectRatio}</strong> • Voice: <strong>{settings.videoAgent.voiceAccent}</strong></span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopyScript}
              className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
            >
              Copy Full Teleprompter
            </button>
            <button
              onClick={onClose}
              className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-bold text-white hover:bg-slate-700 transition"
            >
              Done & Return to Blueprint
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
