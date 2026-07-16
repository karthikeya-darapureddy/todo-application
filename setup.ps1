# =====================================================================
# setup.ps1  — TaskFlow One-Click Setup Script
# Downloads portable Node.js if not present, installs all deps,
# and starts both the backend (Express) and frontend (Next.js).
# =====================================================================

$ErrorActionPreference = "Stop"
$root   = $PSScriptRoot
$binDir = Join-Path $root ".node_bin"
$nodeExe = Join-Path $binDir "node.exe"
$npmCmd  = Join-Path $binDir "npm.cmd"

# ---- Colour helpers ------------------------------------------------
function Write-Ok  ($msg) { Write-Host "  [OK]  $msg" -ForegroundColor Green  }
function Write-Info($msg) { Write-Host "  [..] $msg"  -ForegroundColor Cyan   }
function Write-Err ($msg) { Write-Host "  [!!] $msg"  -ForegroundColor Red    }

Write-Host ""
Write-Host "  ████████╗ █████╗ ███████╗██╗  ██╗███████╗██╗      ██████╗ ██╗    ██╗" -ForegroundColor Magenta
Write-Host "     ██╔══╝██╔══██╗██╔════╝██║ ██╔╝██╔════╝██║     ██╔═══██╗██║    ██║" -ForegroundColor Magenta
Write-Host "     ██║   ███████║███████╗█████╔╝ █████╗  ██║     ██║   ██║██║ █╗ ██║" -ForegroundColor Magenta
Write-Host "     ██║   ██╔══██║╚════██║██╔═██╗ ██╔══╝  ██║     ██║   ██║██║███╗██║" -ForegroundColor Magenta
Write-Host "     ██║   ██║  ██║███████║██║  ██╗██║     ███████╗╚██████╔╝╚███╔███╔╝" -ForegroundColor Magenta
Write-Host "     ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝ " -ForegroundColor Magenta
Write-Host ""
Write-Host "  Task Management App — Setup Script" -ForegroundColor White
Write-Host "  =====================================" -ForegroundColor DarkGray
Write-Host ""

# ---- 1. Check / Install Node.js -------------------------------------
$systemNode = $null
try { $systemNode = (Get-Command node -ErrorAction SilentlyContinue).Source } catch {}

if ($systemNode) {
  Write-Ok "System Node.js found at: $systemNode"
  $env:PATH = [System.IO.Path]::GetDirectoryName($systemNode) + ";" + $env:PATH
} elseif (Test-Path $nodeExe) {
  Write-Ok "Portable Node.js found at: $nodeExe"
  $env:PATH = $binDir + ";" + $env:PATH
} else {
  Write-Info "Node.js not found. Downloading portable Node.js v20.11.0..."
  $zipUrl  = "https://nodejs.org/dist/v20.11.0/node-v20.11.0-win-x64.zip"
  $zipPath = Join-Path $env:TEMP "node-portable.zip"
  $extractDir = Join-Path $env:TEMP "node-portable"
  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

  try {
    Invoke-WebRequest -Uri $zipUrl -OutFile $zipPath -UseBasicParsing
    Write-Ok "Downloaded Node.js zip."

    Expand-Archive -Path $zipPath -DestinationPath $extractDir -Force
    $nodeFolder = Get-ChildItem $extractDir -Directory | Select-Object -First 1
    if (Test-Path $binDir) { Remove-Item $binDir -Recurse -Force }
    Move-Item $nodeFolder.FullName $binDir
    Write-Ok "Extracted Node.js to .node_bin/"

    $env:PATH = $binDir + ";" + $env:PATH
    Remove-Item $zipPath -Force
    Remove-Item $extractDir -Recurse -Force -ErrorAction SilentlyContinue
  } catch {
    Write-Err "Failed to download Node.js automatically."
    Write-Err "Please install Node.js manually from https://nodejs.org (v18+), then re-run this script."
    exit 1
  }
}

$nodeVersion = & node -v 2>&1
Write-Ok "Node version: $nodeVersion"
$npmVersion  = & npm -v 2>&1
Write-Ok "npm version:  $npmVersion"

# ---- 2. Create .env if missing --------------------------------------
$serverEnv = Join-Path $root "server\.env"
if (-not (Test-Path $serverEnv)) {
  Write-Info "Creating server/.env from template..."
  Copy-Item (Join-Path $root "server\.env.example") $serverEnv
  Write-Ok "server/.env created. Edit it to add optional email/cloud config."
}

# ---- 3. Install server dependencies ---------------------------------
Write-Info "Installing backend dependencies..."
Set-Location (Join-Path $root "server")
& npm install --silent
Write-Ok "Backend dependencies installed."

# ---- 4. Install client dependencies ---------------------------------
Write-Info "Installing frontend dependencies..."
Set-Location (Join-Path $root "client")
& npm install --silent
Write-Ok "Frontend dependencies installed."

Set-Location $root

# ---- 5. Launch both servers -----------------------------------------
Write-Host ""
Write-Host "  Starting TaskFlow..." -ForegroundColor Yellow
Write-Host "  Backend  → http://localhost:5000" -ForegroundColor Cyan
Write-Host "  Frontend → http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Press Ctrl+C to stop." -ForegroundColor DarkGray
Write-Host ""

# Start backend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "
  `$env:PATH = '$binDir;' + `$env:PATH;
  Set-Location '$root\server';
  Write-Host ' Backend starting...' -ForegroundColor Cyan;
  node server.js
" -WindowStyle Normal

Start-Sleep -Seconds 2

# Start frontend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "
  `$env:PATH = '$binDir;' + `$env:PATH;
  Set-Location '$root\client';
  Write-Host ' Frontend starting...' -ForegroundColor Magenta;
  npm run dev
" -WindowStyle Normal

Write-Ok "Both servers launched in separate windows."
Write-Host ""
Write-Host "  Open your browser at http://localhost:3000" -ForegroundColor Green
Write-Host ""
