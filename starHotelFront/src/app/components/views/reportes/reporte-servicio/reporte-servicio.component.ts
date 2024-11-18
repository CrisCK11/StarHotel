import { Component, OnInit } from '@angular/core';
import { ServiciosService } from 'src/app/services/servicios.service'; // Cambiado a ServiciosService

@Component({
  selector: 'app-reporte-servicio', // Cambiado a reporte-servicio
  templateUrl: './reporte-servicio.component.html', // Cambiado a reporte-servicio
  styleUrls: ['./reporte-servicio.component.css'] // Cambiado a reporte-servicio
})
export class ReporteServicioComponent implements OnInit { // Cambiado a ReporteServicioComponent
  base64data: string | undefined;

  constructor(private serviciosService: ServiciosService) {} // Cambiado a ServiciosService

  ngOnInit(): void {
    this.serviciosService.getData().subscribe((data) => { // Cambiado a getData de ServiciosService
      this.base64data = data;
    });
  }

  private b64toBlob(b64Data: string, contentType: string): Blob {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    const sliceSize = 512;

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  getImage() {
    if (this.base64data) {
      const blob = this.b64toBlob(this.base64data, 'application/pdf');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'reporte-servicio.pdf'; // Cambiado a reporte-servicio
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }
}