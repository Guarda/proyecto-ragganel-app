export interface PedidoDashboardItem {
  CodigoPedido: string;
  TotalPedido: number;
  EstadoPedido: string;
  EstadoPedidoFK: number;
  FechaEstimadaRecepcion: string; // Es un string ISO (ej. "2025-12-01T00:00:00.000Z")
  FechaUltimaModificacion: string; // Es un string ISO
  DiasDesdeModificacion: number;
  AlertaAntiguedad: 0 | 1; // Es un booleano numérico (0 o 1)
}