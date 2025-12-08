import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: { login: Mock };
  let notificationServiceMock: { success: Mock; error: Mock };
  let router: Router;

  beforeEach(async () => {
    authServiceMock = {
      login: vi.fn()
    };

    notificationServiceMock = {
      success: vi.fn(),
      error: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate');
    
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a login form with email and password fields', () => {
    expect(component.loginForm.contains('email')).toBeTruthy();
    expect(component.loginForm.contains('password')).toBeTruthy();
  });

  it('should require email', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('');
    expect(emailControl?.valid).toBeFalsy();
    expect(emailControl?.errors?.['required']).toBeTruthy();
  });

  it('should require valid email format', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();
    expect(emailControl?.errors?.['email']).toBeTruthy();
  });

  it('should require password', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('');
    expect(passwordControl?.valid).toBeFalsy();
    expect(passwordControl?.errors?.['required']).toBeTruthy();
  });

  it('should require password minimum length of 6', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('12345');
    expect(passwordControl?.valid).toBeFalsy();
    expect(passwordControl?.errors?.['minlength']).toBeTruthy();
  });

  it('should be valid when form is filled correctly', () => {
    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should not submit if form is invalid', () => {
    component.loginForm.setValue({
      email: '',
      password: ''
    });
    component.onSubmit();
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('should call authService.login on valid submit', () => {
    const credentials = { email: 'test@example.com', password: 'password123' };
    authServiceMock.login.mockReturnValue(of({
      token: 'jwt-token',
      email: credentials.email,
      name: 'Test User',
      userId: 1,
      expiresAt: '2024-12-31'
    }));

    component.loginForm.setValue(credentials);
    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith(credentials);
  });

  it('should navigate to dashboard on successful login', () => {
    authServiceMock.login.mockReturnValue(of({
      token: 'jwt-token',
      email: 'test@example.com',
      name: 'Test User',
      userId: 1,
      expiresAt: '2024-12-31'
    }));

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123'
    });
    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(notificationServiceMock.success).toHaveBeenCalledWith('¡Bienvenido!');
  });

  it('should show error notification on login failure', () => {
    authServiceMock.login.mockReturnValue(throwError(() => ({ error: { message: 'Invalid credentials' } })));

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'wrongpassword'
    });
    component.onSubmit();

    expect(notificationServiceMock.error).toHaveBeenCalledWith('Invalid credentials');
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword()).toBeFalsy();
    component.togglePassword();
    expect(component.showPassword()).toBeTruthy();
    component.togglePassword();
    expect(component.showPassword()).toBeFalsy();
  });
});
