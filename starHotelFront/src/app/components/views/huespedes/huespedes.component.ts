import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HuespedesService } from 'src/app/services/huespedes.service'; 
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-huespedes', 
  templateUrl: './huespedes.component.html', 
  styleUrls: ['./huespedes.component.css']
})
export class HuespedesComponent implements OnInit { 
  listarHuespedes: any[] = []; 
  formHuespedes: FormGroup; 
  title: any;
  nameBoton: any;
  id: number;

  constructor(private _huespedesService: HuespedesService) { } 

  ngOnInit(): void {
    this.obtenerHuespedes(); 
    this.initForm();
  }

  initForm() {
    this.formHuespedes = new FormGroup({
      apellido: new FormControl(null, [Validators.required]),
      nombre: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]), 
      nombreuser: new FormControl(null, [Validators.required]), 
      telefono: new FormControl(null, [Validators.required]),
      direccion: new FormControl(null, [Validators.required]),
    });
  }

  obtenerHuespedes() { 
    this._huespedesService.listarHuespedes().subscribe(data => { 
      console.log("Huespedes:", data.huespedes); 
      this.listarHuespedes = data.huespedes; 
    });
  }

  cerrarModal() {
    const modalElement = document.getElementById('modalHuesped'); 
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }

  crearEditarHuesped(boton: any) { 
    if (boton === 'Guardar') {
      this.alertRegistro();
    } else {
      this.alertModificar();
    }
  }

  guardar(formulario: any): void {
    if (this.formHuespedes.valid) { 
      this._huespedesService.registrarHuesped(formulario).subscribe((response) => { 
        console.log(formulario);
        this.cerrarModal();
        this.obtenerHuespedes();
        this.resetForm();
        console.log('Huesped registrado', response); 
      }, (error) => {
        console.log(formulario);
        console.error('Error al registrar huesped:', error); 
      });
    }
  }

  titulo(titulo: any, id: number): void {
    this.title = `${titulo} huesped`; 
    titulo === 'Crear' ? (this.nameBoton = 'Guardar')
      : (this.nameBoton = 'Modificar');
    if (id !== null) {
      this.id = id;
      this.obtenerHuespedPorId(id); 
    }
  }

  obtenerHuespedPorId(id: any) { 
    let form = this.formHuespedes; 

    this._huespedesService.listarHuespedPorId(id).subscribe((response) => { 
      if (response) {
        form.controls['apellido'].setValue(response.huesped.apellido || null); 
        form.controls['nombre'].setValue(response.huesped.nombre || null); 
        form.controls['email'].setValue(response.huesped.email || null); 
        form.controls['nombreuser'].setValue(response.huesped.nombreuser || null); 
        form.controls['telefono'].setValue(response.huesped.telefono || null); 
        form.controls['direccion'].setValue(response.huesped.direccion || null); 
      } else {
        console.error('Error al obtener huesped por ID:', response); 
      }
    }, (error) => {
      console.error('Error al obtener huesped por ID:', error); 
    });
  }

  eliminarHuesped(id: number): void { 
    Swal.fire({
      title: '¿Deseas eliminar el huesped?', 
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this._huespedesService.eliminarHuesped(id).subscribe( 
          (response) => {
            Swal.fire('Eliminado!', 'El huesped ha sido eliminado con éxito.', 'success'); 
            this.obtenerHuespedes(); 
          },
          (error) => {
            const errorMsg = error?.message || 'No se pudo eliminar el huesped'; 
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
      title: 'Huesped ' + titulo + ' correctamente', 
      showConfirmButton: false,
      timer: 1500,
    });
  }

  resetForm(): void {
    this.formHuespedes.reset(); 
  }

  alertRegistro() {
    if (this.formHuespedes.valid) { 
      Swal.fire({
        title: '¿Deseas registrar el huesped?', 
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Si, confirmar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.guardar(this.formHuespedes.value); 
          this.alertaExitosa('registrado'); 
        }
      });
    }
  }

  alertModificar() {
    if (this.formHuespedes.valid) { 
      Swal.fire({
        title: '¿Deseas modificar el huesped?', 
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si, confirmar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.editar(this.id, this.formHuespedes.value); 
          this.alertaExitosa('modificado'); 
        }
      });
    }
  }

  editar(id: number, formulario: any): void {
    if (this.formHuespedes.valid) { 
      this._huespedesService.editarHuesped(id, formulario).subscribe((response) => { 
        this.cerrarModal();
        this.obtenerHuespedes(); 
        this.resetForm();
        console.log("Huesped modificado", response); 
      }, (error) => {
        console.error('Error al modificar huesped:', error); 
      });
    }
  }

  cerrarBoton() {
    this.resetForm();
    this.cerrarModal();
  }
}