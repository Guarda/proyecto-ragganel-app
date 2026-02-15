import { ChangeDetectorRef, Component, inject, Inject, signal } from '@angular/core';
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
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';

import { InsumosBase } from '../../interfaces/insumosbase';
import { CategoriasInsumosBase } from '../../interfaces/categoriasinsumosbase';
import { FabricanteInsumos } from '../../interfaces/fabricantesinsumos';
import { categoriasInsumos } from '../../interfaces/categoriasinsumos';
import { SubcategoriasInsumos } from '../../interfaces/subcategoriasinsumos';
import { EstadosConsolas } from '../../interfaces/estados';

import { InsumosBaseService } from '../../../services/insumos-base.service';
import { FabricanteInsumoService } from '../../../services/fabricante-insumo.service';
import { CategoriaInsumoService } from '../../../services/categoria-insumo.service';
import { SubcategoriaInsumoService } from '../../../services/subcategoria-insumo.service';
import { CategoriasInsumosService } from '../../../services/categorias-insumos.service';

import { SuccessdialogComponent } from '../../../UI/alerts/successdialog/successdialog.component';
import { EliminarInsumosComponent } from '../eliminar-insumos/eliminar-insumos.component';
import { AuthService } from '../../../UI/session/auth.service';
import { environment } from '../../../../enviroments/enviroments';

@Component({
    selector: 'app-ver-insumo',
    imports: [RouterModule, ReactiveFormsModule, MatFormField, MatLabel, NgFor, NgIf, MatOption, MatInputModule, MatOptionModule,
        MatSelectModule, MatButtonModule, MatIcon, FormsModule, MatFormFieldModule, MatChipsModule, MatCheckboxModule],
    templateUrl: './ver-insumo.component.html',
    styleUrl: './ver-insumo.component.css'
})
export class VerInsumoComponent {

  insumoForm!: FormGroup;

  id!: any;

  insumo!: InsumosBase;

  categoria!: CategoriasInsumosBase;
  categoriasconsolas: CategoriasInsumosBase[] = [];
  selectedCategoria: CategoriasInsumosBase[] = [];

  estadoconsolas: EstadosConsolas[] = [];
  selectedEstado: EstadosConsolas[] = [];

  selectedFabricanteInsumos: FabricanteInsumos[] = [];
  selectedCategoriaInsumos: categoriasInsumos[] = [];
  selectedSubcategoriaInsumos: SubcategoriasInsumos[] = [];

  public supplyId: any;
  public supplyCode: any;
  public supplyState: any;
  public supplyPrice: any;
  public supplyStock: any;
  public supplyMinimumStock: any;
  public supplyComment: any;
  public supplyManufacturer: any;
  public supplyCate: any
  public supplySubCate: any;
  public supplySerialCode: any;

  public ImagePath: any;

  constructor(
    public insumosService: InsumosBaseService,
    public categorias: CategoriasInsumosService,
    public fabricanteService: FabricanteInsumoService,
    public categoriasInsumosService: CategoriaInsumoService,
    public subcategoriasInsumosService: SubcategoriaInsumoService,
    public estados: EstadoConsolasService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private liveAnnouncer: LiveAnnouncer,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private authService: AuthService // <-- ✅ AÑADIR ESTO
  ) {

  }

