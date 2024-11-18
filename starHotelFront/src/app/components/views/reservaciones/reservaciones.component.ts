import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReservacionesService } from 'src/app/services/reservaciones.service'; // Cambiar el nombre del servicio si es necesario
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-reservaciones',
  templateUrl: './reservaciones.component.html',
  styleUrls: ['./reservaciones.component.css'],
})
export class ReservacionesComponent implements OnInit {
  listaReservaciones: any[] = [];
  formReservaciones: FormGroup;
  title: any;
  nameBoton: any;
  id: number;

  constructor(private _reservacionesService: ReservacionesService) {} // Cambiar a un servicio relacionado a reservaciones

  ngOnInit(): void {
    this.obtenerReservaciones();
    this.initForm();
  }

  initForm() {
    this.formReservaciones = new FormGroup({
      fechaIni: new FormControl(null, [Validators.required]),
      fechaFin: new FormControl(null, [Validators.required]),
      totalPago: new FormControl(null, [Validators.required]),
      estadoReservacion: new FormControl(null, [Validators.required]),
      huesped: new FormGroup({
        idHuesped: new FormControl(null, [Validators.required]),
      }),
      habitacion: new FormGroup({
        idHabitacion: new FormControl(null, [Validators.required]),
      }),
      servicio: new FormGroup({
        id_servicio: new FormControl(null, [Validators.required]),
      }),
      
    });
  }

  obtenerReservaciones() {
    this._reservacionesService.getReservaciones().subscribe((data) => {
      this.listaReservaciones = data.reservaciones;
    });
  }

  cerrarModal() {
    const modalElement = document.getElementById('modalProducto');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }

  crearEditarReservaciones(boton: any) {
    if (boton == 'Guardar') {
      this.alertRegistro();
    } else {
      this.alertModificar();
    }
  }

  guardar(formulario: any): void {
    if (this.formReservaciones.valid) {
      this._reservacionesService.guardarReservaciones(formulario).subscribe(
        (response) => {
          this.cerrarModal();
          this.obtenerReservaciones();
          this.resetForm();
          console.log('Reservación registrada', response);
        },
        (error) => {
          console.log(formulario);
          console.error('Error al registrar reservación:', error);
        }
      );
    }
  }

  titulo(titulo: any, id: number): void {
    this.title = `${titulo} reservación`;
    titulo == 'Crear'
      ? (this.nameBoton = 'Guardar')
      : (this.nameBoton = 'Modificar');
    if (id !== null) {
      this.id = id;
      this.obtenerReservacionPorId(id);
    }
  }

  obtenerReservacionPorId(id: any) {
    let form = this.formReservaciones;

    this._reservacionesService.obtenerReservacionPorId(id).subscribe(
      (response) => {
        if (response) {
          console.log('DATA: ', response);

          form.controls['fechaIni'].setValue(response.reservacion.fechaIni || null);
          form.controls['fechaFin'].setValue(response.reservacion.fechaFin || null);
          form.controls['totalPago'].setValue(response.reservacion.totalPago || null);
          form.controls['estadoReservacion'].setValue(response.reservacion.estadoReservacion || null);
          form.controls['huesped'].get('idHuesped')?.setValue(response.reservacion.huesped?.idHuesped || null);
          form.controls['habitacion'].get('idHabitacion')?.setValue(response.reservacion.habitacion?.idHabitacion || null);
          form.controls['servicio'].get('id_servicio')?.setValue(response.reservacion.servicio?.id_servicio || null);
          
        } else {
          console.error('Error al obtener reservación por ID:', response);
        }
      },
      (error) => {
        console.error('Error al obtener reservación por ID:', error);
      }
    );
  }

  eliminarReservaciones(id: number): void {
    Swal.fire({
      title: '¿Deseas eliminar la reservación?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this._reservacionesService.eliminarReservaciones(id).subscribe(
          (response) => {
            Swal.fire(
              'Eliminado!',
              'La reservación ha sido eliminada con éxito.',
              'success'
            );
            this.obtenerReservaciones();
          },
          (error) => {
            const errorMsg =
              error?.message || 'No se pudo eliminar la reservación';
            Swal.fire('Error', errorMsg, 'error');
          }
        );
      }
    });
  }

  alertaExitosa(titulo: any) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Reservación ' + titulo + ' correctamente',
      showConfirmButton: false,
      timer: 1500,
    });
  }

  resetForm(): void {
    this.formReservaciones.reset();
  }

  alertRegistro() {
    if (this.formReservaciones.valid) {
      Swal.fire({
        title: '¿Deseas registrar la reservación?',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Si, confirmar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.guardar(this.formReservaciones.value);
          this.alertaExitosa('registrada');
        }
      });
    }
  }

  alertModificar() {
    if (this.formReservaciones.valid) {
      Swal.fire({
        title: '¿Deseas modificar la reservación?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si, confirmar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.editar(this.id, this.formReservaciones.value);
          this.alertaExitosa('modificada');
        }
      });
    }
  }

  editar(id: number, formulario: any): void {
    if (this.formReservaciones.valid) {
      this._reservacionesService.editarReservaciones(id, formulario).subscribe(
        (response) => {
          this.cerrarModal();
          this.obtenerReservaciones();
          this.resetForm();
          console.log('Reservación modificada', response);
        },
        (error) => {
          console.error('Error al modificar reservación', error);
        }
      );
    }
  }

  cerrarBoton() {
    this.resetForm();
    this.cerrarModal();
  }
}