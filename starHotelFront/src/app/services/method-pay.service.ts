import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MethodPayService {
  private baseMetodoPago = environment.apiServicios;
  private metodoPago = `${this.baseMetodoPago}/pagos`;

  constructor(private http: HttpClient) {}

  registrarMetodoPago(request: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(this.metodoPago, request, { headers });
  }
}
