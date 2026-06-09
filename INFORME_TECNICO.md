# Informe Técnico — Bitácora de Desarrollo con IA
## Sistema de Gestión de Stock Inteligente (StockIQ)

**Autor:** Gonzalo Sevilla  . Lucas Norton . Lorenzo Espetxe . Geronimo Guevara
**Equipo:** Gonzalo Sevilla · Lucas Norton · Lorenzo Espetxe · Geronimo Guevara  
**Fecha:** Junio 2026  
**Proyecto:** TP Integrador — Sistema de Gestión de Stock Inteligente

---

## Índice

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Mi Arsenal: Herramientas de IA Utilizadas](#2-mi-arsenal-herramientas-de-ia-utilizadas)
3. [Sinergia con la IA: Cómo me ayudó a programar, depurar y testear](#3-sinergia-con-la-ia)
4. [Lecciones Aprendidas: Desafíos con los modelos](#4-lecciones-aprendidas)
5. [Conclusión](#5-conclusión)

---

## 1. Resumen Ejecutivo

Este informe documenta mi experiencia personal utilizando inteligencia artificial como herramienta principal de desarrollo durante la construcción de **StockIQ**, un sistema de gestión de stock inteligente desarrollado como Trabajo Práctico Integrador.

El proyecto consistió en implementar **10 módulos funcionales** ("changes") de forma incremental, abarcando desde la inicialización del repositorio hasta el despliegue en producción, pasando por un backend en FastAPI, un frontend en React/TypeScript, integración con un modelo de lenguaje (LLM) para recomendaciones inteligentes, y una pipeline de CI/CD completa.

**Resultado:** El proyecto fue completado al 100% en producción, con backend desplegado en Render y frontend en Vercel.

---

## 2. Mi Arsenal: Herramientas de IA Utilizadas

### 2.1 Claude Code (CLI) — Herramienta Principal

**Claude Code** fue la herramienta central de todo el desarrollo. Se trata de una interfaz de línea de comandos que permite interactuar con el modelo Claude de Anthropic directamente desde el terminal, integrado al repositorio git.

**Cómo lo usé:**
- Desarrollo guiado por el workflow **OPSX** (OpenSpec): un ciclo estructurado de `proponer → implementar → archivar` por cada módulo del sistema.
- Generación de código siguiendo reglas estrictas de arquitectura (FastAPI, SQLAlchemy 2.0, Pydantic v2, React + TypeScript).
- Debugging interactivo: le pegaba el error y me devolvía la causa raíz y la solución.
- Escritura de tests con **TDD estricto** (RED → GREEN → TRIANGULATE → REFACTOR).

**Características que más utilicé:**
- **Memoria persistente entre sesiones (Engram):** Claude Code guarda decisiones y descubrimientos técnicos entre sesiones. Esto fue clave para retomar trabajo sin repetir contexto.
- **Modo agente:** delega subtareas a agentes especializados (exploración, propuesta, implementación, archivado).
- **Integración con el sistema de archivos:** lee, edita y crea archivos directamente — no solo genera código como texto.

### 2.2 ChatGPT (OpenAI) — Consultas Puntuales

Usado de forma complementaria para:
- Consultas rápidas de sintaxis o documentación.
- Segunda opinión en decisiones de diseño.
- Redacción de textos de interfaz de usuario (labels, mensajes de error, tooltips).

La interfaz de StockIQ referencia a ChatGPT como asistente IA para los usuarios finales del sistema.

### 2.3 GitHub Copilot (implícito en el editor)

Autocompletado de código durante la edición manual en el IDE, especialmente útil para:
- Completar tipos de TypeScript.
- Sugerir nombres de variables y parámetros.
- Acelerar escritura de boilerplate (imports, props de componentes).

---

## 3. Sinergia con la IA

### 3.1 Programación: De especificación a código funcional

El flujo de trabajo que más valor aportó fue el ciclo **OPSX**. En lugar de pedirle a la IA "escribime este archivo", el proceso fue:

1. **Explorar**: la IA analizaba el estado del proyecto y la base de conocimiento.
2. **Proponer**: generaba un documento de diseño con decisiones técnicas y una lista de tareas concretas.
3. **Aplicar**: implementaba cada tarea siguiendo TDD (test primero, luego producción).
4. **Archivar**: actualizaba las especificaciones y cerraba el módulo.

**Ejemplo concreto — C-03 (product-crud-backend):**

Le pedí implementar el CRUD de productos. La IA no solo escribió el código, sino que diseñó la arquitectura en capas:
- `repositories/product_repository.py` — acceso a BD aislado (regla dura del proyecto)
- `services/product_service.py` — lógica de negocio
- `routers/product_router.py` — endpoints REST

Cada capa con sus tests antes del código de producción. El resultado fue una vertical completa con cobertura real, no solo scaffolding.

**Ejemplo concreto — C-09 (ai-recommendation):**

El módulo más complejo: integración con un LLM externo (ChatGPT) para generar recomendaciones de reabastecimiento. La IA:
- Diseñó el schema de request/response (`AIRecommendationRequest` / `AIRecommendationResponse`).
- Generó el prompt de sistema para el LLM externo.
- Mockeó la API externa en los tests (única excepción donde se permite mock — solo para APIs externas).
- Expuso el endpoint `POST /ai/recommendation`.

### 3.2 Debugging: Diagnóstico de errores de producción

Esta fue probablemente la área de mayor impacto. Los errores en producción (Render + Vercel) eran difíciles de reproducir localmente. La IA los resolvió sistemáticamente:

**Error 1 — Frontend crash en producción:**
```
TypeError: Cannot read property 'reduce' of undefined
```
La API devolvía `null` en lugar de `[]` en ciertos estados del stock. La IA identificó que el frontend no guardaba contra respuestas no-array y agregó un guard en el servicio Axios.

**Error 2 — Deploy de Render fallando:**
```
Error: pg module not found / connection refused
```
Tres problemas encadenados:
1. Faltaba `psycopg2-binary` en `requirements.txt`.
2. La URL de Postgres tenía formato `postgres://` en lugar de `postgresql://` (SQLAlchemy 2.0 no acepta el primero).
3. Python 3.12 tenía incompatibilidades — se fijó a `3.11.9` con `runtime.txt`.

**Error 3 — CI/CD roto en GitHub Actions:**
```
ModuleNotFoundError: No module named 'pytest_cov'
```
El workflow de CI no instalaba `pytest-cov` antes de correr los tests. Un fix de una línea, pero encontrarlo en un YAML de 80 líneas sin IA hubiera tomado mucho más tiempo.

**Error 4 — SPA routing en Vercel (404 al navegar directamente):**
La IA sabía de inmediato que Vercel no redirige rutas client-side por defecto. Creó `vercel.json` con la regla de rewrite correcta para que React Router funcionara.

### 3.3 Testing: TDD como práctica real

Antes de este proyecto, escribía los tests después del código (o no los escribía). Con la IA aplicando TDD estricto, cambió el flujo:

**Ciclo aplicado en cada tarea:**
```
1. Escribir test que falla (RED)    → describe el comportamiento esperado
2. Código mínimo para pasar (GREEN) → puede ser hardcodeado al principio
3. Segundo caso de prueba           → fuerza a generalizar la lógica
4. Refactorizar                     → código limpio con tests en verde
```

**Resultado medible:** El proyecto tiene cobertura real en todas las capas críticas del backend (repositorios, servicios, routers), con SQLite in-memory como base de datos de tests — nunca mocks de BD.

### 3.4 Arquitectura: Decisiones informadas

La IA justificó cada decisión técnica con tradeoffs:

| Decisión | Alternativa descartada | Razón |
|----------|----------------------|-------|
| SQLAlchemy síncrono | AsyncSession | Simplicidad; sin beneficio real con SQLite/Render free tier |
| SQLite en dev / PostgreSQL en prod | Solo PostgreSQL | Dev sin infraestructura; prod sin cambios de código |
| Pydantic v2 `model_copy` | `model_validate` con `update={}` | Bug conocido de Pydantic 2.12.4 |
| `python:3.11-slim` en Docker | Última versión | Estabilidad de dependencias en Render |

---

## 4. Lecciones Aprendidas

### 4.1 La IA no reemplaza entender el código — lo amplifica

El mayor error que cometí al principio fue aceptar código sin leerlo. Cuando llegaban errores de producción, no sabía por dónde empezar porque no había internalizado lo que la IA había construido.

**Lección:** Leer y entender cada fragmento generado antes de commitear. La IA es un multiplicador de velocidad, no una caja negra.

### 4.2 Los errores de contexto son el principal desafío

Los LLMs tienen un contexto de "memoria de trabajo" limitado. En sesiones largas, la IA empezaba a olvidar decisiones tomadas al principio (como que el proyecto usa SQLAlchemy síncrono, no async).

**Caso real:** El archivo `tasks.md` del change C-04 mencionaba `AsyncSession`. La IA generó código con `async/await` que rompía todo el stack. Tuve que corregirlo y establecer la regla explícitamente.

**Lección:** Las instrucciones importantes hay que repetirlas (en `CLAUDE.md`, en el prompt, en los comentarios). La memoria persistente (Engram) ayudó a que esto no se perdiera entre sesiones.

### 4.3 La especificidad del prompt determina la calidad del output

Hay una diferencia enorme entre:
- ❌ *"Haceme el backend de productos"*
- ✅ *"Implementá el repositorio de productos usando SQLAlchemy 2.0 con `select()` y `Mapped[]`, siguiendo la arquitectura de capas del proyecto. Tests primero con SQLite in-memory."*

El segundo prompt da resultados que se integran directamente. El primero requiere muchas correcciones.

**Lección:** Invertir tiempo en el prompt ahorra tiempo en las correcciones.

### 4.4 La IA puede generar código inseguro si no se la guía

En una sesión temprana, la IA iba a committear un token de API en el código. El harness lo bloqueó automáticamente (configurado para no leer/escribir archivos `.env*`), pero el patrón de exponer credenciales en el código fuente estuvo a punto de pasar.

**Caso real:** Un token de Vercel apareció en el chat durante la configuración del CI/CD. Tuve que revocarlo y regenerarlo.

**Lección:** Nunca pegar tokens o claves en el chat. Usar variables de entorno siempre, y verificar que el `.gitignore` incluya `.env*` desde el día uno.

### 4.5 El testing real requiere disciplina humana

La IA puede escribir tests, pero puede escribir tests que pasen sin verificar nada real (assertions vacías, mocks que siempre retornan `True`). El "TDD estricto" funciona porque hay reglas explícitas que lo prohíben.

**Lección:** Las reglas duras del proyecto (`CLAUDE.md`) son el contrato. Sin ellas, la IA optimiza para hacer pasar los tests, no para garantizar corrección.

### 4.6 El deploy siempre es más difícil que el desarrollo

El 30% de las sesiones fue desarrollo de features. El 70% fue debugging de infraestructura:
- Configuración de Render (runtime, variables de entorno, health checks).
- Configuración de Vercel (SPA routing, variables de entorno en CI).
- GitHub Actions (permisos, secrets, orden de pasos).

La IA conoce estos servicios pero su conocimiento puede estar desactualizado. Tuve que combinar su ayuda con la documentación oficial.

**Lección:** Reservar tiempo explícito para el deploy. No es un paso final de 10 minutos.

---

## 5. Conclusión

Desarrollar StockIQ con Claude Code como herramienta principal cambió fundamentalmente cómo entiendo el ciclo de desarrollo de software. No se trata de pedirle código a una IA y pegarlo — se trata de un diálogo técnico donde el humano aporta el criterio y la IA aporta la velocidad.

**Lo que funcionó mejor:**
- Arquitectura incremental con el ciclo OPSX (proponer → implementar → archivar).
- TDD como metodología forzada — los tests primero cambian cómo pensás el diseño.
- Memoria persistente entre sesiones para no perder decisiones técnicas.
- Debugging de producción — la IA tiene patrones de error reconocidos que yo no hubiera encontrado tan rápido.

**Lo que requirió más atención humana:**
- Revisar cada fragmento de código generado.
- Mantener el contexto actualizado cuando la IA "olvidaba" reglas.
- Seguridad — nunca delegar completamente el manejo de credenciales.
- Decisiones de deploy — documentación oficial siempre sobre el conocimiento del modelo.

En resumen: la IA aceleró el desarrollo en un factor estimado de **3x a 5x** en comparación a hacerlo solo. Pero ese factor de aceleración solo se materializa cuando el desarrollador entiende lo que está construyendo. La IA no reemplaza el criterio técnico — lo potencia.

---

*Informe generado como parte del TP Integrador — Junio 2026*  
*Repositorio: [Sistema-de-Gestion-de-Stock-Inteligente](https://github.com/GonzaloSevilla22)*
