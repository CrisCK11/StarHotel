import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ServiciosService {
  private baseUrl = environment.apiServicios;
  private serviciosUrl = `${this.baseUrl}/servicios`;
  urlReporte = 'http://localhost:8080/api/servicios/reporte';

  constructor(private http: HttpClient) {}

  getServicios(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(this.serviciosUrl, { headers });
  }

  guardarServicios(request: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(this.serviciosUrl, request, { headers });
  }

  obtenerServicioPorId(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.serviciosUrl}/${id}`, { headers });
  }

  eliminarServicios(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.delete(`${this.serviciosUrl}/${id}`, { headers });
  }

  editarServicios(id: number, request: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.put(`${this.serviciosUrl}/${id}`, request, {
      headers,
    });
  }

  getData(): Observable<string> {
    const token = localStorage.getItem('token'); // Asegúrate de que el token esté disponible
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(this.urlReporte, { headers, responseType: 'text' });
  }
}
