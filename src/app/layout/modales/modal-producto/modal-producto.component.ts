import { Component, Inject, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Categoria } from 'src/app/data/interfaces/categoria';
import { Producto } from 'src/app/data/interfaces/producto';
import { CategoriaService } from 'src/app/data/services/categoria.service';
import { ProductoService } from 'src/app/data/services/producto.service';
import { UtilidadService } from 'src/app/shared/utilidad.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.css']
})
export class ModalProductoComponent implements OnInit {

  formProducto: FormGroup = this._fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    idCategoria: ['', Validators.required],
    stock: ['', Validators.required],
    precio: ['', Validators.required],
    esActivo: ['1', Validators.required]
  });

  tituloAccion: string = "Agregar";
  listaCategorias: Categoria[] = [];

  constructor(
    private _fb: FormBuilder,
    private _modalRef: MatDialogRef<ModalProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public dataProducto: Producto,
    private _categoriaService: CategoriaService,
    private _productoService: ProductoService,
    private _utilidadService: UtilidadService
  ) {
    if (this.dataProducto != null) {
      this.tituloAccion = "Editar";
    }

    this._categoriaService.getAllCategorias()
      .subscribe({
        next: (data) => {
          if (data.status) {
            this.listaCategorias = data.value;
          } else {
            this._utilidadService.mostrarAlerta(data.msg, 'Oops!');
          }
        },
        error: (error) => {
          this._utilidadService.mostrarAlerta('Error al cargar las categorias', 'error');
        }
      })
  }

  ngOnInit(): void {

    if (this.dataProducto != null) {
      this.formProducto.patchValue({
        nombre: this.dataProducto.nombre,
        idCategoria: this.dataProducto.idCategoria,
        stock: this.dataProducto.stock,
        precio: this.dataProducto.precio,
        esActivo: this.dataProducto.esActivo.toString()
      });
    }
  }

  guardarEditar() {

    const _producto: Producto = {
      idProducto: this.dataProducto == null ? 0 : this.dataProducto.idProducto,
      nombre: this.formProducto.value.nombre,
      idCategoria: this.formProducto.value.idCategoria,
      descripcionCategoria: "",
      stock: this.formProducto.value.stock,
      precio: this.formProducto.value.precio,
      esActivo: parseInt(this.formProducto.value.esActivo)
    };

    if (this.dataProducto == null) {
      // Creando un nuevo usuario
      this._productoService.guardaProducto(_producto)
        .subscribe({
          next: (data) => {
            if (data.status) {
              Swal.fire({
                icon: 'success',
                position: 'center',
                title: 'El producto fue registrado!',
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false,
                width: 300,
              })
              this._modalRef.close(true);
            } else {
              this._utilidadService.mostrarAlerta("No se pudo registrar el Producto", 'Error');
            }
          },
          error: (error) => {
            this._utilidadService.mostrarAlerta('Error al agregar el producto', 'error');
          }
        });

    } else {
      // Editando un usuario existente
      this._productoService.editarProducto(_producto)
        .subscribe({
          next: (data) => {
            if (data.status) {
              Swal.fire({
                icon: 'success',
                position: 'center',
                title: 'El producto fue actualizado',
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false,
                width: 300,
              })
              this._modalRef.close(true);
            } else {
              this._utilidadService.mostrarAlerta("No se pudo actualizar el Producto", 'Error');
            }
          },
          error: (error) => {
            this._utilidadService.mostrarAlerta('Error al editar el Producto', 'error');
          }
        });
    }
  }

}
