import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Sesion } from '../data/interfaces/sesion';

@Injectable({
  providedIn: 'root'
})
export class UtilidadService {

  constructor( private _snackBar: MatSnackBar ) { }

  mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    })
  }

  guardarSesionUsuario(userSession: Sesion) {
    localStorage.setItem('usuario', JSON.stringify(userSession));
  }

  obtenerSesionUsuario() {
    const dataCadena = localStorage.getItem('usuario');
    const usuario = JSON.parse(dataCadena!);
    return usuario;
  }

  eliminarSesionUsuario() {
    localStorage.removeItem('usuario');
  }
}
