# Tamara Margüenda — Web de peluquería

Landing de una sola página para la peluquería **Tamara Margüenda**, construida con [Astro](https://astro.build). Implementa el diseño de [`design_handoff_tamara_marguenda_site/`](design_handoff_tamara_marguenda_site/README.md): titulares enormes en serif, alternancia de secciones crema / verde oscuro, selector de idioma ES/EN/GL y una animación de marca (las tijeras cruzan una línea de corte punteada al hacer scroll).

## Cómo verlo en el navegador

```bash
npm install      # solo la primera vez
npm run dev      # http://localhost:4321 — con hot-reload, para mientras se edita
```

Para comprobar el resultado final tal y como se serviría en producción:

```bash
npm run build     # genera los archivos estáticos en dist/
npm run preview   # http://localhost:4321 — sirve lo que hay en dist/
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente. |
| `npm run build` | Comprueba tipos (`astro check`) y genera el sitio estático en `dist/`. No levanta servidor. |
| `npm run preview` | Sirve los archivos ya compilados de `dist/`. Hay que ejecutar `build` antes. |

Para detener cualquiera de los dos servidores: `Ctrl+C` en la terminal donde corre, o `pkill -f astro` si se lanzó en segundo plano.

## Stack

- **[Astro](https://astro.build)** — generador estático, sin framework de UI (no usa React/Vue). Las páginas son `.astro` con HTML + CSS con scope por componente.
- **TypeScript** en modo estricto.
- Sin backend ni base de datos: es una landing puramente estática, pensada para alojarse en cualquier hosting de archivos estáticos (Netlify, Vercel, GitHub Pages, etc.).
- Una sola dependencia de producción: `astro`.

## Estructura del proyecto

```
src/
  layouts/
    Layout.astro       Documento HTML base: <head>, fuentes de Google Fonts, importa global.css
  components/
    Nav.astro           Barra de navegación sticky + selector de idioma
    Hero.astro          Cabecera con el titular gigante y el CTA principal
    Marquee.astro        Banda de texto en movimiento continuo
    Services.astro       Grid de 6 tarjetas de servicios
    Gallery.astro         Grid de fotos (sección oscura)
    Reviews.astro          Testimonios de clientas
    Contact.astro           Datos de contacto + CTA de WhatsApp (sección oscura)
    Footer.astro              Pie de página
    CutLine.astro              Barra de "tijeras + línea punteada" reutilizada en cada sección
  i18n/
    dict.ts             Diccionario de textos en es/en/gl (única fuente de verdad para los textos)
  scripts/
    site.ts             Lógica de cliente: cambio de idioma y animación de scroll-reveal
  styles/
    global.css          Tokens de diseño (colores, tipografías), keyframes, clases compartidas
  pages/
    index.astro          Ensambla todos los componentes en la página única
public/
  logo-tamara-marguenda.jpg
design_handoff_tamara_marguenda_site/
  README.md             Especificación de diseño original (handoff)
  tamara-marguenda.dc.html   Prototipo de referencia (no se reutiliza su runtime)
```

## Idiomas (ES / EN / GL)

Los textos viven en [`src/i18n/dict.ts`](src/i18n/dict.ts), un objeto con una clave por cadena de texto (`hero_t1`, `svc1_name`, etc.) y sus tres traducciones. La página se renderiza en español por defecto (server-side, sin esperar a JavaScript). Al cargar, [`src/scripts/site.ts`](src/scripts/site.ts):

1. Lee el idioma guardado en `localStorage` (clave `tm_lang`) o usa `es` por defecto.
2. Recorre todos los elementos con `data-i18n="clave"` y sustituye su texto según el diccionario.
3. Al pulsar ES/EN/GL en la barra de navegación, repite el proceso y guarda la elección.

Para añadir o cambiar un texto: edita `dict.ts` (las tres traducciones) y, si es nuevo, añade `data-i18n="esa_clave"` al elemento en el componente `.astro` correspondiente.

## Animación de las tijeras

Cada sección (`data-reveal` en la raíz) tiene una barra `CutLine.astro` con una línea punteada, tijeras SVG y unos "recortes" decorativos. Hay dos animaciones independientes, gestionadas por separado en `site.ts`:

**1. Tijeras y línea — ligadas al scroll (`setupCutScrub`)**

No se disparan una vez: su posición se recalcula en cada scroll. El progreso 0→1 de cada barra sigue directamente la posición de su propia barra de corte (`.cut-bar`) en el viewport, no la de toda la sección:

- Progreso 0 cuando la barra entra por el borde inferior del viewport (`top == vh`).
- Progreso 0.5 cuando la barra está a media pantalla (`top == vh/2`) — las tijeras quedan a mitad de la línea.
- Progreso 1 cuando la barra llega arriba del todo (`top == 0`) — corte completado.
- Avanza al bajar, **retrocede al subir** — es un scroll-scrub reversible, no una animación de "un solo disparo".
- Los recortes de pelo decorativos (`clipfall`) se disparan una vez como remate cuando el progreso llega a 1, y se rearman si se vuelve a bajar del 0.5 (para poder repetirse si se sube y se vuelve a bajar).
- Con `prefers-reduced-motion: reduce`, no escucha el scroll: deja la línea y las tijeras directamente en su posición final.

**2. Contenido (`data-piece`) — un solo disparo (`setupPieceReveal`)**

Los bloques de texto/tarjetas siguen revelándose una sola vez por sección vía `IntersectionObserver` (no se repiten al volver a hacer scroll), independientemente del scrub de las tijeras:

1. Aparecen escalonados (~70ms entre uno y otro), como si "cayeran" a su sitio.
2. Sin JavaScript, todo el contenido es visible desde el primer render (no depende del JS para mostrarse).
3. Con `prefers-reduced-motion: reduce`, no hay animación y el contenido aparece directamente.
4. Un `setTimeout` de refuerzo fija el estado final aunque la pestaña esté en segundo plano.

## Tokens de diseño

Definidos como variables CSS en `:root` dentro de [`src/styles/global.css`](src/styles/global.css):

- `--accent` (Coral `#e35a4c` por defecto): color de marca usado en eyebrows, precios, comillas, marquee y la 2ª línea del hero. Cambiable en un único sitio. El handoff documenta alternativas: Oro `#a98c52`, Fucsia `#d6336c`, Esmeralda `#1f9e7a`, Cobalto `#2f6bd8`.
- `--heading-font` (`'Bodoni Moda', serif` por defecto): tipografía de los titulares.
- `--cream`, `--green`, `--green-deep`, `--green-footer`, etc.: la paleta crema/verde de las secciones claras y oscuras.

El resto del detalle (tipografías, escalas `clamp()`, radios, espaciados) está documentado en el [handoff original](design_handoff_tamara_marguenda_site/README.md).

## Contenido pendiente de sustituir

Todo lo siguiente es contenido de ejemplo, tal como indicaba el encargo de diseño — el cliente lo sustituirá:

- **Fotos**: el placeholder rayado del hero, las 6 de la galería y el mapa. Las fotos reales vendrán de `@tamara.marguenda` en Instagram.
- **Precios y servicios** (sección Servicios): orientativos.
- **Datos de contacto** (sección Contacto): dirección, horario y teléfono son de ejemplo (`src/components/Contact.astro` y las claves `contact_*` de `dict.ts`).
- **Enlace de WhatsApp**: `https://wa.me/34600000000` es un placeholder con el número de ejemplo.
- **Mapa**: hay que sustituir el placeholder por un embed real de Google Maps una vez se tenga la dirección definitiva.
- **Testimonios**: los de Laura G., Marta R. y Sara P. son de ejemplo.

## Despliegue

Al ser un sitio 100% estático, `npm run build` genera `dist/` con HTML/CSS/JS listos para subir a cualquier hosting estático (Netlify, Vercel, Cloudflare Pages, GitHub Pages...). No requiere Node.js en el servidor de producción, solo durante el build.
