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

    return displayValue;
  }
}
