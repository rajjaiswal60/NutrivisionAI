import React, { useState, useEffect, useRef } from 'react';
import { 
  Watch, Activity, HeartPulse, Flame, Footprints, RefreshCw, 
  BatteryCharging, Bluetooth, CheckCircle2, TrendingUp, Zap, 
  Compass, ShieldCheck, Moon, Award, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { UserProfile, WearableDeviceType, WearableMetrics } from '../types';
import confetti from 'canvas-confetti';

interface HealthWearableDashboardProps {
  metrics: WearableMetrics;
  onUpdateMetrics: (updated: WearableMetrics) => void;
  user: UserProfile;
  todayCaloriesEaten: number;
}

const WEARABLE_DEVICES: { type: WearableDeviceType; name: string; icon: string; brandColor: string }[] = [
  { type: 'Apple Health', name: 'Apple Health & Watch', icon: '🍎', brandColor: 'border-rose-500/40 text-rose-400' },
  { type: 'Google Fit', name: 'Google Fit & Health Connect', icon: '🟢', brandColor: 'border-emerald-500/40 text-emerald-400' },
  { type: 'Fitbit', name: 'Fitbit Sense / Charge', icon: '🔵', brandColor: 'border-teal-500/40 text-teal-400' },
  { type: 'Garmin', name: 'Garmin Forerunner & Fenix', icon: '🧭', brandColor: 'border-sky-500/40 text-sky-400' },
  { type: 'Whoop', name: 'Whoop 4.0 Strap', icon: '⚡', brandColor: 'border-amber-500/40 text-amber-400' },
  { type: 'Web Bluetooth HR', name: 'Live Web Bluetooth Sensor', icon: '📡', brandColor: 'border-indigo-500/40 text-indigo-400' },
];

export const HealthWearableDashboard: React.FC<HealthWearableDashboardProps> = ({
  metrics,
  onUpdateMetrics,
  user,
  todayCaloriesEaten,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [bluetoothConnected, setBluetoothConnected] = useState(false);
  const [stepGoal, setStepGoal] = useState(metrics.stepGoal || 10000);
  
  // Real-time canvas for ECG waveform
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live heart rate pulse tick
  useEffect(() => {
    const hrInterval = setInterval(() => {
      // Simulate natural slight heart rate variation (+/- 2 bpm)
      const delta = (Math.random() - 0.5) * 4;
      const newBpm = Math.max(55, Math.min(160, Math.round(metrics.currentHeartRate + delta)));
      
      onUpdateMetrics({
        ...metrics,
        currentHeartRate: newBpm,
      });
    }, 4000);

    return () => clearInterval(hrInterval);
  }, [metrics.currentHeartRate]);

  // Draw ECG Waveform on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    let x = 0;
    const height = canvas.height;
    const width = canvas.width;
    const points: number[] = new Array(width).fill(height / 2);

    const renderWave = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let gy = 0; gy < height; gy += 20) {
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
      }
      ctx.stroke();

      // ECG rhythm shape calculation
      const pulseSpeed = (metrics.currentHeartRate / 60) * 2;
      const phase = (Date.now() / 300) * pulseSpeed;
      let y = height / 2;

      const modPhase = phase % 10;
      if (modPhase > 2 && modPhase < 2.5) {
        y -= 6; // P wave
      } else if (modPhase > 3.2 && modPhase < 3.4) {
        y += 8; // Q wave
      } else if (modPhase > 3.4 && modPhase < 3.8) {
        y -= 28; // R spike
      } else if (modPhase > 3.8 && modPhase < 4.0) {
        y += 12; // S wave
      } else if (modPhase > 4.6 && modPhase < 5.4) {
        y -= 10; // T wave
      }

      points.push(y);
      if (points.length > width) {
        points.shift();
      }

      // Draw glowing ECG neon green/lime line
      ctx.strokeStyle = '#D4FF44';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#D4FF44';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      for (let i = 0; i < points.length; i++) {
        if (i === 0) ctx.moveTo(i, points[i]);
        else ctx.lineTo(i, points[i]);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      animationFrame = requestAnimationFrame(renderWave);
    };

    renderWave();
    return () => cancelAnimationFrame(animationFrame);
  }, [metrics.currentHeartRate]);

  // Trigger manual wearable data synchronization
  const handleSyncWearable = () => {
    setIsSyncing(true);
    setSyncMessage('Connecting to ' + metrics.connectedDevice + ' secure cloud API...');

    setTimeout(() => {
      const addedSteps = Math.floor(Math.random() * 600) + 200;
      const newSteps = metrics.stepsToday + addedSteps;
      const newDistance = Number((newSteps * 0.00078).toFixed(1));
      const newActiveCals = Math.round(newSteps * 0.045);
      const newTotalCals = metrics.bmrCalories + newActiveCals;

      const updated: WearableMetrics = {
        ...metrics,
        stepsToday: newSteps,
        distanceKm: newDistance,
        activeMinutes: metrics.activeMinutes + Math.floor(addedSteps / 100),
        activeCaloriesBurned: newActiveCals,
        totalCaloriesBurned: newTotalCals,
        batteryLevel: Math.max(12, metrics.batteryLevel - 1),
        lastSynced: 'Just now',
        isSyncing: false,
      };

      onUpdateMetrics(updated);
      setIsSyncing(false);
      setSyncMessage('Successfully synced latest telemetry from ' + metrics.connectedDevice + '!');
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });

      setTimeout(() => setSyncMessage(null), 4000);
    }, 1500);
  };

  // Connect Web Bluetooth Heart Rate Sensor (Standard Bluetooth HR 0x180D)
  const handleConnectBluetooth = async () => {
    if ('bluetooth' in navigator) {
      try {
        setSyncMessage('Searching for Bluetooth Heart Rate monitors (Polar, Garmin, Apple, etc.)...');
        const device = await (navigator as any).bluetooth.requestDevice({
          filters: [{ services: ['heart_rate'] }],
          optionalServices: ['battery_service'],
        });

        setBluetoothConnected(true);
        onUpdateMetrics({
          ...metrics,
          connectedDevice: 'Web Bluetooth HR',
          deviceName: device.name || 'Bluetooth HR Strap',
          lastSynced: 'Live Streaming',
        });
        setSyncMessage(`Paired with ${device.name || 'Bluetooth Heart Rate Monitor'}!`);
      } catch (err: any) {
        console.warn('Bluetooth connection cancelled or unavailable:', err);
        setSyncMessage('Web Bluetooth simulation active for continuous pulse monitoring.');
      }
    } else {
      setSyncMessage('Web Bluetooth requires HTTPS or Chrome. Live simulated streaming enabled.');
    }
    setTimeout(() => setSyncMessage(null), 4000);
  };

  const handleSwitchDevice = (type: WearableDeviceType, name: string) => {
    onUpdateMetrics({
      ...metrics,
      connectedDevice: type,
      deviceName: name,
      lastSynced: 'Just now',
    });
  };

  // Calorie calculations
  const netCalorieBalance = todayCaloriesEaten - metrics.totalCaloriesBurned;
  const stepPercentage = Math.min(100, Math.round((metrics.stepsToday / stepGoal) * 100));

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#161616] border border-[#262626] text-[#D4FF44] text-[10px] font-black uppercase tracking-widest mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Continuous Wearable Telemetry & Energy Sync</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#F5F5F5] font-display uppercase tracking-tight">
            Daily Metrics & <span className="text-[#D4FF44]">Heart Health Sync</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#888888] mt-1 font-medium">
            Continuous syncing for walking steps, real-time heart rate zones, and net energy balance.
          </p>
        </div>

        {/* Sync Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleConnectBluetooth}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#111111] hover:bg-[#1A1A1A] text-[#F5F5F5] border border-[#222222] text-xs font-black uppercase tracking-wider transition-all hover:border-[#333333]"
            title="Pair Bluetooth HR Sensor"
          >
            <Bluetooth className="w-4 h-4 text-[#D4FF44]" />
            <span>{bluetoothConnected ? 'BT HR Live' : 'Pair Sensor'}</span>
          </button>

          <button
            onClick={handleSyncWearable}
            disabled={isSyncing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#D4FF44] hover:bg-[#C0F030] text-[#0A0A0A] font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(212,255,68,0.25)] transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Device'}</span>
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      {syncMessage && (
        <div className="p-3.5 rounded-2xl bg-[#161616] border border-[#D4FF44]/40 text-[#D4FF44] text-xs font-bold flex items-center gap-2.5 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-[#D4FF44] shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Connected Wearable Device Card */}
      <div className="bg-[#111111] border border-[#222222] rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222222] pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#161616] border border-[#262626] flex items-center justify-center text-xl text-[#D4FF44] shadow-inner">
              <Watch className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-[#F5F5F5] font-display uppercase tracking-tight">
                  {metrics.deviceName || metrics.connectedDevice}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#D4FF44] text-[#0A0A0A] text-[9px] font-black uppercase tracking-wider">
                  Live Sync
                </span>
              </div>
              <div className="text-xs text-[#888888] flex items-center gap-3 mt-1 font-medium">
                <span>Last synced: {metrics.lastSynced}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-[#F5F5F5] font-bold">
                  <BatteryCharging className="w-3.5 h-3.5 text-[#D4FF44]" />
                  {metrics.batteryLevel}% Battery
                </span>
              </div>
            </div>
          </div>

          {/* Switch Device Dropdown Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {WEARABLE_DEVICES.map((dev) => {
              const isSelected = metrics.connectedDevice === dev.type;
              return (
                <button
                  key={dev.type}
                  onClick={() => handleSwitchDevice(dev.type, dev.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-[#D4FF44] text-[#0A0A0A] shadow-md'
                      : 'bg-[#161616] hover:bg-[#222222] text-[#888888] hover:text-[#F5F5F5] border border-[#262626]'
                  }`}
                >
                  <span>{dev.icon}</span>
                  <span>{dev.type}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Quick Stat Hero Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-5">
          
          {/* Tile 1: Daily Steps */}
          <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-[#222222] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#888888]">
              <span className="font-black uppercase tracking-wider text-[10px]">Walking Steps</span>
              <Footprints className="w-4 h-4 text-[#D4FF44]" />
            </div>
            <div className="my-2">
              <div className="text-2xl sm:text-3xl font-black text-[#F5F5F5] leading-none">
                {metrics.stepsToday.toLocaleString()}
              </div>
              <div className="text-[10px] text-[#888888] uppercase tracking-wider font-bold mt-1">
                Goal: {stepGoal.toLocaleString()} ({stepPercentage}%)
              </div>
            </div>
            <div className="w-full h-1.5 bg-[#222222] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#D4FF44] rounded-full transition-all duration-500"
                style={{ width: `${stepPercentage}%` }}
              />
            </div>
          </div>

          {/* Tile 2: Live Heart Rate */}
          <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-[#222222] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#888888]">
              <span className="font-black uppercase tracking-wider text-[10px]">Real-Time Pulse</span>
              <HeartPulse className="w-4 h-4 text-rose-500 animate-pulse" />
            </div>
            <div className="my-2">
              <div className="text-2xl sm:text-3xl font-black text-rose-400 leading-none flex items-baseline gap-1.5">
                <span>{metrics.currentHeartRate}</span>
                <span className="text-[10px] text-[#888888] uppercase font-black">BPM</span>
              </div>
              <div className="text-[10px] text-[#888888] uppercase tracking-wider font-bold mt-1">
                Resting: {metrics.restingHeartRate} • Max: {metrics.maxHeartRateToday}
              </div>
            </div>
            <div className="text-[9px] text-[#D4FF44] font-black uppercase tracking-wider">
              Zone: Normal Sinus Rhythm
            </div>
          </div>

          {/* Tile 3: Calories Burned */}
          <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-[#222222] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#888888]">
              <span className="font-black uppercase tracking-wider text-[10px]">Calories Burned</span>
              <Flame className="w-4 h-4 text-[#D4FF44]" />
            </div>
            <div className="my-2">
              <div className="text-2xl sm:text-3xl font-black text-[#D4FF44] leading-none flex items-baseline gap-1.5">
                <span>{metrics.totalCaloriesBurned}</span>
                <span className="text-[10px] text-[#888888] uppercase font-black">kcal</span>
              </div>
              <div className="text-[10px] text-[#888888] uppercase tracking-wider font-bold mt-1">
                Active: {metrics.activeCaloriesBurned} • BMR: {metrics.bmrCalories}
              </div>
            </div>
            <div className="text-[9px] text-[#888888] font-bold uppercase tracking-wider">
              Metabolic VO2 & step burn
            </div>
          </div>

          {/* Tile 4: Distance & Pace */}
          <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-[#222222] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#888888]">
              <span className="font-black uppercase tracking-wider text-[10px]">Distance & Pace</span>
              <Compass className="w-4 h-4 text-[#F5F5F5]" />
            </div>
            <div className="my-2">
              <div className="text-2xl sm:text-3xl font-black text-[#F5F5F5] leading-none flex items-baseline gap-1.5">
                <span>{metrics.distanceKm}</span>
                <span className="text-[10px] text-[#888888] uppercase font-black">km</span>
              </div>
              <div className="text-[10px] text-[#888888] uppercase tracking-wider font-bold mt-1">
                Active: {metrics.activeMinutes} mins
              </div>
            </div>
            <div className="text-[9px] text-[#888888] font-bold uppercase tracking-wider">
              Avg Pace: {metrics.walkingPaceMinPerKm} min/km
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid: Real-Time Heart Rate Waveform & Net Calorie Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Heart Rate Monitor & ECG Canvas */}
        <div className="lg:col-span-7 bg-[#111111] border border-[#222222] rounded-3xl p-6 space-y-5 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-[#F5F5F5] font-display uppercase tracking-tight flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-rose-500 animate-pulse" />
                <span>Live ECG Waveform & Cardio Zones</span>
              </h3>
              <p className="text-xs text-[#888888] font-medium">
                Continuous optical PPG telemetry stream from {metrics.connectedDevice}
              </p>
            </div>
            <div className="px-3 py-1 rounded-full bg-[#161616] border border-[#262626] text-rose-400 font-black text-xs uppercase tracking-wider">
              {metrics.currentHeartRate} BPM
            </div>
          </div>

          {/* ECG Canvas Visualizer */}
          <div className="relative rounded-2xl overflow-hidden bg-[#0A0A0A] border border-[#222222] p-2">
            <canvas
              ref={canvasRef}
              width={560}
              height={140}
              className="w-full h-32 block"
            />
            <div className="absolute bottom-2 left-3 text-[9px] font-black uppercase tracking-widest text-[#D4FF44] bg-[#161616] px-2.5 py-1 rounded-md border border-[#262626]">
              Lead II Rhythm • 25 mm/s • 10 mm/mV
            </div>
          </div>

          {/* Heart Rate Zones Breakdown */}
          <div className="space-y-2.5 pt-2">
            <div className="text-[10px] font-black text-[#888888] uppercase tracking-[0.2em]">
              Today's Cardio Zone Allocation
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-3 rounded-2xl bg-[#0A0A0A] border border-[#222222]">
                <div className="text-[9px] text-[#888888] font-black uppercase tracking-wider">Resting (50-60%)</div>
                <div className="font-black text-[#F5F5F5] mt-1 text-xs">58-95 bpm</div>
                <div className="text-[9px] text-[#666666] font-bold uppercase mt-1">4h 12m</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#0A0A0A] border border-[#222222]">
                <div className="text-[9px] text-[#888888] font-black uppercase tracking-wider">Fat Burn (60-70%)</div>
                <div className="font-black text-[#D4FF44] mt-1 text-xs">96-118 bpm</div>
                <div className="text-[9px] text-[#666666] font-bold uppercase mt-1">58 mins</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#0A0A0A] border border-[#222222]">
                <div className="text-[9px] text-[#888888] font-black uppercase tracking-wider">Aerobic (70-85%)</div>
                <div className="font-black text-[#F5F5F5] mt-1 text-xs">119-142 bpm</div>
                <div className="text-[9px] text-[#666666] font-bold uppercase mt-1">32 mins</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#0A0A0A] border border-[#222222]">
                <div className="text-[9px] text-[#888888] font-black uppercase tracking-wider">Peak (85-100%)</div>
                <div className="font-black text-rose-400 mt-1 text-xs">143+ bpm</div>
                <div className="text-[9px] text-[#666666] font-bold uppercase mt-1">8 mins</div>
              </div>
            </div>
          </div>

          {/* Hourly Steps Bar Chart */}
          <div className="pt-3 border-t border-[#222222]">
            <div className="text-[10px] font-black text-[#888888] uppercase tracking-[0.2em] mb-2.5 flex items-center justify-between">
              <span>Hourly Walking Distribution</span>
              <span className="text-[10px] text-[#D4FF44] font-black">Peak at 10 AM</span>
            </div>
            <div className="flex items-end justify-between gap-2 h-20 pt-2 px-1">
              {(metrics.hourlySteps || []).map((h, i) => {
                const maxStep = Math.max(...metrics.hourlySteps.map((s) => s.steps), 2500);
                const heightPct = Math.round((h.steps / maxStep) * 100);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className="w-full bg-[#0A0A0A] rounded-t-md h-16 flex items-end overflow-hidden border-x border-t border-[#222222]">
                      <div
                        className="w-full bg-[#D4FF44] rounded-t-md group-hover:brightness-125 transition-all"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-[#888888] font-bold">{h.hour}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Net Calorie Balance Engine (Burned vs Eaten) */}
        <div className="lg:col-span-5 bg-[#111111] border border-[#222222] rounded-3xl p-6 space-y-5 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[#F5F5F5] font-display uppercase tracking-tight flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#D4FF44]" />
                <span>Net Daily Energy Balance</span>
              </h3>
              <span className="text-[9px] text-[#888888] font-black uppercase tracking-wider">Food vs Activity</span>
            </div>
            <p className="text-xs text-[#888888] mt-1 font-medium">
              Real-time calculation of calories consumed from Food Lens diary vs total calories burned.
            </p>

            {/* Visual Calorie Comparison */}
            <div className="mt-6 space-y-4">
              
              {/* Eaten */}
              <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-[#222222]">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="text-[#888888] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#D4FF44]" />
                    Calories Eaten (Diary)
                  </span>
                  <span className="text-[#D4FF44] font-black text-sm">
                    {todayCaloriesEaten} kcal
                  </span>
                </div>
                <div className="w-full h-2 bg-[#222222] rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-[#D4FF44] rounded-full"
                    style={{ width: `${Math.min(100, (todayCaloriesEaten / user.dailyCalorieTarget) * 100)}%` }}
                  />
                </div>
                <div className="text-[9px] text-[#666666] font-bold uppercase tracking-wider mt-1 flex justify-between">
                  <span>Target: {user.dailyCalorieTarget} kcal</span>
                  <span>{Math.max(0, user.dailyCalorieTarget - todayCaloriesEaten)} kcal remaining</span>
                </div>
              </div>

              {/* Burned */}
              <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-[#222222]">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="text-[#888888] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#F5F5F5]" />
                    Total Burned (Wearable)
                  </span>
                  <span className="text-[#F5F5F5] font-black text-sm">
                    {metrics.totalCaloriesBurned} kcal
                  </span>
                </div>
                <div className="w-full h-2 bg-[#222222] rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-[#F5F5F5] rounded-full"
                    style={{ width: `${Math.min(100, (metrics.totalCaloriesBurned / 2500) * 100)}%` }}
                  />
                </div>
                <div className="text-[9px] text-[#666666] font-bold uppercase tracking-wider mt-1 flex justify-between">
                  <span>BMR: {metrics.bmrCalories} kcal</span>
                  <span>Active: {metrics.activeCaloriesBurned} kcal</span>
                </div>
              </div>

              {/* Net Balance Result Card */}
              <div className="p-5 rounded-2xl border text-center bg-[#0A0A0A] border-[#D4FF44]/40 text-[#D4FF44]">
                <div className="text-[9px] font-black uppercase tracking-[0.25em] text-[#888888]">
                  Current Net Energy Status
                </div>
                <div className="text-3xl font-black my-1 flex items-center justify-center gap-2">
                  {netCalorieBalance <= 0 ? (
                    <ArrowDownRight className="w-7 h-7 text-[#D4FF44]" />
                  ) : (
                    <ArrowUpRight className="w-7 h-7 text-rose-400" />
                  )}
                  <span>{Math.abs(netCalorieBalance)} kcal</span>
                  <span className="text-xs uppercase font-black px-2.5 py-0.5 rounded-full bg-[#161616] text-[#F5F5F5]">
                    {netCalorieBalance <= 0 ? 'Deficit' : 'Surplus'}
                  </span>
                </div>
                <p className="text-xs text-[#A3A3A3] mt-1 leading-relaxed font-medium">
                  {netCalorieBalance <= 0
                    ? `Great job! You are currently in an active ${Math.abs(netCalorieBalance)} kcal deficit, supporting your ${user.dietaryGoal.replace('_', ' ')} goal.`
                    : `You are in a ${netCalorieBalance} kcal surplus. Consider a light evening walk or adjust dinner portions.`}
                </p>
              </div>

            </div>
          </div>

          {/* Sleep & Recovery Indicators */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#222222]">
            <div className="p-3.5 rounded-2xl bg-[#0A0A0A] border border-[#222222] text-center">
              <div className="text-[9px] uppercase font-black text-[#888888] tracking-wider flex items-center justify-center gap-1">
                <Moon className="w-3 h-3 text-[#D4FF44]" /> Sleep Duration
              </div>
              <div className="text-lg font-black text-[#F5F5F5] mt-0.5">
                {metrics.sleepHours || 7.8} hrs
              </div>
              <div className="text-[9px] uppercase font-bold text-[#D4FF44]">Optimal REM Cycle</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0A0A0A] border border-[#222222] text-center">
              <div className="text-[9px] uppercase font-black text-[#888888] tracking-wider flex items-center justify-center gap-1">
                <Award className="w-3 h-3 text-[#D4FF44]" /> Recovery Score
              </div>
              <div className="text-lg font-black text-[#D4FF44] mt-0.5">
                {metrics.recoveryScore || 88}%
              </div>
              <div className="text-[9px] uppercase font-bold text-[#F5F5F5]">Prime Metabolic State</div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
