import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, FileText, RotateCcw, Send } from 'lucide-react';
import { BeverageSelector } from './BeverageSelector';
import { Cart } from './Cart';
import { Meeting, BeverageItem, BeverageCategory } from '../types';
import { addItemToCart, calculateTotalItems, updateItemQuantity, removeItemFromCart } from '../utils/cart';
import { saveMeeting } from '../utils/storage';

export const MeetingForm: React.FC = () => {
  const [meeting, setMeeting] = useState<Partial<Meeting>>({
    dateTime: '',
    duration: 60,
    boardroom: '',
    userName: '',
    beverages: [],
    notes: '',
    recurring: false,
  });
  
  const [cartOpen, setCartOpen] = useState(false);

  const boardrooms = [
    'Boardroom A',
    'Boardroom B', 
    'Meeting Room 1',
    'Conference Room',
    'Executive Suite'
  ];

  const handleInputChange = (field: keyof Meeting, value: any) => {
    setMeeting(prev => ({ ...prev, [field]: value }));
  };

  const handleAddBeverage = (beverage: Omit<BeverageItem, 'id'>) => {
    const updatedBeverages = addItemToCart(meeting.beverages || [], beverage);
    handleInputChange('beverages', updatedBeverages);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    const updatedBeverages = updateItemQuantity(meeting.beverages || [], id, quantity);
    handleInputChange('beverages', updatedBeverages);
  };

  const handleRemoveItem = (id: string) => {
    const updatedBeverages = removeItemFromCart(meeting.beverages || [], id);
    handleInputChange('beverages', updatedBeverages);
  };

  const getCategoryTotals = (): Record<BeverageCategory, number> => {
    const totals: Record<BeverageCategory, number> = { coffee: 0, tea: 0, water: 0 };
    
    meeting.beverages?.forEach(item => {
      totals[item.type] += item.quantity;
    });
    
    return totals;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!meeting.dateTime || !meeting.boardroom || !meeting.userName) {
      alert('Please fill in all required fields');
      return;
    }

    // Save meeting to localStorage
    const savedMeeting = saveMeeting(meeting as Meeting);
    console.log('Meeting saved:', savedMeeting);
    
    // Show success message
    alert(`Meeting scheduled successfully!\n\nMeeting ID: ${savedMeeting.id}\nDate: ${new Date(savedMeeting.dateTime).toLocaleString()}\nBoardroom: ${savedMeeting.boardroom}`);
    
    // Reset form
    setMeeting({
      dateTime: '',
      duration: 60,
      boardroom: '',
      userName: '',
      beverages: [],
      notes: '',
      recurring: false,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center space-x-3">
          <Calendar className="text-blue-400" />
          <span>Schedule Meeting</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                <Calendar className="inline mr-2" size={16} />
                Date & Time
              </label>
              <input
                type="datetime-local"
                value={meeting.dateTime}
                onChange={(e) => handleInputChange('dateTime', e.target.value)}
                required
                className="glass-input w-full"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                <Clock className="inline mr-2" size={16} />
                Duration (minutes)
              </label>
              <select
                value={meeting.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                className="glass-input w-full"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
                <option value={180}>3 hours</option>
              </select>
            </div>
          </div>

          {/* Boardroom & User */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                <MapPin className="inline mr-2" size={16} />
                Boardroom
              </label>
              <select
                value={meeting.boardroom}
                onChange={(e) => handleInputChange('boardroom', e.target.value)}
                required
                className="glass-input w-full"
              >
                <option value="">Select a boardroom...</option>
                {boardrooms.map(room => (
                  <option key={room} value={room}>{room}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                <User className="inline mr-2" size={16} />
                Your Name
              </label>
              <input
                type="text"
                value={meeting.userName}
                onChange={(e) => handleInputChange('userName', e.target.value)}
                required
                placeholder="Enter your full name"
                className="glass-input w-full"
              />
            </div>
          </div>

          {/* Beverage Selection */}
          <BeverageSelector
            onAddBeverage={handleAddBeverage}
            categoryTotals={getCategoryTotals()}
          />

          {/* Cart Preview */}
          <Cart
            items={meeting.beverages || []}
            isOpen={cartOpen}
            onToggle={() => setCartOpen(!cartOpen)}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />

          {/* Notes */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              <FileText className="inline mr-2" size={16} />
              Optional Notes
            </label>
            <textarea
              value={meeting.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any special requirements or notes..."
              rows={4}
              className="glass-input w-full resize-none"
            />
          </div>

          {/* Recurring Meeting */}
          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={meeting.recurring}
                onChange={(e) => handleInputChange('recurring', e.target.checked)}
                className="sr-only"
              />
              <div className={`
                w-10 h-6 rounded-full transition-colors duration-200
                ${meeting.recurring ? 'bg-blue-500' : 'bg-white/20'}
              `}>
                <div className={`
                  w-4 h-4 bg-white rounded-full mt-1 transition-transform duration-200
                  ${meeting.recurring ? 'translate-x-5' : 'translate-x-1'}
                `} />
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw size={16} className="text-white/70" />
                <span className="text-white/80">Recurring Meeting</span>
              </div>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="glass-button w-full py-4 font-semibold text-lg hover:scale-105 transition-transform duration-200"
          >
            <Send className="inline mr-2" size={20} />
            Schedule Meeting
          </button>
        </form>
      </div>
    </div>
  );
};