import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Directorio global de skills
const GLOBAL_SKILLS_DIR = 'C:\\Users\\DELL\\.gemini\\config\\skills';
// Directorio de trabajo local (proyecto)
const localProjectDir = process.cwd();
const LOCAL_SKILLS_DIR = path.join(localProjectDir, '.agents', 'skills');

// Directorio global de workflows
const GLOBAL_WORKFLOWS_DIR = 'C:\\Users\\DELL\\.gemini\\config\\workflows';
const LOCAL_WORKFLOWS_DIR = path.join(localProjectDir, '.agents', 'workflows');

console.log(`🚀 Iniciando project-init en: ${localProjectDir}`);
console.log(`📂 Directorio local de skills: ${LOCAL_SKILLS_DIR}`);

// Asegurar que existe la carpeta local de skills y workflows
if (!fs.existsSync(LOCAL_SKILLS_DIR)) {
  fs.mkdirSync(LOCAL_SKILLS_DIR, { recursive: true });
}
if (!fs.existsSync(LOCAL_WORKFLOWS_DIR)) {
  fs.mkdirSync(LOCAL_WORKFLOWS_DIR, { recursive: true });
}

// Helper para obtener el hash md5 de un archivo
function getFileHash(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(content).digest('hex');
}

// Helper para copiar un directorio recursivamente
function copyDir(src, dest, force = false, onlyIfNewer = false) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, force, onlyIfNewer);
    } else if (entry.isFile()) {
      let shouldCopy = false;

      if (!fs.existsSync(destPath)) {
        shouldCopy = true; // Si no existe localmente, se copia siempre
      } else {
        const srcStat = fs.statSync(srcPath);
        const destStat = fs.statSync(destPath);
        
        // Si forzamos la copia
        if (force) {
          const srcHash = getFileHash(srcPath);
          const destHash = getFileHash(destPath);
          if (srcHash !== destHash) {
            shouldCopy = true;
          }
        } else if (onlyIfNewer) {
          // Si solo copiamos si el global es más reciente
          if (srcStat.mtimeMs > destStat.mtimeMs) {
            shouldCopy = true;
          }
        }
      }

      if (shouldCopy) {
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.copyFileSync(srcPath, destPath);
        console.log(`  ➕ Copiado: ${path.relative(GLOBAL_SKILLS_DIR, srcPath)} -> ${path.relative(LOCAL_SKILLS_DIR, destPath)}`);
      }
    }
  }
}

// Lista de skills globales disponibles
const globalSkills = fs.readdirSync(GLOBAL_SKILLS_DIR).filter(name => {
  return fs.statSync(path.join(GLOBAL_SKILLS_DIR, name)).isDirectory();
});

for (const skillName of globalSkills) {
  const globalSkillPath = path.join(GLOBAL_SKILLS_DIR, skillName);
  const localSkillPath = path.join(LOCAL_SKILLS_DIR, skillName);

  if (skillName === 'deploy' || skillName === 'obsidian-docs') {
    // Para deploy y obsidian-docs, forzamos la copia si el global es diferente o más reciente (anteponer global sobre local)
    console.log(`🔍 Analizando skill crítico: ${skillName} (Priorizando Global)`);
    copyDir(globalSkillPath, localSkillPath, true, false);
  } else {
    // Para otros skills, solo copiamos si el global es más reciente (cambios recientes)
    console.log(`🔍 Analizando skill: ${skillName}`);
    copyDir(globalSkillPath, localSkillPath, false, true);
  }
}


// --- WORKFLOWS SYNC ---
if (fs.existsSync(GLOBAL_WORKFLOWS_DIR)) {
  const globalWorkflows = fs.readdirSync(GLOBAL_WORKFLOWS_DIR).filter(name => {
    return fs.statSync(path.join(GLOBAL_WORKFLOWS_DIR, name)).isFile();
  });

  for (const workflowFile of globalWorkflows) {
    const globalWorkflowPath = path.join(GLOBAL_WORKFLOWS_DIR, workflowFile);
    const localWorkflowPath = path.join(LOCAL_WORKFLOWS_DIR, workflowFile);
    
    // Para workflows de graphify, forzamos la copia (o usamos onlyIfNewer)
    if (workflowFile.includes('graphify') || workflowFile.includes('graph-')) {
      console.log(`🔍 Analizando workflow crítico: ${workflowFile} (Priorizando Global)`);
      // Since it's a file, we can just copy it directly, but we can reuse the logic by copying its parent dir?
      // Wait, copyDir copies directories. We can just copy the file directly here.
      let shouldCopy = false;
      if (!fs.existsSync(localWorkflowPath)) {
        shouldCopy = true;
      } else {
        const srcHash = getFileHash(globalWorkflowPath);
        const destHash = getFileHash(localWorkflowPath);
        if (srcHash !== destHash) {
          shouldCopy = true;
        }
      }

      if (shouldCopy) {
        fs.mkdirSync(path.dirname(localWorkflowPath), { recursive: true });
        fs.copyFileSync(globalWorkflowPath, localWorkflowPath);
        console.log(`  ➕ Copiado workflow: ${workflowFile} -> .agents/workflows/${workflowFile}`);
      }
    }
  }
}

console.log("✅ Sincronización inteligente de skills y workflows completada.");
