Write-Host "Checking MongoDB Installation..." -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is running as a process
$mongoProcess = Get-Process | Where-Object {$_.ProcessName -like "*mongod*"}
if ($mongoProcess) {
    Write-Host "MongoDB is RUNNING" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. cd ""d:\Mosha Alert\server""" -ForegroundColor White
    Write-Host "2. npm run seed" -ForegroundColor White
    Write-Host "3. npm run dev" -ForegroundColor White
} else {
    Write-Host "MongoDB is NOT running" -ForegroundColor Red
    Write-Host ""
    Write-Host "RECOMMENDED: Use MongoDB Atlas (Cloud)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Step 1: Visit https://www.mongodb.com/cloud/atlas/register" -ForegroundColor White
    Write-Host "Step 2: Create FREE account and cluster" -ForegroundColor White
    Write-Host "Step 3: Create database user" -ForegroundColor White
    Write-Host "Step 4: Whitelist your IP (Allow from Anywhere)" -ForegroundColor White
    Write-Host "Step 5: Get connection string" -ForegroundColor White
    Write-Host "Step 6: Update server\.env file" -ForegroundColor White
    Write-Host ""
    Write-Host "See MONGODB_SETUP.md for detailed instructions" -ForegroundColor Cyan
}

Write-Host ""
