import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { UtilidadService } from 'src/app/shared/utilidad.service';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private utilidadService: UtilidadService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.utilidadService.obtenerToken();

    // Validar si el token es válido antes de enviar la solicitud
    if (token && !this.utilidadService.validarToken()) {
      this.utilidadService.eliminarSesionUsuario();
      this.router.navigate(['login']);
      return throwError(() => new Error('Token inválido o expirado'));
    }

    // Si el token es válido, adjuntarlo a la solicitud
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req).pipe(
      catchError(err => {
        if (err.status === 401) {
          // Si el backend devuelve 401 (token expirado/no válido), cerrar sesión
          this.utilidadService.eliminarSesionUsuario();
          this.router.navigate(['login']);
        }
        return throwError(() => err);
      })
    );
  }
}
