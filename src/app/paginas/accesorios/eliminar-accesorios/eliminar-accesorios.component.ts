import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'; // ✅ CAMBIO: Importar MatButtonModule
import { AccesorioBaseService } from '../../../services/accesorio-base.service';
import { AuthService } from '../../../UI/session/auth.service'; // ✅ CAMBIO: Importar AuthService

@Component({
    selector: 'app-eliminar-accesorios',
    standalone: true, // ✅ CAMBIO: Se define como standalone
    imports: [MatDialogModule, MatButtonModule], // ✅ CAMBIO: Se añaden los imports
    templateUrl: './eliminar-accesorios.component.html',
    styleUrl: './eliminar-accesorios.component.css'
})
export class EliminarAccesoriosComponent {
  Borrado = new EventEmitter<void>();
  
  public AccessorieId: string;

  constructor(
    public accesorioService: AccesorioBaseService, 
    private authService: AuthService, // ✅ CAMBIO: Se inyecta el servicio de autenticación
    @Inject(MAT_DIALOG_DATA) public data: { value: string } // ✅ CAMBIO: Se tipifica 'data'
  ) {
    this.AccessorieId = this.data.value; // Se asigna el valor en el constructor
  }

  onEliminar(): void {
    // ✅ CAMBIO: Se obtiene el ID del usuario
    const usuarioId = this.authService.getUserValue()?.id;

    if (!usuarioId) {
      console.error("Error: No se pudo obtener el ID del usuario.");
      return;
    }

    // ✅ CAMBIO: Se construye el objeto a enviar con ambos datos
    const dataToSend = {
      CodigoAccesorio: this.AccessorieId,
      IdUsuario: usuarioId
    };

    // ✅ CAMBIO: Se asume que el método en el servicio se llama 'eliminar'
    this.accesorioService.eliminar(dataToSend).subscribe((res: any) => {
      this.Borrado.emit();
    });
  }

}
