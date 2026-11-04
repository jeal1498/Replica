# Plan de lanzamiento de Checa en Google Play

## Antes de producción (ahora → 15 nov)
- [ ] **12 testers 14 días seguidos** en Prueba cerrada (requisito de Play). Lista desde `/registro/` y la comunidad de WhatsApp.
- [ ] Ficha: pegar `listing.json` en Play Console (pasa `listing.py`: 29/30, 64/80, 2571/4000).
- [ ] Capturas de la app **sin pantallas de Uber o DiDi**: pop-up verde, rojo con motivo, dos ofertas con ⭐, Mi día, Mis metas. Y el gráfico de funciones de 1024×500.
- [ ] Seguridad de los datos al día (`docs/google-play/data-safety.md`) y declaración de Accesibilidad con video.
- [ ] Medición: eventos de la web (ya existe) + **errores de la app** (por ejemplo, Firebase Crashlytics) para saber cuándo deja de leer antes de que llegue la reseña.

## Arreglos que van antes de cobrar (1 feb 2027)
En orden, en el repo de Checa: **fixes #1 guardián del lector**, #2 reporte en un toque, #3 pruebas del Parser, #4 Play Billing con cancelar en un toque (Fase 7), #5 mostrar lo que leyó.

## Dónde están los conductores descontentos
- Reseñas de 1 y 2 estrellas de la competencia en Play: son el público, no testimonios. No contestarles ni mencionarlas.
- Grupos de Facebook y WhatsApp de conductores de Uber y DiDi en México, TikTok (`@checa.driver`, `@Eduardoalv9802`).
- Reddit y Hacker News: no hubo conversación relevante; no vale la pena.

## Mensaje del lanzamiento
Video «Checa ya está en Google Play» con el ángulo: **«Si en 7 días no lee tus ofertas, no pagas.»** CTA vigente: «Comenta CHECA».

## Los primeros 10
Llamar o escribir por WhatsApp, uno por uno, a los 10 primeros que se suscriban: qué los hizo pagar, qué falló y qué app usaban antes. Anotarlo en `clientes.md`.
