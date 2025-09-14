import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-distribution-choice-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './distribution-choice-dialog.component.html',
  styleUrls: ['./distribution-choice-dialog.component.css']
})
export class DistributionChoiceDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DistributionChoiceDialogComponent>
  ) {}

  onChoice(choice: 'manual' | 'inteligente'): void {
    this.dialogRef.close(choice);
  }
}