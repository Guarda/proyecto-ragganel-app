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
import { QRCodeModule } from 'angularx-qrcode';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';

import { AccesoriosBase } from '../../interfaces/accesoriosbase';
import { CategoriasAccesoriosBase } from '../../interfaces/categoriasaccesoriosbase';
import { FabricanteAccesorio } from '../../interfaces/fabricantesaccesorios';
import { categoriasAccesorios } from '../../interfaces/categoriasaccesorios';
import { SubcategoriasAccesorios } from '../../interfaces/subcategoriasaccesorios';
import { TareasAccesorio } from '../../interfaces/tareasaccesorios';
import { EstadosConsolas } from '../../interfaces/estados';

import { AccesorioBaseService } from '../../../services/accesorio-base.service';
import { FabricanteAccesorioService } from '../../../services/fabricante-accesorio.service';
import { CategoriaAccesorioService } from '../../../services/categoria-accesorio.service';
import { SubcategoriaAccesorioService } from '../../../services/subcategoria-accesorio.service';
import { TareasAccesoriosService } from '../../../services/tareas-accesorios.service';
import { CategoriasAccesoriosService } from '../../../services/categorias-accesorios.service';
import { EliminarAccesoriosComponent } from '../eliminar-accesorios/eliminar-accesorios.component';



@Component({
  selector: 'app-ver-accesorio',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, MatFormField, MatLabel, NgFor, NgIf, MatOption, MatInputModule, MatOptionModule
    , MatSelectModule, MatButtonModule, MatIcon, FormsModule, MatFormFieldModule, MatChipsModule, QRCodeModule, MatCheckboxModule],
  templateUrl: './ver-accesorio.component.html',
  styleUrl: './ver-accesorio.component.css'
})
export class VerAccesorioComponent {
  keywords = signal(['']);
  announcer = inject(LiveAnnouncer);

  accesorioForm!: FormGroup;
  tareasForm!: FormGroup;

  id!: any;

  accesorio!: AccesoriosBase;

  categoria!: CategoriasAccesoriosBase;
  categoriasconsolas: CategoriasAccesoriosBase[] = [];
  selectedCategoria: CategoriasAccesoriosBase[] = [];

  estadoconsolas: EstadosConsolas[] = [];
  selectedEstado: EstadosConsolas[] = [];

  tareasproducto: TareasAccesorio[] = [];
  tasks: TareasAccesorio[] = [
    // Your initial tasks data
  ];

  selectedFabricante: FabricanteAccesorio[] = [];
  selectedCategoriaAccesorio: categoriasAccesorios[] = [];
  selectedSubCategoriaAccesorio: SubcategoriasAccesorios[] = [];

  public accessorieId: any;
  public accessorieCode: any;
  public accessorieColor: any;
  public accessorieState: any;
  public accessorieComment: any;
  public accessoriePrice: any;
  public accessorieManufacturer: any;
  public accessorieCate: any;
  public accessorieSubCate: any;
  public accessorieSerialCode: any;
  public accessorieCompatibleProducts: any;

  public ImagePath: any;

