import { Component, Input } from '@angular/core';

@Component({
  selector: 'loading-spinner',
  template: `
    <div *ngIf="isLoading" class="loading-container">
      <p>Cargando datos</p> <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
    </div>
  `,
  styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent {
  @Input() isLoading: boolean = false; // Esta entrada controla la visibilidad del componente
}
