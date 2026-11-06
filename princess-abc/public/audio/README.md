# Audios de Princess ABC

La app reproduce voz **desde archivos** si están listados en `manifest.json`; si no, usa la voz sintética
del dispositivo (en-US) como solución provisional. Los efectos y la música se generan por WebAudio.

## Cómo añadir voz natural (inglés estadounidense)
1. Graba/genera los `.mp3` (mono, 44.1 kHz, ~64 kbps) y colócalos así:
   - `letters/a.mp3 … z.mp3` — nombre de la letra ("ay", "bee", "see"…)
   - `words/apple.mp3 …` — claves: apple, ball, cat, dog, elephant, fish, giraffe, house, icecream, juice,
     kite, lion, moon, nest, orange, princess, queen, rabbit, sun, turtle, umbrella, violin, whale, xylophone, yoyo, zebra
   - `phrases/`: find-the-letter, pop-the-letter, which-picture, great-job, try-again, welcome, lets-go,
     look-and-listen, tap-the-letter, tap-the-picture, match-letters, open-the-chest, you-did-it
2. Añade cada clave (sin extensión) al arreglo correspondiente de `manifest.json`.
3. `npm run build`: el service worker los precachea y funcionan offline.

## Estado: TODOS PENDIENTES (usando voz sintética provisional)
Ver la lista completa de 26 letras + 26 palabras + 13 frases arriba.
