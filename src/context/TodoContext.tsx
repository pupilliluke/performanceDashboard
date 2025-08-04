import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Todo, Category, TodoStats, CreateTodoRequest, UpdateTodoRequest } from '../types/Todo';
import * as todoService from '../services/todoService';

interface TodoState {
  todos: Todo[];
  categories: Category[];
  stats: TodoStats[];
  loading: boolean;
  error: string | null;
}

type TodoAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TODOS'; payload: Todo[] }
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_STATS'; payload: TodoStats[] };

const initialState: TodoState = {
  todos: [],
  categories: [],
  stats: [],
  loading: false,
  error: null,
};

const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_TODOS':
      return { ...state, todos: action.payload, loading: false };
    case 'ADD_TODO':
      return { ...state, todos: [action.payload, ...state.todos] };
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? action.payload : todo
        ),
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    default:
      return state;
  }
};

interface TodoContextType {
  state: TodoState;
  actions: {
    fetchTodos: () => Promise<void>;
    createTodo: (todo: CreateTodoRequest) => Promise<void>;
    updateTodo: (id: string, updates: UpdateTodoRequest) => Promise<void>;
    deleteTodo: (id: string) => Promise<void>;
    fetchTodosByDateRange: (startDate: string, endDate: string) => Promise<Todo[]>;
    fetchCategories: () => Promise<void>;
    fetchStats: () => Promise<void>;
  };
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  const actions = {
    fetchTodos: async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        // For development - use mock data when API is not available
        const mockTodos = [
          {
            id: '1',
            title: 'Complete project setup',
            description: 'Set up the development environment and project structure',
            priority: 'high' as const,
            status: 'completed' as const,
            category: 'Development',
            due_date: '2024-01-15',
            created_at: '2024-01-10T10:00:00Z',
            updated_at: '2024-01-12T10:00:00Z',
            completed_at: '2024-01-12T15:30:00Z'
          },
          {
            id: '2',
            title: 'Design user interface',
            description: 'Create mockups and wireframes for the application',
            priority: 'medium' as const,
            status: 'in_progress' as const,
            category: 'Design',
            due_date: '2024-01-20',
            created_at: '2024-01-11T09:00:00Z',
            updated_at: '2024-01-11T09:00:00Z'
          },
          {
            id: '3',
            title: 'Write documentation',
            description: 'Create comprehensive documentation for the API',
            priority: 'low' as const,
            status: 'pending' as const,
            category: 'Documentation',
            due_date: '2024-01-25',
            created_at: '2024-01-12T14:00:00Z',
            updated_at: '2024-01-12T14:00:00Z'
          }
        ];
        
        try {
          const todos = await todoService.getAllTodos();
          dispatch({ type: 'SET_TODOS', payload: todos });
        } catch (error) {
          // Fallback to mock data when API is not available
          console.log('API not available, using mock data');
          dispatch({ type: 'SET_TODOS', payload: mockTodos });
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch todos' });
      }
    },

    createTodo: async (todoData: CreateTodoRequest) => {
      try {
        try {
          const newTodo = await todoService.createTodo(todoData);
          dispatch({ type: 'ADD_TODO', payload: newTodo });
        } catch (error) {
          // Fallback to mock creation when API is not available
          const mockTodo = {
            id: Date.now().toString(),
            title: todoData.title,
            description: todoData.description || '',
            priority: todoData.priority || 'medium' as const,
            status: todoData.status || 'pending' as const,
            category: todoData.category || 'General',
            due_date: todoData.due_date || undefined,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          dispatch({ type: 'ADD_TODO', payload: mockTodo });
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to create todo' });
      }
    },

    updateTodo: async (id: string, updates: UpdateTodoRequest) => {
      try {
        try {
          const updatedTodo = await todoService.updateTodo(id, updates);
          dispatch({ type: 'UPDATE_TODO', payload: updatedTodo });
        } catch (error) {
          // Fallback to mock update when API is not available
          const currentTodo = state.todos.find(todo => todo.id === id);
          if (currentTodo) {
            const updatedTodo = {
              ...currentTodo,
              ...updates,
              updated_at: new Date().toISOString(),
              ...(updates.status === 'completed' && !currentTodo.completed_at ? { completed_at: new Date().toISOString() } : {})
            };
            dispatch({ type: 'UPDATE_TODO', payload: updatedTodo });
          }
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to update todo' });
      }
    },

    deleteTodo: async (id: string) => {
      try {
        try {
          await todoService.deleteTodo(id);
          dispatch({ type: 'DELETE_TODO', payload: id });
        } catch (error) {
          // Fallback to mock delete when API is not available
          dispatch({ type: 'DELETE_TODO', payload: id });
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to delete todo' });
      }
    },

    fetchTodosByDateRange: async (startDate: string, endDate: string): Promise<Todo[]> => {
      try {
        return await todoService.getTodosByDateRange(startDate, endDate);
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch todos by date range' });
        return [];
      }
    },

    fetchCategories: async () => {
      try {
        const mockCategories = [
          { id: '1', name: 'Development', color: '#0078d4', created_at: '2024-01-01T00:00:00Z' },
          { id: '2', name: 'Design', color: '#d13438', created_at: '2024-01-01T00:00:00Z' },
          { id: '3', name: 'Documentation', color: '#107c10', created_at: '2024-01-01T00:00:00Z' },
          { id: '4', name: 'Testing', color: '#ff8c00', created_at: '2024-01-01T00:00:00Z' },
          { id: '5', name: 'General', color: '#8764b8', created_at: '2024-01-01T00:00:00Z' }
        ];
        
        try {
          const categories = await todoService.getCategories();
          dispatch({ type: 'SET_CATEGORIES', payload: categories });
        } catch (error) {
          console.log('API not available, using mock categories');
          dispatch({ type: 'SET_CATEGORIES', payload: mockCategories });
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch categories' });
      }
    },

    fetchStats: async () => {
      try {
        const stats = await todoService.getStats();
        dispatch({ type: 'SET_STATS', payload: stats });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch stats' });
      }
    },
  };

  useEffect(() => {
    actions.fetchTodos();
    actions.fetchCategories();
    actions.fetchStats();
  }, []);

  return (
    <TodoContext.Provider value={{ state, actions }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};