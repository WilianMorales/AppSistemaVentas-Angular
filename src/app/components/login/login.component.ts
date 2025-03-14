import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/data/interfaces/login';
import { UsuarioService } from 'src/app/data/services/usuario.service';
import { UtilidadService } from 'src/app/shared/utilidad.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  ocultarPassword: boolean = true;
  mostrarLoading: boolean = false;

  formLogin: FormGroup = this._fb.group({
    email: ['demo@test.com', [Validators.required, Validators.email]],
    password: ['123456', Validators.required]
  });

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ) { }

  iniciarSesion() {
    this.mostrarLoading = true;

    const request: Login = {
      email: this.formLogin.value.email,
      clave: this.formLogin.value.password,
    };

    this._usuarioServicio.iniciarSesion(request).subscribe({
      next: (data) => {
        // Verificar si la respuesta del servicio es exitosa y redirecciona a la página principal.
        if (data.status) {
          // Almacenar la información del usuario en sesión.
          this._utilidadServicio.guardarSesionUsuario(data.value);
          Swal.fire({
            icon: 'success',
            position: 'center',
            title: 'Bienvenido',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
            width: 300,
          })
          this._router.navigate(["pages"]);
        } else {
          // Muestra alerta en caso de credenciales incorrectas.
          this._utilidadServicio.mostrarAlerta(data.msg, 'Opps!');
        }
      },
      complete: () => {
        this.mostrarLoading = false;
      },
      error: () => {
        this._utilidadServicio.mostrarAlerta('Hubo un error en el inicio de sesión', 'Error!');
      }
    });

  }

  logout = (): void => localStorage.clear()

}
