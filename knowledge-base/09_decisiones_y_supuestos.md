# Decisiones y Supuestos

## Decisiones documentadas

### DD-01 — SQLite en desarrollo, PostgreSQL en producción
**Decisión**: usar SQLite como BD de desarrollo local y PostgreSQL en Render para producción  
**Contexto**: el proyecto es universitario y los desarrolladores no quieren instalar y configurar un servidor PostgreSQL local  
**Alternativas consideradas**: PostgreSQL local via Docker Compose; SQLite en ambos entornos  
**Justificación**: SQLite elimina fricción en dev; PostgreSQL en Render es gratuito y equivalente al entorno real  
**Trade-offs aceptados**: SQLite y PostgreSQL tienen pequeñas diferencias de SQL que pueden enmascarar bugs (ej. ILIKE, UUID); los tests corren contra SQLite, no contra la BD de producción

### DD-02 — Claude API o Gemini como proveedor de IA (configurable)
**Decisión**: el proveedor de IA es configurable via variable de entorno `AI_PROVIDER`  
**Contexto**: el equipo no sabe si tendrá créditos disponibles en Claude al momento del deploy  
**Alternativas consideradas**: hardcodear Claude; usar solo Gemini Free  
**Justificación**: flexibilidad sin cambiar código; Gemini Free tiene límite generoso para demos universitarias  
**Trade-offs aceptados**: `ai_service.py` necesita lógica de branching por proveedor — agrega complejidad al servicio

### DD-03 — Sin autenticación en v1.0
**Decisión**: la v1.0 no implementa autenticación ni gestión de usuarios  
**Contexto**: el foco del TP es demostrar arquitectura por capas, CI/CD e integración de IA — no el módulo de auth  
**Alternativas consideradas**: JWT simple con un usuario hardcodeado  
**Justificación**: reducir scope para entregar a tiempo; la evaluación académica no requiere auth  
**Trade-offs aceptados**: el sistema es vulnerable si se expone públicamente — solo usar en entornos controlados o con acceso limitado

### DD-04 — React Query para manejo de estado del servidor
**Decisión**: usar TanStack Query (React Query) en lugar de Redux o estado local con `useEffect`  
**Contexto**: necesitamos caché, refetch automático y estados de loading/error sin boilerplate  
**Alternativas consideradas**: Redux Toolkit + RTK Query; `useEffect` + `useState` manual  
**Justificación**: React Query tiene curva de aprendizaje menor que RTK Query para un TP; menos código para los mismos beneficios  
**Trade-offs aceptados**: dependencia adicional; el equipo necesita aprender la API de React Query

### DD-05 — Arquitectura por capas sin DI container
**Decisión**: no usar un contenedor de inyección de dependencias (ej. `dependency_injector`) — las dependencias se pasan manualmente  
**Contexto**: DI containers agregan complejidad que no se justifica en el scope universitario  
**Alternativas consideradas**: `dependency_injector`; clases con inyección en constructores  
**Justificación**: FastAPI ya provee DI nativa con `Depends()` para la sesión de BD; es suficiente para el scope  
**Trade-offs aceptados**: los services instancian repositories directamente — reduce testabilidad pura pero simplifica el código

---

## Supuestos inferidos

### SU-01 — Un solo usuario operativo
**Supuesto**: el sistema lo usa una sola persona (o equipo pequeño en el mismo contexto) sin conflictos de escritura concurrente  
**Origen**: la ausencia de autenticación y el scope del TP implican uso mono-usuario  
**Riesgo si es falso**: condiciones de carrera en actualizaciones de stock; pérdida de datos en salidas concurrentes  
**Cómo validar**: confirmar con el docente si el sistema debe soportar multi-usuario antes de comenzar v2.0

### SU-02 — El LLM externo siempre está disponible en el entorno de evaluación
**Supuesto**: la API Key de IA estará activa durante la demo para el docente  
**Origen**: el TP requiere demostrar uso de IA; no hay mención de modo offline  
**Riesgo si es falso**: el endpoint de IA falla durante la presentación  
**Cómo validar**: implementar mensaje de fallback (ya definido en RN-AI-03); tener un mock del response listo para demos

### SU-03 — El volumen de datos es pequeño (< 1000 productos)
**Supuesto**: la BD no tendrá más de unos cientos de productos en el ciclo de vida del TP  
**Origen**: es un proyecto universitario de demo, no un sistema productivo real  
**Riesgo si es falso**: las consultas de dashboard sin índices pueden ser lentas; paginación no implementada  
**Cómo validar**: no necesita validación — el scope académico confirma el supuesto

### SU-04 — El frontend y el backend corren en dominios distintos (CORS necesario)
**Supuesto**: Vercel y Render tienen dominios diferentes, por lo que CORS debe estar configurado  
**Origen**: arquitectura de despliegue separado documentada en `arquitectura.txt`  
**Riesgo si es falso**: si se sirven desde el mismo dominio (ej. backend sirve el frontend), CORS es redundante pero inocuo  
**Cómo validar**: verificar URLs de Render y Vercel al hacer el primer deploy
