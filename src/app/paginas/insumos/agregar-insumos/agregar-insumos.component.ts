import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgFor } from '@angular/common';

import { EstadosConsolas } from '../../interfaces/estados';
import { EstadoConsolasService } from '../../../services/estado-consolas.service';
// import { CategoriasInsumosservice}
import { InsumosBaseService } from '../../../services/insumos-base.service';
import { FabricanteInsumos } from '../../interfaces/fabricantesinsumos';
import { categoriasInsumos } from '../../interfaces/categoriasinsumos';
import { SubcategoriasInsumos } from '../../interfaces/subcategoriasinsumos';

import { FabricanteInsumoService } from '../../../services/fabricante-insumo.service';
import { CategoriaInsumoService } from '../../../services/categoria-insumo.service';
import { SubcategoriaInsumoService } from '../../../services/subcategoria-insumo.service';
import { CategoriasInsumosService } from '../../../services/categorias-insumos.service';
import { CategoriasInsumosBase } from '../../interfaces/categoriasinsumosbase';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../../UI/session/auth.service'; // ✅ 1. IMPORTACIÓN AÑADIDA


@Component({
    selector: 'app-agregar-insumos',
    imports: [NgFor, ReactiveFormsModule, MatSelectModule, MatDialogModule, MatButtonModule, MatIcon,
        MatFormField, MatLabel, FormsModule, MatInputModule, MatFormFieldModule, MatChipsModule],
    templateUrl: './agregar-insumos.component.html',
    styleUrl: './agregar-insumos.component.css'
})
export class AgregarInsumosComponent {

  Agregado = new EventEmitter();
  insumoForm!: FormGroup;

  selectedCategoria: any[] = [];

  selectedFabricanteInsumos: FabricanteInsumos[] = [];
  selectedCategoriaInsumos: categoriasInsumos[] = [];
  selectedSubcategoriaInsumos: SubcategoriasInsumos[] = [];

  categoria!: CategoriasInsumosBase;
  selectedEstado: EstadosConsolas[] = [];

  idModeloInsumoPK: any;
  FabricanteInsumo: any;
  CategoriaInsumo: any;
  SubcategoriaInsumo: any;

  public ImagePath: any;

  constructor(
    public insumosService: InsumosBaseService,
    public categorias: CategoriasInsumosService,
    public fabricanteService: FabricanteInsumoService,
    public categoriasInsumosService: CategoriaInsumoService,
    public subcategoriasInsumosService: SubcategoriaInsumoService,
    public estados: EstadoConsolasService,
    private authService: AuthService, // ✅ 2. INYECCIÓN DEL SERVICIO DE AUTENTICACIÓN
    private cdr: ChangeDetectorRef,
    private router: Router,
    private dialogRef: MatDialogRef<AgregarInsumosComponent> // <-- ✅ AÑADE ESTA LÍNEA
  ) { }

