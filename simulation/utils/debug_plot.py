import json
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

with open("simulation/replays/greedy_replay.json", "r") as f:
    data = json.load(f)

min_y = 999
max_y = -999
for frame in data["frames"]:
    for agv in frame["agvs"]:
        min_y = min(min_y, agv["y"])
        max_y = max(max_y, agv["y"])

print(f"AGV Y range across ALL 1001 frames: min={min_y}, max={max_y}")
print(f"QC positions: {data['layout']['qc_positions']}")
print(f"Yard positions: {data['layout']['yard_positions']}")
