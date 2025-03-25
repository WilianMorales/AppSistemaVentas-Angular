import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Sesion } from '../data/interfaces/sesion';

import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UtilidadService {

  constructor(private _snackBar: MatSnackBar) { }

  mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    })
  }

  guardarSesionUsuario(userSession: Sesion) {
    localStorage.setItem('usuario', JSON.stringify(userSession));
    if (userSession.token) {
      localStorage.setItem('token', userSession.token); // Guarda el token
    }
  }

  obtenerSesionUsuario() {
    const dataCadena = localStorage.getItem('usuario');
    return dataCadena ? JSON.parse(dataCadena) : null;
  }

  obtenerRolUsuario(): string | null {
    const usuario = this.obtenerSesionUsuario();
    return usuario ? usuario.rolDescripcion : null; // Retorna el rol del usuario si existe
  }

  eliminarSesionUsuario() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  estaAutenticado(): boolean {
    const token = localStorage.getItem('token');
    return token !== null;  // Retorna true si el token existe
  }

  validarToken(): boolean {
    const token = this.obtenerToken();
    if (!token) return false;

    try {
      const decodedToken: any = jwtDecode(token);
      const exp = decodedToken.exp * 1000; // Convertir a milisegundos
      return Date.now() < exp; // Devuelve true si el token sigue siendo válido
    } catch (error) {
      return false;
    }
  }
}
