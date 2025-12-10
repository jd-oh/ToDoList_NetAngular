import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoState } from './todo.reducer';

export const selectTodoState = createFeatureSelector<TodoState>('todos');

export const selectAllTodos = createSelector(
  selectTodoState,
  (state) => state.todos
);

export const selectTodosLoading = createSelector(
  selectTodoState,
  (state) => state.loading
);

export const selectTodosError = createSelector(
  selectTodoState,
  (state) => state.error
);

export const selectDashboard = createSelector(
  selectTodoState,
  (state) => state.dashboard
);

export const selectCurrentFilter = createSelector(
  selectTodoState,
  (state) => state.currentFilter
);

export const selectFilteredTodos = createSelector(
  selectAllTodos,
  selectCurrentFilter,
  (todos, filter) => {
    switch (filter) {
      case 'completed':
        return todos.filter(t => t.isCompleted);
      case 'pending':
        return todos.filter(t => !t.isCompleted);
      default:
        return todos;
    }
  }
);

export const selectCompletedTodosCount = createSelector(
  selectAllTodos,
  (todos) => todos.filter(t => t.isCompleted).length
);

export const selectPendingTodosCount = createSelector(
  selectAllTodos,
  (todos) => todos.filter(t => !t.isCompleted).length
);
