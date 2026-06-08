# Preguntas Abiertas

## Inconsistencias detectadas

### IN-01 — Nombre de campos del modelo: inglés vs. español
**Documento A dice** (`propmt.txt`): el modelo de producto usa `stock_actual` y `stock_minimo` (español)  
**Documento B dice** (`arquitectura.txt`): el ERD usa `stock` y `minimum_stock` (inglés)  
**Impacto**: si no se unifica, los schemas de Pydantic y el modelo SQLAlchemy no coincidirán con el frontend  
**Resolución propuesta**: usar **inglés** (`stock`, `minimum_stock`) en modelos y schemas de Python; el frontend puede mostrar etiquetas en español

### IN-02 — Herramienta de IA no definida con certeza
**Documento A dice**: "Usar Claude o Gemini API Free"  
**Documento B dice**: lo mismo, sin prioridad clara  
**Impacto**: si se hardcodea un proveedor y las credenciales no están disponibles, el endpoint falla  
**Resolución propuesta**: implementar `ai_service.py` con estrategia configurable via `AI_PROVIDER` env var (DD-02 ya lo recoge)

---

## Preguntas abiertas (priorizadas)

| Prioridad | Pregunta | Bloquea | Decisor |
|-----------|----------|---------|---------|
| Alta | ¿La fecha de entrega del TP requiere Docker funcional o es opcional? | Configuración de Dockerfile y CI | Docente / equipo |
| Alta | ¿El endpoint `/ai/recommendation` debe guardar historial de recomendaciones en BD? | Diseño del modelo de datos | Equipo (ya documentado como stateless en RN-AI-05) |
| Alta | ¿Se implementa paginación en `GET /products` y `GET /movements`? | Diseño del endpoint y UI | Equipo |
| Media | ¿El criterio de evaluación requiere cobertura mínima de tests (% específico)? | Estrategia de tests | Docente |
| Media | ¿TailwindCSS es obligatorio o puede usarse otra librería de UI (shadcn, Chakra, MUI)? | Stack frontend | Equipo |
| Media | ¿El dashboard debe tener gráficos (charts) o solo las 3 KPI cards son suficientes? | Scope del frontend | Docente / equipo |
| Baja | ¿Se requiere internacionalización (i18n) o el sistema puede ser 100 % en español? | — | Equipo |
| Baja | ¿Hay requisito de responsive design para mobile? | CSS / layout | Equipo |
