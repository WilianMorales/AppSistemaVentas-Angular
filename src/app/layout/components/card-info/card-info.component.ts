import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-info',
  template: `
    <mat-card class="card-info">
      <mat-card-header>
        <div mat-card-avatar>
          <mat-icon [color]="iconColor">{{ icon }}</mat-icon>
        </div>
        <mat-card-title>{{ title }}</mat-card-title>
        <mat-card-subtitle>{{ subtitle }}</mat-card-subtitle>
      </mat-card-header>
    </mat-card>
  `,
  styleUrls: ['./card-info.component.css']
})
export class CardInfoComponent {
  @Input() icon: string = '';
  @Input() iconColor: string = 'accent';
  @Input() title: string = '';
  @Input() subtitle: string = '';
}
