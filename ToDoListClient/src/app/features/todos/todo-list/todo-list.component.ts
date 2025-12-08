import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoFilterComponent } from '../todo-filter/todo-filter.component';
import { AppState } from '../../../store/app.state';
import { loadTodos, loadDashboard, setFilter, createTodo, updateTodo, deleteTodo, toggleTodo } from '../../../store/todo/todo.actions';
import { selectFilteredTodos, selectTodosLoading, selectCurrentFilter, selectDashboard } from '../../../store/todo/todo.selectors';
import { TodoItem, CreateTodoItem, UpdateTodoItem, TodoFilter } from '../../../core/models/todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, TodoItemComponent, TodoFormComponent, TodoFilterComponent],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class TodoListComponent implements OnInit {
  private store = inject(Store<AppState>);

  todos = this.store.selectSignal(selectFilteredTodos);
  loading = this.store.selectSignal(selectTodosLoading);
  currentFilter = this.store.selectSignal(selectCurrentFilter);
  dashboard = this.store.selectSignal(selectDashboard);

  showForm = signal(false);
  editingTodo = signal<TodoItem | null>(null);

  ngOnInit(): void {
    this.store.dispatch(loadTodos({}));
    this.store.dispatch(loadDashboard());
  }

  onFilterChange(filter: TodoFilter): void {
    this.store.dispatch(setFilter({ filter }));
    this.store.dispatch(loadTodos({ filter }));
  }

  onCreateTodo(todo: CreateTodoItem): void {
    this.store.dispatch(createTodo({ todo }));
    this.showForm.set(false);
  }

  onUpdateTodo(data: { id: number; todo: CreateTodoItem | UpdateTodoItem }): void {
    const updateData: UpdateTodoItem = {
      title: data.todo.title,
      description: data.todo.description,
      isCompleted: 'isCompleted' in data.todo ? data.todo.isCompleted : false
    };
    this.store.dispatch(updateTodo({ id: data.id, todo: updateData }));
    this.editingTodo.set(null);
  }

  onDeleteTodo(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      this.store.dispatch(deleteTodo({ id }));
    }
  }

  onToggleTodo(id: number): void {
    this.store.dispatch(toggleTodo({ id }));
  }

  onEditTodo(todo: TodoItem): void {
    this.editingTodo.set(todo);
    this.showForm.set(false);
  }

  openForm(): void {
    this.showForm.set(true);
    this.editingTodo.set(null);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingTodo.set(null);
  }

  trackByTodoId(index: number, todo: TodoItem): number {
    return todo.id;
  }
}
