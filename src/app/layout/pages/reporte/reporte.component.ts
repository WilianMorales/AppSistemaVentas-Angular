import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';

import * as XLSX from 'xlsx';

import { Reporte } from 'src/app/data/interfaces/reporte';
import { VentaService } from 'src/app/data/services/venta.service';
import { UtilidadService } from 'src/app/shared/utilidad.service';
import { TableColumn } from '../../components/material-table/table-column.model.';

export const MY_DATA_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY'
  }
}

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS }
  ]
})
export class ReporteComponent {
  formFiltro: FormGroup;
  dataVentaReporte = new MatTableDataSource<Reporte>([]);

  columnasTabla: TableColumn[] = [
    { def: 'fechaRegistro', label: 'Fecha de registro', dataKey: 'fechaRegistro' },
    { def: 'numeroDocumento', label: 'Número de documento', dataKey: 'numeroDocumento' },
    { def: 'tipoPago', label: 'Tipo de pago', dataKey: 'tipoPago' },
    { def: 'total', label: 'Total', dataKey: 'totalVenta' },
    { def: 'producto', label: 'Producto', dataKey: 'producto' },
    { def: 'cantidad', label: 'Cantidad', dataKey: 'cantidad' },
    { def: 'precio', label: 'Precio', dataKey: 'precio' },
    { def: 'totalProducto', label: 'Total producto', dataKey: 'total' }
  ];

  tableConfig = {
    isPaginable: true,
  };

  constructor(
    private _fb: FormBuilder,
    private _ventaService: VentaService,
    private _utilidadService: UtilidadService
  ) {
    this.formFiltro = this._fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required]
    });
  }

  buscarVentas(): void {
    const { fechaInicio, fechaFin } = this.formFiltro.value;

    if (this.isFechaInvalida(fechaInicio) || this.isFechaInvalida(fechaFin)) {
      this._utilidadService.mostrarAlerta('Debe ingresar ambas fechas correctamente', 'Oops!');
      return;
    }

    const fechaInicioFormatted = moment(fechaInicio).format('DD/MM/YYYY');
    const fechaFinFormatted = moment(fechaFin).format('DD/MM/YYYY');

    this._ventaService.obtenerReporte(fechaInicioFormatted, fechaFinFormatted).subscribe({
      next: (data) => {
        if (data.status) {
          this.dataVentaReporte.data = data.value;
        } else {
          this.dataVentaReporte.data = [];
          this._utilidadService.mostrarAlerta('No se encontraron datos', 'Oops!');
        }
      },
      error: (e) => {
        this._utilidadService.mostrarAlerta('Error al obtener el reporte', 'Oops!');
      }
    }
    );
  }

  private isFechaInvalida(fecha: any): boolean {
    return moment(fecha).isValid() === false;
  }

  exportExcel() {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataVentaReporte.data);

    XLSX.utils.book_append_sheet(wb, ws, 'Reporte de Venta');
    XLSX.writeFile(wb, 'Reporte_Ventas.xlsx');
  }

}
