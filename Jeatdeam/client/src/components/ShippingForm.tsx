import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';

const COURIERS = [
    { empresa: 'shalom', label: 'shalom', color: 'red' },
    { empresa: 'olva', label: 'olva courier', color: 'yellow' },
    { empresa: 'dinocourier', label: 'dinocourier', color: 'lightgreen' },
    { empresa: 'otros', label: 'otros', color: 'lightgray' },
];

const courierMessageStyle: CSSProperties = {
    border: '1px solid gray',
    backgroundColor: 'red',
    padding: '5px',
    borderRadius: '8px',
    fontSize: '12.5px',
    position: 'absolute',
    top: '110%',
    left: '0',
    display: 'block',
    transition: 'all 0.35s ease-in-out',
};

// Formulario "Datos de envio" del carrito
interface ShippingFormProps {
    className: string;
    focusOnOpen: boolean;
    onSuccess: () => void;
}

export default function ShippingForm({ className, focusOnOpen, onSuccess }: ShippingFormProps) {
    const [pickStore, setPickStore] = useState(false);
    const [courier, setCourier] = useState<string | null>(null);
    const [infoCourier, setInfoCourier] = useState('');
    const [courierMessage, setCourierMessage] = useState(0); // >0 = visible (cambia para repetir el parpadeo)
    const emailRef = useRef<HTMLInputElement>(null);
    const courierRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (focusOnOpen) emailRef.current?.focus();
    }, [focusOnOpen]);

    useEffect(() => {
        if (courier) courierRef.current?.focus();
    }, [courier]);

    const chooseCourier = (empresa: string) => {
        setCourier(empresa);
        setInfoCourier('');
        setCourierMessage(0);
    };

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!pickStore && !courier) {
            setCourierMessage((value) => value + 1);
            return;
        }
        onSuccess();
    };

    const hiddenWhenPickStore: CSSProperties | undefined = pickStore ? { display: 'none' } : undefined;

    return (
        <section className={`pasarelaPago ${className}`}>
            <form id="myForm" onSubmit={onSubmit}>
                <div className="titleForm">
                    <h1>Datos de envio</h1>
                    <button
                        type="button"
                        className={`recojoTienda${pickStore ? ' active_pick_store' : ''}`}
                        onClick={() => setPickStore((value) => !value)}
                    >
                        Recojo en tienda
                    </button>
                </div>
                <div className="messagePay">
                    <hr />
                    <small>Rellene los campos para envios a Lima y provincias</small>
                    <hr />
                </div>
                <div className="emailPay">
                    <h3>Email</h3>
                    <input ref={emailRef} type="email" name="correo" placeholder="ingrese su correo electronico" required />
                </div>
                <div className="detailCard">
                    <h3> Información del cliente</h3>
                    <input type="text" name="nombre" placeholder="nombre y apellidos" required />
                    <div>
                        <input type="tel" name="firtsPhone" placeholder="numero telefonico" required />
                        <input type="tel" name="secondPhone" placeholder="numero telefonico alternativo" />
                    </div>
                </div>
                <div className="nameUser" style={hiddenWhenPickStore}>
                    <h3>Dirección</h3>
                    <input type="text" name="direccion" placeholder="ingrese su direccion" required={!pickStore} />
                </div>
                <div className="nameCountry" style={hiddenWhenPickStore}>
                    <h3>Region de envio</h3>
                    <div className="region">
                        <input type="text" name="departamento" placeholder="departamento" required={!pickStore} />
                        <input type="text" name="distrito" placeholder="distrito" required={!pickStore} />
                    </div>
                    <textarea name="infoExtra" placeholder="detalles adicionales como croquis o referencias"></textarea>
                </div>
                <div className="couriersContainer" style={hiddenWhenPickStore}>
                    <h3>Courier</h3>
                    <div className="couriers" style={{ position: 'relative' }}>
                        {COURIERS.map(({ empresa, label, color }) => (
                            <button
                                key={empresa}
                                type="button"
                                data-empresa={empresa}
                                className={courier === empresa ? 'selectButton' : undefined}
                                style={courier === empresa ? { backgroundColor: color } : undefined}
                                onClick={() => chooseCourier(empresa)}
                            >
                                {label}
                            </button>
                        ))}
                        {courierMessage > 0 && (
                            <span key={courierMessage} className="spanAdd message" style={courierMessageStyle}>
                                ! Debe escoger un courier ¡
                            </span>
                        )}
                    </div>
                    <textarea
                        ref={courierRef}
                        name="infoCourier"
                        placeholder={courier ? `${courier} - sede de la empresa, encargado de recojo, dni, celular, etc.` : ''}
                        style={courier ? { display: 'block' } : undefined}
                        required={Boolean(courier) && !pickStore}
                        value={infoCourier}
                        onChange={(e) => setInfoCourier(e.target.value)}
                    ></textarea>
                </div>
                <button type="submit">continuar</button>
            </form>
        </section>
    );
}
