import { Component, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Venta } from 'src/app/data/interfaces/venta';
import { DetalleVenta } from 'src/app/data/interfaces/detalle-venta';

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
  detalleVenta: DetalleVenta[] = [];
  columnasTabla: string[] = ['producto', 'cantidad', 'precio', 'total'];

  constructor(@Inject(MAT_DIALOG_DATA) public _dataVenta: Venta) {
    this.fechaRegistro = _dataVenta.fechaRegistro!;
    this.numeroDocumento = _dataVenta.numeroDocumento!;
    this.tipoPago = _dataVenta.tipoPago;
    this.total = _dataVenta.totalTexto;
    this.detalleVenta = _dataVenta.detalleVenta;
  }

  ngOnInit(): void {
  }

}
