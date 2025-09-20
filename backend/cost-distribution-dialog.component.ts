import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CostDistributionService } from './cost-distribution.service';
import { ModeloDistribucion } from './cost-distribution.service';

@Component({
    selector: 'app-cost-distribution-dialog',
    imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule],
    templateUrl: './cost-distribution-dialog.component.html',
    styleUrls: ['./cost-distribution-dialog.component.css']
})
export class CostDistributionDialogComponent implements OnInit {
  distribucionForm: FormGroup;
  modelos: ModeloDistribucion[] = [];
  totalCostosAdicionales: number = 0;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CostDistributionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { idPedido: string, costosTotales: number },
    private costDistributionService: CostDistributionService
  ) {
    this.totalCostosAdicionales = data.costosTotales;
    this.distribucionForm = this.fb.group({
      modelosArray: this.fb.array([], this.porcentajeTotalValidator)
    });
  }

  ngOnInit(): void {
    this.costDistributionService.getModelos(this.data.idPedido).subscribe(modelos => {
      this.modelos = modelos;
      this.modelos.forEach(modelo => {
        this.modelosArray.push(this.crearModeloFormGroup(modelo));
      });
    });
  }

  get modelosArray(): FormArray {
    return this.distribucionForm.get('modelosArray') as FormArray;
  }

  crearModeloFormGroup(modelo: ModeloDistribucion): FormGroup {
    return this.fb.group({
      IdModeloFK: [modelo.IdModeloPK], // ✅ CORREGIDO: Se alinea el nombre del campo con lo que espera el backend.
      TipoArticuloFK: [modelo.TipoArticuloFK],
      NombreModelo: [modelo.NombreModelo],
      CantidadEnPedido: [modelo.CantidadEnPedido],
      PorcentajeAsignado: [modelo.PorcentajeConfigurado, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  porcentajeTotalValidator(formArray: AbstractControl): { [key: string]: any } | null {
    const total = (formArray as FormArray).controls.reduce((sum, control) => sum + (parseFloat(control.get('PorcentajeAsignado')?.value) || 0), 0);
    return Math.abs(total - 100) > 0.01 ? { 'totalInvalido': true } : null;
  }

  get totalPorcentaje(): number {
    return this.modelosArray.controls.reduce((sum, control) => sum + (parseFloat(control.get('PorcentajeAsignado')?.value) || 0), 0);
  }

  onSave(): void {
    if (this.distribucionForm.invalid) return;
    const distribuciones = this.modelosArray.value;
    this.costDistributionService.saveDistribucion(distribuciones).subscribe(() => {
      this.dialogRef.close(distribuciones);
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}