/**
 * @file pre-ingreso-producto.ts
 * @description Define la estructura de los datos de un producto guardado
 *              temporalmente durante el ingreso de un pedido.
 */
export interface PreIngresoProducto {
  IdPreIngresoProductoPK: number;
  IdCodigoPedidoFK: string;
  IdUsuarioFK: number;
  FormIndex: number;
  Modelo: number;
  Color: string;
  Estado: number;
  Hackeado: number; // 0 o 1
  Comentario: string;
  PrecioBase: number;
  CostoDistribuido: number;
  NumeroSerie: string;
  Accesorios: string; // Viene como string separado por comas
  FechaCreacion: string; // ISO Date String
  TareasPendientes: string; // Viene como string separado por comas
}