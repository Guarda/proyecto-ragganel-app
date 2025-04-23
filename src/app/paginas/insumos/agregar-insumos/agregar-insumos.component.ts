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


@Component({
  selector: 'app-agregar-insumos',
  standalone: true,
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
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.categorias.getAll().subscribe((data: CategoriasInsumosBase[]) => {
      // this.keywords.update(() => []);
      this.selectedCategoria = data;
      this.categoria = data[0];
      this.ImagePath = this.getimagePath('kingston-32gb-clase10.jpg');
    })

    this.insumoForm = new FormGroup({
      FabricanteInsumo: new FormControl('', Validators.required),
      CateInsumo: new FormControl('', Validators.required),
      SubCategoriaInsumo: new FormControl('', Validators.required),
      IdModeloInsumosPK: new FormControl('', Validators.required),
      PrecioBase: new FormControl('', Validators.required),
      Cantidad: new FormControl('', Validators.required),
      StockMinimo: new FormControl('', Validators.required),
      EstadoInsumo: new FormControl(1, Validators.required),
      ComentarioInsumo: new FormControl(''),
      NumeroSerie: new FormControl('')
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

  onSubmit() {    // TODO: Use EventEmitter with form value 
    // console.log(this.insumoForm.value);
    // console.log("enviado");
    this.insumosService.create(this.insumoForm.value).subscribe((res: any) => {
      this.Agregado.emit();
      this.router.navigateByUrl('home/listado-insumos');
    })

  }

}
