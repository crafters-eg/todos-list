import { Todo } from '@/components/todos-components/todo-app';

// API base URL
const API_URL = '/api/todos';

// Fetch all todos
export async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch(API_URL);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch todos');
  }
  
  const data = await response.json();
  
  // Convert ISO date strings to Date objects and MongoDB _id to id
  return data.map((todo: any) => ({
    ...todo,
    id: todo._id,
    date: new Date(todo.date),
    createdAt: new Date(todo.createdAt)
  }));
}

// Create a new todo
export async function createTodo(todo: Omit<Todo, 'id' | 'completed' | 'createdAt'>): Promise<Todo> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create todo');
  }
  
  const data = await response.json();
  
  // Convert ISO date strings to Date objects and MongoDB _id to id
  return {
    ...data,
    id: data._id,
    date: new Date(data.date),
    createdAt: new Date(data.createdAt)
  };
}

// Update a todo
export async function updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update todo');
  }
  
  const data = await response.json();
  
  // Convert ISO date strings to Date objects and MongoDB _id to id
  return {
    ...data,
    id: data._id,
    date: new Date(data.date),
    createdAt: new Date(data.createdAt)
  };
}

// Delete a todo
export async function deleteTodo(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete todo');
  }
} 