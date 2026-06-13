# ==========================================================================
# Sri Vaari Seva - Lightweight PowerShell Web Server
# Hosts the website locally on http://localhost:8080
# ==========================================================================

$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Host "============================================="
    Write-Host " Divine Web Server is Running Successfully! "
    Write-Host " Open your browser and go to: "
    Write-Host " http://localhost:$port/ "
    Write-Host "============================================="
    Write-Host "Press Ctrl+C in this terminal window to stop."

    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response

            $urlPath = $request.Url.LocalPath
            if ($urlPath -eq "/") {
                $urlPath = "/index.html"
            }
            
            # Build local file path
            $filePath = Join-Path (Get-Location) $urlPath

            if (Test-Path $filePath -PathType Leaf) {
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                
                # Identify MIME types
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                switch ($ext) {
                    ".html" { $contentType = "text/html" }
                    ".htm"  { $contentType = "text/html" }
                    ".css"  { $contentType = "text/css" }
                    ".js"   { $contentType = "application/javascript" }
                    ".png"  { $contentType = "image/png" }
                    ".jpg"  { $contentType = "image/jpeg" }
                    ".jpeg" { $contentType = "image/jpeg" }
                    ".svg"  { $contentType = "image/svg+xml" }
                    ".json" { $contentType = "application/json" }
                    default { $contentType = "text/plain" }
                }

                $response.ContentType = $contentType
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $response.StatusCode = 404
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 File Not Found: $urlPath")
                $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
            }
            $response.Close()
        } catch {
            Write-Host "Error processing request: $_"
            if ($response) {
                try { $response.Close() } catch {}
            }
        }
    }
} catch {
    Write-Host "Error starting web server: $_"
} finally {
    $listener.Stop()
}
