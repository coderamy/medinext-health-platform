# MediNext - Start All Services Script
# Run this script to start all backend services

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MediNext Health-Tech Platform" -ForegroundColor Cyan
Write-Host "Starting all services..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Array of services with their directories and ports
$services = @(
    @{Name="Auth Service"; Path="packages/backend/auth-service"; Port=3001},
    @{Name="Patient Service"; Path="packages/backend/patient-service"; Port=3004},
    @{Name="Provider Service"; Path="packages/backend/provider-service"; Port=3005},
    @{Name="Hospital Service"; Path="packages/backend/hospital-service"; Port=3006},
    @{Name="Pharmacy Service"; Path="packages/backend/pharmacy-service"; Port=3007},
    @{Name="Lab Service"; Path="packages/backend/lab-service"; Port=3008},
    @{Name="Appointment Service"; Path="packages/backend/appointment-service"; Port=3009},
    @{Name="Blood Bank Service"; Path="packages/backend/blood-bank-service"; Port=3010},
    @{Name="Organ Donor Service"; Path="packages/backend/organ-donor-service"; Port=3011},
    @{Name="Insurance Service"; Path="packages/backend/insurance-service"; Port=3012},
    @{Name="Emergency Service"; Path="packages/backend/emergency-service"; Port=3013},
    @{Name="AI Service"; Path="packages/backend/ai-service"; Port=3014},
    @{Name="Notification Service"; Path="packages/backend/notification-service"; Port=3015},
    @{Name="API Gateway"; Path="packages/backend/api-gateway"; Port=3000}
)

# Start each service
foreach ($service in $services) {
    $serviceDir = Join-Path $PSScriptRoot $service.Path
    if (Test-Path $serviceDir) {
        Write-Host "Starting $($service.Name) on port $($service.Port)..." -ForegroundColor Green
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$serviceDir'; npm run start:dev" -WindowStyle Normal
    } else {
        Write-Host "Warning: Service directory not found: $serviceDir" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "All services started!" -ForegroundColor Green
Write-Host "API Gateway: http://localhost:3000" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
