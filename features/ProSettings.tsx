import React, { useState, useEffect } from 'react';
import { Crown, Moon, Sun, Check, Lock, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const ProSettings: React.FC = () => {
  const [isPro, setIsPro] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [workMin, setWorkMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);

  useEffect(() => {
    setIsPro(localStorage.getItem('zen_pro') === 'true');
    setIsDark(localStorage.getItem('zen_theme') === 'dark');
    
    const storedWork = localStorage.getItem('zen_work_min');
    const storedBreak = localStorage.getItem('zen_break_min');
    if (storedWork) setWorkMin(parseInt(storedWork));
    if (storedBreak) setBreakMin(parseInt(storedBreak));
  }, []);

  const togglePro = () => {
    const newState = !isPro;
    setIsPro(newState);
    localStorage.setItem('zen_pro', String(newState));
  };

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    localStorage.setItem('zen_theme', newTheme);
    
    // Apply immediately to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const saveTimers = () => {
    localStorage.setItem('zen_work_min', String(workMin));
    localStorage.setItem('zen_break_min', String(breakMin));
    alert('Timer settings saved! They will apply to the next timer session.');
  };

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto w-full p-6 animate-in slide-in-from-right-4 duration-300">
      
      <div className="mb-8 text-center shrink-0">
        <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 flex items-center justify-center gap-2">
           ZenUtils <span className="text-amber-500 font-black italic">PRO</span>
        </h2>
        <p className="text-stone-500 dark:text-stone-400">Customize your experience</p>
      </div>

      {/* Pro Status Card */}
      <div className={`p-6 rounded-3xl mb-6 text-center transition-all ${
        isPro 
        ? 'bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-200 dark:border-amber-800' 
        : 'bg-stone-100 dark:bg-stone-800 border-2 border-dashed border-stone-200 dark:border-stone-700'
      }`}>
        {isPro ? (
            <>
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-amber-200 dark:shadow-none">
                    <Crown className="w-8 h-8 fill-current" />
                </div>
                <h3 className="font-bold text-lg text-stone-800 dark:text-amber-100 mb-1">Pro Unlocked</h3>
                <p className="text-stone-500 dark:text-stone-400 text-sm mb-4">You have access to all advanced features.</p>
                <Button variant="ghost" size="sm" onClick={togglePro} className="active:scale-95 transition-transform">Deactivate (Demo)</Button>
            </>
        ) : (
             <>
                <div className="w-16 h-16 bg-stone-200 dark:bg-stone-700 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
                    <Lock className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg text-stone-800 dark:text-stone-100 mb-1">Free Version</h3>
                <p className="text-stone-500 dark:text-stone-400 text-sm mb-4">Unlock themes and custom timers.</p>
                <Button onClick={togglePro} className="bg-stone-800 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-stone-200 w-full active:scale-95 transition-transform">
                    Upgrade for Free
                </Button>
            </>
        )}
      </div>

      {/* Settings List */}
      <div className="space-y-4 pb-8">
        
        {/* Dark Mode */}
        <div className={`flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 transition-opacity active:scale-[0.99] ${!isPro ? 'opacity-50 pointer-events-none' : ''}`}>
             <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </div>
                <span className="font-medium text-stone-700 dark:text-stone-200">Dark Mode</span>
             </div>
             <button 
                onClick={toggleTheme}
                className={`w-12 h-7 rounded-full transition-colors relative ${isDark ? 'bg-indigo-600' : 'bg-stone-200'}`}
             >
                <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-sm transition-transform ${isDark ? 'translate-x-5' : ''}`}></div>
             </button>
        </div>

        {/* Custom Timers */}
        <div className={`p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 transition-opacity ${!isPro ? 'opacity-50 pointer-events-none' : ''}`}>
             <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-xl">
                    <Clock className="w-5 h-5" />
                </div>
                <span className="font-medium text-stone-700 dark:text-stone-200">Custom Durations</span>
             </div>
             
             <div className="flex gap-4 mb-4">
                 <div className="flex-1">
                    <label className="text-xs text-stone-400 uppercase font-bold mb-1 block">Work (min)</label>
                    <input 
                        type="number" 
                        value={workMin} 
                        onChange={(e) => setWorkMin(parseInt(e.target.value) || 0)}
                        className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 text-stone-800 dark:text-stone-100 font-bold"
                    />
                 </div>
                 <div className="flex-1">
                    <label className="text-xs text-stone-400 uppercase font-bold mb-1 block">Break (min)</label>
                    <input 
                        type="number" 
                        value={breakMin} 
                        onChange={(e) => setBreakMin(parseInt(e.target.value) || 0)}
                        className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 text-stone-800 dark:text-stone-100 font-bold"
                    />
                 </div>
             </div>
             
             <Button variant="secondary" size="sm" className="w-full active:scale-95 transition-transform" onClick={saveTimers}>
                Save Changes
             </Button>
        </div>

      </div>

    </div>
  );
};