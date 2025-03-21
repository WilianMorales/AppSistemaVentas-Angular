import { TABLE_ACTION } from "./table-actions.enum";

export interface TableAction {
  action: TABLE_ACTION;  // Usamos el tipo del enum TABLE_ACTION
  row: any;
}
