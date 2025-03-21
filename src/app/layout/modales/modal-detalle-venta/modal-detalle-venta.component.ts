import { Component, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Venta } from 'src/app/data/interfaces/venta';
import { DetalleVenta } from 'src/app/data/interfaces/detalle-venta';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumn } from '../../components/material-table/table-column.model.';

@Component({
  selector: 'app-modal-detalle-venta',
  templateUrl: './modal-detalle-venta.component.html',
  styleUrls: ['./modal-detalle-venta.component.css']
})
export class ModalDetalleVentaComponent implements OnInit {

  fechaRegistro: string = '';
  numeroDocumento: string = '';
  tipoPago: string = '';
  total: string = '';
  detalleVenta = new MatTableDataSource<DetalleVenta>([]);
  columnasTabla: TableColumn[]  = [
    { def: 'producto', label: 'Producto', dataKey: 'descripcionProducto' },
    { def: 'cantidad', label: 'Cant.', dataKey: 'cantidad' },
    { def: 'precio', label: 'Precio', dataKey: 'precioTexto' },
    { def: 'total', label: 'Total', dataKey: 'totalTexto' }
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public _dataVenta: Venta) {
    this.fechaRegistro = _dataVenta.fechaRegistro!;
    this.numeroDocumento = _dataVenta.numeroDocumento!;
    this.tipoPago = _dataVenta.tipoPago;
    this.total = _dataVenta.totalTexto;
    this.detalleVenta.data = _dataVenta.detalleVenta;
  }

  ngOnInit(): void {
  }

}
