import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormField, MatLabel, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-editar-productos',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, MatSelectModule, MatDialogModule, MatButtonModule, MatIcon, MatFormField, MatLabel, FormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './editar-productos.component.html',
  styleUrl: './editar-productos.component.css'
})
export class EditarProductosComponent {
  productoForm!: FormGroup;

  onSubmit() {    // TODO: Use EventEmitter with form value 
    //console.log(this.productoForm.value); 
    console.log("enviado");
   

  }
}
