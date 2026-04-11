import fs from "fs";
import path from "path";

// ================= INPUT =================
const temp = parseFloat(process.argv[2]);
const humidity = parseFloat(process.argv[3]);
const categoryInput = (process.argv[4] || "").trim().toLowerCase();

if (isNaN(temp) || isNaN(humidity) || !categoryInput) {
  console.log(JSON.stringify({ error: "Invalid input" }));
  process.exit(0);
}

// ================= LOAD DATA =================
const filePath = path.join(process.cwd(), "tourist_places.json");
const df = JSON.parse(fs.readFileSync(filePath, "utf-8"));

// ================= CATEGORY MAP =================
const categoryMap = {
  beach: "Beach",
  "hill station": "Hill Station",
  mountain: "Hill Station",
  city: "Urban",
  urban: "Urban",
  cultural: "Cultural",
  historic: "Historic",
  adventure: "Adventure",
};

const category = categoryMap[categoryInput] || "Beach";

// ================= STEP 1: FILTER CATEGORY =================
let filtered = df.filter(item => item.category === category);

// ================= STEP 2: HARD WEATHER FILTER =================
filtered = filtered.filter(item => {
  const tempDiff = Math.abs(item.avg_temp - temp);
  const humidityDiff = Math.abs(item.avg_humidity - humidity);

  return tempDiff <= 15 && humidityDiff <= 25;
});

// If nothing left → relax filter slightly
if (filtered.length === 0) {
  filtered = df.filter(item => item.category === category);
}

// ================= STEP 3: SCORING =================
function score(item) {
  const tempDiff = Math.abs(item.avg_temp - temp);
  const humidityDiff = Math.abs(item.avg_humidity - humidity);

  return tempDiff * 0.6 + humidityDiff * 0.4;
}

// ================= APPLY SCORE =================
const result = filtered.map(item => ({
  city: item.city,
  state: item.state,
  category: item.category,
  avg_temp: item.avg_temp,
  avg_humidity: item.avg_humidity,
  latitude: item.latitude,
  longitude: item.longitude,
  score: score(item)
}));

// ================= SORT =================
result.sort((a, b) => a.score - b.score);

// ================= TOP 5 =================
console.log(JSON.stringify(result.slice(0, 5)));