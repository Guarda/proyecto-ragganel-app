import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { ExcelService } from '../../../services/excel.service';

@Component({
  selector: 'app-descargar-excel-dialog',
  standalone: true,
  imports: [ MatDialogActions, MatDialogContent],
  templateUrl: './descargar-excel-dialog.component.html',
  styleUrl: './descargar-excel-dialog.component.css'
})
export class DescargarExcelDialogComponent {
  
  constructor(
    public dialogRef: MatDialogRef<DescargarExcelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { codigosGenerados: string, orderId: string },
    private excelService: ExcelService
  ) {}

  descargarExcel() {
    this.excelService.exportToExcel(this.data.codigosGenerados, `Inventario_${this.data.orderId}`);
    this.dialogRef.close();
  }

  cerrar() {
    this.dialogRef.close();
  }
}
