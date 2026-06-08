# Visión y Objetivos

## Propósito del sistema

Sistema web de gestión inteligente de stock diseñado para pequeñas y medianas empresas que necesitan controlar su inventario en tiempo real, detectar alertas de stock crítico y obtener recomendaciones automáticas de reposición asistidas por IA. El proyecto es un Trabajo Práctico Integrador universitario que demuestra arquitectura profesional con FastAPI, React y PostgreSQL.

## Objetivos por actor

| Actor | Objetivo principal | Objetivos secundarios |
|-------|-------------------|-----------------------|
| Gestor de stock | Mantener el inventario actualizado y evitar roturas de stock | Registrar movimientos de entrada/salida, recibir alertas automáticas |
| Administrador | Operar CRUD completo de productos | Visualizar KPIs del dashboard, obtener recomendaciones de IA |
| Evaluador académico | Verificar aplicación de conceptos de arquitectura de software | Validar TDD, CI/CD, Docker, uso de IA como herramienta de desarrollo |

## Alcance v1.0

- Dashboard con KPIs: productos totales, stock bajo, productos agotados
- CRUD completo de productos (crear, editar, eliminar, buscar)
- Registro de movimientos de stock (ENTRADA / SALIDA)
- Sistema de alertas automáticas cuando `stock_actual <= stock_minimo`
- Endpoint de IA `POST /ai/recommendation` para sugerencias de reposición
- Tests unitarios del backend
- Containerización con Docker
- Pipeline CI/CD con GitHub Actions
- Deploy: backend en Render, frontend en Vercel, base de datos PostgreSQL gratuita en Render

## Fuera de alcance

- Autenticación / sistema de usuarios / roles
- Gestión de proveedores
- Módulo de ventas o facturación
- Múltiples almacenes o sucursales
- Importación/exportación masiva de productos (CSV/Excel)
- Notificaciones por email o push
- Integración con sistemas ERP externos

## Métricas de éxito

- Todos los endpoints documentados y funcionales
- Cobertura de tests unitarios ≥ 70 %
- Pipeline CI pasa en cada push a `main`
- Dashboard refleja datos reales en tiempo real sin recargar la página
- Tiempo de respuesta del endpoint IA < 5 s
