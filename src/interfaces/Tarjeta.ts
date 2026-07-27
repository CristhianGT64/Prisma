export interface Tarjeta {
    id: string;
    usuarioId: string;
    numero: string;
    titular: string;
    mesExpiracion: number;
    anioExpiracion: number;
    cvv: string;
    tipo: "credito" | "debito";
    esPrincipal: boolean;
}
