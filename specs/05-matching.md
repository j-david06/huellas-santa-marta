# Spec: Sistema de Matching Automático - Coincidencias Sugeridas

## Descripción Funcional

El módulo de Matching es un sistema automático que sugiere posibles coincidencias entre reportes de mascotas PERDIDAS y ENCONTRADAS. Cuando un usuario visualiza un reporte, el sistema analiza si hay otros reportes que podrían corresponder a la misma mascota (basado en características similares: tipo, color, zona geográfica, rango de fechas). Si encuentra coincidencias potenciales, muestra una alerta destacada: "Posible Coincidencia Detectada".

Este feature aumenta significativamente las probabilidades de reunir mascotas con sus dueños al conectar reportes relacionados.

---

## Entidades Involucradas

### Coincidencia (Match)
- **ID**: UUID
- **Reporte A**: UUID (reporte base, puede ser PERDIDO o ENCONTRADO)
- **Reporte B**: UUID (reporte potencialmente coincidente)
- **Score de Coincidencia**: Numérico (0-100, indica confianza del match)
- **Factores que Coinciden**: Array de strings (tipo_animal, color, zona_geografica, rango_fechas)
- **Timestamp de Generación**: Cuándo se calculó el match
- **Estado**: PENDING, VIEWED, ACCEPTED, REJECTED, RESOLVED

### Algoritmo de Scoring
```
Score = (puntos_tipo * 0.4) + (puntos_color * 0.3) + (puntos_zona * 0.2) + (puntos_fecha * 0.1)

- puntos_tipo: 50 si tipo es igual (perro-perro o gato-gato), 0 en otro caso
- puntos_color: 50 si color es muy similar (ej: negro y negro), 25 si es similar (marrón y café), 0 si no coincide
- puntos_zona: 50 si está en la misma zona, 25 si está a < 1km, 0 si > 1km
- puntos_fecha: 50 si las fechas están a < 24h, 25 si están a < 72h, 0 si > 72h

Threshold para sugerir: Score >= 60
```

---

## Reglas de Negocio

1. **Cuándo Calcular Matches**:
   - Se calcula un match cuando:
     - Se crea un nuevo reporte (buscar coincidencias con existentes)
     - Se visualiza un reporte (mostrar coincidencias si las hay)
     - Cada 24 horas se recalculan todos los matches (background job)
   - No se sugieren matches entre dos reportes con el mismo estado (no emparejar PERDIDO con PERDIDO)
   - Solo se sugieren matches si Score >= 60

2. **Criterios de Comparación**:
   - **Tipo de Animal**: Exacto (perro = perro, gato = gato)
   - **Color**: Similar (busca colorización similar en la descripción)
   - **Zona Geográfica**: Distancia máxima 2 km entre coordenadas
   - **Rango de Fechas**: 
     - Máx 7 días entre el avistamiento PERDIDO y el reporte ENCONTRADO
     - O máx 7 días entre hallazgo ENCONTRADO y reporte PERDIDO
   - **Raza**: Secundaria (no impacta el score, solo información adicional)
   - **Sexo**: Secundaria

3. **Privacidad**:
   - El usuario VE que hay una coincidencia, pero inicialmente NO accede automáticamente
   - Debe hacer clic en "Ver reporte sugerido" para ir al otro reporte
   - Si hace clic, se registra que vio el match (para analytics)

4. **Notificación de Match**:
   - Si se sugiere un match, se envía notificación push a ambos publicadores
   - La notificación dice: "¡Posible coincidencia encontrada para tu reporte!"
   - Incluye link directo al reporte potencialmente coincidente

5. **Resolución de Matches**:
   - Si el usuario acepta el match (marca su reporte como RESUELTO después de ver la sugerencia), se registra el match como RESOLVED
   - Los datos se usan para mejorar el algoritmo en futuras versiones

---

## Criterios de Aceptación

### CA1: Visualizar Alerta de Coincidencia
- [ ] En la vista de detalle de un reporte, si hay coincidencias con Score >= 60, aparece una alerta
- [ ] La alerta está posicionada de forma destacada (debajo de las acciones principales)
- [ ] Tiene background diferente (ej: amarillo/dorado suave - color tertiary)
- [ ] Icono especial (ej: spark / auto_awesome)
- [ ] Texto: "Posible Coincidencia Detectada"
- [ ] Subtitle: "Nuestro sistema encontró un reporte de un [tipo] similar visto hace [X horas/días]"

