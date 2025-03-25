import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ResponseApi } from '../interfaces/response-api';
import { Login } from '../interfaces/login';
import { Usuario } from '../interfaces/usuario';
import { UtilidadService } from 'src/app/shared/utilidad.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private _urlApi: string = environment.endPoint + "Usuario/";

  constructor(
    private http: HttpClient,
    private utilidadService: UtilidadService
  ) { }

  iniciarSesion(request: Login): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this._urlApi}login`, request)
      .pipe(
        catchError(err => {
          this.utilidadService.mostrarAlerta('Error en el login', 'Error!');
          return throwError(() => err);
        })
      );
  }

  getUsuarios(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this._urlApi}lista`);
  }

  guardarUsuario(request: Usuario): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this._urlApi}guardar`, request);
  }

  editarUsuario(request: Usuario): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this._urlApi}editar`, request);
  }

  eliminarUsuario(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this._urlApi}eliminar/${id}`);
  }

}
