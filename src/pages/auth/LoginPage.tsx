import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useApp } from "../../context/AppContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, usuarioActual } = useApp();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (usuarioActual) {
      navigate("/inicio", { replace: true });
    }
  }, [usuarioActual, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const success = await login(correo, password);
    setLoading(false);
    if (!success) {
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-white flex flex-col justify-between overflow-y-auto">
      {/* Header con Logo Oficial e Identidad */}
      <div className="flex flex-col items-center justify-center pt-8 pb-4 px-6 text-center">
        {/* SVG Nativo Oficial de PRISMA */}
        <div className="w-full max-w-[280px] h-auto my-2">
          <svg
            viewBox="0 0 1703 558"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path d="M1653.09 376.352L1637.56 330.276H1559.48L1543.96 376.352H1495.03L1570.62 181.986H1626.13L1702.01 376.352H1653.09ZM1626.72 295.851L1611.19 250.835C1610.22 247.834 1608.9 243.994 1607.24 239.316C1605.68 234.549 1604.06 229.739 1602.4 224.884C1600.84 219.941 1599.57 215.66 1598.6 212.041C1597.62 215.66 1596.25 220.162 1594.49 225.546C1592.83 230.842 1591.22 235.873 1589.66 240.64C1588.1 245.406 1586.97 248.805 1586.29 250.835L1570.91 295.851H1626.72Z" fill="black"/>
            <path d="M1329.65 376.352L1278.09 224.487H1276.77C1276.96 228.106 1277.26 233.578 1277.65 240.905C1278.14 248.143 1278.58 255.866 1278.97 264.075C1279.36 272.284 1279.55 279.698 1279.55 286.319V376.352H1238.98V182.78H1300.79L1351.48 330.806H1352.36L1406.12 182.78H1467.93V376.352H1425.6V284.73C1425.6 278.639 1425.7 271.622 1425.89 263.678C1426.18 255.734 1426.53 248.187 1426.92 241.037C1427.31 233.799 1427.6 228.371 1427.79 224.752H1426.48L1371.25 376.352H1329.65Z" fill="black"/>
            <path d="M1200.16 322.597C1200.16 334.072 1197.08 344.046 1190.93 352.52C1184.78 360.993 1175.79 367.525 1163.98 372.115C1152.26 376.705 1138 379 1121.2 379C1113.78 379 1106.51 378.559 1099.38 377.676C1092.35 376.793 1085.56 375.513 1079.02 373.836C1072.57 372.071 1066.42 369.908 1060.56 367.349V329.217C1070.71 333.277 1081.26 336.94 1092.2 340.206C1103.14 343.472 1113.98 345.105 1124.72 345.105C1132.14 345.105 1138.1 344.222 1142.59 342.457C1147.18 340.692 1150.5 338.264 1152.55 335.175C1154.6 332.086 1155.63 328.555 1155.63 324.583C1155.63 319.728 1153.82 315.579 1150.21 312.137C1146.59 308.695 1141.61 305.473 1135.27 302.472C1129.02 299.471 1121.94 296.249 1114.03 292.806C1109.04 290.688 1103.62 288.128 1097.77 285.127C1091.91 282.038 1086.34 278.286 1081.07 273.873C1075.79 269.46 1071.45 264.119 1068.03 257.852C1064.71 251.497 1063.05 243.906 1063.05 235.079C1063.05 223.516 1065.98 213.63 1071.84 205.421C1077.7 197.212 1086.05 190.945 1096.89 186.62C1107.82 182.207 1120.71 180 1135.56 180C1146.69 180 1157.29 181.192 1167.35 183.575C1177.5 185.87 1188.1 189.224 1199.13 193.637L1184.48 225.546C1174.62 221.927 1165.78 219.147 1157.97 217.205C1150.16 215.175 1142.2 214.16 1134.09 214.16C1128.43 214.16 1123.6 214.998 1119.59 216.675C1115.59 218.264 1112.56 220.559 1110.51 223.56C1108.46 226.473 1107.43 229.871 1107.43 233.755C1107.43 238.345 1108.9 242.229 1111.83 245.407C1114.86 248.496 1119.35 251.497 1125.3 254.41C1131.36 257.323 1138.88 260.721 1147.86 264.605C1158.8 269.283 1168.13 274.182 1175.84 279.301C1183.65 284.333 1189.66 290.291 1193.86 297.176C1198.06 303.972 1200.16 312.446 1200.16 322.597Z" fill="black"/>
            <path d="M974.426 376.352V182.78H1019.84V376.352H974.426Z" fill="black"/>
            <path d="M838.781 182.78C858.215 182.78 874.23 184.899 886.828 189.136C899.523 193.372 908.947 199.772 915.1 208.334C921.252 216.896 924.328 227.709 924.328 240.772C924.328 249.599 922.473 257.323 918.762 263.943C915.051 270.563 910.168 276.168 904.113 280.758C898.059 285.348 891.516 289.099 884.484 292.012L947.473 376.352H897.082L845.959 302.074H821.789V376.352H776.379V182.78H838.781ZM835.559 216.41H821.789V268.709H836.438C851.477 268.709 862.219 266.458 868.664 261.957C875.207 257.367 878.479 250.658 878.479 241.832C878.479 232.652 874.963 226.12 867.932 222.236C860.998 218.352 850.207 216.41 835.559 216.41Z" fill="black"/>
            <path d="M656.408 182.78C684.045 182.78 704.211 188.165 716.906 198.933C729.602 209.614 735.949 224.354 735.949 243.156C735.949 251.629 734.533 259.75 731.701 267.517C728.869 275.197 724.23 282.038 717.785 288.04C711.438 294.042 702.941 298.808 692.297 302.339C681.652 305.782 668.518 307.503 652.893 307.503H633.41V376.352H588V182.78H656.408ZM654.064 216.41H633.41V273.873H648.352C656.848 273.873 664.221 272.858 670.471 270.828C676.721 268.797 681.555 265.62 684.973 261.295C688.391 256.969 690.1 251.409 690.1 244.612C690.1 235.079 687.17 228.018 681.311 223.428C675.451 218.749 666.369 216.41 654.064 216.41Z" fill="black"/>
            <rect width="538" height="558" rx="20" fill="#F58B01"/>
            <rect x="254" y="316" width="30" height="185" rx="15" fill="white"/>
            <rect x="254" y="50" width="30" height="147" rx="15" fill="white"/>
            <rect x="386" y="313" width="30" height="234" rx="15" transform="rotate(90 386 313)" fill="white"/>
            <rect x="458" y="168" width="30" height="340" rx="15" fill="white"/>
            <rect x="50" y="169" width="30" height="340" rx="15" fill="white"/>
            <rect x="356" y="409" width="30" height="131" rx="15" transform="rotate(-90 356 409)" fill="white"/>
            <rect x="386" y="492" width="30" height="113" rx="15" transform="rotate(180 386 492)" fill="white"/>
            <rect width="30" height="131" rx="15" transform="matrix(0 -1 -1 0 182 409)" fill="white"/>
            <rect width="30" height="116" rx="15" transform="matrix(1 0 0 -1 152 495)" fill="white"/>
            <rect x="51" y="508" width="30" height="437" rx="15" transform="rotate(-90 51 508)" fill="white"/>
            <path d="M251.679 160C259.377 146.667 278.623 146.667 286.321 160L316.631 212.5C324.329 225.833 314.707 242.5 299.311 242.5H238.689C223.293 242.5 213.671 225.833 221.369 212.5L251.679 160Z" fill="white"/>
            <rect x="75" y="398" width="85" height="85" fill="white"/>
            <rect x="386" y="397" width="87" height="87" fill="white"/>
            <rect x="250" y="70.9807" width="30" height="262" rx="15" transform="rotate(-60 250 70.9807)" fill="white"/>
            <rect width="30" height="262" rx="15" transform="matrix(-0.5 -0.866025 -0.866025 0.5 288.569 70.9808)" fill="white"/>
          </svg>
        </div>

        {/* Eslogan */}
        <p className="text-[#F58B01] font-bold text-lg mt-3">
          Encuentra tu nuevo espacio
        </p>
      </div>

      {/* Contenedor Turquesa Redondeado Superior */}
      <div className="bg-[#079fa0] rounded-t-[35px] px-6 pt-8 pb-10 flex-1 flex flex-col justify-between shadow-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="bg-red-500/20 border border-white/40 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Campo Correo */}
          <div>
            <label className="block text-white font-bold text-sm mb-1.5">
              Correo electrónico
            </label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
              autoComplete="email"
              className="w-full bg-white rounded-xl px-4 py-3.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F58B01]"
            />
          </div>

          {/* Campo Contraseña */}
          <div>
            <label className="block text-white font-bold text-sm mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full bg-white rounded-xl px-4 py-3.5 pr-10 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F58B01]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Botón Iniciar Sesión Naranja */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F58B01] hover:bg-[#e07f00] text-white font-bold py-3.5 rounded-xl text-base transition-all duration-200 active:scale-95 disabled:opacity-70 mt-2 shadow-sm"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>

          {/* Botón Crear Cuenta Amarillo */}
          <Link
            to="/register"
            className="w-full bg-[#FFC107] hover:bg-[#e0a800] text-white font-bold py-3.5 rounded-xl text-base transition-all duration-200 active:scale-95 text-center shadow-sm"
          >
            Crear cuenta
          </Link>
        </form>

        {/* Iniciar sesión Social */}
        <div className="flex flex-col gap-3 mt-6">
          <button
            type="button"
            className="w-full bg-white hover:bg-gray-50 text-gray-800 font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-3 shadow-sm transition-all duration-200 active:scale-95"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Iniciar sesión con google
          </button>

          <button
            type="button"
            className="w-full bg-white hover:bg-gray-50 text-gray-800 font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-3 shadow-sm transition-all duration-200 active:scale-95"
          >
            <svg className="w-5 h-5 fill-[#1877F2]" viewBox="0 0 24 24">
              <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.54-4.7 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.5 0-1.96.93-1.96 1.89v2.26h3.34l-.53 3.49h-2.81V24C19.61 23.09 24 18.1 24 12.07z" />
            </svg>
            Iniciar sesión con facebook
          </button>
        </div>
      </div>
    </div>
  );
}