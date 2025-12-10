import { createAction, props } from '@ngrx/store';
import { TodoItem, CreateTodoItem, UpdateTodoItem, TodoFilter, Dashboard } from '../../core/models/todo.model';

// Load todos
export const loadTodos = createAction(
  '[Todo] Load Todos',
  props<{ filter?: TodoFilter }>()
);

export const loadTodosSuccess = createAction(
  '[Todo] Load Todos Success',
  props<{ todos: TodoItem[] }>()
);

export const loadTodosFailure = createAction(
  '[Todo] Load Todos Failure',
  props<{ error: string }>()
);

// Create todo
export const createTodo = createAction(
  '[Todo] Create Todo',
  props<{ todo: CreateTodoItem }>()
);

export const createTodoSuccess = createAction(
  '[Todo] Create Todo Success',
  props<{ todo: TodoItem }>()
);

export const createTodoFailure = createAction(
  '[Todo] Create Todo Failure',
  props<{ error: string }>()
);

// Update todo
export const updateTodo = createAction(
  '[Todo] Update Todo',
  props<{ id: number; todo: UpdateTodoItem }>()
);

export const updateTodoSuccess = createAction(
  '[Todo] Update Todo Success',
  props<{ todo: TodoItem }>()
);

export const updateTodoFailure = createAction(
  '[Todo] Update Todo Failure',
  props<{ error: string }>()
);

// Delete todo
export const deleteTodo = createAction(
  '[Todo] Delete Todo',
  props<{ id: number }>()
);

export const deleteTodoSuccess = createAction(
  '[Todo] Delete Todo Success',
  props<{ id: number }>()
);

export const deleteTodoFailure = createAction(
  '[Todo] Delete Todo Failure',
  props<{ error: string }>()
);

// Toggle todo completion
export const toggleTodo = createAction(
  '[Todo] Toggle Todo',
  props<{ id: number }>()
);

export const toggleTodoSuccess = createAction(
  '[Todo] Toggle Todo Success',
  props<{ todo: TodoItem }>()
);

export const toggleTodoFailure = createAction(
  '[Todo] Toggle Todo Failure',
  props<{ error: string }>()
);

// Load dashboard
export const loadDashboard = createAction('[Todo] Load Dashboard');

export const loadDashboardSuccess = createAction(
  '[Todo] Load Dashboard Success',
  props<{ dashboard: Dashboard }>()
);

export const loadDashboardFailure = createAction(
  '[Todo] Load Dashboard Failure',
  props<{ error: string }>()
);

// Set filter
export const setFilter = createAction(
  '[Todo] Set Filter',
  props<{ filter: TodoFilter }>()
);

// Clear error
export const clearError = createAction('[Todo] Clear Error');
