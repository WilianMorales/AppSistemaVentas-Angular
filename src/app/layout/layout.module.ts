import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../material/material.module';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { ProductoComponent } from './pages/producto/producto.component';
import { VentaComponent } from './pages/venta/venta.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { HistorialVentaComponent } from './pages/historial-venta/historial-venta.component';
import { ModalUsuarioComponent } from './modales/modal-usuario/modal-usuario.component';

@NgModule({
  declarations: [
    LayoutComponent,
    DashboardComponent,
    UsuarioComponent,
    ProductoComponent,
    VentaComponent,
    ReporteComponent,
    HistorialVentaComponent,
    ModalUsuarioComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class LayoutModule { }
