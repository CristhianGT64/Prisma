import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";
import EditarPerfilArrendatario from "./EditarPerfilArrendatario";
import EditarPerfilPersonaNatural from "./EditarPerfilPersonaNatural";
import EditarPerfilEmpresa from "./EditarPerfilEmpresa";

export default function EditarPerfilPage() {
    const navigate = useNavigate();
    const { usuarioActual } = useApp();

    if (!usuarioActual) {
        navigate("/login");
        return null;
    }

    if (usuarioActual.rol === "arrendador") {
        if (usuarioActual.tipoArrendador === "empresa") {
            return <EditarPerfilEmpresa />;
        }
        return <EditarPerfilPersonaNatural />;
    }

    // Default for Arrendatario
    return <EditarPerfilArrendatario />;
}
