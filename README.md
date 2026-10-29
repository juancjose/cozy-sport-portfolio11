# Cozy Sport · Sitio web (versión simple)

**🔗 Ver la página online: [juancjose.github.io/cozy-sport-portfolio11](https://juancjose.github.io/cozy-sport-portfolio11/)**

Versión resumida del sitio de **Cozy Sport** (fábrica argentina de indumentaria deportiva personalizada, Beccar, desde 1983), pensada para llevar a la gente a la [tienda online](https://tiendacozy.com/) con el menor texto posible. Todo en **dos secciones**:

1. **Inicio**: hero a pantalla completa con una frase y el botón *Ir a la tienda*, y abajo las disciplinas en tarjetas con foto (cada una lleva a la tienda).
2. **Contacto**: quiénes somos en dos líneas, dirección, teléfono, mail e Instagram, y el formulario con *Hablá con nuestras vendedoras* (medialuna de 5 burbujas que abre WhatsApp con la consulta ya escrita).

Navbar fija con el logo (vuelve arriba), Inicio, Contacto y el botón Tienda. Probado en 1440, 390 y 360 px, también con movimiento reducido.

## Estructura
```
index.html            ← GENERADO (no editar a mano)
src/index.html        ← plantilla fuente
assets/css/styles.css ← sistema de diseño base
assets/css/simple.css ← estilos de esta versión en 2 secciones
assets/js/main.js     ← interacciones (vendedoras y números de WhatsApp arriba de todo)
assets/img/           ← fotos WebP 640/1280/1920 + credits.json
tools/build.py        ← expande tokens de src/ en index.html (con cache-busting)
tools/images.py       ← descarga las fotos de Pexels y genera las variantes
tools/sprite.svg      ← íconos SVG
screenshots/          ← capturas desktop y mobile
```

## Cómo editar
1. Editá `src/index.html`, `assets/css/*.css` o `assets/js/main.js`.
2. Ejecutá `python3 tools/build.py` para regenerar `index.html`.
3. Para probar en local: `python3 -m http.server 8000` y abrí http://localhost:8000

⚠️ Los números de WhatsApp de las vendedoras en `assets/js/main.js` (`VENDEDORES`) son placeholders: hay que reemplazarlos por los reales.

## Créditos
Las fotos son de [Pexels](https://www.pexels.com) y se usan bajo su licencia libre; el detalle de cada foto y su autor está en `assets/img/credits.json` y en el pie del sitio. El logo (isotipo Z + COZY) está en `assets/img/cozy-wordmark*.svg` y `favicon.svg`. Los textos son de Cozy Sport.
