import React, {useCallback, useEffect, useRef, useState} from 'react';

import {ANCHO_SECCION} from './ui';
import {useStore} from '../context/StoreContext';
import type {GrupoSlider} from '../../../shared/types';

type Group = {
    imageOne: string
    imageTwo: string
    labelOne: string
    labelTwo: string
}

type Direction = "left" | "right"

// imagen 1 (lado izquierdo) vs imagen 2 (lado derecho): vienen del backend (dashboard > Slider);
// las originales estan en SLIDER_ORIGINAL (datos/tienda.ts)

const DURATION = 5000
// velocidad constante de la línea: del centro al borde (50%) en DURATION
const SPEED = 50 / DURATION
// radio de las esquinas del slider
const RADIUS = 15
// radio con el que se curvan los textos de las esquinas: nunca menos de 48px. Con esquinas más
// cerradas el arco del texto (a 22px y 12px del borde) saldría con radio negativo y el texto se doblaría mal
const LABEL_RADIUS = Math.max(RADIUS, 48)

// la linea sobresale del slider por arriba y por abajo
const LINE_OVERFLOW = 15

type BeforeAfterSliderProps = {
    // la vista previa del dashboard le pasa sus propios grupos y no deja el espacio del header arriba
    grupos?: GrupoSlider[]
    sinHeader?: boolean
}

