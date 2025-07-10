// Archivo: costo-distribucion.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormGroup } from '@angular/forms';

export interface CostosPedido {
  impuestos: number;
  shippingUSA: number;
  shippingNIC: number;
  total: number;
}

const estadoInicialCostos: CostosPedido = { impuestos: 0, shippingUSA: 0, shippingNIC: 0, total: 0 };
const estadoInicialDistribuidos = 0;

@Injectable({
  providedIn: 'root'
})
export class CostoDistribucionService {
  private costosTotalesSource = new BehaviorSubject<CostosPedido>(estadoInicialCostos);
  costosTotales$ = this.costosTotalesSource.asObservable();

  private costosDistribuidosSource = new BehaviorSubject<number>(estadoInicialDistribuidos);
  costosDistribuidos$ = this.costosDistribuidosSource.asObservable();

  constructor() { }

  setCostosIniciales(impuestos: number, shippingUSA: number, shippingNIC: number): void {
    const total = (impuestos || 0) + (shippingUSA || 0) + (shippingNIC || 0);
    this.costosTotalesSource.next({ impuestos, shippingUSA, shippingNIC, total });
  }

  actualizarDistribucion(formularios: FormGroup[]): void {
    const totalDistribuido = formularios.reduce((sum, form) => {
        // Usamos parseFloat para asegurar que el valor sea numérico
        return sum + (parseFloat(form.get('CostoDistribuido')?.value) || 0);
    }, 0);
    this.costosDistribuidosSource.next(totalDistribuido);
  }

  // ✅ PASO 1: AÑADIR ESTE MÉTODO
  /**
   * Resetea los observables a su estado inicial.
   * Se debe llamar cuando el diálogo de ingreso de inventario se cierra.
   */
  reset(): void {
    this.costosTotalesSource.next(estadoInicialCostos);
    this.costosDistribuidosSource.next(estadoInicialDistribuidos);
    console.log('CostoDistribucionService ha sido reseteado.');
  }
}