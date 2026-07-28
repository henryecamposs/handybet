---
name: project-init
description: Inicializador global de proyectos y Arquitecto Senior. Analiza e identifica el tipo de proyecto (Frontend React/Vite/Next.js, Backend Node.js/Express, o Fullstack), establece la arquitectura de software Senior (carpetas, módulos, middlewares, seguridad, stores, hooks, componentes, servicios), aprovisiona las tecnologías líderes (Zod, Zustand, React Hook Form, TanStack Query/Table, Tailwind CSS, Helmet, Rate-Limit, EJS), ejecuta auditoría de código con oxlint/accessibility, elabora el plan de pruebas QA en CHANGELOG.md y realiza la sincronización 100% automática con Obsidian (.brain y notas 000-1000). Usar cuando el usuario pida iniciar un proyecto, bootstrapear skills, actualizar la arquitectura o estructurar un repositorio.
---

# Arquitecto Senior e Inicializador Global de Proyectos (`project-init`)

Este skill se encarga de bootstrapear, aprovisionar y estructurar la arquitectura completa de cualquier proyecto de software (Frontend, Backend o Fullstack). Actúa como un **Arquitecto Senior de Software**, organizando directorios, copiando e instalando el conjunto completo de habilidades globales y locales, configurando tecnologías avanzadas, implementando políticas de seguridad, estableciendo un flujo de QA continuo y manteniendo la documentación sincronizada con Obsidian y el cerebro del proyecto (`.brain/`).

---

## 📋 Lista de Skills Esenciales Copiados al Proyecto

