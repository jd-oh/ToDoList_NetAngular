import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.token();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout();
          this.notificationService.error('Sesión expirada. Por favor, inicie sesión nuevamente.');
        } else if (error.status === 403) {
          this.notificationService.error('No tiene permisos para realizar esta acción.');
        } else if (error.status === 0) {
          this.notificationService.error('Error de conexión. Verifique su conexión a internet.');
        } else if (error.status >= 500) {
          this.notificationService.error('Error del servidor. Intente más tarde.');
        }

        return throwError(() => error);
      })
    );
  }
}
