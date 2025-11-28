import React, { useState, useMemo } from 'react';
import { ArrowDownUp, Ruler, Weight, Thermometer } from 'lucide-react';

const UNITS = {
  length: {
    m: 1,
    cm: 0.01,
    mm: 0.001,
    km: 1000,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.34,
  },
  weight: {
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    lb: 0.453592,
    oz: 0.0283495,
  },
  temperature: {
    C: 'Celsius',
    F: 'Fahrenheit',
    K: 'Kelvin',
  }
};

type Category = keyof typeof UNITS;

export const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState<Category>('length');
  const [amount, setAmount] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    if (cat === 'length') { setFromUnit('m'); setToUnit('ft'); }
    if (cat === 'weight') { setFromUnit('kg'); setToUnit('lb'); }
    if (cat === 'temperature') { setFromUnit('C'); setToUnit('F'); }
  };

  const result = useMemo(() => {
    const val = parseFloat(amount);
    if (isNaN(val)) return '---';

    if (category === 'temperature') {
      if (fromUnit === toUnit) return val.toFixed(2);
      let celsius = val;
      if (fromUnit === 'F') celsius = (val - 32) * (5/9);
      if (fromUnit === 'K') celsius = val - 273.15;
      
      if (toUnit === 'C') return celsius.toFixed(2);
      if (toUnit === 'F') return (celsius * (9/5) + 32).toFixed(2);
      if (toUnit === 'K') return (celsius + 273.15).toFixed(2);
      return '---';
    } else {
      const rates = UNITS[category] as Record<string, number>;
      const baseValue = val * rates[fromUnit]; 
      const targetValue = baseValue / rates[toUnit]; 
      
      if (targetValue < 0.001 || targetValue > 10000) return targetValue.toExponential(4);
      return targetValue.toLocaleString(undefined, { maximumFractionDigits: 4 });
    }
  }, [category, amount, fromUnit, toUnit]);

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto w-full p-6 animate-in slide-in-from-right-4 duration-300">
      
      <div className="mb-8 text-center shrink-0">
        <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">Converter</h2>
        <p className="text-stone-500 dark:text-stone-400">Offline conversions</p>
      </div>

      {/* Category Tabs */}
      <div className="flex p-1 bg-stone-100 dark:bg-stone-800 rounded-2xl mb-8 shrink-0">
        {[
            { id: 'length', icon: Ruler, label: 'Length' },
            { id: 'weight', icon: Weight, label: 'Weight' },
            { id: 'temperature', icon: Thermometer, label: 'Temp' }
        ].map((cat) => (
            <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id as Category)}
                className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl transition-all active:scale-95 ${
                    category === cat.id 
                    ? 'bg-white dark:bg-stone-700 shadow-md text-indigo-600 dark:text-indigo-400' 
                    : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
                }`}
            >
                <cat.icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{cat.label}</span>
            </button>
        ))}
      </div>

      {/* Input Card */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-800 space-y-6">
        
        {/* From */}
        <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider">From</label>
            <div className="flex gap-4">
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 text-xl font-medium text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="w-24 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-2 py-3 text-stone-700 dark:text-stone-200 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    {Object.keys(UNITS[category]).map(u => (
                        <option key={u} value={u}>{u}</option>
                    ))}
                </select>
            </div>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center relative">
            <div className="h-px bg-stone-100 dark:bg-stone-800 w-full absolute"></div>
            <div className="bg-stone-50 dark:bg-stone-900 p-2 rounded-full relative z-10 text-stone-400 dark:text-stone-600">
                <ArrowDownUp className="w-5 h-5" />
            </div>
        </div>

        {/* To */}
        <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider">To</label>
            <div className="flex gap-4 items-center">
                <div className="flex-1 px-4 py-3 text-2xl font-bold text-indigo-600 dark:text-indigo-400 truncate">
                    {result}
                </div>
                <select
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="w-24 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-2 py-3 text-stone-700 dark:text-stone-200 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    {Object.keys(UNITS[category]).map(u => (
                        <option key={u} value={u}>{u}</option>
                    ))}
                </select>
            </div>
        </div>

      </div>
    </div>
  );
};