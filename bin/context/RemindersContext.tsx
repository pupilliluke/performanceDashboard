import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Reminder, CreateReminderRequest, UpdateReminderRequest } from '../types/Todo';
import * as remindersService from '../services/remindersService';

interface RemindersState {
  reminders: Reminder[];
  loading: boolean;
  error: string | null;
}

type RemindersAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_REMINDERS'; payload: Reminder[] }
  | { type: 'ADD_REMINDER'; payload: Reminder }
  | { type: 'UPDATE_REMINDER'; payload: Reminder }
  | { type: 'DELETE_REMINDER'; payload: string };

const initialState: RemindersState = {
  reminders: [],
  loading: false,
  error: null,
};

const remindersReducer = (state: RemindersState, action: RemindersAction): RemindersState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_REMINDERS':
      return { ...state, reminders: action.payload, loading: false };
    case 'ADD_REMINDER':
      return { ...state, reminders: [action.payload, ...state.reminders] };
    case 'UPDATE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.map(reminder =>
          reminder.id === action.payload.id ? action.payload : reminder
        ),
      };
    case 'DELETE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.filter(reminder => reminder.id !== action.payload),
      };
    default:
      return state;
  }
};

interface RemindersContextType {
  state: RemindersState;
  actions: {
    loadReminders: () => Promise<void>;
    createReminder: (reminderData: CreateReminderRequest) => Promise<Reminder>;
    updateReminder: (id: string, updates: UpdateReminderRequest) => Promise<Reminder>;
    deleteReminder: (id: string) => Promise<void>;
  };
}

const RemindersContext = createContext<RemindersContextType | undefined>(undefined);

export const useReminders = () => {
  const context = useContext(RemindersContext);
  if (context === undefined) {
    throw new Error('useReminders must be used within a RemindersProvider');
  }
  return context;
};

interface RemindersProviderProps {
  children: React.ReactNode;
}

export const RemindersProvider: React.FC<RemindersProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(remindersReducer, initialState);

  const loadReminders = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      const reminders = await remindersService.getAllReminders();
      dispatch({ type: 'SET_REMINDERS', payload: reminders });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load reminders';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  const createReminder = async (reminderData: CreateReminderRequest): Promise<Reminder> => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      const newReminder = await remindersService.createReminder(reminderData);
      dispatch({ type: 'ADD_REMINDER', payload: newReminder });
      return newReminder;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create reminder';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const updateReminder = async (id: string, updates: UpdateReminderRequest): Promise<Reminder> => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      const updatedReminder = await remindersService.updateReminder(id, updates);
      dispatch({ type: 'UPDATE_REMINDER', payload: updatedReminder });
      return updatedReminder;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update reminder';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const deleteReminder = async (id: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      await remindersService.deleteReminder(id);
      dispatch({ type: 'DELETE_REMINDER', payload: id });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete reminder';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  useEffect(() => {
    // Initialize sample data and load reminders
    remindersService.initializeReminders();
    loadReminders();
  }, []);

  const contextValue: RemindersContextType = {
    state,
    actions: {
      loadReminders,
      createReminder,
      updateReminder,
      deleteReminder,
    },
  };

  return (
    <RemindersContext.Provider value={contextValue}>
      {children}
    </RemindersContext.Provider>
  );
};