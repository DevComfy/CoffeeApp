import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Coffee, Trash2, CheckCircle, XCircle, RotateCcw, Eye } from 'lucide-react';
import { StoredMeeting, getMeetings, updateMeetingStatus, deleteMeeting } from '../utils/storage';
import { formatDateTime, formatDate, formatTime } from '../utils/storage';
import { MeetingDetailsModal } from './MeetingDetailsModal';

export const Dashboard: React.FC = () => {
  const [meetings, setMeetings] = useState<StoredMeeting[]>([]);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [selectedMeeting, setSelectedMeeting] = useState<StoredMeeting | null>(null);

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      const savedMeetings = await getMeetings();
      // Sort by date (newest first)
      const sortedMeetings = savedMeetings.sort((a, b) => 
        new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
      );
      setMeetings(sortedMeetings);
    } catch (error) {
      console.error('Error loading meetings:', error);
    }
  };

  const handleStatusUpdate = async (id: string, status: StoredMeeting['status']) => {
    try {
      await updateMeetingStatus(id, status);
      await loadMeetings();
    } catch (error) {
      console.error('Error updating meeting status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this meeting?')) {
      try {
        await deleteMeeting(id);
        await loadMeetings();
      } catch (error) {
        console.error('Error deleting meeting:', error);
      }
    }
  };

  const filteredMeetings = meetings.filter(meeting => 
    filter === 'all' || meeting.status === filter
  );

  const getStatusColor = (status: StoredMeeting['status']) => {
    switch (status) {
      case 'scheduled': return 'text-blue-400 bg-blue-400/20';
      case 'completed': return 'text-green-400 bg-green-400/20';
      case 'cancelled': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusIcon = (status: StoredMeeting['status']) => {
    switch (status) {
      case 'scheduled': return <Clock size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getBeverageSummary = (meeting: StoredMeeting) => {
    const totals = { coffee: 0, tea: 0, water: 0 };
    meeting.beverages.forEach(item => {
      totals[item.type] += item.quantity;
    });
    
    const summary = [];
    if (totals.coffee > 0) summary.push(`${totals.coffee} Coffee`);
    if (totals.tea > 0) summary.push(`${totals.tea} Tea`);
    if (totals.water > 0) summary.push(`${totals.water} Water`);
    
    return summary.join(', ') || 'No beverages';
  };

  const handleRestore = async (id: string) => {
    if (confirm('Are you sure you want to restore this meeting?')) {
      await handleStatusUpdate(id, 'scheduled');
    }
  };

  return (
    <div className="space-y-8">
      <div className="glass-card p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-3xl font-bold text-white mb-4 md:mb-0">
            Meeting Dashboard
          </h2>
          
          {/* Filter Buttons */}
          <div className="flex space-x-2">
            {(['all', 'scheduled', 'completed', 'cancelled'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all duration-300 capitalize
                  ${filter === status 
                    ? 'bg-white/20 text-white border border-white/30' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card-inner p-4 text-center">
            <div className="text-2xl font-bold text-white">{meetings.length}</div>
            <div className="text-white/60 text-sm">Total Meetings</div>
          </div>
          <div className="glass-card-inner p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {meetings.filter(m => m.status === 'scheduled').length}
            </div>
            <div className="text-white/60 text-sm">Scheduled</div>
          </div>
          <div className="glass-card-inner p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {meetings.filter(m => m.status === 'completed').length}
            </div>
            <div className="text-white/60 text-sm">Completed</div>
          </div>
          <div className="glass-card-inner p-4 text-center">
            <div className="text-2xl font-bold text-red-400">
              {meetings.filter(m => m.status === 'cancelled').length}
            </div>
            <div className="text-white/60 text-sm">Cancelled</div>
          </div>
        </div>

        {/* Meetings List */}
        <div className="space-y-4">
          {filteredMeetings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto text-white/30 mb-4" size={64} />
              <p className="text-white/60 text-lg">
                {filter === 'all' ? 'No meetings found' : `No ${filter} meetings`}
              </p>
            </div>
          ) : (
            filteredMeetings.map((meeting) => (
              <div key={meeting.id} className="glass-card-inner p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Calendar className="text-blue-400" size={20} />
                        <span className="text-white font-semibold text-lg">
                          {formatDate(meeting.dateTime)}
                        </span>
                        <span className="text-white/70">
                          {formatTime(meeting.dateTime)}
                        </span>
                      </div>
                      <div className={`
                        flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium
                        ${getStatusColor(meeting.status)}
                      `}>
                        {getStatusIcon(meeting.status)}
                        <span className="capitalize">{meeting.status}</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2 text-white/80">
                        <MapPin size={16} />
                        <span>{meeting.boardroom}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-white/80">
                        <User size={16} />
                        <span>{meeting.userName}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-white/80">
                        <Clock size={16} />
                        <span>{meeting.duration} minutes</span>
                      </div>
                      <div className="flex items-center space-x-2 text-white/80">
                        <Coffee size={16} />
                        <span>{getBeverageSummary(meeting)}</span>
                      </div>
                      {meeting.recurring && (
                        <div className="flex items-center space-x-2 text-white/80">
                          <RotateCcw size={16} />
                          <span>Recurring</span>
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    {meeting.notes && (
                      <div className="text-white/70 text-sm bg-white/5 p-3 rounded-lg">
                        <strong>Notes:</strong> {meeting.notes}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 mt-4 lg:mt-0 lg:ml-6">
                    <button
                      onClick={() => setSelectedMeeting(meeting)}
                      className="glass-button px-3 py-2 text-sm hover:scale-105 transition-transform"
                      title="View details"
                    >
                      <Eye size={16} />
                    </button>

                    {meeting.status === 'scheduled' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(meeting.id, 'completed')}
                          className="glass-button px-3 py-2 text-sm hover:scale-105 transition-transform"
                          title="Mark as completed"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(meeting.id, 'cancelled')}
                          className="glass-button px-3 py-2 text-sm hover:scale-105 transition-transform"
                          title="Cancel meeting"
                        >
                          <XCircle size={16} />
                        </button>
                      </>
                    )}
                    {meeting.status === 'cancelled' && (
                      <button
                        onClick={() => handleRestore(meeting.id)}
                        className="glass-button px-3 py-2 text-sm hover:scale-105 transition-transform text-green-400"
                        title="Restore meeting"
                      >
                        <RotateCcw size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(meeting.id)}
                      className="glass-button px-3 py-2 text-sm hover:scale-105 transition-transform text-red-400 hover:text-red-300"
                      title="Delete meeting"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Meeting Details Modal */}
      {selectedMeeting && (
        <MeetingDetailsModal
          meeting={selectedMeeting}
          onClose={() => setSelectedMeeting(null)}
        />
      )}
    </div>
  );
};