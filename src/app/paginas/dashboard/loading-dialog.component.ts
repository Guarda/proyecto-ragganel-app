import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-loading-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  // Centra el spinner dentro del modal
  template: `
    <div mat-dialog-content style="display: flex; justify-content: center; align-items: center; padding: 20px;">
      <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
    </div>
  `,
})
export class LoadingDialogComponent {
  // Este componente no necesita lógica, solo mostrar el spinner.
}