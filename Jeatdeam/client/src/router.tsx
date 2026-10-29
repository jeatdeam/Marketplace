'use client';
import NextLink from 'next/link';
import { useEffect, type ComponentProps, type ReactNode } from 'react';
import { useParams as useParamsNext, usePathname, useRouter, useSearchParams as useSearchParamsNext } from 'next/navigation';

// la tienda se escribio con react-router; con next.js estas piezas mantienen la misma forma
// (to, end, isActive...) para no reescribir cada componente

type LinkProps = Omit<ComponentProps<typeof NextLink>, 'href'> & { to: string };

export function Link({ to, ...resto } : LinkProps) {
    return <NextLink href={to} {...resto} />;
}

// igual que react-router: sin end, "/productos" tambien queda activo en "/productos/algo"; "/" solo en el inicio
const estaActivo = (pathname : string, to : string, end? : boolean) => {
    const ruta = to.split('?')[0] || '/';
    if (end || ruta === '/') return pathname === ruta;
    return pathname === ruta || pathname.startsWith(`${ruta}/`);
};

interface NavLinkProps extends Omit<LinkProps, 'className' | 'children'> {
    end?: boolean;
    className?: string | ((estado : { isActive : boolean }) => string);
    children?: ReactNode;
}

export function NavLink({ to, end, className, ...resto } : NavLinkProps) {
    const isActive = estaActivo(usePathname(), to, end);
    return (
        <NextLink
            href={to}
            aria-current={isActive ? 'page' : undefined}
            className={typeof className === 'function' ? className({ isActive }) : className}
            {...resto}
        />
    );
}

export function useNavigate() {
    const router = useRouter();
    return (to : string, opciones? : { replace? : boolean }) => (opciones?.replace ? router.replace(to) : router.push(to));
}

export function useLocation() {
    return { pathname: usePathname() };
}

// next entrega los segmentos de la url codificados ("Pack%20de%20dinosaurios")
const decodificar = (valor : string) => {
    try {
        return decodeURIComponent(valor);
    } catch {
        return valor;
    }
};

export function useParams<T extends string = string>() : Partial<Record<T, string>> {
    const params = useParamsNext() ?? {};
    return Object.fromEntries(
        Object.entries(params).map(([clave, valor]) => [clave, decodificar(Array.isArray(valor) ? valor.join('/') : String(valor))]),
    ) as Partial<Record<T, string>>;
}

// cambiar los filtros no sube la pagina (como en react-router)
export function useSearchParams() {
    const params = useSearchParamsNext();
    const pathname = usePathname();
    const router = useRouter();
    const setParams = (siguiente : URLSearchParams, opciones? : { replace? : boolean }) => {
        const consulta = siguiente.toString();
        const destino = consulta ? `${pathname}?${consulta}` : pathname;
        if (opciones?.replace) router.replace(destino, { scroll: false });
        else router.push(destino, { scroll: false });
    };
    return [new URLSearchParams(params.toString()), setParams] as const;
}

export function Navigate({ to, replace } : { to : string; replace? : boolean }) {
    const navigate = useNavigate();
    useEffect(() => {
        navigate(to, { replace });
    }, [to, replace]); // eslint-disable-line react-hooks/exhaustive-deps
    return null;
}
