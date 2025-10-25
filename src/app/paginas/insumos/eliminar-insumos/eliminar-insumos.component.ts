import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogActions } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InsumosBaseService } from '../../../services/insumos-base.service';
// Se elimina FormBuilder y FormGroup si ya no se usan
import { AuthService } from '../../../UI/session/auth.service'; // <-- Importado
import { MatButtonModule } from '@angular/material/button'; // <-- Importado

@Component({
    selector: 'app-eliminar-insumos',
    standalone: true, // <-- Añadido
    imports: [MatDialogModule, MatDialogActions, MatButtonModule], // <-- MatButtonModule añadido
    templateUrl: './eliminar-insumos.component.html',
    styleUrl: './eliminar-insumos.component.css'
})
export class EliminarInsumosComponent implements OnInit {
  Borrado = new EventEmitter<void>(); // Tipar el EventEmitter si es posible

  // Hacerla pública para acceso desde HTML si es necesario
  public SupplyId: string;

  constructor(
    private router: Router,
    public insumoService: InsumosBaseService,
    private authService: AuthService, // <-- Inyectado
    @Inject(MAT_DIALOG_DATA) public data: { value: string } // <-- Tipificado
  ) {
    this.SupplyId = this.data.value; // Asignar aquí
  }

  ngOnInit(): void {
    // El formulario ya no es necesario
  }

  onEliminar(): void { // <-- Tipar retorno si es void
    // 1. Obtener el ID del usuario actual
    const usuarioId = this.authService.getUserValue()?.id;

    // 2. Validación de seguridad
    if (!usuarioId) {
      console.error("Error: No se pudo obtener el ID del usuario.");
      return;
    }

    // 3. Crear el objeto a enviar con CodigoInsumo y IdUsuario
    const dataToSend = {
      CodigoInsumo: this.SupplyId,
      IdUsuario: usuarioId
    };

    // 4. Enviar los datos combinados al servicio
    this.insumoService.eliminar(dataToSend).subscribe((res: any) => {
      this.Borrado.emit();
      // La navegación se maneja desde el componente padre
    });
  }
}