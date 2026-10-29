/* Cozy Sport — interacciones y animaciones (vanilla, sin dependencias) */

/* ================================================================
   VENDEDORES · WhatsApp del formulario de contacto
   ⚠️ ACÁ VAN LOS NÚMEROS REALES. Los de abajo son placeholders falsos.
   Formato wa.me: 549 + código de área sin el 0 + número sin el 15.
   Ej.: 011 15 1234-5678  →  '5491112345678'
   ================================================================ */
const VENDEDORES = [
  { nombre: 'Yesi',   tel: '5491100000001' },
  { nombre: 'Moni',   tel: '5491100000002' },
  { nombre: 'Cami',   tel: '5491100000003' },
  { nombre: 'Cintia', tel: '5491100000004' },
  { nombre: 'Maca',   tel: '5491100000005' },
];
const VENDEDORES_ROL = 'Asesora de ventas';
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const root = document.documentElement;
  // Cada bloque corre aislado: si uno falla (p. ej. falta un elemento), los demás siguen funcionando.
  const safe = (name, fn) => { try { fn(); } catch (err) { console.warn('[cozy] ' + name + ':', err); } };
  const last = a => a[a.length - 1];

  /* ---------- Preloader ---------- */
  safe('preloader', () => {
  const pre = $('.preloader');
  const hidePre = () => pre && pre.classList.add('done');
  if (reduce) hidePre();
  else { addEventListener('load', () => setTimeout(hidePre, 250)); setTimeout(hidePre, 1800); }
  });

  /* ---------- Reveal on scroll ---------- */
  // Con movimiento reducido también se revela al entrar, pero solo con fundido (sin desplazamiento; ver CSS).
  safe('reveal', () => {
    const els = $$('.rv, .rv-img'), show = el => el.classList.add('in');
    if (!('IntersectionObserver' in window)) return els.forEach(show);
    const io = new IntersectionObserver((es) => es.forEach(e => {
      if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -6% 0px', threshold: 0 });
    els.forEach(el => io.observe(el));
    // Red de seguridad: lo que quedó por encima del viewport (salto por ancla) se muestra igual
    addEventListener('scroll', () => els.forEach(el => !el.classList.contains('in') && el.getBoundingClientRect().bottom < 0 && show(el)), { passive: true });
  });

  /* ---------- Header + menú ---------- */
  const hdr = $('.hdr'), burger = $('.burger');
  safe('menu', () => {
  if (!burger) return;
  burger.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  $$('.mnav a').forEach(a => a.addEventListener('click', () => {
    document.body.classList.remove('menu-open'); document.body.style.overflow = ''; burger.setAttribute('aria-expanded', 'false');
  }));
  addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.classList.contains('menu-open')) burger.click(); });
  });

  // Link activo
  safe('nav-activo', () => {
  const links = $$('.nav a');
  const secIO = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  links.forEach(a => { const h = a.getAttribute('href') || ''; const s = h.length > 1 && h.startsWith('#') && $(h); s && secIO.observe(s); });
  });

  /* ---------- Scroll: header, parallax, ruta, timeline ---------- */
  safe('scroll', () => {
  const par = $$('[data-parallax]');
  const route = $('#routeDraw'), routeWrap = $('.route-wrap'), routeBase = $('#routeBase'), routeBike = $('#routeBike');
  const tl = $('#timeline');
  let routeLen = 0;
  // Ruta que conecta las etapas: se recalcula según el layout real
  const buildRoute = () => {
    if (!route || !routeWrap || !routeBase || !$('.finish', routeWrap)) return;
    const wr = routeWrap.getBoundingClientRect();
    const pts = $$('.step-n b', routeWrap).map(b => { const r = b.getBoundingClientRect(); return [r.left - wr.left + r.width / 2, r.top - wr.top + r.height / 2, r.bottom - wr.top]; });
    const steps = $$('.step', routeWrap).map(s => s.getBoundingClientRect().bottom - wr.top);
    const fin = $('.finish', routeWrap).getBoundingClientRect();
    pts.push([fin.left - wr.left + fin.width / 2, fin.top - wr.top - 6]);
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1] = pts[i], [x2, y2] = pts[i + 1];
      const gm = i < steps.length - 1 ? (steps[i] + (pts[i + 1][1] - 40)) / 2 + 10 : (steps[i] + y2) / 2;
      const r = Math.min(46, Math.abs(x2 - x1) / 2 || 1);
      d += ` L${x1} ${gm - r} C${x1} ${gm} ${x2} ${gm} ${x2} ${gm + r} L${x2} ${y2}`;
    }
    route.setAttribute('d', d); routeBase.setAttribute('d', d);
    routeLen = route.getTotalLength();
    route.style.strokeDasharray = routeLen;
  };
  safe('ruta-etapas', buildRoute);
  let lastY = scrollY, ticking = false;
  const vis = new Set();
  const visIO = new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? vis.add(e.target) : vis.delete(e.target)), { rootMargin: '20% 0px' });
  par.forEach(p => visIO.observe(p));
  const sectionProgress = (el, start = 0.85, end = 0.35) => {
    const r = el.getBoundingClientRect(), vh = innerHeight;
    return Math.min(1, Math.max(0, (vh * start - r.top) / (r.height + vh * (start - end))));
  };
  const onScroll = () => { try { scrollStep(); } catch (err) { console.warn('[cozy] scroll:', err); } ticking = false; };
  const scrollStep = () => {
    const y = scrollY;
    if (hdr) {
      hdr.classList.toggle('scrolled', y > 40);
    }
    lastY = y;
    if (!reduce) {
      vis.forEach(el => {
        const r = el.parentElement.getBoundingClientRect();
        const c = (r.top + r.height / 2 - innerHeight / 2);
        el.style.transform = `translate3d(0,${(-c * parseFloat(el.dataset.parallax)).toFixed(1)}px,0)`;
      });
    }
    // La ruta de etapas se dibuja con el scroll también con movimiento reducido (es un trazo, no un desplazamiento);
    // en ese caso se oculta la bici que la recorre.
    if (route && routeLen && routeWrap) {
      const k = sectionProgress(routeWrap, 0.75, 0.55);
      route.style.strokeDashoffset = (routeLen * (1 - k)).toFixed(1);
      if (routeBike) {
        if (reduce) routeBike.style.display = 'none';
        else { const pt = route.getPointAtLength(routeLen * k); routeBike.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`); }
      }
    }
    if (tl) tl.style.setProperty('--tp', sectionProgress(tl, 0.7, 0.5).toFixed(3));
  };
  addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  const rebuild = () => { safe('ruta-etapas', buildRoute); onScroll(); };
  addEventListener('resize', rebuild);
  addEventListener('load', rebuild);
  document.fonts && document.fonts.ready.then(rebuild);
  onScroll();
  });

  /* ---------- Tilt 3D ---------- */
  if (fine && !reduce) safe('tilt', () => {
    document.addEventListener('pointermove', e => {
      const el = e.target.closest('[data-tilt]');
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      el.style.transform = `perspective(900px) rotateX(${((0.5 - py) * 7).toFixed(2)}deg) rotateY(${((px - 0.5) * 9).toFixed(2)}deg) translateY(-4px)`;
      el.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
      el.style.setProperty('--my', (py * 100).toFixed(1) + '%');
    });
    document.addEventListener('pointerout', e => {
      const el = e.target.closest('[data-tilt]');
      if (el && !el.contains(e.relatedTarget)) el.style.transform = '';
    });
  });

  /* ---------- Video (carga diferida) ---------- */
  safe('video', () => $$('[data-yt]').forEach(b => b.addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${b.dataset.yt}?autoplay=1&rel=0`;
    f.title = b.getAttribute('aria-label').replace('Reproducir video: ', '');
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    f.allowFullscreen = true;
    const box = Object.assign(document.createElement('div'), { className: 'video' });
    box.appendChild(f); b.replaceWith(box);
  })));

  /* ---------- "Hablá con nuestras vendedoras": medialuna de burbujas → WhatsApp ---------- */
  // Se usa en dos lugares: el formulario de contacto y el "La quiero" de Armá tu camiseta.
  // Nombres y números salen solo de VENDEDORES (arriba de todo).
  const store = { get: k => { try { return localStorage.getItem(k); } catch (_) { return null; } },
                  set: (k, v) => { try { localStorage.setItem(k, v); } catch (_) {} } };
  const picker = ({ talk, btn, arc, note, check, message, sent }) => {
    if (!talk || !btn || !arc) return null;
    note = note || { style: {} };
    const team = VENDEDORES, N = team.length;
    let last = parseInt(store.get('cozy-vendedor'), 10);
    if (!(last >= 0 && last < N)) last = -1;
    const cap = document.createElement('p');
    cap.className = 'talk-cap'; cap.setAttribute('aria-hidden', 'true');
    cap.innerHTML = 'Elegí con quién hablar<small>' + VENDEDORES_ROL.replace(/^(\S+)/, '$1s') + '</small>';
    arc.appendChild(cap);
    // Ángulos repartidos en media luna, de izquierda a derecha (5 → 162°, 126°, 90°, 54°, 18°)
    const bubs = team.map((v, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'bub'; b.tabIndex = -1;
      b.style.setProperty('--a', (180 - (180 / N) * (i + .5)) + 'deg');
      b.style.setProperty('--d', (i * 45) + 'ms');
      b.setAttribute('aria-label', 'Escribirle a ' + v.nombre + ' por WhatsApp');
      b.innerHTML = '<svg aria-hidden="true"><use href="#i-user"/></svg><span class="bub-name" aria-hidden="true">' + v.nombre + '</span>';
      b.addEventListener('click', () => send(i));
      arc.appendChild(b);
      return b;
    });
    const mark = () => bubs.forEach((b, i) => { b.classList.toggle('last', i === last); });
    mark();
    let isOpen = false, tClose = 0, hold = false;
    const toBtn = () => { hold = true; btn.focus(); hold = false; };
    const setOpen = v => {
      clearTimeout(tClose);
      if (v === isOpen) return;
      isOpen = v; talk.classList.toggle('open', v); btn.setAttribute('aria-expanded', String(v));
      if (!v && arc.contains(document.activeElement)) toBtn();
    };
    const start = () => (last >= 0 ? last : Math.floor(N / 2));
    const focusBub = i => { const k = (i + N) % N; bubs.forEach((b, j) => { b.tabIndex = j === k ? 0 : -1; }); bubs[k].focus(); };
    bubs[start()].tabIndex = 0;
    if (fine) {
      talk.addEventListener('mouseenter', () => setOpen(true));
      talk.addEventListener('mouseleave', () => {
        clearTimeout(tClose);
        tClose = setTimeout(() => { const a = document.activeElement; if (!(arc.contains(a) && a.matches(':focus-visible'))) setOpen(false); }, 280);
      });
    }
    btn.addEventListener('focus', () => { if (!hold && btn.matches(':focus-visible')) setOpen(true); });
    btn.addEventListener('click', e => {
      if (e.detail === 0) { setOpen(true); focusBub(start()); }   // Enter / Espacio
      else if (fine) setOpen(true);
      else setOpen(!isOpen);                                        // táctil: toca para abrir y cerrar
    });
    btn.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); focusBub(start()); }
    });
    arc.addEventListener('keydown', e => {
      const i = bubs.indexOf(document.activeElement); if (i < 0) return;
      const go = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: N - 1 }[e.key];
      if (go !== undefined) { e.preventDefault(); focusBub(go); }
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isOpen) { const inside = talk.contains(document.activeElement); setOpen(false); if (inside) toBtn(); }
    });
    document.addEventListener('pointerdown', e => { if (isOpen && !talk.contains(e.target)) setOpen(false); });
    talk.addEventListener('focusout', () => setTimeout(() => {
      if (isOpen && !talk.contains(document.activeElement) && !(fine && talk.matches(':hover'))) setOpen(false);
    }, 0));
    const send = i => {
      if (check && !check(() => setOpen(false))) return;
      const seller = team[i];
      last = i; store.set('cozy-vendedor', String(i)); mark();
      setOpen(false);
      const url = 'https://wa.me/' + seller.tel + '?text=' + encodeURIComponent(message());
      const w = window.open(url, '_blank');
      if (w) { try { w.opener = null; } catch (_) {} } else location.href = url;
      note.style.color = ''; note.textContent = '¡Listo! Se abrió WhatsApp para escribirle a ' + seller.nombre + '. Si no se abrió, revisá que tu navegador permita ventanas emergentes.';
      sent && sent(seller);
    };
    return { open: () => { setOpen(true); focusBub(start()); } };
  };

  safe('form', () => {
    const form = $('#contactForm');
    if (!form) return;
    const note = $('#formNote');
    const check = close => {
      const bad = [...form.querySelectorAll('[required]')].find(el => !String(el.value || '').trim())
        || [...form.elements].find(el => el.willValidate && !el.checkValidity());
      if (!bad) return true;
      close();
      note.textContent = String(bad.value || '').trim()
        ? 'Revisá que los datos estén bien escritos.'
        : 'Completá tu nombre y tu idea para que podamos ayudarte.';
      note.style.color = '#ff8f80';
      bad.focus();
      return false;
    };
    const message = () => {
      const fd = new FormData(form), lines = ['Hola! Te escribo desde la web de Cozy Sport.', ''];
      [['nombre', 'Nombre'], ['email', 'Email'], ['telefono', 'Teléfono'], ['equipo', 'Equipo/Club'], ['disciplina', 'Disciplina'], ['cantidad', 'Cantidad']]
        .forEach(([k, l]) => { const v = String(fd.get(k) || '').trim(); if (v) lines.push('*' + l + ':* ' + v); });
      lines.push('', '*Idea:*', String(fd.get('mensaje') || '').trim());
      return lines.join('\n');
    };
    const p = picker({ talk: $('#talk'), btn: $('#talkBtn'), arc: $('#talkArc'), note, check, message });
    // Enter dentro del formulario: valida y abre la medialuna para elegir
    form.addEventListener('submit', e => { e.preventDefault(); if (p && check(() => {})) p.open(); });
  });

  // Armá tu camiseta → "La quiero": el mensaje lo arma story.js (window.cozyKitMessage)
  safe('kit-picker', () => {
    picker({ talk: $('#kitTalk'), btn: $('#kitTalkBtn'), arc: $('#kitTalkArc'), note: $('#kbNote'),
      message: () => (window.cozyKitMessage ? window.cozyKitMessage() : 'Hola! Quiero armar una camiseta personalizada con Cozy Sport.') });
  });

  const yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();
})();

/* Logo: vuelve arriba de todo */
document.querySelectorAll('a.logo').forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  if (document.body.classList.contains('menu-open')) { document.body.classList.remove('menu-open'); document.body.style.overflow = ''; const b = document.querySelector('.burger'); if (b) { b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-label', 'Abrir menú'); } }
  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: rm ? 'auto' : 'smooth' });
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
}));
