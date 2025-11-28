import React, { useState } from 'react';
import { Plus, Trash2, ShoppingBag, DollarSign } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { BudgetItem } from '../types';

export const QuickBudget: React.FC = () => {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemAmount) return;

    const newItem: BudgetItem = {
      id: Date.now().toString(),
      name: newItemName,
      amount: parseFloat(newItemAmount),
    };

    setItems([...items, newItem]);
    setNewItemName('');
    setNewItemAmount('');
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const clearAll = () => {
    if (window.confirm('Clear all items?')) {
      setItems([]);
    }
  };

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto w-full p-4 animate-in slide-in-from-right-4 duration-300">
      
      {/* Header Card */}
      <div className="bg-indigo-600 dark:bg-indigo-800 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 dark:shadow-none mb-6 shrink-0">
        <div className="flex justify-between items-start mb-2">
            <h2 className="text-indigo-100 font-medium text-sm uppercase tracking-wider">Total Estimated</h2>
            <ShoppingBag className="w-5 h-5 text-indigo-200" />
        </div>
        <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold">${total.toFixed(2)}</span>
            <span className="text-indigo-200 text-sm">USD</span>
        </div>
        <div className="mt-4 text-xs text-indigo-200 flex justify-between items-center">
            <span>{items.length} items in list</span>
            {items.length > 0 && (
                <button onClick={clearAll} className="active:text-white underline p-2 -mr-2">Clear All</button>
            )}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={addItem} className="flex gap-3 mb-6 shrink-0">
        <div className="flex-1 relative">
            <input
                type="text"
                placeholder="Item name..."
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="w-full h-12 pl-4 pr-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-stone-400 dark:placeholder:text-stone-600 text-stone-700 dark:text-stone-200"
            />
        </div>
        <div className="w-24 relative">
             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500">
                <DollarSign className="w-4 h-4" />
             </div>
            <input
                type="number"
                placeholder="0.00"
                step="0.01"
                value={newItemAmount}
                onChange={(e) => setNewItemAmount(e.target.value)}
                className="w-full h-12 pl-8 pr-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-stone-400 dark:placeholder:text-stone-600 text-stone-700 dark:text-stone-200"
            />
        </div>
        <Button type="submit" size="icon" disabled={!newItemName || !newItemAmount} className="shrink-0 rounded-2xl active:scale-95 transition-transform">
            <Plus className="w-6 h-6" />
        </Button>
      </form>

      {/* List */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pb-4">
        {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-stone-400 dark:text-stone-600 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-3xl">
                <ShoppingBag className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">List is empty</p>
            </div>
        ) : (
            items.map((item) => (
                <div key={item.id} className="group flex items-center justify-between p-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm transition-all active:scale-[0.99]">
                    <span className="font-medium text-stone-700 dark:text-stone-300">{item.name}</span>
                    <div className="flex items-center gap-4">
                        <span className="font-semibold text-stone-800 dark:text-stone-100">${item.amount.toFixed(2)}</span>
                        <button 
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-stone-300 dark:text-stone-600 active:text-rose-500 active:bg-rose-50 dark:active:bg-rose-900/20 rounded-xl transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};