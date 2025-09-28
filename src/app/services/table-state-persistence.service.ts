// src/app/services/table-state-persistence.service.ts

import { Injectable } from '@angular/core';
import { TableState } from '../paginas/interfaces/table-state';

@Injectable({
  providedIn: 'root'
})
export class TableStatePersistenceService {

  constructor() { }

  /**
   * Guarda el estado de una tabla en sessionStorage.
   * @param key Un identificador único para la tabla (ej. 'productosTableState').
   * @param state El objeto de estado de la tabla a guardar.
   */
  saveState(key: string, state: TableState): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.error("Error guardando el estado en sessionStorage", e);
    }
  }

  /**
   * Carga el estado de una tabla desde sessionStorage.
   * @param key El identificador único de la tabla.
   * @returns El objeto de estado de la tabla o null si no se encuentra.
   */
  loadState(key: string): TableState | null {
    try {
      const stateString = sessionStorage.getItem(key);
      if (stateString) {
        return JSON.parse(stateString) as TableState;
      }
      return null;
    } catch (e) {
      console.error("Error cargando el estado desde sessionStorage", e);
      return null;
    }
  }

  /**
   * Limpia el estado de una tabla específica.
   * @param key El identificador único de la tabla.
   */
  clearState(key: string): void {
    sessionStorage.removeItem(key);
  }
}