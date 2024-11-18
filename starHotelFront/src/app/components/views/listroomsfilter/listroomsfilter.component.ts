import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HabitacionesService } from 'src/app/services/habitaciones.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listroomsfilter',
  templateUrl: './listroomsfilter.component.html',
  styleUrls: ['./listroomsfilter.component.css'],
})
export class ListroomsfilterComponent implements OnInit {
  habitaciones: any[] = [];
  capacidad: number;
  fechaEntrada: Date;
  fechaSalida: Date;
  fechaEntradaPasada: string;
  fechaSalidaPasada: string;
  diasHospedaje: number;

  constructor(
    private _habitacionService: HabitacionesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.capacidad = +params['capacidad'];
      this.fechaEntrada = new Date(params['fechaIni']);
      this.fechaSalida = new Date(params['fechaFin']);

      if (this.capacidad && this.fechaEntrada && this.fechaSalida) {

        if (this.fechaEntrada < this.fechaSalida) {
          this._habitacionService
            .filtrarHabitaciones(
              this.capacidad,
              this.fechaEntrada,
              this.fechaSalida
            )
            .subscribe(
              (data: any) => {
                this.habitaciones = data.habitaciones;

   
                if (this.habitaciones.length > 0) {
      
                  this.calcularDiasHospedaje();
                } else {
      
                  console.warn('No hay habitaciones disponibles para la búsqueda.');
                }
              },
              (error) => {
                console.error('Error al obtener habitaciones filtradas:', error);
              }
            );
        } else {
    
          Swal.fire({
            title: 'Error',
            text: 'La fecha de entrada debe ser anterior a la de salida.',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
          });
          console.error('La fecha de entrada debe ser anterior a la de salida.');
        }
      } else {
        console.error('No se proporcionaron todos los parámetros necesarios.');
      }
    });

    this.cargarFechasDesdeLocalStorage();
  }

  cargarFechasDesdeLocalStorage() {
    const fechas = localStorage.getItem('fechas');
    if (fechas) {
      const parsedFechas = JSON.parse(fechas);
      this.fechaEntradaPasada = new Date(parsedFechas.fechaIni).toISOString().split('T')[0];
      this.fechaSalidaPasada = new Date(parsedFechas.fechaFin).toISOString().split('T')[0];
    }
  }

  calcularDiasHospedaje() {
    const diferenciaMilisegundos = this.fechaSalida.getTime() - this.fechaEntrada.getTime();
    this.diasHospedaje = diferenciaMilisegundos / (1000 * 60 * 60 * 24);


    if (this.diasHospedaje < 1) {

      Swal.fire({
        title: 'Error',
        text: 'La duración mínima de estadía es de 1 día.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      this.diasHospedaje = 1; // Día mínimo
    }

    localStorage.setItem('diasHospedaje', JSON.stringify(this.diasHospedaje));
  }
}