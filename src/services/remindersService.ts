import { Reminder, CreateReminderRequest, UpdateReminderRequest } from '../types/Todo';

const REMINDERS_STORAGE_KEY = 'todopro_reminders';

// For now, we'll use localStorage for persistence since there's no backend API
// In a real app, these would be API calls like the todoService

const getRemindersFromStorage = (): Reminder[] => {
  try {
    const stored = localStorage.getItem(REMINDERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading reminders from storage:', error);
    return [];
  }
};

const saveRemindersToStorage = (reminders: Reminder[]): void => {
  try {
    localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
  } catch (error) {
    console.error('Error saving reminders to storage:', error);
  }
};

export const getAllReminders = async (): Promise<Reminder[]> => {
  // Simulate async API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getRemindersFromStorage());
    }, 100);
  });
};

export const getReminderById = async (id: string): Promise<Reminder | null> => {
  const reminders = getRemindersFromStorage();
  return reminders.find(reminder => reminder.id === id) || null;
};

export const createReminder = async (reminderData: CreateReminderRequest): Promise<Reminder> => {
  const reminders = getRemindersFromStorage();
  const newReminder: Reminder = {
    id: Date.now().toString(),
    title: reminderData.title,
    description: reminderData.description || '',
    reminder_date: reminderData.reminder_date,
    reminder_time: reminderData.reminder_time,
    priority: reminderData.priority || 'medium',
    category: reminderData.category || 'General',
    is_recurring: reminderData.is_recurring || false,
    recurrence_type: reminderData.recurrence_type,
    is_completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  const updatedReminders = [newReminder, ...reminders];
  saveRemindersToStorage(updatedReminders);
  return newReminder;
};

export const updateReminder = async (id: string, updates: UpdateReminderRequest): Promise<Reminder> => {
  const reminders = getRemindersFromStorage();
  const reminderIndex = reminders.findIndex(reminder => reminder.id === id);
  
  if (reminderIndex === -1) {
    throw new Error('Reminder not found');
  }

  const updatedReminder = {
    ...reminders[reminderIndex],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  reminders[reminderIndex] = updatedReminder;
  saveRemindersToStorage(reminders);
  return updatedReminder;
};

export const deleteReminder = async (id: string): Promise<void> => {
  const reminders = getRemindersFromStorage();
  const filteredReminders = reminders.filter(reminder => reminder.id !== id);
  saveRemindersToStorage(filteredReminders);
};

// Initialize with sample data if no reminders exist
export const initializeReminders = (): void => {
  const existingReminders = getRemindersFromStorage();
  if (existingReminders.length === 0) {
    const sampleReminders: Reminder[] = [
      {
        id: '1',
        title: 'Team standup meeting',
        description: 'Daily standup with the development team',
        reminder_date: new Date().toISOString().split('T')[0],
        reminder_time: '10:00',
        priority: 'high',
        category: 'Work',
        is_recurring: true,
        recurrence_type: 'daily',
        is_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Doctor appointment',
        description: 'Annual checkup with Dr. Smith',
        reminder_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        reminder_time: '14:30',
        priority: 'high',
        category: 'Health',
        is_recurring: false,
        is_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'Call mom',
        description: 'Weekly check-in call',
        reminder_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        reminder_time: '19:00',
        priority: 'medium',
        category: 'Family',
        is_recurring: true,
        recurrence_type: 'weekly',
        is_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    saveRemindersToStorage(sampleReminders);
  }
};