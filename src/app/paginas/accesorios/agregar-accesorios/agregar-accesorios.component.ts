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

import { CategoriasAccesoriosService } from '../../../services/categorias-accesorios.service';
import { EstadosConsolas } from '../../interfaces/estados';
import { EstadoConsolasService } from '../../../services/estado-consolas.service';
import { AccesorioBaseService } from '../../../services/accesorio-base.service';
import { FabricanteAccesorio } from '../../interfaces/fabricantesaccesorios';
import { categoriasAccesorios } from '../../interfaces/categoriasaccesorios';
import { SubcategoriasAccesorios } from '../../interfaces/subcategoriasaccesorios';


import { FabricanteAccesorioService } from '../../../services/fabricante-accesorio.service';
import { CategoriaAccesorioService } from '../../../services/categoria-accesorio.service';
import { SubcategoriaAccesorioService } from '../../../services/subcategoria-accesorio.service';

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CategoriasAccesoriosBase } from '../../interfaces/categoriasaccesoriosbase';

// import { Categorias}
@Component({
  selector: 'app-agregar-accesorios',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, MatSelectModule, MatDialogModule, MatButtonModule, MatIcon,
    MatFormField, MatLabel, FormsModule, MatInputModule, MatFormFieldModule, MatChipsModule],
  templateUrl: './agregar-accesorios.component.html',
  styleUrl: './agregar-accesorios.component.css'
})
export class AgregarAccesoriosComponent {

  keywords = signal(['']);
  todolistKeywords = signal(['Limpiar']);
  announcer = inject(LiveAnnouncer);

  Agregado = new EventEmitter();

  accesorioForm!: FormGroup;

  categoriasaccesorios: categoriasAccesorios[] = [];
  categoria!: CategoriasAccesoriosBase;
  categoria2!: CategoriasAccesoriosBase;

  selectedCategoria: any[] = [];

  selectedFabricanteAccesorio: FabricanteAccesorio[] = [];
  selectedCategoriaAccesorio: categoriasAccesorios[] = [];
  selectedSubCategoriaAccesorio: SubcategoriasAccesorios[] = [];

  selectedEstado: EstadosConsolas[] = [];

  idModeloAccesorioPK: any;
  FabricanteAccesorio: any;
  CategoriaAccesorio: any;
  SubcategoriaAccesorio: any;

  public ImagePath: any;

