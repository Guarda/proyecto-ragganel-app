import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, NgFor } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
// import { PruebaComponent } from '../../prueba/prueba.component';
import { IndexListadoArticulosComponent } from '../listado-articulos/index-listado-articulos/index-listado-articulos.component';

import { CustomDateValidators } from '../../../utiles/customs/custom-date-validators';
import { PedidoFormGroup } from '../../interfaces/pedidoformgroup';
import { AbstractControl, ValidationErrors } from '@angular/forms';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { EstadoPedido } from '../../interfaces/estadopedido';
import { TipoPedido } from '../../interfaces/tipopedido';
import { SitioWeb } from '../../interfaces/sitioweb';

import { TipoPedidoService } from '../../../services/tipo-pedido.service';
import { EstadoPedidoService } from '../../../services/estado-pedido.service';
import { SitiowebPedidoService } from '../../../services/sitioweb-pedido.service';



@Component({
  selector: 'app-agregar-pedido',
  standalone: true,
  imports: [CommonModule, NgFor, ReactiveFormsModule, MatSelectModule, MatDialogModule, MatButtonModule,
    MatIcon, MatFormField, MatLabel, FormsModule, MatInputModule, MatFormFieldModule,
    MatChipsModule, MatDatepickerModule, MatNativeDateModule, MatHint, IndexListadoArticulosComponent
  ],
  templateUrl: './agregar-pedido.component.html',
  styleUrl: './agregar-pedido.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Add this line
})
export class AgregarPedidoComponent {

  readonly date = new FormControl(new Date());
  readonly serializedDate = new FormControl(new Date().toISOString());

  Agregado = new EventEmitter();
  pedidoForm!: FormGroup;

  public ImagePath: any;

  selectedTipoPedido: TipoPedido[] = [];
  selectedEstadoPedido: EstadoPedido[] = [];
  selectedSitioWebPedido: SitioWeb[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private tipopedidos: TipoPedidoService,
    private estadopedidos: EstadoPedidoService,
    private sitioweb: SitiowebPedidoService,
    private router: Router,
    private fb: FormBuilder
  ) {

  }

  ngOnInit(): void {

    this.pedidoForm = new FormGroup<PedidoFormGroup>({
      FechaCreacionPedido: new FormControl<Date | null>(new Date(), { nonNullable: true }),
      FechaArrivoUSA: new FormControl<Date | null>(null, { nonNullable: true }),
      FechaEstimadaRecepcion: new FormControl<Date | null>(null, { nonNullable: true }),
      NumeroTracking1: new FormControl<string | null>('', { nonNullable: true }),
      NumeroTracking2: new FormControl<string | null>(''),
      PesoPedido: new FormControl<number | null>(null),
      SitioWeb: new FormControl<string | null>('', { nonNullable: true }),
      ViaPedido: new FormControl<string | null>('', { nonNullable: true }),
      SubTotalArticulos: new FormControl<number | null>(null),
      ShippingUSA: new FormControl<number | null>(null),
      Impuestos: new FormControl<number | null>(null),
      ShuppingNIC: new FormControl<number | null>(null),
      PrecioEstimadoDelPedido: new FormControl<number | null>(null),
      Estado: new FormControl<string | null>(''),
      Comentarios: new FormControl<string | null>('')
    }, {
      validators: CustomDateValidators.datesRelationship()
    }
    );


    this.ImagePath = this.getimagePath("");

    this.tipopedidos.getAll().subscribe((data: TipoPedido[]) => {
      //console.log(data);
      this.selectedTipoPedido = data;
    });

    this.estadopedidos.getAll().subscribe((data: EstadoPedido[]) => {
      //console.log(data);
      this.selectedEstadoPedido = data;
    });

    this.sitioweb.getAll().subscribe((data: SitioWeb[]) => {
      //console.log(data);
      this.selectedSitioWebPedido = data;
    });

  }

  enforceTwoDecimals(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
  
    // Remove leading zeros and limit to 2 decimal places
    const sanitizedValue = value.replace(/^0+(?!\.)/, '').match(/^\d*(\.\d{0,2})?/);
    input.value = sanitizedValue ? sanitizedValue[0] : '';
  }

  adjustTextareaHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Resetea la altura para recalcular
    textarea.style.height = `${textarea.scrollHeight}px`; // Ajusta a la altura del contenido
    // Seleccionamos el mat-form-field que envuelve al textarea
    const matFormField = textarea.closest('.mat-form-field') as HTMLElement | null;