### CA2: Información de la Coincidencia
- [ ] La alerta muestra:
  - Foto miniatura del reporte coincidente
  - Nombre de la mascota (o "Sin nombre" si no tiene)
  - Tipo y raza
  - Ubicación
  - Hace cuánto fue reportado
  - Puntuación de coincidencia (ej: "Match 85%") - opcional en fase 1
- [ ] Botón prominente: "Ver reporte sugerido"

### CA3: Navegación a Reporte Coincidente
- [ ] Al hacer clic en "Ver reporte sugerido", navega al detalle del otro reporte
- [ ] Se registra que el usuario vio la coincidencia (para analytics)
- [ ] En el nuevo reporte, también aparece la alerta de coincidencia inversa (link al reporte original)

### CA4: Matching en Tiempo Real al Crear
- [ ] Cuando un usuario crea un nuevo reporte, se buscan coincidencias automáticamente
- [ ] Si hay matches con Score >= 60, se muestra una notificación: "¡Encontramos posibles coincidencias!"
- [ ] Se ofrecen links directos a los reportes coincidentes (máx 3)

### CA5: Notificaciones a Publicadores
- [ ] Si se detecta una coincidencia, ambos publicadores reciben una notificación push
- [ ] La notificación incluye información básica del otro reporte
- [ ] El usuario puede hacer clic para ir directamente a la coincidencia

### CA6: Exactitud del Algoritmo
- [ ] Prueba 1: Reporte A (Perro Negro, Centro Histórico, 2/ago) vs B (Perro Negro, Centro Histórico, 3/ago)
  - Expected: Score alto (85+%), se sugiere
- [ ] Prueba 2: Reporte A (Gato Blanco, Rodadero, 1/ago) vs B (Perro Blanco, Rodadero, 2/ago)
  - Expected: Score bajo (< 60), no se sugiere (tipo diferente)
- [ ] Prueba 3: Reporte A (Perro Marrón, Centro, 1/ago) vs B (Perro Café, Minca, 8/ago)
  - Expected: Score medio (50-60), no se sugiere (zona distante, fecha vieja)

### CA7: Múltiples Coincidencias
- [ ] Si hay múltiples coincidencias (Score >= 60), se muestra la más probable primero
- [ ] Si hay > 3, se muestra: "Ver las X coincidencias encontradas" (expandible)
- [ ] Se lista en orden de Score descendente

### CA8: No Mostrar Coincidencia del Mismo Usuario
- [ ] Si un usuario tiene múltiples reportes suyos, no se sugieren como coincidencias entre sí
- [ ] (Ej: No emparejar reporte A del usuario Juan con reporte B también del usuario Juan)

### CA9: Recálculo Periódico
- [ ] Background job ejecuta cada 24 horas
- [ ] Recalcula matches para todos los reportes ACTIVOS
- [ ] Nuevas coincidencias generan notificaciones push

### CA10: Analytics
- [ ] Se registra:
  - Cuántas veces se sugiere cada coincidencia
  - Cuántas veces el usuario hace clic en "Ver reporte sugerido"
  - Cuántas veces el usuario marca el reporte como RESUELTO después de ver sugerencia
  - Métrica de "éxito" (si 2 reportes se marcan como resueltos después de verse)

---

## Notas Técnicas

- Implementar como tabla `matches` con índices en: reporte_a_id, reporte_b_id, score, estado
- Usar background job (Quartz, Spring Scheduler, o worker process) para recalcular matches cada 24h
- Implementar caché (Redis) para evitar recalcular el mismo match múltiples veces en corto tiempo
- Usar librería de geolocalización (GeoHash, Haversine distance) para cálculos de distancia
- Usar librería de matching de texto (Levenshtein distance, fuzzy matching) para comparar colores
- Score debe ser una fórmula ponderada (weights pueden ajustarse según datos reales)
- Notificaciones vía Firebase Cloud Messaging o similar
