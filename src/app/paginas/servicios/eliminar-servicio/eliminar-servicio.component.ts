import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ServiciosService } from '../../../services/servicios.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-eliminar-servicio',
    imports: [MatDialogActions, MatDialogModule],
    templateUrl: './eliminar-servicio.component.html',
    styleUrl: './eliminar-servicio.component.css'
})
export class EliminarServicioComponent {
  Borrado = new EventEmitter();
  servicioForm!: FormGroup;


  constructor(
    private router: Router,
    public servicioService: ServiciosService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public idService: any
  ) {

  }

  public ServiceId: any;

  ngOnInit(): void {
    console.log(this.idService.value);
    this.ServiceId = this.idService.value;
    this.servicioForm = this.fb.group({
      CodigoServicio: [this.idService.value]
    });
  }

  onEliminar() {
    console.log(this.servicioForm.value.CodigoServicio);
    this.servicioService.delete(this.servicioForm.value.CodigoServicio).subscribe((res: any) => {
      this.Borrado.emit();
      this.router.navigateByUrl('home/listado-servicios');
    })
  }
}
