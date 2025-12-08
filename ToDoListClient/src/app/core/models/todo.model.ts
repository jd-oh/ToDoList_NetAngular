export interface TodoItem {
  id: number;
  title: string;
  description: string | null;
  isCompleted: boolean;
  createdAt: string;
  completedAt: string | null;
}

export interface CreateTodoItem {
  title: string;
  description?: string;
}

export interface UpdateTodoItem {
  title: string;
  description?: string;
  isCompleted: boolean;
}

export interface Dashboard {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

export type TodoFilter = 'all' | 'completed' | 'pending';
