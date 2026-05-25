# Centinela — Contexto del Proyecto
*(antes llamado HealthOS — renombrado en sesión 2026-05-17)*

## Stack
- React 19 + Vite 8
- Sin librerías de UI — todo inline styles con DM Sans / DM Mono (Google Fonts)
- Sin backend — SPA pura (por ahora)
- Un solo archivo: `src/App.jsx` (~950 líneas)

## Cómo correr
```
npm run dev   # http://localhost:5173
npm run build
```
Login demo: botón **"Acceso demo →"** (un clic) — o manualmente `director@hospital.cl` / `demo1234`
Usuario demo: **Dr. Frankenstein — Hospital de Curicó**

## Arquitectura
Todo en `src/App.jsx`. Componentes principales:
- `Login` — pantalla de acceso, toggle dark/light mode, aviso de privacidad, botón "Acceso demo →"
- `Dashboard` — KPIs, mapa de camas, gráfico LOS con referencia nacional, tabla pacientes con score complejidad
- `ListaEspera` — tabla GES/No GES, filtros, KPI cumplimiento %, banner "vencen esta semana", detalle, Análisis IA, exportar MINSAL
- `Prediccion` — formulario → cálculo determinístico LOS y complejidad → narración IA → factores colapsables
- `Reportes` — generador de reportes ejecutivos con IA, exportar .txt, enviar email
- `Datos` — drag & drop CSV → confirmación privacidad → análisis IA (pestaña al final, uso técnico)

Orden de pestañas: Dashboard → Lista de Espera → Predicción → Reportes → Datos

## Conexión IA (RESUELTO)
- `vite.config.js` usa middleware propio (NO proxy) — intercepta `/api/claude` con `configureServer`
- Lee la API key directamente del archivo `.env` con `fs.readFileSync` (más confiable que `loadEnv`)
- API key en `.env` (ANTHROPIC_API_KEY, sin prefijo VITE_) — no se expone al browser
- Modelo: `claude-sonnet-4-6`
- Helper `callClaude(prompt, maxTokens)` centraliza todas las llamadas a la API
- Límite de lectura CSV: 10,000 caracteres (cubre los datasets de demo completos)
- Cuenta Anthropic requiere créditos prepagos (mínimo $5 USD) — sin créditos devuelve 400

## Datos
Todos hardcoded en constantes al tope del archivo:
- `SAMPLE_DATA` — 6 pacientes activos con score de complejidad clínica
- `BEDS` — 12 camas (UCI, Coronaria, General)
- `LOS_HISTORY` — 6 meses de estancia promedio
- `LOS_NACIONAL` — 5.8 días (referencia DEIS/MINSAL, se muestra en gráfico)
- `LISTA_ESPERA` — 8 pacientes GES/No GES. LE-002 (Carlos Muñoz) ajustado a 115 días para activar banner "vencen esta semana"
- `DX_CATALOG` — 26 diagnósticos en 7 categorías, con LOS base GRD/DRG por diagnóstico

## Datasets de demo
En `public/datasets/` — listos para arrastrar a pestaña Datos:
- `pacientes_historicos.csv` — 50 pacientes con dx, LOS, comorbilidades, readmisión, indice_riesgo
- `lista_espera_extendida.csv` — 30 pacientes GES/No GES de comunas reales de Santiago

## Terminología — decisiones importantes
- **Score de Complejidad Clínica** (no "Riesgo ML") — basado en diagnóstico, edad, comorbilidades, unidad
- Labels de complejidad: "COMPLEJIDAD ALTA" / "COMPLEJIDAD MEDIA" / "BAJA COMPLEJIDAD"
- **Estados GES** (riesgo regulatorio, NO clínico):
  - `vencida` → "INCUMPLIMIENTO" (rojo)
  - `critica` → "SANCIÓN POSIBLE" (naranja)
  - `alerta` → "EN RIESGO GES" (amarillo)
  - `normal` → "EN PLAZO" (verde)
- Dashboard acciones GES: nivel "INCUMPLIMIENTO" (no "CRÍTICO") para no confundir con riesgo vital

