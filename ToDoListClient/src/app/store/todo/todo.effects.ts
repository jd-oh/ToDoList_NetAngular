import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { TodoService } from '../../core/services/todo.service';
import { NotificationService } from '../../core/services/notification.service';
import * as TodoActions from './todo.actions';

@Injectable()
export class TodoEffects {
  private actions$ = inject(Actions);
  private todoService = inject(TodoService);
  private notificationService = inject(NotificationService);

  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      exhaustMap(({ filter }) =>
        this.todoService.getAll(filter).pipe(
          map(todos => TodoActions.loadTodosSuccess({ todos })),
          catchError(error => of(TodoActions.loadTodosFailure({ 
            error: error.error?.message || 'Error al cargar las tareas' 
          })))
        )
      )
    )
  );

  createTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.createTodo),
      exhaustMap(({ todo }) =>
        this.todoService.create(todo).pipe(
          map(newTodo => TodoActions.createTodoSuccess({ todo: newTodo })),
          catchError(error => of(TodoActions.createTodoFailure({ 
            error: error.error?.message || 'Error al crear la tarea' 
          })))
        )
      )
    )
  );

  createTodoSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.createTodoSuccess),
      tap(() => this.notificationService.success('Tarea creada con éxito'))
    ),
    { dispatch: false }
  );

  updateTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.updateTodo),
      exhaustMap(({ id, todo }) =>
        this.todoService.update(id, todo).pipe(
          map(updatedTodo => TodoActions.updateTodoSuccess({ todo: updatedTodo })),
          catchError(error => of(TodoActions.updateTodoFailure({ 
            error: error.error?.message || 'Error al actualizar la tarea' 
          })))
        )
      )
    )
  );

  updateTodoSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.updateTodoSuccess),
      tap(() => this.notificationService.success('Tarea actualizada con éxito'))
    ),
    { dispatch: false }
  );

  deleteTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.deleteTodo),
      exhaustMap(({ id }) =>
        this.todoService.delete(id).pipe(
          map(() => TodoActions.deleteTodoSuccess({ id })),
          catchError(error => of(TodoActions.deleteTodoFailure({ 
            error: error.error?.message || 'Error al eliminar la tarea' 
          })))
        )
      )
    )
  );

  deleteTodoSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.deleteTodoSuccess),
      tap(() => this.notificationService.success('Tarea eliminada con éxito'))
    ),
    { dispatch: false }
  );

  toggleTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.toggleTodo),
      exhaustMap(({ id }) =>
        this.todoService.toggleComplete(id).pipe(
          map(todo => TodoActions.toggleTodoSuccess({ todo })),
          catchError(error => of(TodoActions.toggleTodoFailure({ 
            error: error.error?.message || 'Error al cambiar estado de la tarea' 
          })))
        )
      )
    )
  );

  toggleTodoSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.toggleTodoSuccess),
      tap(({ todo }) => {
        const message = todo.isCompleted ? 'Tarea marcada como completada' : 'Tarea marcada como pendiente';
        this.notificationService.success(message);
      })
    ),
    { dispatch: false }
  );

  loadDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadDashboard),
      exhaustMap(() =>
        this.todoService.getDashboard().pipe(
          map(dashboard => TodoActions.loadDashboardSuccess({ dashboard })),
          catchError(error => of(TodoActions.loadDashboardFailure({ 
            error: error.error?.message || 'Error al cargar el dashboard' 
          })))
        )
      )
    )
  );

  // Show error notifications
  showError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        TodoActions.loadTodosFailure,
        TodoActions.createTodoFailure,
        TodoActions.updateTodoFailure,
        TodoActions.deleteTodoFailure,
        TodoActions.toggleTodoFailure,
        TodoActions.loadDashboardFailure
      ),
      tap(({ error }) => this.notificationService.error(error))
    ),
    { dispatch: false }
  );
}
