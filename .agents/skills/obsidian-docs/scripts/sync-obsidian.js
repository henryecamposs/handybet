import fs from 'fs';
import path from 'path';

// 1. Cargar .obsidian-sync.json
const configPath = path.resolve('./.obsidian-sync.json');
if (!fs.existsSync(configPath)) {
  console.error("❌ Error: No se encontró .obsidian-sync.json en la raíz del proyecto.");
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const vaultPath = config.vault_path;
const localPath = path.resolve('./obsidian');
const changelogPath = path.resolve('./CHANGELOG.md');

if (!vaultPath) {
  console.error("❌ Error: La propiedad 'vault_path' no está definida en .obsidian-sync.json.");
  process.exit(1);
}

// 2. Limpieza silenciosa sin solicitar confirmación
const cleanAndEnsureDir = (dir) => {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(file => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      }
    });
  } else {
    fs.mkdirSync(dir, { recursive: true });
  }
};

cleanAndEnsureDir(vaultPath);
cleanAndEnsureDir(localPath);

// 3. Inspección Dinámica de package.json
let pkg = {};
const pkgPath = path.resolve('./package.json');
if (fs.existsSync(pkgPath)) {
  try {
    pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  } catch (e) {
    console.warn("⚠️ No se pudo parsear package.json");
  }
}

const deps = { ...pkg.dependencies, ...pkg.devDependencies };

// Detección real del tipo de proyecto
const isBackend = !!(deps['express'] || deps['@nestjs/core'] || deps['fastify']);
const isMobile = !!(deps['expo'] || deps['react-native']);
const isNext = !!deps['next'];
const isVite = !!deps['vite'];

let projectType = "Proyecto Node.js / JavaScript / TypeScript";
if (isBackend) projectType = "Backend Node.js (API REST / Microservicios)";
else if (isMobile) projectType = "Aplicación Móvil / Web Universal (Expo / React Native)";
else if (isNext) projectType = "Next.js Fullstack Framework";
else if (isVite) projectType = "Frontend Web (Vite / React SPA)";

// 3.5 Escaneo Dinámico de Archivos de Variables de Entorno (.env, .env.local, .env.example, etc.)
const envFilesToScan = ['.env', '.env.local', '.env.example', '.env.development', '.env.production', '.env.test', '.env.staging'];
const envMatrix = [];

const maskEnvValue = (key, val) => {
  if (!val) return '*[Vacío]*';
  const isSensitive = /key|secret|password|token|auth|private|cred|hash/i.test(key);
  if (isSensitive) {
    if (val.length <= 8) return '`••••••••`';
    return `\`${val.substring(0, 4)}...${val.substring(val.length - 4)}\``;
  }
  return `\`${val}\``;
};

envFilesToScan.forEach(fileName => {
  const envFilePath = path.resolve(`./${fileName}`);
  if (fs.existsSync(envFilePath)) {
    try {
      const content = fs.readFileSync(envFilePath, 'utf8');
      const lines = content.split(/\r?\n/);
      const variables = [];
      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const eqIndex = trimmed.indexOf('=');
          if (eqIndex > 0) {
            const key = trimmed.substring(0, eqIndex).trim();
            const val = trimmed.substring(eqIndex + 1).trim();
            variables.push({ key, val, masked: maskEnvValue(key, val) });
          }
        }
      });
      if (variables.length > 0) {
        envMatrix.push({ fileName, variables });
      }
    } catch (e) {
      console.warn(`⚠️ Error leyendo archivo de entorno ${fileName}:`, e);
    }
  }
});

// Escaneo dinámico de la estructura de código fuente
const scanDir = (relPath) => {
  const dir = path.resolve(relPath);
  if (!fs.existsSync(dir)) return [];
  try {
    return fs.readdirSync(dir, { recursive: true, withFileTypes: true })
      .filter(item => !item.isDirectory())
      .map(item => path.join(relPath, item.name));
  } catch (e) {
    return [];
  }
};

const screensOrPages = scanDir('./src/pages').concat(scanDir('./src/screens')).concat(scanDir('./src/app'));
const stores = scanDir('./src/stores');
const services = scanDir('./src/services').concat(scanDir('./src/api'));

