import { Component, EventEmitter, OnInit, Output, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'; // Import para el campo 'Activo'

// 1. Importar el servicio y la interfaz
import { TiposProductosService } from '../../../../services/tipos-productos.service';
import { TipoAccesorios } from '../../../interfaces/accesorios';
import { TipoProducto } from '../../../interfaces/tipoproducto';
@Component({
  selector: 'app-editar-tipo-producto',
  standalone: true,
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
    MatProgressSpinnerModule,
    MatSlideToggleModule // Añadir el módulo para el toggle
  ],
  templateUrl: './editar-tipo-producto.component.html',
  styleUrl: './editar-tipo-producto.component.css'
})
export class EditarTipoProductoComponent implements OnInit {

  @Output() Editado = new EventEmitter();
  
  tipoProductoForm: FormGroup;
  accesoriosDisponibles: TipoAccesorios[] = [];
  
  isLoadingData = false; // Spinner para los datos del formulario
  isLoadingAccesorios = false; // Spinner para el dropdown
  
  private currentId: number;

  constructor(
    private fb: FormBuilder,
    private tiposProductosService: TiposProductosService,
    private dialogRef: MatDialogRef<EditarTipoProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Recibimos el ID desde el listado
  ) {
    // Guardamos el ID que nos pasaron
    this.currentId = data.value;

    // Inicializamos el formulario
    this.tipoProductoForm = this.fb.group({
      // Necesitamos el ID para el 'update', aunque no sea visible
      IdTipoProductoPK: [this.currentId], 
      descripcion: ['', Validators.required],
      // Este es el nuevo campo que requiere tu SP de 'update'
      activo: [true, Validators.required], 
      accesorios: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    // Cargamos ambas listas en paralelo
    this.loadTipoProducto();
    this.loadAccesorios();
  }

  /**
   * Carga los datos específicos del Tipo de Producto (descripción, estado y accesorios seleccionados)
   * y rellena el formulario con ellos.
   */
  loadTipoProducto(): void {
    this.isLoadingData = true;
    this.tiposProductosService.find(this.currentId).subscribe({
      
      // 1. Cambiamos 'TipoProducto' a 'any' porque la API devuelve
      //    propiedades que no coinciden con la interfaz (ej. 'accesorios')
      next: (data: any) => { 
        
        // 2. Creamos un objeto para "traducir" los nombres de la API
        //    a los nombres que espera el FormGroup
        const formData = {
          IdTipoProductoPK: data.IdTipoProductoPK,
          descripcion: data.DescripcionTipoProducto, // API: DescripcionTipoProducto -> Form: descripcion
          activo: data.Activo,                     // API: Activo -> Form: activo
          accesorios: data.accesorios              // API: accesorios -> Form: accesorios (coinciden)
        };

        // 3. Rellenamos el formulario con el objeto 'formData' ya traducido
        this.tipoProductoForm.patchValue(formData);
        
        this.isLoadingData = false;
      },
      error: (err) => {
        console.error("Error al cargar el tipo de producto:", err);
        this.isLoadingData = false;
      }
    });
  }

  /**
   * Carga la lista completa de todos los accesorios disponibles para poblar el
   * dropdown de selección múltiple.
   */
  loadAccesorios(): void {
    this.isLoadingAccesorios = true;
    this.tiposProductosService.getAccesoriosDisponibles().subscribe({
      next: (data: TipoAccesorios[]) => {
        this.accesoriosDisponibles = data;
        this.isLoadingAccesorios = false;
      },
      error: (err) => {
        console.error("Error al cargar accesorios disponibles:", err);
        this.isLoadingAccesorios = false;
      }
    });
  }

  /**
   * Se ejecuta al enviar el formulario.
   * Llama al servicio update() con el valor completo del formulario.
   */
  onSubmit(): void {
    if (this.tipoProductoForm.invalid) {
      return;
    }
    
    // El 'this.tipoProductoForm.value' ya contiene el 'IdTipoProductoPK', 
    // 'descripcion', 'activo' y 'accesorios' que el servicio 'update' espera.
    this.tiposProductosService.update(this.tipoProductoForm.value).subscribe({
      next: (res: any) => {
        this.Editado.emit(); // Emite el evento para recargar la lista
        this.dialogRef.close(true); // Cierra el diálogo
      },
      error: (err) => {
        console.error("Error al actualizar el tipo de producto:", err);
      }
    });
  }

  // Método para cerrar el diálogo sin guardar
  onCancel(): void {
    this.dialogRef.close(false);
  }
}