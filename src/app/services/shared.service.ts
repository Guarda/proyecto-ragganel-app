import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private dataSubjectFabricante = new BehaviorSubject<number>(1);
  private dataSubjectCategoria = new BehaviorSubject<number>(1);

  dataFabricante$ = this.dataSubjectFabricante.asObservable();
  dataCategoria$ = this.dataSubjectCategoria.asObservable();

  codigoFabricante(newData: number) {
    this.dataSubjectFabricante.next(newData);
  }

  codigoCategoria(newData: number){
    this.dataSubjectCategoria.next(newData);
  }
}
