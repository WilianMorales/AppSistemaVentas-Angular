import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';

import { ModalDetalleVentaComponent } from '../../modales/modal-detalle-venta/modal-detalle-venta.component';
import { Venta } from 'src/app/data/interfaces/venta';
import { VentaService } from 'src/app/data/services/venta.service';
import { UtilidadService } from 'src/app/shared/utilidad.service';
import { TableAction } from '../../components/material-table/table-actions.model';
import { TABLE_ACTION } from '../../components/material-table/table-actions.enum';
import { TableColumn } from '../../components/material-table/table-column.model.';
import { ActionButton } from '../../components/material-table/material-table.component';

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
export class HistorialVentaComponent implements OnInit {
  formBusqueda: FormGroup;
  showFilter: boolean = true;  // Controla si se muestra el filtro
  currentFilterValue: string = '';  // Valor actual del filtro
  // dataInicio: Venta[] = [];
  datosListaVenta = new MatTableDataSource<Venta>([]);

  opcionesBusqueda = [
    { value: "fecha", descripcion: "Por fechas" },
    { value: "numeroVenta", descripcion: "Numero venta" }
  ];

  columnasTabla: TableColumn[] = [
    { def: 'fechaRegistro', label: 'Fecha Registro', dataKey: 'fechaRegistro' },
    { def: 'numeroDocumento', label: 'Numero Documento', dataKey: 'numeroDocumento' },
    { def: 'tipoPago', label: 'Tipo Pago', dataKey: 'tipoPago' },
    { def: 'total', label: 'Total', dataKey: 'totalTexto' }
  ];

  actions : ActionButton[] = [
    { action: TABLE_ACTION.VIEW, label: 'Ver Detalle', icon: 'visibility', color: 'primary' }
  ];

  tableConfig = {
    showFilter: true,
    isPaginable: true,
    showActions: true,
  };

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

      if (fechaInicio === "Invalid date" || fechaFin === "Invalid date") {
        this._utilidadService.mostrarAlerta("Debe ingresar ambas fechas", "Oops!")
        return;
      }
    }

    this._ventaService.obtenerHistorial(buscarPor, numeroVenta, fechaInicio, fechaFin).subscribe({
      next: (data) => {
        if (data.status)
        {
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

  // Maneja las acciones de la tabla
    onAction(event: TableAction): void {
      switch (event.action) {
        case TABLE_ACTION.VIEW:
          this.verDetalleVenta(event.row);
          break;
        default:
          break;
      }
    }

  verDetalleVenta(venta: Venta): void {
    this._dialog.open(ModalDetalleVentaComponent, {
      width: '800px',
      data: venta,
      disableClose: true,
    });
  }
}
