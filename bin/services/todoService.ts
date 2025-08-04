import { Todo, Category, TodoStats, CreateTodoRequest, UpdateTodoRequest } from '../types/Todo';

const API_BASE = '/api';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
};

export const getAllTodos = async (): Promise<Todo[]> => {
  const response = await fetch(`${API_BASE}/todos`);
  return handleResponse(response);
};

export const getTodoById = async (id: string): Promise<Todo> => {
  const response = await fetch(`${API_BASE}/todos/${id}`);
  return handleResponse(response);
};

export const createTodo = async (todoData: CreateTodoRequest): Promise<Todo> => {
  const response = await fetch(`${API_BASE}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todoData),
  });
  return handleResponse(response);
};

export const updateTodo = async (id: string, updates: UpdateTodoRequest): Promise<Todo> => {
  const response = await fetch(`${API_BASE}/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  return handleResponse(response);
};

export const deleteTodo = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/todos/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

export const getTodosByDateRange = async (startDate: string, endDate: string): Promise<Todo[]> => {
  const response = await fetch(`${API_BASE}/todos/range/${startDate}/${endDate}`);
  return handleResponse(response);
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_BASE}/categories`);
  return handleResponse(response);
};

export const getStats = async (): Promise<TodoStats[]> => {
  const response = await fetch(`${API_BASE}/stats`);
  return handleResponse(response);
};