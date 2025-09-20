import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-dialog-descargar-pdf-proforma',
    imports: [MatDialogModule,
        MatButtonModule],
    templateUrl: './dialog-descargar-pdf-proforma.component.html',
    styleUrl: './dialog-descargar-pdf-proforma.component.css'
})
export class DialogDescargarPdfProformaComponent {

   constructor() { }

}
