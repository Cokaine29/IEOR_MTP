import json
with open("simulation/replays/greedy_replay.json") as f:
    data = json.load(f)

for frame in data["frames"][::100]:
    blocked = sum(1 for a in frame["agvs"] if a["is_blocked"])
    t = frame["time"]
    statuses = {}
    for a in frame["agvs"]:
        s = a["status"]
        statuses[s] = statuses.get(s, 0) + 1
    print("t=%5.0f  blocked=%d  %s" % (t, blocked, statuses))

print()
last = data["frames"][-1]
for a in last["agvs"]:
    print("AGV %d: node=n%d pos=(%.1f,%.1f) %s blocked=%s" % (
        a["id"], a["current_node"], a["x"], a["y"], a["status"], a["is_blocked"]))
