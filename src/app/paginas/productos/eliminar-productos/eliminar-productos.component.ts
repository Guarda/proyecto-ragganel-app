import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'; // ✅ CAMBIO: Importar MatButtonModule
import { Router } from '@angular/router';
import { ProductosService } from '../productos.service';
import { AuthService } from '../../../UI/session/auth.service'; // ✅ CAMBIO: Importar AuthService

@Component({
    selector: 'app-eliminar-productos',
    standalone: true, // ✅ CAMBIO: Se define como standalone
    imports: [MatDialogModule, MatButtonModule], // ✅ CAMBIO: Se añaden los imports
    templateUrl: './eliminar-productos.component.html',
    styleUrl: './eliminar-productos.component.css'
})
export class EliminarProductosComponent implements OnInit {
  Borrado = new EventEmitter<void>();
  
  // Se puede acceder directamente desde el HTML si es público
  public ConsoleId: string;

  constructor(
    private router: Router,
    public productoService: ProductosService, 
    private authService: AuthService, // ✅ CAMBIO: Se inyecta el servicio de autenticación
    @Inject(MAT_DIALOG_DATA) public data: { value: string } // ✅ CAMBIO: Se tipifica 'data' para más claridad
  ) {
    this.ConsoleId = this.data.value; // Se asigna el valor en el constructor
  }

  ngOnInit(): void {
    // El formulario ya no es necesario si solo enviaremos el ID
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
      CodigoConsola: this.ConsoleId,
      IdUsuario: usuarioId
    };

    this.productoService.eliminar(dataToSend).subscribe((res: any) => {
      this.Borrado.emit();
      // La navegación se maneja desde el componente que abre el diálogo
    });
  }
}