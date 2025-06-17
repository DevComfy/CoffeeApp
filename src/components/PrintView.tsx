import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Coffee, Printer, Download } from 'lucide-react';
import { StoredMeeting, getMeetings } from '../utils/storage';
import { formatDateTime, formatDate, formatTime } from '../utils/storage';

export const PrintView: React.FC = () => {
  const [meetings, setMeetings] = useState<StoredMeeting[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedBoardroom, setSelectedBoardroom] = useState<string>('');

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      const savedMeetings = await getMeetings();
      // Sort by date and time
      const sortedMeetings = savedMeetings.sort((a, b) => 
        new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
      );
      setMeetings(sortedMeetings);
    } catch (error) {
      console.error('Error loading meetings:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const filteredMeetings = getFilteredMeetings();
    const exportData = {
      exportDate: new Date().toISOString(),
      filters: {
        date: selectedDate || 'All dates',
        boardroom: selectedBoardroom || 'All boardrooms'
      },
      meetings: filteredMeetings
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `meetings-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getFilteredMeetings = () => {
    return meetings.filter(meeting => {
      const meetingDate = new Date(meeting.dateTime).toISOString().split('T')[0];
      const dateMatch = !selectedDate || meetingDate === selectedDate;
      const boardroomMatch = !selectedBoardroom || meeting.boardroom === selectedBoardroom;
      return dateMatch && boardroomMatch;
    });
  };

  const getBoardrooms = () => {
    const boardrooms = [...new Set(meetings.map(m => m.boardroom))];
    return boardrooms.sort();
  };

  const getBeverageDetails = (meeting: StoredMeeting) => {
    if (meeting.beverages.length === 0) return [];
    
    return meeting.beverages.map(item => {
      const details = [item.name];
      if (item.milk) details.push('with milk');
      if (item.sugar && item.sugar > 0) details.push(`${item.sugar} sugar`);
      return `${item.quantity}x ${details.join(' ')}`;
    });
  };

  const filteredMeetings = getFilteredMeetings();

  return (
    <div className="space-y-8">
      {/* Print Controls - Hidden in print */}
      <div className="glass-card p-6 print:hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-2xl font-bold text-white mb-4 md:mb-0">
            Print View
          </h2>
          
          <div className="flex space-x-3">
            <button
              onClick={handleExport}
              className="glass-button px-4 py-2 font-medium hover:scale-105 transition-transform"
            >
              <Download className="inline mr-2" size={16} />
              Export JSON
            </button>
            <button
              onClick={handlePrint}
              className="glass-button px-4 py-2 font-medium hover:scale-105 transition-transform"
            >
              <Printer className="inline mr-2" size={16} />
              Print
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Filter by Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="glass-input w-full"
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Filter by Boardroom
            </label>
            <select
              value={selectedBoardroom}
              onChange={(e) => setSelectedBoardroom(e.target.value)}
              className="glass-input w-full"
            >
              <option value="">All Boardrooms</option>
              {getBoardrooms().map(boardroom => (
                <option key={boardroom} value={boardroom}>{boardroom}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Print Content */}
      <div className="glass-card p-8 print:bg-white print:text-black print:shadow-none">
        {/* Print Header */}
        <div className="text-center mb-8 print:mb-6">
          <h1 className="text-3xl font-bold text-white print:text-black mb-2">
            Meeting Schedule Report
          </h1>
          <p className="text-white/70 print:text-gray-600">
            Generated on {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          {(selectedDate || selectedBoardroom) && (
            <div className="mt-4 text-sm text-white/60 print:text-gray-500">
              <p>
                Filters: {selectedDate ? `Date: ${formatDate(selectedDate + 'T00:00:00')}` : 'All dates'}
                {selectedDate && selectedBoardroom && ' | '}
                {selectedBoardroom ? `Boardroom: ${selectedBoardroom}` : selectedBoardroom === '' && selectedDate ? '' : 'All boardrooms'}
              </p>
            </div>
          )}
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 print:mb-6">
          <div className="glass-card-inner p-4 text-center print:border print:border-gray-300 print:bg-gray-50">
            <div className="text-2xl font-bold text-white print:text-black">
              {filteredMeetings.length}
            </div>
            <div className="text-white/60 print:text-gray-600 text-sm">Total Meetings</div>
          </div>
          <div className="glass-card-inner p-4 text-center print:border print:border-gray-300 print:bg-gray-50">
            <div className="text-2xl font-bold text-blue-400 print:text-black">
              {filteredMeetings.filter(m => m.status === 'scheduled').length}
            </div>
            <div className="text-white/60 print:text-gray-600 text-sm">Scheduled</div>
          </div>
          <div className="glass-card-inner p-4 text-center print:border print:border-gray-300 print:bg-gray-50">
            <div className="text-2xl font-bold text-green-400 print:text-black">
              {filteredMeetings.reduce((sum, m) => sum + m.beverages.reduce((bSum, b) => bSum + b.quantity, 0), 0)}
            </div>
            <div className="text-white/60 print:text-gray-600 text-sm">Total Beverages</div>
          </div>
        </div>

        {/* Meetings List */}
        <div className="space-y-6 print:space-y-4">
          {filteredMeetings.length === 0 ? (
            <div className="text-center py-12 print:py-8">
              <Calendar className="mx-auto text-white/30 print:text-gray-400 mb-4" size={64} />
              <p className="text-white/60 print:text-gray-600 text-lg">
                No meetings found for the selected filters
              </p>
            </div>
          ) : (
            filteredMeetings.map((meeting, index) => (
              <div key={meeting.id} className="glass-card-inner p-6 print:border print:border-gray-300 print:bg-white print:break-inside-avoid">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white print:text-black mb-2">
                      Meeting #{index + 1}
                    </h3>
                    <div className="text-lg text-blue-400 print:text-black font-medium">
                      {formatDateTime(meeting.dateTime)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`
                      inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium
                      ${meeting.status === 'scheduled' ? 'text-blue-400 bg-blue-400/20' : ''}
                      ${meeting.status === 'completed' ? 'text-green-400 bg-green-400/20' : ''}
                      ${meeting.status === 'cancelled' ? 'text-red-400 bg-red-400/20' : ''}
                      print:bg-gray-100 print:text-black print:border print:border-gray-300
                    `}>
                      <span className="capitalize">{meeting.status}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-white/80 print:text-gray-700">
                      <MapPin size={16} />
                      <span><strong>Boardroom:</strong> {meeting.boardroom}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-white/80 print:text-gray-700">
                      <User size={16} />
                      <span><strong>Organizer:</strong> {meeting.userName}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-white/80 print:text-gray-700">
                      <Clock size={16} />
                      <span><strong>Duration:</strong> {meeting.duration} minutes</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start space-x-2 text-white/80 print:text-gray-700">
                      <Coffee size={16} className="mt-0.5" />
                      <div>
                        <strong>Beverages:</strong>
                        {meeting.beverages.length === 0 ? (
                          <span className="ml-2">None requested</span>
                        ) : (
                          <ul className="ml-2 mt-1 space-y-1">
                            {getBeverageDetails(meeting).map((beverage, idx) => (
                              <li key={idx} className="text-sm">• {beverage}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {meeting.notes && (
                  <div className="mt-4 p-3 bg-white/5 print:bg-gray-50 print:border print:border-gray-200 rounded-lg">
                    <strong className="text-white print:text-black">Notes:</strong>
                    <p className="text-white/80 print:text-gray-700 mt-1">{meeting.notes}</p>
                  </div>
                )}

                {meeting.recurring && (
                  <div className="mt-2 text-sm text-white/60 print:text-gray-500">
                    <em>This is a recurring meeting</em>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:bg-white {
            background: white !important;
          }
          .print\\:text-black {
            color: black !important;
          }
          .print\\:text-gray-600 {
            color: #4b5563 !important;
          }
          .print\\:text-gray-700 {
            color: #374151 !important;
          }
          .print\\:border {
            border: 1px solid #d1d5db !important;
          }
          .print\\:border-gray-300 {
            border-color: #d1d5db !important;
          }
          .print\\:bg-gray-50 {
            background-color: #f9fafb !important;
          }
          .print\\:bg-gray-100 {
            background-color: #f3f4f6 !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:break-inside-avoid {
            break-inside: avoid !important;
          }
        }
      `}</style>
    </div>
  );
};