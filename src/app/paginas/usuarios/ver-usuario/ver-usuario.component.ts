import { ChangeDetectorRef, Component, inject, Inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatOption, MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { Usuarios } from '../../interfaces/usuarios';
import { RolesUsuarios } from '../../interfaces/roles-usuarios';
import { EstadosUsuarios } from '../../interfaces/estados-usuarios';
import { EstadosUsuariosService } from '../../../services/estados-usuarios.service';
import { RolesUsuariosService } from '../../../services/roles-usuarios.service';
import { UsuariosService } from '../../../services/usuarios.service';

import { SuccessdialogComponent } from '../../../UI/alerts/successdialog/successdialog.component';
import { DesactivarUsuarioComponent } from '../desactivar-usuario/desactivar-usuario.component';
import { CambiarPasswordDialogComponent } from '../cambiar-password-dialog/cambiar-password-dialog.component';
import { environment } from '../../../../enviroments/enviroments';


@Component({
    selector: 'app-ver-usuario',
    imports: [RouterModule, ReactiveFormsModule, MatFormField, MatLabel, NgFor, NgIf, MatOption, MatInputModule, MatOptionModule,
        MatSelectModule, MatButtonModule, MatIcon, FormsModule, MatFormFieldModule, SuccessdialogComponent],
    templateUrl: './ver-usuario.component.html',
    styleUrl: './ver-usuario.component.css'
})
export class VerUsuarioComponent {

  id!: any;

  usuario!: Usuarios;
  usuarioForm!: FormGroup;

  selectedRol: RolesUsuarios[] = [];
  selectedEstadoUsuarios: EstadosUsuarios[] = [];

  public ImagePath: any;

  public UserId: any;
  public UserName: any;
  public UserEmail: any;
  public UserPassword: any;
  public UserCreationDate: any;
  public UserStateId: any;
  public UserRoleId: any;
  passwordVisible = false;



  constructor(public estadosUsuarios: EstadosUsuariosService,
    public rolesUsuarios: RolesUsuariosService,
    public usuariosService: UsuariosService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private router: Router) { }
  // public consoleCurrency: any;
  ngOnInit(): void {
    this.id = this.route.snapshot.params['IdUsuarioPK'];
    this.UserId = this.id;
    this.ImagePath = this.getimagePath('');

    // --- INICIO DE CAMBIOS ---
    // Inicializar formulario con validadores y sin campos innecesarios
    this.usuarioForm = this.fb.group({
      IdUsuario: ['', Validators.required],
      NombreUsuario: ['', [
        Validators.required,
        Validators.maxLength(100) // Límite de 100 caracteres
      ]],
      CorreoUsuario: ['', [
        Validators.required,
        Validators.email, // Validador de formato de email
        Validators.maxLength(100) // Límite de 100 caracteres
      ]],
      // PasswordUsuario: ['', Validators.required],  // <-- ELIMINADO
      // FechaIngresoUsuario: ['', Validators.required], // <-- ELIMINADO
      IdEstadoUsuario: ['', Validators.required],
      IdRolUsuario: ['', Validators.required],
    });
    // --- FIN DE CAMBIOS ---

    // Obtener estados y roles
    this.estadosUsuarios.getAll().subscribe((data: EstadosUsuarios[]) => {
      this.selectedEstadoUsuarios = data;
    });

    this.rolesUsuarios.getAll().subscribe((data: RolesUsuarios[]) => {
      this.selectedRol = data;
    });

    // Obtener datos del usuario
    this.usuariosService.find(this.id).subscribe((data) => {
      if (data.length > 0) {
        this.usuario = data[0];
        console.log(this.usuario)
        
        // --- INICIO DE CAMBIOS ---
        // Actualizar formulario solo con los datos relevantes
        this.usuarioForm.patchValue({
          IdUsuario: this.usuario.IdUsuarioPK,
          NombreUsuario: this.usuario.Nombre,
          CorreoUsuario: this.usuario.Correo,
          // PasswordUsuario: this.usuario.Password, // <-- ELIMINADO
          // FechaIngresoUsuario: this.usuario.FechaIngresoUsuario, // <-- ELIMINADO
          IdEstadoUsuario: this.usuario.IdEstadoFK,
          IdRolUsuario: this.usuario.IdRolFK,
        });
        // --- FIN DE CAMBIOS ---
      }
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  getimagePath(l: string | null) {
    const baseUrl = environment.apiUrl;
    return l ? `${baseUrl}/assets/${l}` : `${baseUrl}/assets/avatardefault.png`;
  }

  // Método para abrir el cuadro de diálogo para cambiar la contraseña
  onChangePassword() {
    const dialogRef = this.dialog.open(CambiarPasswordDialogComponent, {
      width: '400px',
      data: { userId: this.UserId } // Enviar el ID del usuario al diálogo
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Si el usuario cambia la contraseña y se guarda correctamente, puedes hacer algo aquí
        console.log('Contraseña cambiada');
        // Recargar la página o actualizar los datos de usuario si es necesario
        this.ngOnInit();
      }
    });
  }

   public openDialogEliminar(cons: string){
      const dialogRef = this.dialog.open(DesactivarUsuarioComponent, {  
        disableClose: true,   
        data: { value: cons }      
      });
      dialogRef.componentInstance.Borrado.subscribe(() => {
        // this.router.navigateByUrl('listado-productos');
      });
      dialogRef.afterClosed().subscribe(() => {
        this.ngOnInit();
      });
    }

  onSubmit() {
    console.log(this.usuarioForm.value);
    if (this.usuarioForm.valid) {
      this.usuariosService.update(this.usuarioForm.value).subscribe((res) => {
        if (res.message) {
          this.dialog.open(SuccessdialogComponent); // Mostrar el diálogo de éxito
        }
      });
    }
  }

}
