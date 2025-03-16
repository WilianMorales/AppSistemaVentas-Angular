import { Component, OnDestroy, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { catchError, Subject, takeUntil, throwError } from 'rxjs';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { ProductoService } from 'src/app/data/services/producto.service';
import { VentaService } from 'src/app/data/services/venta.service';
import { UtilidadService } from 'src/app/shared/utilidad.service';

import { Producto } from 'src/app/data/interfaces/producto';
import { Venta } from 'src/app/data/interfaces/venta';
import { DetalleVenta } from 'src/app/data/interfaces/detalle-venta';
import { ResponseApi } from 'src/app/data/interfaces/response-api';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css'],
  providers: [DecimalPipe]  // Proveemos DecimalPipe solo en este componente
})
export class VentaComponent implements OnInit, OnDestroy {

  listaProductos: Producto[] = [];
  listaProductoFiltro: Producto[] = [];

  listaProductosVenta: DetalleVenta[] = [];
  bloquearBoton: boolean = false;

  productoSeleccionado!: Producto;
  tipoPagoPorDefecto: string = 'Efectivo';
  totalPagar: number = 0;

  formProductoVenta: FormGroup;

  private destroy$ = new Subject<void>();  // Usado para la limpieza de las suscripciones

  columnasTabla: string[] = ['producto', 'cantidad', 'precio', 'total', 'accion'];
  datosDetalleVenta = new MatTableDataSource(this.listaProductosVenta);

