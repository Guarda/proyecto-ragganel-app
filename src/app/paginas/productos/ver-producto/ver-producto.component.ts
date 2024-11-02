import { ChangeDetectorRef, Component, inject, Inject, signal } from '@angular/core';
import { CategoriasConsolasService } from '../../../services/categorias-consolas.service';
import { EstadoConsolasService } from '../../../services/estado-consolas.service';
import { ProductosService } from '../productos.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

import { Producto } from '../../interfaces/producto';
import { CategoriasConsolas } from '../../interfaces/categorias';
import { EstadosConsolas } from '../../interfaces/estados';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatOption, MatOptionModule } from '@angular/material/core';
import { TipoProducto } from '../../interfaces/tipoproducto';
import { FabricanteProducto } from '../../interfaces/fabricantesproductos';
import { categoriasProductos } from '../../interfaces/categoriasproductos';
import { SubcategoriasProductos } from '../../interfaces/subcategoriasproductos';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FabricanteService } from '../../../services/fabricante.service';
import { CategoriaProductoService } from '../../../services/categoria-producto.service';
import { SubcategoriaProductoService } from '../../../services/subcategoria-producto.service';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { QRCodeModule } from 'angularx-qrcode';
import { MatDialog } from '@angular/material/dialog';

import { TareasProductosService } from '../../../services/tareas-productos.service';
import { TareasProducto } from '../../interfaces/tareasproductos';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { EliminarProductosComponent } from '../eliminar-productos/eliminar-productos.component';


@Component({
  selector: 'app-ver-producto',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, MatFormField, MatLabel, NgFor,NgIf, MatOption, MatInputModule, MatOptionModule
     ,MatSelectModule, MatButtonModule, MatIcon, FormsModule, MatFormFieldModule,  MatChipsModule, QRCodeModule, MatCheckboxModule
  ],
  templateUrl: './ver-producto.component.html',
  styleUrl: './ver-producto.component.css'
})
export class VerProductoComponent {
  keywords = signal(['']);
  announcer = inject(LiveAnnouncer);
  
  productoForm!: FormGroup;
  tareasForm!: FormGroup;

  id!: any;

  producto!: Producto;

  categoria!: CategoriasConsolas;
  categoriasconsolas: CategoriasConsolas[] = [];
  selectedCategoria: CategoriasConsolas[] = [];

  estadoconsolas: EstadosConsolas[] = [];
  selectedEstado: EstadosConsolas[] = [];

  tareasproducto: TareasProducto[] = [];
  tasks: TareasProducto[] = [
    // Your initial tasks data
  ];

  selectedTipoProducto: TipoProducto[] = [];
  selectedFabricante: FabricanteProducto[] = [];
  selectedCategoriaProducto: categoriasProductos[] = [];
  selectedSubCategoriaProducto: SubcategoriasProductos[] = [];

  public ConsoleId: any;
  public consoleCode: any;
  public consoleColor: any;
  public consoleState: any;
  public consoleHack: any;
  public consoleComment: any;
  public consolePrice: any;
  public consoleManufacturer: any;
  public consoleCate: any;
  public consoleSubCate: any;
  public consoleSerialCode: any;
  public consoleAccesories: any;
  // public consoleCurrency: any;

  public ImagePath: any;

  constructor(public categorias: CategoriasConsolasService,
    public estados: EstadoConsolasService,
    public productoService: ProductosService,
    public fabricanteService: FabricanteService,
    public categoriaproductoService: CategoriaProductoService,
    public subcategoriaproductoService: SubcategoriaProductoService,
    public tareasproductoService: TareasProductosService,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog   
  ) {
    
  }

