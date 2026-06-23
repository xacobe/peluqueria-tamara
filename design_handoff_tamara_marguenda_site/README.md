# Handoff: Tamara Margüenda — Web de peluquería (one-page)

## Overview
Landing de una sola página para la peluquería **Tamara Margüenda**. Estilo "moderno y atrevido": titulares enormes en serif de alto contraste, alternancia de secciones crema / verde oscuro, selector de idioma **ES / EN / GL**, y una animación de marca: unas **tijeras cruzan una línea de corte punteada al hacer scroll** y los bloques de cada sección "caen" a su sitio. Secciones: Hero, Servicios, Galería, Opiniones, Contacto + Footer.

## About the Design Files
Los archivos de este paquete son **referencias de diseño hechas en HTML** — un prototipo que muestra el aspecto y el comportamiento deseados, **no código de producción para copiar tal cual**. El prototipo está construido como un "Design Component" (un runtime propietario con plantilla + clase de lógica); **no reutilices ese runtime**. La tarea es **recrear este diseño en el entorno del proyecto destino** (lo ideal: Next.js/React + CSS Modules o Tailwind, o Astro si se busca una web estática rápida) siguiendo sus patrones. Si no hay codebase aún, elige el framework más adecuado (recomendado: **Astro** o **Next.js** por ser una landing) e impleméntalo allí.

## Fidelity
**Alta fidelidad (hifi).** Colores, tipografías, espaciados y micro-interacciones son finales. Recrear la UI de forma fiel. Lo único provisional es el **contenido de ejemplo**: precios, dirección, teléfono, horario y las **fotos** (placeholders rayados) — el cliente los sustituirá.

---

## Design Tokens

### Colores
| Token | Hex | Uso |
|---|---|---|
| `--cream` | `#f4f2ec` | Fondo principal (secciones claras), texto sobre verde |
| `--cream-card` | `#faf9f4` | Fondo de tarjetas en secciones claras |
| `--green` | `#2c4636` | Verde de marca (texto secundario, bordes, scissors en claro) |
| `--green-deep` | `#1b2c22` | Fondo de secciones oscuras, texto de titular línea 1, botones |
| `--green-footer` | `#11201a` | Fondo del footer |
| `--ink` | `#1b2c22` | Texto titulares |
| `--body` | `#45564c` | Texto de párrafo en claro |
| `--muted` | `#5a6b60` / `#5f6b61` | Texto secundario tenue |
| `--on-dark-muted` | `#c6d0c8` / `#9fb0a3` | Texto secundario sobre verde |
| `--accent` (tweakable) | default `#e35a4c` (Coral) | Acento vibrante: eyebrows, precios, comillas, marquee, enlaces, 2ª línea del hero |

**Opciones de acento** (era un control tweakable): Oro `#a98c52`, Coral `#e35a4c`, Fucsia `#d6336c`, Esmeralda `#1f9e7a`, Cobalto `#2f6bd8`. Implementar como variable CSS `--accent` en el contenedor raíz para poder cambiarla en un sitio.

### Tipografía
- **Titulares grandes (h1, h2):** `'Bodoni Moda', serif` (Google Fonts), weight **800**, `letter-spacing: -.01em`, `line-height: .92`. Es la fuente "elegante" elegida. Alternativas que existían como tweak: `'DM Serif Display'` y `'Bricolage Grotesque'`.
- **Texto / UI / nav / tarjetas:** `'Archivo', system-ui, sans-serif`, weights 400/500/600.
- **Display secundario (marquee, nombres de servicio, marca del footer):** `'Bricolage Grotesque'`, weights 700/800.
- **Etiquetas técnicas / placeholders:** `ui-monospace, monospace`, 11–13px.
- **Eyebrows:** Archivo 13px, `text-transform:uppercase`, `letter-spacing:.24em`, weight 600, color acento.

Escala de titulares (responsive con `clamp`):
- Hero h1: `clamp(52px, 9.5vw, 140px)`
- Section h2: `clamp(40px, 6.5vw, 88px)`
- Hero subtítulo: `clamp(16px, 1.5vw, 20px)`
- Marquee: `clamp(22px, 3.4vw, 44px)`

### Espaciado / radios / otros
- Padding horizontal de sección: `clamp(16px, 4vw, 52px)`.
- Padding vertical de sección: top `clamp(20px,3vw,32px)`, bottom `clamp(56px,7vw,96px)`.
- Gap de grids: 14–16px. Gap hero/contacto: `clamp(28px,4vw,56px)`.
- Border radius: tarjetas 5px, imágenes 5–6px, botones/píldoras `999px`.
- Bordes: `1px solid rgba(44,70,54,.14)` en claro; `1px solid rgba(244,242,236,.12-.14)` en oscuro.
- Línea de corte: `2px dashed` (color verde en claro, crema en oscuro), opacidad .4.

