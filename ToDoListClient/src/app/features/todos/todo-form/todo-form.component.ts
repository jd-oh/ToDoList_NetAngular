import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TodoItem, CreateTodoItem, UpdateTodoItem } from '../../../core/models/todo.model';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.css'
})
export class TodoFormComponent implements OnInit {
  @Input() todo?: TodoItem;
  @Output() submitTodo = new EventEmitter<CreateTodoItem | UpdateTodoItem>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  isEditMode = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.isEditMode = !!this.todo;
    this.form = this.fb.group({
      title: [this.todo?.title || '', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]],
      description: [this.todo?.description || '', [Validators.maxLength(1000)]],
      isCompleted: [this.todo?.isCompleted || false]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
      return;
    }

    const formValue = this.form.value;

    if (this.isEditMode) {
      const updateData: UpdateTodoItem = {
        title: formValue.title.trim(),
        description: formValue.description?.trim() || undefined,
        isCompleted: formValue.isCompleted
      };
      this.submitTodo.emit(updateData);
    } else {
      const createData: CreateTodoItem = {
        title: formValue.title.trim(),
        description: formValue.description?.trim() || undefined
      };
      this.submitTodo.emit(createData);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  get title() { return this.form.get('title'); }
  get description() { return this.form.get('description'); }
}