export function BeforeAfterSlider({grupos, sinHeader = false}: BeforeAfterSliderProps) {
    const {gruposSlider} = useStore()
    const groups: Group[] = (grupos ?? gruposSlider).map((g) => ({imageOne: g.imagenUno, imageTwo: g.imagenDos, labelOne: g.textoUno || 'Imagen 1', labelTwo: g.textoDos || 'Imagen 2'}))
    const total = groups.length
    const [current, setCurrent] = useState<number>(0)
    // hacia dónde viaja la línea durante el grupo: derecha = siguiente, izquierda = anterior
    const [direction, setDirection] = useState<Direction>("right")
    const [dragging, setDragging] = useState<boolean>(false)

    const containerRef = useRef<HTMLDivElement | null>(null)
    const lineRef = useRef<HTMLDivElement | null>(null)
    const fillRef = useRef<HTMLSpanElement | null>(null)
    const clipRefs = useRef<(HTMLImageElement | null)[]>([])

    // estado de la animación en refs para no re-renderizar en cada frame
    const position = useRef<number>(50)
    const fill = useRef<number>(0)
    // tramo actual: desde dónde parten la línea y la barra, y cuánto dura (se recalcula al soltar el arrastre)
    const segment = useRef<{ position: number, fill: number, duration: number, elapsed: number }>(
        {position: 50, fill: 0, duration: DURATION, elapsed: 0}
    )

    const paint = useCallback(() => {
        if (lineRef.current) lineRef.current.style.left = `${position.current}%`
        const clip = clipRefs.current[current]
        if (clip) clip.style.clipPath = `inset(0 ${100 - position.current}% 0 0)`
        if (fillRef.current) fillRef.current.style.width = `${fill.current * 100}%`
    }, [current])

    const goTo = useCallback((index: number, dir: Direction) => {
        setDirection(dir)
        setCurrent((index + total) % total)
    }, [total])

    // cada grupo empieza con la línea al centro y la duración normal
    useEffect(() => {
        position.current = 50
        fill.current = 0
        segment.current = {position: 50, fill: 0, duration: DURATION, elapsed: 0}
        paint()
    }, [current, paint])

    // la línea viaja del punto de partida al borde en sintonía con la barra de la bolita
    useEffect(() => {
        if (dragging) return
        const target = direction === "right" ? 100 : 0
        let frame: number
        let last = performance.now()

        const tick = (now: number) => {
            const seg = segment.current
            seg.elapsed += now - last
            last = now
            const t = seg.duration > 0 ? Math.min(1, seg.elapsed / seg.duration) : 1
            position.current = seg.position + (target - seg.position) * t
            fill.current = seg.fill + (1 - seg.fill) * t
            paint()

            if (t >= 1) {
                goTo(current + (direction === "right" ? 1 : -1), direction)
                return
            }
            frame = requestAnimationFrame(tick)
        }

        frame = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(frame)
    }, [current, direction, dragging, goTo, paint])

    const updatePosition = (clientX: number) => {
        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect) return
        const percent = ((clientX - rect.left) / rect.width) * 100
        position.current = Math.min(100, Math.max(0, percent))
        paint()
    }

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        // solo clic principal: el clic derecho abre el menú y nunca llega a soltarse aquí
        if (e.button !== 0) return
        e.currentTarget.setPointerCapture(e.pointerId)
        setDragging(true)
        updatePosition(e.clientX)
    }

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (dragging) updatePosition(e.clientX)
    }

    // al soltar, la línea sigue desde donde quedó a la misma velocidad:
    // si se retrocedió, el grupo dura más (hasta 10s desde el borde opuesto); si se adelantó, dura menos
    const endDrag = useCallback(() => {
        const target = direction === "right" ? 100 : 0
        segment.current = {
            position: position.current,
            fill: fill.current,
            duration: Math.abs(target - position.current) / SPEED,
            elapsed: 0,
        }
        setDragging(false)
    }, [direction])

    // si el navegador pierde el "soltar" (alt+tab, soltar fuera de la ventana, captura cancelada)
    // el arrastre termina igual para que la animación no se quede congelada
    useEffect(() => {
        if (!dragging) return
        window.addEventListener("pointerup", endDrag)
        window.addEventListener("blur", endDrag)
        return () => {
            window.removeEventListener("pointerup", endDrag)
            window.removeEventListener("blur", endDrag)
        }
    }, [dragging, endDrag])

    // mismo ancho que las secciones de abajo (ANCHO_SECCION)
    return (
        <div className={`${ANCHO_SECCION} ${sinHeader ? 'py-[24px]' : 'pt-[168px] sm:pt-[192px]'}`}>
          {/* envoltura sin overflow-hidden: la linea va aqui para poder salir 15px arriba y abajo de la imagen */}
          <div className={"relative"}>
            <div ref={containerRef}
                 style={{borderRadius: RADIUS}}
                 className={"group relative  w-full aspect-[16/9] overflow-hidden select-none touch-none shadow-[0_20px_60px_rgba(0,0,0,.35)]"}>

                {/* imagen 2 de fondo e imagen 1 recortada encima: barra a la derecha = imagen 1 completa */}
                {groups.map((g, i) => (
                    <div key={i}
                         className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                        <img src={g.imageTwo} alt={`imagen 2 del grupo ${i + 1}`} draggable={false}
                             className={"absolute inset-0 w-full h-full object-cover"}/>
                        <img ref={el => { clipRefs.current[i] = el }}
                             src={g.imageOne} alt={`imagen 1 del grupo ${i + 1}`} draggable={false}
                             style={{clipPath: "inset(0 50% 0 0)"}}
                             className={"absolute inset-0 w-full h-full object-cover"}/>
                    </div>
                ))}

                {/* textos del grupo actual (se editan en el dashboard > Slider) */}
                <CornerLabel corner={"top-left"} text={groups[current]?.labelOne ?? ""}/>
                <CornerLabel corner={"bottom-right"} text={groups[current]?.labelTwo ?? ""}/>

                {/* deslizador: línea delgada con un tirador central de 10x25px */}
                <div onPointerDown={handlePointerDown}
                     onPointerMove={handlePointerMove}
                     onLostPointerCapture={() => dragging && endDrag()}
                     className={"absolute inset-0 z-10 cursor-ew-resize"}/>

                {/* botones estilo iOS abajo a la derecha: solo aparecen al pasar el cursor (desde sm) */}
                <div className={"absolute bottom-5 right-[80px] z-20 hidden sm:flex gap-[20px]"}>
                    <IosArrowButton direction={"left"} onClick={() => goTo(current - 1, "left")}/>
                    <IosArrowButton direction={"right"} onClick={() => goTo(current + 1, "right")}/>
                </div>

                {/* indicadores; en celular las flechas van pequeñas a los lados de las bolitas */}
                <div className={"absolute bottom-2 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2"}>
                    <IosArrowButton direction={"left"} compact onClick={() => goTo(current - 1, "left")}/>
                    <div className={"flex items-center gap-2 px-3 py-2 rounded-full bg-black/25 backdrop-blur-md"}>
                        {groups.map((_, i) => (
                            <button key={i}
                                    aria-label={`Ir al grupo ${i + 1}`}
                                    onClick={() => goTo(i, i < current ? "left" : "right")}
                                    className={`relative h-2 rounded-full overflow-hidden bg-white/50 transition-[width] duration-500 ease-out ${i === current ? "w-10" : "w-2"}`}>
                                {i === current && (
                                    <span ref={fillRef}
                                          style={{width: 0}}
                                          className={"absolute inset-y-0 left-0 bg-white rounded-full"}/>
                                )}
                            </button>
                        ))}
                    </div>
                    <IosArrowButton direction={"right"} compact onClick={() => goTo(current + 1, "right")}/>
                </div>
            </div>

            {/* línea delgada con un tirador central de 10x25px: fuera del contenedor recortado, sobresale
                LINE_OVERFLOW px arriba y abajo; no recibe el puntero (el arrastre lo maneja la capa de adentro) */}
            <div ref={lineRef}
                 style={{left: "50%", top: -LINE_OVERFLOW, bottom: -LINE_OVERFLOW}}
                 className={"pointer-events-none absolute z-[15] w-[2px] -translate-x-1/2 rounded-full bg-white shadow-[0_0_8px_rgba(0,0,0,.35)]"}>
                <div className={"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[10px] h-[25px] rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,.35)]"}/>
            </div>
          </div>
        </div>
    )
}

