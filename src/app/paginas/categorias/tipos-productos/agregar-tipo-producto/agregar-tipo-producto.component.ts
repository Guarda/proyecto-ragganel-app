import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// 1. Importar el servicio y la interfaz
import { TiposProductosService } from '../../../../services/tipos-productos.service';
// Asumimos una interfaz simple para la lista de accesorios
import { TipoAccesorios } from '../../../interfaces/accesorios';

@Component({
  selector: 'app-agregar-tipo-producto',
  standalone: true, // Lo hacemos standalone, igual que 'agregar-categorias'
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatOptionModule,
    MatLabel,
    MatProgressSpinnerModule
  ],
  templateUrl: './agregar-tipo-producto.component.html',
  styleUrl: './agregar-tipo-producto.component.css'
})
export class AgregarTipoProductoComponent implements OnInit {

  @Output() Agregado = new EventEmitter();
  
  tipoProductoForm: FormGroup;
  accesoriosDisponibles: TipoAccesorios[] = [];
  isLoading = false; // Para la lista de accesorios

  constructor(
    private fb: FormBuilder, // Usamos FormBuilder para comodidad
    private tiposProductosService: TiposProductosService,
    private dialogRef: MatDialogRef<AgregarTipoProductoComponent>
  ) {
    this.tipoProductoForm = this.fb.group({
      // Coincide con p_Descripcion del SP
      descripcion: ['', Validators.required], 
      // Coincide con p_AccesoriosIDsJSON del SP
      accesorios: [[], Validators.required] // Array de IDs
    });
  }

  ngOnInit(): void {
    this.loadAccesorios();
  }

  /**
   * Carga la lista de accesorios disponibles para el dropdown múltiple.
   * Llama al método getAccesoriosDisponibles() de tu servicio.
   */
  loadAccesorios(): void {
    this.isLoading = true;
    this.tiposProductosService.getAccesoriosDisponibles().subscribe({
      next: (data: TipoAccesorios[]) => {
        this.accesoriosDisponibles = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error al cargar accesorios disponibles:", err);
        this.isLoading = false;
        // Opcional: mostrar error en el diálogo
      }
    });
  }

  /**
   * Se ejecuta al enviar el formulario.
   * Llama al servicio create() con el valor del formulario.
   */
  onSubmit(): void {
    if (this.tipoProductoForm.invalid) {
      return; // No enviar si el formulario es inválido
    }

    // El valor del formulario ya tiene la estructura { descripcion: '...', accesorios: [1, 2, 5] }
    this.tiposProductosService.create(this.tipoProductoForm.value).subscribe({
      next: (res: any) => {
        this.Agregado.emit(); // Emite el evento para recargar la lista
        this.dialogRef.close(true); // Cierra el diálogo exitosamente
      },
      error: (err) => {
        console.error("Error al crear el tipo de producto:", err);
        // Opcional: mostrar un snackbar o mensaje de error
      }
    });
  }

  // Método para cerrar el diálogo sin guardar
  onCancel(): void {
    this.dialogRef.close(false);
  }
}