    if (matFormField) {
      // Obtenemos el mat-hint dentro del mat-form-field
      const matHint = matFormField.querySelector('.mat-hint') as HTMLElement | null;

      // Restablecemos la altura del textarea para recalcularla
      textarea.style.height = 'auto';

      // Calculamos la altura máxima disponible para el textarea, restando la altura del mat-hint
      const matHintHeight = matHint ? matHint.offsetHeight : 0; // Altura del contador de caracteres
      const availableHeight = matFormField.offsetHeight - matHintHeight - 20; // Resta un margen de seguridad

      // Ajustamos la altura del textarea según su contenido pero respetando la altura máxima disponible
      const newHeight = Math.min(textarea.scrollHeight, availableHeight);
      textarea.style.height = `${newHeight}px`;
    }
  }



  // Custom filter to disable dates that are not allowed
  dateFilter = (date: Date | null): boolean => {
    const fechaCreacionPedido = this.pedidoForm.get('FechaCreacionPedido')?.value;

    if (!fechaCreacionPedido || !date) return true; // Allow all dates before FechaCreacionPedido is set

    // Disable dates before FechaCreacionPedido
    return date >= fechaCreacionPedido;
  };

  getimagePath(l: string | null) {
    const baseUrl = 'http://localhost:3000'; // Updated to match the Express server port

    if (l == null || l === '') {
      return `${baseUrl}/img-accesorios/GameCube_controller-1731775589376.png`;//agregar imagen del tipo de pedido
    } else {
      return `${baseUrl}/img-accesorios/${l}`;
    }
  }

  fechaValidator(control: AbstractControl): ValidationErrors | null {
    const fechaCreacionPedido = control.get('FechaCreacionPedido')?.value;
    const fechaArrivoUSA = control.get('FechaArrivoUSA')?.value;
    const fechaEstimadaRecepcion = control.get('FechaEstimadaRecepcion')?.value;

    // Ensure FechaArrivoUSA is not before FechaCreacionPedido
    if (fechaArrivoUSA && fechaCreacionPedido && fechaArrivoUSA < fechaCreacionPedido) {
      return { invalidFechaArrivoUSA: 'Fecha Arrivo USA no puede ser antes de Fecha Creación Pedido' };
    }

    // Ensure FechaEstimadaRecepcion is not before FechaCreacionPedido or FechaArrivoUSA
    if (
      fechaEstimadaRecepcion &&
      (fechaEstimadaRecepcion < fechaCreacionPedido || fechaEstimadaRecepcion < fechaArrivoUSA)
    ) {
      return { invalidFechaEstimadaRecepcion: 'Fecha Estimada Recepción no puede ser antes de Fecha Arrivo USA o Fecha Creación Pedido' };
    }

    return null; // No errors
  }

  onSubmit() {    // TODO: Use EventEmitter with form value 

    // Get values of the dates
    const fechaCreacionPedido = this.pedidoForm.get('FechaCreacionPedido')?.value;
    const fechaArrivoUSA = this.pedidoForm.get('FechaArrivoUSA')?.value;
    const fechaEstimadaRecepcion = this.pedidoForm.get('FechaEstimadaRecepcion')?.value;

    // Validation check: Ensure FechaArrivoUSA is not before FechaCreacionPedido
    if (fechaArrivoUSA && fechaCreacionPedido && fechaArrivoUSA < fechaCreacionPedido) {
      alert('Fecha Arrivo USA cannot be before Fecha Creacion Pedido');
      return;
    }

    // Validation check: Ensure FechaEstimadaRecepcion is not before FechaArrivoUSA or FechaCreacionPedido
    if (fechaEstimadaRecepcion && fechaCreacionPedido && fechaArrivoUSA &&
      fechaEstimadaRecepcion < fechaArrivoUSA) {
      alert('Fecha Estimada Recepcion cannot be before Fecha Arrivo USA');
      return;
    }

    // Validation check: Ensure FechaEstimadaRecepcion is not before FechaCreacionPedido
    if (fechaEstimadaRecepcion && fechaCreacionPedido && fechaEstimadaRecepcion < fechaCreacionPedido) {
      alert('Fecha Estimada Recepcion cannot be before Fecha Creacion Pedido');
      return;
    }

    console.log(this.pedidoForm.value);
    console.log("enviado");
    // this.accesorioService.create(this.accesorioForm.value).subscribe((res: any) => {
    //   this.Agregado.emit();
    //   this.router.navigateByUrl('listado-accesorios');
    // })
  }

}
