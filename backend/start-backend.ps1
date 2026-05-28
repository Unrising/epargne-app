$ErrorActionPreference = "Stop"

Set-Location $PSScriptRoot

if (-not (Test-Path ".env")) {
  Write-Host "Attention: aucun fichier .env trouve dans backend. Prisma aura besoin de DATABASE_URL."
}

npm.cmd run dev
