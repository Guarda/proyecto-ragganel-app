import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Output, signal, ViewChild } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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

import { SharedPedidoService } from '../../../services/shared-pedido.service';
import { PedidoService } from '../../../services/pedido.service';

import { ResultadoPedidoDialogComponent } from '../resultado-pedido-dialog/resultado-pedido-dialog.component';
import { debounceTime, merge, Subscription } from 'rxjs';
import { AuthService } from '../../../UI/session/auth.service';
import { Usuarios } from '../../interfaces/usuarios';


@Component({
    selector: 'app-agregar-pedido',
    imports: [CommonModule, NgFor, ReactiveFormsModule, MatSelectModule, MatDialogModule, MatButtonModule,
        MatIcon, MatFormField, MatLabel, FormsModule, MatInputModule, MatFormFieldModule,
        MatChipsModule, MatDatepickerModule, MatNativeDateModule, MatHint, IndexListadoArticulosComponent, MatButton
    ],
    templateUrl: './agregar-pedido.component.html',
    styleUrl: './agregar-pedido.component.css',
    schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class AgregarPedidoComponent implements OnInit, AfterViewInit {

  @ViewChild(IndexListadoArticulosComponent) listadoArticulos!: IndexListadoArticulosComponent;
  
  pedidoForm!: FormGroup;
  public ImagePath: string;
  
  selectedTipoPedido: TipoPedido[] = [];
  selectedEstadoPedido: EstadoPedido[] = [];
  selectedSitioWebPedido: SitioWeb[] = [];
  
  usuario!: Usuarios;

  private formChangesSubscription!: Subscription;
  private subs = new Subscription();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private sharedPedidoService: SharedPedidoService,
    private pedidosService: PedidoService,
    private tipopedidos: TipoPedidoService,
    private estadopedidos: EstadoPedidoService,
    private sitioweb: SitiowebPedidoService,
    private authService: AuthService
  ) {
    this.ImagePath = this.getimagePath("");
  }

  ngOnInit(): void {
    this.initForm();
    this.loadSelectData();
    this.subscribeToSubtotal();
    this.subscribeToFormChanges();
    this.subs.add(this.authService.getUser().subscribe(user => this.usuario = user as unknown as Usuarios));
  }

  ngAfterViewInit(): void {
    // Sincroniza el validador después de que el componente hijo esté disponible
    this.pedidoForm.setValidators(this.validarArticulos.bind(this));
    this.pedidoForm.updateValueAndValidity();
  }

  private initForm(): void {
    this.pedidoForm = this.fb.group({
      FechaCreacionPedido: [new Date(), Validators.required],
      FechaArrivoUSA: [null, Validators.required],
      FechaEstimadaRecepcion: [null, Validators.required],
      NumeroTracking1: ['', Validators.required],
      NumeroTracking2: [''],
      PesoPedido: [null],
      SitioWeb: ['', Validators.required],
      ViaPedido: ['', Validators.required],
      Estado: [1, Validators.required], // Por defecto "En espera"
      Comentarios: ['', Validators.maxLength(2000)],
      // Campos de costos
      SubTotalArticulos: [{ value: 0, disabled: true }], // Campo deshabilitado para mostrar el valor
      Impuestos: [0],
      ShippingUSA: [0],
      ShippingNic: [0],
      // Campo total, deshabilitado y calculado
      PrecioEstimadoDelPedido: [{ value: 0, disabled: true }]
    });
  }

  private loadSelectData(): void {
    this.tipopedidos.getAll().subscribe(data => this.selectedTipoPedido = data);
    this.estadopedidos.getAll().subscribe(data => this.selectedEstadoPedido = data);
    this.sitioweb.getAll().subscribe(data => this.selectedSitioWebPedido = data);
  }

  private subscribeToSubtotal(): void {
    this.sharedPedidoService.SubTotalArticulosPedido$.subscribe(subtotal => {
      // Usa patchValue para actualizar un campo deshabilitado
      this.pedidoForm.patchValue({ SubTotalArticulos: subtotal || 0 });
      this.calcularTotalPedido(); // Recalcula el total cuando el subtotal cambia
    });
  }

   private subscribeToFormChanges(): void {
    // Obtenemos los observables de valueChanges de cada control individualmente
    const impuestos$ = this.pedidoForm.get('Impuestos')!.valueChanges;
    const shippingUSA$ = this.pedidoForm.get('ShippingUSA')!.valueChanges;
    const shippingNic$ = this.pedidoForm.get('ShippingNic')!.valueChanges;

    // Usamos 'merge' para combinarlos en un solo stream
    this.formChangesSubscription = merge(impuestos$, shippingUSA$, shippingNic$)
        .pipe(debounceTime(400)) // Espera 400ms después de la última pulsación
        .subscribe(() => {
            this.calcularTotalPedido();
        });
  }

  calcularTotalPedido(): void {
    const formValues = this.pedidoForm.getRawValue();
    
    const subtotal = parseFloat(formValues.SubTotalArticulos) || 0;
    const impuestos = parseFloat(formValues.Impuestos) || 0;
    const shippingUSA = parseFloat(formValues.ShippingUSA) || 0;
    const shippingNic = parseFloat(formValues.ShippingNic) || 0;

    const total = subtotal + impuestos + shippingUSA + shippingNic;

    this.pedidoForm.patchValue({
      PrecioEstimadoDelPedido: total.toFixed(2)
    });
  }

  enforceTwoDecimals(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Permite solo números y un punto decimal
    value = value.replace(/[^0-9.]/g, '');

    // Asegura que solo haya un punto decimal
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }

    // Limita a dos decimales
    if (parts[1] && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].substring(0, 2);
    }

    input.value = value;
  }
  
  adjustTextareaHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
  
  // Filtro para que las fechas no puedan ser anteriores a la fecha de creación
  dateFilter = (d: Date | null): boolean => {
    const date = d || new Date();
    const fechaCreacion = this.pedidoForm.get('FechaCreacionPedido')?.value;
    if (!fechaCreacion) return true;
    return date.getTime() >= new Date(fechaCreacion).getTime();
  };
  
  validarArticulos(): { [key: string]: any } | null {
    if (this.listadoArticulos && this.listadoArticulos.totalArticulos > 0) {
      return null; // Válido
    }
    return { sinArticulos: 'Debe agregar al menos un artículo al pedido.' }; // Inválido
  }

  getimagePath(l: string | null): string {
    const baseUrl = 'http://localhost:3000';
    return l ? `${baseUrl}/img-accesorios/${l}` : `${baseUrl}/img-accesorios/GameCube_controller-1731775589376.png`;
  }

  onCancel(): void {
    this.router.navigate(['home/listado-pedidos']);
  }

  onSubmit(): void {
    if (this.pedidoForm.invalid) {
      // Marcar todos los campos como "tocados" para mostrar los errores
      this.pedidoForm.markAllAsTouched();
      console.error('El formulario es inválido.');
      // Puedes mostrar una notificación al usuario aquí
      return;
    }

    if (!this.usuario || !this.usuario.id) {
      console.error('Error: El usuario no ha sido cargado todavía o no tiene ID.');
      // Aquí podrías mostrar un mensaje al usuario.
      this.dialog.open(ResultadoPedidoDialogComponent, {
        data: { success: false, message: 'Error de autenticación. Por favor, recargue la página e intente de nuevo.' }
      });
      return;
    }

    const pedidoData = {
      ...this.pedidoForm.getRawValue(),
      articulos: this.listadoArticulos.activeArticulos,
      IdUsuario: this.usuario.id // <-- CAMBIO: Se añade el ID del usuario
    };
    
    // Formatear fechas a YYYY-MM-DD
    pedidoData.FechaCreacionPedido = new Date(pedidoData.FechaCreacionPedido).toISOString().split('T')[0];
    pedidoData.FechaArrivoUSA = new Date(pedidoData.FechaArrivoUSA).toISOString().split('T')[0];
    pedidoData.FechaEstimadaRecepcion = new Date(pedidoData.FechaEstimadaRecepcion).toISOString().split('T')[0];

    this.pedidosService.create(pedidoData).subscribe({
      next: (res: any) => {
        this.dialog.open(ResultadoPedidoDialogComponent, {
          data: { success: true, message: res.message || 'Pedido creado con éxito.' }
        });
        this.router.navigate(['home/listado-pedidos']); // Redirigir después del éxito
      },
      error: (err: any) => {
        this.dialog.open(ResultadoPedidoDialogComponent, {
          data: { success: false, message: err.error?.message || 'Ocurrió un error al crear el pedido.' }
        });
      }
    });
  }
  
  ngOnDestroy(): void {
    if (this.formChangesSubscription) {
      this.formChangesSubscription.unsubscribe();
    }
    // Desuscribirse de todas las suscripciones gestionadas por 'subs'
    this.subs.unsubscribe();
  }
}