  constructor(public categorias: CategoriasAccesoriosService,
    public estados: EstadoConsolasService,
    public accesorioService: AccesorioBaseService,
    public fabricanteaccesorioService: FabricanteAccesorioService,
    public categoriaaccesorioService: CategoriasAccesoriosService,
    public subcategoriaaccesorioService: SubcategoriaAccesorioService,
    public tareasaccesorioService: TareasAccesoriosService,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {

    this.id = this.route.snapshot.params['CodigoAccesorio'];
    this.accessorieId = this.id;
    console.log('codigo accesirio es: ',this.id);

    this.accesorioService.find(this.id).subscribe((data) => {
      this.accesorio = data[0];
      this.accessorieId = this.id;
      this.accessorieCode = this.accesorio.ModeloAccesorio;
      this.accessorieColor = this.accesorio.ColorAccesorio;
      this.accessorieState = this.accesorio.EstadoAccesorio;
      this.accessorieComment = this.accesorio.Comentario;
      this.accessoriePrice = this.accesorio.PrecioBase;
      this.accessorieManufacturer = this.accesorio.FabricanteAccesorio;
      this.accessorieCate = this.accesorio.CategoriaAccesorio;
      this.accessorieSubCate = this.accesorio.SubcategoriaAccesorio;
      this.accessorieSerialCode = this.accesorio.NumeroSerie;
      this.accessorieCompatibleProducts = this.accesorio.ProductosCompatibles.split(',');


      this.categorias.find(this.accessorieCode).subscribe((data) => {
        this.categoria = data[0];
        this.ImagePath = this.getimagePath(this.categoria.LinkImagen);
        this.accessorieManufacturer = this.categoria.FabricanteAccesorio;
        console.log(this.accessorieManufacturer)
      });

      this.estados.getAll().subscribe((data: EstadosConsolas[]) => {
        // console.log(data);
        this.selectedEstado = data;
      })

      //FABRICANTE
      this.fabricanteaccesorioService.getAllBase().subscribe((data: FabricanteAccesorio[]) => {
        // console.log(data);
        this.selectedFabricante = data;
      })

      //CATEGORIA
      this.categoriaaccesorioService.getAllBase().subscribe((data: categoriasAccesorios[]) => {
        // console.log(data);
        this.selectedCategoriaAccesorio = data;
      })

      //SUBCATEGORIA
      // this.subcategoriaproductoService.getAll().subscribe((data: SubcategoriasProductos[]) => {
      //    console.log(data);
      //   this.selectedSubCategoriaProducto = data;
      // })

      this.subcategoriaaccesorioService.getAll().subscribe((data: SubcategoriasAccesorios[]) => {
        console.log(data);
        this.selectedSubCategoriaAccesorio = data;
      })

      //ACCESORIOS
      console.log(this.accessorieCompatibleProducts);
      this.keywords.update(() => []);        
      for (var val of this.accessorieCompatibleProducts) {             
        this.addt(this.trackByComaptibleProduct(val.index, val)); // prints values: 10, 20, 30, 40
        console.log(val)
       }       


      // console.log(this.consoleHack);      

      //Initialize the form with the product data
      this.accesorioForm = this.fb.group({
        FabricanteAccesorio: [this.accessorieManufacturer],
        IdModeloAccesorioPK: [this.accessorieCode],
        ColorAccesorio: [this.accessorieColor],
        EstadoAccesorio: [this.accessorieState],
        ComentarioAccesorio: [this.accessorieComment],
        PrecioBase: [this.formatNumber(this.accessoriePrice)],
        NumeroSerie: [this.accessorieSerialCode],
        CateAccesorio: [this.accessorieCate],
        SubCategoriaAccesorio: [this.accessorieSubCate],
        ProductosCompatibles: [this.accessorieCompatibleProducts]
      });


      this.cdr.detectChanges(); // Ensure view updates

      // this.productoForm.patchValue({
      //   HackC: this.consoleHack,
      //   SubCategoria: this.consoleSubCate
      // });
    });

    this.tareasaccesorioService.find(this.id).subscribe((data: TareasAccesorio[]) => {
      // Map each task to include RealizadoNumber
      this.tasks = data.map(task => ({
        ...task,
        RealizadoNumber: task.Realizado ? 1 : 0 // Set RealizadoNumber based on Realizado
      }));
      console.log('Tareas Form:', this.tasks);
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
      ProductosCompatibles: new FormControl(''),
      NumeroSerie: new FormControl('')
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
    console.log(value);
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

  onCheckboxChange(task: TareasAccesorio) {
    // Toggle the Realizado value between true and false
    task.Realizado = !task.Realizado; // This will toggle the value

    // Assuming that your backend expects 1 for true and 0 for false,
    // you can convert the boolean to a number before sending the update.
    // Llamamos al service para actualizar la tarea
    // Convert to number (1 for true, 0 for false)
    const realizadoValue = task.Realizado ? 1 : 0;
    this.tareasaccesorioService.update(task.IdTareaAccesorioPK,realizadoValue).subscribe((res: any) => {
      console.log(`Task ${task.DescripcionTarea} set to ${task.Realizado}`);      
    }) 
    
  }

  formatNumber(value: number | null) {
    if(value == null){
      return 0;
    }
    else{
      return value.toFixed(2); // Formats the number to 2 decimal places
    }    
  }

  getimagePath(l: string | null) {
    const baseUrl = 'http://localhost:3000'; // Updated to match the Express server port
  
    if (l == null || l === '') {
      return `${baseUrl}/img-accesorios/GameCube_controller-1731775589376.png`;
    } else {
      return `${baseUrl}/img-accesorios/${l}`;
    }
  }

  trackByComaptibleProduct(index: number, compatibleproduct: string): string {
    return compatibleproduct; // or index, depending on your unique identifiers
  }

  public openDialogEliminar(cons: string){
    const dialogRef = this.dialog.open(EliminarAccesoriosComponent, {  
      disableClose: true,   
      data: { value: cons }      
    });
    dialogRef.componentInstance.Borrado.subscribe(() => {
      this.router.navigateByUrl('listado-accesorios');
    });
    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  onSubmit() {    // TODO: Use EventEmitter with form value 
    //console.log(this.productoForm.value);
    if (!this.accesorioForm.dirty) {
      return; // Exit if the form has not been modified
    } 
    this.accesorioForm.value.CodigoAccesorio = this.id;
    console.log(this.accesorioForm.value);
    this.accesorioService.update(this.accesorioForm.value).subscribe((res: any) => {      
      this.ngOnInit();
    })

  }

}
