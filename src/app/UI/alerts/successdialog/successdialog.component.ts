import { Component, Inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-successdialog',
    imports: [MatDialogModule, MatIconModule],
    templateUrl: './successdialog.component.html',
    styleUrl: './successdialog.component.css'
})
export class SuccessdialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}
