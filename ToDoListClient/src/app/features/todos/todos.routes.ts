import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const TODOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./todo-list/todo-list.component').then(m => m.TodoListComponent),
    canActivate: [authGuard]
  }
];
