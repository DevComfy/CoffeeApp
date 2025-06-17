import { Meeting } from '../types';

const API_URL = `http://${window.location.hostname}:3651/api/meetings`;

export interface StoredMeeting extends Meeting {
  id: string;
  createdAt: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export const saveMeeting = async (meeting: Meeting): Promise<StoredMeeting> => {
  const storedMeeting: StoredMeeting = {
    ...meeting,
    id: generateId(),
    createdAt: new Date().toISOString(),
    status: 'scheduled'
  };

  try {
    const meetings = await getMeetings();
    const updatedMeetings = Array.isArray(meetings) ? [...meetings, storedMeeting] : [storedMeeting];
    
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedMeetings)
    });

    return storedMeeting;
  } catch (error) {
    console.error('Error saving meeting:', error);
    throw error;
  }
};

export const getMeetings = async (): Promise<StoredMeeting[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error loading meetings:', error);
    return [];
  }
};

export const updateMeetingStatus = async (id: string, status: StoredMeeting['status']): Promise<void> => {
  const meetings = await getMeetings();
  const updatedMeetings = meetings.map(meeting => 
    meeting.id === id ? { ...meeting, status } : meeting
  );
  
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedMeetings)
  });
};

export const deleteMeeting = async (id: string): Promise<void> => {
  const meetings = await getMeetings();
  const updatedMeetings = meetings.filter(meeting => meeting.id !== id);
  
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedMeetings)
  });
};

export const clearAllMeetings = async (): Promise<void> => {
  await fetch(API_URL, {
    method: 'DELETE'
  });
};

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatDateTime = (dateTime: string): string => {
  return new Date(dateTime).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDate = (dateTime: string): string => {
  return new Date(dateTime).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatTime = (dateTime: string): string => {
  return new Date(dateTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};