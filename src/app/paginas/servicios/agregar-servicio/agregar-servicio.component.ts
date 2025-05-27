import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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
import { ServiciosService } from '../../../services/servicios.service';
import { ServiciosBase } from '../../interfaces/servicios';
import { MatDialogRef } from '@angular/material/dialog';

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

  Agregado = new EventEmitter();
  // Insumos seleccionados y añadidos con cantidad
  insumosAgregados: { Codigo: string; Nombre: string; Cantidad: number }[] = [];

  insumoSeleccionado: any = null;
  cantidadInsumo: number | null = null;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private servicioService: ServiciosService,
     private dialogRef: MatDialogRef<AgregarServicioComponent>
  ) {
    this.servicioForm = this.fb.group({
      DescripcionServicio: ['', Validators.required],
      PrecioBase: [null, [Validators.required, Validators.min(0)]],
      Comentario: ['']
    });
  }


  agregarInsumo(insumo: { Codigo: string; Nombre: string; Cantidad: number }) {
    const existe = this.insumosAgregados.find(i => i.Codigo === insumo.Codigo);
    if (existe) {
      existe.Cantidad += insumo.Cantidad;
    } else {
      this.insumosAgregados.push(insumo);
    }
  }


  eliminarInsumo(insumo: any) {
    this.insumosAgregados = this.insumosAgregados.filter(i => i.Codigo !== insumo.Codigo);
  }

  toggleInsumos() {
    // Si estaba visible y ahora se oculta, borramos los insumos
    if (this.mostrarInsumos) {
      this.insumosAgregados = [];
    }
    this.mostrarInsumos = !this.mostrarInsumos;
  }

  actualizarCantidad(insumoActualizado: { Codigo: string; Cantidad: number }, event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const item = this.insumosAgregados.find(i => i.Codigo === insumoActualizado.Codigo);
    if (item) {
      item.Cantidad = insumoActualizado.Cantidad;
    }
  }

  onSubmit() {
    if (this.servicioForm.valid) {
      const servicio = this.servicioForm.value;
      const insumosValidos = this.mostrarInsumos
        ? this.insumosAgregados.filter(i => i.Cantidad > 0)
        : [];

      const payload = {
        servicio: {
          DescripcionServicio: servicio.DescripcionServicio,
          PrecioBase: servicio.PrecioBase,
          Comentario: servicio.Comentario
        },
        insumos: insumosValidos.map(i => ({
          CodigoInsumoFK: i.Codigo,
          CantidadDescargue: i.Cantidad
        }))
      };

      if (this.servicioForm.valid) {
        const servicio = this.servicioForm.value;

        // Validar insumos
        const insumosValidos = this.insumosAgregados.filter(i => i.Cantidad > 0);
        if (this.mostrarInsumos && insumosValidos.length === 0) {
          console.warn('No se pueden enviar insumos con cantidad 0 o negativa.');
          return;
        }

        // Esta es la estructura correcta que el backend espera
        const payload = {
          servicio: {
            DescripcionServicio: servicio.DescripcionServicio,
            PrecioBase: servicio.PrecioBase,
            Comentario: servicio.Comentario
          },
          insumos: insumosValidos.map(i => ({
            CodigoInsumoFK: i.Codigo,
            CantidadDescargue: i.Cantidad
          }))
        };

        console.log('Enviando servicio:', payload);

        this.servicioService.create(payload).subscribe({
          next: (response) => {
            console.log('Servicio creado exitosamente:', response);
            this.Agregado.emit();
            this.dialogRef.close(); // ← esto cierra el diálogo
            //this.router.navigate(['/home/listado-servicios']);
          },
          error: (error) => {
            console.error('Error al crear el servicio:', error);
          }
        });
      }
    }
  }

}
