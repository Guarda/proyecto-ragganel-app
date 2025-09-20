import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { ClientesService } from '../../../services/clientes.service';

@Component({
    selector: 'app-eliminar-cliente',
    imports: [MatDialogContent, MatDialogClose, MatDialogActions],
    templateUrl: './eliminar-cliente.component.html',
    styleUrl: './eliminar-cliente.component.css'
})
export class EliminarClienteComponent {
  public ClienteId: any;
  Eliminar = new EventEmitter();
  clienteForm!: FormGroup;


  constructor(
    private router: Router,
    public clienteService: ClientesService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public idCliente: any
  ) {

  }



  ngOnInit(): void {
    console.log('ID CLIENTE: ', this.idCliente.value);
    this.ClienteId = this.idCliente.value;
    // this.clienteForm = this.fb.group({
    //   idCliente: [this.idCliente.value]
    // });
  }

  onEliminar() {
    this.clienteService.eliminar(this.idCliente.value).subscribe((res: any) => {
      this.Eliminar.emit();
      this.router.navigateByUrl('home/listado-clientes');
    })
  }
}
