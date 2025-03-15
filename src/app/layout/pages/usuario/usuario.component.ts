import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalUsuarioComponent } from '../../modales/modal-usuario/modal-usuario.component';
import { Usuario } from 'src/app/data/interfaces/usuario';
import { UsuarioService } from 'src/app/data/services/usuario.service';
import { UtilidadService } from 'src/app/shared/utilidad.service';
import { MatSort } from '@angular/material/sort';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, AfterViewInit {

  columnasTabla: string[] = ['nombre', 'email', 'rolDescripcion', 'estado', 'acciones']
  dataListaUsuario = new MatTableDataSource;
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ) { }

  ngOnInit(): void {
    this.obtenerUsuario();
  }

  ngAfterViewInit(): void {
    this.dataListaUsuario.paginator = this.paginacionTabla;
    this.dataListaUsuario.sort = this.sort;
  }

  obtenerUsuario() {
    this._usuarioServicio.getUsuarios().subscribe({
      next: (data) => {
        if (data.status) {
          this.dataListaUsuario.data = data.value;
        } else {
          this._utilidadServicio.mostrarAlerta('No se encontraron datos', 'Oops!');
        }
      },
      error: (error) => {
        this._utilidadServicio.mostrarAlerta('Hubo un error al obtener los usuarios', 'error');
      }
    });
  }

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaUsuario.filter = filterValue.trim().toLocaleLowerCase();;
  }

  nuevoUsuario() {
    const dialogRef = this._dialog.open(ModalUsuarioComponent, {
      disableClose: true, // No permite cerrar el diálogo haciendo clic fuera
    });

    // Maneja el resultado cuando el diálogo se cierra
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado === true) {
        this.obtenerUsuario();
      }
    });
  }

  editarUsuario(usuario: Usuario) {
    this._dialog.open(ModalUsuarioComponent, {
      data: usuario,
      disableClose: true,
    }).afterClosed()
     .subscribe(resultado => {
        if (resultado === true) {
          this.obtenerUsuario();
        }
      });
  }

  eliminarUsuario(_usuario: Usuario) {
    Swal.fire({
      title: '¿Estás seguro de eliminar este usuario?',
      text: _usuario.nombre,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar!',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((res) => {
      if (res.isConfirmed) {
        this._usuarioServicio.eliminarUsuario(_usuario.idUsuario).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilidadServicio.mostrarAlerta('Usuario eliminado correctamente', 'Success!');
              this.obtenerUsuario();
            } else {
              this._utilidadServicio.mostrarAlerta('Hubo un error al eliminar el usuario', 'Error');
            }
          },
          error: (error) => {
            this._utilidadServicio.mostrarAlerta('Hubo un error al eliminar el usuario', 'Error');
          }
        });
      }
    })
  }

}
