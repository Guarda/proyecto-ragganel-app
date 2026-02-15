import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, catchError, debounceTime, switchMap, first } from 'rxjs/operators';
import { environment } from '../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private apiUrl = `${environment.apiUrl}/api/validate`;

  constructor(private http: HttpClient) { }

  /**
   * Verifica si un código de modelo ya existe en la base de datos.
   * @param code El código a verificar.
   */
  checkCodeExists(code: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/code/${code}`);
  }

  /**
   * Validador asíncrono para un FormControl que verifica la existencia de un código.
   * @param getOriginalCode Una función que devuelve el código original del artículo.
   * Esto es crucial para los formularios de edición, para evitar que el validador
   * falle con el propio código del artículo.
   */
  codeExistsValidator(getOriginalCode: () => string | null = () => null): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const currentValue = control.value;
      const originalCode = getOriginalCode();

      // Si el valor está vacío o no ha cambiado del original, no hay nada que validar.
      if (!currentValue || currentValue === originalCode) {
        return of(null);
      }

      // Usamos un temporizador para esperar a que el usuario termine de escribir.
      return timer(500).pipe(
        switchMap(() => this.checkCodeExists(currentValue)),
        map(response => (response.exists ? { codeExists: true } : null))
      );
    };
  }
}