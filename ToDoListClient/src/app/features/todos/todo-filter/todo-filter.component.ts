import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoFilter, Dashboard } from '../../../core/models/todo.model';

// Angular Material
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-todo-filter',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatBadgeModule,
    MatIconModule
  ],
  templateUrl: './todo-filter.component.html',
  styleUrl: './todo-filter.component.css'
})
export class TodoFilterComponent {
  @Input() currentFilter: TodoFilter = 'all';
  @Input() dashboard: Dashboard | null = null;
  @Output() filterChange = new EventEmitter<TodoFilter>();

  filters: { value: TodoFilter; label: string }[] = [
    { value: 'all', label: 'Todas' },
    { value: 'pending', label: 'Pendientes' },
    { value: 'completed', label: 'Completadas' }
  ];

  onFilterClick(filter: TodoFilter): void {
    this.filterChange.emit(filter);
  }

  getCount(filter: TodoFilter): number {
    if (!this.dashboard) return 0;
    switch (filter) {
      case 'all': return this.dashboard.totalTasks;
      case 'completed': return this.dashboard.completedTasks;
      case 'pending': return this.dashboard.pendingTasks;
    }
  }
}