type CornerLabelProps = {
    corner: "top-left" | "bottom-right"
    text: string
}

// texto curvado sobre un arco en la esquina (concéntrico al borde si el radio es de 48px o más)
function CornerLabel({corner, text}: CornerLabelProps) {
    const extra = 80
    const size = LABEL_RADIUS + extra
    const isTopLeft = corner === "top-left"
    const id = `arc-${corner}`

    // arriba-izquierda: los glifos miran hacia afuera, la línea base queda a 22px del borde
    // abajo-derecha: los glifos miran hacia adentro, la línea base queda a 12px del borde
    const inset = isTopLeft ? 22 : 12
    const r = LABEL_RADIUS - inset
    const path = isTopLeft
        ? `M ${inset},${size} L ${inset},${LABEL_RADIUS} A ${r},${r} 0 0 1 ${LABEL_RADIUS},${inset} L ${size},${inset}`
        : `M 0,${size - inset} L ${size - LABEL_RADIUS},${size - inset} A ${r},${r} 0 0 0 ${size - inset},${size - LABEL_RADIUS} L ${size - inset},0`

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
             className={`absolute z-20 pointer-events-none overflow-visible drop-shadow-[0_1px_3px_rgba(0,0,0,.6)] ${isTopLeft ? "top-0 left-0" : "bottom-0 right-0"}`}>
            <path id={id} d={path} fill={"none"}/>
            {/* word-spacing: mas aire entre palabras, que en arco se veian pegadas */}
            <text className={"fill-white text-[15px] font-extrabold tracking-[0.04em] [word-spacing:0.35em]"}>
                <textPath href={`#${id}`} startOffset={"50%"} textAnchor={"middle"}>{text}</textPath>
            </text>
        </svg>
    )
}

type ArrowProps = {
    direction: "left" | "right"
    onClick: () => void
    // versión pequeña para celular: siempre visible (no hay hover en pantallas táctiles)
    compact?: boolean
}

function IosArrowButton({direction, onClick, compact = false}: ArrowProps) {
    const isLeft = direction === "left"

    return (
        <button onClick={onClick}
                aria-label={isLeft ? "Anterior" : "Siguiente"}
                className={`rounded-full flex items-center justify-center bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_4px_16px_rgba(0,0,0,.2)] text-neutral-800 active:scale-90 hover:bg-white/90 transition-all duration-300 ease-out
                    ${compact ? "sm:hidden size-7" : "size-11 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"}`}>
            <svg width={compact ? 7 : 10} height={compact ? 12 : 18} viewBox="0 0 10 18" fill="none">
                <path d={isLeft ? "M9 1L1 9l8 8" : "M1 1l8 8-8 8"} stroke="currentColor" strokeWidth="2.2"
                      strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </button>
    )
}
