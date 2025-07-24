import { ChartData } from "./chartdata";
import { Kpis } from "./kpis";
import { StockBajo } from "./stockbajo";
import { UltimaVenta } from "./ultimaventa";

export interface DashboardData {
  kpis: Kpis;
  ventas30Dias: ChartData[];
  topArticulos: ChartData[];
  ventasVendedor: ChartData[];
  ultimasVentas: UltimaVenta[];
  stockBajo: StockBajo[];
  valorInventarioABC: ChartData[];
}