# PowerShell Script for Directory Sync and Creation (UTF-8 Compliant)
$ErrorActionPreference = 'Stop'

# Leer .obsidian-sync.json
$configPath = Resolve-Path ".\.obsidian-sync.json" -ErrorAction SilentlyContinue
if (-not $configPath) {
    Write-Error "Error: No se encontró .obsidian-sync.json en la raíz del proyecto."
    exit 1
}

$config = Get-Content -Path $configPath -Raw | ConvertFrom-Json
$vaultPath = $config.vault_path
$localPath = Resolve-Path ".\obsidian" -ErrorAction SilentlyContinue

if (-not $vaultPath) {
    Write-Error "Error: La propiedad 'vault_path' no está definida en .obsidian-sync.json."
    exit 1
}

# Asegurar directorios
if (-not (Test-Path $vaultPath)) {
    New-Item -ItemType Directory -Force -Path $vaultPath | Out-Null
}
if (-not (Test-Path $localPath)) {
    New-Item -ItemType Directory -Force -Path $localPath | Out-Null
}

# Función para copiar de local mirror a bóveda remota de forma segura y UTF-8
function Sync-Files {
    param(
        [string]$Source,
        [string]$Destination
    )
    
    Get-ChildItem -Path $Source -File | ForEach-Object {
        $destFile = Join-Path $Destination $_.Name
        # Copiar forzado
        Copy-Item -Path $_.FullName -Destination $destFile -Force
    }
}

# Ejecutar sincronización física de archivos
Sync-Files -Source $localPath -Destination $vaultPath

Write-Output "Sincronización de carpetas de Obsidian completada con éxito en Windows PowerShell."