## Decisiones de diseño
- **Light mode por defecto**, dark mode opcional (toggle en header y login)
- Sistema de variables CSS: `:root` = dark, `:root.light` = light — toggle vía `document.documentElement.classList`
- Acentos en indigo `#6366f1` (funciona en ambos modos)
- Sistema de colores de riesgo: rojo `#ef4444` (≥0.75), amarillo `#f59e0b` (≥0.5), verde `#22c55e`
- Animaciones: `fadeUp`, `pulse`, `gridScroll`
- Contexto: hospital público chileno, sistema GES (Garantías Explícitas en Salud)
- Stats del login derivadas de datos reales de LISTA_ESPERA (no inventadas)
- Footer con: versión demo · integración HL7/FHIR · Ley 19.628 / 20.584

## Privacidad y datos
- Predicción y Reportes: no envían datos identificadores (seguros)
- ListaEspera: usa `p.id` en prompts Claude (no nombre ni RUT)
- Datos: modal de confirmación antes de enviar CSV a API externa
- Aviso de privacidad visible en panel izquierdo del Login
- Para producción: sanitización previa a envío a Claude (Anthropic, EEUU)

## Exportación
- "Exportar para MINSAL" → descarga `informe_lista_espera_MINSAL.txt`
- "Exportar reporte ejecutivo" → descarga `reporte_calidad_[archivo].txt`
- "Exportar .txt" en Reportes → descarga el reporte generado
- "Enviar por email" → abre cliente de correo con reporte en el cuerpo
- Hook `useExportFeedback(label)` — feedback visual "✓ Descargado" 2 segundos

## Componentes reutilizables
- `KpiCard` — tarjeta de métrica con label, value, sub, accent color
- `Pulse` — punto animado de estado
- `BedMap` — mapa de camas por tipo con color según complejidad
- `BarChart` — gráfico de barras LOS con línea de referencia nacional
- `RiskGauge` — gauge SVG semicircular con LOS, score y UCI
- `SearchSelect` — dropdown con búsqueda y agrupación por categoría (usado en Predicción)

---

## Contexto estratégico del proyecto

**Usuario:** Enfermero con Magíster en Salud Digital, experiencia en sistema público hospitalario chileno.

**CORFO Semilla Inicia:** postulación completada el 2026-05-19.

**Objetivo reunión hospital:** Piloto + carta de intención + acuerdo. Audiencia probable: director médico/subdirector, alguien de MINSAL, gestión, político. Hospital objetivo: Hospital de Curicó.

**Propuesta de valor central:**
> "Centinela le da a los hospitales públicos chilenos algo que nunca tuvieron: anticipación. Predice riesgos clínicos, monitorea el cumplimiento GES y genera recomendaciones con IA — antes de que el problema ocurra."

**Foco:** GES/cumplimiento regulatorio como gancho principal, eficiencia operativa como argumento de soporte.

---

## Handoff — Estado actual

**Fecha:** 2026-05-19

**Sesiones anteriores:** CORFO completado (2026-05-19), optimización UX, renombre a Centinela (2026-05-17).

**Lo que se hizo en esta sesión (2026-05-19):**
1. Login con botón "Acceso demo →" (un clic, sin escribir credenciales)
2. Terminología GES corregida: estados usan lenguaje regulatorio ("INCUMPLIMIENTO", "SANCIÓN POSIBLE", "EN RIESGO GES") — no confundir con riesgo vital
3. "Riesgo ML" → "Score de Complejidad Clínica" con subtítulo de factores visible
4. KPI "Cumplimiento GES %" en Lista de Espera (color dinámico según porcentaje)
5. Banner "X garantías GES vencen esta semana" cuando hay casos próximos a vencer
6. LE-002 (Carlos Muñoz) ajustado a 115 días para activar el banner en demo
7. Línea de referencia nacional (5.8d DEIS/MINSAL) en gráfico LOS histórico
8. "Factores del modelo" colapsado por defecto en Predicción (expandible con botón)
9. Pestaña Datos movida al final de navegación
10. Footer con integración HL7/FHIR y referencias legales

**Pendiente para próxima sesión:**
1. Desplegar en Vercel — URL real para mostrar en reunión hospital
2. Armar script de presentación por tipo de audiencia (director, MINSAL, político)
3. Preparar guión de demostración de la app (qué mostrar primero, qué destacar)

**Instrucción para próxima sesión:** Lee este archivo + memoria persistente. Prioridad: despliegue en Vercel.
