import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';

import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    { def: 'numeroDocumento', label: 'N° Doc.', dataKey: 'numeroDocumento' },
    { def: 'fechaRegistro', label: 'Fecha de registro', dataKey: 'fechaRegistro' },
    { def: 'tipoPago', label: 'Tipo de pago', dataKey: 'tipoPago' },
    { def: 'total', label: 'Total Venta', dataKey: 'totalVenta' },
    { def: 'producto', label: 'Producto', dataKey: 'producto' },
    { def: 'precio', label: 'Precio', dataKey: 'precio' },
    { def: 'cantidad', label: 'Cant.', dataKey: 'cantidad' },
    { def: 'totalProducto', label: 'Total producto', dataKey: 'total' }
  ];

  tableConfig = { isPaginable: true };

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
      error: () => {
        this._utilidadService.mostrarAlerta('Error al obtener el reporte', 'Oops!');
      }
    }
    );
  }

  private isFechaInvalida(fecha: any): boolean {
    return !moment(fecha).isValid();
  }

  exportExcel() {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataVentaReporte.data);

    XLSX.utils.book_append_sheet(wb, ws, 'Reporte de Venta');
    XLSX.writeFile(wb, 'Reporte_Ventas.xlsx');
  }

  exportPDF(): void {
    const pdf = new jsPDF();

    const tituloSistema = "APP Sistema de Ventas";
    const fechaGeneracion = `Fecha: ${moment().format('DD/MM/YYYY HH:mm:ss')}`;

    pdf.setFontSize(10);
    pdf.text(fechaGeneracion, 150, 10);

    pdf.setFontSize(18);
    pdf.text(tituloSistema, 14, 18);

    pdf.setFontSize(12);
    // Línea separadora
    pdf.setLineWidth(0.5);
    pdf.line(10, 26, 200, 26);

    pdf.text('Reporte de Ventas', 14, 34);

    autoTable(pdf, {
      head: [['N° Doc.', 'Fecha', 'Tipo Pago', 'Total Venta', 'Producto', 'Precio', 'Cant.', 'Total Producto']],
      body: this.dataVentaReporte.data.map(row => [
        row.numeroDocumento,
        row.fechaRegistro,
        row.tipoPago,
        row.totalVenta,
        row.producto,
        row.precio,
        row.cantidad,
        row.total
      ]),
      startY: 40
    });

    pdf.save('Reporte_Ventas.pdf');
  }

}
