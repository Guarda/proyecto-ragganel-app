import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, NgFor } from '@angular/common';

import { Cliente } from '../../interfaces/clientes';
import { ClientesService } from '../../../services/clientes.service';

@Component({
  selector: 'app-crear-cliente',
  standalone: true,
  imports: [
    NgFor,
    ReactiveFormsModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule,
    MatIcon,
    MatFormField,
    MatLabel,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    CommonModule
  ],
  templateUrl: './crear-cliente.component.html',
  styleUrl: './crear-cliente.component.css'
})
export class CrearClienteComponent {
  @Output() Agregado = new EventEmitter(); // Emisor de eventos para notificar la creación del cliente

  clienteForm!: FormGroup;
  public ImagePath: any;

  constructor(
    private clienteService: ClientesService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private dialogRef: MatDialogRef<CrearClienteComponent> // Inyectar MatDialogRef
  ) {}

  ngOnInit(): void {
    // Inicialización del formulario con validadores
    this.clienteForm = this.fb.group({
      Nombre: ['', [Validators.required, Validators.minLength(3)]],
      DNI: [''],
      RUC: [''],
      Correo: ['', [Validators.required, Validators.email]],
      Telefono: ['', [Validators.pattern(/^\+?\d{1,4}?\d{8,}$/)]], // Validador opcional para el teléfono
      Direccion: ['']
    });

    // Inicializa la ruta de la imagen
    this.ImagePath = this.getimagePath('img-client.png');
  }

  // Método para obtener la ruta de la imagen
  getimagePath(l: string | null): string {
    const baseUrl = 'http://localhost:3000'; // Asegúrate de que este es el puerto correcto de tu servidor
    return l ? `${baseUrl}/assets/${l}` : `${baseUrl}/assets/avatardefault.png`;
  }

  // Método para manejar el envío del formulario
  onSubmit(event: Event): void {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

    if (this.clienteForm.valid) {
      console.log('Formulario válido, enviando datos:', this.clienteForm.value); // Debug
      this.clienteService.crearCliente(this.clienteForm.value).subscribe(
        (res: any) => {
          console.log('Cliente creado con éxito:', res); // Debug
          this.Agregado.emit(); // Emitir evento de cliente agregado
          this.dialogRef.close(); // Cerrar el diálogo
          this.router.navigateByUrl('home/listado-clientes'); // Redirigir al listado de clientes
        },
        (error: any) => {
          console.error('Error al crear el cliente:', error); // Manejo de errores
        }
      );
    } else {
      console.warn('Formulario inválido, no se enviaron datos'); // Debug
    }
  }
}
