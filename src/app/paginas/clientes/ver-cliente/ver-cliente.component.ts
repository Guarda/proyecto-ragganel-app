import { ChangeDetectorRef, Component, inject, Inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';


import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatOption, MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { Cliente } from '../../interfaces/clientes';
import { ClientesService } from '../../../services/clientes.service';

import { SuccessdialogComponent } from '../../../UI/alerts/successdialog/successdialog.component';
import { EliminarClienteComponent } from '../eliminar-cliente/eliminar-cliente.component';
import { MatDivider } from '@angular/material/divider';
import { ListadoVentasClienteComponent } from '../listado-ventas-cliente/listado-ventas-cliente.component';


@Component({
  selector: 'app-ver-cliente',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, MatFormField, MatLabel, NgFor, NgIf, MatOption, MatInputModule, MatOptionModule
    , MatSelectModule, MatButtonModule, MatIcon, FormsModule, MatFormFieldModule, SuccessdialogComponent, MatCardModule, MatDivider, ListadoVentasClienteComponent],
  templateUrl: './ver-cliente.component.html',
  styleUrl: './ver-cliente.component.css'
})
export class VerClienteComponent {

  id!: any;
  IdCliente!: any;
  cliente!: Cliente;
  clienteForm!: FormGroup;

  public ImagePath: any;


  constructor(public clientesService: ClientesService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router) {
  }

  ngOnInit(): void {
    // Inicializa el formulario antes de usarlo
    this.clienteForm = new FormGroup({
      IdCliente: new FormControl(null),
      Nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
      Correo: new FormControl('', [Validators.required, Validators.email]),
      DNI: new FormControl(''),
      RUC: new FormControl(''),
      Telefono: new FormControl('', [Validators.pattern(/^\+?\d{1,4}?\d{8,}$/)]),
      Direccion: new FormControl(''),
      FechaRegistro: new FormControl(''),
      Estado: new FormControl(true),
      Comentarios: new FormControl(''), // <-- AÑADIR ESTA LÍNEA
    });

    // Obtén el ID del cliente desde los parámetros de la ruta
    this.id = this.route.snapshot.params['id'];

    // Verifica si el ID es válido
    if (!this.id || isNaN(this.id)) {
      console.error('El ID del cliente no es válido:', this.id);
      this.router.navigate(['/home/listado-clientes']); // Redirige al listado si el ID no es válido
      return;
    }

    this.IdCliente = this.id;
    this.ImagePath = this.getimagePath('');

    // Obtener datos del cliente
    this.clientesService.getClienteById(this.id).subscribe(
      (data) => {
        if (data) {
          this.cliente = data;
          console.log(this.cliente);

          // Actualizar formulario con los datos obtenidos
          this.clienteForm.patchValue({
            IdCliente: this.cliente.idClientePK,
            Nombre: this.cliente.nombreCliente,
            Correo: this.cliente.correoElectronico,
            DNI: this.cliente.dni,
            RUC: this.cliente.ruc,
            Telefono: this.cliente.telefono,
            Direccion: this.cliente.direccion,
            FechaRegistro: this.cliente.fechaRegistro,
            Estado: this.cliente.estado,
             Comentarios: this.cliente.Comentarios,
          });
        }
      },
      (error) => {
        console.error('Error al obtener el cliente:', error);
        this.router.navigate(['/home/listado-clientes']); // Redirige al listado si ocurre un error
      }
    );
  }

  // Método para obtener la ruta de la imagen
  getimagePath(l: string | null): string {
    const baseUrl = 'http://localhost:3000'; // Asegúrate de que este es el puerto correcto de tu servidor
    return l ? `${baseUrl}/assets/${l}` : `${baseUrl}/assets/avatardefault.png`;
  }

  public openDialogEliminar(cons: number) {
    const dialogRef = this.dialog.open(EliminarClienteComponent, {
      disableClose: true,
      data: { value: cons }
    });
    // dialogRef.componentInstance.Borrado.subscribe(() => {
    //   // this.router.navigateByUrl('listado-productos');
    // });
    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }


  onSubmit() {
    console.log(this.clienteForm.value);
    if (this.clienteForm.valid) {
      this.clientesService.updateCliente(this.clienteForm.value).subscribe((res) => {
        if (res.message) {
          this.dialog.open(SuccessdialogComponent); // Mostrar el diálogo de éxito
        }
      });
    }
  }





}
