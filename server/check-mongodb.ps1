# MongoDB Status Checker
Write-Host "🔍 Checking MongoDB Installation..." -ForegroundColor Cyan
Write-Host ""

# Check if mongod is in PATH
$mongodPath = where.exe mongod 2>$null
if ($mongodPath) {
    Write-Host "✅ MongoDB found in PATH: $mongodPath" -ForegroundColor Green
} else {
    Write-Host "❌ MongoDB not found in PATH" -ForegroundColor Red
}

# Check for MongoDB in common installation locations
$commonPaths = @(
    "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe",
    "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe",
    "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
)

Write-Host ""
Write-Host "📁 Checking common installation paths..." -ForegroundColor Cyan
$foundPath = $null
foreach ($path in $commonPaths) {
    if (Test-Path $path) {
        Write-Host "✅ Found: $path" -ForegroundColor Green
        $foundPath = $path
        break
    }
}

if (-not $foundPath) {
    Write-Host "❌ MongoDB not found in common locations" -ForegroundColor Red
}

# Check if MongoDB is running as a process
Write-Host ""
Write-Host "🔄 Checking if MongoDB is running..." -ForegroundColor Cyan
$mongoProcess = Get-Process | Where-Object {$_.ProcessName -like "*mongod*"}
if ($mongoProcess) {
    Write-Host "✅ MongoDB is RUNNING (PID: $($mongoProcess.Id))" -ForegroundColor Green
} else {
    Write-Host "❌ MongoDB is NOT running" -ForegroundColor Red
}

# Check if MongoDB is running as a service
Write-Host ""
Write-Host "🔧 Checking MongoDB service..." -ForegroundColor Cyan
$mongoService = Get-Service | Where-Object {$_.DisplayName -like "*MongoDB*"}
if ($mongoService) {
    Write-Host "✅ MongoDB Service found: $($mongoService.DisplayName)" -ForegroundColor Green
    Write-Host "   Status: $($mongoService.Status)" -ForegroundColor Yellow
    
    if ($mongoService.Status -eq "Running") {
        Write-Host "   ✅ Service is RUNNING" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Service is STOPPED" -ForegroundColor Yellow
        Write-Host "   💡 Try: Start-Service $($mongoService.Name)" -ForegroundColor Cyan
    }
} else {
    Write-Host "❌ No MongoDB service found" -ForegroundColor Red
}

# Summary and recommendations
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White
Write-Host "📊 SUMMARY & RECOMMENDATIONS" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White
Write-Host ""

$mongoRunning = $mongoProcess -or ($mongoService -and $mongoService.Status -eq "Running")

if ($mongoRunning) {
    Write-Host "✅ MongoDB is READY!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. cd server directory" -ForegroundColor White
    Write-Host "2. npm run seed" -ForegroundColor White
    Write-Host "3. npm run dev" -ForegroundColor White
} else {
    Write-Host "⚠️  MongoDB is NOT running" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🎯 FASTEST SOLUTION: Use MongoDB Atlas (Cloud)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Option 1: MongoDB Atlas (RECOMMENDED - 5 minutes)" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White
    Write-Host "1. Visit: https://www.mongodb.com/cloud/atlas/register" -ForegroundColor White
    Write-Host "2. Create FREE account & cluster (M0 tier)" -ForegroundColor White
    Write-Host "3. Create database user & whitelist IP" -ForegroundColor White
    Write-Host "4. Get connection string" -ForegroundColor White
    Write-Host "5. Update server\.env file with connection string" -ForegroundColor White
    Write-Host "6. Run: npm run seed" -ForegroundColor White
    Write-Host ""
    Write-Host "See: MONGODB_SETUP.md for detailed steps" -ForegroundColor Cyan
    Write-Host ""
    
    if ($foundPath) {
        Write-Host "Option 2: Start Local MongoDB" -ForegroundColor Yellow
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White
        Write-Host "Run this command:" -ForegroundColor White
        Write-Host "& ""$foundPath"" --dbpath ""C:\data\db""" -ForegroundColor Cyan
    } elseif ($mongoService) {
        Write-Host "Option 2: Start MongoDB Service" -ForegroundColor Yellow
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White
        Write-Host "Run this command:" -ForegroundColor White
        Write-Host "Start-Service $($mongoService.Name)" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "📖 Documentation:" -ForegroundColor Cyan
Write-Host "   - QUICKSTART.md - Get running in 5 minutes" -ForegroundColor White
Write-Host "   - MONGODB_SETUP.md - MongoDB setup guide" -ForegroundColor White
Write-Host "   - README.md - Full documentation" -ForegroundColor White
Write-Host ""
