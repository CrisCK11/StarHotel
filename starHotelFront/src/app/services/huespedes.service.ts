import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HuespedesService { 
  private baseUrl = environment.apiServicios;
  private huespedes = `${this.baseUrl}/huespedes`; 
  urlReporte = 'http://localhost:8080/api/huespedes/reporte'; 

  constructor(private http: HttpClient) { }

  listarHuespedes(): Observable<any> { 
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(this.huespedes, { headers }); 
  }

  listarHuespedPorId(id: number): Observable<any> { 
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.baseUrl}/huespedes/${id}`, { headers }); 
  }

  registrarHuesped(request: any): Observable<any> { 
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.baseUrl}/huespedes`, request, { headers }); 
  }

  editarHuesped(id: number, request: any): Observable<any> { 
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.put(`${this.huespedes}/${id}`, request, { headers }); 
  }

  eliminarHuesped(id: number): Observable<any> { 
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.delete(`${this.huespedes}/${id}`, { headers }); 
  }

  getData(): Observable<string> {
    const token = localStorage.getItem('token'); 
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(this.urlReporte, { headers, responseType: 'text' });
  }

}