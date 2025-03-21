import { Component, Input, OnInit, OnChanges, ViewChild, AfterViewInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TableColumn } from './table-column.model.';
import { TableConfig } from './table-config';
import { TableAction } from './table-actions.model';
import { TABLE_ACTION } from './table-actions.enum';

import { ColumnValuePipe } from './column-value.pipe';

export interface ActionButton {
  action: TABLE_ACTION;
  label: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-material-table',
  templateUrl: './material-table.component.html',
  styleUrls: ['./material-table.component.css']
})
export class MaterialTableComponent implements OnInit, OnChanges, AfterViewInit {
  dataSource = new MatTableDataSource<TableColumn>([]);
  tableDisplayColumns: string[] = [];
  tableColumns: TableColumn[] = [];
  tableConfig?: TableConfig;

  @Input() showNoDataRow: boolean = false;
  @Input() currentFilterValue: string = '';  // Recibimos el valor del filtro desde el componente padre

  @Input() actionButtons: ActionButton[] = [];

  // Usar setters para las entradas
  @Input() set data(data: any[]) {
    this.dataSource.data = data;
    this.dataSource.paginator = this.paginator;
  }

  @Input() set columns(columns: TableColumn[]) {
    this.tableColumns = columns;
    this.tableDisplayColumns = this.tableColumns.map((col) => col.def);
  }

  @Input() set config(config: TableConfig) {
    this.setConfig(config);
  }

  @Input() isProductTable: boolean = false; // Por defecto es falso, es decir, tabla normal

  @Output() action: EventEmitter<TableAction> = new EventEmitter();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private getColumnValue: ColumnValuePipe = new ColumnValuePipe();

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (data, sortHeaderId) => {
      const value = this.getValue(data, sortHeaderId);
      return typeof value === 'string' || typeof value === 'number' ? value : '';
    };

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) {
      this.setConfig(changes['config'].currentValue);
    }

    if (changes['currentFilterValue']) {
      this.aplicarFiltroTabla(this.currentFilterValue);
    }
  }

  setConfig(config: TableConfig): void {
    this.tableConfig = config;

    if (this.tableConfig?.showActions && !this.tableDisplayColumns.includes('actions')) {
      this.tableDisplayColumns.push('actions');
    }
  }

  getValue(element: any, columnName: string): string | number {
    const column = this.tableColumns.find(
      (col) => col.dataKey  === columnName
    ) as TableColumn;

    if (!column) return '';

    const value = this.getColumnValue.transform(element, column);

    return typeof value === 'string' || typeof value === 'number' ? value : '';
  }

  onAction(actionType: TABLE_ACTION, row: any) {
    const actionData: TableAction = {
      action: actionType, // Aquí usamos el tipo de enum correcto
      row,
    };

    // Emitimos la acción seleccionada
    this.action.emit(actionData);
  }

  aplicarFiltroTabla(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
