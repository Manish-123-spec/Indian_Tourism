import pandas as pd
import sys
import json

# ================= INPUT =================
temp = float(sys.argv[1])
humidity = float(sys.argv[2])
category_input = sys.argv[3].strip().lower()

# ================= LOAD DATA =================
df = pd.read_json("tourist_places.json")   # 👈 make sure your JSON has latitude & longitude fields

# ================= NORMALIZE CATEGORY =================
category_map = {
    "beach": "Beach",
    "mountain": "Hill Station",
    "hill station": "Hill Station",
    "city": "Urban",
    "urban": "Urban",
    "cultural": "Cultural",
    "historic": "Historic",
    "adventure": "Adventure"
}

category = category_map.get(category_input, "Beach")

# ================= FILTER =================
filtered_df = df[df["category"] == category]

if filtered_df.empty:
    print(json.dumps([]))
    sys.exit()

# ================= DISTANCE FORMULA =================
# simple Euclidean distance on temp & humidity
filtered_df["score"] = (
    (filtered_df["avg_temp"] - temp) ** 2 +
    (filtered_df["avg_humidity"] - humidity) ** 2
)

# ================= TOP 5 =================
top_places = filtered_df.sort_values(by="score").head(5)

# ================= OUTPUT =================
result = top_places[[
    "city", "state", "category", "avg_temp", "avg_humidity", "latitude", "longitude"
]].to_dict(orient="records")

print(json.dumps(result))