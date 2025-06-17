import React from 'react';
import { ShoppingCart, X, Plus, Minus } from 'lucide-react';
import { BeverageItem } from '../types';

interface CartProps {
  items: BeverageItem[];
  isOpen: boolean;
  onToggle: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export const Cart: React.FC<CartProps> = ({ 
  items, 
  isOpen, 
  onToggle, 
  onUpdateQuantity, 
  onRemoveItem 
}) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const formatBeverageDetails = (item: BeverageItem): string => {
    const details = [];
    if (item.milk) details.push('with milk');
    if (item.sugar && item.sugar > 0) details.push(`${item.sugar} sugar`);
    return details.length > 0 ? ` (${details.join(', ')})` : '';
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    onToggle();
  };

  const handleRemoveItem = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Prevent form submission
    onRemoveItem(id);
  };

  const handleUpdateQuantity = (e: React.MouseEvent, id: string, quantity: number) => {
    e.preventDefault(); // Prevent form submission
    onUpdateQuantity(id, quantity);
  };

  return (
    <>
      {/* Cart Toggle Button */}
      <button
        type="button"
        onClick={handleToggle}
        className="glass-card p-4 hover:scale-105 transition-transform duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="text-white" size={20} />
            <span className="text-white font-medium">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
          </div>
          <div className="text-blue-400 font-medium">View Cart</div>
        </div>
      </button>

      {/* Cart Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Your Cart</h3>
                <button
                  type="button"
                  onClick={handleToggle}
                  className="glass-button p-2 hover:scale-110 transition-transform"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="mx-auto text-white/30 mb-4" size={48} />
                  <p className="text-white/60">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="glass-card-inner p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-white font-medium">{item.name}</h4>
                          <p className="text-white/60 text-sm">
                            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                            {formatBeverageDetails(item)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleRemoveItem(e, item.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={(e) => handleUpdateQuantity(e, item.id, item.quantity - 1)}
                          className="glass-button p-1 hover:scale-110 transition-transform"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-white font-medium min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleUpdateQuantity(e, item.id, item.quantity + 1)}
                          className="glass-button p-1 hover:scale-110 transition-transform"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-white/10">
                <div className="text-white/80 text-center">
                  Total: {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};