---

## Screens / Views (una sola página, scroll vertical)

### 0. Nav (sticky)
- `position: sticky; top:0; z-index:60`, fondo `rgba(244,242,236,.82)` + `backdrop-filter: blur(12px)`, borde inferior `1px solid rgba(44,70,54,.12)`.
- Layout flex con `justify-content: space-between`, `flex-wrap: wrap`, padding `12px clamp(16px,4vw,52px)`.
- Izquierda: **logo** (`logo-tamara-marguenda.jpg`, altura 48px, `mix-blend-mode: multiply` para fundir el fondo crema del jpg).
- Centro: enlaces ancla `Servicios / Galería / Opiniones / Contacto` (Archivo 14px, weight 500, color `#2c4636`, hover → acento).
- Derecha: **selector de idioma** ES/EN/GL (grupo de 3 botones en una píldora con borde; el activo = fondo `#2c4636`, texto crema) + botón **Reservar** (píldora `#1b2c22`, texto crema, hover `#2c4636`).

### 1. Hero
- Eyebrow (acento): "Peluquería · Estudio de imagen".
- Grid 2 columnas responsive: `grid-template-columns: repeat(auto-fit, minmax(340px,1fr))`, `gap: clamp(28px,4vw,56px)`, `align-items:center`.
- Columna izq: **h1 en dos líneas** — línea 1 "EL CORTE" color `#1b2c22`; línea 2 "LO CAMBIA TODO." color **acento**. Subtítulo (`--body`). Dos CTAs: primario relleno `#1b2c22`, secundario con borde.
- Columna der: **placeholder de foto** `aspect-ratio:4/5`, radius 6px, fondo rayado `repeating-linear-gradient(135deg,#e7e4d8 0 16px,#efece2 16px 32px)`, etiqueta monospace "foto principal · 4:5". → sustituir por foto real.

### 2. Marquee (banda en movimiento)
- Fondo `#1b2c22`, texto crema, fuente Bricolage 800, `clamp(22px,3.4vw,44px)`.
- Contenido en bucle: "Tamara Margüenda ✶ Corte ✶ Color ✶ Estilo ✶" (✶ en color acento), animación lineal infinita `translateX(0 → -50%)` (~26s), duplicar el contenido 2× para bucle sin saltos. (Era ocultable vía tweak `showMarquee`.)

### 3. Servicios (sección clara)
- Barra de corte arriba (ver "Interactions").
- Eyebrow "Lo que hacemos" + h2 "Servicios" + subtítulo "Precios orientativos…".
- Grid de tarjetas `repeat(auto-fit, minmax(270px,1fr))`, gap 16px. 6 tarjetas:
  1. Corte & peinado — 18€ — "Estudio de rostro y corte a medida."
  2. Color global — 35€ — "Cobertura y brillo de larga duración."
  3. Mechas & Balayage — 55€ — "Luz natural, transición suave."
  4. Tratamientos — 25€ — "Hidratación, keratina y reparación."
  5. Recogidos & eventos — 40€ — "Para bodas, invitadas y celebraciones."
  6. Asesoría de imagen — Consultar — "Encuentra el estilo que es tuyo." (**tarjeta invertida**: fondo `#1b2c22`, texto crema)
- Tarjeta: padding 24px, borde, radius 5px, fondo `#faf9f4`. Nombre Bricolage 700 22px; precio Bricolage 700 18px en **acento**; descripción 14.5px `#5a6b60`. **Hover:** `translateY(-5px)` + `border-color:#2c4636`, transición .5s. ⚠️ Precios de ejemplo.

### 4. Galería (sección oscura `#1b2c22`)
- Barra de corte (scissors/línea en **crema**).
- Eyebrow "Antes & después" + h2 "Galería" + subtítulo.
- Grid `repeat(auto-fit, minmax(220px,1fr))`, gap 14px, 6 placeholders `aspect-ratio:3/4`, fondo rayado verde `repeating-linear-gradient(135deg,#24382c 0 16px,#2c4636 16px 32px)`, etiqueta monospace (corte bob, balayage, color cobre, recogido, rizos, flequillo).
- Nota monospace: "↳ arrastra aquí tus fotos de @tamara.marguenda". → sustituir por fotos reales.

### 5. Opiniones (sección clara)
- Barra de corte. Eyebrow "Clientas" + h2 "Lo que dicen".
- Grid `repeat(auto-fit, minmax(280px,1fr))`, gap 16px, 3 `figure` tarjeta: comilla grande "(serif, acento), `blockquote` 18px `#2c4636`, `figcaption` 13px weight 600. Testimonios de ejemplo (Laura G., Marta R., Sara P.).

