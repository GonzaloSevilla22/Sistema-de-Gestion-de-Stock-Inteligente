# Funcionalidades

Organizadas por épica y luego por historia de usuario (US-NNN).

---

## Épica 1: Dashboard y KPIs

### US-001 — Ver KPIs del inventario
**Como** gestor de stock  
**Quiero** ver en una sola pantalla cuántos productos hay en total, cuántos tienen stock bajo y cuántos están agotados  
**Para** tener visibilidad inmediata del estado del inventario sin buscar manualmente  

**Criterios de aceptación**:
- [ ] CA-1: El dashboard muestra 3 cards KPI: "Productos totales", "Stock bajo", "Agotados"
- [ ] CA-2: Los valores se actualizan cada vez que se recarga la página
- [ ] CA-3: El endpoint `GET /dashboard` retorna `{ "total_products": N, "low_stock_count": N, "out_of_stock_count": N }`

**Reglas relacionadas**: RN-DH-01, RN-DH-02, RN-DH-03, RN-ST-01, RN-ST-02

---

## Épica 2: Gestión de Productos

### US-002 — Listar productos
**Como** gestor de stock  
**Quiero** ver una tabla con todos los productos del sistema  
**Para** tener un inventario visible y ordenado  

**Criterios de aceptación**:
- [ ] CA-1: La tabla muestra: nombre, categoría, precio, stock actual, stock mínimo, estado
- [ ] CA-2: El estado se muestra con un indicador visual (normal / bajo / agotado)
- [ ] CA-3: Se puede buscar/filtrar productos por nombre

**Reglas relacionadas**: RN-ST-01, RN-ST-02, RN-ST-03

### US-003 — Crear producto
**Como** administrador  
**Quiero** poder dar de alta un nuevo producto con todos sus atributos  
**Para** ampliar el catálogo del inventario  

**Criterios de aceptación**:
- [ ] CA-1: El formulario solicita: nombre (req), descripción, categoría, precio (req), stock inicial (req), stock mínimo (req)
- [ ] CA-2: Al guardar, el producto aparece en la lista
- [ ] CA-3: Si falta nombre o precio, se muestra error de validación

**Reglas relacionadas**: RN-PR-01, RN-PR-02, RN-PR-03, RN-PR-04

### US-004 — Editar producto
**Como** administrador  
**Quiero** modificar los atributos de un producto existente  
**Para** mantener el catálogo actualizado  

**Criterios de aceptación**:
- [ ] CA-1: Al hacer clic en "Editar", se abre un formulario pre-cargado con los datos actuales
- [ ] CA-2: Los cambios se persisten correctamente
- [ ] CA-3: El stock mínimo se puede ajustar para recalibrar las alertas

**Reglas relacionadas**: RN-PR-02, RN-PR-03

### US-005 — Eliminar producto
**Como** administrador  
**Quiero** eliminar un producto del sistema  
**Para** remover artículos que ya no se comercializan  

**Criterios de aceptación**:
- [ ] CA-1: Se muestra un diálogo de confirmación antes de eliminar
- [ ] CA-2: Al confirmar, el producto y sus movimientos desaparecen del sistema
- [ ] CA-3: El dashboard se actualiza automáticamente

**Reglas relacionadas**: RN-PR-05

---

## Épica 3: Movimientos de Stock

### US-006 — Registrar movimiento de entrada
**Como** gestor de stock  
**Quiero** registrar la entrada de unidades de un producto  
**Para** actualizar el stock cuando llega mercadería nueva  

**Criterios de aceptación**:
- [ ] CA-1: El formulario solicita: producto (req), tipo (ENTRADA pre-seleccionado), cantidad (req), observación (opcional)
- [ ] CA-2: Al guardar, el stock del producto se incrementa en la cantidad ingresada
- [ ] CA-3: El movimiento aparece en el historial con fecha y hora automáticos

**Reglas relacionadas**: RN-MV-01, RN-MV-02, RN-MV-03, RN-MV-06

### US-007 — Registrar movimiento de salida
**Como** gestor de stock  
**Quiero** registrar la salida de unidades de un producto  
**Para** actualizar el stock cuando se despacha o consume mercadería  

**Criterios de aceptación**:
- [ ] CA-1: El sistema valida que la cantidad de salida no supere el stock disponible
- [ ] CA-2: Si la cantidad excede el stock, se muestra error descriptivo y NO se registra el movimiento
- [ ] CA-3: Al registrar exitosamente, el stock del producto disminuye

**Reglas relacionadas**: RN-MV-01, RN-MV-02, RN-MV-04, RN-MV-05, RN-MV-06

### US-008 — Ver historial de movimientos
**Como** gestor de stock  
**Quiero** ver el historial completo de movimientos de stock  
**Para** auditar las entradas y salidas del inventario  

**Criterios de aceptación**:
- [ ] CA-1: La tabla muestra: producto, tipo, cantidad, fecha, observación
- [ ] CA-2: Los movimientos se ordenan por fecha descendente (más recientes primero)
- [ ] CA-3: El tipo ENTRADA se diferencia visualmente de SALIDA (ej. colores)

---

## Épica 4: Alertas de Stock

### US-009 — Ver alertas de stock crítico
**Como** gestor de stock  
**Quiero** ver automáticamente qué productos tienen stock bajo o están agotados  
**Para** priorizar las reposiciones sin tener que revisar todo el inventario manualmente  

**Criterios de aceptación**:
- [ ] CA-1: Los productos con `stock <= minimum_stock` aparecen marcados visualmente en la tabla
- [ ] CA-2: El badge de "Stock bajo" o "Agotado" se actualiza en tiempo real al registrar movimientos
- [ ] CA-3: El dashboard KPI refleja los conteos correctos de alertas

**Reglas relacionadas**: RN-ST-01, RN-ST-02, RN-ST-04

---

## Épica 5: Recomendaciones IA

### US-010 — Obtener recomendación de reposición
**Como** administrador  
**Quiero** consultar a la IA qué hacer con un producto de stock bajo  
**Para** recibir una sugerencia de reposición en lenguaje natural y tomar una decisión informada  

**Criterios de aceptación**:
- [ ] CA-1: El botón "Obtener recomendación IA" está disponible en los productos con stock bajo
- [ ] CA-2: Al hacer clic, se envía `{ producto, stock_actual, stock_minimo }` al endpoint
- [ ] CA-3: La respuesta de texto del LLM se muestra en un modal o sección de la UI
- [ ] CA-4: Si la API de IA falla, se muestra un mensaje de fallback amigable (no pantalla de error)

**Reglas relacionadas**: RN-AI-01, RN-AI-02, RN-AI-03, RN-AI-04, RN-AI-05
