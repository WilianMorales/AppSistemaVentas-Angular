import { Component } from '@angular/core';

@Component({
  selector: 'app-acceso-denegado',
  template: `
    <h2>Acceso Denegado</h2>
    <p>No tienes permisos para ver esta página.</p>
    <a routerLink="/pages">Volver al Inicio</a>
  `,
  styleUrls: ['./acceso-denegado.component.css']
})
export class AccesoDenegadoComponent {

}
