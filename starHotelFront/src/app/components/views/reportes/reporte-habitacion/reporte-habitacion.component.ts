import { Component, OnInit } from '@angular/core';
import { HabitacionesService } from 'src/app/services/habitaciones.service';

@Component({
  selector: 'app-reporte-habitacion',
  templateUrl: './reporte-habitacion.component.html',
  styleUrls: ['./reporte-habitacion.component.css']
})
export class ReporteHabitacionComponent implements OnInit {
  base64data: string | undefined;

  constructor(private habitacionesService: HabitacionesService) {}

  ngOnInit(): void {
    this.habitacionesService.getData().subscribe((data) => {
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
      a.download = 'reporte-habitacion.pdf'; // Cambiado a "reporte-habitacion.pdf"
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }
}