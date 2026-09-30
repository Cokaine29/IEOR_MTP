Write-Host "=================================================="
Write-Host "  STARTING FULL RL TRAINING PIPELINE"
Write-Host "=================================================="

Write-Host "`n[1/2] Starting DQN Full Training (500,000 steps)..."
& "d:\MTP\venv\Scripts\python.exe" "d:\MTP\simulation\agents\train_dqn.py" --full

Write-Host "`n[2/2] Starting MaskablePPO Full Training (1,000,000 steps)..."
& "d:\MTP\venv\Scripts\python.exe" "d:\MTP\simulation\agents\train_ppo.py" --full

Write-Host "`n=================================================="
Write-Host "  ALL TRAINING COMPLETE"
Write-Host "=================================================="
