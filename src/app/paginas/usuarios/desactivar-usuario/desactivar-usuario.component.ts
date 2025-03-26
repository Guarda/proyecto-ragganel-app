import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-desactivar-usuario',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogClose],
  templateUrl: './desactivar-usuario.component.html',
  styleUrl: './desactivar-usuario.component.css'
})
export class DesactivarUsuarioComponent {
  Borrado = new EventEmitter();
  usuarioForm!: FormGroup;

  constructor(
    private router: Router,
    public usuarioService: UsuariosService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public idUsuario: any
  ) {

  }

  public UserId: any;

  ngOnInit(): void {
    this.UserId = this.idUsuario.value;
    this.usuarioForm = this.fb.group({
      IdUsuario: [this.idUsuario.value],
      IdEstadoUsuario: 2
    });
  }

  onDescativar() {
    this.usuarioService.desactivar(this.usuarioForm.value).subscribe((res: any) => {
      this.Borrado.emit();
      // this.router.navigateByUrl("['/administracion/ver-usuario', element.IdUsuarioPK,'view']");
    })
  }

}
