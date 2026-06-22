param(
  [string]$OutputName = "SanhaoPuppy-Setup.exe"
)

$ErrorActionPreference = "Stop"

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$DistRoot = Join-Path $RepoRoot "dist"
$TempRoot = Join-Path ([System.IO.Path]::GetTempPath()) "sanhao-puppy-installer-build"

function Assert-ChildPath {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Parent
  )

  $fullPath = [System.IO.Path]::GetFullPath($Path)
  $fullParent = [System.IO.Path]::GetFullPath($Parent).TrimEnd("\") + "\"
  if (-not $fullPath.StartsWith($fullParent, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to operate outside expected directory: $fullPath"
  }
}

function New-IcoFromPng {
  param(
    [Parameter(Mandatory = $true)][string]$PngPath,
    [Parameter(Mandatory = $true)][string]$IcoPath
  )

  Add-Type -AssemblyName System.Drawing
  $source = [System.Drawing.Image]::FromFile($PngPath)
  try {
    $bitmap = New-Object System.Drawing.Bitmap 256, 256
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    try {
      $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $graphics.Clear([System.Drawing.Color]::Transparent)
      $graphics.DrawImage($source, 0, 0, 256, 256)

      $pngStream = New-Object System.IO.MemoryStream
      $bitmap.Save($pngStream, [System.Drawing.Imaging.ImageFormat]::Png)
      $pngBytes = $pngStream.ToArray()

      $icoStream = [System.IO.File]::Create($IcoPath)
      try {
        $writer = New-Object System.IO.BinaryWriter($icoStream)
        $writer.Write([UInt16]0)
        $writer.Write([UInt16]1)
        $writer.Write([UInt16]1)
        $writer.Write([byte]0)
        $writer.Write([byte]0)
        $writer.Write([byte]0)
        $writer.Write([byte]0)
        $writer.Write([UInt16]1)
        $writer.Write([UInt16]32)
        $writer.Write([UInt32]$pngBytes.Length)
        $writer.Write([UInt32]22)
        $writer.Write($pngBytes)
      }
      finally {
        if ($writer) { $writer.Dispose() }
        $icoStream.Dispose()
      }
    }
    finally {
      if ($pngStream) { $pngStream.Dispose() }
      $graphics.Dispose()
      $bitmap.Dispose()
    }
  }
  finally {
    $source.Dispose()
  }
}

New-Item -ItemType Directory -Force -Path $DistRoot | Out-Null

if (Test-Path -LiteralPath $TempRoot) {
  Assert-ChildPath -Path $TempRoot -Parent ([System.IO.Path]::GetTempPath())
  Remove-Item -LiteralPath $TempRoot -Recurse -Force
}

$PayloadRoot = Join-Path $TempRoot "payload"
$StagingRoot = Join-Path $TempRoot "staging"
New-Item -ItemType Directory -Force -Path $PayloadRoot, $StagingRoot | Out-Null

$rootFiles = @(
  "index.html",
  "styles.css",
  "manifest.webmanifest",
  "sw.js",
  "README.md"
)

foreach ($file in $rootFiles) {
  Copy-Item -LiteralPath (Join-Path $RepoRoot $file) -Destination (Join-Path $PayloadRoot $file) -Force
}

Copy-Item -LiteralPath (Join-Path $RepoRoot "src") -Destination (Join-Path $PayloadRoot "src") -Recurse -Force
Copy-Item -LiteralPath (Join-Path $RepoRoot "assets") -Destination (Join-Path $PayloadRoot "assets") -Recurse -Force

$appIcon = Join-Path $PayloadRoot "assets\icons\app.ico"
New-IcoFromPng -PngPath (Join-Path $PayloadRoot "assets\icons\icon-512.png") -IcoPath $appIcon

$payloadZip = Join-Path $StagingRoot "sanhao-puppy-app.zip"
Compress-Archive -Path (Join-Path $PayloadRoot "*") -DestinationPath $payloadZip -Force

$portableZip = Join-Path $DistRoot "SanhaoPuppy-Windows-App.zip"
Copy-Item -LiteralPath $payloadZip -Destination $portableZip -Force

$launcherScript = @'
$ErrorActionPreference = "Stop"

$appRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$indexPath = Join-Path $appRoot "app\index.html"

if (-not (Test-Path -LiteralPath $indexPath)) {
  Add-Type -AssemblyName PresentationFramework
  [System.Windows.MessageBox]::Show("Sanhao Puppy app files were not found. Please reinstall.", "Sanhao Puppy") | Out-Null
  exit 1
}

$appUrl = (New-Object System.Uri((Resolve-Path -LiteralPath $indexPath).Path)).AbsoluteUri
$profileDir = Join-Path $appRoot "browser-profile"
New-Item -ItemType Directory -Force -Path $profileDir | Out-Null

$browserCandidates = @(
  (Join-Path ${env:ProgramFiles(x86)} "Microsoft\Edge\Application\msedge.exe"),
  (Join-Path $env:ProgramFiles "Microsoft\Edge\Application\msedge.exe"),
  (Join-Path ${env:ProgramFiles(x86)} "Google\Chrome\Application\chrome.exe"),
  (Join-Path $env:ProgramFiles "Google\Chrome\Application\chrome.exe")
) | Where-Object { $_ -and (Test-Path -LiteralPath $_) }

if ($browserCandidates.Count -gt 0) {
  Start-Process -FilePath $browserCandidates[0] -ArgumentList @("--app=$appUrl", "--user-data-dir=$profileDir")
}
else {
  Start-Process $appUrl
}
'@

$uninstallScript = @'
$ErrorActionPreference = "Stop"

$appRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$startMenuDir = Join-Path $env:APPDATA "Microsoft\Windows\Start Menu\Programs\Sanhao Puppy"
$desktopShortcut = Join-Path ([Environment]::GetFolderPath("Desktop")) "Sanhao Puppy.lnk"

Remove-Item -LiteralPath $desktopShortcut -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $startMenuDir -Recurse -Force -ErrorAction SilentlyContinue

$cleanup = Join-Path $env:TEMP ("sanhao-puppy-uninstall-" + [guid]::NewGuid().ToString("N") + ".ps1")
$escapedAppRoot = $appRoot.Replace("'", "''")
@"
Start-Sleep -Seconds 1
Remove-Item -LiteralPath '$escapedAppRoot' -Recurse -Force -ErrorAction SilentlyContinue
"@ | Set-Content -LiteralPath $cleanup -Encoding UTF8

Start-Process -FilePath powershell.exe -ArgumentList @("-NoProfile", "-ExecutionPolicy", "Bypass", "-File", $cleanup) -WindowStyle Hidden
'@

$installScript = @'
$ErrorActionPreference = "Stop"

$sourceDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$zipPath = Join-Path $sourceDir "sanhao-puppy-app.zip"
$appRoot = Join-Path $env:LOCALAPPDATA "SanhaoPuppy"
$appDir = Join-Path $appRoot "app"
$launcherPath = Join-Path $appRoot "Launch-SanhaoPuppy.ps1"
$uninstallPath = Join-Path $appRoot "Uninstall-SanhaoPuppy.ps1"

if (-not (Test-Path -LiteralPath $zipPath)) {
  throw "Missing application payload: $zipPath"
}

New-Item -ItemType Directory -Force -Path $appRoot | Out-Null
if (Test-Path -LiteralPath $appDir) {
  Remove-Item -LiteralPath $appDir -Recurse -Force
}

Expand-Archive -LiteralPath $zipPath -DestinationPath $appDir -Force
Copy-Item -LiteralPath (Join-Path $sourceDir "Launch-SanhaoPuppy.ps1") -Destination $launcherPath -Force
Copy-Item -LiteralPath (Join-Path $sourceDir "Uninstall-SanhaoPuppy.ps1") -Destination $uninstallPath -Force

$startMenuDir = Join-Path $env:APPDATA "Microsoft\Windows\Start Menu\Programs\Sanhao Puppy"
New-Item -ItemType Directory -Force -Path $startMenuDir | Out-Null

$desktopShortcut = Join-Path ([Environment]::GetFolderPath("Desktop")) "Sanhao Puppy.lnk"
$startShortcut = Join-Path $startMenuDir "Sanhao Puppy.lnk"
$uninstallShortcut = Join-Path $startMenuDir "Uninstall Sanhao Puppy.lnk"
$powershellPath = Join-Path $env:SystemRoot "System32\WindowsPowerShell\v1.0\powershell.exe"
$iconPath = Join-Path $appDir "assets\icons\app.ico"

$shell = New-Object -ComObject WScript.Shell

foreach ($shortcutPath in @($desktopShortcut, $startShortcut)) {
  $shortcut = $shell.CreateShortcut($shortcutPath)
  $shortcut.TargetPath = $powershellPath
  $shortcut.Arguments = "-NoProfile -ExecutionPolicy Bypass -File `"$launcherPath`""
  $shortcut.WorkingDirectory = $appRoot
  if (Test-Path -LiteralPath $iconPath) {
    $shortcut.IconLocation = $iconPath
  }
  $shortcut.Save()
}

$uninstallShortcutObject = $shell.CreateShortcut($uninstallShortcut)
$uninstallShortcutObject.TargetPath = $powershellPath
$uninstallShortcutObject.Arguments = "-NoProfile -ExecutionPolicy Bypass -File `"$uninstallPath`""
$uninstallShortcutObject.WorkingDirectory = $appRoot
$uninstallShortcutObject.Save()

Write-Host "Sanhao Puppy has been installed."
'@

Set-Content -LiteralPath (Join-Path $StagingRoot "Launch-SanhaoPuppy.ps1") -Value $launcherScript -Encoding UTF8
Set-Content -LiteralPath (Join-Path $StagingRoot "Uninstall-SanhaoPuppy.ps1") -Value $uninstallScript -Encoding UTF8
Set-Content -LiteralPath (Join-Path $StagingRoot "install.ps1") -Value $installScript -Encoding UTF8
Set-Content -LiteralPath (Join-Path $StagingRoot "install.cmd") -Value "@echo off`r`npowershell.exe -NoProfile -ExecutionPolicy Bypass -File ""%~dp0install.ps1""`r`nexit /b %ERRORLEVEL%`r`n" -Encoding ASCII

foreach ($script in @("install.ps1", "Launch-SanhaoPuppy.ps1", "Uninstall-SanhaoPuppy.ps1")) {
  [scriptblock]::Create((Get-Content -Raw -Encoding UTF8 (Join-Path $StagingRoot $script))) | Out-Null
}

$setupTemp = Join-Path $TempRoot $OutputName
$sedPath = Join-Path $TempRoot "sanhao-puppy.sed"

$sedContent = @"
[Version]
Class=IEXPRESS
SEDVersion=3
[Options]
PackagePurpose=InstallApp
ShowInstallProgramWindow=1
HideExtractAnimation=1
UseLongFileName=1
InsideCompressed=0
CAB_FixedSize=0
CAB_ResvCodeSigning=0
RebootMode=N
InstallPrompt=%InstallPrompt%
DisplayLicense=
FinishMessage=%FinishMessage%
TargetName=%TargetName%
FriendlyName=%FriendlyName%
AppLaunched=%AppLaunched%
PostInstallCmd=<None>
AdminQuietInstCmd=
UserQuietInstCmd=
SourceFiles=SourceFiles
[Strings]
InstallPrompt=Install Sanhao Puppy for the current Windows user and create shortcuts.
FinishMessage=Sanhao Puppy has been installed. You can launch it from the desktop or Start Menu.
TargetName=$setupTemp
FriendlyName=Sanhao Puppy
AppLaunched=install.cmd
FILE0="install.cmd"
FILE1="install.ps1"
FILE2="Launch-SanhaoPuppy.ps1"
FILE3="Uninstall-SanhaoPuppy.ps1"
FILE4="sanhao-puppy-app.zip"
[SourceFiles]
SourceFiles0=$StagingRoot\
[SourceFiles0]
%FILE0%=
%FILE1%=
%FILE2%=
%FILE3%=
%FILE4%=
"@

Set-Content -LiteralPath $sedPath -Value $sedContent -Encoding ASCII

$iexpress = Join-Path $env:SystemRoot "System32\iexpress.exe"
if (-not (Test-Path -LiteralPath $iexpress)) {
  throw "iexpress.exe was not found on this Windows system."
}

& $iexpress /N /Q $sedPath | Out-Null

if (-not (Test-Path -LiteralPath $setupTemp)) {
  throw "Installer was not created: $setupTemp"
}

$setupFinal = Join-Path $DistRoot $OutputName
Copy-Item -LiteralPath $setupTemp -Destination $setupFinal -Force

Write-Host "Created installer: $setupFinal"
Write-Host "Created portable app zip: $portableZip"
