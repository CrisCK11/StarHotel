import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PagosService } from 'src/app/services/pagos.service'; // Asegúrate de que la ruta sea correcta
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css'],
})
export class PagosComponent implements OnInit {
  listaPagos: any[] = [];
  formPagos: FormGroup;
  title: string;
  nameBoton: string;
  id: number;

  constructor(private _pagosService: PagosService) {}

  ngOnInit(): void {
    this.obtenerPagos();
    this.initForm();
  }

  initForm() {
    this.formPagos = new FormGroup({
      reservacion: new FormGroup({
        idReservacion: new FormControl(null, [Validators.required]),
      }),
      metodoPago: new FormControl(null, [Validators.required]),
      titularTarjeta: new FormControl(null, [Validators.required]),
      numTarjeta: new FormControl(null, [Validators.required]),
      montoPagado: new FormControl(null, [Validators.required]),
    });
  }

  obtenerPagos() {
    this._pagosService.getPagos().subscribe((data) => {
      this.listaPagos = data.pagos; // Asegúrate de que el backend retorne los datos en este formato
    });
  }

  cerrarModal() {
    const modalElement = document.getElementById('modalPago');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }

  crearEditarPagos(boton: string) {
    if (boton === 'Guardar') {
      this.alertRegistro();
    } else {
      this.alertModificar();
    }
  }

  guardar(formulario: any): void {
    if (this.formPagos.valid) {
      this._pagosService.guardarPagos(formulario).subscribe(
        (response) => {
          this.cerrarModal();
          this.obtenerPagos();
          this.resetForm();
          console.log('Pago registrado', response);
        },
        (error) => {
          console.log(formulario);
          console.error('Error al registrar pago:', error);
        }
      );
    }
  }

  titulo(titulo: string, id: number): void {
    this.title = `${titulo} pago`;
    this.nameBoton = titulo === 'Crear' ? 'Guardar' : 'Modificar';
    if (id !== null) {
      this.id = id;
      this.obtenerPagoPorId(id);
    }
  }

  obtenerPagoPorId(id: number) {
    let form = this.formPagos;

    this._pagosService.obtenerPagoPorId(id).subscribe(
      (response) => {
        if (response) {
          console.log('DATA: ', response);

          form.controls['reservacion'].get('idReservacion')?.setValue(
            response.pago.reservacion?.idReservacion || null
          );
          form.controls['metodoPago'].setValue(
            response.pago.metodoPago || null
          );
          form.controls['titularTarjeta'].setValue(
            response.pago.titularTarjeta || null
          );
          form.controls['numTarjeta'].setValue(
            response.pago.numTarjeta || null
          );
          form.controls['montoPagado'].setValue(
            response.pago.montoPagado || null
          );
        } else {
          console.error('Error al obtener pago por ID:', response);
        }
      },
      (error) => {
        console.error('Error al obtener pago por ID:', error);
      }
    );
  }

  eliminarPagos(id: number): void {
    Swal.fire({
      title: '¿Deseas eliminar el pago?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this._pagosService.eliminarPagos(id).subscribe(
          (response) => {
            Swal.fire('Eliminado!', 'El pago ha sido eliminado con éxito.', 'success');
            this.obtenerPagos();
          },
          (error) => {
            const errorMsg = error?.message || 'No se pudo eliminar el pago';
            Swal.fire('Error', errorMsg, 'error');
          }
        );
      }
    });
  }

  alertaExitosa(titulo: string) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Pago ' + titulo + ' correctamente',
      showConfirmButton: false,
      timer: 1500,
    });
  }

  resetForm(): void {
    this.formPagos.reset();
  }

  alertRegistro() {
    if (this.formPagos.valid) {
      Swal.fire({
        title: '¿Deseas registrar el pago?',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.guardar(this.formPagos.value);
          this.alertaExitosa('registrado');
        }
      });
    }
  }

  alertModificar() {
    if (this.formPagos.valid) {
      Swal.fire({
        title: '¿Deseas modificar el pago?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.editar(this.id, this.formPagos.value);
          this.alertaExitosa('modificado');
        }
      });
    }
  }

  editar(id: number, formulario: any): void {
    if (this.formPagos.valid) {
      this._pagosService.editarPagos(id, formulario).subscribe(
        (response) => {
          this.cerrarModal();
          this.obtenerPagos();
          this.resetForm();
          console.log('Pago modificado', response);
        },
        (error) => {
          console.error('Error al modificar pago', error);
        }
      );
    }
  }

  cerrarBoton() {
    this.resetForm();
    this.cerrarModal();
  }
}