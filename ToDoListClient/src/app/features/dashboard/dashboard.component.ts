import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { loadDashboard, loadTodos } from '../../store/todo/todo.actions';
import { selectDashboard, selectTodosLoading, selectAllTodos } from '../../store/todo/todo.selectors';
import { Dashboard, TodoItem } from '../../core/models/todo.model';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatChipsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private store = inject(Store<AppState>);

  dashboard = this.store.selectSignal(selectDashboard);
  loading = this.store.selectSignal(selectTodosLoading);
  recentTodos = this.store.selectSignal(selectAllTodos);

  completionPercentage = computed(() => {
    const stats = this.dashboard();
    if (!stats || stats.totalTasks === 0) return 0;
    return Math.round((stats.completedTasks / stats.totalTasks) * 100);
  });

  ngOnInit(): void {
    this.store.dispatch(loadDashboard());
    this.store.dispatch(loadTodos({}));
  }
}
