import { ChangeDetectorRef, Component, EventEmitter, inject, Inject, signal } from '@angular/core';
import { CategoriasConsolasService } from '../../../services/categorias-consolas.service';
import { EstadoConsolasService } from '../../../services/estado-consolas.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatOption, MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';

import { ServiciosService } from '../../../services/servicios.service';
import { ServiciosBase } from '../../interfaces/servicios';
import { IndexListadoInsumosComponent } from '../index-listado-insumos/index-listado-insumos.component';
import { ServicioEditar } from '../../interfaces/servicios-editar';
import { IndexListadoInsumosEditarComponent } from '../index-listado-insumos-editar/index-listado-insumos-editar.component';
import { InsumosBase } from '../../interfaces/insumosbase';
import { InsumosBaseService } from '../../../services/insumos-base.service';
import { of, forkJoin, map, Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { CategoriasInsumosBase } from '../../interfaces/categoriasinsumosbase';
import { CategoriasInsumosService } from '../../../services/categorias-insumos.service';
import { SuccessdialogComponent } from '../../../UI/alerts/successdialog/successdialog.component';

@Component({
    selector: 'app-ver-servicio',
    imports: [RouterModule, ReactiveFormsModule, MatFormField, MatLabel, NgFor, NgIf, MatOption, MatInputModule, MatOptionModule,
        MatSelectModule, MatButtonModule, MatIcon, FormsModule, MatFormFieldModule, MatChipsModule, IndexListadoInsumosEditarComponent, NgIf, MatInputModule, MatOptionModule, MatLabel],
    templateUrl: './ver-servicio.component.html',
    styleUrl: './ver-servicio.component.css'
})
export class VerServicioComponent {
  insumo: InsumosBase[] = [];
  servicioForm!: FormGroup;
  mostrarInsumos = false;
  id!: number;

  servicioActual: ServicioEditar | null = null;

  insumosAgregados: { Codigo: string; Nombre: string; Cantidad: number; LinkImagen?: string }[] = [];

  insumosAsignados: InsumosBase[] = [];
  insumosAsignadosAlServicio: InsumosBase[] = [];
  insumoSeleccionado: any = null;
  cantidadInsumo: number | null = null;

  dataToDisplay: InsumosBase[] = [];

  public serviceId: any;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private servicioService: ServiciosService,
    private route: ActivatedRoute,
    private insumosBaseService: InsumosBaseService,
    private cateinsumoService: CategoriasInsumosService,
    public dialog: MatDialog
  ) {
    this.servicioForm = this.fb.group({
      DescripcionServicio: ['', Validators.required],
      PrecioBase: [null, [Validators.required, Validators.min(0)]],
      EstadoServicioFK: ['', Validators.required],
      Fecha_Ingreso: ['', Validators.required],
      Comentario: ['']
    });
  }

  ngOnInit() {
  // Usamos switchMap para cambiar del observable de la ruta a nuestras llamadas a la API.
  this.route.paramMap.pipe(
    switchMap(params => {
      // Obtenemos el ID de forma segura.
      const idParam = params.get('CodigoServicio');
      if (idParam) {
        this.id = +idParam; // El '+' convierte el string a número.
        this.serviceId = this.id;

        // forkJoin ejecuta ambas llamadas en paralelo y nos da los resultados juntos.
        return forkJoin({
          servicio: this.servicioService.findById(this.id),
          insumos: this.servicioService.listSupplies(this.id).pipe(
             // Si no hay insumos, la API puede dar error 404. Lo capturamos y devolvemos un array vacío.
            catchError(error => of([])) 
          )
        });
      }
      // Si no hay ID, devolvemos un observable vacío para no continuar.
      return of(null);
    })
  ).subscribe(results => {
    // Solo continuamos si results no es null.
    if (results) {
      // --- Llenamos los datos del servicio ---
      if (results.servicio && results.servicio.length > 0) {
        const servicioData = results.servicio[0] as ServicioEditar;
        this.servicioActual = servicioData;
        this.servicioForm.patchValue({
          DescripcionServicio: servicioData.DescripcionServicio || '',
          PrecioBase: servicioData.PrecioBase || 0,
          EstadoServicioFK: servicioData.Estado || null,
          Fecha_Ingreso: servicioData.Fecha_Ingreso || null,
          Comentario: servicioData.Comentario || ''
        });
      }

      // --- Llenamos los insumos ---
      if (results.insumos && results.insumos.length > 0) {
        this.obtenerInsumosAsignados(results.insumos);
      } else {
        this.insumosAsignados = [];
        this.actualizarDataToDisplay();
      }
    }
  });
}

  obtenerInsumosAsignados(asignaciones: any[]) {
    const requests = asignaciones.map(asignacion =>
      this.insumosBaseService.find(asignacion.CodigoInsumoFK.toString()).pipe(
        switchMap((resInsumoBase: InsumosBase[]) => {
          const insumoBaseInicial = resInsumoBase[0];
          if (!insumoBaseInicial) return of(null);

          const modeloId = insumoBaseInicial.IdModeloInsumosPK || insumoBaseInicial.ModeloInsumo;
          if (!modeloId) return of(this.agregarInsumoBasePorDefecto(insumoBaseInicial, asignacion));

          return this.cateinsumoService.findb(modeloId.toString()).pipe(
            map((resCateBase: CategoriasInsumosBase[]) => {
              const categoriaDetalle = resCateBase[0];
              return this.mapearInsumoCompleto(insumoBaseInicial, categoriaDetalle, asignacion);
            }),
            catchError(() => of(this.agregarInsumoBasePorDefecto(insumoBaseInicial, asignacion)))
          );
        }),
        catchError(() => of(null))
      )
    );

    forkJoin(requests.filter((r): r is Observable<InsumosBase> => r !== null)).subscribe(
      (insumos: (InsumosBase | null)[]) => {
        this.insumosAsignados = insumos.filter((i): i is InsumosBase => i !== null);

        // 🔥 Agregar esto:
        this.insumosAsignadosAlServicio = [...this.insumosAsignados];

        // 🔥 También llenar insumosAgregados desde los asignados
        this.insumosAgregados = this.insumosAsignados.map(insumo => ({
          Codigo: insumo.CodigoInsumo.toString(),
          Nombre: insumo.NombreCategoriaInsumos || 'Nombre desconocido',
          Cantidad: insumo.Cantidad,
          // LinkImagen: insumo.LinkImagen
        }));
        this.actualizarDataToDisplay();
      },
      (error) => {
        console.error('Error en forkJoin:', error);
        this.insumosAsignados = [];
        this.insumosAgregados = []; // también limpiar aquí por consistencia
        this.actualizarDataToDisplay();
      }
    );
  }

  mapearInsumoCompleto(insumoBase: InsumosBase, categoriaDetalle: CategoriasInsumosBase, asignacion: any): InsumosBase {
    return {
      ...insumoBase,
      NombreFabricanteInsumos: categoriaDetalle?.NombreFabricanteInsumos ?? 'Fab. N/D',
      NombreCategoriaInsumos: categoriaDetalle?.NombreCategoriaInsumos ?? 'Cat. N/D',
      NombreSubcategoriaInsumos: categoriaDetalle?.NombreSubcategoriaInsumos ?? 'Subcat. N/D',
      LinkImagen: categoriaDetalle?.LinkImagen ?? '',
      Cantidad: asignacion.CantidadDescargue,
      Activo: insumoBase.Activo !== undefined ? insumoBase.Activo : categoriaDetalle?.Activo ?? true
    };
  }

  agregarInsumoBasePorDefecto(insumoBase: InsumosBase, asignacion: any): InsumosBase {
    return {
      ...insumoBase,
      NombreFabricanteInsumos: 'Fab. Desconocido',
      NombreCategoriaInsumos: 'Cat. Desconocida',
      NombreSubcategoriaInsumos: 'Subcat. Desconocida',
      LinkImagen: '',
      Cantidad: asignacion.CantidadDescargue,
      Activo: insumoBase.Activo !== undefined ? insumoBase.Activo : true
    };
  }

  // Add this method to handle the event
  onInsumoAgregado(event: any): void {
    // Implement the logic for handling the insumoAgregado event
    console.log('Insumo agregado:', event);
    this.insumosAgregados.push(event); // Example logic
  }

  // NUEVO MÉTODO: Invocado cuando el hijo emite (insumoEliminado)
  onInsumoEliminado(insumoEliminadoPorHijo: InsumosBase) {
    console.log('Insumo a eliminar recibido en VerServicioComponent:', insumoEliminadoPorHijo);

    // 1. Eliminar de `insumosAgregados` (la lista para el payload)
    this.insumosAgregados = this.insumosAgregados.filter(i => i.Codigo !== String(insumoEliminadoPorHijo.CodigoInsumo));

    // 2. Eliminar de `insumosAsignadosAlServicio` (la lista detallada que usa este componente)
    this.insumosAsignadosAlServicio = this.insumosAsignadosAlServicio.filter(i => i.CodigoInsumo !== insumoEliminadoPorHijo.CodigoInsumo);

    // 3. Actualizar `dataToDisplay` (que es una copia de `insumosAsignadosAlServicio` para el hijo)
    this.actualizarDataToDisplay();

    console.log('Insumo eliminado. `insumosAgregados` ahora:', this.insumosAgregados);
    console.log('Insumo eliminado. `insumosAsignadosAlServicio` ahora:', this.insumosAsignadosAlServicio);
  }

  agregarInsumo(insumo: { Codigo: string; Nombre: string; Cantidad: number; LinkImagen?: string }) {
    const existe = this.insumosAgregados.find(i => i.Codigo === insumo.Codigo);
    if (existe) {
      existe.Cantidad += insumo.Cantidad;
    } else {
      this.insumosAgregados.push(insumo);
    }

    const yaExiste = this.insumosAsignados.find(i => i.CodigoInsumo === Number(insumo.Codigo));
    if (!yaExiste) {
      const nuevoInsumo: InsumosBase = {
        CodigoInsumo: Number(insumo.Codigo),
        Cantidad: insumo.Cantidad,
        LinkImagen: insumo.LinkImagen ?? '',
        NombreFabricanteInsumos: 'Nuevo',
        NombreCategoriaInsumos: 'Nuevo',
        NombreSubcategoriaInsumos: 'Nuevo',
        Activo: true,
        CodigoInsumoFK: '',
        ModeloInsumo: 0,
        EstadoInsumo: 0,
        FechaIngreso: new Date(),
        Comentario: '',
        NumeroSerie: '',
        StockMinimo: 0,
        PrecioBase: 0,
        IdModeloInsumosPK: 0,
        CodigoModeloInsumos: '',
        CategoriaInsumos: '',
        SubcategoriaInsumos: '',
        FabricanteInsumos: '',
        IdFabricanteInsumosPK: 0,
        IdCategoriaInsumosPK: 0,
        IdFabricanteInsumosFK: 0,
        IdSubcategoriaInsumos: 0,
        IdCategoriaInsumosFK: 0,
        CodigoEstado: 0,
        DescripcionEstado: ''
      };
      this.insumosAsignados.push(nuevoInsumo);
    }

    this.actualizarDataToDisplay();
  }

  actualizarDataToDisplay() {
    this.dataToDisplay = [...this.insumosAsignados];
    this.mostrarInsumos = this.dataToDisplay.length > 0;
    this.cdr.detectChanges();
  }

  actualizarCantidad(insumoActualizado: { Codigo: string; Cantidad: number }) {
    console.log('Actualizar cantidad:', insumoActualizado);
    const item = this.insumosAgregados.find(i => i.Codigo === insumoActualizado.Codigo);
    if (item) {
      item.Cantidad = insumoActualizado.Cantidad;
    }
  }

  toggleInsumos() {
    this.mostrarInsumos = !this.mostrarInsumos;
  }

  get textoBotonInsumos(): string {
    if (this.mostrarInsumos) return 'Ocultar Insumos';
    if (this.dataToDisplay.length > 0) return 'Ver Insumos';
    return 'Ingresar Insumos';
  }

  confirmarCambios() {
    if (this.servicioForm.invalid) return;

    const servicioEditado = this.servicioForm.value;
    const payload = {
      ...servicioEditado,
      CodigoServicio: this.serviceId,
      InsumosAgregados: this.insumosAgregados
    };

    this.servicioService.update(payload).subscribe(
      (response) => {
        console.log('Servicio actualizado:', response);
        // alert('Servicio actualizado con éxito');
        this.dialog.open(SuccessdialogComponent); // Mostrar el diálogo de éxito
        //this.router.navigate(['/servicios']);
      },
      (error) => {
        console.error('Error al actualizar el servicio:', error);
        alert('Error al actualizar el servicio');
      }
    );
  }

  eliminarServicio() {
    if (!this.serviceId) return;

    const confirmacion = confirm('¿Estás seguro de que deseas eliminar este servicio?');
    if (confirmacion) {
      // Lógica para eliminar
    }
  }
}