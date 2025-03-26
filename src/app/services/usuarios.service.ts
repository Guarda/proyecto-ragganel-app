import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Usuarios } from '../paginas/interfaces/usuarios';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private accessoriesSubject = new BehaviorSubject<any[]>([]);
  accessories$: Observable<any[]> = this.accessoriesSubject.asObservable();

  private apiURL = "http://localhost:3000";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<any> {
    //console.log(this.httpClient.get(this.apiURL + '/productos/'))   
    return this.httpClient.get(this.apiURL + '/usuarios/')
      .pipe(
        catchError(this.errorHandler)
      )
  }

  create(usuario: Usuarios): Observable<any> {
    return this.httpClient.post(this.apiURL + '/usuarios/crear-usuario/', JSON.stringify(usuario), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  update(usuario: Usuarios): Observable<any> {
    console.log(usuario.IdUsuario)
    return this.httpClient.put(this.apiURL + '/usuarios/actualizar-usuario/' + usuario.IdUsuario, JSON.stringify(usuario), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  desactivar(usuario: Usuarios): Observable<any> {
    console.log(usuario.IdUsuario)
    return this.httpClient.put(this.apiURL + '/usuarios/desactivar-usuario/' + usuario.IdUsuario, JSON.stringify(usuario), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  // Método para cambiar la contraseña
changePassword(usuario: Usuarios): Observable<any> {
  console.log(usuario.IdUsuario);
  
  const body = {
    currentPassword: usuario.currentPassword,
    newPassword: usuario.newPassword
  };

  return this.httpClient.put(this.apiURL + '/usuarios/cambiar-password/'+usuario.IdUsuario, JSON.stringify(body), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    );
}



  find(id: string): Observable<any> {
    return this.httpClient.get(this.apiURL + '/usuarios/listar-usuario/' + id)
      .pipe(
        catchError(this.errorHandler)
      )

  }

  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
