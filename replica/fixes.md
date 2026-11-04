# Qué arreglar para que Checa gane

**Muestra: 26 reseñas** (21 de Google Play y 5 de App Store MX), 6 apps, de dic 2025 a nov 2026.
Es una muestra chica: sirve para marcar la dirección, no para un ranking firme. Play solo muestra 3 reseñas por app sin desplazarse, y Reddit y los foros no dieron resultados.
Detalle con citas y enlaces: `replica/feedback.md` · datos: `replica/reviews.csv`.

## 1. Lo que odian

| # | problema | reseñas | fuentes | cita |
| --- | --- | --- | --- | --- |
| 1 | **Deja de leer o no sale el aviso** | 8 | 4 apps | «pagué la suscripción premium y no funciona porque no lee mis viajes» ([RR](https://play.google.com/store/apps/details?id=com.wsb.dalehelperdriver&reviewId=bf04694a-2493-474f-9e25-2461650780d4)) |
| 2 | **Pagué y no sirve / no puedo cancelar** | 6 | 4 apps | «no encontré una opción para cancelar la membresía» ([RR](https://play.google.com/store/apps/details?id=com.wsb.dalehelperdriver&reviewId=4c9b2030-1ca5-458f-a3c0-6fb1ace2eb96)) |
| 3 | **Cálculos incorrectos** | 5 | 3 apps | «me daba mal el peso por kilómetro» ([RR iOS](https://apps.apple.com/mx/app/id6802318360?see-all=reviews#14550446621)) |
| 4 | **Se apaga, se reinicia o va lento** | 5 | 5 apps | «se reinicia cada 5 min» ([VI](https://play.google.com/store/apps/details?id=com.videvs.viajeinteligente&reviewId=8de9ec29-ce2c-4389-84dd-e7f62348d257)) |
| 5 | **Soporte que no responde** (pocas reseñas, todas de RR) | 4 | 1 app | «el soporte al cliente nunca respondió» ([RR](https://play.google.com/store/apps/details?id=com.wsb.dalehelperdriver&reviewId=4c9b2030-1ca5-458f-a3c0-6fb1ace2eb96)) |
| 6 | **Se rompe con cada actualización de Uber o DiDi** | 4 | 2 apps | «ante cada actualización… directamente no funciona» ([RR](https://play.google.com/store/apps/details?id=com.wsb.dalehelperdriver&reviewId=b22e4d8d-880d-4d61-a914-aaadca9c3f00)) |
| 7 | No deja escuchar música (pocas reseñas) | 1 | 1 | ([RR iOS](https://apps.apple.com/mx/app/id6802318360?see-all=reviews#14738293960)) |

Lo bueno que repiten: ahorro de gasolina y tiempo, y **el grupo de WhatsApp con atención personalizada** ([GP](https://play.google.com/store/apps/details?id=com.gananciaspro.app&reviewId=341fa348-e22a-4212-9b92-6cd704055692)).

## 2. Lo que piden (cada punto tiene 1 sola reseña)
- **$/h o $/km como número grande** y la neta en chico ([VR](https://play.google.com/store/apps/details?id=com.viajerentable.app&reviewId=d5db9823-4ba2-4207-a573-7d550979e86c)).
- **DiDi «Pin tu precio»** e inDrive ([RR iOS](https://apps.apple.com/mx/app/id6802318360?see-all=reviews#14738293960)).
- **Un botón para desconectarse** de todas las apps a la vez ([RR](https://play.google.com/store/apps/details?id=com.wsb.dalehelperdriver&reviewId=9386b35d-a2b4-4209-83d8-334bc3986093)). Checa no puede tocar otras apps, así que no se puede.

## 3. Lo que nadie resuelve
- **Confianza**: el conductor no sabe si la app está leyendo o si se cayó, y se entera cuando ya perdió un viaje. Ninguna muestra un estado claro ni avisa cuando deja de leer.
- **Pagar sin riesgo**: cobran Premium y, si falla, no hay forma clara de cancelar ni de pedir reembolso.
- **México**: GP, VR y VP son de Argentina y RR es la única fuerte aquí. Nadie lee «Pin tu precio» de DiDi.

## Plan de arreglos para Checa

| # | qué hacer | tamaño | dónde | evidencia |
| --- | --- | --- | --- | --- |
| 1 | **Guardián del lector**: si en X min de jornada no se lee ninguna oferta, o se cae el servicio, vibra y avisa «Checa dejó de leer, toca para reactivar». Que el widget y la notificación muestren «Leyendo · última oferta hace 2 min». | M | APK-CHECA (`RutaService`, `CapturaService`, `WidgetCheca`) | odian #1 y #4 (13 reseñas) |
| 2 | **Reporte en un toque**: en el pop-up, «¿Leyó mal?» guarda la pantalla (ya existe «Guardar pantallas») y la manda por WhatsApp. Con eso, arreglo publicado en 48 h cuando Uber o DiDi cambien. | S | `Popup`, `Guardado`, `Soporte` | #3 y #6 (9) |
| 3 | **Pruebas del Parser** con textos reales guardados (Uber y DiDi), que corran en CI en cada cambio. | S | `Parser` + workflow | #3 y #6 |
| 4 | **Cancelar en 1 toque** dentro de la app (enlace a las suscripciones de Play) y prueba gratis honesta. Va con la Fase 7. | S | Fase 7 · `/replica-launch` | #2 (6) |
| 5 | **Mostrar lo que se leyó**: «Leí $48 · 4.8 km · 13 min». Si el cálculo está mal, el conductor ve por qué. | S | `Popup` | #3 (5) |
| 6 | **Número grande a elegir**: neta, $/h o $/km, según `prefs.criterio`. | S | `Popup`, `Prefs` | petición VR |
| 7 | **La voz no corta la música**: pedir foco de audio con `AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK` para que la música solo baje de volumen. | S | `Alertas` | #7 (poca evidencia, pero Checa habla) |
| 8 | **DiDi «Pin tu precio»** con la contraoferta sugerida para llegar a verde. | M | `Parser` | petición + VR lo tiene |

Soporte: mantener WhatsApp con un tiempo de respuesta publicado (por ejemplo, menos de 24 h). Es lo que más elogian (GP) y lo que más odian cuando falta (RR).

## El ángulo

1. **Confianza.** Para conductores de Uber y DiDi en México que pagaron una calculadora que dejaba de leer, Checa te avisa en el momento en que algo falla y se arregla en días, no en semanas.
   Evidencia: «deja de leer», «se apaga» y «se rompe con actualizaciones», 17 menciones en 6 apps.
2. **Transparencia.** Para quienes no confían en los números, Checa te enseña lo que leyó y cómo hizo la cuenta.
   Evidencia: «cálculos incorrectos», 5 reseñas en 3 apps.
3. **Hecha para México.** Para conductores mexicanos que usan apps argentinas, Checa habla como tú, lee DiDi «Pin tu precio» y cobra en pesos.
   Evidencia: 3 de 6 rivales son argentinos; «Pin tu precio» pedido en RR.

**Recomendado: 1, Confianza.** Es la queja más repetida y Checa ya tiene la base para resolverla: diagnóstico, guardado de pantallas, WhatsApp y voz. Además encaja con el CTA actual («Checa en tres segundos»).