### 6. Contacto (sección oscura `#1b2c22`)
- Barra de corte (crema). Grid 2 columnas `repeat(auto-fit, minmax(300px,1fr))`, `align-items:start`.
- Izq: eyebrow "Te esperamos" + h2 "Visítanos" + lista de datos en filas `grid-template-columns:140px 1fr` con separador inferior `1px solid rgba(244,242,236,.14)`:
  - Dirección — "Calle Ejemplo 00, Tu Ciudad"
  - Horario — "Mar–Vie 10:00–20:00 · Sáb 9:00–14:00"
  - Reservas — "+34 600 000 000"
  - Instagram — enlace `@tamara.marguenda` (color acento) → https://www.instagram.com/tamara.marguenda/
  - CTA: "Pide tu cita por WhatsApp" (píldora crema, texto oscuro, hover acento). ⚠️ enlace placeholder.
- Der: placeholder cuadrado `aspect-ratio:1/1` "mapa · ubicación" → integrar Google Maps embed.
- ⚠️ Todos los datos de contacto son de ejemplo.

### 7. Footer
- Fondo `#11201a`, flex space-between, marca "Tamara Margüenda" (Bricolage 700) + línea de copyright.

---

## Interactions & Behavior

### Animación de tijeras (firma del sitio)
Al entrar cada sección en el viewport (≈ cuando su borde superior cruza el 85% de la altura de la ventana):
1. **Línea de corte** punteada arriba de la sección: `transform: scaleX(0 → 1)` con `transform-origin:left`, ~1.1s ease (efecto "se traza de izquierda a derecha").
2. **Tijeras** (SVG) recorren la línea: `translateX(0 → anchoBarra-64px)`, ~1.25s `cubic-bezier(.45,0,.2,1)`. El SVG tiene dos grupos (hojas) que abren/cierran en bucle (`snip`, ~0.5s alternate) para simular el corte.
3. **Recortes de pelo**: ~5 slivers que caen (`@keyframes clipfall`: opacidad 0→1→0, `translateY(-8px → 72px)` + rotación, 1.3s, escalonados).
4. **Bloques de contenido** (`[data-piece]`): aparecen escalonados (~70ms entre uno y otro): `opacity 0→1` + `translateY(-22px → 0)`, ~.6s `cubic-bezier(.2,.85,.25,1)` → lectura de "los trozos caen a su sitio".

**Recomendación de implementación:** usar `IntersectionObserver` para disparar las reveals (en un navegador normal funciona perfecto; el prototipo usa un poll con `requestAnimationFrame` solo porque el entorno de preview de la herramienta congelaba el IO). `prefers-reduced-motion`: mostrar todo sin animación. Asegurar siempre el estado final visible aunque el JS no corra (no dejar contenido en `opacity:0` permanente).

### Idiomas (ES / EN / GL)
- Diccionario de strings por clave (ver `tamara-marguenda.dc.html`, objeto `dict` con `es`/`en`/`gl`). En React: un `lang` state + objeto de traducciones; renderizar `t[key]`.
- Persistir el idioma elegido (localStorage `tm_lang`) y restaurar al cargar.
- El botón de idioma activo se resalta (fondo verde, texto crema).

### Hover
- Enlaces nav → color acento.
- Tarjetas de servicio → elevación `translateY(-5px)` + borde verde.
- Botones → oscurecen / cambian a acento.

### Responsive
- Sin media queries: todo con `clamp()` para tipografía/espaciado y `grid auto-fit minmax(...)` para que las columnas colapsen solas. El nav usa `flex-wrap`. Funciona móvil y escritorio.

## State Management
- `lang`: 'es' | 'en' | 'gl' (persistido en localStorage).
- `revealed` por sección (para no repetir la animación).
- Tweaks (opcionales en producción): `accentColor`, `titleFont`, `showMarquee` — en el prototipo eran props; en la app pueden ser constantes de tema o quitarse.

## Assets
- `logo-tamara-marguenda.jpg` — logo facilitado por el cliente (perfil con coleta + lettering, verde sobre crema). Usado en nav con `mix-blend-mode: multiply`. Incluido en este paquete.
- **Fotos** (hero, 6 de galería, mapa): placeholders → el cliente las aporta desde Instagram @tamara.marguenda.
- Fuentes: Google Fonts (Bodoni Moda, Archivo, Bricolage Grotesque; opcional DM Serif Display).

## Files
- `tamara-marguenda.dc.html` — prototipo de referencia completo (plantilla + lógica). Abrir en navegador para ver el comportamiento real.
- `logo-tamara-marguenda.jpg` — logo.
