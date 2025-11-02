import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CategoriasConsolas } from '../../interfaces/categorias';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgFor } from '@angular/common';

import { Usuarios } from '../../interfaces/usuarios';
import { UsuariosService } from '../../../services/usuarios.service';

import { RolesUsuarios } from '../../interfaces/roles-usuarios';
import { EstadosUsuarios } from '../../interfaces/estados-usuarios';
import { EstadosUsuariosService } from '../../../services/estados-usuarios.service';
import { RolesUsuariosService } from '../../../services/roles-usuarios.service';

@Component({
    selector: 'app-crear-usuarios',
    imports: [NgFor, ReactiveFormsModule, MatSelectModule, MatDialogModule, MatButtonModule, MatIcon,
        MatFormField, MatLabel, FormsModule, MatInputModule, MatFormFieldModule, MatIconModule],
    templateUrl: './crear-usuarios.component.html',
    styleUrl: './crear-usuarios.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrearUsuariosComponent {

  usuarioForm!: FormGroup;

  selectedRol: RolesUsuarios[] = [];
  selectedEstadoUsuarios: EstadosUsuarios[] = [];
  

  public ImagePath: any;

  constructor(
    public estadosUsuarios: EstadosUsuariosService,
    public rolesUsuarios: RolesUsuariosService,
    public usuariosService: UsuariosService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CrearUsuariosComponent>,
    private cdr: ChangeDetectorRef,
    private router: Router
  ){
    
  }

  ngOnInit(): void{
    this.estadosUsuarios.getAll().subscribe((data: EstadosUsuarios[]) => {         
      this.selectedEstadoUsuarios = data;
    });

     this.rolesUsuarios.getAll().subscribe((data: RolesUsuarios[]) => {         
      this.selectedRol = data;
    });

    // --- INICIO DE CAMBIOS ---
    this.usuarioForm = new FormGroup({
      Nombre: new FormControl('', [
        Validators.required,
        Validators.maxLength(100) // Límite de 100 caracteres
      ]),
      Correo: new FormControl('', [
        Validators.required,
        Validators.email, // Validador de formato de email
        Validators.maxLength(100) // Límite de 100 caracteres
      ]),
      Password: new FormControl('', [
        Validators.required,
        Validators.maxLength(255) // Límite de 255 caracteres
      ]),
      IdEstadoFK: new FormControl('',Validators.required),
      IdRolFK: new FormControl('', Validators.required) 
    });
    this.ImagePath = this.getimagePath('');
  }

  getimagePath(l: string | null) {
    const baseUrl = 'http://localhost:3000'; // Updated to match the Express server port
  
    // Tu HTML usa 'assets/img/default-user.png' como fallback.
    // Alineamos la lógica para que coincida.
    if (l == null || l === '') return 'assets/img/default-user.png';
    
    return `${baseUrl}/assets/${l}`;
  }

  onSubmit() {
    if (this.usuarioForm.invalid) {
      return; // No hacer nada si el formulario es inválido
    }

    console.log(this.usuarioForm.value);
    console.log("enviado");

    this.usuariosService.create(this.usuarioForm.value).subscribe({
      next: (res: any) => {
        // Envía 'true' al cerrar para que el componente padre (la lista) sepa que debe recargar.
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error("Error al crear usuario", err);
      }
    });
  }

}
