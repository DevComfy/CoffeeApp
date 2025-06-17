import React from 'react';
import { X, Calendar, Clock, MapPin, User, Coffee, RotateCcw } from 'lucide-react';
import { StoredMeeting } from '../utils/storage';
import { formatDateTime } from '../utils/storage';

interface MeetingDetailsModalProps {
  meeting: StoredMeeting;
  onClose: () => void;
}

export const MeetingDetailsModal: React.FC<MeetingDetailsModalProps> = ({ meeting, onClose }) => {
  const getBeverageDetails = (beverage: any) => {
    const details = [beverage.name];
    if (beverage.milk) details.push('with milk');
    if (beverage.sugar && beverage.sugar > 0) details.push(`${beverage.sugar} sugar`);
    return details.join(', ');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-white">Meeting Details</h3>
            <button
              onClick={onClose}
              className="glass-button p-2 hover:scale-110 transition-transform"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Date and Time */}
            <div className="glass-card-inner p-4">
              <div className="flex items-center space-x-2 text-white mb-2">
                <Calendar size={20} className="text-blue-400" />
                <span className="text-lg font-semibold">{formatDateTime(meeting.dateTime)}</span>
              </div>
              <div className="flex items-center space-x-2 text-white/70">
                <Clock size={16} />
                <span>{meeting.duration} minutes</span>
              </div>
            </div>

            {/* Location and Organizer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card-inner p-4">
                <div className="flex items-center space-x-2 text-white">
                  <MapPin size={16} className="text-blue-400" />
                  <span className="font-medium">Location</span>
                </div>
                <div className="mt-2 text-white/70">{meeting.boardroom}</div>
              </div>

              <div className="glass-card-inner p-4">
                <div className="flex items-center space-x-2 text-white">
                  <User size={16} className="text-blue-400" />
                  <span className="font-medium">Organizer</span>
                </div>
                <div className="mt-2 text-white/70">{meeting.userName}</div>
              </div>
            </div>

            {/* Beverages */}
            <div className="glass-card-inner p-4">
              <div className="flex items-center space-x-2 text-white mb-4">
                <Coffee size={16} className="text-blue-400" />
                <span className="font-medium">Beverages</span>
              </div>
              {meeting.beverages.length === 0 ? (
                <div className="text-white/70">No beverages ordered</div>
              ) : (
                <div className="space-y-3">
                  {meeting.beverages.map((beverage, index) => (
                    <div key={index} className="flex justify-between text-white/70 bg-white/5 p-3 rounded-lg">
                      <span>{getBeverageDetails(beverage)}</span>
                      <span className="font-medium">x{beverage.quantity}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Details */}
            {meeting.notes && (
              <div className="glass-card-inner p-4">
                <div className="text-white font-medium mb-2">Notes</div>
                <div className="text-white/70">{meeting.notes}</div>
              </div>
            )}

            {meeting.recurring && (
              <div className="flex items-center space-x-2 text-white/70">
                <RotateCcw size={16} />
                <span>This is a recurring meeting</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
