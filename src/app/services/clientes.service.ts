import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Cliente } from '../paginas/interfaces/clientes';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private clientesSubject = new BehaviorSubject<any[]>([]);
  clientes$: Observable<any[]> = this.clientesSubject.asObservable();

  private apiURL = 'http://localhost:3000'; // Cambia esta URL por la de tu API

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private httpClient: HttpClient) { }

  // Listar todos los clientes
  getAll(): Observable<any> {
    //console.log(this.httpClient.get(this.apiURL + '/productos/'))   
    return this.httpClient.get(this.apiURL + '/clientes/')
      .pipe(
        catchError(this.errorHandler)
      )
  }

  // Obtener cliente por ID
  getClienteById(id: number): Observable<Cliente> {
    if (!id || isNaN(id)) {
      console.error('El ID proporcionado es inválido:', id);
      throw new Error('El ID proporcionado es inválido');
    }
  
    return this.httpClient.get<Cliente>(`${this.apiURL}/clientes/${id}`, this.httpOptions).pipe(
      catchError(this.errorHandler)
    );
  } 

  // Crear un nuevo cliente
  crearCliente(cliente: Cliente): Observable<any> {
    return this.httpClient.post(this.apiURL + '/clientes/crear-cliente/', JSON.stringify(cliente), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }



  // Actualizar un cliente existente
  updateCliente(cliente: any): Observable<any> {
    // Utiliza el idClientePK para formar la URL dinámica correctamente
    return this.httpClient.put(`${this.apiURL}/clientes/actualizar-cliente/${cliente.IdCliente}`, cliente, this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      );
  }
  

  // // Eliminar un cliente
  eliminar(idcliente: any): Observable<any> {
    // console.log(producto)
    return this.httpClient.put(this.apiURL + '/clientes/eliminar-cliente/' + idcliente, this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  // Manejo de errores
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
