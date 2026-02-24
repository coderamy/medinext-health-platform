# MediNext Services Health Check Script
# Run this script to check health of all services

$services = @(
    @{ Name = "API Gateway"; Url = "http://localhost:3000/health" },
    @{ Name = "Auth Service"; Url = "http://localhost:3001/health" },
    @{ Name = "Patient Service"; Url = "http://localhost:3004/health" },
    @{ Name = "Provider Service"; Url = "http://localhost:3005/health" },
    @{ Name = "Hospital Service"; Url = "http://localhost:3006/health" },
    @{ Name = "Pharmacy Service"; Url = "http://localhost:3007/health" },
    @{ Name = "Lab Service"; Url = "http://localhost:3008/health" },
    @{ Name = "Appointment Service"; Url = "http://localhost:3009/health" },
    @{ Name = "Blood Bank Service"; Url = "http://localhost:3010/health" },
    @{ Name = "Organ Donor Service"; Url = "http://localhost:3011/health" },
    @{ Name = "Insurance Service"; Url = "http://localhost:3012/health" },
    @{ Name = "Emergency Service"; Url = "http://localhost:3013/health" },
    @{ Name = "AI Service"; Url = "http://localhost:3014/health" },
    @{ Name = "Notification Service"; Url = "http://localhost:3015/health" }
)

$results = @()
$upCount = 0
$downCount = 0

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  MediNext Services Health Check" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

foreach ($service in $services) {
    try {
        $startTime = Get-Date
        $response = Invoke-WebRequest -Uri $service.Url -Method Get -TimeoutSec 5 -ErrorAction Stop
        $endTime = Get-Date
        $responseTime = ($endTime - $startTime).TotalMilliseconds

        if ($response.StatusCode -eq 200) {
            $status = "UP"
            $color = "Green"
            $upCount++
        } else {
            $status = "DOWN"
            $color = "Red"
            $downCount++
        }

        Write-Host "[$status] $($service.Name) - ${responseTime}ms" -ForegroundColor $color
    }
    catch {
        $status = "DOWN"
        $color = "Red"
        $downCount++
        Write-Host "[$status] $($service.Name) - $($_.Exception.Message)" -ForegroundColor $color
    }
}

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  Summary: $upCount UP | $downCount DOWN" -ForegroundColor $(if ($downCount -eq 0) { "Green" } else { "Yellow" })
Write-Host "============================================`n" -ForegroundColor Cyan
