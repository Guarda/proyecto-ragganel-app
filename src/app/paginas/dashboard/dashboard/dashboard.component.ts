import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';

import { DashboardService } from '../../../services/dashboard.service';
import { DashboardData } from '../../interfaces/dashboarddata';

@Component({
    selector: 'app-dashboard',
    imports: [
        CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule,
        MatButtonModule, NgxChartsModule, MatDividerModule
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public dashboardData: DashboardData | null = null;
  public isLoading = true;
  public errorMessage: string | null = null;

  // Opciones para los gráficos
  colorScheme: Color = {
    name: 'vivid',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#3F51B5', '#28a745', '#ffc107', '#dc3545', '#17a2b8', '#6610f2'],
  };

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.cargarDashboard();
  }

  cargarDashboard(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.dashboardService.getDashboardData().subscribe({
      next: (response) => {
        if (response.success) {
          this.dashboardData = response.data;
        } else {
          this.errorMessage = 'Los datos recibidos no son válidos.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'No se pudo cargar la información del dashboard. Intente de nuevo.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  // ===== MEJORA AÑADIDA =====
  // Formatea las fechas del eje X en el gráfico de barras para que sean más cortas
  public dateTickFormatting(val: string): string {
    const date = new Date(val);
    // Formato: "Jul 23"
    return date.toLocaleDateString('es-NI', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  }
}