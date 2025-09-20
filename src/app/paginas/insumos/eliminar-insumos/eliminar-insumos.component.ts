import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InsumosBaseService } from '../../../services/insumos-base.service';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
    selector: 'app-eliminar-insumos',
    imports: [MatDialogModule, MatDialogActions],
    templateUrl: './eliminar-insumos.component.html',
    styleUrl: './eliminar-insumos.component.css'
})
export class EliminarInsumosComponent {
  Borrado = new EventEmitter();
  insumoForm!: FormGroup;


  constructor(
    private router: Router,
    public insumoService: InsumosBaseService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public idSupply: any
  ) {

  }

  public SupplyId: any;

  ngOnInit(): void {
    console.log(this.idSupply.value);
    this.SupplyId = this.idSupply.value;
    console.log(this.SupplyId);
    this.insumoForm = this.fb.group({
      CodigoInsumo: [this.idSupply.value]
    });
  }

  onEliminar() {
    this.insumoService.eliminar(this.insumoForm.value).subscribe((res: any) => {
      this.Borrado.emit();
      this.router.navigateByUrl('home/listado-insumos');
    })
  }

}
