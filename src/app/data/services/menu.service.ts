import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ResponseApi } from '../interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private _urlApi: string = environment.endPoint + "Menu/";

  constructor(private http: HttpClient) { }

  getLista(idUsuario: number): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this._urlApi}lista?idUsuario=${idUsuario}`);
  }

}
