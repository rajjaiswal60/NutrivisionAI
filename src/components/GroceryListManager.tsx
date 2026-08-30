import React, { useState } from 'react';
import { 
  ShoppingBag, Plus, Check, Trash2, Copy, Share2, 
  Sparkles, CheckCircle2, Home, RotateCcw, Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GroceryItem } from '../types';

interface GroceryListManagerProps {
  items: GroceryItem[];
  onUpdateItems: (items: GroceryItem[]) => void;
}

const CATEGORIES: GroceryItem['category'][] = [
  'Produce & Greens',
  'Proteins & Meat',
  'Dairy & Plant Milk',
  'Grains & Pasta',
  'Pantry & Spices',
  'Healthy Fats & Oils',
  'Snacks & Seeds',
];

export const GroceryListManager: React.FC<GroceryListManagerProps> = ({
  items,
  onUpdateItems,
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('1 unit');
  const [newItemCategory, setNewItemCategory] = useState<GroceryItem['category']>('Produce & Greens');
  const [copyNotification, setCopyNotification] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const handleToggleCheck = (id: string) => {
    const updated = items.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it));
    onUpdateItems(updated);

    const checkedCount = updated.filter((i) => i.checked).length;
    if (checkedCount === updated.length && updated.length > 0) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    }
  };

  const handleTogglePantry = (id: string) => {
    const updated = items.map((it) => (it.id === id ? { ...it, inPantry: !it.inPantry } : it));
    onUpdateItems(updated);
  };

  const handleDeleteItem = (id: string) => {
    onUpdateItems(items.filter((it) => it.id !== id));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: GroceryItem = {
      id: `custom-item-${Date.now()}`,
      name: newItemName.trim(),
      quantity: newItemQty.trim() || '1 unit',
      category: newItemCategory,
      checked: false,
    };

    onUpdateItems([newItem, ...items]);
    setNewItemName('');
    setNewItemQty('1 unit');
  };

  const handleClearCompleted = () => {
    onUpdateItems(items.filter((it) => !it.checked));
  };

  const handleCopyList = () => {
    const text = items
      .map((it) => `[${it.checked ? 'X' : ' '}] ${it.name} (${it.quantity}) - ${it.category}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopyNotification(true);
    setTimeout(() => setCopyNotification(false), 3000);
  };

  const totalCount = items.length;
  const checkedCount = items.filter((it) => it.checked).length;
  const progressPct = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  const filteredItems = items.filter((it) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'to_buy') return !it.checked && !it.inPantry;
    if (selectedFilter === 'pantry') return it.inPantry;
    return it.category === selectedFilter;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#161616] border border-[#262626] text-[#D4FF44] text-[10px] font-black uppercase tracking-widest mb-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Nutritional Grocery Checklist</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#F5F5F5] font-display uppercase tracking-tight">
            Weekly <span className="text-[#D4FF44]">Grocery List</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#888888] mt-1 font-medium">
            Auto-populated from your scanned recipes and regional meal plans.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyList}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#111111] hover:bg-[#1A1A1A] text-[#F5F5F5] border border-[#222222] text-xs font-black uppercase tracking-wider transition-all hover:border-[#333333]"
            title="Copy to Clipboard"
          >
            <Copy className="w-3.5 h-3.5 text-[#D4FF44]" />
            <span>{copyNotification ? 'Copied!' : 'Copy List'}</span>
          </button>

          {checkedCount > 0 && (
            <button
              onClick={handleClearCompleted}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#111111] hover:bg-rose-500/20 hover:text-rose-300 text-[#888888] border border-[#222222] text-xs font-black uppercase tracking-wider transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Done ({checkedCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress & Quick Stats Card */}
      <div className="bg-[#111111] border border-[#222222] rounded-3xl p-6 shadow-2xl space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-black text-[#F5F5F5] uppercase tracking-wider text-xs">Shopping Progress</span>
            <span className="text-[#888888] text-[11px] font-medium">
              ({checkedCount} of {totalCount} items bought)
            </span>
          </div>
          <span className="font-black text-[#D4FF44] text-sm uppercase tracking-wider">
            {progressPct}% Completed
          </span>
        </div>

        <div className="w-full h-2 bg-[#222222] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#D4FF44] rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Add New Item Form */}
      <form
        onSubmit={handleAddItem}
        className="p-4 rounded-3xl bg-[#111111] border border-[#222222] flex flex-col sm:flex-row gap-2.5 shadow-xl"
      >
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Add custom grocery item (e.g., 'Fresh Organic Basil', 'Chia Seeds')..."
          className="flex-1 bg-[#0A0A0A] border border-[#222222] rounded-2xl px-4 py-2.5 text-xs text-[#F5F5F5] placeholder-[#555555] focus:outline-none focus:border-[#D4FF44]"
        />

        <input
          type="text"
          value={newItemQty}
          onChange={(e) => setNewItemQty(e.target.value)}
          placeholder="Qty (e.g. 200g, 1 bunch)"
          className="w-full sm:w-36 bg-[#0A0A0A] border border-[#222222] rounded-2xl px-3.5 py-2.5 text-xs text-[#F5F5F5] placeholder-[#555555] focus:outline-none focus:border-[#D4FF44]"
        />

        <select
          value={newItemCategory}
          onChange={(e) => setNewItemCategory(e.target.value as any)}
          className="bg-[#0A0A0A] border border-[#222222] rounded-2xl px-3.5 py-2.5 text-xs text-[#F5F5F5] focus:outline-none focus:border-[#D4FF44]"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={!newItemName.trim()}
          className="flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-2xl bg-[#D4FF44] hover:bg-[#C0F030] text-[#0A0A0A] font-black text-xs uppercase tracking-wider shadow-md transition-all disabled:opacity-40"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </form>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
            selectedFilter === 'all'
              ? 'bg-[#D4FF44] text-[#0A0A0A] shadow-md'
              : 'bg-[#111111] hover:bg-[#161616] text-[#888888] hover:text-[#F5F5F5] border border-[#222222]'
          }`}
        >
          All Items ({totalCount})
        </button>

        <button
          onClick={() => setSelectedFilter('to_buy')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
            selectedFilter === 'to_buy'
              ? 'bg-[#D4FF44] text-[#0A0A0A] shadow-md'
              : 'bg-[#111111] hover:bg-[#161616] text-[#888888] hover:text-[#F5F5F5] border border-[#222222]'
          }`}
        >
          To Buy ({items.filter((i) => !i.checked && !i.inPantry).length})
        </button>

        {CATEGORIES.map((cat) => {
          const count = items.filter((i) => i.category === cat).length;
          if (count === 0) return null;
          return (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedFilter === cat
                  ? 'bg-[#D4FF44] text-[#0A0A0A] shadow-md'
                  : 'bg-[#111111] hover:bg-[#161616] text-[#888888] hover:text-[#F5F5F5] border border-[#222222]'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Grocery Items List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-[#111111] border border-[#222222] rounded-3xl space-y-2">
            <ShoppingBag className="w-10 h-10 text-[#444444] mx-auto" />
            <div className="text-sm font-black text-[#F5F5F5] uppercase tracking-wider">No grocery items in this filter</div>
            <p className="text-xs text-[#888888] font-medium">
              Scan a food photo or export ingredients from your weekly meal plan to fill this list!
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-3xl border transition-all flex items-center justify-between gap-3 ${
                item.checked
                  ? 'bg-[#0A0A0A] border-[#1A1A1A] opacity-50'
                  : 'bg-[#111111] border-[#222222] hover:border-[#333333] shadow-md'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <button
                  onClick={() => handleToggleCheck(item.id)}
                  className={`w-6 h-6 rounded-xl border flex items-center justify-center transition-all ${
                    item.checked
                      ? 'bg-[#D4FF44] border-[#D4FF44] text-[#0A0A0A]'
                      : 'border-[#333333] bg-[#0A0A0A] hover:border-[#D4FF44]'
                  }`}
                >
                  {item.checked && <Check className="w-4 h-4 font-black" />}
                </button>

                <div className="min-w-0">
                  <div
                    className={`text-xs sm:text-sm font-black truncate uppercase tracking-tight ${
                      item.checked ? 'line-through text-[#666666]' : 'text-[#F5F5F5]'
                    }`}
                  >
                    {item.name}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[#888888] mt-0.5">
                    <span className="text-[#D4FF44] font-black">{item.quantity}</span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded-md bg-[#161616] text-[9px] font-black uppercase text-[#888888] border border-[#262626]">
                      {item.category}
                    </span>
                    {item.sourceDish && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline text-[#666666] text-[10px] font-medium truncate max-w-[160px]">
                          from {item.sourceDish}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right actions: In Pantry toggle & Delete */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleTogglePantry(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                    item.inPantry
                      ? 'bg-[#161616] text-[#D4FF44] border border-[#D4FF44]/40'
                      : 'bg-[#0A0A0A] text-[#888888] hover:text-[#F5F5F5] border border-[#222222]'
                  }`}
                  title="Mark as Already in Home Pantry"
                >
                  <span className="flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5" />
                    <span>{item.inPantry ? 'In Pantry' : 'Pantry?'}</span>
                  </span>
                </button>

                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-2 rounded-xl text-[#666666] hover:text-rose-400 hover:bg-[#161616] transition-colors"
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
