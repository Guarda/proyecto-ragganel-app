import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
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
import { DialogRef } from '@angular/cdk/dialog';

@Component({
    selector: 'app-crear-usuarios',
    imports: [NgFor, ReactiveFormsModule, MatSelectModule, MatDialogModule, MatButtonModule, MatIcon,
        MatFormField, MatLabel, FormsModule, MatInputModule, MatFormFieldModule, MatIconModule],
    templateUrl: './crear-usuarios.component.html',
    styleUrl: './crear-usuarios.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrearUsuariosComponent {

  Agregado = new EventEmitter();

  usuarioForm!: FormGroup;

  selectedRol: RolesUsuarios[] = [];
  selectedEstadoUsuarios: EstadosUsuarios[] = [];
  

  public ImagePath: any;

  constructor(
    public estadosUsuarios: EstadosUsuariosService,
    public rolesUsuarios: RolesUsuariosService,
    public usuariosService: UsuariosService,
    private fb: FormBuilder,
    private dialogRef: DialogRef,
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

    this.usuarioForm = new FormGroup({
      Nombre: new FormControl('',Validators.required),
      Correo: new FormControl('',Validators.required),
      Password: new FormControl('',Validators.required),
      IdEstadoFK: new FormControl('',Validators.required),
      IdRol: new FormControl('',Validators.required)
    })
    this.ImagePath = this.getimagePath('');
  }

  getimagePath(l: string | null) {
    const baseUrl = 'http://localhost:3000'; // Updated to match the Express server port
  
    if (l == null || l === '') {
      return `${baseUrl}/assets/avatardefault.png`;
    } else {
      return `${baseUrl}/assets/${l}`;
    }
  }

  onSubmit() {    // TODO: Use EventEmitter with form value 
    console.log(this.usuarioForm.value);
    // console.log(this.productoForm.get('Accesorios')?.value) 
    console.log("enviado");
    this.usuariosService.create(this.usuarioForm.value).subscribe((res: any) => {
      this.Agregado.emit();
      this.dialogRef.close(); // Cerrar diálogo después de agregar
      this.router.navigateByUrl('administracion/listado-usuarios');
    })

  }

}
