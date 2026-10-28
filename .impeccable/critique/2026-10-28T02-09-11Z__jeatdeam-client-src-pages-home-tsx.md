---
target: página principal de JD Store
total_score: 21
max_score: 36
na_heuristics: 7
p0_count: 1
p1_count: 2
target_identity: "file:C:\\Users\\paulo\\Marketplace\\Jeatdeam\\client\\src\\pages\\Home.tsx"
target_fingerprint: "sha256:a00fb66962e7ef575615033a4c10dca3b69f832ac0ca02be939c7ff0813b5be1"
target_path: "C:\\Users\\paulo\\Marketplace\\Jeatdeam\\client\\src\\pages\\Home.tsx"
timestamp: 2026-10-28T02-09-11Z
slug: jeatdeam-client-src-pages-home-tsx
---
Method: dual-agent (A: revisión de diseño · B: detector + navegador)

# Crítica de diseño: página principal de JD Store (`Jeatdeam/client/src/pages/Home.tsx`)

Modo de la superficie: Persuade (home de una tienda online). Sin PRODUCT.md ni DESIGN.md: el contexto sale del código.

## Puntaje de salud del diseño

| # | Heurística | Puntaje | Problema principal |
|---|---|---|---|
| 1 | Visibilidad del estado | 3 | Buen feedback de "Agregado" y de carga; el hero se mueve solo sin decir a dónde lleva |
| 2 | Coincidencia con el mundo real | 2 | Un comparador antes/después no significa nada para juguetes; "Más vendidos" es todo el catálogo sin ordenar; Pterodáctilo a S/ 12,312.00 |
| 3 | Control y libertad | 2 | El hero avanza solo sin pausa; `touch-none` impide hacer scroll en celular si el dedo empieza sobre el hero |
| 4 | Consistencia y estándares | 2 | La etiqueta "Nuevo" es aleatoria y contradice la sección "Nuevos ingresos" |
| 5 | Prevención de errores | 2 | "Comprar" y "Agregar" pesan igual; precios de referencia inventados; urgencia "Solo por esta semana" sin fecha |
| 6 | Reconocer en vez de recordar | 3 | Navegación y categorías con etiquetas; Yape/Plin solo aparece en la barra que se mueve |
| 7 | Flexibilidad y eficiencia | n/a | Página para explorar y convencer; el buscador está en el header |
| 8 | Diseño estético y minimalista | 2 | 9 tarjetas azul marino casi iguales entre Ofertas y Nuevos; el mismo producto 3 veces; 3 animaciones en bucle a la vez |
| 9 | Recuperación de errores | 2 | Ofertas y Nuevos desaparecen sin aviso si faltan datos; si la API falla, "Cargando productos…" gira para siempre |
| 10 | Ayuda y documentación | 3 | WhatsApp, menú de ayuda y libro de reclamaciones presentes; nada tranquiliza en el momento de comprar |
| **Total** | | **21/36** | **Aceptable (58%)** |

## Veredicto de especificidad del diseño

**Revisión de diseño:** la estructura es intercambiable con cualquier tienda; lo peruano y lo juguetero solo aparece en los textos. Degradados azul marino a celeste, tarjetas de vidrio, Poppins en todo, y una etiqueta pequeña en mayúsculas sobre cada título centrado: es una plantilla "premium" genérica. La marca sí aparece en los productos (dinosaurios mordelones de colores) y en el texto (soles, Yape/Plin, libro de reclamaciones, Lima en el día). La historia real del catálogo, "dinosaurios que muerden", no se usa en ningún lado.

