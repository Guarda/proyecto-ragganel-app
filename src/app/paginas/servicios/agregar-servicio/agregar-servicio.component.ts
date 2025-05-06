import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgFor, NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { IndexListadoInsumosComponent } from '../index-listado-insumos/index-listado-insumos.component';

@Component({
  selector: 'app-agregar-servicio',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, MatSelectModule, MatDialogModule, MatButtonModule, MatIcon,
    MatFormField, MatLabel, FormsModule, MatInputModule, MatFormFieldModule, MatTableModule, IndexListadoInsumosComponent],
  templateUrl: './agregar-servicio.component.html',
  styleUrl: './agregar-servicio.component.css'
})
export class AgregarServicioComponent {

  servicioForm!: FormGroup;

  mostrarInsumos = false;


  // Insumos seleccionados y añadidos con cantidad
  insumosAgregados: { Codigo: string; Nombre: string; Cantidad: number }[] = [];

  insumoSeleccionado: any = null;
  cantidadInsumo: number | null = null;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.servicioForm = this.fb.group({
      DescripcionServicio: ['', Validators.required],
      PrecioBase: [null, [Validators.required, Validators.min(0)]],
      Comentario: ['']
    });
  }

  agregarInsumo() {
    if (this.insumoSeleccionado && this.cantidadInsumo && this.cantidadInsumo > 0) {
      // Evitar duplicados
      const existe = this.insumosAgregados.find(i => i.Codigo === this.insumoSeleccionado.Codigo);
      if (existe) {
        existe.Cantidad += this.cantidadInsumo;
      } else {
        this.insumosAgregados.push({
          Codigo: this.insumoSeleccionado.Codigo,
          Nombre: this.insumoSeleccionado.Nombre,
          Cantidad: this.cantidadInsumo
        });
      }

      // Reset campos
      this.insumoSeleccionado = null;
      this.cantidadInsumo = null;
      this.cdr.markForCheck(); // Forzar detección de cambios si es necesario
    }
  }

  eliminarInsumo(insumo: any) {
    this.insumosAgregados = this.insumosAgregados.filter(i => i.Codigo !== insumo.Codigo);
  }

  toggleInsumos() {
    this.mostrarInsumos = !this.mostrarInsumos;
  }

  onSubmit() {
    console.log('Formulario enviado:', this.servicioForm.value);
    if (this.servicioForm.valid && this.insumosAgregados.length > 0) {
      const servicio = this.servicioForm.value;

      const payload = {
        servicio: {
          DescripcionServicio: servicio.DescripcionServicio,
          PrecioBase: servicio.PrecioBase,
          Comentario: servicio.Comentario
        },
        insumos: this.insumosAgregados.map(i => ({
          CodigoInsumoFK: i.Codigo,
          CantidadDescargue: i.Cantidad
        }))
      };

      console.log('Enviando servicio:', payload);

      // Aquí llamarías al backend para guardar:
      // this.servicioService.createServicio(payload).subscribe(...)
    }
  }
}
