import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HabitacionesService } from 'src/app/services/habitaciones.service';
import { MethodPayService } from 'src/app/services/method-pay.service';
import { ReservacionesService } from 'src/app/services/reservaciones.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  habitacion: any = {};
  diasHospedaje: number;
  reservaForm: FormGroup;
  listaServicios: any[] = [];
  totalPago: number;
  isSubmitting: boolean = false;
  huespedIDregistrado: number;
  formPayment: FormGroup;
  title: any;
  nameBoton: any;

  constructor(
    private _habitacionService: HabitacionesService,
    private _servicios: ServiciosService,
    private _reservasService: ReservacionesService,
    private route: ActivatedRoute,
    private router: Router,
    private _methodPayment: MethodPayService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idHabitacion = params.get('idHabitacion');
      this.obtenerHabitacion(parseInt(idHabitacion, 10));
    });

    var dias = localStorage.getItem('diasHospedaje');
    if (dias) {
      this.diasHospedaje = JSON.parse(dias);
    } else {
      console.log('No se encontró el valor para diasHospedaje en localStorage');
    }
    this.obtenerServicios();
    this.initForm();
    this.initFormPayment();
  }

  initForm() {
    this.reservaForm = new FormGroup({
      nombre: new FormControl(null, [Validators.required]),
      apellido: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      nombreuser: new FormControl(null, [Validators.required]),
      telefono: new FormControl(null, [Validators.required]),
      direccion: new FormControl(null, [Validators.required]),
      servicioId: new FormControl(null, [Validators.required]),
    });
  }

  initFormPayment() {
    this.formPayment = new FormGroup({
      metodoPago: new FormControl(null, [Validators.required]),
      titularTarjeta: new FormControl(null, [Validators.required]),
      numeroTarjeta: new FormControl(null, [Validators.required]),
      montoPagado: new FormControl(null, [Validators.required]),
      fechaPago: new FormControl(null, [Validators.required]),
    });
  }

  obtenerServicios() {
    this._servicios.getServicios().subscribe((data) => {
      this.listaServicios = data.servicios;
    });
  }

  obtenerHabitacion(id: number) {
    this._habitacionService.obtenerHabitacionPorId(id).subscribe((data) => {
      this.habitacion = data?.habitacion;
    });
  }

  calcularTotalPagoHabitacionReserva(idServicio: number) {
    let precioHabitacion = this.habitacion.precioPorNoche;

    if (idServicio) {
      this._servicios.obtenerServicioPorId(idServicio).subscribe(
        (data) => {
          let precioDelServicioSeleccionado = data.servicio.precio;
          this.totalPago =
            precioHabitacion +
            precioDelServicioSeleccionado * this.diasHospedaje;
        },
        (error) => {
          console.error('Error al obtener el precio del servicio', error);
        }
      );
    } else {
      console.warn('No se ha seleccionado ningún servicio.');
      this.totalPago = precioHabitacion * this.diasHospedaje;
    }
  }

  onSelectServicio(event: any) {
    let id = this.reservaForm.controls['servicioId'].value;
    this.calcularTotalPagoHabitacionReserva(id);
  }

  grabarReserva() {
    let fechasLocalStorage = localStorage.getItem('fechas');
    let fechaEntrada = JSON.parse(fechasLocalStorage).fechaIni;
    let fechaSalida = JSON.parse(fechasLocalStorage).fechaFin;

    let fechaIniFormateada = new Date(fechaEntrada).toISOString().split('T')[0];
    let fechaFinFormateada = new Date(fechaSalida).toISOString().split('T')[0];

    const reserva = {
      habitacion: {
        idHabitacion: this.habitacion.idHabitacion,
      },
      huesped: {
        nombre: this.reservaForm.controls['nombre'].value,
        apellido: this.reservaForm.controls['apellido'].value,
        email: this.reservaForm.controls['email'].value,
        nombreuser: this.reservaForm.controls['nombreuser'].value,
        telefono: this.reservaForm.controls['telefono'].value,
        direccion: this.reservaForm.controls['direccion'].value,
      },
      fechaIni: fechaIniFormateada,
      fechaFin: fechaFinFormateada,
      estadoReservacion: 'pendiente',
      totalPago: this.totalPago,
      servicio: {
        id_servicio: this.reservaForm.controls['servicioId'].value,
      },
    };

    this._reservasService.guardarReservaciones(reserva).subscribe(
      (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Reserva Registrada',
          text: 'La reserva se ha realizado correctamente.',
          confirmButtonText: 'Aceptar',
        });

        const idReservacion = data.reservacion.idReservacion;

        this.grabarMetodoDePago(idReservacion);
      },
      (error) => {
        console.error('Error al registrar la reserva:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al registrar la reserva.',
          confirmButtonText: 'Intentar de nuevo',
        });
      }
    );
  }

  grabarMetodoDePago(idReservacion: any) {
    const metodoPago = {
      reservacion: {
        idReservacion: idReservacion,
      },
      metodoPago: this.formPayment.controls['metodoPago'].value,
      titularTarjeta: this.formPayment.controls['titularTarjeta'].value,
      numTarjeta: this.formPayment.controls['numeroTarjeta'].value,
      montoPagado: this.totalPago,
      fechaPago: new Date().toISOString(),
    };

    this._methodPayment.registrarMetodoPago(metodoPago).subscribe(
      (data) => {
        console.log('Metodo de pago registrado:', data);

        Swal.fire({
          icon: 'success',
          title: 'Su pago ha sido aprobado',
          text: 'El pago se ha realizado correctamente.',
          confirmButtonText: 'Aceptar',
        });

        this.router.navigate(['/']);
        this.cerrarModal();
      },
      (error) => {
        console.error('Error al registrar el pago:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al registrar el método de pago.',
          confirmButtonText: 'Intentar de nuevo',
        });
      }
    );
  }

  onSubmit() {
    if (this.reservaForm.valid) {
      this.grabarReserva();
    } else {
      console.log('Formulario no válido');
    }
  }
  titulo(titulo: any): void {
    this.title = `${titulo}`;
    this.nameBoton = 'Realizar Pago';
  }

  cerrarBoton() {
    this.resetForm();
    this.cerrarModal();
  }

  resetForm(): void {
    this.formPayment.reset();
  }
  cerrarModal() {
    const modalElement = document.getElementById('modalPayment');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }
}
