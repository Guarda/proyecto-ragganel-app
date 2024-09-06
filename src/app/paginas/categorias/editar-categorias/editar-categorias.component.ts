import { ChangeDetectorRef, Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoriasConsolas } from '../../interfaces/categorias';
import { CategoriasConsolasService } from '../../../services/categorias-consolas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';

@Component({
  selector: 'app-editar-categorias',
  standalone: true,
  imports: [MatFormField, MatLabel, FormsModule, MatDialogModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './editar-categorias.component.html',
  styleUrl: './editar-categorias.component.css'
})
export class EditarCategoriasComponent {

  Editado = new EventEmitter();

  categoriaForm!: FormGroup;

  categoria!: CategoriasConsolas;
  categoriasconsolas: CategoriasConsolas[] = [];

  public IdModeloConsolaPK: any;
  public CodigoModeloConsola: any;
  public DescripcionConsola: any;
  public Fabricante: any;
  public LinkImagen: any;
  public ImagePath: any;

  constructor(public categoriaService: CategoriasConsolasService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public idCategory: any
  ) {
  }

  ngOnInit(): void {


    this.categoriaService.find(this.idCategory.value).subscribe((data) => {


      this.categoria = data[0];
      this.IdModeloConsolaPK = this.idCategory.value;
      this.CodigoModeloConsola = this.categoria.CodigoModeloConsola;
      this.DescripcionConsola = this.categoria.DescripcionConsola;
      this.Fabricante = this.categoria.Fabricante;
      this.LinkImagen = this.categoria.LinkImagen;
      this.ImagePath = this.getimagePath(this.categoria.LinkImagen);


      //Initialize the form with the product data
      this.categoriaForm = this.fb.group({
        IdModeloConsolaPK: [this.idCategory.value],      
        CodigoModeloConsola: [this.CodigoModeloConsola],
        DescripcionConsola: [this.DescripcionConsola],
        Fabricante: [this.Fabricante],
        LinkImagen: [this.LinkImagen]
      });
    });

    this.categoriaForm = new FormGroup({
      IdModeloConsolaPK: new FormControl(''),
      CodigoModeloConsola: new FormControl(''),
      DescripcionConsola: new FormControl(''),
      Fabricante: new FormControl(''),
      LinkImagen: new FormControl('')
    });
  }

  getimagePath(l: string | null) {
    if (l == null || l == '') {
      return '/img-consolas/' + 'nestoploader.webp';
    }
    else {
      return '/img-consolas/' + l;
    }
  }

  onSubmit() {    // TODO: Use EventEmitter with form value 
    //console.log(this.productoForm.value); 
    this.categoriaForm.value.CodigoConsola = this.idCategory.value;
    console.log(this.categoriaForm.value);
    this.categoriaService.update(this.categoriaForm.value).subscribe((res: any) => {
      this.Editado.emit();
      this.router.navigateByUrl('listado-categorias');
    })

  }

}
