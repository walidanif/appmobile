import React, { useState, useEffect } from 'react';
import { Timer, ArrowRightLeft, Moon, Sun, ShoppingBag, Settings2 } from 'lucide-react';
import { TabId } from './types';
import { FocusTimer } from './features/FocusTimer';
import { UnitConverter } from './features/UnitConverter';
import { QuickBudget } from './features/QuickBudget';
import { ProSettings } from './features/ProSettings';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId | 'budget' | 'settings'>('timer');
  const [isDark, setIsDark] = useState(false);

  // Initialize Theme on App Mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('zen_theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = storedTheme === 'dark' || (!storedTheme && systemDark);
    
    setIsDark(initialDark);
    if (initialDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('zen_theme', newTheme ? 'dark' : 'light');
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'timer':
        return <FocusTimer />;
      case 'converter':
        return <UnitConverter />;
      case 'budget':
        return <QuickBudget />;
      case 'settings':
        return <ProSettings />;
      default:
        return <FocusTimer />;
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
      
      {/* Header with Safe Area Padding */}
      <header className="pt-safe px-6 pb-4 flex justify-between items-center bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur-sm z-20 border-b border-stone-100 dark:border-stone-900 sticky top-0">
          <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100 tracking-tight">UtilityTime</h1>
          <button 
              onClick={toggleTheme}
              className="p-2 rounded-full active:bg-stone-200 dark:active:bg-stone-800 text-stone-500 dark:text-stone-400 transition-colors"
              aria-label="Toggle Dark Mode"
          >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
      </header>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto no-scrollbar w-full relative">
          {renderContent()}
      </main>
      
      {/* Bottom Navigation with Safe Area Padding */}
      <div className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-100 dark:border-stone-800 pb-safe z-30">
        <nav className="flex justify-around items-center h-16 px-2">
          <NavButton 
            active={activeTab === 'timer'} 
            onClick={() => setActiveTab('timer')} 
            icon={Timer} 
            label="Focus" 
          />
          <NavButton 
            active={activeTab === 'converter'} 
            onClick={() => setActiveTab('converter')} 
            icon={ArrowRightLeft} 
            label="Convert" 
          />
          <NavButton 
            active={activeTab === 'budget'} 
            onClick={() => setActiveTab('budget')} 
            icon={ShoppingBag} 
            label="Budget" 
          />
          <NavButton 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
            icon={Settings2} 
            label="Settings" 
          />
        </nav>
      </div>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ElementType; label: string }> = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex flex-col items-center justify-center h-full active:scale-95 transition-transform duration-100 ${
      active 
      ? 'text-indigo-600 dark:text-indigo-400' 
      : 'text-stone-400 dark:text-stone-600'
    }`}
  >
    <Icon className={`w-6 h-6 mb-1 transition-all ${active ? 'fill-current/10 stroke-[2.5px]' : 'stroke-2'}`} />
    <span className="text-[10px] font-bold tracking-wide">{label}</span>
  </button>
);

export default App;