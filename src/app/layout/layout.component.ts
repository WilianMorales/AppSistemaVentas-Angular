import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from '../data/interfaces/menu';
import { MenuService } from './../data/services/menu.service';
import { UtilidadService } from '../shared/utilidad.service';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  listaMenus: Menu[] = [];
  correoUsuario: string = '';
  rolUsuario: string = '';
  nombre: string = '';
  isMobile: boolean = false;
  isSidebarOpen: boolean = true; // Controla si el sidebar está abierto en escritorio
  @ViewChild('sidenav') sidenav!: MatSidenav;  // Referencia al sidenav

  constructor(
    private _breakpointObserver: BreakpointObserver,
    private _router: Router,
    private _menuService: MenuService,
    private _utilidadService: UtilidadService,
  ) { }

  ngOnInit() {
    this.obtenerResponsive();
    this.obtenerUsuario();
  }

  obtenerResponsive(): void {
    this._breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe(result => {
        this.isMobile = result.matches;
        if (this.isMobile) {
          this.isSidebarOpen = false; // En móviles, cerramos el sidenav por defecto
        }
      });
  }

  obtenerUsuario(): void {
    const usuario = this._utilidadService.obtenerSesionUsuario();

    if (usuario) {
      this.correoUsuario = usuario.email;
      this.rolUsuario = usuario.rolDescripcion;
      this.nombre = usuario.nombre;

      this._menuService.getLista(usuario.idUsuario)
        .subscribe({
          next: (data) => {
            if (data.status) this.listaMenus = data.value;
          },
          error: () => {
            console.error('Error al obtener los menus');
          }
        });
    } else {
      console.warn('Usuario no encontrado o no autenticado');
      this._router.navigate(['login']);
    }
  }

  // Método para cerrar el sidenav en móvil al hacer clic en un ítem del menú
  onMenuItemClick(): void {
    if (this.isMobile) {
      this.sidenav.close();  // Cierra el sidenav en dispositivos móviles
    }
  }

  // Método para abrir el menú del usuario cuando se hace clic en el icono

  logout(): void {
    this._utilidadService.eliminarSesionUsuario();
    this._router.navigate(['login']);
  }

}
