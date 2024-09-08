import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormField, MatLabel, MatSelectModule } from '@angular/material/select';
import { ProductosService } from '../productos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from '../../interfaces/producto';
import { CategoriasConsolas } from '../../interfaces/categorias';
import { EstadosConsolas } from '../../interfaces/estados';
import { CategoriasConsolasService } from '../../../services/categorias-consolas.service';
import { EstadoConsolasService } from '../../../services/estado-consolas.service';

@Component({
  selector: 'app-editar-productos',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule, MatSelectModule, MatDialogModule, MatButtonModule, MatIcon, MatFormField, MatLabel, FormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './editar-productos.component.html',
  styleUrl: './editar-productos.component.css'
})
export class EditarProductosComponent {

  Editado = new EventEmitter();

  productoForm!: FormGroup;
  id!: string;
  producto!: Producto;

  categoria!: CategoriasConsolas;
  categoriasconsolas: CategoriasConsolas[] = [];
  selectedCategoria: CategoriasConsolas[] = [];

  estadoconsolas: EstadosConsolas[] = [];
  selectedEstado: EstadosConsolas[] = [];

  public ConsoleId: any;
  public consoleCode: any;
  public consoleColor: any;
  public consoleState: any;
  public consoleHack: any;
  public consoleComment: any;
  public consolePrice: any;
  public consoleCurrency: any;

  public ImagePath: any;

  consolaEncontrada: any;

  array: any[] = [];

  constructor(public categorias: CategoriasConsolasService,
    public estados: EstadoConsolasService,
    public productoService: ProductosService,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public idConsole: any
    ) {
   
  }

  ngOnInit(): void {
   
    
    this.productoService.find(this.idConsole.value).subscribe((data) => {
      this.producto = data[0];
      this.ConsoleId = this.idConsole.value;
      this.consoleCode = this.producto.IdModeloConsolaPK;
      this.consoleColor = this.producto.Color;
      this.consoleState = this.producto.CodigoEstado;
      this.consoleHack = this.producto.Hack;      
      this.consoleComment = this.producto.Comentario;
      this.consolePrice = this.producto.PrecioBase;
      this.consoleCurrency = this.producto.Moneda;

      this.categorias.find(this.consoleCode).subscribe((data) => {
        this.categoria = data[0];
        this.ImagePath = this.getimagePath(this.categoria.LinkImagen);
      });

      //Initialize the form with the product data
      this.productoForm = this.fb.group({
      IdModeloConsolaPK: [this.consoleCode],
      ColorConsola: [this.consoleColor],
      EstadoConsola: [this.consoleState],
      HackConsola: [this.consoleHack],
      ComentarioConsola: [this.consoleComment],
      PrecioBase: [this.formatNumber(this.consolePrice)],
      Moneda: [this.consoleCurrency]
      });   
    });
    

    this.categorias.getAll().subscribe((data: CategoriasConsolas[]) => {
      
      // Using Object.keys() and map()
      // Convert object to array based on your needs
      this.array = Object.entries(data); // Example
      //console.log(this.array);
      //console.log(data);
      this.selectedCategoria = data;
      
    })

    this.estados.getAll().subscribe((data: EstadosConsolas[]) => {
      //console.log(data);
      this.selectedEstado = data;
    })

    this.productoForm = new FormGroup({
      CodigoConsola: new FormControl(''),
      IdModeloConsolaPK: new FormControl(''),
      ColorConsola: new FormControl(''),
      Moneda: new FormControl('',Validators.required),
      PrecioBase: new FormControl('',Validators.required),
      EstadoConsola: new FormControl('',Validators.required),
      HackConsola: new FormControl('',Validators.required),
      ComentarioConsola: new FormControl('')

    });   
  }
  
  getimagePath(l: string | null) {
    if (l == null || l == '') {
      return '/img-consolas/' + 'nestoploader.jpg';
    }
    else {
      return '/img-consolas/' + l;
    }
  }

  formatNumber(value: number | null) {
    if(value == null){
      return 0;
    }
    else{
      return value.toFixed(2); // Formats the number to 2 decimal places
    }    
  }

  ngAfterViewInit() {
  }


  getProductListDetails() {
    //this.id = this.route.snapshot.params['producto'];         

    

  }

  onSubmit() {    // TODO: Use EventEmitter with form value 
    //console.log(this.productoForm.value); 
    this.productoForm.value.CodigoConsola = this.idConsole.value;
    console.log(this.productoForm.value);
    this.productoService.update(this.productoForm.value).subscribe((res: any) => {
      this.Editado.emit();
      this.router.navigateByUrl('listado-productos');
    })

  }
}
