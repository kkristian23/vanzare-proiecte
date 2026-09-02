$ErrorActionPreference = "Stop"

$taskName = "MONO-DEV Showcase Refresh"
$runnerPath = Join-Path $PSScriptRoot "run-showcase-refresh.ps1"
$startAt = (Get-Date).AddMinutes(1)

$action = New-ScheduledTaskAction `
  -Execute "powershell.exe" `
  -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$runnerPath`""
$trigger = New-ScheduledTaskTrigger `
  -Once `
  -At $startAt `
  -RepetitionInterval (New-TimeSpan -Hours 1) `
  -RepetitionDuration (New-TimeSpan -Days 3650)
$settings = New-ScheduledTaskSettingsSet `
  -MultipleInstances IgnoreNew `
  -StartWhenAvailable `
  -ExecutionTimeLimit (New-TimeSpan -Hours 4)
$principal = New-ScheduledTaskPrincipal `
  -UserId ([System.Security.Principal.WindowsIdentity]::GetCurrent().Name) `
  -LogonType Interactive `
  -RunLevel Limited

Register-ScheduledTask `
  -TaskName $taskName `
  -Action $action `
  -Trigger $trigger `
  -Settings $settings `
  -Principal $principal `
  -Description "Reconstruieste proiectele, le sincronizeaza in catalog si reconstruieste site-ul la fiecare ora." `
  -Force | Out-Null

Write-Output "Sarcina '$taskName' a fost instalata. Prima rulare: $startAt; apoi la fiecare ora."
