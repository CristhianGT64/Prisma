export interface MetodoPago {
    id: string;
    tipo: "tarjeta_credito" | "tarjeta_debito" | "transferencia" | "paypal";
    nombre: string;
}
