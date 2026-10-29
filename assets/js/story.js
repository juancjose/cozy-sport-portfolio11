/* Cozy Sport · versión "historia": progreso, tipografía cinética, videos de fondo y "Armá tu camiseta".
   Scroll natural: nada se fija ni alarga la página; los movimientos son leves y solo con transform/opacity. */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const safe = (name, fn) => { try { fn(); } catch (err) { console.warn('[cozy] ' + name + ':', err); } };

  /* ---------- Scroll: barra de progreso, frases cinéticas, hero y parallax suave ---------- */
  safe('scroll', () => {
    const prog = $('.hdr-prog');
    const kx = $$('.kx').map(el => ({ el, dir: +el.dataset.kx || -1, box: el.parentElement, max: 0 }));
    const hero = $('.st-hero-in'), heroSec = $('.st-hero');
    const par = $$('[data-par]');
    const measure = () => kx.forEach(k => { k.max = Math.max(0, k.el.scrollWidth - k.box.clientWidth); });
    let ticking = false;
    const step = () => {
      ticking = false;
      const vh = innerHeight, y = scrollY;
      const doc = document.documentElement.scrollHeight - vh;
      if (prog) prog.style.setProperty('--p', doc > 0 ? Math.min(1, y / doc).toFixed(4) : 0);
      if (reduce) return;
      kx.forEach(k => {
        const r = k.box.getBoundingClientRect();
        if (r.bottom < -50 || r.top > vh + 50) return;
        const t = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));   // 0 al entrar, 1 al salir
        const travel = Math.min(k.max, innerWidth * .45);
        const x = k.dir < 0 ? -t * travel : -(1 - t) * travel;
        k.el.style.setProperty('--kx', x.toFixed(1) + 'px');
      });
      if (hero && heroSec) {
        const h = heroSec.offsetHeight;
        if (y < h) {
          const p = y / h;
          hero.style.transform = `translate3d(0,${(y * .22).toFixed(1)}px,0)`;
          hero.style.opacity = (1 - p * .9).toFixed(3);
        }
      }
      par.forEach(el => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const c = r.top + r.height / 2 - vh / 2;
        el.style.transform = `translate3d(0,${(-c * parseFloat(el.dataset.par)).toFixed(1)}px,0)`;
      });
    };
    const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(step); } };
    addEventListener('scroll', req, { passive: true });
    addEventListener('resize', () => { measure(); req(); });
    addEventListener('load', () => { measure(); req(); });
    document.fonts && document.fonts.ready.then(() => { measure(); req(); });
    measure(); step();
  });

  /* ---------- Videos de fondo: solo escritorio, sin "ahorro de datos" ni movimiento reducido ---------- */
  safe('videos', () => {
    const conn = navigator.connection || {};
    const ok = !reduce && !conn.saveData && matchMedia('(min-width: 900px)').matches && 'IntersectionObserver' in window;
    if (!ok) return;
    const io = new IntersectionObserver(es => es.forEach(e => {
      const box = e.target;
      let v = box.querySelector('video');
      if (e.isIntersecting) {
        if (!v) {
          const n = box.dataset.video;
          v = document.createElement('video');
          v.muted = true; v.defaultMuted = true; v.loop = true; v.playsInline = true; v.autoplay = true;
          v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true');
          v.preload = 'auto';
          v.poster = `assets/video/${n}-poster-1280.webp`;
          v.innerHTML = `<source src="assets/video/${n}.webm" type="video/webm"><source src="assets/video/${n}.mp4" type="video/mp4">`;
          v.addEventListener('playing', () => v.classList.add('on'));
          box.appendChild(v);
        }
        const p = v.play(); p && p.catch(() => {});
      } else if (v) v.pause();
    }), { rootMargin: '120px 0px' });
    $$('.vbg[data-video]').forEach(b => io.observe(b));
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) $$('.vbg video').forEach(v => v.pause());
    });
  });

  /* ---------- Armá tu camiseta ---------- */
  safe('kit', () => {
    const svg = $('#kbSvg'), form = $('#kbForm');
    if (!svg || !form) return;
    const COLORS = [
      ['Verde Cozy', '#00af31'], ['Negro', '#17191a'], ['Blanco', '#f2f2ee'], ['Azul', '#1d4fd8'], ['Celeste', '#6cb8ea'],
      ['Rojo', '#d32a30'], ['Amarillo', '#f4c41a'], ['Naranja', '#f26b1d'], ['Bordó', '#6e1631'], ['Gris', '#8b9196'],
    ];
    const SPORTS = { futbol: 'Camiseta de fútbol', ciclismo: 'Maillot de ciclismo', running: 'Musculosa de running' };
    const SPORT_N = { futbol: 'Fútbol', ciclismo: 'Ciclismo', running: 'Running' };
    const PATS = { liso: 'Liso', bastones: 'Bastones', banda: 'Banda', franja: 'Franja' };
    const BODY = {
      futbol: 'M142 38C162 52 238 52 258 38L326 60C340 66 352 78 360 92L392 152 344 182 318 146 318 392C318 400 312 404 304 404H96C88 404 82 400 82 392V146L56 182 8 152 40 92C48 78 60 66 74 60Z',
      ciclismo: 'M150 32C170 40 230 40 250 32L314 54C328 60 338 70 344 84L376 160 338 176 312 128 308 396C308 402 304 406 298 406H102C96 406 92 402 92 396L88 128 62 176 24 160 56 84C62 70 72 60 86 54Z',
      running: 'M146 30C160 84 240 84 254 30H284C288 96 304 130 322 146L318 396C318 402 314 406 308 406H92C86 406 82 402 82 396L78 146C96 130 112 96 116 30Z',
    };
    const TRIM = {
      futbol: `<path class="c2" d="M392 152 344 182 337 172 385 142Z"/><path class="c2" d="M8 152 56 182 63 172 15 142Z"/>
        <path class="seam" d="M74 60 82 146M326 60 318 146M86 390H314"/>`,
      ciclismo: `<path class="c2" d="M376 160 338 176 331 164 369 148Z"/><path class="c2" d="M24 160 62 176 69 164 31 148Z"/>
        <path class="c2" d="M92 390H308V396C308 402 304 406 298 406H102C96 406 92 402 92 396Z"/>
        <path class="seam" d="M112 140C118 250 114 330 106 404M288 140C282 250 286 330 294 404"/>`,
      running: `<path class="s2" fill="none" stroke-width="10" d="M146 30C160 84 240 84 254 30M284 30C288 96 304 130 322 146M116 30C112 96 96 130 78 146"/>
        <path class="seam" d="M86 392H314"/>`,
    };
    const OVER = {
      futbol: `<path d="M142 38C162 52 238 52 258 38 236 28 164 28 142 38Z" fill="rgba(0,0,0,.38)"/>
        <path class="s2" d="M142 38C162 52 238 52 258 38" fill="none" stroke-width="8" stroke-linecap="round"/>`,
      ciclismo: `<path class="c2" d="M150 32C170 40 230 40 250 32L248 18C228 25 172 25 152 18Z"/>
        <path d="M152 18C172 25 228 25 248 18" fill="none" stroke="rgba(0,0,0,.3)" stroke-width="1.5"/>
        <path d="M200 26V404" stroke="rgba(0,0,0,.4)" stroke-width="2.2"/><rect x="195.5" y="34" width="9" height="18" rx="2.5" fill="#d9dcd9" stroke="rgba(0,0,0,.35)"/>`,
      running: '',
    };
    const LOGO = { futbol: [234, 92], ciclismo: [226, 84], running: [222, 104] };
    let stripes = '';
    for (let k = -5; k <= 5; k++) stripes += `<rect x="${189 + k * 44}" y="0" width="22" height="420"/>`;
    const cut = s => `
      <g class="cut cut-${s}">
        <clipPath id="kb-clip-${s}"><path d="${BODY[s]}"/></clipPath>
        <path class="c1" d="${BODY[s]}"/>
        <g clip-path="url(#kb-clip-${s})">
          <g class="c2 pat p-bastones">${stripes}</g>
          <path class="c2 pat p-banda" d="M30 10H112L392 430H310Z"/>
          <g class="c2 pat p-franja"><rect x="0" y="150" width="400" height="58"/><rect x="0" y="218" width="400" height="8"/></g>
          ${TRIM[s]}
          <rect width="400" height="420" fill="url(#kb-shade)"/>
          <rect width="400" height="420" fill="url(#kb-light)"/>
          <path d="M150 120C170 180 160 260 172 330M262 150C250 210 258 280 244 360" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="10" stroke-linecap="round"/>
        </g>
        ${OVER[s]}
        <use href="#i-z" class="ink logo" x="${LOGO[s][0]}" y="${LOGO[s][1]}" width="40" height="30"/>
        <path class="edge" d="${BODY[s]}"/>
      </g>`;
    svg.innerHTML = `
      <defs>
        <linearGradient id="kb-shade" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".34"/><stop offset=".2" stop-color="#000" stop-opacity=".06"/><stop offset=".5" stop-color="#fff" stop-opacity=".07"/><stop offset=".8" stop-color="#000" stop-opacity=".06"/><stop offset="1" stop-color="#000" stop-opacity=".36"/></linearGradient>
        <linearGradient id="kb-light" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".10"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>
      </defs>
      <ellipse cx="200" cy="414" rx="150" ry="8" fill="rgba(0,0,0,.45)"/>
      ${cut('futbol')}${cut('ciclismo')}${cut('running')}
      <text class="team" x="200" y="262" text-anchor="middle" paint-order="stroke" stroke-linejoin="round"></text>`;
    const team = $('.team', svg);

    // muestras de color (radiogroup accesible)
    const pick = { c1: 0, c2: 2 };
    const lum = hex => { const n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255].map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
    const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
    $$('.sw', form).forEach(box => {
      const key = box.dataset.sw;
      box.setAttribute('role', 'radiogroup');
      box.setAttribute('aria-label', key === 'c1' ? 'Color principal' : 'Color secundario');
      COLORS.forEach(([name, hex], i) => {
        const b = document.createElement('button');
        b.type = 'button'; b.setAttribute('role', 'radio'); b.setAttribute('aria-label', name); b.title = name;
        b.style.setProperty('--c', hex);
        b.style.setProperty('--ck', lum(hex) > .45 ? '#111' : '#fff');
        b.addEventListener('click', () => { pick[key] = i; update(); });
        b.addEventListener('keydown', e => {
          const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
          if (!d) return; e.preventDefault();
          pick[key] = (pick[key] + d + COLORS.length) % COLORS.length; update(); box.children[pick[key]].focus();
        });
        box.appendChild(b);
      });
    });
    const val = n => (form.querySelector(`input[name="${n}"]:checked`) || {}).value;
    const name = $('#kbName');
    let state = {};
    const update = () => {
      const sport = val('kb-sport') || 'futbol', pat = val('kb-pat') || 'liso';
      const [n1, c1] = COLORS[pick.c1], [n2, c2] = COLORS[pick.c2];
      // texto y logo: color secundario si se lee bien sobre el principal; si no, blanco o negro
      const ct = pick.c1 !== pick.c2 && contrast(c1, c2) >= 2.2 ? c2 : (lum(c1) > .4 ? '#111' : '#fff');
      svg.dataset.sport = sport; svg.dataset.pat = pick.c1 === pick.c2 ? 'liso' : pat;
      svg.style.setProperty('--c1', c1); svg.style.setProperty('--c2', c2); svg.style.setProperty('--ct', ct);
      const t = (name.value || '').trim().toUpperCase().slice(0, 14);
      team.textContent = t;
      team.setAttribute('font-size', t.length > 10 ? 24 : 30);
      team.setAttribute('stroke', c1); team.setAttribute('stroke-width', pat === 'liso' ? 0 : 6);
      $$('.sw', form).forEach(box => [...box.children].forEach((b, i) => b.setAttribute('aria-checked', String(i === pick[box.dataset.sw]))));
      $('#kbC1n').textContent = n1; $('#kbC2n').textContent = n2;
      const colors = pick.c1 === pick.c2 ? n1 : `${n1} y ${n2}`;
      $('#kbSum').textContent = `${SPORTS[sport]} · ${PATS[pat]} · ${colors}${t ? ' · “' + t + '”' : ''}`;
      state = { sport, pat, n1, n2, t };
    };
    form.addEventListener('change', update);
    name.addEventListener('input', update);
    name.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); name.blur(); } });
    update();

    window.cozyKitMessage = () => [
      'Hola! Armé mi camiseta en la web de Cozy Sport y la quiero.',
      '',
      '*Deporte:* ' + SPORT_N[state.sport],
      '*Diseño:* ' + PATS[state.pat],
      '*Color principal:* ' + state.n1,
      '*Color secundario:* ' + state.n2,
      state.t ? '*Nombre del equipo:* ' + state.t : '',
      '',
      '¿Me ayudás a hacerla realidad?',
    ].filter((l, i, a) => l || (a[i - 1] && a[i - 1] !== '')).join('\n');
  });
})();
