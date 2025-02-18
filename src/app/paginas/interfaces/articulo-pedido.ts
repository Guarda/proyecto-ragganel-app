export interface Articulo {
    IdPedidoDetallePK: string;
    TipoArticulo: number;
    TipoArticuloFK: number;
    NombreTipoArticulo: string;
    Fabricante: number;
    NombreFabricante: string;
    Cate: number;
    NombreCategoria: string;
    SubCategoria: number;
    NombreSubCategoria: string;
    EnlaceCompra: string;
    Cantidad: number;
    Precio: number;
    IdModeloPK: number;
    ImagePath: string;
    Activo: number;
  }