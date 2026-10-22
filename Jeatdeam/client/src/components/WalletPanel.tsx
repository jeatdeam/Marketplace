import { useEffect, useRef, useState } from 'react';

import Icon from './Icon';

type WalletName = 'yape' | 'plin';

const WALLETS: Record<WalletName, { color: string; qr: string }> = {
    yape: {
        color: '#6A1B9A',
        qr: 'https://res.cloudinary.com/dfwtyxxba/image/upload/v1745297417/codigoYape_c0wwou.png',
    },
    plin: {
        color: '#00C6FF',
        qr: 'https://res.cloudinary.com/dfwtyxxba/image/upload/v1743736943/Imagen_de_WhatsApp_2025-03-25_a_las_20.33.16_73a6986c_frpub0.jpg',
    },
};

const ANIMATION_MS = 350;

// Panel para pagar con Yape o Plin: elegir billetera -> mostrar su código QR
interface WalletPanelProps {
    className: string;
    onClose: () => void;
}

export default function WalletPanel({ className, onClose }: WalletPanelProps) {
    const [option, setOption] = useState<WalletName | null>(null);
    const [hovered, setHovered] = useState<WalletName | null>(null);
    const [step, setStep] = useState<'choose' | 'qr'>('choose');
    const [boxAnimation, setBoxAnimation] = useState('');
    const [backAnimation, setBackAnimation] = useState('');
    const [busy, setBusy] = useState(false);
    const [showError, setShowError] = useState(false);
    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

    useEffect(() => () => timers.current.forEach(clearTimeout), []);

    const later = (fn: () => void) => {
        timers.current.push(setTimeout(fn, ANIMATION_MS));
    };

    const choose = (name: WalletName) => {
        setShowError(false);
        setOption(name);
    };

    const generate = () => {
        if (!option) {
            setShowError(true);
            return;
        }
        if (step !== 'choose' || busy) return;
        setBusy(true);
        setBoxAnimation('templateYapePlin_two');
        later(() => {
            setStep('qr');
            setBoxAnimation('');
            setBackAnimation('templateYapePlin');
            setBusy(false);
        });
    };

    const goBack = () => {
        if (step !== 'qr' || busy) return;
        setBusy(true);
        setStep('choose');
        setBoxAnimation('templateYapePlin');
        setBackAnimation('templateYapePlin_two');
        later(() => {
            setBackAnimation('');
            setBusy(false);
        });
    };

    const wallet = option ? WALLETS[option] : null;
    const buttonText = step === 'qr' ? 'Enviar' : option ? `Generar codigo de ${option}` : 'Generar codigo de pago';
    const backVisible = step === 'qr' || backAnimation === 'templateYapePlin_two';

    return (
        <section className={`containerYapePlin ${className}`}>
            <div className="textContainer">
                <h1>Escoja el medio de pago</h1>
                <h1></h1>
            </div>
            {step === 'qr' && wallet && <img src={wallet.qr} alt={`Código QR de ${option}`} />}
            {step === 'choose' && (
                <div className={`boxYapePlin ${boxAnimation}`}>
                    {(Object.keys(WALLETS) as WalletName[]).map((name) => (
                        <div
                            key={name}
                            className={[name, option === name && 'clickOption', hovered === name && 'activeBorder'].filter(Boolean).join(' ')}
                            data-option={name}
                            onMouseEnter={() => setHovered(name)}
                            onMouseLeave={() => setHovered(null)}
                            onClick={() => choose(name)}
                        />
                    ))}
                </div>
            )}
            {showError && (
                <small className="show-animation-busqueda" style={{ color: 'red', fontSize: '15px', display: 'block' }}>
                    Error! Escoja una billetera virtual
                </small>
            )}
            <button
                style={wallet ? { backgroundColor: wallet.color, color: 'white' } : undefined}
                onClick={generate}
            >
                {buttonText}
            </button>
            <Icon name="close" fill="#999999" className="deleteYapePlin" onClick={onClose} />
            <Icon
                name="back"
                fill="#999999"
                className={`returnYapePlin${backVisible ? ' activeElement' : ''} ${backAnimation}`}
                onClick={goBack}
            />
        </section>
    );
}
