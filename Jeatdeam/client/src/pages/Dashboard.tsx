import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

import Icono from '../components/Icono';
import { Logo } from '../components/Header';
import PanelProductos from '../components/dashboard/PanelProductos';
import PanelBanners from '../components/dashboard/PanelBanners';
import PanelCategorias from '../components/dashboard/PanelCategorias';
import PanelSlider from '../components/dashboard/PanelSlider';
import { BOTON_PRINCIPAL, ETIQUETA_CAMPO, INPUT, TARJETA } from '../components/ui';
import { admin } from '../api';

type Pestana = 'productos' | 'banners' | 'categorias' | 'slider';

// herramienta interna: no se enlaza desde la tienda, se entra escribiendo /dashboard
export default function Dashboard() {
    const [sesion, setSesion] = useState<boolean | null>(null);
    const [pestana, setPestana] = useState<Pestana>('productos');
    const [aviso, setAviso] = useState('');
    const temporizador = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        admin.sesion().then((r) => setSesion(r.admin)).catch(() => setSesion(false));
        return () => clearTimeout(temporizador.current);
    }, []);

    const avisar = useCallback((mensaje : string) => {
        setAviso(mensaje);
        clearTimeout(temporizador.current);
        temporizador.current = setTimeout(() => setAviso(''), 3500);
    }, []);

    const salir = async () => {
        await admin.logout().catch(() => null);
        setSesion(false);
    };

    if (sesion === null) return <main className="flex-1 grid place-items-center text-slate-500" role="status">Cargando…</main>;
    if (!sesion) return <Login onEntrar={() => setSesion(true)} />;

    return (
        <div className="flex min-h-screen flex-col">
            {/* fondo blanco de vidrio: el logo va con el texto oscuro */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md ring-1 ring-slate-900/5 shadow-[0_8px_24px_rgba(15,23,42,.06)] text-slate-900">
                <div className="w-[94%] max-w-[1400px] mx-auto h-[76px] flex items-center gap-[14px]">
                    <Logo claro={false} />
                    <span className="hidden sm:inline-flex items-center gap-[6px] rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-100 px-[10px] py-[3px] text-[12px] font-semibold">
                        <Icono nombre="panel" className="size-[14px]" /> Dashboard
                    </span>
                    <div className="ml-auto flex items-center gap-[6px]">
                        <Link to="/" target="_blank" className="hidden sm:inline-flex items-center gap-[6px] rounded-[10px] px-[12px] py-[7px] text-[14px] font-medium hover:bg-slate-900/5">
                            <Icono nombre="externo" className="size-[16px]" /> Ver tienda
                        </Link>
                        <button type="button" onClick={salir} className="inline-flex items-center gap-[6px] rounded-[10px] px-[12px] py-[7px] text-[14px] font-medium hover:bg-slate-900/5">
                            <Icono nombre="salir" className="size-[16px]" /> Salir
                        </button>
                    </div>
                </div>
            </header>

            <main className="w-[94%] max-w-[1400px] mx-auto flex-1 py-[24px]">
                <div className="flex flex-wrap items-end justify-between gap-[12px]">
                    <div>
                        <h1 className="text-[26px] sm:text-[30px] font-bold">Panel de la tienda</h1>
                        <p className="text-[14px] text-slate-600">Los cambios se guardan en el backend y se ven en la tienda al instante.</p>
                    </div>
                    <div role="tablist" aria-label="Secciones" className="inline-flex flex-wrap rounded-[12px] bg-white/55 backdrop-blur-md p-[4px] ring-1 ring-white/80 shadow-[0_8px_30px_rgba(15,23,42,.08)]">
                        {([
                            { id: 'productos', texto: 'Productos', icono: 'paquete' },
                            { id: 'banners', texto: 'Banners', icono: 'etiqueta' },
                            { id: 'categorias', texto: 'Categorías', icono: 'brillo' },
                            { id: 'slider', texto: 'Slider', icono: 'imagen' },
                        ] as const).map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                role="tab"
                                aria-selected={pestana === item.id}
                                onClick={() => setPestana(item.id)}
                                className={`inline-flex items-center gap-[6px] rounded-[9px] px-[14px] py-[8px] text-[14px] font-semibold transition-colors ${pestana === item.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                <Icono nombre={item.icono} className="size-[16px]" /> {item.texto}
                            </button>
                        ))}
                    </div>
                </div>

                <div role="tabpanel" className="mt-[20px]">
                    {pestana === 'productos' && <PanelProductos onAviso={avisar} />}
                    {pestana === 'banners' && <PanelBanners onAviso={avisar} />}
                    {pestana === 'categorias' && <PanelCategorias onAviso={avisar} />}
                    {pestana === 'slider' && <PanelSlider onAviso={avisar} />}
                </div>
            </main>

            {/* aviso flotante tras guardar o borrar */}
            <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-[20px] z-[90] flex justify-center px-[16px]">
                {aviso && (
                    <p className="aparecerVidrio flex items-center gap-[8px] rounded-full bg-slate-900 px-[16px] py-[10px] text-[14px] font-medium text-white shadow-[0_10px_30px_rgba(15,23,42,.35)]">
                        <Icono nombre="check" className="size-[16px] text-[#facc15]" grosor={2.5} /> {aviso}
                    </p>
                )}
            </div>
        </div>
    );
}

function Login({ onEntrar } : { onEntrar : () => void }) {
    const [clave, setClave] = useState('');
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);

    const onSubmit = async (e : FormEvent) => {
        e.preventDefault();
        setEnviando(true);
        setError('');
        try {
            await admin.login(clave);
            onEntrar();
        } catch (e) {
            setError((e as Error).message);
            setEnviando(false);
        }
    };

    return (
        <main className="flex-1 grid place-items-center min-h-screen px-[16px]">
            <form onSubmit={onSubmit} className={`${TARJETA} w-full max-w-[380px] flex flex-col gap-[16px]`}>
                <div className="-mx-[25px] -mt-[25px] mb-[4px] rounded-t-[12.5px] border-b border-slate-900/5 bg-white/80 px-[25px] py-[14px]">
                    <Logo claro={false} />
                </div>
                <div>
                    <h1 className="text-[20px] font-bold">Dashboard</h1>
                    <p className="text-[13px] text-slate-500">Gestiona productos, banners e imágenes del inicio.</p>
                </div>
                <label>
                    <span className={ETIQUETA_CAMPO}>Clave</span>
                    <input type="password" required autoFocus autoComplete="current-password" value={clave} onChange={(e) => setClave(e.target.value)} className={INPUT} />
                </label>
                {error && <p role="alert" className="flex items-center gap-[6px] text-[13px] font-medium text-red-600"><Icono nombre="alerta" className="size-[15px]" /> {error}</p>}
                <button type="submit" disabled={enviando} className={`${BOTON_PRINCIPAL} w-full !py-[11px]`}>
                    <Icono nombre="candado" className="size-[16px]" /> {enviando ? 'Entrando…' : 'Entrar'}
                </button>
                <Link to="/" className="text-center text-[13px] font-semibold text-sky-700 hover:underline">Volver a la tienda</Link>
            </form>
        </main>
    );
}
