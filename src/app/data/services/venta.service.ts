import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ResponseApi } from '../interfaces/response-api';
import { Venta } from '../interfaces/venta';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private _urlApi: string = environment.endPoint + "Venta/";

  constructor(private http: HttpClient) { }

  registarVenta(request: Venta): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this._urlApi}registrar`, request);
  }

  obtenerHistorial(
    buscarPor: string,
    numeroVenta: string,
    fechaIncio: string,
    fechaFin: string
  ): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(
      `${this._urlApi}historial?buscarPor=${buscarPor}&numeroVenta=${numeroVenta}&fechaIncio=${fechaIncio}&fechaFin=${fechaFin}`
    );
  }

  obtenerReporte(
    fechaIncio: string,
    fechaFin: string
  ): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(
      `${this._urlApi}reporte?fechaIncio=${fechaIncio}&fechaFin=${fechaFin}`
    );
  }

}
