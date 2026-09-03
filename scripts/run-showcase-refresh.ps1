param(
  [switch]$SyncOnly,
  [switch]$ChangedOnly
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$runtimeDirectory = Join-Path $projectRoot "logs"
$lockPath = Join-Path $runtimeDirectory "showcase-refresh.lock"
$logPath = Join-Path $runtimeDirectory "showcase-refresh.log"

New-Item -ItemType Directory -Path $runtimeDirectory -Force | Out-Null

if (Test-Path -LiteralPath $lockPath) {
  $lockPid = Get-Content -LiteralPath $lockPath -ErrorAction SilentlyContinue | Select-Object -First 1
  $lockProcess = $null
  if ($lockPid -match '^\d+$') {
    $lockProcess = Get-Process -Id ([int]$lockPid) -ErrorAction SilentlyContinue
  }
  if ($null -ne $lockProcess) {
    Add-Content -LiteralPath $logPath -Value "[$(Get-Date -Format s)] Sar peste rulare: sincronizarea precedenta este activa (PID $lockPid)."
    exit 0
  }
  Add-Content -LiteralPath $logPath -Value "[$(Get-Date -Format s)] Elimin lock-ul ramas de la un proces inactiv."
  Remove-Item -LiteralPath $lockPath -Force
}

try {
  Set-Content -LiteralPath $lockPath -Value $PID
  Add-Content -LiteralPath $logPath -Value "`n[$(Get-Date -Format s)] Pornire actualizare completa."
  Push-Location $projectRoot
  try {
    if ($SyncOnly) {
      $syncArguments = @("run", "showcase:sync", "--", "--build", "--strict")
      if ($ChangedOnly) { $syncArguments += "--changed" }
      & npm.cmd @syncArguments *>> $logPath
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
