param(
  [switch]$SyncOnly
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$runtimeDirectory = Join-Path $projectRoot "logs"
$lockPath = Join-Path $runtimeDirectory "showcase-refresh.lock"
$logPath = Join-Path $runtimeDirectory "showcase-refresh.log"

New-Item -ItemType Directory -Path $runtimeDirectory -Force | Out-Null

if (Test-Path -LiteralPath $lockPath) {
  $lockAge = (Get-Date) - (Get-Item -LiteralPath $lockPath).LastWriteTime
  if ($lockAge.TotalHours -lt 4) {
    Add-Content -LiteralPath $logPath -Value "[$(Get-Date -Format s)] Sar peste rulare: sincronizarea precedenta este activa."
    exit 0
  }
  Remove-Item -LiteralPath $lockPath -Force
}

try {
  Set-Content -LiteralPath $lockPath -Value $PID
  Add-Content -LiteralPath $logPath -Value "`n[$(Get-Date -Format s)] Pornire actualizare completa."
  Push-Location $projectRoot
  try {
    if ($SyncOnly) {
      & npm.cmd run showcase:sync -- --build --strict *>> $logPath
    } else {
      & npm.cmd run showcase:refresh *>> $logPath
    }
    if ($LASTEXITCODE -ne 0) {
      throw "Actualizarea a esuat cu codul $LASTEXITCODE."
    }
  } finally {
    Pop-Location
  }
  Add-Content -LiteralPath $logPath -Value "[$(Get-Date -Format s)] Actualizare finalizata$($(if ($SyncOnly) { ' (proiecte)' } else { ' (completa)' }))."
} catch {
  Add-Content -LiteralPath $logPath -Value "[$(Get-Date -Format s)] EROARE: $($_.Exception.Message)"
  exit 1
} finally {
  Remove-Item -LiteralPath $lockPath -Force -ErrorAction SilentlyContinue
}