  ngOnInit(): void {

    this.id = this.route.snapshot.params['CodigoInsumo'];
    console.log(this.id);
    this.supplyId = this.id;

    // ✅ CAMBIO: FormGroup actualizado con todos los validadores
    this.insumoForm = new FormGroup({
      IdModeloInsumoPK: new FormControl('', Validators.required),
      CodigoInsumo: new FormControl(this.supplyCode, Validators.required),
      EstadoInsumo: new FormControl(this.supplyState, Validators.required),
      
      // --- VALIDACIONES AÑADIDAS ---
      PrecioBase: new FormControl(this.supplyPrice, [
        Validators.required, 
        Validators.pattern(/^\d{1,4}(\.\d{1,2})?$/), // Para Decimal(6,2)
        Validators.max(9999.99)
      ]),
      
      Cantidad: new FormControl(this.supplyStock, [
        Validators.required, 
        Validators.pattern(/^[0-9]+$/), // Solo números enteros
        Validators.min(0) // int unsigned
      ]),
      
      StockMinimo: new FormControl(this.supplyMinimumStock, [
        Validators.required, 
        Validators.pattern(/^[0-9]+$/), // Solo números enteros
        Validators.min(0) // int unsigned
      ]),
      Comentario: new FormControl(this.supplyComment, [Validators.maxLength(10000)]), // Límite varchar(10000)
      NumeroSerie: new FormControl(this.supplySerialCode, [Validators.maxLength(100)]), // Límite varchar(100)
      FabricanteInsumos: new FormControl(this.supplyManufacturer, Validators.required),
      CategoriaInsumos: new FormControl(this.supplyCate, Validators.required),
      SubcategoriaInsumos: new FormControl(this.supplySubCate, Validators.required)
    });


    this.insumosService.find(this.id).subscribe((data) => {
      this.insumo = data[0];
      console.log(data[0]);

      this.supplyId = this.id;
      this.supplyCode = this.insumo.ModeloInsumo;
      this.supplyState = this.insumo.EstadoInsumo;
      this.supplyPrice = this.insumo.PrecioBase;
      this.supplyStock = this.insumo.Cantidad;
      this.supplyMinimumStock = this.insumo.StockMinimo;
      this.supplyComment = this.insumo.Comentario;
      this.supplyManufacturer = this.insumo.FabricanteInsumos;
      this.supplyCate = this.insumo.CategoriaInsumos;
      this.supplySubCate = this.insumo.SubcategoriaInsumos;
      this.supplySerialCode = this.insumo.NumeroSerie;

      // console.log('fabri',this.supplyManufacturer);
      // console.log('cate',this.supplyCate);
      // console.log('subcate',this.supplySubCate);

      this.categorias.find(this.supplyCode).subscribe((data: CategoriasInsumosBase[]) => {
        this.categoria = data[0];
        this.ImagePath = this.getimagePath(this.categoria.LinkImagen);
        this.supplyManufacturer = this.insumo.FabricanteInsumos;
      });

      this.estados.getAll().subscribe((data: EstadosConsolas[]) => {
        this.selectedEstado = data;

      });

      this.fabricanteService.getAllBase().subscribe((data: FabricanteInsumos[]) => {
        this.selectedFabricanteInsumos = data;
      });

      this.categoriasInsumosService.getAllBase().subscribe((data: categoriasInsumos[]) => {
        this.selectedCategoriaInsumos = data;
      });

      this.subcategoriasInsumosService.getAll().subscribe((data: SubcategoriasInsumos[]) => {
        this.selectedSubcategoriaInsumos = data;
      });

      //initialization of the form
      this.insumoForm.patchValue({
        FabricanteInsumos: this.supplyManufacturer,
        CategoriaInsumos: this.supplyCate,
        SubcategoriaInsumos: this.supplySubCate,
        EstadoInsumo: this.supplyState,
        PrecioBase: this.supplyPrice,
        Cantidad: this.supplyStock,
        StockMinimo: this.supplyMinimumStock,
        Comentario: this.supplyComment,
        NumeroSerie: this.supplySerialCode,
        CodigoInsumo: this.supplyId,
        IdModeloInsumoPK: this.supplyCode,
      });


      this.cdr.detectChanges();



    })

  }

  // En tu archivo ver-producto.component.ts

  private formatNumber(value: number | string | null): string {
    // Si el valor es nulo o una cadena vacía, devuelve '0.00'
    if (value === null || value === '') {
      return '0.00';
    }

    // Convierte el valor a string y luego a número flotante
    const num = parseFloat(String(value));

    // Si la conversión falla (resulta en NaN), devuelve '0.00'
    if (isNaN(num)) {
      return '0.00';
    }

    // Si todo está bien, formatea el número a 2 decimales
    return num.toFixed(2);
  }


  getimagePath(l: string | null) {
    const baseUrl = environment.apiUrl;

    if (l == null || l === '') {
      return `${baseUrl}/img-insumos/kingston-32gb-clase10.jpg`;
    } else {
      return `${baseUrl}/img-insumos/${l}`;
    }
  }

  public openDialogEliminar(cons: string) {
    const dialogRef = this.dialog.open(EliminarInsumosComponent, {
      disableClose: true,
      data: { value: cons }
    });
    dialogRef.componentInstance.Borrado.subscribe(() => {
      this.router.navigateByUrl('home/listado-insumos');
    });
    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  onSubmit() {
    // --- ✅ AÑADIDO: Guardia de validez ---
    this.insumoForm.markAllAsTouched(); // Muestra los errores
    
    if (this.insumoForm.invalid) {
      console.error('Formulario inválido, no se enviará.');
      return;
    }
    // --- FIN DEL AÑADIDO ---

    if (!this.insumoForm.dirty) {
      return; // Salir si no hay cambios
    }

    // --- ✅ INICIO DE CAMBIOS ---
    // 1. Obtener el ID del usuario actual
    const usuarioId = this.authService.getUserValue()?.id;

    // 2. Validación de seguridad
    if (!usuarioId) {
      console.error("Error: No se pudo obtener el ID del usuario.");
      alert('Error: No se pudo identificar al usuario. Intente iniciar sesión de nuevo.');
      return;
    }

    // 3. Combinar datos del formulario con el ID del usuario
    const dataToSend = {
      ...this.insumoForm.value,
      IdUsuario: usuarioId // Se añade el ID del usuario que modifica
    };
    // --- ✅ FIN DE CAMBIOS ---

    console.log('Datos a enviar:', dataToSend); // Verificar el objeto antes de enviar

    // 4. Enviar los datos combinados al servicio
    this.insumosService.update(dataToSend).subscribe(
      (response) => {
        console.log('Insumo actualizado:', response);
        this.dialog.open(SuccessdialogComponent); // Mostrar el diálogo de éxito
        this.insumoForm.markAsPristine(); // Marcar como no modificado después de guardar
      },
      (error) => {
        console.error('Error al actualizar el insumo:', error);
        alert('Error al actualizar el insumo');
      }
    );
  }
}
