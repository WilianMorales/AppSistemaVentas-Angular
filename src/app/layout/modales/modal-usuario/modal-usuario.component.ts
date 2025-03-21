import { Component, Inject, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Rol } from 'src/app/data/interfaces/rol';
import { Usuario } from 'src/app/data/interfaces/usuario';
import { RolService } from 'src/app/data/services/rol.service';
import { UsuarioService } from 'src/app/data/services/usuario.service';
import { UtilidadService } from 'src/app/shared/utilidad.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit {
  formUsuario: FormGroup = this._fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    idRol: ['', Validators.required],
    clave: ['', [Validators.required, Validators.minLength(6)]],
    esActivo: ['1', Validators.required]
  });

  ocultarPassword: boolean = true;
  tituloAccion: string = "Agregar";
  listaRoles: Rol[] = [];

  constructor(
    private _modalRef: MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public dataUsuario: Usuario,
    private _fb: FormBuilder,
    private _rolService: RolService,
    private _usuarioService: UsuarioService,
    private _utilidadService: UtilidadService
  ) {
    if (this.dataUsuario != null) {
      this.tituloAccion = "Editar";
    }

    this._rolService.getLista()
      .subscribe({
        next: (data) => {
          if (data.status) {
            this.listaRoles = data.value;
          } else {
            this._utilidadService.mostrarAlerta(data.msg, 'Opps!');
          }
        },
        error: (error) => {
          this._utilidadService.mostrarAlerta('Error al cargar los roles', 'error');
        }
      })
  }

  ngOnInit(): void {
    if (this.dataUsuario != null) {
      this.formUsuario.patchValue({
        nombre: this.dataUsuario.nombre,
        email: this.dataUsuario.email,
        idRol: this.dataUsuario.idRol,
        clave: this.dataUsuario.clave,
        esActivo: this.dataUsuario.esActivo.toString()
      });
    }
  }

  guardarEditar_Usuario() {
    const _usuario: Usuario = {
      idUsuario: this.dataUsuario == null ? 0 : this.dataUsuario.idUsuario,
      nombre: this.formUsuario.value.nombre,
      email: this.formUsuario.value.email,
      idRol: this.formUsuario.value.idRol,
      rolDescripcion: "",
      clave: this.formUsuario.value.clave,
      esActivo: parseInt(this.formUsuario.value.esActivo)
    };

    if (this.dataUsuario == null) {
      // Creando un nuevo usuario
      this._usuarioService.guardarUsuario(_usuario)
        .subscribe({
          next: (data) => {
            if (data.status) {
              Swal.fire({
                icon: 'success',
                position: 'center',
                title: 'El usuario fue registrado',
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false,
                width: 300,
              })
              this._modalRef.close(true);
            } else {
              this._utilidadService.mostrarAlerta("No se pudo registrar el Usuario", 'Error');
            }
          },
          error: (error) => {
            this._utilidadService.mostrarAlerta('Error al agregar el usuario', 'error');
          }
        });

    } else {
      // Editando un usuario existente
      this._usuarioService.editarUsuario(_usuario)
       .subscribe({
          next: (data) => {
            if (data.status) {
              Swal.fire({
                icon:'success',
                position: 'center',
                title: 'El usuario fue actualizado',
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false,
                width: 300,
              })
              this._modalRef.close(true);
            } else {
              this._utilidadService.mostrarAlerta("No se pudo actualizar el Usuario", 'Error');
            }
          },
          error: (error) => {
            this._utilidadService.mostrarAlerta('Error al editar el usuario', 'error');
          }
        });
    }
  }
}
