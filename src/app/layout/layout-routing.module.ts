import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { ProductoComponent } from './pages/producto/producto.component';
import { VentaComponent } from './pages/venta/venta.component';
import { HistorialVentaComponent } from './pages/historial-venta/historial-venta.component';
import { ReporteComponent } from './pages/reporte/reporte.component';

import { authGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
      { path: 'usuarios', component: UsuarioComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
      { path: 'productos', component: ProductoComponent, canActivate: [authGuard], data: { roles: ['Administrador', 'Supervisor'] } },
      { path: 'venta', component: VentaComponent, canActivate: [authGuard], data: { roles: ['Administrador','Empleado', 'Supervisor'] } },
      { path: 'historial-venta', component: HistorialVentaComponent, canActivate: [authGuard], data: { roles: ['Administrador','Empleado', 'Supervisor'] } },
      { path: 'reportes', component: ReporteComponent, canActivate: [authGuard], data: { roles: ['Administrador', 'Supervisor'] } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
