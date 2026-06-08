# Actores y Roles

## Actores del sistema

| Actor | Descripción | Cómo interactúa |
|-------|-------------|-----------------|
| Gestor de stock | Usuario operativo que registra entradas/salidas y monitorea alertas | Interfaz web React — pages Products y StockMovements |
| Administrador | Usuario con acceso completo al sistema | Interfaz web React — todas las pages |
| Sistema de IA | Agente externo que genera recomendaciones de texto en lenguaje natural | Llamada REST desde `ai_service.py` al endpoint del LLM externo |
| GitHub Actions (CI) | Actor automatizado que ejecuta tests y build en cada push | Pipeline automatizado, sin interacción humana directa |

## RBAC — Matriz de permisos

> **Nota**: la v1.0 **no implementa autenticación**. El sistema es monousuario — todos los actores humanos tienen acceso total. Esta tabla documenta la intención lógica de roles para versiones futuras.

| Rol | Productos | Movimientos | Dashboard | IA |
|-----|-----------|-------------|-----------|-----|
| Gestor | Leer, Crear, Editar | Leer, Crear | Leer | Sin acceso |
| Administrador | CRUD completo | Leer, Crear | Leer | Acceso completo |

## Rutas públicas

Dado que v1.0 no implementa autenticación, **todas las rutas son públicas**:

- `GET /products`
- `GET /products/{id}`
- `POST /products`
- `PUT /products/{id}`
- `DELETE /products/{id}`
- `GET /movements`
- `POST /movements`
- `GET /dashboard`
- `POST /ai/recommendation`

**Pendiente para versión futura**: implementar JWT con FastAPI Security para proteger rutas de escritura y el endpoint de IA.
