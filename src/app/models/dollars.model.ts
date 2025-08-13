export interface DollarBase {
    casa: string;
    compra: number;
    venta: number;
}

export interface DollarType extends DollarBase {
    fechaActualizacion: Date | string;
    moneda: string;
    nombre: string;
}

export interface DollarYesterday extends DollarBase{
    fecha: Date | string;
}


export const EXCLUDED_DOLLAR_TYPES = ['contadoconliqui', 'mayorista', 'cripto'];