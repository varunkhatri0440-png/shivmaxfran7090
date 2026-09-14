$ErrorActionPreference = "Stop"

$workspaceRoot = "C:\Users\mastermind\Desktop\dekstop  2 (11)\main frtnd"
$staging = Join-Path $env:TEMP "shivmax_staging"
$zipPath = Join-Path $workspaceRoot "shivmax-luxury-real-estate.zip"

Write-Host "1. Preparing staging directory..."
if (Test-Path $staging) {
    Remove-Item $staging -Recurse -Force
}
New-Item -ItemType Directory -Path $staging | Out-Null

Write-Host "2. Copying root files & configs..."
$rootFiles = @("package.json", "package-lock.json", "logo (1).svg")
foreach ($f in $rootFiles) {
    $src = Join-Path $workspaceRoot $f
    if (Test-Path $src) {
        Copy-Item $src -Destination $staging
    }
}

$githubDir = Join-Path $workspaceRoot ".github"
if (Test-Path $githubDir) {
    Copy-Item $githubDir -Destination (Join-Path $staging ".github") -Recurse
}

$scriptsDir = Join-Path $workspaceRoot "scripts"
if (Test-Path $scriptsDir) {
    Copy-Item $scriptsDir -Destination (Join-Path $staging "scripts") -Recurse
    # Remove make_zip.ps1 from the zip itself
    $stagedMakeZip = Join-Path (Join-Path $staging "scripts") "make_zip.ps1"
    if (Test-Path $stagedMakeZip) { Remove-Item $stagedMakeZip -Force }
}

Write-Host "3. Copying backend source code (excluding node_modules and dist)..."
$backendSrc = Join-Path $workspaceRoot "backend"
$backendDest = Join-Path $staging "backend"
& robocopy $backendSrc $backendDest /E /XD node_modules dist /NFL /NDL /NJH /NJS /nc /ns /np
# Robocopy exit code 1 means files successfully copied
if ($LASTEXITCODE -gt 7) {
    throw "Robocopy backend failed with exit code $LASTEXITCODE"
}

Write-Host "4. Copying frontend source code (excluding node_modules and .next)..."
$frontendSrc = Join-Path $workspaceRoot "frontend"
$frontendDest = Join-Path $staging "frontend"
& robocopy $frontendSrc $frontendDest /E /XD node_modules .next /NFL /NDL /NJH /NJS /nc /ns /np
if ($LASTEXITCODE -gt 7) {
    throw "Robocopy frontend failed with exit code $LASTEXITCODE"
}

Write-Host "5. Creating zip archive..."
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}
Compress-Archive -Path (Join-Path $staging "*") -DestinationPath $zipPath -CompressionLevel Optimal

Write-Host "6. Cleaning up staging..."
Remove-Item $staging -Recurse -Force

$item = Get-Item $zipPath
$sizeMB = [math]::Round($item.Length / 1MB, 2)
Write-Host "SUCCESS: Created $zipPath ($sizeMB MB)"
