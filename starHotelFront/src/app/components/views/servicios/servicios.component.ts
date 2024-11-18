import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiciosService } from 'src/app/services/servicios.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css'],
})
export class ServicioComponent implements OnInit {
  listaServicios: any[] = [];
  formServicio: FormGroup;
  title: string;
  nameBoton: string;
  id: number;

  constructor(private _servicioService: ServiciosService) {}

  ngOnInit(): void {
    this.obtenerServicios();
    this.initForm();
  }

  initForm() {
    this.formServicio = new FormGroup({
      id_servicio: new FormControl(null), // No es necesario requerir este campo al crear
      descripcion: new FormControl(null, [Validators.required]),
      precio: new FormControl(null, [Validators.required]),
    });
  }

  obtenerServicios() {
    this._servicioService.getServicios().subscribe((data) => {
      this.listaServicios = data.servicios;
    });
  }

  cerrarModal() {
    const modalElement = document.getElementById('modalServicio');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }

  crearEditarServicios(boton: string) {
    if (boton === 'Guardar') {
      this.alertRegistro();
    } else {
      this.alertModificar();
    }
  }

  guardar(formulario: any): void {
    if (this.formServicio.valid) {
      this._servicioService.guardarServicios(formulario).subscribe(
        (response) => {
          this.cerrarModal();
          this.obtenerServicios();
          this.resetForm();
        },
        (error) => {
          console.error('Error al registrar servicio:', error);
        }
      );
    }
  }

  titulo(titulo: string, id: number | null): void {
    this.title = `${titulo} servicio`;
    this.nameBoton = titulo === 'Crear' ? 'Guardar' : 'Modificar';

    if (id !== null) {
      this.id = id;
      this.obtenerServicioPorId(id);
    }
  }

  obtenerServicioPorId(id: number) {
    this._servicioService.obtenerServicioPorId(id).subscribe(
      (response) => {
        if (response) {
          this.formServicio.controls['descripcion'].setValue(
            response.servicio.descripcion || null
          );
          this.formServicio.controls['precio'].setValue(
            response.servicio.precio || null
          );
        } else {
          console.error('Error al obtener el servicio por ID:', response);
        }
      },
      (error) => {
        console.error('Error al obtener el servicio por ID:', error);
      }
    );
  }

  eliminarServicios(id: number): void {
    Swal.fire({
      title: '¿Deseas eliminar el servicio?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this._servicioService.eliminarServicios(id).subscribe(
          (response) => {
            Swal.fire(
              'Eliminado!',
              'El servicio ha sido eliminado con éxito.',
              'success'
            );
            this.obtenerServicios();
          },
          (error) => {
            const errorMsg =
              error?.message || 'No se pudo eliminar el servicio';
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
      title: 'Servicio ' + titulo + ' correctamente',
      showConfirmButton: false,
      timer: 1500,
    });
  }

  resetForm(): void {
    this.formServicio.reset();
  }

  alertRegistro() {
    if (this.formServicio.valid) {
      Swal.fire({
        title: '¿Deseas registrar el servicio?',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Si, confirmar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.guardar(this.formServicio.value);
          this.alertaExitosa('registrado');
        }
      });
    }
  }

  alertModificar() {
    if (this.formServicio.valid) {
      Swal.fire({
        title: '¿Deseas modificar el servicio?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si, confirmar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.editar(this.id, this.formServicio.value);
          this.alertaExitosa('modificado');
        }
      });
    }
  }

  editar(id: number, formulario: any): void {
    if (this.formServicio.valid) {
      this._servicioService.editarServicios(id, formulario).subscribe(
        (response) => {
          this.cerrarModal();
          this.obtenerServicios();
          this.resetForm();
        },
        (error) => {
          console.error('Error al modificar servicio', error);
        }
      );
    }
  }

  cerrarBoton() {
    this.resetForm();
    this.cerrarModal();
  }
}