  constructor(
    private _fb: FormBuilder,
    private _productoService: ProductoService,
    private _ventaService: VentaService,
    private _utilidadService: UtilidadService,
    private decimalPipe: DecimalPipe
  ) {
    this.formProductoVenta = this._fb.group({
      producto: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]] // Validación cantidad > 0
    });
  }

  ngOnInit(): void {
    this.cargarProductos();
    this.buscarProductoFiltro();
  }

  ngOnDestroy(): void {
    // Limpiar todas las suscripciones al destruir el componente
    this.destroy$.next();
    this.destroy$.complete();
  }

  private cargarProductos(): void {
    this._productoService.getAllProductos().subscribe({
      next: (data) => this.procesarProductos(data),
      error: (e) => this.manejarError(e)
    });
  }

  private procesarProductos(data: ResponseApi): void {
    if (data?.status) {
      const lista = data.value as Producto[];
      this.listaProductos = lista.filter(p => p.esActivo === 1 && p.stock > 0);
    } else {
      this._utilidadService.mostrarAlerta('No se encontraron productos activos.', 'Información');
    }
  }

  private manejarError(error: Error): void {
    console.error('Error al cargar los productos:', error);
    this._utilidadService.mostrarAlerta('Error al cargar la lista de productos', 'Error!');
  }

  private buscarProductoFiltro(): void {
    this.formProductoVenta.get('producto')?.valueChanges
      .pipe(takeUntil(this.destroy$)) // Utiliza destroy$ para limpiar la suscripción
      .subscribe(value => {
        this.listaProductoFiltro = this.retornarProductosPorFiltro(value);
      });
  }

  retornarProductosPorFiltro(busqueda: string | { nombre: string }): Producto[] {
    // Convertir el buscado a lowercase para busqueda exacta en nombre y categoría.
    const valorBuscado = typeof busqueda === 'string'
      ? busqueda.toLocaleLowerCase()
      : busqueda?.nombre?.toLocaleLowerCase() || '';

    // Filtramos productos por nombre, categoría y estado (excluyendo los agotados)
    return this.listaProductos.filter(item =>
      (item.esActivo !== 0) &&
      (
        item.nombre.toLowerCase().includes(valorBuscado) ||
        item.descripcionCategoria?.toLowerCase().includes(valorBuscado)
      )
    );
  }

  mostrarProducto(producto: Producto): string {
    return producto.nombre;
  }

  productoParaVenta(event: MatAutocompleteSelectedEvent): void {
    this.productoSeleccionado = event.option.value;
  }

  agregarProductoVenta(): void {
    if (!this.productoSeleccionado) {
      this._utilidadService.mostrarAlerta('Debe seleccionar un producto.', 'Error!');
      return;
    }

    const cantidad: number = this.formProductoVenta.value.cantidad;
    const precio: number = parseFloat(this.productoSeleccionado.precio);
    const total: number = cantidad * precio;

    // Actualizamos el total a pagar
    this.totalPagar += total;

    // Verificar si la cantidad de venta es mayor al stock disponible
    if (cantidad > this.productoSeleccionado.stock) {
      Swal.fire({
        icon: 'warning',
        position: 'center',
        title: 'No hay suficiente stock en inventario!',
        timer: 2000,
        timerProgressBar: true,
      })
      return; // Detener la operación si no hay suficiente inventario
    }

    // Agregar producto a la lista
    const productoVenta: DetalleVenta = ({
      idProducto: this.productoSeleccionado.idProducto,
      descripcionProducto: this.productoSeleccionado.nombre,
      cantidad: cantidad,
      precioTexto: this.decimalPipe.transform(precio, '1.2-2') || '0.00',
      totalTexto: this.decimalPipe.transform(total, '1.2-2') || '0.00'
    })

    this.listaProductosVenta = [...this.listaProductosVenta, productoVenta];
    this.datosDetalleVenta.data = this.listaProductosVenta; // Actualizamos los datos de la tabla sin recrearla

    // Limpiamos el formulario
    this.formProductoVenta.patchValue({
      producto: '',
      cantidad: ''
    })
  }

  eliminarProducto(detalle: DetalleVenta): void {
    // Restamos el valor total del producto de la cantidad total a pagar
    const totalProducto = parseFloat(detalle.totalTexto);
    this.totalPagar -= totalProducto;

    // Filtramos la lista para eliminar el producto de la venta
    this.listaProductosVenta = this.listaProductosVenta.filter(p =>
      p.idProducto !== detalle.idProducto
    )

    // Actualizamos los datos de la tabla directamente
    this.datosDetalleVenta.data = this.listaProductosVenta;

    // Si la lista de productos está vacía, podemos resetear el total a pagar
    if (this.listaProductosVenta.length === 0) {
      this.totalPagar = 0;
    }
  }
  private actualizarStockProductos(): void {
    this.listaProductosVenta.forEach(productoVenta => {
      const producto = this.listaProductos.find(p => p.idProducto === productoVenta.idProducto);
      if (producto) {
        // Reducimos el stock del producto y Garantiza que no sea negativo
        producto.stock = Math.max(producto.stock - productoVenta.cantidad, 0);

        // Si el stock es 0, cambiamos el estado del producto a "agotado"
        if (producto.stock === 0) {
          producto.esActivo = 0;
        }

        // Llamada al servicio para actualizar el producto en el backend
        this._productoService.editarProducto(producto).subscribe({
          next: () => {
            this._utilidadService.mostrarAlerta('Stock actualizado del producto.', 'Éxito');
          },
          error: (err) => {
            this._utilidadService.mostrarAlerta('Hubo un error al actualizar algunos productos.', 'Error');
          }
        });
      }
    })
  }

  registrarVenta() {
    if (this.listaProductosVenta.length > 0) {
      this.bloquearBoton = true; // Bloqueamos el botón para evitar múltiples clics

      // Formateamos el total a pagar usando decimalPipe
      const totalPagarFormateado = this.decimalPipe.transform(this.totalPagar, '1.2-2') || '0.00';

      const request: Venta = {
        tipoPago: this.tipoPagoPorDefecto,
        totalTexto: totalPagarFormateado,
        detalleVenta: this.listaProductosVenta
      };

      this._ventaService.registarVenta(request).pipe(
        takeUntil(this.destroy$),  // Asegura que se complete antes de limpiar
        catchError((error) => {
          this._utilidadService.mostrarAlerta('Error al registrar la venta', 'Error');
          this.bloquearBoton = false;
          return throwError(() => error);  // Propaga el error
        })
      ).subscribe({
        next: (data) => {
          if (data.status) {
            // Actualizar stock y estado de los productos
            this.actualizarStockProductos();

            // Si la venta es exitosa, limpiamos los productos y el total
            this.totalPagar = 0.00;
            this.listaProductosVenta = [];
            this.datosDetalleVenta = new MatTableDataSource(this.listaProductosVenta);

            Swal.fire({
              icon: 'success',
              title: 'Venta registrada correctamente',
              text: `Numero de venta ${data.value.numeroDocumento}`,
              timer: 1500
            });
          } else {
            this._utilidadService.mostrarAlerta('No se pudo registrar la venta.', 'Oops!');
          }
        },
        complete: () => {
          this.bloquearBoton = false;
        }
      });
    }
  }

}
