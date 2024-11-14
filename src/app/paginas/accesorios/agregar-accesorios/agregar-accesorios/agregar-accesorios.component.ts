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

import { CategoriasAccesoriosService } from '../../../../services/categorias-accesorios.service';
import { EstadosConsolas } from '../../../interfaces/estados';
import { EstadoConsolasService } from '../../../../services/estado-consolas.service';
import { AccesorioBaseService } from '../../../../services/accesorio-base.service';
import { FabricanteAccesorio } from '../../../interfaces/fabricantesaccesorios';
import { categoriasAccesorios } from '../../../interfaces/categoriasaccesorios';
import { SubcategoriasAccesorios } from '../../../interfaces/subcategoriasaccesorios';


import { FabricanteAccesorioService } from '../../../../services/fabricante-accesorio.service';
import { CategoriaAccesorioService } from '../../../../services/categoria-accesorio.service';
import { SubcategoriaAccesorioService } from '../../../../services/subcategoria-accesorio.service';

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CategoriasAccesoriosBase } from '../../../interfaces/categoriasaccesoriosbase';

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
      TodoList: new FormControl('')
    });

    this.estados.getAll().subscribe((data: EstadosConsolas[]) => {
      //console.log(data);
      this.selectedEstado = data;
    });

    this.fabricanteService.getAll().subscribe((data: FabricanteAccesorio[]) => {
      this.selectedFabricanteAccesorio = data;
    });

    this.categoriaaccesorioService.getAll().subscribe((data: CategoriasAccesoriosBase[]) => {
      this.selectedCategoriaAccesorio = data;
    });

    this.subcategoriaaccesrorioService.getAll().subscribe((data: SubcategoriasAccesorios[]) => {
      this.selectedSubCategoriaAccesorio = data;
    });

    this.accesorioForm.get('TodoList')?.setValue(this.nkeywords());

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
      this.accesorioForm.get('Accesorios')?.setValue(this.keywords()); // Update the form control
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

      this.accesorioForm.get('Accesorios')?.setValue(this.keywords());
      this.accesorioForm.get('Accesorios')?.markAsDirty();
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
      return `${baseUrl}/img-consolas/nestoploader.jpg`;
    } else {
      return `${baseUrl}/img-consolas/${l}`;
    }
  }

  onSubmit() {    // TODO: Use EventEmitter with form value 
    console.log(this.accesorioForm.value);
    console.log("enviado");
    // this.productoService.create(this.accesorioForm.value).subscribe((res: any) => {
    //   this.Agregado.emit();
    //   this.router.navigateByUrl('listado-productos');
    // })

  }

}