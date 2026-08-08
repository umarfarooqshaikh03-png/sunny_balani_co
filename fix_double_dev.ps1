$files = @("index.html", "app.js", "robots.txt", "sitemap.xml")
$basePath = Resolve-Path .

foreach ($file in $files) {
    $filePath = Join-Path $basePath $file
    if (Test-Path $filePath) {
        $content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)
        $content = $content.Replace("https://casunnybalani.com/Dev/Dev/", "https://casunnybalani.com/Dev/")
        $content = $content.Replace("https://casunnybalani.com/Dev/Dev", "https://casunnybalani.com/Dev")
        [System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Fixed double /Dev/ in $file"
    }
}
