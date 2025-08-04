export interface Todo {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  category: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  parent_id?: string;
  order_index?: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface TodoStats {
  status: string;
  priority: string;
  category: string;
  count: number;
  date: string;
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  reminder_date: string;
  reminder_time: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  is_recurring: boolean;
  recurrence_type?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateReminderRequest {
  title: string;
  description?: string;
  reminder_date: string;
  reminder_time: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  is_recurring?: boolean;
  recurrence_type?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface UpdateReminderRequest {
  title?: string;
  description?: string;
  reminder_date?: string;
  reminder_time?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  is_recurring?: boolean;
  recurrence_type?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  is_completed?: boolean;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'in_progress' | 'completed';
  category?: string;
  due_date?: string;
  parent_id?: string;
  order_index?: number;
  created_at?: string;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'in_progress' | 'completed';
  category?: string;
  due_date?: string;
  parent_id?: string;
  order_index?: number;
  created_at?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  isPinned: boolean;
  labels: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteRequest {
  title: string;
  content?: string;
  color?: string;
  isPinned?: boolean;
  labels?: string[];
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  color?: string;
  isPinned?: boolean;
  labels?: string[];
}