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

  constructor() { }
}
