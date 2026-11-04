# Recon map: apps de rentabilidad para conductores (Android)

Referencias: **RR** Ruta Rentable (`com.wsb.dalehelperdriver`, 100 mil+, 4,0★, 2 371 reseñas),
**RU** Ruteo (`com.ruteo.app`, 10 mil+), **VI** Viaje Inteligente (`com.videvs.viajeinteligente`, 1 mil+, 4,3★).

Alcance elegido: **semáforo de ofertas + finanzas**. Para: **producto a la venta en Play Store con suscripción**.
Mercado: conductores de Uber / DiDi / inDrive / Cabify en México (RU también Colombia, COP).

## Sources

| fuente | URL | qué da |
| --- | --- | --- |
| Ficha Play RR | https://play.google.com/store/apps/details?id=com.wsb.dalehelperdriver | descripción, 14 capturas, Premium, soporte WhatsApp |
| Web RR | https://rutarentable.app | marketing |
| Privacidad RR | https://sites.google.com/view/rutarentableprivacypolicy | datos/permiso accesibilidad |
| Ficha Play RU | https://play.google.com/store/apps/details?id=com.ruteo.app | descripción, 7 capturas, permisos, SOS, XP/referidos |
| Web RU | https://ruteo.neiderruiz.com · https://ruteo.dev/privacy | marketing, privacidad |
| Ficha Play VI | https://play.google.com/store/apps/details?id=com.videvs.viajeinteligente | OCR vs accesibilidad, modo Eco/Turbo, turnos |
| Web VI | https://viaje-inteligente-vi.blogspot.com | blog |
| Ficha Play GP (GananciasPro, EmaAguiDev, 1 mil+, Argentina) | https://play.google.com/store/apps/details?id=com.gananciaspro.app · https://gananciaspro.netlify.app | OCR + overlay mínimo, un criterio $/km o $/h, ES/EN |
| Ficha Play VR (Viaje Rentable, Netche, 1 mil+, 60 reseñas, Argentina) | https://play.google.com/store/apps/details?id=com.viajerentable.app · https://viajerentable.com.ar | el más completo: 6 plataformas, contraoferta inDrive, zonas a evitar, varios vehículos, freemium con anuncios |
| Capturas | `replica/screens/rr-*, ru-*, vi-*, gp-*, vr-*` | solo referencia, no se publican (gitignored) |

## Hallazgos de GP y VR (4 nov)

- **VR es el rival más fuerte en funciones**: Uber, DiDi (incluido el Centro de viajes «1 de 3»), inDrive (te dice **cuánto contraofertar** para llegar a verde), Cabify, Rappi y Envíos Extra, con varias paradas.
- **Freemium con anuncios**: gratis = una métrica a la vez + historial. Premium = las dos métricas, sin anuncios, varios vehículos, seguro y renta del auto en el costo, **zonas a evitar (incluidas las de la comunidad)**, filtros de recogida, duración y calificación, tarjeta personalizable, combustible actualizado y exportar a CSV o imagen. Plan mensual o **Días Premium sueltos**, más referidos.
- VR comparte **datos anónimos de ofertas** (precio, distancias, zona) para el combustible y las zonas de la comunidad.
- VR ahora agrega un **«Modo conducción»** (su propia plataforma de viajes). Está fuera del alcance.
- **GP es mínimo**: solo OCR y un criterio. Su burbuja dice cuánto falta para el mínimo («$577/km por debajo de tu mínimo»).
- Las dos están en Argentina (voseo, ARS); México no es su foco.

Pendiente (valor alto): videos de YouTube/TikTok de uso real; reseñas negativas → `/replica-entrepreneur`.

## Core loop

1. El conductor configura sus mínimos ($/km, $/hora, pickup máx., tiempo máx.) y sus costos.
2. Inicia **jornada**. Un servicio en segundo plano lee la pantalla de la app de conducción.
3. Llega una oferta → aparece **burbuja flotante** con monto, $/km, $/h, km totales, min totales, distancia al pickup y semáforo 🟢/🟡/🔴.
4. El conductor acepta o rechaza **en la app original** (la nuestra nunca toca botones).
5. La oferta queda en historial (aceptada/rechazada); los ingresos y gastos alimentan el **neto del día**, meta diaria y estadísticas.

Happy path para la decisión: **0 toques** (burbuja automática). Número a vencer: < 2 s desde que aparece la oferta (RR presume "2 segundos").

## Screens

