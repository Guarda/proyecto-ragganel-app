// src/app/servicios/ui/table-state.service.ts
import { Injectable } from '@angular/core';

export interface TableState {
  filter: string;
  sort: { active: string; direction: 'asc' | 'desc' | '' };
  paginator: { pageIndex: number; pageSize: number };
}

@Injectable({
  providedIn: 'root'
})
export class TableStateService {

  constructor() { }

  private getStateKey(componentId: string): string {
    return `tableState_${componentId}`;
  }

  saveState(componentId: string, state: TableState): void {
    try {
      sessionStorage.setItem(this.getStateKey(componentId), JSON.stringify(state));
    } catch (e) {
      console.error('Error saving state to sessionStorage', e);
    }
  }

  getState(componentId: string): TableState | null {
    try {
      const stateJSON = sessionStorage.getItem(this.getStateKey(componentId));
      return stateJSON ? JSON.parse(stateJSON) : null;
    } catch (e) {
      console.error('Error reading state from sessionStorage', e);
      return null;
    }
  }

  clearState(componentId: string): void {
    sessionStorage.removeItem(this.getStateKey(componentId));
  }
}
