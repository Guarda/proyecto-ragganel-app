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
  ) { }

  ngOnInit(): void {
    // Inicialización del formulario con validadores
    this.clienteForm = this.fb.group({
      Nombre: ['', [Validators.required, Validators.minLength(3)]],
      DNI: [''],
      RUC: [''],
      Correo: ['', [Validators.email]], // (Aquí también está el cambio de la respuesta anterior)
      Telefono: ['', [Validators.required, Validators.pattern(/^\+?\d{1,4}?\d{8,}$/)]], // (Y aquí)
      Direccion: [''],
      Comentarios: [''] // <-- AÑADIR ESTA LÍNEA
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
  crearCliente(): void {
    if (this.clienteForm.valid) {
      this.clienteService.crearCliente(this.clienteForm.value).subscribe(
        (res: any) => {
          console.log('Cliente creado con éxito:', res);
          this.Agregado.emit();
          // AHORA DEVUELVE EL OBJETO DEL CLIENTE QUE VINO DEL BACKEND
          this.dialogRef.close(res.nuevoCliente); 
        },
        (error: any) => {
          console.error('Error al crear el cliente:', error);
          // Si hay un error, cerramos sin devolver nada
          this.dialogRef.close(); 
        }
      );
    } 
  }
}
