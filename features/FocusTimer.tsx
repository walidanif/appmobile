import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer, Watch, Settings, Save, X } from 'lucide-react';
import { Button } from '../components/ui/Button';

// Utility to get settings safely (returns minutes)
const getStoredSettings = () => {
  try {
    const work = localStorage.getItem('zen_work_min');
    const brk = localStorage.getItem('zen_break_min');
    return {
      work: work ? parseInt(work, 10) : 25,
      break: brk ? parseInt(brk, 10) : 5,
    };
  } catch {
    return { work: 25, break: 5 };
  }
};

type ToolMode = 'pomodoro' | 'stopwatch';

export const FocusTimer: React.FC = () => {
  const [tool, setTool] = useState<ToolMode>('pomodoro');
  
  // Settings State
  const initialSettings = getStoredSettings();
  const [workDuration, setWorkDuration] = useState(initialSettings.work);
  const [breakDuration, setBreakDuration] = useState(initialSettings.break);
  const [showSettings, setShowSettings] = useState(false);
  
  // Edit State (for inputs)
  const [editWork, setEditWork] = useState(initialSettings.work);
  const [editBreak, setEditBreak] = useState(initialSettings.break);

  // Pomodoro State
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  // Stopwatch State
  const [swTime, setSwTime] = useState(0);
  const [swActive, setSwActive] = useState(false);

  // --- Pomodoro Logic ---
  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? workDuration * 60 : breakDuration * 60);
  };

  const switchMode = (newMode: 'work' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'work' ? workDuration * 60 : breakDuration * 60);
  };

  const handleSaveSettings = () => {
    const newWork = Math.max(1, Math.min(120, editWork)); // Clamp between 1 and 120 mins
    const newBreak = Math.max(1, Math.min(60, editBreak)); // Clamp between 1 and 60 mins
    
    localStorage.setItem('zen_work_min', String(newWork));
    localStorage.setItem('zen_break_min', String(newBreak));
    
    setWorkDuration(newWork);
    setBreakDuration(newBreak);
    setShowSettings(false);
    
    // Reset timer to apply changes
    setIsActive(false);
    setTimeLeft(mode === 'work' ? newWork * 60 : newBreak * 60);
  };

  const cancelSettings = () => {
    setEditWork(workDuration);
    setEditBreak(breakDuration);
    setShowSettings(false);
  };

  useEffect(() => {
    let interval: number | undefined;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // --- Stopwatch Logic ---
  useEffect(() => {
    let interval: number | undefined;
    if (swActive) {
      const startTime = Date.now() - swTime;
      interval = window.setInterval(() => {
        setSwTime(Date.now() - startTime);
      }, 10); // Update every 10ms
    }
    return () => clearInterval(interval);
  }, [swActive]);

  const toggleStopwatch = () => setSwActive(!swActive);
  const resetStopwatch = () => {
    setSwActive(false);
    setSwTime(0);
  };

  // --- Formatting ---
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatStopwatch = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const centis = Math.floor((ms % 1000) / 10);
    return (
      <div className="flex items-baseline">
         <span className="tabular-nums">{mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}</span>
         <span className="text-3xl ml-1 text-stone-400 font-normal tabular-nums">.{centis.toString().padStart(2, '0')}</span>
      </div>
    );
  };

  const progress = mode === 'work' 
    ? ((workDuration * 60 - timeLeft) / (workDuration * 60)) * 100 
    : ((breakDuration * 60 - timeLeft) / (breakDuration * 60)) * 100;

  return (
    <div className="flex flex-col items-center min-h-full p-6 animate-in fade-in zoom-in duration-300 w-full max-w-lg mx-auto">
      
      {/* Tool Switcher */}
      <div className="flex p-1 bg-stone-200/50 dark:bg-stone-800 rounded-2xl mb-8 w-full max-w-xs relative shrink-0">
        <button
          onClick={() => { setTool('pomodoro'); setShowSettings(false); }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all active:scale-95 ${
            tool === 'pomodoro' 
            ? 'bg-white dark:bg-stone-700 shadow-sm text-indigo-600 dark:text-indigo-400' 
            : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <Timer className="w-4 h-4" /> Focus
        </button>
        <button
          onClick={() => { setTool('stopwatch'); setShowSettings(false); }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all active:scale-95 ${
            tool === 'stopwatch' 
            ? 'bg-white dark:bg-stone-700 shadow-sm text-indigo-600 dark:text-indigo-400' 
            : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <Watch className="w-4 h-4" /> Stopwatch
        </button>
      </div>

      {tool === 'pomodoro' ? (
        showSettings ? (
          // --- Settings View ---
          <div className="flex flex-col items-center justify-center w-full max-w-xs space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-300 flex-1">
             <div className="text-center mb-2">
                <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100">Timer Settings</h3>
                <p className="text-stone-400 text-sm">Customize your sessions</p>
             </div>

             <div className="w-full space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">Work Duration (min)</label>
                    <input 
                        type="number" 
                        min="1" 
                        max="120"
                        value={editWork}
                        onChange={(e) => setEditWork(parseInt(e.target.value) || 0)}
                        className="w-full p-4 rounded-2xl bg-white dark:bg-stone-800 border-2 border-transparent focus:border-indigo-500 dark:text-white text-xl font-bold text-center outline-none transition-all shadow-sm"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">Break Duration (min)</label>
                    <input 
                        type="number" 
                        min="1" 
                        max="60"
                        value={editBreak}
                        onChange={(e) => setEditBreak(parseInt(e.target.value) || 0)}
                        className="w-full p-4 rounded-2xl bg-white dark:bg-stone-800 border-2 border-transparent focus:border-teal-500 dark:text-white text-xl font-bold text-center outline-none transition-all shadow-sm"
                    />
                </div>
             </div>

             <div className="flex gap-4 w-full mt-auto mb-4">
                <Button variant="secondary" className="flex-1" onClick={cancelSettings}>
                    <X className="w-4 h-4 mr-2" /> Cancel
                </Button>
                <Button variant="primary" className="flex-1 bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600" onClick={handleSaveSettings}>
                    <Save className="w-4 h-4 mr-2" /> Save
                </Button>
             </div>
          </div>
        ) : (
          // --- Timer View ---
          <div className="flex flex-col items-center justify-center w-full space-y-10 animate-in fade-in duration-300 flex-1">
            {/* Pomodoro Mode Switcher */}
            <div className="flex p-1 bg-stone-100 dark:bg-stone-800/50 rounded-full relative">
              <button
                onClick={() => switchMode('work')}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  mode === 'work' ? 'bg-white dark:bg-stone-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-stone-400 dark:text-stone-500'
                }`}
              >
                Work
              </button>
              <button
                onClick={() => switchMode('break')}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  mode === 'break' ? 'bg-white dark:bg-stone-700 shadow-sm text-teal-600 dark:text-teal-400' : 'text-stone-400 dark:text-stone-500'
                }`}
              >
                Break
              </button>
              
              {/* Settings Toggle */}
              <button 
                onClick={() => {
                   setEditWork(workDuration);
                   setEditBreak(breakDuration);
                   setShowSettings(true);
                }}
                className="absolute -right-12 top-1/2 -translate-y-1/2 p-3 text-stone-300 active:text-stone-500 dark:text-stone-600 dark:active:text-stone-400 transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {/* Pomodoro Timer Display */}
            <div className="relative flex items-center justify-center w-72 h-72">
              <svg className="absolute w-full h-full transform -rotate-90 drop-shadow-xl" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-stone-100 dark:text-stone-800" strokeWidth="6" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  className={`${mode === 'work' ? 'text-indigo-500' : 'text-teal-500'} transition-all duration-1000 ease-linear`}
                  strokeWidth="6"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * progress) / 100}
                  strokeLinecap="round"
                />
              </svg>
              
              <div className="flex flex-col items-center z-10">
                 <span className={`text-6xl font-bold tracking-tighter ${mode === 'work' ? 'text-stone-800 dark:text-stone-100' : 'text-teal-700 dark:text-teal-400'}`}>
                  {formatTime(timeLeft)}
                 </span>
                 <span className="text-stone-400 dark:text-stone-500 text-sm font-medium uppercase tracking-widest mt-2">
                   {isActive ? 'Active' : 'Paused'}
                 </span>
              </div>
            </div>

            {/* Pomodoro Controls */}
            <div className="flex items-center gap-6 pb-8">
              <Button variant="secondary" size="icon" onClick={resetTimer} className="dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400 active:scale-95 transition-transform">
                <RotateCcw className="w-5 h-5" />
              </Button>
              <Button 
                variant="primary" 
                className={`h-20 w-20 rounded-full shadow-xl active:scale-95 transition-all ${isActive ? 'bg-amber-500 active:bg-amber-600 ring-amber-300' : mode === 'break' ? 'bg-teal-500 active:bg-teal-600 ring-teal-300' : 'bg-indigo-600 active:bg-indigo-700 ring-indigo-300'}`}
                onClick={toggleTimer}
              >
                {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
              </Button>
            </div>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full flex-1">
          {/* Stopwatch Display */}
          <div className="flex flex-col items-center justify-center mb-16">
            <div className="text-7xl font-bold tracking-tight text-stone-800 dark:text-stone-100 font-mono">
              {formatStopwatch(swTime)}
            </div>
            <div className="h-1 w-24 bg-indigo-500 rounded-full mt-6 opacity-50"></div>
          </div>

          {/* Stopwatch Controls */}
          <div className="flex items-center gap-8 pb-12">
             <Button variant="secondary" size="lg" onClick={resetStopwatch} className="w-24 h-24 rounded-full border-2 text-stone-400 active:text-rose-500 active:border-rose-200 dark:border-stone-700 active:scale-95 transition-all">
              <RotateCcw className="w-8 h-8" />
            </Button>
            <Button 
              variant="primary" 
              className={`w-28 h-28 rounded-full shadow-xl text-xl active:scale-95 transition-all ${swActive ? 'bg-rose-500 active:bg-rose-600' : 'bg-emerald-500 active:bg-emerald-600'}`}
              onClick={toggleStopwatch}
            >
              {swActive ? 'Stop' : 'Start'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};