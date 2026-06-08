# Sistema de Gestión de Stock Inteligente — Base de Conocimiento

Base de conocimiento generada desde `arquitectura.txt` y `propmt.txt` (modo ingest).

## Índice de archivos

| Archivo | Contenido |
|---------|-----------|
| [01_vision_y_objetivos.md](01_vision_y_objetivos.md) | Propósito, 3 actores, alcance v1.0, métricas de éxito |
| [02_descripcion_general.md](02_descripcion_general.md) | Stack completo, arquitectura, integraciones externas, 9 endpoints |
| [03_actores_y_roles.md](03_actores_y_roles.md) | 4 actores, RBAC (v1.0 sin auth), rutas públicas |
| [04_modelo_de_datos.md](04_modelo_de_datos.md) | ERD, entidades Product y StockMovement, seed data |
| [05_reglas_de_negocio.md](05_reglas_de_negocio.md) | 19 reglas codificadas (RN-PR, RN-ST, RN-MV, RN-DH, RN-AI, RN-GL) |
| [06_funcionalidades.md](06_funcionalidades.md) | 10 historias de usuario en 5 épicas |
| [07_flujos_principales.md](07_flujos_principales.md) | 4 flujos extremo a extremo con diagramas de secuencia |
| [08_arquitectura_propuesta.md](08_arquitectura_propuesta.md) | Patrones, estructura de dirs, seguridad, env vars, deploy |
| [09_decisiones_y_supuestos.md](09_decisiones_y_supuestos.md) | 5 decisiones documentadas (DD), 4 supuestos (SU) |
| [10_preguntas_abiertas.md](10_preguntas_abiertas.md) | 2 inconsistencias detectadas, 8 preguntas priorizadas |

## Quick Start para desarrolladores

1. Entender el dominio → [01](01_vision_y_objetivos.md), [03](03_actores_y_roles.md)
2. Entender los datos → [04](04_modelo_de_datos.md)
3. Entender las reglas → [05](05_reglas_de_negocio.md)
4. Entender la arquitectura → [02](02_descripcion_general.md), [08](08_arquitectura_propuesta.md)
5. Implementar → [07](07_flujos_principales.md), [06](06_funcionalidades.md)
6. Antes de codificar → [10](10_preguntas_abiertas.md)

## Resumen ejecutivo

Sistema web de inventario con FastAPI (backend) + React/TypeScript (frontend) + PostgreSQL. El alcance del TP incluye CRUD de productos, registro de movimientos de stock, dashboard de KPIs, alertas automáticas de stock bajo, y un endpoint de IA para recomendaciones de reposición. Deploy separado: Render (backend) + Vercel (frontend), con CI/CD via GitHub Actions.
