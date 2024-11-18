import { Component, OnInit } from '@angular/core';
import { ReservacionesService } from 'src/app/services/reservaciones.service';

@Component({
  selector: 'app-reporte-reservaciones',
  templateUrl: './reporte-reservaciones.component.html',
  styleUrls: ['./reporte-reservaciones.component.css']
})
export class ReporteReservacionComponent implements OnInit {
  base64data: string | undefined;

  constructor(private reservacionesService: ReservacionesService) {}

  ngOnInit(): void {
    this.reservacionesService.getData().subscribe((data) => {
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
      a.download = 'reporte-reservacion.pdf'; // Cambiado a "reporte-reservacion.pdf"
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }
}