  constructor(
    public categorias: CategoriasAccesoriosService,
    public estados: EstadoConsolasService,
    public fabricanteService: FabricanteAccesorioService,
    public categoriaaccesorioService: CategoriaAccesorioService,
    public subcategoriaaccesrorioService: SubcategoriaAccesorioService,
    public accesorioService: AccesorioBaseService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {

  }

  ngOnInit(): void {

    this.categorias.getAll().subscribe((data: CategoriasAccesoriosBase[]) => {
      this.keywords.update(() => []);
      this.selectedCategoria = data;
      this.categoria = data[0];
      this.ImagePath = this.getimagePath(this.categoria.LinkImagen);
    })

    this.accesorioForm = new FormGroup({
      FabricanteAccesorio: new FormControl('', Validators.required),
      CateAccesorio: new FormControl('', Validators.required),
      SubCategoriaAccesorio: new FormControl('', Validators.required),
      IdModeloAccesorioPK: new FormControl('', Validators.required),
      ColorAccesorio: new FormControl(''),
      PrecioBase: new FormControl('', Validators.required),
      EstadoAccesorio: new FormControl('', Validators.required),
      ComentarioAccesorio: new FormControl(''),
      NumeroSerie: new FormControl(''),
      TodoList: new FormControl(''),
      ProductosCompatibles: new FormControl('')
    });

    this.estados.getAll().subscribe((data: EstadosConsolas[]) => {
      //console.log(data);
      this.selectedEstado = data;
    });

    this.fabricanteService.getAll().subscribe((data: FabricanteAccesorio[]) => {
      this.selectedFabricanteAccesorio = data;
    });

    // this.categoriaaccesorioService.getAll().subscribe((data: CategoriasAccesoriosBase[]) => {
    //   this.selectedCategoriaAccesorio = data;
    // });

    // this.subcategoriaaccesrorioService.getAll().subscribe((data: SubcategoriasAccesorios[]) => {
    //   this.selectedSubCategoriaAccesorio = data;
    // });

    this.accesorioForm.get('TodoList')?.setValue(this.nkeywords());

    /*PARA REVISAR SI HAY CAMBIOS EN EL FORM, PARA MANDAR A LLAMAR NUEVAMENTE LA LISTA DE LAS CATEGORIAS ACORDE AL FABRICANTE*/
    this.accesorioForm.get('FabricanteAccesorio')?.valueChanges.subscribe(selectedId => {
      // this.accesorioForm.get('Cate')?.reset();
      // this.accesorioForm.get('SubCategoria')?.reset();
      this.categoriaaccesorioService.find(selectedId).subscribe((data: categoriasAccesorios[]) => {        
        this.selectedCategoriaAccesorio = data;
      })
      this.accesorioForm.get('SubCategoriaAccesorio')?.reset();
    });

    this.accesorioForm.get('CateAccesorio')?.valueChanges.subscribe(selectedId => {      
      this.subcategoriaaccesrorioService.find(selectedId).subscribe((data: SubcategoriasAccesorios[]) => {
        this.selectedSubCategoriaAccesorio = data;
        console.log(data);
      })      
    });

    this.accesorioForm.get('SubCategoriaAccesorio')?.valueChanges.subscribe(selectedId =>{
      //console.log(this.accesorioForm.value.Fabricante, this.accesorioForm.value.Cate, this.accesorioForm.get('SubCategoria')?.value);
      if (this.accesorioForm.value.FabricanteAccesorio != undefined && this.accesorioForm.value.CateAccesorio != undefined &&  this.accesorioForm.get('SubCategoriaAccesorio')?.value != undefined){      
        this.categorias.getbymanufacturer(this.accesorioForm.value.FabricanteAccesorio, this.accesorioForm.value.CateAccesorio, this.accesorioForm.get('SubCategoriaAccesorio')?.value).subscribe((data) => {
          this.idModeloAccesorioPK = data[0].IdModeloAccesorioPK;          

          // //UPDATES THE CHIPS OF ACCESORIES OF GIVEN PRODUCT TYPE
          // this.IdTipoProd = data[0].TipoProducto;
          // this.accesoriosService.find(this.IdTipoProd).subscribe((data) => {     
          //   this.keywords.update(() => []);        
          //   for (var val of data) {             
          //     this.addt(val.DescripcionAccesorio); // prints values: 10, 20, 30, 40
          //   }
          //   //this.keywords.update(() => []); 
          // })
          // console.log(data[0].IdModeloConsolaPK);
          // console.log(this.IdModeloPK);
          this.categorias.find(this.idModeloAccesorioPK).subscribe((data) => {
            this.categoria = data[0];
            this.ImagePath = this.getimagePath(this.categoria.LinkImagen);
            this.cdr.detectChanges();
            this.accesorioForm.get('IdModeloAccesorioPK')?.setValue(this.idModeloAccesorioPK);
          });       
        })
      }
    });  

  }

  removeKeyword(keyword: string) {
    this.keywords.update(keywords => {
      const index = keywords.indexOf(keyword);
      if (index < 0) {
        return keywords;
      }

      keywords.splice(index, 1);
      this.announcer.announce(`removed ${keyword}`);
      return [...keywords];
    });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our keyword
    if (value) {
      this.keywords.update(keywords => [...keywords, value]);
      this.accesorioForm.get('ProductosCompatibles')?.setValue(this.keywords()); // Update the form control
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  addt(valor: String): void {
    const value = (valor || '').trim();

    // Add our keyword
    if (value) {
      this.keywords.update(keywords => [...keywords, value]);
      console.log(this.keywords());

      this.accesorioForm.get('ProductosCompatibles')?.setValue(this.keywords());
      this.accesorioForm.get('ProductosCompatibles')?.markAsDirty();
      // Force change detection
      this.cdr.detectChanges();
    }

    // Clear the input value
    //

  }

  // Helper method to return the current keywords array
  nkeywords(): string[] {
    return this.todolistKeywords();
  }

  removeReactiveKeyword(keyword: string) {
    this.todolistKeywords.update(keywords => {
      const index = keywords.indexOf(keyword);
      if (index < 0) {
        return keywords;
      }

      keywords.splice(index, 1);
      this.announcer.announce(`removed ${keyword} from reactive form`);
      return [...keywords];
    });
  }

  addReactiveKeyword(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our keyword
    if (value) {
      this.todolistKeywords.update(keywords => [...keywords, value]);
      this.accesorioForm.get('TodoList')?.setValue(this.keywords());
      this.announcer.announce(`added ${value} to reactive form`);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  getimagePath(l: string | null) {
    const baseUrl = 'http://localhost:3000'; // Updated to match the Express server port

    if (l == null || l === '') {
      return `${baseUrl}/img-accesorios/GameCube_controller-1731775589376.png`;
    } else {
      return `${baseUrl}/img-accesorios/${l}`;
    }
  }

  ngAfterViewInit() {
    this.accesorioForm.get('SubCategoriaAccesorio')?.valueChanges.subscribe(selectedId =>{
      console.log(selectedId);
    });
  }

  get f() {

    return this.accesorioForm.controls;

  }

  onSubmit() {    // TODO: Use EventEmitter with form value 
    // console.log(this.accesorioForm.value);
    // console.log("enviado");
    this.accesorioService.create(this.accesorioForm.value).subscribe((res: any) => {
      this.Agregado.emit();
      this.router.navigateByUrl('listado-accesorios');
    })

  }

}
