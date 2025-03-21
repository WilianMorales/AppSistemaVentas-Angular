import { Component, OnInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { ModalProductoComponent } from '../../modales/modal-producto/modal-producto.component';
import { Producto } from 'src/app/data/interfaces/producto';
import { ProductoService } from 'src/app/data/services/producto.service';
import { UtilidadService } from 'src/app/shared/utilidad.service';

import { TableColumn } from '../../components/material-table/table-column.model.';
import { TableAction } from '../../components/material-table/table-actions.model';
import { TABLE_ACTION } from '../../components/material-table/table-actions.enum';

import Swal from 'sweetalert2';
import { finalize, delay } from 'rxjs';
import { ActionButton } from '../../components/material-table/material-table.component';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  showFilter: boolean = true;  // Controla si se muestra el filtro
  currentFilterValue: string = '';  // Valor actual del filtro

  dataListaProducto = new MatTableDataSource<Producto>();
  isLoading: boolean = true;

  columnasTabla: TableColumn[] = [
    { def: 'nombre', label: 'Nombre', dataKey: 'nombre' },
    { def: 'descripcionCategoria', label: 'Categoría', dataKey: 'descripcionCategoria' },
    { def: 'stock', label: 'Stock', dataKey: 'stock' },
    { def: 'precio', label: 'Precio', dataKey: 'precio' },
    { def: 'esActivo', label: 'Activo', dataKey: 'esActivo' }
  ]

  actions: ActionButton[] = [
      { action: TABLE_ACTION.EDIT, label: 'Editar', icon: 'edit', color: 'primary'},
      { action: TABLE_ACTION.DELETE, label: 'Eliminar', icon: 'delete', color: 'warn' }
    ];

  tableConfig = {
    showFilter: true,
    isPaginable: true,
    showActions: true,
  };

  constructor(
    private _dialog: MatDialog,
    private _productoService: ProductoService,
    private _utilidadService: UtilidadService,
  ) { }

  ngOnInit(): void {
    this.obtenerProductos();
  }

  aplicarFiltroTabla(filterValue: string): void {
    this.currentFilterValue = filterValue;
  }

  obtenerProductos(): void {

    this._productoService.getAllProductos()
     .pipe(
        delay(1000),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: (data) => {
          if (data.status) {
            this.dataListaProducto.data = data.value;
          } else {
            Swal.fire('Oops!', 'No se encontraron datos', 'error');
          }
        },
        error: () => {
          this._utilidadService.mostrarAlerta('Hubo un error al obtener los productos', 'error');
        }
      });
  }

  nuevoProducto() {
    this._dialog.open(ModalProductoComponent, {
      disableClose: true,
    })
      .afterClosed()
      .subscribe((resultado) => resultado && this.obtenerProductos());
  }

  // Maneja las acciones de la tabla
  onAction(event: TableAction): void {
    switch (event.action) {
      case TABLE_ACTION.EDIT:
        this.editarProducto(event.row);
        break;
      case TABLE_ACTION.DELETE:
        this.eliminarProducto(event.row);
        break;
      default:
        break;
    }
  }

  editarProducto(producto: Producto) {
    this._dialog.open(ModalProductoComponent, {
      data: producto,
      disableClose: true,
    })
      .afterClosed()
      .subscribe((resultado) => resultado && this.obtenerProductos());
  }

  eliminarProducto(_producto: Producto) {
    Swal.fire({
      title: '¿Estás seguro de eliminar este Producto?',
      text: _producto.nombre,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar!',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((res) => {
      if (res.isConfirmed) {
        this._productoService.eliminarProducto(_producto.idProducto).subscribe({
          next: (data) => {
            this._utilidadService.mostrarAlerta(
              data.status ? 'El producto fue eliminado' : 'No se pudo eliminar el producto',
              data.status ? 'Success!' : 'Error'
            );
            if (data.status) this.obtenerProductos();
          },
          error: () => {
            this._utilidadService.mostrarAlerta('Hubo un error al eliminar el producto', 'Error');
          }
        });
      }
    })
  }
}
