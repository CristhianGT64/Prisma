export interface Usuario{
    id: string;
    nombres : string
    apellidos : string
    correo : string
    password : string
    usuarios : string
    telefono : string
    rol: "arrendador" | "arrendatario"
    fotoPerfil?: string
    fechaRegistro?: string
    ocupacion?: string
    empresa?: string
    descripcion?: string

    // Arrendador-specific fields
    tipoArrendador?: "persona_natural" | "empresa"

    // Persona Natural fields
    numeroIdentidad?: string
    fechaNacimiento?: string

    // Empresa fields
    nombreComercial?: string
    razonSocial?: string
    rtnEmpresa?: string
    numeroRegistroMercantil?: string
    giroActividadEconomica?: string
    fechaConstitucion?: string

    // Representante Legal (Empresa)
    representanteLegalNombre?: string
    representanteLegalIdentidad?: string
    representanteLegalCargo?: string
    representanteLegalCorreo?: string
    representanteLegalTelefono?: string

    // Dirección (compartido)
    departamento?: string
    municipio?: string
    direccionExacta?: string

    // Información bancaria (compartido)
    banco?: string
    tipoCuenta?: string
    numeroCuenta?: string
    nombreTitular?: string
    rtn?: string
}