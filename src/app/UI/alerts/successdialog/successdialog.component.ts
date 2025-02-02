import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-successdialog',
  standalone: true,
  imports: [MatDialogModule, MatIcon],
  templateUrl: './successdialog.component.html',
  styleUrl: './successdialog.component.css'
})
export class SuccessdialogComponent {
  constructor() {}
} 
