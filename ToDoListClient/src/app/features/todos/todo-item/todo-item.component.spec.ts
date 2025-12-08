import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TodoItemComponent } from './todo-item.component';
import { TodoItem } from '../../../core/models/todo.model';

describe('TodoItemComponent', () => {
  let component: TodoItemComponent;
  let fixture: ComponentFixture<TodoItemComponent>;

  const mockTodo: TodoItem = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    isCompleted: false,
    createdAt: '2024-01-01T10:00:00Z',
    completedAt: null
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItemComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;
    component.todo = mockTodo;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display todo title', () => {
    const titleElement = fixture.nativeElement.querySelector('.todo-title');
    expect(titleElement.textContent).toContain(mockTodo.title);
  });

  it('should display todo description', () => {
    const descriptionElement = fixture.nativeElement.querySelector('.todo-description');
    expect(descriptionElement.textContent).toContain(mockTodo.description);
  });

  it('should emit toggle event when checkbox is clicked', () => {
    vi.spyOn(component.toggle, 'emit');
    component.onToggle();
    expect(component.toggle.emit).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should emit edit event when edit button is clicked', () => {
    vi.spyOn(component.edit, 'emit');
    component.onEdit();
    expect(component.edit.emit).toHaveBeenCalledWith(mockTodo);
  });

  it('should emit delete event when delete button is clicked', () => {
    vi.spyOn(component.delete, 'emit');
    component.onDelete();
    expect(component.delete.emit).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should format date correctly', () => {
    const formattedDate = component.formatDate(mockTodo.createdAt);
    expect(formattedDate).toBeTruthy();
    expect(typeof formattedDate).toBe('string');
  });

  it('should have completed class when todo is completed', () => {
    // Recreate component with completed todo
    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;
    component.todo = { ...mockTodo, isCompleted: true };
    fixture.detectChanges();
    
    const todoElement = fixture.nativeElement.querySelector('.todo-item');
    expect(todoElement.classList.contains('completed')).toBeTruthy();
  });

  it('should not have completed class when todo is not completed', () => {
    const todoElement = fixture.nativeElement.querySelector('.todo-item');
    expect(todoElement.classList.contains('completed')).toBeFalsy();
  });
});