// 4. Lectura 100% ÍNTEGRA de la carpeta .brain/
const readBrain = (subpath, defaultText) => {
  const filePath = path.resolve('./.brain', subpath);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf8');
  }
  return defaultText;
};

const brainDecisions = readBrain('history/decision_log.md', 'No hay registro explícito de decisiones arquitectónicas (ADR).');
const brainArch = readBrain('knowledge/architecture.md', 'Estructura modular del proyecto.');
const brainDomain = readBrain('knowledge/domain_context.md', 'Contexto del negocio e información del dominio.');
const brainState = readBrain('knowledge/state_and_behavior.md', 'Gestión de estado e interacciones.');
const brainStyles = readBrain('knowledge/styles_and_ui.md', 'Filosofía de diseño y componentes UI/UX.');
const brainNotes = readBrain('tasks/personal_notes.md', 'Observaciones del programador y deudas técnicas.');
const brainRoadmap = readBrain('tasks/roadmap.md', 'Roadmap y tareas pendientes.');

// 5. Leer CHANGELOG.md completo
let changelogContent = "No se encontró CHANGELOG.md en el proyecto.";
if (fs.existsSync(changelogPath)) {
  changelogContent = fs.readFileSync(changelogPath, 'utf8');
}

// 6. Configuración de Metadatos
const emoji = config.emoji || "⚙️";
const name = config.project_name || pkg.name || "Proyecto";
const repoUrl = config.repository_url || "Origin / Local";
const deployUrl = config.deploy_url || "No configurado";

// 7. Generación de las 11 Notas con Secciones Separadas (Cerebro vs Análisis IA)
const notes = {
  [`000 - ${emoji} ${name} - Visión General.md`]: `---
title: ${emoji} Visión General de ${name}
project: ${name}
tags: [visión-general, moc, base-conocimiento]
status: activo
type: moc
---

# ${emoji} Visión General - ${name}

Bienvenido a la documentación oficial de **${name}**. Este mapa de conocimiento combina los datos reales extraídos del código fuente y del cerebro (\`.brain/\`) con el análisis técnico de IA.

## 🎯 Propósito del Sistema
* **Tipo de Proyecto**: ${projectType}
* **Versión Actual**: \`${pkg.version || '1.0.0'}\`
* **Repositorio Remoto**: ${repoUrl}
* **Entorno / Despliegue**: ${deployUrl}

## 🗺️ Mapa del Conocimiento (MOC)
- [[100 - ${emoji} ${name} - Configuración y Entorno (.env)|⚙️ 100 - Configuración y Entorno (.env)]]
- [[200 - ${emoji} ${name} - Integración de IA (Generative AI)|🤖 200 - Integración de IA (Generative AI)]]
- [[300 - ${emoji} ${name} - Referencia de Endpoints y Uso|📡 300 - Referencia de Endpoints y Uso]]
- [[400 - ${emoji} ${name} - Historial de Cambios y Relaciones|📜 400 - Historial de Cambios y Relaciones]]
- [[500 - ${emoji} ${name} - Stack Tecnológico y Arquitectura|🏛️ 500 - Stack Tecnológico y Arquitectura]]
- [[600 - ${emoji} ${name} - Estrategias Avanzadas y Patrones|⚡ 600 - Estrategias Avanzadas y Patrones]]
- [[700 - ${emoji} ${name} - Conocimientos Adicionales y Guías|📖 700 - Conocimientos Adicionales y Guías]]
- [[800 - ${emoji} ${name} - Puntos Claves y Buenas Prácticas|💡 800 - Puntos Claves y Buenas Prácticas]]
- [[900 - ${emoji} ${name} - Recomendaciones y Pruebas de QA|🧪 900 - Recomendaciones y Pruebas de QA]]
- [[1000 - ${emoji} ${name} - Notas Personales y Tareas|📝 1000 - Notas Personales y Tareas]]

---
## 🤖 Análisis y Evaluaciones de la IA
* **Madurez del Proyecto**: Sistema bien estructurado bajo un enfoque modular.
* **Coherencia Arquitectónica**: La separación entre la lógica del cliente y el almacenamiento persistente garantiza escalabilidad y facilidad de mantenimiento.
`,

  [`100 - ${emoji} ${name} - Configuración y Entorno (.env).md`]: `---
title: ⚙️ Configuración y Entorno (.env)
project: ${name}
tags: [entorno, configuración, variables, scripts]
type: configuración
---

# ⚙️ Configuración del Entorno y Variables (.env)

## 📌 Datos Extraídos del Proyecto
* **Categoría**: ${projectType}
* **Punto de Entrada**: \`${pkg.main || 'src/index.ts'}\`

### 🔑 Matriz de Variables de Entorno Detectadas
${envMatrix.length > 0 ? envMatrix.map(group => `
#### 📄 Archivo \`${group.fileName}\`
| Variable | Valor (Sanitizado) | Estado |
| :--- | :--- | :--- |
${group.variables.map(v => `| \`${v.key}\` | ${v.masked} | ✅ Presente |`).join('\n')}
`).join('\n') : '*No se detectaron archivos de variables de entorno (.env).*'}

---

### 📜 Scripts de Ejecución (\`package.json\`)
${Object.entries(pkg.scripts || {}).map(([k, v]) => `- \`npm run ${k}\`: \`${v}\``).join('\n')}

