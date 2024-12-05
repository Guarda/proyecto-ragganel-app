import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgFor } from '@angular/common';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-agregar-pedido',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, MatSelectModule, MatDialogModule, MatButtonModule, MatIcon,
    MatFormField, MatLabel, FormsModule, MatInputModule, MatFormFieldModule, MatChipsModule],
  templateUrl: './agregar-pedido.component.html',
  styleUrl: './agregar-pedido.component.css'
})
export class AgregarPedidoComponent {

  Agregado = new EventEmitter();
  pedidoForm!: FormGroup;

  public ImagePath: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {

  }

  ngOnInit(): void {

    this.pedidoForm = new FormGroup({
      FechaCreacionPedido: new FormControl('', Validators.required),
      FechaArrivoUSA: new FormControl('', Validators.required),
      FechaEstimadaRecepcion: new FormControl('', Validators.required),
      NumeroTracking1: new FormControl('', Validators.required),
      NumeroTracking2: new FormControl(''),
      SitioWeb: new FormControl('', Validators.required),
      ViaPedido: new FormControl('', Validators.required),
      PrecioEstimadoDelPedido: new FormControl(''),
      Estado: new FormControl(''),
      Comentarios: new FormControl('')
    });

    this.ImagePath = this.getimagePath("");

  }

  getimagePath(l: string | null) {
    const baseUrl = 'http://localhost:3000'; // Updated to match the Express server port

    if (l == null || l === '') {
      return `${baseUrl}/img-accesorios/GameCube_controller-1731775589376.png`;//agregar imagen del tipo de pedido
    } else {
      return `${baseUrl}/img-accesorios/${l}`;
    }
  }

  onSubmit() {    // TODO: Use EventEmitter with form value 
    console.log(this.pedidoForm.value);
    console.log("enviado");
    // this.accesorioService.create(this.accesorioForm.value).subscribe((res: any) => {
    //   this.Agregado.emit();
    //   this.router.navigateByUrl('listado-accesorios');
    // })
  }

}
