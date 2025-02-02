import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SharedPedidoService {

  private dataSubjectSubTotalArticulosPedido = new BehaviorSubject<number>(0);
  
  SubTotalArticulosPedido$ = this.dataSubjectSubTotalArticulosPedido.asObservable();

  subtotalarticulosPedido(newData: number) {
    this.data.SubTotalArticulos = newData; // Update stored value
    this.dataSubjectSubTotalArticulosPedido.next(newData);
    this.calculateTotal(); // Recalculate the total
  }
  

  private data = {
    SubTotalArticulos: 0,
    Impuestos: 0,
    ShippingUSA: 0,
    ShippingNic: 0,
  };

  private totalSubject = new BehaviorSubject<number>(0);
  total$ = this.totalSubject.asObservable().pipe(distinctUntilChanged());

  updateField(field: keyof typeof this.data, value: number) {
    this.data[field] = value || 0; // Asigna un valor por defecto de 0
    this.calculateTotal();
  }

  private calculateTotal() {
    setTimeout(() => {
        const { SubTotalArticulos, Impuestos, ShippingUSA, ShippingNic } = this.data;
    
        const total = SubTotalArticulos + Impuestos + ShippingUSA + ShippingNic;
        console.log('servicio', total);

        this.totalSubject.next(total);
    }, 0); // ⚡️ Retraso mínimo para ejecutar en el siguiente ciclo de cambios
}


  constructor() { }
}