  ngOnInit(): void {

    this.id = this.route.snapshot.params['CodigoConsola'];
    this.ConsoleId = this.id;

    this.productoService.find(this.id).subscribe((data) => {
      this.producto = data[0];
      console.log(data)
      this.ConsoleId = this.id;
      this.consoleCode = this.producto.Modelo;
      this.consoleColor = this.producto.Color;
      this.consoleState = this.producto.Estado;
      this.consoleHack = this.producto.Hack;
      this.consoleComment = this.producto.Comentario;
      this.consolePrice = this.producto.PrecioBase;
      this.consoleManufacturer = this.producto.Fabricante;
      this.consoleCate = this.producto.Categoria;
      this.consoleSubCate = this.producto.Subcategoria;
      this.consoleSerialCode = this.producto.NumeroSerie;
      this.consoleAccesories = this.producto.Accesorios.split(',');
      
      
      this.categorias.find(this.consoleCode).subscribe((data) => {
        this.categoria = data[0];
        this.ImagePath = this.getimagePath(this.categoria.LinkImagen);
        this.consoleManufacturer = this.categoria.Fabricante;
        console.log(this.consoleManufacturer)
      });      
  
      this.estados.getAll().subscribe((data: EstadosConsolas[]) => {
        // console.log(data);
        this.selectedEstado = data;
      })

      //FABRICANTE
      this.fabricanteService.getAllBase().subscribe((data: FabricanteProducto[]) => {
        // console.log(data);
        this.selectedFabricante = data;
      })

      //CATEGORIA
      this.categoriaproductoService.getAllBase().subscribe((data: categoriasProductos[]) => {
        // console.log(data);
        this.selectedCategoriaProducto = data;
      })

      //SUBCATEGORIA
      // this.subcategoriaproductoService.getAll().subscribe((data: SubcategoriasProductos[]) => {
      //    console.log(data);
      //   this.selectedSubCategoriaProducto = data;
      // })

      this.subcategoriaproductoService.findBase(this.consoleCate).subscribe((data: SubcategoriasProductos[]) => {        
        this.selectedSubCategoriaProducto = data;
      }) 

      //ACCESORIOS
      console.log(this.consoleAccesories);
      this.keywords.update(() => []);        
      for (var val of this.consoleAccesories) {             
        this.addt(this.trackByAccessory(val.index, val)); // prints values: 10, 20, 30, 40
        console.log(val)
       }       

      // console.log(this.consoleHack);      
      
      //Initialize the form with the product data
      this.productoForm = this.fb.group({
        Fabricante: [this.consoleManufacturer],
        IdModeloConsolaPK: [this.consoleCode],
        ColorConsola: [this.consoleColor],
        EstadoConsola: [this.consoleState],
        HackConsola: [this.consoleHack],
        ComentarioConsola: [this.consoleComment],
        PrecioBase: [this.formatNumber(this.consolePrice)],
        // Moneda: [this.consoleCurrency]
        NumeroSerie: [this.consoleSerialCode],
        Cate: [this.consoleCate],
        SubCategoria: [this.consoleSubCate],
        Accesorios: [this.consoleAccesories] // Add the parsed array here
      });

      
    this.cdr.detectChanges(); // Ensure view updates

      // this.productoForm.patchValue({
      //   HackC: this.consoleHack,
      //   SubCategoria: this.consoleSubCate
      // });
    });
    
    this.tareasproductoService.find(this.id).subscribe((data: TareasProducto[]) => {
      // Map each task to include RealizadoNumber
      this.tasks = data.map(task => ({
      ...task,
      RealizadoNumber: task.Realizado ? 1 : 0 // Set RealizadoNumber based on Realizado
      }));
      console.log('Tareas Form:', this.tasks);
    }) 

    this.productoForm = new FormGroup({
      Fabricante: new FormControl('',Validators.required),
      Cate: new FormControl('',Validators.required),
      SubCategoria: new FormControl('',Validators.required),
      IdModeloConsolaPK: new FormControl('',Validators.required),
      ColorConsola: new FormControl(''),
      PrecioBase: new FormControl('',Validators.required),
      EstadoConsola: new FormControl('',Validators.required),
      HackConsola: new FormControl('',Validators.required),
      ComentarioConsola: new FormControl(''),
      Accesorios: new FormControl(''),
      NumeroSerie: new FormControl('')      
    });

    
  }

  onCheckboxChange(task: TareasProducto) {
    // Toggle the Realizado value between true and false
    task.Realizado = !task.Realizado; // This will toggle the value

    // Assuming that your backend expects 1 for true and 0 for false,
    // you can convert the boolean to a number before sending the update.
    // Llamamos al service para actualizar la tarea
    // Convert to number (1 for true, 0 for false)
    const realizadoValue = task.Realizado ? 1 : 0;
    this.tareasproductoService.update(task.IdTareaPK,realizadoValue).subscribe((res: any) => {
      console.log(`Task ${task.DescripcionTarea} set to ${task.Realizado}`);      
    }) 
    
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
      this.productoForm.get('Accesorios')?.setValue(this.keywords()); // Update the form control
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  addt(valor: String): void {
    const value = (valor || '').trim();    

    // Add our keyword
    console.log(value);
    if (value) {
      this.keywords.update(keywords => [...keywords, value]);
      console.log(this.keywords());
      
      this.productoForm.get('Accesorios')?.setValue(this.keywords());
      this.productoForm.get('Accesorios')?.markAsDirty(); 
       // Force change detection
      this.cdr.detectChanges();
    }

    // Clear the input value
    //   
  }

  trackByAccessory(index: number, accessory: string): string {
    return accessory; // or index, depending on your unique identifiers
  }

  getimagePath(l: string | null) {
    const baseUrl = 'http://localhost:3000'; // Updated to match the Express server port
  
    if (l == null || l === '') {
      return `${baseUrl}/img-consolas/nestoploader.jpg`;
    } else {
      return `${baseUrl}/img-consolas/${l}`;
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

  public openDialogEliminar(cons: string){
    const dialogRef = this.dialog.open(EliminarProductosComponent, {  
      disableClose: true,   
      data: { value: cons }      
    });
    dialogRef.componentInstance.Borrado.subscribe(() => {
      this.router.navigateByUrl('listado-productos');
    });
    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  

  onSubmit() {    // TODO: Use EventEmitter with form value 
    //console.log(this.productoForm.value);
    if (!this.productoForm.dirty) {
      return; // Exit if the form has not been modified
    } 
    this.productoForm.value.CodigoConsola = this.id;
    console.log(this.productoForm.value);
    this.productoService.update(this.productoForm.value).subscribe((res: any) => {      
      this.ngOnInit();
    })

  }

}
