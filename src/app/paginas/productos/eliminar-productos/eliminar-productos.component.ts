import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProductosService } from '../productos.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-eliminar-productos',
    imports: [MatDialogModule, MatDialogActions],
    templateUrl: './eliminar-productos.component.html',
    styleUrl: './eliminar-productos.component.css'
})
export class EliminarProductosComponent {
  Borrado = new EventEmitter();
  productoForm!: FormGroup;

  
  constructor(
    private router: Router,
    public productoService: ProductosService, 
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public idConsole: any
  ) {

  }

  public ConsoleId: any;

  ngOnInit(): void {
    this.ConsoleId = this.idConsole.value;
    this.productoForm = this.fb.group({
      CodigoConsola: [this.idConsole.value]
    });
  }

  onEliminar(){
    this.productoService.eliminar(this.productoForm.value).subscribe((res: any) => {
      this.Borrado.emit();
      this.router.navigateByUrl('home/listado-productos');
    })
  }
}