| ID | pantalla | cómo se llega | propósito | componentes clave | estados |
| --- | --- | --- | --- | --- | --- |
| S01 | Bienvenida / onboarding | primer arranque | explicar valor, aviso "no afiliado" | carrusel, CTA | — |
| S02 | Permisos | onboarding y desde Sistema | pedir superposición, accesibilidad (o captura de pantalla), notificaciones, batería | lista de permisos con estado, botones a Ajustes Android | concedido / faltante / denegado |
| S03 | Configuración inicial | onboarding | país/moneda, vehículo (auto/moto), costo por km, comisión | inputs numéricos, selector | — |
| S04 | Inicio / Dashboard | tab Inicio | ganancia neta hoy, % meta, viajes, horas en línea, $/hora, botón jornada | tarjeta grande, barra progreso, stats, botón play | sin jornada / jornada activa / sin datos |
| S05 | Jornada activa (banner) | botón play | cronómetro, terminar jornada, estado del lector | banner, chip "Lector activo/inactivo" | activa / pausada / lector caído |
| S06 | **Burbuja flotante (overlay)** | automática al llegar oferta | veredicto rápido | monto, $/km, $/h, km, min, pickup, etiqueta ACEPTAR/RECHAZAR, color | verde / rojo / amarillo (faltan datos) / compacta / cerrada |
| S07 | Filtros / criterios | tab Config | mínimos por hora, por km, pickup máx., tiempo máx., rating mínimo pasajero | inputs, sliders, toggles por plataforma | — |
| S08 | Turnos (Día/Tarde/Noche) | Inicio (VI) | juegos de filtros distintos por turno | segmented control 3 opciones | — |
| S09 | Historial de ofertas | tab Viajes | lista de ofertas analizadas, aceptadas vs rechazadas, motivo | lista, chips de estado, filtro | vacío / lleno |
| S10 | Detalle de oferta | toque en S09 | datos leídos, cálculo, veredicto | tarjeta de detalle | — |
| S11 | Mis ganancias (diario) | tab Finanzas | ingresos y gastos del día, navegación por fecha | selector de día, lista, "+ Añadir" | vacío / lleno |
| S12 | Registrar ingreso/gasto (hoja) | "+ Añadir" | alta en 2 toques | toggle Ganancia/Gasto, monto grande, categoría (gasolina, peaje, lavado, mantenimiento…), Vehículo/Personal, nota, plataforma | validación |
| S13 | Meta diaria | Inicio / Config | meta por día de la semana, horas, aviso al cumplir | chips L–D, toggle "trabajo este día", input monto, horas | — |
| S14 | Estadísticas | tab Estadísticas | Día/Semana/Mes/Todo: barras por día, ganancia, rendimiento, viajes; donut por plataforma y por categoría de gasto; distribución del tiempo (en viaje / yendo a recoger / esperando); tasa de aceptación; actividad por hora | tabs, gráficas barra/donut, rangos | sin datos / con datos |
| S15 | Suscripción / Paywall | límite gratis o menú | planes, prueba gratis | tarjetas de plan, CTA Play Billing | gratis / premium / expirado |
| S16 | Sistema / Ajustes | tab Sistema | modo oscuro, moneda/país, notificaciones, estado del servicio, modo Eco/Turbo, soporte WhatsApp, privacidad | lista de ajustes | — |
| S17 | Cuenta / login | ajustes o paywall | respaldar datos y suscripción entre teléfonos | Google sign-in | sin sesión / con sesión |

Fuera del alcance elegido pero visto: S-x SOS/seguridad (RU), cámara secreta (RR), dónde estacioné (RR), referidos con XP (RU).

## Flows

```
F01 Primer uso
    S01 -> S03 configuración -> S02 permisos -> S07 filtros -> S04
    edge: niega accesibilidad (ofrecer modo captura/OCR), Xiaomi/Huawei matan el servicio (guía batería)
F02 Analizar oferta en vivo (núcleo)
    S04 iniciar jornada -> [app de conducción] -> S06 burbuja -> decide en la app original -> S09 registrada
    edge: datos incompletos (amarillo), oferta de inDrive con "ofrece tu tarifa", varias ofertas apiladas,
          pantalla bloqueada, layout de la plataforma cambia (lector falla), moneda distinta
    clics: 0 (automático); meta < 2 s
F03 Ajustar criterios
    S04 -> S07 (o S08 cambiar turno) -> guardar -> la siguiente burbuja usa los nuevos mínimos
F04 Registrar gasto
    S04 -> "+" -> S12 Gasto -> monto -> categoría -> guardar   (2-3 toques)
F05 Registrar ingreso del día por plataforma
    S11 -> "+" -> S12 Ganancia -> plataforma -> monto -> guardar
F06 Fijar meta diaria
    S13 -> días + monto + horas -> notificación al cumplirla
F07 Cerrar jornada y ver resumen
    S05 Terminar -> resumen: horas, km, viajes, neto, $/h
F08 Ver estadísticas
    S14 -> Semana -> barras / donuts / tiempo
F09 Hacerse Premium
    S15 (al llegar al límite de análisis gratis) -> Play Billing -> S04 premium
F10 Restaurar en otro teléfono
    S17 login Google -> restaurar suscripción y datos
```

## Components