  ngOnInit(): void {

    this.categorias.getAll().subscribe((data: CategoriasInsumosBase[]) => {
      // this.keywords.update(() => []);
      this.selectedCategoria = data;
      this.categoria = data[0];
      this.ImagePath = this.getimagePath('kingston-32gb-clase10.jpg');
    })

    // ✅ CAMBIO: FormGroup actualizado con todos los validadores
    this.insumoForm = new FormGroup({
      FabricanteInsumo: new FormControl('', Validators.required),
      CateInsumo: new FormControl('', Validators.required),
      SubCategoriaInsumo: new FormControl('', Validators.required),
      IdModeloInsumosPK: new FormControl('', Validators.required),
      
      // --- VALIDACIONES AÑADIDAS ---
      PrecioBase: new FormControl('', [
        Validators.required, 
        Validators.pattern(/^\d{1,4}(\.\d{1,2})?$/), // Para Decimal(6,2)
        Validators.max(9999.99)
      ]),
      
      Cantidad: new FormControl('', [
        Validators.required, 
        Validators.pattern(/^[0-9]+$/), // Solo números enteros
        Validators.min(0) // int unsigned
      ]),
      
      StockMinimo: new FormControl('', [
        Validators.required, 
        Validators.pattern(/^[0-9]+$/), // Solo números enteros
        Validators.min(0) // int unsigned
      ]),
      
      EstadoInsumo: new FormControl(1, Validators.required),
      ComentarioInsumo: new FormControl('', [Validators.maxLength(10000)]), // Límite varchar(10000)
      NumeroSerie: new FormControl('', [Validators.maxLength(100)]) // Límite varchar(100)
    });

    this.estados.getAll().subscribe((data: EstadosConsolas[]) => {
      //console.log(data);
      this.selectedEstado = data;
    });

    this.fabricanteService.getManufacturerWithModel().subscribe((data: FabricanteInsumos[]) => {
      this.selectedFabricanteInsumos = data;
    });

    /*PARA REVISAR SI HAY CAMBIOS EN EL FORM, PARA MANDAR A LLAMAR NUEVAMENTE LA LISTA DE LAS CATEGORIAS ACORDE AL FABRICANTE*/
    this.insumoForm.get('FabricanteInsumo')?.valueChanges.subscribe(selectedId => {
      // this.insumoForm.get('Cate')?.reset();
      // this.insumoForm.get('SubCategoria')?.reset();
      this.categoriasInsumosService.findWithModel(selectedId).subscribe((data: categoriasInsumos[]) => {
        this.selectedCategoriaInsumos = data;
      })
      this.insumoForm.get('SubCategoriaInsumo')?.reset();
    });

    this.insumoForm.get('CateInsumo')?.valueChanges.subscribe(selectedId => {
      this.subcategoriasInsumosService.findWithModel(selectedId).subscribe((data: SubcategoriasInsumos[]) => {
        this.selectedSubcategoriaInsumos = data;
        console.log(data);
      })
    });

    this.insumoForm.get('SubCategoriaInsumo')?.valueChanges.subscribe(selectedId => {
      //console.log(this.insumoForm.value.Fabricante, this.insumoForm.value.Cate, this.insumoForm.get('SubCategoria')?.value);
      if (this.insumoForm.value.FabricanteInsumo != undefined && this.insumoForm.value.CateInsumo != undefined && this.insumoForm.get('SubCategoriaInsumo')?.value != undefined) {
        this.categorias.getbymanufacturer(this.insumoForm.value.FabricanteInsumo, this.insumoForm.value.CateInsumo, this.insumoForm.get('SubCategoriaInsumo')?.value).subscribe((data) => {
          this.idModeloInsumoPK = data[0].IdModeloInsumosPK;
          console.log(data[0]);

          this.categorias.find(this.idModeloInsumoPK).subscribe((data) => {
            this.categoria = data[0];
            this.ImagePath = this.getimagePath(this.categoria.LinkImagen);
            this.cdr.detectChanges();
            this.insumoForm.get('IdModeloInsumosPK')?.setValue(this.idModeloInsumoPK);
          });
        })
      }
    });

  }

  getimagePath(l: string | null) {
    const baseUrl = 'http://localhost:3000'; // Updated to match the Express server port

    if (l == null || l === '') {
      return `${baseUrl}/img-insumos/kingston-32gb-clase10.jpg`;
    } else {
      return `${baseUrl}/img-insumos/${l}`;
    }
  }

  onSubmit() {
    if (this.insumoForm.invalid) {
      return;
    }

    // ✅ 3. Obtener el objeto del usuario actual
    const usuarioActual = this.authService.getUserValue();

    // ✅ 4. Validar que el usuario exista
    if (!usuarioActual) {
      console.error("Error: No se pudo obtener el usuario para registrar el insumo.");
      return;
    }

    // ✅ 5. Construir el objeto de datos incluyendo el ID del usuario
    const insumoData = {
      ...this.insumoForm.value,
      IdUsuario: usuarioActual.id // Se añade la propiedad 'IdUsuario'
    };
    
    // ✅ 6. Enviar los datos completos al servicio
    // --- ✅ CAMBIO CLAVE ---
    // 'res' es el objeto que esperamos del backend (ej: { success: true, action: 'updated', ... })
    this.insumosService.create(insumoData).subscribe((res: any) => {
      this.Agregado.emit();
      
      // En lugar de cerrar con 'true', cerramos con la respuesta completa
      this.dialogRef.close(res); 
    });

  }

}
