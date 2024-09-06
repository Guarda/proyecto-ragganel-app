import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CategoriasConsolas } from '../../interfaces/categorias';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgFor } from '@angular/common';

import { CategoriasConsolasService } from '../../../services/categorias-consolas.service';
import { EstadosConsolas } from '../../interfaces/estados';
import { EstadoConsolasService } from '../../../services/estado-consolas.service';
import { ProductosService } from '../productos.service';

@Component({
  selector: 'app-agregar-produtos',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, MatSelectModule, MatDialogModule, MatButtonModule, MatIcon, MatFormField, MatLabel, FormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './agregar-produtos.component.html',
  styleUrl: './agregar-produtos.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgregarProdutosComponent {

  Agregado = new EventEmitter();

  productoForm!: FormGroup;

  categoriasconsolas: CategoriasConsolas[] = [];
  categoria!: CategoriasConsolas;
  categoria2!: CategoriasConsolas;
  selectedCategoria: any[] = [];

  estadoconsolas: EstadosConsolas[] = [];
  selectedEstado: EstadosConsolas[] = [];

  array: any[] = [];

  public ImagePath: any;


  constructor(
    public categorias: CategoriasConsolasService,
    public estados: EstadoConsolasService,
    public productoService: ProductosService,
    private cdr: ChangeDetectorRef, private router: Router) {

  }

  ngOnInit(): void {
    this.categorias.getAll().subscribe((data: CategoriasConsolas[]) => {
      // Using Object.keys() and map()
      // Convert object to array based on your needs
      this.array = Object.entries(data); // Example      
      this.selectedCategoria = data;
      this.categoria = data[0];
      this.ImagePath = this.getimagePath(this.categoria.LinkImagen);
    })

    this.estados.getAll().subscribe((data: EstadosConsolas[]) => {
      //console.log(data);
      this.selectedEstado = data;
    })

    this.productoForm = new FormGroup({
      IdModeloConsolaPK: new FormControl('',Validators.required),
      ColorConsola: new FormControl(''),
      EstadoConsola: new FormControl('',Validators.required),
      HackConsola: new FormControl('',Validators.required),
      ComentarioConsola: new FormControl('')

    });

    // Watch for changes to the selected category
    this.productoForm.get('IdModeloConsolaPK')?.valueChanges.subscribe(selectedId => {
      this.categorias.find(selectedId).subscribe((data) =>{
        this.categoria2 = data[0];
        this.ImagePath = this.getimagePath(this.categoria2.LinkImagen);
        this.cdr.detectChanges();
      });      
    });
  }

  get f() {

    return this.productoForm.controls;

  }

  getimagePath(l: string | null) {
    if (l == null || l == '') {
      //console.log(l);
      return '/img-consolas/' + 'nestoploader.webp';
    }
    else {
      return '/img-consolas/' + l;
    }
  }

 
  onSubmit() {    // TODO: Use EventEmitter with form value 
    console.log(this.productoForm.value); 
    //console.log("enviado");
    this.productoService.create(this.productoForm.value).subscribe((res: any) => {
      this.Agregado.emit();
      this.router.navigateByUrl('listado-productos');
    })

  }
}
