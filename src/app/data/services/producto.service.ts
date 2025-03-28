import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ResponseApi } from '../interfaces/response-api';
import { Producto } from '../interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private _urlApi: string = environment.endPoint + "Producto/";

  constructor(private http: HttpClient) { }

  getAllProductos(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this._urlApi}lista`);
  }

  guardaProducto(request: Producto): Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this._urlApi}guardar`, request);
  }

  editarProducto(request: Producto): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this._urlApi}editar`, request);
  }

  eliminarProducto(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this._urlApi}eliminar/${id}`);
  }

}
