import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalProductoComponent } from '../../modales/modal-producto/modal-producto.component';
import { Producto } from 'src/app/data/interfaces/producto';
import { ProductoService } from 'src/app/data/services/producto.service';
import { UtilidadService } from 'src/app/shared/utilidad.service';

import Swal from 'sweetalert2';
import { MatSort, SortDirection } from '@angular/material/sort';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit, AfterViewInit {

  columnasTabla: string[] = ['nombre', 'categoria', 'stock', 'precio', 'estado', 'acciones']
  dataListaProducto = new MatTableDataSource;
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog,
    private _productoService: ProductoService,
    private _utilidadService: UtilidadService,
  ) { }

  ngOnInit(): void {
    this.obtenerProductos();
  }

  ngAfterViewInit(): void {
    this.dataListaProducto.paginator = this.paginacionTabla;
    this.dataListaProducto.sort = this.sort;
  }

  obtenerProductos(): void {
    this._productoService.getAllProductos().subscribe({
      next: (data) => {
        if (data.status) {
          this.dataListaProducto.data = data.value;
        } else {
          Swal.fire('Oops!', 'No se encontraron datos', 'error');
        }
      },
      error: (error) => {
        this._utilidadService.mostrarAlerta('Hubo un error al obtener los productos', 'error');
      }
    });
  }

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaProducto.filter = filterValue.trim().toLocaleLowerCase();;
  }

  nuevoProducto() {
    const dialogRef = this._dialog.open(ModalProductoComponent, {
      disableClose: true, // No permite cerrar el diálogo haciendo clic fuera
    });

    // Maneja el resultado cuando el diálogo se cierra
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado === true) {
        this.obtenerProductos();
      }
    });
  }

  editarProducto(producto: Producto) {
    this._dialog.open(ModalProductoComponent, {
      data: producto,
      disableClose: true,
    }).afterClosed()
      .subscribe(resultado => {
        if (resultado === true) {
          this.obtenerProductos();
        }
      });
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
            if (data.status) {
              this._utilidadService.mostrarAlerta('El producto fue eliminado', 'Success!');
              this.obtenerProductos();
            } else {
              this._utilidadService.mostrarAlerta('No se pudo eliminar el producto', 'Error');
            }
          },
          error: (error) => {
            this._utilidadService.mostrarAlerta('Hubo un error al eliminar el producto', 'Error');
          }
        });
      }
    })
  }
}
