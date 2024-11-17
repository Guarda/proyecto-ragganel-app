import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private dataSubjectFabricante = new BehaviorSubject<number>(0);
  private dataSubjectCategoria = new BehaviorSubject<number>(0);
  private dataSubjectNombreFabricante  = new BehaviorSubject<string>('');
  private dataSubjectNombreCategoria = new BehaviorSubject<string>('');

  dataFabricante$ = this.dataSubjectFabricante.asObservable();
  dataNombreFabricante$ = this.dataSubjectNombreFabricante.asObservable();
  dataCategoria$ = this.dataSubjectCategoria.asObservable();
  dataNombreCategoria$ = this.dataSubjectNombreCategoria.asObservable();

  codigoFabricante(newData: number) {
    this.dataSubjectFabricante.next(newData);
  }

  nombreFabricante(newData: string){
    this.dataSubjectNombreFabricante.next(newData);
  }

  codigoCategoria(newData: number){
    this.dataSubjectCategoria.next(newData);
  }

  nombreCategoria(newData: string){
    this.dataSubjectNombreCategoria.next(newData);
  }



  private dataSubjectFabricanteAccesorio = new BehaviorSubject<number>(0);
  private dataSubjectCategoriaAccesorio = new BehaviorSubject<number>(0);
  private dataSubjectNombreFabricanteAccesorio  = new BehaviorSubject<string>('');
  private dataSubjectNombreCategoriaAccesorio = new BehaviorSubject<string>('');

  dataFabricanteAccesorio$ = this.dataSubjectFabricanteAccesorio.asObservable();
  dataNombreFabricanteAccesorio$ = this.dataSubjectNombreFabricanteAccesorio.asObservable();
  dataCategoriaAccesorio$ = this.dataSubjectCategoriaAccesorio.asObservable();
  dataNombreCategoriaAccesorio$ = this.dataSubjectNombreCategoriaAccesorio.asObservable();

  codigoFabricanteAccesorio(newData: number) {
    this.dataSubjectFabricanteAccesorio.next(newData);
  }

  nombreFabricanteAccesorio(newData: string){
    this.dataSubjectNombreFabricanteAccesorio.next(newData);
  }

  codigoCategoriaAccesorio(newData: number){
    this.dataSubjectCategoriaAccesorio.next(newData);
  }

  nombreCategoriaAccesorio(newData: string){
    this.dataSubjectNombreCategoriaAccesorio.next(newData);
  }



  //APARTADO PARA LA IMAGEN QUE SE SUBE AL SISTEMA DE LAS CATEGORIAS PRODUCTOS

  private dataSubjectNombreImagen = new BehaviorSubject<string>("");
  dataNombreArchivo$ = this.dataSubjectNombreImagen.asObservable();

  nombreImagen(newData: string){
    this.dataSubjectNombreImagen.next(newData);
  }

  //APARTADO PARA LA IMAGEN QUE SE SUBE AL SISTEMA DE LAS CATEGORIAS ACCESORIOS

  private dataSubjectNombreImagenAccesorio = new BehaviorSubject<string>("");
  dataNombreArchivoAccesorio$ = this.dataSubjectNombreImagenAccesorio.asObservable();

  nombreImagenAccesorio(newData: string){
    this.dataSubjectNombreImagenAccesorio.next(newData);
  }



}
