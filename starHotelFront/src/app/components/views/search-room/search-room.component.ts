import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HabitacionesService } from 'src/app/services/habitaciones.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-search-room',
  templateUrl: './search-room.component.html',
  styleUrls: ['./search-room.component.css'],
})
export class SearchRoomComponent implements OnInit {
  formFiltrado: FormGroup;
  today: string; // Propiedad para la fecha mínima

  constructor(
    private _habitacionService: HabitacionesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.setTodayDate(); // Establecer la fecha de hoy
  }

  initForm() {
    this.formFiltrado = new FormGroup({
      capacidad: new FormControl(null, [Validators.required]),
      fechaEntrada: new FormControl(null, [Validators.required]),
      fechaSalida: new FormControl(null, [Validators.required]),
    });
  }

  setTodayDate() {
    const todayDate = new Date(); // Obtener la fecha de hoy
    this.today = todayDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  }

  buscarHabitaciones() {
    if (this.formFiltrado.valid) {
      const { capacidad, fechaEntrada, fechaSalida } = this.formFiltrado.value;

      const fechaEntradaDate = new Date(fechaEntrada);
      const fechaSalidaDate = new Date(fechaSalida);

      this._habitacionService
        .filtrarHabitaciones(capacidad, fechaEntradaDate, fechaSalidaDate)
        .subscribe(
          (data: any) => {
            console.log('DATA: ', data);
            if (data.habitaciones && data.habitaciones.length > 0) {
              this._habitacionService.setHabitacionesFiltradas(data.habitaciones);
              this.router.navigate(['/rooms/filter'], {
                queryParams: {
                  capacidad: capacidad,
                  fechaIni: fechaEntradaDate.toISOString(),
                  fechaFin: fechaSalidaDate.toISOString(),
                },
              });
              localStorage.setItem(
                'fechas',
                JSON.stringify({
                  fechaIni: fechaEntradaDate.toISOString(),
                  fechaFin: fechaSalidaDate.toISOString(),
                })
              );
            } else {
              Swal.fire({
                icon: 'info',
                title: 'Sin Disponibilidad',
                text: 'No hay habitaciones disponibles con la capacidad o fechas seleccionadas.',
                confirmButtonText: 'Aceptar',
              });
            }
          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Datos incompletos',
        text: 'Por favor, coloca todos los datos necesarios.',
        confirmButtonText: 'Aceptar',
      });
      console.error('Por favor, completa todos los datos necesarios.');
    }
  }
}