Al ejecutar `project-init`, se copian e instalan en `<proyecto>/.agents/skills/` los siguientes skills desde la bóveda global `C:\Users\DELL\.gemini\config\skills\`:

1. **`project-brain`**: Administrador portable del contexto del proyecto, arquitectura y onboarding para agentes AI.
2. **`deploy`**: Skill de despliegue automatizado a producción (compilación limpia, QA en CHANGELOG y Obsidian, sincronización 100% transparente con Obsidian, push a GitHub `origin main`).
3. **`obsidian-docs`**: Documentador y sincronizador automático para la bóveda de Obsidian (`C:\Users\DELL\OneDrive\boveda Conocimientos\Conocimientos\`), generando la estructura numerada 000-1000 con volcado 100% íntegro del CHANGELOG.
4. **`skill-creator`**: Creador y extensor de habilidades del agente.
5. **`frontend-design`**: Creador de interfaces de usuario premium, design system, temas visuales y componentes de alto impacto visual.
6. **`oxlint`**: Code reviewer, auditoría de calidad y linter ultra-rápido de JavaScript/TypeScript.
7. **`nodejs-backend-patterns`**: Arquitecto de código backend (Express/Nest, APIs REST/GraphQL, controladores, resiliencia).
8. **`nodejs-best-practices`**: Decisiones arquitectónicas, patrones asíncronos y buenas prácticas en Node.js.
9. **`seo`**: Optimizador de SEO, visibilidad en motores de búsqueda, Open Graph, sitemaps y meta tags.
10. **`tailwind-css-patterns`**: Sistema de diseño con utilidades de Tailwind CSS y maquetación responsive.
11. **`react-best-practices`**: Generador de código eficiente en React, patrones de rendimiento y optimización Vercel.
12. **`typescript-advanced-types`**: Sistema de tipos avanzado en TypeScript y contratos de datos seguros.
13. **`accessibility`**: Auditor de accesibilidad (WCAG 2.2, a11y, navegación por teclado).
14. **`zod`**: Validación de esquemas y contratos de datos en TypeScript.
15. **`vite`**: Configuración de build tool y desarrollo rápido.
16. **`composition-patterns`**: Patrones de composición flexible en componentes React.
17. **`react-hook-form`**: Manejo optimizado de formularios y validaciones del lado del cliente.
18. **`supabase-postgres-best-practices`**: Buenas prácticas de Postgres, RLS y optimizaciones en Supabase.
19. **`polli`**: Generación de activos multimedia.
20. **`graphify`**: Generador y orquestador del Knowledge Graph topológico y semántico del proyecto.

---

## ⚙️ Protocolo de Ejecución del Skill (`project-init`)

Cuando se invoca `project-init`, la IA ejecutará los siguientes pasos de forma secuencial:

### Paso 1: Identificación del Proyecto Local
- Determinar la ruta absoluta del proyecto actual (`<proyecto>`).
- Identificar el nombre del proyecto y generar su `project_id` único (ej: `nombre-proyecto-b5f7e029`).

---

### Paso 2: Creación del Directorio de Skills Local
- Verificar si existe el directorio `<proyecto>/.agents/skills/`.
- Si no existe, crearlo automáticamente.

---

### Paso 3: Sincronización Inteligente de Habilidades (Copia & Ejecución del Script)
1. Copiar cada uno de los directorios listados desde `C:\Users\DELL\.gemini\config\skills\<skill-name>` a `<proyecto>/.agents/skills/<skill-name>`.
2. Preservar la estructura de archivos intacta (`SKILL.md`, `scripts/`, `references/`, `assets/`, etc.).
3. El agente debe ejecutar el script global de sincronización de habilidades:
   ```bash
   node C:\Users\DELL\.gemini\config\skills\project-init\scripts\init-project.js
   ```
   Este script realiza un análisis comparativo y aplica las siguientes reglas de actualización:
   - **Anteposición Global (`deploy` y `obsidian-docs`)**: Para estos dos skills de control de ciclo de vida, los cambios globales siempre sobrescriben los locales si se detectan diferencias de hash o modificaciones recientes, garantizando la uniformidad del pipeline de despliegue.
   - **Sincronización Selectiva**: Para las demás habilidades, solo se importan los archivos de la bóveda global si son más recientes que la copia local (`mtime` global > `mtime` local), evitando duplicidades y protegiendo cualquier personalización o ajuste realizado a nivel local en el proyecto.

---

### Paso 4: Inicialización de Estructura de Documentación Local
1. **`CHANGELOG.md`**: Si no existe en la raíz del proyecto, crear un `CHANGELOG.md` base con la primera versión `[1.0.0]` siguiendo el formato *Keep a Changelog*.
2. **`.obsidian-sync.json` (Obligatorio en la raíz)**: Crear el archivo `.obsidian-sync.json` en la raíz del proyecto con la siguiente estructura de metadatos:
   ```json
   {
     "project_id": "<nombre-proyecto>-<hash>",
     "project_name": "<nombre-proyecto>",
     "emoji": "⚙️",
     "vault_path": "C:\\Users\\DELL\\OneDrive\\boveda Conocimientos\\Conocimientos\\<PrefijoNum> - ⚙️ <nombre-proyecto>",
     "repository_url": "<git_remote_url>",
     "deploy_url": "<deploy_url>",
     "last_sync": "<ISO_TIMESTAMP>"
   }
   ```
3. **`project-brain`**: Generar la carpeta `.brain/` con el análisis inicial del proyecto (`knowledge/`, `history/`, `tasks/`).
4. **`obsidian-docs`**: Leer la ruta de la bóveda desde `.obsidian-sync.json` en la raíz del proyecto y ejecutar la primera sincronización silenciosa hacia Obsidian.
5. **`graphify`**: Analizar el código local ejecutando el comando de graphify en la raíz para generar el Knowledge Graph en la carpeta `graphify-out/`.

---

### Paso 5: Estructuración Arquitectónica por un Arquitecto Senior

#### 🎨 En Proyectos Frontend (React / Vite / Next.js)
El agente debe estructurar o verificar las siguientes carpetas y capas de diseño modular:

```text
src/
├── assets/          # Imágenes, fuentes, íconos estáticos
├── components/      # Componentes UI reutilizables
│   ├── ui/          # Componentes base del Design System (Button, Modal, Card, Input, Badge)
│   ├── common/      # Spinners, EmptyStates, ErrorBoundaries
│   └── layout/      # Header, Navbar, Sidebar, Footer, PageContainer
├── features/        # Módulos organizados por dominio de negocio (ej: auth, lottery, dashboard)
├── hooks/           # Custom Hooks reutilizables (useAuth, useDebounce, useMediaQuery)
├── stores/          # Estado global cliente optimizado con Zustand / Redux
├── services/        # Capa API / HTTP con TanStack Query (React Query) o cliente Fetch/Axios
├── schemas/         # Validación de datos y contratos con Zod
├── types/           # Definiciones de tipos e interfaces TypeScript
├── lib/             # Utilidades globales (clsx, tailwind-merge / cx, formatters)
└── styles/          # index.css / globals.css (Variables HSL, Design Tokens, Tailwind)
```

#### ⚙️ En Proyectos Backend (Node.js / Express)
El agente debe estructurar o verificar las siguientes carpetas y capas de arquitectura limpia:

```text
src/
├── config/          # Variables de entorno sanadas con Zod, conexión DB, constantes
├── middlewares/     # Middlewares reutilizables
│   ├── security.middleware.ts   # Helmet, CORS restrictivo, express-rate-limit
│   ├── auth.middleware.ts       # Verificación JWT / Sesión, control de roles (RBAC)
│   ├── validator.middleware.ts  # Sanitización y validación de payloads con Zod
│   ├── errorHandler.middleware.ts # Manejo global de excepciones con códigos HTTP
│   └── logger.middleware.ts     # Logging de peticiones HTTP
├── models/          # Modelos de datos / ORM / Schemas DB (Prisma, Supabase, Mongoose)
├── controllers/     # Manejo de Request/Response HTTP
├── services/        # Lógica de negocio desacoplada de HTTP
├── routes/          # Definición modular de rutas de API REST
├── libs/            # Helpers de encriptación, cliente de base de datos, utilidades
└── views/           # Renderizado dinámico con plantillas EJS o Área de Cliente SSR (si aplica)
```

---

### Paso 6: Aprovisionamiento de Tecnologías Senior
- **Frontend Stack**:
  - **Zod**: Validación de esquemas en formularios y respuestas API.
  - **Zustand**: Manejo de estado global reactivo sin prop drilling ni re-renders pesados.
  - **React Hook Form**: Gestión de formularios cliente con validación vía Zod resolver.
  - **TanStack Query (React Query)**: Caché, revalidación en segundo plano y mutaciones asíncronas.
  - **TanStack Table**: Tablas de datos avanzadas con paginación, filtros y ordenamiento.
  - **Tailwind CSS + `clsx` / `cx`**: Estilizado con utilidades, clases condicionales dinámicas y modo oscuro.
  - **SEO Helmet (`react-helmet-async`)**: Gestión dinámica de metadatos SEO en el lado del cliente y servidor para Open Graph, Twitter Cards y etiquetas meta.
  - **Design System & SEO**: Variables CSS Tailored (HSL), meta tags con Open Graph, sitemaps y accesibilidad WCAG 2.2 (`aria-*`, navegación por teclado).
- **Backend Stack**:
  - **Helmet**: Cabeceras de seguridad HTTP activadas.
  - **CORS**: Configuración de orígenes permitidos explícitos.
  - **Rate-Limiting**: Control de frecuencia de peticiones para mitigar ataques DoS / Fuerza Bruta.
  - **Sanitización Zod**: Validación previa de body, query y params en cada endpoint.
  - **EJS Views**: Área de cliente / plantillas dinámicas si se requiere SSR.

---

### Paso 7: Auditoría de Código (Code Reviewer) y Protocolo de QA Senior
1. **Auditoría de Código (Code Review)**:
   - Escanear el proyecto usando los skills de auditoría (`oxlint` para linters ultra-rápidos y `accessibility` para UI).
   - Validar compilación limpia de TypeScript (`tsc --noEmit`).
2. **Matriz de Pruebas y Control de Calidad (QA)**:
   - Crear o actualizar el plan de pruebas en `CHANGELOG.md` cubriendo:
     - 🧪 **Pruebas Unitarias / Integración**: Cobertura de métodos de servicios, stores y controladores.
     - ⚠️ **Pruebas de Borde & Estrés**: Resistencia a latencia, peticiones fallidas, offline/mock mode, desbordamiento de contenedores UI y zona horaria (ej: VET UTC-4).
     - 🔒 **Pruebas de Seguridad**: Sanitización de inputs, XSS, permisos RBAC.
3. **Registro en CHANGELOG.md**:
   - Actualizar `CHANGELOG.md` con los cambios arquitectónicos implementados, los hallazgos de QA y las recomendaciones de prueba para el equipo.

---

### Paso 8: Reporte de Diligencia al Usuario
Presentar una síntesis clara al usuario con:
- 🆔 **Identificación del Proyecto**: Nombre, `project_id` y ruta del repositorio.
- 📦 **Skills Copiados**: Sincronización de los 20 skills a `.agents/skills/`.
- 🏗️ **Stack & Tipo de Proyecto**: Clasificación detectada (Front / Back / Fullstack).
- 📂 **Arquitectura Aplicada**: Estructura de directorios y módulos creados.
- ⚡ **Tecnologías Senior Configuradas**: Lista de librerías/patrones aprovisionados (Zod, Zustand, Helmet, etc.).
- 🧪 **Auditoría & QA**: Resultado de la revisión de código y matriz de pruebas alojada en `CHANGELOG.md`.
- 📓 **Documentación**: Confirmación de la sincronización en Obsidian (`obsidian-docs`) y `.brain/`.