**Detector automático:** el escaneo de los .tsx salió limpio, pero solo con reglas de texto (no evalúa contraste ni tamaños), así que se escaneó también la página en vivo: 11 hallazgos.
- Contraste bajo (3): precio anterior tachado `text-slate-400`, 2.5:1 (mínimo 4.5:1), `TarjetaProducto.tsx:59`. Real; la revisión de diseño no lo había visto.
- Contraste por píxeles (1): la descripción "Mordelones articulados y texturizados" sobre la imagen de la categoría, 3.2:1. Hay que verificarlo a ojo.
- Ritmo de títulos (4): los h2 de Ofertas, Categorías, Más vendidos y Nuevos ingresos (`Home.tsx:41, 73, 99, 118`). Falso positivo en lo que mide, pero apunta a algo real: los cuatro llevan la misma etiqueta en mayúsculas encima, que coincide con lo que señaló la revisión de diseño.
- Etiqueta sobre título (1): "Ventas corporativas" en el footer (`Footer.tsx:70`).
- Gris sobre color (1): el copyright del footer. Falso positivo: el contraste es de 5.5 a 6:1 y pasa AA.
- Marquesina (1): la barra superior que se desplaza sola (`estilos.css:79`). Real, aunque se pausa al pasar el mouse y respeta "reducir movimiento".
- Palabra huérfana (1): "aventura." sola en la última línea del banner (`BannerInicio.tsx:111`). Solo es un aviso; depende del ancho.

**Capas visuales:** la inyección funcionó; el detector marcó 9 elementos en la pestaña "[Human] JD Store" del navegador.

## Impresión general

La página tiene buen oficio en las piezas (tarjetas de producto, ofertas calculadas con datos reales, lo legal de Perú en su sitio), pero falla en lo que más importa en una tienda: la confianza y el primer pantallazo. Lo primero que ve el visitante es la foto de un esqueleto de museo sin título ni botón, y varios datos visibles (estrellas, precios anteriores, "Nuevo", "Más vendidos") son inventados. La mayor oportunidad: dejar de fingir ser una juguetería de 10 departamentos y ser "la tienda de dinosaurios de Lima".

## Lo que funciona

1. **Las tarjetas de ofertas** (`BannerInicio.tsx`): eligen los descuentos reales más grandes, tienen un plan B automático y el "Hasta -30%" en amarillo sobre azul con fotos reales es el momento más persuasivo de la página.
2. **La tarjeta de producto** (`TarjetaProducto.tsx`): tamaño fijo, jerarquía de precios clara, estado "Agotado" con botones desactivados y feedback de "Agregado" que no mueve el diseño.
3. **Lo legal y la accesibilidad básica**: libro de reclamaciones, RUC, Yape/Plin, WhatsApp, enlace para saltar al contenido, foco visible y bloque de "reducir movimiento" para las animaciones CSS.

## Problemas prioritarios

**1. [P0] Datos inventados y urgencia falsa**
- **Qué:** las estrellas salen de un hash del nombre (`tienda.ts:107`); el "precio anterior" se inventa si no hay descuento guardado (`tienda.ts:97-106`); "Nuevo" es aleatorio (`tienda.ts:118`); "Solo por esta semana" no tiene fecha (`Home.tsx:99`); "Más vendidos" es el catálogo sin ordenar (`Home.tsx:44`); el Pterodáctilo cuesta S/ 12,312.00.
- **Por qué importa:** la confianza es la barrera principal para pagar en línea en Perú, y los precios de referencia falsos son justo lo que sanciona el Código de Protección al Consumidor (Ley 29571).
- **Arreglo:** ocultar las estrellas hasta tener reseñas reales; mostrar el precio anterior solo si hay un descuento guardado en el dashboard; poner fecha de fin a la oferta o quitar "esta semana"; ordenar por ventas o renombrar a "Nuestros favoritos"; validar precios al cargarlos.
- **Comando:** `/impeccable harden`, luego `/impeccable clarify`.

**2. [P1] El hero ocupa toda la primera pantalla y no vende nada**
- **Qué:** en escritorio, la primera pantalla completa es un antes/después de dos fotos de museo, sin título, precio ni enlace. El único h1 de la página es el texto que se mueve en la barra superior ("Delivery gratis desde S/ 300").
- **Por qué importa:** los píxeles más valiosos de la tienda no dicen "juguetes" ni llevan a ningún lado.
- **Arreglo:** convertirlo en "fósil vs. tu mordelón" (el fósil real de un lado y el juguete del otro), con un h1 fijo y un botón "Ver T-rex · S/ 80"; limitar la altura a unos 60vh para que se asomen las ofertas.
- **Comando:** `/impeccable shape`, luego `/impeccable layout`.

