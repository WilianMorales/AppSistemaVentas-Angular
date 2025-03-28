import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { ModalProductoComponent } from './modales/modal-producto/modal-producto.component';
import { ModalDetalleVentaComponent } from './modales/modal-detalle-venta/modal-detalle-venta.component';
import { MaterialTableComponent } from './components/material-table/material-table.component';
import { ColumnValuePipe } from './components/material-table/column-value.pipe';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { FilterInputComponent } from './components/filter-input/filter-input.component';
import { CardInfoComponent } from './components/card-info/card-info.component';

@NgModule({
  declarations: [
    LayoutComponent,
    DashboardComponent,
    UsuarioComponent,
    ProductoComponent,
    VentaComponent,
    ReporteComponent,
    HistorialVentaComponent,
    ModalUsuarioComponent,
    ModalProductoComponent,
    ModalDetalleVentaComponent,
    MaterialTableComponent,
    ColumnValuePipe,
    LoadingSpinnerComponent,
    FilterInputComponent,
    CardInfoComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule
  ]
})
export class LayoutModule { }
