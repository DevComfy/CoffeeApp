import React, { useState } from 'react';
import { Coffee, Droplets, Wine, Plus, Minus } from 'lucide-react';
import { BeverageCategory, BeverageItem } from '../types';

interface BeverageSelectorProps {
  onAddBeverage: (beverage: Omit<BeverageItem, 'id'>) => void;
  categoryTotals: Record<BeverageCategory, number>;
}

export const BeverageSelector: React.FC<BeverageSelectorProps> = ({ onAddBeverage, categoryTotals }) => {
  const [activeCategory, setActiveCategory] = useState<BeverageCategory>('coffee');
  const [customOptions, setCustomOptions] = useState({
    coffee: { type: 'Regular', quantity: 1, milk: false, sugar: 0 },
    tea: { type: 'Regular Tea', quantity: 1, milk: false, sugar: 0 },
    water: { type: 'Still Water', quantity: 1 },
  });

  const categories = [
    { id: 'coffee' as const, label: 'Coffee', icon: Coffee },
    { id: 'tea' as const, label: 'Tea', icon: Wine },
    { id: 'water' as const, label: 'Water', icon: Droplets },
  ];

  const quickOptions = {
    coffee: [
      { name: 'Regular Coffee', milk: true, sugar: 1 },
      { name: 'Cappuccino', milk: false, sugar: 0 },
      { name: 'Espresso', milk: false, sugar: 0 },
    ],
    tea: [
      { name: 'Regular Tea', milk: true, sugar: 1 },
      { name: 'Rooibos Tea', milk: false, sugar: 0 },
      { name: 'Green Tea', milk: false, sugar: 0 },
    ],
    water: [
      { name: 'Still Water' },
      { name: 'Sparkling Water' },
    ],
  };

  const beverageOptions = {
    coffee: ['Regular', 'Cappuccino', 'Latte', 'Espresso'],
    tea: ['Regular Tea', 'Rooibos Tea', 'Green Tea', 'Earl Grey'],
    water: ['Still Water', 'Sparkling Water'],
  };

  const handleQuickAdd = (e: React.MouseEvent, category: BeverageCategory, option: any) => {
    e.preventDefault(); // Prevent form submission
    onAddBeverage({
      type: category,
      name: option.name,
      quantity: 1,
      milk: option.milk,
      sugar: option.sugar,
    });
  };

  const handleCustomAdd = (e: React.MouseEvent, category: BeverageCategory) => {
    e.preventDefault(); // Prevent form submission
    const options = customOptions[category];
    onAddBeverage({
      type: category,
      name: options.type,
      quantity: options.quantity,
      milk: 'milk' in options ? options.milk : undefined,
      sugar: 'sugar' in options ? options.sugar : undefined,
    });
  };

  const updateQuantity = (category: BeverageCategory, delta: number) => {
    setCustomOptions(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        quantity: Math.max(1, Math.min(20, prev[category].quantity + delta))
      }
    }));
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Order Beverages</h3>
      
      {/* Category Tabs */}
      <div className="flex space-x-2 mb-6">
        {categories.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveCategory(id)}
            className={`
              flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-300
              ${activeCategory === id 
                ? 'bg-white/20 text-white shadow-lg border border-white/30' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
              }
            `}
          >
            <Icon size={16} />
            <span>{label}</span>
            {categoryTotals[id] > 0 && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {categoryTotals[id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Quick Add Buttons */}
      <div className="mb-6">
        <h4 className="text-white/80 text-sm font-medium mb-3">Quick Add</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickOptions[activeCategory].map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={(e) => handleQuickAdd(e, activeCategory, option)}
              className="glass-button p-4 text-left hover:scale-105 transition-transform duration-200"
            >
              <div className="font-medium text-white">{option.name}</div>
              {option.milk && (
                <div className="text-white/60 text-sm">With milk</div>
              )}
              {option.sugar && option.sugar > 0 && (
                <div className="text-white/60 text-sm">{option.sugar} sugar</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Options */}
      <div className="glass-card-inner p-4">
        <h4 className="text-white/80 text-sm font-medium mb-4">Customize</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm mb-2">Type</label>
            <select
              value={customOptions[activeCategory].type}
              onChange={(e) => setCustomOptions(prev => ({
                ...prev,
                [activeCategory]: { ...prev[activeCategory], type: e.target.value }
              }))}
              className="glass-input w-full"
            >
              {beverageOptions[activeCategory].map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-4">
            {/* Quantity */}
            <div className="flex items-center space-x-2">
              <span className="text-white/70 text-sm">Qty:</span>
              <button
                type="button"
                onClick={() => updateQuantity(activeCategory, -1)}
                className="glass-button p-2 hover:scale-110 transition-transform"
              >
                <Minus size={14} />
              </button>
              <span className="text-white font-medium min-w-[2rem] text-center">
                {customOptions[activeCategory].quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(activeCategory, 1)}
                className="glass-button p-2 hover:scale-110 transition-transform"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Milk toggle (coffee & tea only) */}
            {activeCategory !== 'water' && (
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={'milk' in customOptions[activeCategory] ? customOptions[activeCategory].milk : false}
                  onChange={(e) => setCustomOptions(prev => ({
                    ...prev,
                    [activeCategory]: { ...prev[activeCategory], milk: e.target.checked }
                  }))}
                  className="sr-only"
                />
                <div className={`
                  w-10 h-6 rounded-full transition-colors duration-200
                  ${('milk' in customOptions[activeCategory] ? customOptions[activeCategory].milk : false) 
                    ? 'bg-blue-500' 
                    : 'bg-white/20'
                  }
                `}>
                  <div className={`
                    w-4 h-4 bg-white rounded-full mt-1 transition-transform duration-200
                    ${('milk' in customOptions[activeCategory] ? customOptions[activeCategory].milk : false) 
                      ? 'translate-x-5' 
                      : 'translate-x-1'
                    }
                  `} />
                </div>
                <span className="text-white/70 text-sm">Milk</span>
              </label>
            )}

            {/* Sugar selection (coffee & tea only) */}
            {activeCategory !== 'water' && (
              <select
                value={'sugar' in customOptions[activeCategory] ? customOptions[activeCategory].sugar : 0}
                onChange={(e) => setCustomOptions(prev => ({
                  ...prev,
                  [activeCategory]: { ...prev[activeCategory], sugar: parseInt(e.target.value) }
                }))}
                className="glass-input"
              >
                <option value={0}>No Sugar</option>
                <option value={1}>1 Sugar</option>
                <option value={2}>2 Sugars</option>
                <option value={3}>3 Sugars</option>
              </select>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => handleCustomAdd(e, activeCategory)}
            className="glass-button w-full py-3 font-medium hover:scale-105 transition-transform"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};