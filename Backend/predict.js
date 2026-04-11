import fs from "fs";
import path from "path";

// ================= INPUT =================
const temp = parseFloat(process.argv[2]);
const humidity = parseFloat(process.argv[3]);
const categoryInput = (process.argv[4] || "").trim().toLowerCase();

// ================= VALIDATION =================
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

// ================= FILTER =================
let filtered = df.filter(item => item.category === category);

if (filtered.length === 0) {
  console.log(JSON.stringify([]));
  process.exit(0);
}

// ================= SCORING ENGINE =================
filtered = filtered.map(item => {
  // normalize differences
  const tempDiff = Math.abs(item.avg_temp - temp) / 50;
  const humidityDiff = Math.abs(item.avg_humidity - humidity) / 100;

  // category penalty
  const categoryPenalty = item.category === category ? 0 : 1;

  // weather boost (smart logic)
  let weatherBoost = 0;

  if (temp > 35 && item.category === "Beach") weatherBoost = -0.3;
  if (temp < 15 && item.category === "Hill Station") weatherBoost = -0.3;

  // FINAL SCORE
  const score =
    (tempDiff * 0.5) +
    (humidityDiff * 0.3) +
    (categoryPenalty * 0.2) +
    weatherBoost;

  return {
    city: item.city,
    state: item.state,
    category: item.category,
    avg_temp: item.avg_temp,
    avg_humidity: item.avg_humidity,
    latitude: item.latitude,
    longitude: item.longitude,
    score
  };
});

// ================= SORT =================
filtered.sort((a, b) => a.score - b.score);

// ================= TOP RESULTS =================
const topPlaces = filtered.slice(0, 5);

// ================= OUTPUT =================
console.log(JSON.stringify(topPlaces));