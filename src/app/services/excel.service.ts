import * as XLSX from 'xlsx';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  exportToExcel(codigosGenerados: string, fileName: string): void {
    // Convertir la cadena en un array de objetos
    const data = codigosGenerados.split(';').filter(item => item).map(item => {
      const [tipo, codigo] = item.split(':');
      return { Tipo: tipo, Codigo: codigo };
    });

    // Crear hoja de Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'Códigos': worksheet }, SheetNames: ['Códigos'] };

    // Generar archivo Excel
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Guardar el archivo
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(file, `${fileName}.xlsx`);
  }
}
