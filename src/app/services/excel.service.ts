// src/app/services/excel.service.ts

import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  /**
   * ✅ CORRECCIÓN: El método ahora acepta un arreglo de objetos (any[])
   * en lugar de una cadena de texto (string).
   */
  exportToExcel(data: any[], fileName: string): void {

    // ✅ CORRECCIÓN: Se elimina el bloque de código que procesaba la cadena.
    // Los datos ya vienen listos desde el componente del diálogo.

    // 1. Crear la hoja de cálculo a partir de los datos ya formateados.
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { 
        Sheets: { 'Códigos': worksheet }, 
        SheetNames: ['Códigos'] 
    };

    // 2. Generar el archivo Excel.
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // 3. Guardar el archivo.
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(file, `${fileName}.xlsx`);
  }
}