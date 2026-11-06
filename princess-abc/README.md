# Princess ABC 👑

PWA infantil (4 años) para aprender el **alfabeto inglés**: una princesa, 6 mundos, 4 mini juegos, estrellas y tesoros.
Sin cuentas, sin anuncios, sin vidas ni temporizadores. Funciona offline tras la primera carga.

## Ejecutar
```bash
npm install
npm run dev          # desarrollo (http://localhost:5173)
npm test             # pruebas unitarias (motor adaptativo, recompensas, IndexedDB)
npm run build        # tsc + build de producción + service worker (dist/)
npm run preview      # sirve dist/ para probar PWA/offline (http://localhost:4173)
npm run icons        # regenera los PNG desde public/icons/icon.svg
```

## Desplegar
`dist/` es 100 % estático y usa rutas relativas (`base: './'`): súbelo a cualquier hosting **HTTPS**
(GitHub Pages, Netlify, Cloudflare Pages, Vercel…). Para instalar en Android abrir en Chrome → “Instalar app”.
Cada build genera un nuevo service worker; el navegador descarga la versión nueva en segundo plano y se aplica
al volver a la **pantalla principal** (nunca a mitad de un juego). Las cachés antiguas se limpian solas.

## Arquitectura
```
src/
  app/            App (rutas), store (estado + IndexedDB), pwa (registro SW)
  components/     princess/ (SVG animada, globo), buttons/, feedback/ (confeti, estrellas), layout/, art/ (26 ilustraciones, mundos, iconos)
  data/           alphabet.ts · worlds.ts · rewards.ts   ← contenido centralizado
  features/       onboarding · home · world-map · lessons (intro + sesión) · mini-games · rewards · parent-dashboard
  services/
    audio/            voz (archivos → SpeechSynthesis), efectos y música por WebAudio
    storage/          Dexie: letters, lessons, attempts, sessions, meta
    learning-engine/  estados NEW/PRACTICING/LEARNED, prioridades, planificador de sesiones, recompensas
public/ icons/ · audio/ (manifest + README)
```

## Sistema adaptativo
- **NEW** sin intentos. **PRACTICING** con intentos. **LEARNED** exige TODO: aciertos en ≥3 tipos de actividad,
  en ≥2 sesiones distintas, un acierto ≥4 h después del primero y ≥80 % en los últimos intentos.
  Vuelve a PRACTICING si la precisión reciente cae por debajo del 80 %.
- Prioridad de repaso: 1) nuevas, 2) con dificultades (error reciente ≥ 34 %), 3) en práctica / sin ver hace tiempo, 4) aprendidas.
- Cada sesión: letra nueva (presentación) + Find · Match · Pop · Magic Treasure, mezclando letras de repaso, sin repetir
  el mismo ejercicio/letra consecutivamente. Al terminar todas las lecciones, CONTINUE lanza repasos adaptativos.

## Audio
Ver `public/audio/README.md`. **Voz natural: pendiente** — hoy se usa la voz sintética del dispositivo (en-US) como
solución provisional; basta dejar los `.mp3` y listarlos en `manifest.json` (se precachean offline). Efectos y música
se sintetizan por WebAudio (sin archivos).

## Limitaciones conocidas
- La calidad de la voz provisional depende del dispositivo (Android/Chrome suele traer en-US).
- Sin archivos de voz grabados todavía; la música ambiental es procedural y simple.
- La regla de LEARNED necesita al menos ~4 h entre aciertos, así que una letra no pasa a “learned” el mismo día.
