import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter-input',
  templateUrl: './filter-input.component.html',
  styleUrls: ['./filter-input.component.css']
})
export class FilterInputComponent {
  @Input() showFilter: boolean = false;
  @Output() filtroAplicado: EventEmitter<string> = new EventEmitter<string>();

  // Método que emite el valor del filtro cuando el usuario escribe
  onFilterChange(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filtroAplicado.emit(filterValue);
  }
}
