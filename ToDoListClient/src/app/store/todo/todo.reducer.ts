import { createReducer, on } from '@ngrx/store';
import { TodoItem, Dashboard, TodoFilter } from '../../core/models/todo.model';
import * as TodoActions from './todo.actions';

export interface TodoState {
  todos: TodoItem[];
  dashboard: Dashboard | null;
  currentFilter: TodoFilter;
  loading: boolean;
  error: string | null;
}

export const initialState: TodoState = {
  todos: [],
  dashboard: null,
  currentFilter: 'all',
  loading: false,
  error: null
};

export const todoReducer = createReducer(
  initialState,

  // Load todos
  on(TodoActions.loadTodos, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({
    ...state,
    todos,
    loading: false
  })),
  on(TodoActions.loadTodosFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Create todo
  on(TodoActions.createTodo, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TodoActions.createTodoSuccess, (state, { todo }) => ({
    ...state,
    todos: [todo, ...state.todos],
    loading: false,
    dashboard: state.dashboard ? {
      ...state.dashboard,
      totalTasks: state.dashboard.totalTasks + 1,
      pendingTasks: state.dashboard.pendingTasks + 1
    } : null
  })),
  on(TodoActions.createTodoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update todo
  on(TodoActions.updateTodo, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TodoActions.updateTodoSuccess, (state, { todo }) => {
    const oldTodo = state.todos.find(t => t.id === todo.id);
    let dashboard = state.dashboard;

    if (dashboard && oldTodo) {
      if (oldTodo.isCompleted !== todo.isCompleted) {
        dashboard = {
          ...dashboard,
          completedTasks: todo.isCompleted ? dashboard.completedTasks + 1 : dashboard.completedTasks - 1,
          pendingTasks: todo.isCompleted ? dashboard.pendingTasks - 1 : dashboard.pendingTasks + 1
        };
      }
    }

    return {
      ...state,
      todos: state.todos.map(t => t.id === todo.id ? todo : t),
      dashboard,
      loading: false
    };
  }),
  on(TodoActions.updateTodoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Delete todo
  on(TodoActions.deleteTodo, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TodoActions.deleteTodoSuccess, (state, { id }) => {
    const deletedTodo = state.todos.find(t => t.id === id);
    let dashboard = state.dashboard;

    if (dashboard && deletedTodo) {
      dashboard = {
        ...dashboard,
        totalTasks: dashboard.totalTasks - 1,
        completedTasks: deletedTodo.isCompleted ? dashboard.completedTasks - 1 : dashboard.completedTasks,
        pendingTasks: deletedTodo.isCompleted ? dashboard.pendingTasks : dashboard.pendingTasks - 1
      };
    }

    return {
      ...state,
      todos: state.todos.filter(t => t.id !== id),
      dashboard,
      loading: false
    };
  }),
  on(TodoActions.deleteTodoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Toggle todo
  on(TodoActions.toggleTodo, (state) => ({
    ...state,
    error: null
  })),
  on(TodoActions.toggleTodoSuccess, (state, { todo }) => {
    const oldTodo = state.todos.find(t => t.id === todo.id);
    let dashboard = state.dashboard;

    if (dashboard && oldTodo) {
      dashboard = {
        ...dashboard,
        completedTasks: todo.isCompleted ? dashboard.completedTasks + 1 : dashboard.completedTasks - 1,
        pendingTasks: todo.isCompleted ? dashboard.pendingTasks - 1 : dashboard.pendingTasks + 1
      };
    }

    return {
      ...state,
      todos: state.todos.map(t => t.id === todo.id ? todo : t),
      dashboard
    };
  }),
  on(TodoActions.toggleTodoFailure, (state, { error }) => ({
    ...state,
    error
  })),

  // Load dashboard
  on(TodoActions.loadDashboard, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TodoActions.loadDashboardSuccess, (state, { dashboard }) => ({
    ...state,
    dashboard,
    loading: false
  })),
  on(TodoActions.loadDashboardFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Set filter
  on(TodoActions.setFilter, (state, { filter }) => ({
    ...state,
    currentFilter: filter
  })),

  // Clear error
  on(TodoActions.clearError, (state) => ({
    ...state,
    error: null
  }))
);
