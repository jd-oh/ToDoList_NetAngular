import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TodoService } from './todo.service';
import { TodoItem, CreateTodoItem, UpdateTodoItem, Dashboard } from '../models/todo.model';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;

  const mockTodos: TodoItem[] = [
    { id: 1, title: 'Task 1', description: 'Desc 1', isCompleted: false, createdAt: '2024-01-01', completedAt: null },
    { id: 2, title: 'Task 2', description: 'Desc 2', isCompleted: true, createdAt: '2024-01-02', completedAt: '2024-01-03' }
  ];

  const mockDashboard: Dashboard = {
    totalTasks: 10,
    completedTasks: 5,
    pendingTasks: 5
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoService]
    });
    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return all todos', () => {
      service.getAll().subscribe(todos => {
        expect(todos.length).toBe(2);
        expect(todos).toEqual(mockTodos);
      });

      const req = httpMock.expectOne('http://localhost:5000/api/todos');
      expect(req.request.method).toBe('GET');
      req.flush(mockTodos);
    });

    it('should return filtered todos when filter is provided', () => {
      service.getAll('completed').subscribe(todos => {
        expect(todos).toEqual(mockTodos);
      });

      const req = httpMock.expectOne('http://localhost:5000/api/todos?filter=completed');
      expect(req.request.method).toBe('GET');
      req.flush(mockTodos);
    });
  });

  describe('getById', () => {
    it('should return a todo by id', () => {
      service.getById(1).subscribe(todo => {
        expect(todo).toEqual(mockTodos[0]);
      });

      const req = httpMock.expectOne('http://localhost:5000/api/todos/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockTodos[0]);
    });
  });

  describe('create', () => {
    it('should create a new todo', () => {
      const newTodo: CreateTodoItem = { title: 'New Task', description: 'New Description' };
      const createdTodo: TodoItem = { ...mockTodos[0], ...newTodo };

      service.create(newTodo).subscribe(todo => {
        expect(todo.title).toBe(newTodo.title);
      });

      const req = httpMock.expectOne('http://localhost:5000/api/todos');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newTodo);
      req.flush(createdTodo);
    });
  });

  describe('update', () => {
    it('should update an existing todo', () => {
      const updateData: UpdateTodoItem = { title: 'Updated Task', description: 'Updated', isCompleted: true };

      service.update(1, updateData).subscribe(todo => {
        expect(todo.title).toBe(updateData.title);
      });

      const req = httpMock.expectOne('http://localhost:5000/api/todos/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush({ ...mockTodos[0], ...updateData });
    });
  });

  describe('delete', () => {
    it('should delete a todo', () => {
      service.delete(1).subscribe();

      const req = httpMock.expectOne('http://localhost:5000/api/todos/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('toggleComplete', () => {
    it('should toggle todo completion status', () => {
      const toggledTodo = { ...mockTodos[0], isCompleted: true };

      service.toggleComplete(1).subscribe(todo => {
        expect(todo.isCompleted).toBe(true);
      });

      const req = httpMock.expectOne('http://localhost:5000/api/todos/1/toggle');
      expect(req.request.method).toBe('PATCH');
      req.flush(toggledTodo);
    });
  });

  describe('getDashboard', () => {
    it('should return dashboard statistics', () => {
      service.getDashboard().subscribe(dashboard => {
        expect(dashboard).toEqual(mockDashboard);
      });

      const req = httpMock.expectOne('http://localhost:5000/api/todos/dashboard');
      expect(req.request.method).toBe('GET');
      req.flush(mockDashboard);
    });
  });
});