| componente | variantes | estados | pantallas |
| --- | --- | --- | --- |
| Burbuja de oferta | completa / compacta | verde, rojo, amarillo, cargando | S06 |
| Tarjeta KPI grande | neta hoy | con meta / sin meta | S04 |
| Barra de progreso de meta | — | 0–100 %, cumplida | S04, S13 |
| Stat chip (número + etiqueta) | viajes, horas, $/h, km | — | S04, S05, S14 |
| Botón jornada | play / terminar | inactivo, activo, pausado | S04, S05 |
| Banner jornada activa | — | con cronómetro | S05 |
| Chip estado del lector | activo / inactivo / error | — | S04, S05, S16 |
| Fila de permiso | — | ok / falta | S02, S16 |
| Input monetario grande | — | vacío, error | S07, S12, S13 |
| Segmented control | 2 o 3 opciones | — | S08, S12, S14 |
| Selector de categoría (chips con icono) | — | seleccionado | S12 |
| Navegador de fecha (< hoy >) | día / semana | — | S11, S14 |
| Gráfica de barras | — | vacía | S14 |
| Donut | plataforma / categoría | vacío | S14 |
| Fila de historial | aceptada / rechazada | con motivo | S09 |
| Tarjeta de plan | mensual / anual | recomendado | S15 |
| Bottom nav | 4–5 tabs | activa | global |
| Bottom sheet | — | — | S12 |

## Inferred data model

```
Settings    country, currency, vehicle_type (car|moto), cost_per_km, platform_commission_pct (por plataforma),
            min_per_km, min_per_hour, max_pickup_km, max_trip_min, min_rider_rating, reader_mode (accessibility|ocr),
            power_mode (eco|turbo), dark_mode
            evidence: S07 VI "Mínimo por hora/km, Pickup máximo, Límite tiempo turbo", RR "configura cuánto quieres ganar"
            confidence: high
ShiftProfile  id, name (día|tarde|noche), filtros propios (override de Settings)
            evidence: VI "Turno de trabajo activo: Día/Tarde/Noche", "Filtros activos (Día)"   confidence: high
Workday     id, started_at, ended_at, km, online_minutes, trips_count
            evidence: RU "Jornada activa 6:12:07 desde las 6:25 a. m.", "Horas, km y viajes, solos"   confidence: high
Offer       id, workday_id, platform (uber|didi|indrive|cabify), seen_at, fare, currency, pickup_km, pickup_min,
            trip_km, trip_min, rider_rating, rider_trips, per_km, per_hour, verdict (green|yellow|red),
            reject_reasons[], decision (accepted|rejected|unknown), raw_fields (json, local)
            evidence: S06 burbujas de las 3 apps, RU "tasa de aceptación y por qué rechazaste los otros"
            confidence: high (decision: medium — se infiere si la plataforma pasa a pantalla de viaje)
Transaction id, date, kind (income|expense), amount, platform (si income), category (gasolina|peaje|lavado|
            mantenimiento|aceite|seguro|parqueo|SOAT/verificación|impuesto|renta vehículo|otro),
            scope (vehicle|personal), note
            evidence: RU capturas "Registrar gasto", "Vehículo/Personal", lista de categorías   confidence: high
DailyGoal   weekday, works (bool), net_target, hours_target
            evidence: RU "Meta diaria" con chips L–V y "Trabajo este día"   confidence: high
Subscription  plan, status, expires_at, play_purchase_token, free_analyses_left
            evidence: RR "Premium permite análisis ilimitados"   confidence: medium (límite exacto desconocido)
User        id, google_id, email   (opcional, solo para respaldo)   confidence: guess
```

## Feature matrix

Ver `replica/features.csv`.

## Out of scope (cannot or should not be cloned)

- **Integración con Uber/DiDi/inDrive vía API**: no existe API pública para conductores; solo se lee lo visible en pantalla.
- **Aceptar/rechazar automáticamente**: ninguna de las 3 lo hace; viola términos de las plataformas y políticas de Play. Nunca.
- **Marca, nombres, colores, textos y capturas** de RR/RU/VI.
- **Base de usuarios, reseñas y datos de las apps originales.**
- SOS/seguridad, cámara secreta, "dónde estacioné", referidos con XP: fuera del alcance de esta fase (posibles extras luego).

## Riesgos clave

- **Política de Play sobre AccessibilityService**: requiere declaración obligatoria, video de demostración y prominente divulgación; rechazos de revisión son comunes. Mitigación: ofrecer también modo **captura de pantalla + OCR local** (MediaProjection + ML Kit), como VI.
- **Lectores frágiles**: cada actualización de Uber/DiDi/inDrive puede romper el parseo. Hace falta un parser por plataforma, configurable y con pruebas sobre ejemplos de texto.
- **Fabricantes que matan servicios** (Xiaomi, Oppo, Huawei): guía de batería por marca.
- Términos de las plataformas de transporte: leer pantalla propia no está prohibido explícitamente, pero hay que incluir el aviso "no afiliado" y no automatizar acciones.

## Size

- Pantallas: 17 · Flujos: 10 · Entidades: 8.
- Partes difíciles: (1) servicio de accesibilidad + parsers por plataforma, (2) overlay flotante estable en segundo plano, (3) OCR local con modo Eco/Turbo, (4) aprobación en Play (accesibilidad + Billing).
- Tamaño: **M** (varias semanas). App nativa Android (Kotlin) obligada: overlay, accesibilidad y MediaProjection no se hacen bien en web/híbrido.
