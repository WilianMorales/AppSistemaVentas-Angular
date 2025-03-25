import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UtilidadService } from '../shared/utilidad.service';

export const loginGuard: CanActivateFn = () => {
  const router = inject(Router);
  const utilidadService = inject(UtilidadService);

  if (utilidadService.estaAutenticado()) {
    router.navigate(['/pages']);
    return false;
  }

  return true;
};
