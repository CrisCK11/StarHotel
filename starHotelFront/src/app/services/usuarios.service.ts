import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private baseUrl = environment.apiUrlBase;
  private usuarios = `${this.baseUrl}/usuarios`;
  urlReporte = 'http://localhost:8080/usuarios/reporte';


  constructor(private http: HttpClient) { }

  listarUsuarios(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(this.usuarios, { headers });
  }

  listarUsuarioPorId(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.baseUrl}/usuarios/${id}`, { headers });
  }

  registrarUsuario(request: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.baseUrl}/usuarios`, request, { headers });
  }

  editarUsuarios(id: number, request: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.put(`${this.usuarios}/${id}`, request, { headers });
  }

  eliminarUsuarios(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.delete(`${this.usuarios}/${id}`, { headers });
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
