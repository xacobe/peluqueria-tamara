import { dict, LANGS, DEFAULT_LANG, type Lang, type DictKey } from '../i18n/dict';

const STORAGE_KEY = 'tm_lang';

function isLang(value: string | null): value is Lang {
  return !!value && (LANGS as string[]).includes(value);
}

function applyLang(lang: Lang) {
  const d = dict[lang];
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n') as DictKey | null;
    if (!key || !(key in d)) return;
    let text: string = d[key];
    if (text.includes('{year}')) {
      text = text.replace('{year}', String(new Date().getFullYear()));
    }
    el.textContent = text;
  });
  document.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach((btn) => {
    const on = btn.getAttribute('data-lang') === lang;
    btn.classList.toggle('is-active', on);
  });
  document.documentElement.lang = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // localStorage no disponible (modo privado, etc.): el idioma no persiste.
  }
}

function setupLangSwitcher() {
  document.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      if (isLang(lang)) applyLang(lang);
    });
  });

  let saved: string | null = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch {
    // sin localStorage, usamos el idioma por defecto
  }
  applyLang(isLang(saved) ? saved : DEFAULT_LANG);
}

// Revelado de los bloques de contenido ([data-piece]): una sola vez por
// sección, igual que antes. Es independiente del scrubbing de las tijeras.
function setupPieceReveal() {
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (sections.length === 0) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const reveal = (section: HTMLElement) => {
    const pieces = Array.from(section.querySelectorAll<HTMLElement>('[data-piece]'));
    pieces.forEach((piece, i) => {
      piece.style.transitionDelay = reducedMotion ? '0ms' : `${i * 70}ms`;
      piece.classList.add('is-revealed');
    });

    // Refuerzo del estado final: un setTimeout sigue disparando aunque la
    // pestaña esté en segundo plano (donde las transiciones CSS se pausan),
    // así el contenido nunca puede quedar a medio revelar.
    window.setTimeout(() => {
      pieces.forEach((piece) => {
        piece.style.transition = 'none';
        piece.style.transitionDelay = '0ms';
        piece.classList.add('is-revealed');
      });
    }, 1500);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          reveal(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -15% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

// Animación de las tijeras ligada al scroll: el progreso del corte (línea +
// tijeras) se recalcula en cada frame según la posición de la sección.
// Avanza al bajar y retrocede al subir, sin disparo único ni transición larga.
function setupCutScrub() {
  type CutBar = { section: HTMLElement; wrapper: HTMLElement; line: HTMLElement; scissors: HTMLElement; clipped: boolean };

  const bars: CutBar[] = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    .map((section) => {
      const line = section.querySelector<HTMLElement>('[data-cutline]');
      const scissors = section.querySelector<HTMLElement>('[data-scissors]');
      const wrapper = scissors?.parentElement;
      if (!line || !scissors || !wrapper) return null;
      return { section, wrapper, line, scissors, clipped: false };
    })
    .filter((bar): bar is CutBar => bar !== null);

  if (bars.length === 0) return;

  const travelOf = (bar: CutBar) => Math.max(0, bar.wrapper.clientWidth - 64);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    bars.forEach((bar) => {
      bar.line.style.transform = 'scaleX(1)';
      bar.scissors.style.transform = `translate(${travelOf(bar)}px, -50%)`;
    });
    return;
  }

  const triggerClips = (section: HTMLElement) => {
    section.querySelectorAll<HTMLElement>('[data-clip]').forEach((clip, i) => {
      clip.style.animation = 'none';
      requestAnimationFrame(() => {
        clip.style.animation = `clipfall 1.3s ease-in ${i * 0.1}s forwards`;
      });
    });
  };

  // El progreso sigue la posición de la propia barra en el viewport: 0 cuando
  // entra por abajo, .5 cuando está a media pantalla, 1 cuando llega arriba.
  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = window.innerHeight || document.documentElement.clientHeight;

    bars.forEach((bar) => {
      const rect = bar.wrapper.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, 1 - rect.top / vh));
      const travel = travelOf(bar);

      bar.line.style.transform = `scaleX(${progress})`;
      bar.scissors.style.transform = `translate(${progress * travel}px, -50%)`;

      if (progress >= 1 && !bar.clipped) {
        bar.clipped = true;
        triggerClips(bar.section);
      } else if (progress < 0.5 && bar.clipped) {
        bar.clipped = false;
      }
    });
  };

  const onScrollOrResize = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  window.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', onScrollOrResize);
  update();
}

setupLangSwitcher();
setupPieceReveal();
setupCutScrub();
