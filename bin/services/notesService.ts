import { Note, CreateNoteRequest, UpdateNoteRequest } from '../types/Todo';

const NOTES_STORAGE_KEY = 'todopro_notes';

// For now, we'll use localStorage for persistence since there's no backend API
// In a real app, these would be API calls like the todoService

const getNotesFromStorage = (): Note[] => {
  try {
    const stored = localStorage.getItem(NOTES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading notes from storage:', error);
    return [];
  }
};

const saveNotesToStorage = (notes: Note[]): void => {
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Error saving notes to storage:', error);
  }
};

export const getAllNotes = async (): Promise<Note[]> => {
  // Simulate async API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getNotesFromStorage());
    }, 100);
  });
};

export const getNoteById = async (id: string): Promise<Note | null> => {
  const notes = getNotesFromStorage();
  return notes.find(note => note.id === id) || null;
};

export const createNote = async (noteData: CreateNoteRequest): Promise<Note> => {
  const notes = getNotesFromStorage();
  const newNote: Note = {
    id: Date.now().toString(),
    title: noteData.title,
    content: noteData.content || '',
    color: noteData.color || '#ffffff',
    isPinned: noteData.isPinned || false,
    labels: noteData.labels || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const updatedNotes = [newNote, ...notes];
  saveNotesToStorage(updatedNotes);
  return newNote;
};

export const updateNote = async (id: string, updates: UpdateNoteRequest): Promise<Note> => {
  const notes = getNotesFromStorage();
  const noteIndex = notes.findIndex(note => note.id === id);
  
  if (noteIndex === -1) {
    throw new Error('Note not found');
  }

  const updatedNote = {
    ...notes[noteIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  notes[noteIndex] = updatedNote;
  saveNotesToStorage(notes);
  return updatedNote;
};

export const deleteNote = async (id: string): Promise<void> => {
  const notes = getNotesFromStorage();
  const filteredNotes = notes.filter(note => note.id !== id);
  saveNotesToStorage(filteredNotes);
};

// Initialize with sample data if no notes exist
export const initializeNotes = (): void => {
  const existingNotes = getNotesFromStorage();
  if (existingNotes.length === 0) {
    const sampleNotes: Note[] = [
      {
        id: '1',
        title: 'Project Ideas',
        content: 'Build a task manager\nCreate a weather app\nDevelop a music player\nDesign a portfolio website',
        color: '#f3f9f1',
        isPinned: true,
        labels: ['development', 'ideas'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Shopping List',
        content: 'Milk\nBread\nEggs\nApples\nChicken\nRice',
        color: '#fff4e6',
        isPinned: false,
        labels: ['personal'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'Meeting Notes',
        content: 'Discussed Q4 goals\n- Increase productivity by 20%\n- Launch new feature\n- Improve user experience\n\nAction items:\n- Research competitors\n- Create mockups\n- Schedule user testing',
        color: '#e6f7ff',
        isPinned: false,
        labels: ['work', 'meetings'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    saveNotesToStorage(sampleNotes);
  }
};