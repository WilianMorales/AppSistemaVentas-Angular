import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';

import { ModalDetalleVentaComponent } from '../../modales/modal-detalle-venta/modal-detalle-venta.component';
import { Venta } from 'src/app/data/interfaces/venta';
import { VentaService } from 'src/app/data/services/venta.service';
import { UtilidadService } from 'src/app/shared/utilidad.service';

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
  selector: 'app-historial-venta',
  templateUrl: './historial-venta.component.html',
  styleUrls: ['./historial-venta.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS }
  ]
})
export class HistorialVentaComponent implements OnInit, AfterViewInit {
  formBusqueda: FormGroup;
  opcionesBusqueda = [
    { value: "fecha", descripcion: "Por fechas" },
    { value: "numeroVenta", descripcion: "Numero venta" }
  ];
  columnasTabla: string[] = ['fechaRegistro', 'numeroDocumento', 'tipoPago', 'total', 'accion'];
  // dataInicio: Venta[] = [];
  datosListaVenta = new MatTableDataSource<Venta>([]);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private _fb: FormBuilder,
    private _dialog: MatDialog,
    private _ventaService: VentaService,
    private _utilidadService: UtilidadService,
  ) {
    this.formBusqueda = this._fb.group({
      buscarPor: ['fecha'],
      numeroVenta: [''],
      fechaInicio: [''],
      fechaFin: ['']
    });
    this.setupFormListeners();
  }


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.datosListaVenta.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.datosListaVenta.filter = filterValue;
  }

  private setupFormListeners(): void {
    this.formBusqueda.get('buscarPor')?.valueChanges.subscribe(() => {
      this.formBusqueda.patchValue({
        numeroVenta: '',
        fechaInicio: '',
        fechaFin: ''
      }, { emitEvent: false }); // Evité llamadas repetitivas a métodos utilizando esta opcion
    });
  }

  buscarVentas(): void {
    const buscarPor = this.formBusqueda.value.buscarPor;
    const numeroVenta = this.formBusqueda.value.numeroVenta;

    let fechaInicio = '';
    let fechaFin = '';

    if (buscarPor === 'fecha') {
      fechaInicio = moment(this.formBusqueda.value.fechaInicio).format('DD/MM/YYYY');
      fechaFin = moment(this.formBusqueda.value.fechaFin).format('DD/MM/YYYY');

      console.log('Fecha Inicio:', fechaInicio);
      console.log('Fecha Fin:', fechaFin);

      if (fechaInicio === "Invalid date" || fechaFin === "Invalid date") {
        this._utilidadService.mostrarAlerta("Debe ingresar ambas fechas", "Oops!")
        return;
      }
    }

    this._ventaService.obtenerHistorial(buscarPor, numeroVenta, fechaInicio, fechaFin).subscribe({
      next: (data) => {
        if (data.status)
        {
          console.log(data.value);
          this.datosListaVenta.data = data.value;
        }
        else
          this._utilidadService.mostrarAlerta('No se encontraron datos', 'error');
      },
      error: () => {
        this._utilidadService.mostrarAlerta('Hubo un error al obtener los datos', 'error');
      }
    });
  }

  verDetalleVenta(venta: Venta): void {
    this._dialog.open(ModalDetalleVentaComponent, {
      width: '800px',
      data: venta,
      disableClose: true,
    });
  }
}
