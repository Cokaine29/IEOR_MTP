# MTP — Dynamic AGV Scheduling in Automated Container Terminals

## Project Structure

```
MTP/
├── venv/                   ← Python virtual environment
├── simulation/             ← Core Python simulation + RL
│   ├── core/               ← Entity classes (Terminal, AGV, QC, Lane)
│   ├── envs/               ← Gymnasium environment wrapper
│   ├── agents/             ← PPO, DQN agents
│   ├── baselines/          ← Greedy, GA, MIP implementations
│   ├── utils/              ← Helpers, logging, plotting
│   ├── configs/            ← config.yaml (simulation parameters)
│   ├── experiments/        ← Experiment runner scripts
│   ├── notebooks/          ← Jupyter analysis notebooks
│   └── requirements.txt
├── backend/                ← FastAPI WebSocket server
├── frontend/               ← Next.js digital twin dashboard
└── Literature/             ← Academic papers (PDF)
```

## Quick Start

```bash
# Activate environment
.\venv\Scripts\activate      # Windows

# Install dependencies
pip install -r simulation/requirements.txt

# Run a quick env test (after Phase 1)
python simulation/envs/test_env.py

# Start backend API (after Phase 6)
uvicorn backend.main:app --reload

# Start frontend (after Phase 6)
cd frontend && npm run dev
```

## Phase Progress

- [x] Phase 0: Foundation & Literature Lock-In
- [ ] Phase 1: Simulation Environment — Core Engine
- [ ] Phase 2: Gymnasium Wrapper & RL Interface
- [ ] Phase 3: Baselines & Problem Demonstration
- [ ] Phase 4: PPO Agent Training
- [ ] Phase 5: Comparative Evaluation
- [ ] Phase 6: Digital Twin Dashboard
- [ ] Phase 7: Hardware Demo (optional)
- [ ] Phase 8: Thesis Writing

## Key Files

| File | Purpose |
|---|---|
| `simulation/configs/config.yaml` | All simulation parameters (literature-sourced) |
| `simulation/core/terminal.py` | Terminal layout and entity management |
| `simulation/core/agv.py` | AGV entity with 5-state status machine |
| `simulation/core/qc.py` | Quay Crane entity |
| `simulation/envs/terminal_env.py` | Gymnasium environment |
| `simulation/agents/ppo_agent.py` | PPO training script |
| `simulation/baselines/greedy.py` | Greedy dispatcher |
| `backend/main.py` | FastAPI WebSocket server |
