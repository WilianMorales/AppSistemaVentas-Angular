import { Component, OnInit } from '@angular/core';
import { delay, finalize } from 'rxjs';

import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { ModalUsuarioComponent } from '../../modales/modal-usuario/modal-usuario.component';
import { Usuario } from 'src/app/data/interfaces/usuario';
import { UsuarioService } from 'src/app/data/services/usuario.service';
import { UtilidadService } from 'src/app/shared/utilidad.service';

import { TABLE_ACTION } from '../../components/material-table/table-actions.enum';
import { TableColumn } from '../../components/material-table/table-column.model.';
import { TableAction } from '../../components/material-table/table-actions.model';

import Swal from 'sweetalert2';
import { ActionButton } from '../../components/material-table/material-table.component';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  showFilter: boolean = true;  // Controla si se muestra el filtro
  currentFilterValue: string = '';  // Valor actual del filtro

  dataListaUsuario = new MatTableDataSource<Usuario>();
  isLoading: boolean = true;

  columnasTabla: TableColumn[] = [
    { def: 'nombre', label: 'Nombre Completo', dataKey: 'nombre' },
    { def: 'email', label: 'Email', dataKey: 'email' },
    { def: 'rolDescripcion', label: 'Rol', dataKey: 'rolDescripcion' },
    { def: 'esActivo', label: 'Estado', dataKey: 'esActivo' },
  ];

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
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ) { }

  ngOnInit(): void {
    this.obtenerUsuario();
  }

  aplicarFiltroTabla(filterValue: string): void {
    this.currentFilterValue = filterValue;
  }

  obtenerUsuario() {
    this._usuarioServicio.getUsuarios()
      .pipe(
        delay(1000),
        finalize(() => (this.isLoading = false)) // Manejo automático de carga
      )
      .subscribe({
        next: (data) => {
          if (data.status) {
            this.dataListaUsuario.data = data.value; // Asegura que se asigna correctamente
          } else {
            this._utilidadServicio.mostrarAlerta('No se encontraron datos', 'Oops!');
          }
        },
        error: () => {
          this._utilidadServicio.mostrarAlerta('Hubo un error al obtener los usuarios', 'error');
        }
      });
  }

  nuevoUsuario() {
    this._dialog.open(ModalUsuarioComponent, {
      disableClose: true // No permite cerrar el diálogo haciendo clic fuera
    })
      .afterClosed()
      .subscribe((resultado) => resultado && this.obtenerUsuario());
  }

  // Maneja las acciones de la tabla
  onAction(event: TableAction): void {
    switch (event.action) {
      case TABLE_ACTION.EDIT:
        this.editarUsuario(event.row);
        break;
      case TABLE_ACTION.DELETE:
        this.eliminarUsuario(event.row);
        break;
      default:
        break;
    }
  }

  editarUsuario(usuario: Usuario) {
    this._dialog.open(ModalUsuarioComponent, {
      data: usuario,
      disableClose: true,
    }).afterClosed()
      .subscribe((resultado) => resultado && this.obtenerUsuario());
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
        this._usuarioServicio.eliminarUsuario(_usuario.idUsuario)
          .subscribe({
            next: (data) => {
              this._utilidadServicio.mostrarAlerta(
                data.status ? 'Usuario eliminado correctamente' : 'Hubo un error al eliminar el usuario',
                data.status ? 'Success!' : 'Error'
              );
              if (data.status) this.obtenerUsuario();
            },
            error: () => {
              this._utilidadServicio.mostrarAlerta('Hubo un error al eliminar el usuario', 'Error');
            }
          });
      }
    })
  }
}
