import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedPedidoService {

  private dataSubjectSubTotalArticulosPedido = new BehaviorSubject<number>(0);
  SubTotalArticulosPedido$ = this.dataSubjectSubTotalArticulosPedido.asObservable();

  subtotalarticulosPedido(newData: number) {
    this.dataSubjectSubTotalArticulosPedido.next(newData);
  }

  private data = {
    SubTotalArticulos: 0,
    Impuestos: 0,
    ShippingUSA: 0,
    ShippingNic: 0,
  };

  private totalSubject = new BehaviorSubject<number>(0);
  total$ = this.totalSubject.asObservable();

  updateField(field: keyof typeof this.data, value: number) {
    this.data[field] = value || 0; // Asigna un valor por defecto de 0
    this.calculateTotal();
  }

  private calculateTotal() {
    const { SubTotalArticulos, Impuestos, ShippingUSA, ShippingNic } = this.data;
    const total = SubTotalArticulos + Impuestos + ShippingUSA + ShippingNic;
    this.totalSubject.next(total);
  }

  constructor() { }
}
