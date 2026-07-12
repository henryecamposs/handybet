---
name: deploy-and-brain
description: "Compila, actualiza el changelog, actualiza el cerebro portátil de HandyBet y realiza el despliegue del proyecto. Permite también actualizar únicamente el cerebro portátil sin realizar un despliegue."
---

# Despliegue y Gestión de Cerebro Portátil (HandyBet)

Este skill define el procedimiento secuencial para compilar la aplicación, documentar los cambios técnicos, sincronizar el cerebro portátil y realizar el despliegue a producción.

## Instrucción de Activación

Este skill se activa cuando el usuario solicita:
- Desplegar la aplicación.
- Actualizar el cerebro portátil o la documentación de contexto.
- "deploy", "desplegar", "actualizar cerebro", "cerebro portátil", "project-brain".

---

## Flujo 1: Actualizar Cerebro Portátil (Solo Documentación / Contexto)

Este flujo se ejecuta cuando el usuario pide actualizar el cerebro portátil del proyecto sin realizar un despliegue completo.

### Pasos:
1. **Auditoría de Cambios:** Inspecciona el código de la sesión y los archivos que se hayan modificado (p. ej., componentes visuales, tiendas, hooks, esquemas de BD).
2. **Actualizar Historial de Decisiones:** Si hay cambios arquitectónicos mayores (como el cambio de nombres del sistema o nuevos flujos relacionales), abre y actualiza `.brain/history/decision_log.md` con la decisión.
3. **Actualizar el Cerebro:** Revisa y actualiza los archivos clave en `.brain/knowledge/` según corresponda:
   - `architecture.md`: Si cambiaron esquemas de carpetas o rutas.
   - `styles_and_ui.md`: Si se añadieron/cambiaron colores, fuentes o variantes del Logo.
   - `state_and_behavior.md`: Si se crearon nuevos hooks o lógica en la tienda `useHandyBetStore`.
   - `domain_context.md`: Si se añadieron nuevas reglas de negocio (como el cuestionario de onboarding, transacciones split o Pay-to-Post).
4. **Actualizar Walkthrough y Task:** Asegúrate de que `walkthrough.md` y `task.md` reflejen el estado final de las tareas.

---

## Flujo 2: Despliegue Completo de la Aplicación

Este flujo se ejecuta cuando el usuario solicita un despliegue del proyecto. Sigue estrictamente este orden:

### Paso 1: Compilar y Verificar
- Ejecuta `npx tsc --noEmit` para garantizar la ausencia de errores en TypeScript.
- Ejecuta `npm run lint` para validar consistencia de código.
- **Bloqueo:** Si algún comando falla, **DEBES** resolver los errores en el código antes de continuar.

### Paso 2: Actualizar el Changelog
- Analiza la diferencia de commits o los cambios mayores realizados en la sesión.
- Actualiza el archivo `CHANGELOG.md` en la raíz del proyecto. **Es obligatorio registrar cada cambio con la fecha actual (formato YYYY-MM-DD) y la nueva versión asignada (siguiendo SemVer, ej: [1.1.0] - 2026-07-12)**, estructurando los cambios según el estándar Keep a Changelog (Añadido, Corregido, Cambiado, etc.).

### Paso 3: Actualizar el Cerebro Portátil
- Ejecuta los pasos descritos en el **Flujo 1** (Actualizar Cerebro Portátil) para asegurar que la documentación contextual esté sincronizada con el código que se va a desplegar.

### Paso 4: Desplegar la Aplicación
- Realiza el push directo de los cambios a la rama `main` del repositorio remoto `origin`:
  ```powershell
  git push origin main
  ```
- En caso de despliegue en Expo (EAS) o Supabase (si se solicita específicamente):
  - Ejecutar `eas update` o `supabase db push` correspondientemente.
