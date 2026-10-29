# Cozy Sport · Sitio web (versión historia)

**🔗 Ver la página online: [juancjose.github.io/cozy-sport-portfolio11](https://juancjose.github.io/cozy-sport-portfolio11/)**

Sitio de **Cozy Sport** (fábrica argentina de indumentaria deportiva personalizada, Beccar, desde 1983) contado como **un solo recorrido**: se baja con el scroll normal, sin secciones fijadas ni "ventanas" apiladas. Tiene toda la información del sitio completo, ordenada como una historia que termina en la [tienda online](https://tiendacozy.com/):

0. **Hero** con video de ciclistas: *Vestimos tu pasión a medida*, con *Ir a la tienda* y *Armá tu camiseta*.
1. **Nosotros e historia**: desde 1983, industria nacional, empresa familiar, taller propio; la línea de tiempo (1983 → hoy) y la historia completa desplegable.
2. **Taller en Beccar**: de tu idea a la meta (3 pasos), las 6 etapas de cada prenda (en el celu se deslizan de costado) y los servicios.
3. **Deportes**: video de running, las 6 disciplinas (cada una lleva a la tienda), la línea ciclismo con sus kits, la mochila (video de YouTube) y otro *Ir a la tienda*.
4. **Armá tu camiseta**: elegís deporte (fútbol, ciclismo, running), diseño (liso, bastones, banda, franja), dos colores y el nombre del equipo. La vista previa cambia al instante, y **La quiero** abre la medialuna de vendedoras con el diseño ya escrito para WhatsApp.
5. **Tienda**: video de aguas abiertas con un *Ir a tiendacozy.com* bien grande.
6. **Preguntas frecuentes y contacto**, compactos al final, con *Hablá con nuestras vendedoras*.

La navbar queda fija siempre visible, con *Ir a la tienda* también en el celu y una barra fina de progreso. El logo vuelve arriba. Las frases gigantes se deslizan levemente con el scroll, el contenido aparece al entrar en pantalla y los videos se cargan solo en escritorio, se pausan fuera de pantalla y se reemplazan por una foto en el celu o con movimiento reducido.

## Estructura
```
index.html             ← GENERADO (no editar a mano)
src/index.html         ← plantilla fuente
assets/css/styles.css  ← sistema de diseño base
assets/css/story.css   ← estilos de esta versión
assets/js/main.js      ← menú, aparición, vendedoras (números de WhatsApp arriba de todo)
assets/js/story.js     ← progreso, tipografía cinética, videos y "Armá tu camiseta"
assets/img/            ← fotos WebP 640/1280/1920 + credits.json
assets/video/          ← videos MP4/WebM (10 s, sin audio) + pósters + credits.json
tools/build.py         ← expande tokens de src/ en index.html (con créditos y cache-busting)
tools/sprite.svg       ← íconos SVG
screenshots/           ← capturas desktop y mobile
```

## Cómo editar
1. Editá `src/index.html`, `assets/css/*.css` o `assets/js/*.js`.
2. Ejecutá `python3 tools/build.py` para regenerar `index.html`.
3. Para probar en local: `python3 -m http.server 8000` y abrí http://localhost:8000

⚠️ Los números de WhatsApp de las vendedoras en `assets/js/main.js` (`VENDEDORES`) son placeholders: hay que reemplazarlos por los reales.

## Créditos
Fotos y videos de [Pexels](https://www.pexels.com), usados bajo su licencia libre. El detalle de cada uno y su autor está en `assets/img/credits.json`, `assets/video/credits.json` y en el pie del sitio. Videos: *Cyclists Racing on Country Road in Summer* (Efrem Efre), *A Person Running in the Street* (Pavel Danilyuk) y *Drone Shot of People Swimming on the Beach* (N E). La foto de la fachada es de Cozy Sport. Los textos son de Cozy Sport.