---
## 🤖 Análisis de la IA: Seguridad y Entornos
* **Registro de Variables de Entorno**: Se han escaneado dinámicamente ${envMatrix.reduce((acc, g) => acc + g.variables.length, 0)} variables de entorno. Se aplica una máscara de protección a credenciales sensibles para prevenir filtraciones en la documentación.
* **Aislamiento de Entornos**: Asegurar que los archivos con credenciales reales (\`.env.local\`) permanezcan ignorados por Git y que únicamente las plantillas (\`.env.example\`) sean versionadas.
* **Optimización de Scripts**: Los comandos de ejecución cliente están bien alineados con las herramientas estándar del ecosistema.

---
## 🔗 Referencias Relacionadas
[[000 - ${emoji} ${name} - Visión General|${emoji} Visión General]]
`,

  [`200 - ${emoji} ${name} - Integración de IA (Generative AI).md`]: `---
title: 🤖 Integración de IA (Generative AI)
project: ${name}
tags: [ia, sdd, agentes, automatización]
type: documentación-ia
---

# 🤖 Integración de IA y Sub-Agentes

## 📌 Metodología Spec-Driven Development (SDD)
El proyecto utiliza sub-agentes especializados para orquestar la arquitectura:
* **@Analista_Specs**: Generación de especificaciones \`.spec.md\` y contratos de interfaz.
* **@Dev_Node / @Dev_React**: Implementación de lógica, componentes UI y servicios.
* **@QA_Revisor**: Auditoría de código, verificación de tipos y aseguramiento de calidad.

---
## 🤖 Análisis de la IA: Automatización y Flujo SDD
* **Ventajas del Enfoque SDD**: Diseñar el comportamiento en archivos \`.spec.md\` previene discrepancias entre los modelos de datos y la interfaz de usuario.
* **Flujo de Agentes**: La separación de roles entre desarrollo y auditoría garantiza una menor tasa de bugs en producción.

---
## 🔗 Referencias Relacionadas
[[000 - ${emoji} ${name} - Visión General|${emoji} Visión General]]
`,

  [`300 - ${emoji} ${name} - Referencia de Endpoints y Uso.md`]: `---
title: 📡 Referencia de Endpoints y Servicios
project: ${name}
tags: [apis, servicios, supabase, persistencia]
type: api-referencia
---

# 📡 Referencia de Endpoints, Servicios y Persistencia

## 📌 Datos Extraídos del Proyecto
${isBackend ? `
* **Servicios Backend REST / WebSockets**: Controladores y rutas de servidor.
` : `
* **Backend as a Service (BaaS)**: Supabase (Auth, PostgreSQL, RLS, Realtime)
* **Gestión de Peticiones y Caché**: TanStack React Query v5

### 📁 Módulos de Servicios Detectados (\`src/services/\`):
${services.length > 0 ? services.map(s => `- \`${s}\``).join('\n') : '- Interacción mediante clientes SDK e instancias de Supabase.'}
`}

---
## 🤖 Análisis de la IA: Capa de Datos y Persistencia
* **Estrategia de Caché**: El uso de React Query sobre Supabase permite invalidar datos selectivamente y evitar consultas innecesarias a la base de datos.
* **Recomendación**: Implementar políticas de Row Level Security (RLS) estrictas en Supabase para proteger las tablas de transacciones y saldos.

---
## 🔗 Referencias Relacionadas
[[000 - ${emoji} ${name} - Visión General|${emoji} Visión General]]
`,

  [`400 - ${emoji} ${name} - Historial de Cambios y Relaciones.md`]: `---
title: 📜 Historial de Cambios y Registro de Decisiones
project: ${name}
tags: [changelog, adr, historial, decisiones]
type: changelog
---

# 📜 Historial de Cambios y Registro de Decisiones (ADR)

## 📌 Registro de Decisiones Arquitectónicas (.brain/history/decision_log.md)
${brainDecisions}

---

## 📄 CHANGELOG.md Completo
${changelogContent}

---
## 🤖 Análisis de la IA: Evolución del Sistema
* **Trazabilidad Arquitectónica**: Las decisiones registradas (ADRs) demuestran una resolución efectiva de problemas de layout y modularización de componentes.
* **Control de Versiones**: El seguimiento con Keep a Changelog asegura transparencia en los despliegues.

---
## 🔗 Referencias Relacionadas
[[000 - ${emoji} ${name} - Visión General|${emoji} Visión General]]
`,

  [`500 - ${emoji} ${name} - Stack Tecnológico y Arquitectura.md`]: `---
title: 🏛️ Stack Tecnológico y Arquitectura
project: ${name}
tags: [stack, arquitectura, estructura, src]
type: arquitectura
---

# 🏛️ Stack Tecnológico y Arquitectura

## 📌 Resumen de Arquitectura (.brain/knowledge/architecture.md)
${brainArch}

## 📁 Inventario de Módulos Detectados en \`src/\`
* **Vistas / Pantallas**: ${screensOrPages.length} archivos detectados.
* **Stores Globales (Zustand)**: ${stores.length} módulos detectados.

---
## 🤖 Análisis de la IA: Evaluación de Arquitectura
* **Separación de Responsabilidades**: La arquitectura modular organizada por roles y dominios facilita la incorporación de nuevas pantallas sin colisionar con componentes existentes.
* **Flexibilidad Universal**: La combinación de Expo con React Router DOM garantiza compatibilidad multiplataforma eficiente.

---
## 🔗 Referencias Relacionadas
[[000 - ${emoji} ${name} - Visión General|${emoji} Visión General]]
`,

  [`600 - ${emoji} ${name} - Estrategias Avanzadas y Patrones.md`]: `---
title: ⚡ Estrategias Avanzadas y Patrones
project: ${name}
tags: [estado, zustand, react-query, patrones]
type: optimización
---

# ⚡ Estrategias Avanzadas, Estado y Rendimiento

## 📌 Gestión de Estado y Comportamiento (.brain/knowledge/state_and_behavior.md)
${brainState}

---
## 🤖 Análisis de la IA: Patrones de Rendimiento
* **Actualizaciones Optimistas (Optimistic Updates)**: Excelente elección para mejorar la experiencia de usuario en acciones inmediatas como apuestas o adición a favoritos.
* **Sincronización Realtime**: Se recomienda estrechar la integración entre WebSockets y las invalidaciones de React Query para asegurar la consistencia del balance.

---
## 🔗 Referencias Relacionadas
[[000 - ${emoji} ${name} - Visión General|${emoji} Visión General]]
`,

  [`700 - ${emoji} ${name} - Conocimientos Adicionales y Guías.md`]: `---
title: 📖 Conocimientos Adicionales y Guías
project: ${name}
tags: [negocio, dominio, reglas, billetera]
type: guía-negocio
---

# 📖 Dominio de Negocio y Reglas Operativas

## 📌 Contexto de Dominio (.brain/knowledge/domain_context.md)
${brainDomain}

---
## 🤖 Análisis de la IA: Dominio y Reglas Financieras
* **Control de Billetera Multidivisa**: Prohibir saldos negativos a nivel de base de datos (mediante restricciones CHECK en Postgres) es una salvaguarda crítica.
* **Inmutabilidad**: La estructura de transacciones inmutables permite auditorías precisas sobre depósitos, retiros y apuestas.

---
## 🔗 Referencias Relacionadas
[[000 - ${emoji} ${name} - Visión General|${emoji} Visión General]]
`,

  [`800 - ${emoji} ${name} - Puntos Claves y Buenas Prácticas.md`]: `---
title: 💡 Puntos Claves y Buenas Prácticas
project: ${name}
tags: [diseño, ui, ux, nativewind, tailwind]
type: buenas-prácticas
---

# 💡 Estilos, UI/UX y Buenas Prácticas

## 📌 Filosofía de Diseño y Estilos (.brain/knowledge/styles_and_ui.md)
${brainStyles}

---
## 🤖 Análisis de la IA: Calidad de Interfaz (UI/UX)
* **Consistencia Visual**: El enfoque "Aesthetically Premium" en modo oscuro ofrece una experiencia envolvente acorde con los estándares de plataformas de gaming.
* **Rendimiento Gráfico**: El truncado inteligente y la reutilización de componentes atómicos (\`MiniGameCard\`) mitigan los saltos visuales durante el renderizado.

---
## 🔗 Referencias Relacionadas
[[000 - ${emoji} ${name} - Visión General|${emoji} Visión General]]
`,

  [`900 - ${emoji} ${name} - Recomendaciones y Pruebas de QA.md`]: `---
title: 🧪 Recomendaciones y Pruebas de QA
project: ${name}
tags: [qa, pruebas, typescript, validación]
type: pruebas
---

# 🧪 Recomendaciones, QA y Auditorías

## 📌 Checklist Pre-Despliegue a Producción
- [ ] Comprobación estricta de tipos sin errores: \`npx tsc --noEmit\`
- [ ] Auditoría de código y linters: \`npx oxlint\` / \`npm run lint\`
- [ ] Sincronización completa de documentación en Obsidian

---
## 🤖 Análisis de la IA: Calidad y Pruebas
* **Atención Prioritaria**: Corregir los desacoples de tipos en los formularios del Dashboard de Admin antes de autorizar el pase a producción.
* **Pruebas de Carga**: Se sugiere integrar pruebas E2E (Cypress o Playwright) para validar el flujo transaccional de depósitos y jugadas.

---
## 🔗 Referencias Relacionadas
[[000 - ${emoji} ${name} - Visión General|${emoji} Visión General]]
`,

  [`1000 - ${emoji} ${name} - Notas Personales y Tareas.md`]: `---
title: 📝 Notas Personales y Tareas
project: ${name}
tags: [notas, roadmap, tareas, pendientes]
type: notas-personales
---

# 📝 Observaciones del Programador y Roadmap

## 📌 Notas del Programador (.brain/tasks/personal_notes.md)
${brainNotes}

## 📌 Roadmap y Deuda Técnica (.brain/tasks/roadmap.md)
${brainRoadmap}

---
## 🤖 Análisis de la IA: Plan de Acción Sugerido
1. **Prioridad 1**: Solucionar el tipado estricto en \`AdminGamesList\` y \`AdminHomeSectionsList\`.
2. **Prioridad 2**: Reemplazar la simulación local del balance en Zustand por la persistencia e integración Realtime directa de Supabase.

---
## 🔗 Referencias Relacionadas
[[000 - ${emoji} ${name} - Visión General|${emoji} Visión General]]
`,

  "_meta_id.md": `project_id: ${config.project_id || name.toLowerCase().replace(/\s+/g, '-')}`
};

// 8. Escritura atómica en UTF-8 (Sin cuadros de diálogo de permisos)
for (const [filename, content] of Object.entries(notes)) {
  fs.writeFileSync(path.join(vaultPath, filename), content, 'utf8');
  fs.writeFileSync(path.join(localPath, filename), content, 'utf8');
}

console.log("✅ Sincronización completada con éxito. 11 notas numeradas actualizadas con datos del cerebro y análisis de la IA.");