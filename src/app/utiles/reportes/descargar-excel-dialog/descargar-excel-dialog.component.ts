import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { ExcelService } from '../../../services/excel.service';
import { ExcelDialogData } from '../../../paginas/interfaces/exceldialogdata';

@Component({
  selector: 'app-descargar-excel-dialog',
  standalone: true,
  imports: [MatDialogActions, MatDialogContent],
  templateUrl: './descargar-excel-dialog.component.html',
  styleUrl: './descargar-excel-dialog.component.css'
})
export class DescargarExcelDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DescargarExcelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { codigosGenerados: string, orderId: string },
    private excelService: ExcelService
  ) { }

  // Suponiendo que tienes un método que se ejecuta al hacer clic en "Descargar"
  descargarExcel() {
    // 'this.data.codigosGenerados' es la cadena que recibes del componente padre
    const datosFormateados = this.prepararDatosParaExcel(this.data.codigosGenerados);

    if (datosFormateados.length > 0) {
      // Llama a tu servicio de Excel con los datos ya estructurados
      // CORRECTO
      this.excelService.exportToExcel(datosFormateados, `Inventario_${this.data.orderId}`);
    } else {
      console.error("No hay datos para exportar.");
      // Opcional: Muestra una notificación al usuario
    }

    this.cerrar();

  }

  

  // Esta función puede estar en tu DescargarExcelDialogComponent o en tu ExcelService

  prepararDatosParaExcel(codigosString: string): any[] {
    if (!codigosString) {
      return [];
    }

    const datosParaExcel = [];
    // 1. Separa cada artículo por el punto y coma (;)
    const articulos = codigosString.split(';').filter(s => s.trim() !== '');

    // 2. Expresión regular para "capturar" el tipo, el código y la cantidad (si existe)
    const regex = /(.+):(.+?)(?:\s\((\d+)\))?$/;

    for (const articulo of articulos) {
      const match = articulo.trim().match(regex);

      if (match) {
        // 3. Extrae los datos capturados por la expresión regular
        const tipo = match[1];
        const codigo = match[2].trim();
        // Si no hay cantidad (para productos/accesorios), se asume que es 1
        const cantidad = match[3] || '1';

        // 4. Crea un objeto estructurado para la fila del Excel
        datosParaExcel.push({
          'Tipo de Artículo': tipo,
          'Código Generado': codigo,
          'Cantidad': parseInt(cantidad, 10) // Convierte la cantidad a número
        });
      }
    }

    return datosParaExcel;
  }

  cerrar() {
    this.dialogRef.close();
  }
}
