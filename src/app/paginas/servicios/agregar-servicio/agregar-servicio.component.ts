import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field'; // <-- Importar MatError
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // <-- Importar para spinner

@Component({
    selector: 'app-agregar-servicio',
    imports: [
        NgFor, NgIf, ReactiveFormsModule, MatSelectModule, MatDialogModule, MatButtonModule, MatIcon,
        MatFormField, MatLabel, FormsModule, MatInputModule, MatFormFieldModule, MatTableModule,
        IndexListadoInsumosComponent,
        MatError, // <-- Añadir MatError
        MatProgressSpinnerModule // <-- Añadir Spinner
    ],
    templateUrl: './agregar-servicio.component.html',
    styleUrl: './agregar-servicio.component.css'
})
export class AgregarServicioComponent {

  servicioForm!: FormGroup;

  mostrarInsumos = false;
  isSubmitting = false; // <-- 1. Bandera para evitar doble envío

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
    // --- 2. "Blindaje" de validadores basado en la BD ---
    this.servicioForm = this.fb.group({
      DescripcionServicio: ['', [
        Validators.required,
        Validators.maxLength(255) // Límite de la BD
      ]],
      PrecioBase: [null, [
        Validators.required,
        Validators.min(0),
        Validators.max(9999.99) // Límite por Decimal(6,2)
      ]],
      Comentario: ['', [
        Validators.maxLength(10000) // Límite de la BD
      ]]
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
    // 3. Validar si el formulario es inválido o si ya se está enviando
    if (this.servicioForm.invalid || this.isSubmitting) {
      return;
    }

    // 4. Activar la bandera de envío
    this.isSubmitting = true;

        const servicio = this.servicioForm.value;

        // Validar insumos
        const insumosValidos = this.insumosAgregados.filter(i => i.Cantidad > 0);
        if (this.mostrarInsumos && insumosValidos.length === 0) {
          console.warn('No se pueden enviar insumos con cantidad 0 o negativa.');
          // 5. Desactivar bandera si hay error lógico
          this.isSubmitting = false; 
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
            this.dialogRef.close(true); // ← esto cierra el diálogo
            // 6. Desactivar bandera al finalizar (éxito)
            // this.isSubmitting = false; // No es necesario si el diálogo se cierra
          },
          error: (error) => {
            console.error('Error al crear el servicio:', error);
            // 6. Desactivar bandera al finalizar (error)
            this.isSubmitting = false;
          }
        });
      
  }

}
