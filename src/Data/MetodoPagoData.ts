import type { MetodoPago } from "../interfaces/MetodoPago";

export const metodosPago: MetodoPago[] = [
    {
        id: "MP001",
        tipo: "tarjeta_credito",
        nombre: "Tarjeta de Crédito"
    },
    {
        id: "MP002",
        tipo: "tarjeta_debito",
        nombre: "Tarjeta de Débito"
    },
    {
        id: "MP003",
        tipo: "transferencia",
        nombre: "Transferencia Bancaria"
    },
    {
        id: "MP004",
        tipo: "paypal",
        nombre: "PayPal"
    }
];
