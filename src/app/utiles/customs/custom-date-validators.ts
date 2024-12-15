import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomDateValidators {
  static datesRelationship(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const FechaCreacionPedido = formGroup.get('FechaCreacionPedido')?.value;
      const FechaArrivoUSA = formGroup.get('FechaArrivoUSA')?.value;
      const FechaEstimadaRecepcion = formGroup.get('FechaEstimadaRecepcion')?.value;

      const errors: any = {};

      if (FechaCreacionPedido && FechaArrivoUSA) {
        if (new Date(FechaArrivoUSA) < new Date(FechaCreacionPedido)) {
          errors.FechaArrivoUSA = 'Fecha Arrivo USA no puede ser anterior a Fecha Creación Pedido';
        }
      }

      if (FechaCreacionPedido && FechaEstimadaRecepcion) {
        if (new Date(FechaEstimadaRecepcion) < new Date(FechaCreacionPedido)) {
          errors.FechaEstimadaRecepcion = 'Fecha Estimada Recepción no puede ser anterior a Fecha Creación Pedido';
        }
      }

      if (FechaArrivoUSA && FechaEstimadaRecepcion) {
        if (new Date(FechaEstimadaRecepcion) < new Date(FechaArrivoUSA)) {
          errors.FechaEstimadaRecepcion = 'Fecha Estimada Recepción no puede ser anterior a Fecha Arrivo USA';
        }
      }

      return Object.keys(errors).length ? errors : null;
    };
  }
}
