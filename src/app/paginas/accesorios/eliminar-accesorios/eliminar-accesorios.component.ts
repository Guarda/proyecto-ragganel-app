import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AccesorioBaseService } from '../../../services/accesorio-base.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-eliminar-accesorios',
  standalone: true,
  imports: [MatDialogModule, MatDialogActions],
  templateUrl: './eliminar-accesorios.component.html',
  styleUrl: './eliminar-accesorios.component.css'
})
export class EliminarAccesoriosComponent {
  Borrado = new EventEmitter();
  accesorioForm!: FormGroup;

  
  constructor(
    private router: Router,
    public accesorioService: AccesorioBaseService, 
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public idAccessorie: any
  ) {

  }

  public AccessorieId: any;

  ngOnInit(): void {
    console.log(this.idAccessorie.value);
    this.AccessorieId = this.idAccessorie.value;
    this.accesorioForm = this.fb.group({
      CodigoAccesorio: [this.idAccessorie.value]
    });
  }

  onEliminar(){
    this.accesorioService.eliminar(this.accesorioForm.value).subscribe((res: any) => {
      this.Borrado.emit();
      this.router.navigateByUrl('listado-accesorios');
    })
  }

}
