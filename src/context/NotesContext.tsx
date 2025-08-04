import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../types/Todo';
import * as notesService from '../services/notesService';

interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
}

type NotesAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_NOTES'; payload: Note[] }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: string };

const initialState: NotesState = {
  notes: [],
  loading: false,
  error: null,
};

const notesReducer = (state: NotesState, action: NotesAction): NotesState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_NOTES':
      return { ...state, notes: action.payload, loading: false };
    case 'ADD_NOTE':
      return { ...state, notes: [action.payload, ...state.notes] };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload.id ? action.payload : note
        ),
      };
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload),
      };
    default:
      return state;
  }
};

interface NotesContextType {
  state: NotesState;
  actions: {
    loadNotes: () => Promise<void>;
    createNote: (noteData: CreateNoteRequest) => Promise<Note>;
    updateNote: (id: string, updates: UpdateNoteRequest) => Promise<Note>;
    deleteNote: (id: string) => Promise<void>;
  };
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

interface NotesProviderProps {
  children: React.ReactNode;
}

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  const loadNotes = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      const notes = await notesService.getAllNotes();
      dispatch({ type: 'SET_NOTES', payload: notes });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load notes';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  const createNote = async (noteData: CreateNoteRequest): Promise<Note> => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      const newNote = await notesService.createNote(noteData);
      dispatch({ type: 'ADD_NOTE', payload: newNote });
      return newNote;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create note';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const updateNote = async (id: string, updates: UpdateNoteRequest): Promise<Note> => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      const updatedNote = await notesService.updateNote(id, updates);
      dispatch({ type: 'UPDATE_NOTE', payload: updatedNote });
      return updatedNote;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update note';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const deleteNote = async (id: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      await notesService.deleteNote(id);
      dispatch({ type: 'DELETE_NOTE', payload: id });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete note';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  useEffect(() => {
    // Initialize sample data and load notes
    notesService.initializeNotes();
    loadNotes();
  }, []);

  const contextValue: NotesContextType = {
    state,
    actions: {
      loadNotes,
      createNote,
      updateNote,
      deleteNote,
    },
  };

  return (
    <NotesContext.Provider value={contextValue}>
      {children}
    </NotesContext.Provider>
  );
};