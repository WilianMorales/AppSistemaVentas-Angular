import { Pipe, PipeTransform } from '@angular/core';
import { TableColumn } from './table-column.model.';

@Pipe({
  name: 'columnValue',
})
export class ColumnValuePipe implements PipeTransform {
  transform(row: any, column: TableColumn): unknown {
    let displayValue = row[column.dataKey];

    if (column.dataType === 'object') {
      const keys = column.dataKey.split('.'); // ✅ Asegura que divide bien la cadena
      let currentValue = row;

      keys.forEach((key) => {
        if (currentValue) {
          currentValue = currentValue[key];
        }
      });

      displayValue = currentValue;
    }

    // Verificamos si la columna es una de las que necesitan formateo
    const columnsToFormat = ['total', 'precio', 'precioTexto', 'totalTexto', 'totalProducto'];

    if (columnsToFormat.includes(column.def) && !isNaN(Number(displayValue)) && displayValue !== null && displayValue !== '') {
      let numValue = Number(displayValue);

      // Aseguramos que el número tenga 2 decimales y luego aplicamos el formato de coma
      let formattedValue = numValue.toFixed(2); // Mantiene siempre 2 decimales
      formattedValue = formattedValue.replace(',', '.');

      return formattedValue.replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    return displayValue;
  }
}