**3. [P1] Movimiento y accesibilidad del hero y la barra superior**
- **Qué:** el hero avanza solo por JavaScript e ignora "reducir movimiento", sin botón de pausa (incumple WCAG 2.2.2); `touch-none` bloquea el scroll en celular; puntos de 8x8px y flechas de 28px; las flechas siguen invisibles con el foco del teclado; el texto alternativo dice "imagen 2 del grupo 1" en las 8 imágenes. El precio tachado tiene contraste 2.5:1.
- **Arreglo:** botón de pausa y pausa con hover o foco; respetar `prefers-reduced-motion`; `touch-action: pan-y`; zonas táctiles de 44px; `group-focus-within:opacity-100` en las flechas; textos alternativos reales y `aria-hidden` en los grupos ocultos; precio tachado en `text-slate-500` o más oscuro.
- **Comando:** `/impeccable harden`, luego `/impeccable audit`.

**4. [P2] Las categorías prometen un catálogo que no existe**
- **Qué:** 10 categorías, pero los 15 productos son dinosaurios; las imágenes son ilustraciones sin relación (fantasmas, la luna, arte de Spider-Man, que además es un personaje con licencia) bajo una capa negra al 45% que las vuelve grises.
- **Arreglo:** mostrar solo las categorías con stock y su cantidad ("15 productos"); usar fotos de producto con degradado solo abajo; 4 a 6 tarjetas a la vez.
- **Comando:** `/impeccable distill`, luego `/impeccable colorize`.

**5. [P2] No hay confianza cerca de la compra, y las secciones se repiten**
- **Qué:** Yape/Plin, tiempos de envío y el envío gratis desde S/ 300 solo están en la barra de 12px que se mueve y en logos pequeños del footer. Ofertas y Nuevos usan las mismas tarjetas azules circulares, con los mismos productos.
- **Arreglo:** una franja fija de 4 garantías justo después del hero (Yape/Plin · Lima en el día, provincias 48 h · envío gratis desde S/ 300 · libro de reclamaciones); un estilo más claro y distinto para Nuevos; no repetir productos entre secciones.
- **Comando:** `/impeccable clarify`, `/impeccable layout`, `/impeccable colorize`.

## Alertas por persona

**Jordan (primera vez):** llega a la foto de un esqueleto y duda si es un museo; al tocar el hero mueve la línea en vez de ir a algún lado; "Agregar" y "Comprar" pesan igual; entra a "Peluches" y probablemente no encuentra nada; "Dashboard" aparece en el menú público "Más opciones" (`BarraLateral.tsx:21`).

**Riley (pone a prueba todo):** S/ 12,312.00 aparece en Nuevos y en el carrusel; con menos de 3 descuentos o 5 productos, Ofertas y Nuevos desaparecen; si la API falla, el "Cargando…" no termina nunca; el lector de pantalla dice "Agregar Agregado" en cada botón (`TarjetaProducto.tsx:76-83`); el enlace de la tarjeta solo anuncia el nombre, sin precio ni descuento.

**Casey (celular, apurada):** no puede empezar a hacer scroll sobre el hero; la barra superior está vacía la mitad del tiempo; puntos de 8px; cuatro banners de oferta apilados (unos 1,000px) antes de las categorías; botones de producto de 37px; el botón de WhatsApp tapa el borde derecho de las tarjetas.

## Observaciones menores

- Las líneas al costado de los títulos son blancas sobre fondo casi blanco: no se ven (`ui.tsx:79,83`).
- Errores de tipeo: "Mordelon" sin tilde, "Minuatura".
- Colores en hex (`#facc15`, `#0f172a`) repetidos aunque ya existen como variables CSS.
- Las redes sociales apuntan a facebook.com, instagram.com, etc. sin perfil.
- Las fotos del hero son de Wikimedia y necesitan atribución.
- El favicon (`k-moon.png`) no es de la marca.
- La aparición al hacer scroll oculta el contenido hasta que se observa; si el observador falla, la sección queda invisible.

## Preguntas para pensar

1. Si el comparador enfrentara un fósil real con tu mordelón de S/ 80, con un botón, ¿se ganaría su lugar, o hay que quitarlo?
2. Vendes 15 dinosaurios. ¿Por qué la página finge ser una juguetería de 10 departamentos en vez de ser "la tienda de dinosaurios de Lima"?
3. ¿Qué tendría que ver un papá justo antes de irse: una razón para confiar y pagar con Yape, o solo el pie de página?
