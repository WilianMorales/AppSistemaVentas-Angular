import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UtilidadService } from '../shared/utilidad.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const utilidadService = inject(UtilidadService);

  if (!utilidadService.estaAutenticado() || !utilidadService.validarToken()) {
    utilidadService.eliminarSesionUsuario(); // Limpia la sesión si el token es inválido
    router.navigate(['login']);
    return false;
  }

  const rolUsuario = utilidadService.obtenerRolUsuario();
  const rolesPermitidos = route.data['roles'] as Array<string>;
  
  if (rolesPermitidos && !rolesPermitidos.includes(rolUsuario!)) {
    router.navigate(['/acceso-denegado']);
    return false;
  }

  return true;
};

