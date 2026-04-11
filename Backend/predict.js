const fs = require("fs");
const path = require("path");

// ================= INPUT =================
const temp = parseFloat(process.argv[2]);
const humidity = parseFloat(process.argv[3]);
const categoryInput = (process.argv[4] || "").trim().toLowerCase();

// ================= SAFE CHECK =================
if (isNaN(temp) || isNaN(humidity) || !categoryInput) {
  console.log(JSON.stringify({ error: "Invalid input" }));
  process.exit(0);
}

// ================= LOAD DATA (FIX IMPORTANT) =================
const filePath = path.join(__dirname, "tourist_places.json");
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

// ================= SCORE =================
filtered = filtered.map(item => ({
  ...item,
  score:
    Math.pow(item.avg_temp - temp, 2) +
    Math.pow(item.avg_humidity - humidity, 2),
}));

// ================= SORT =================
filtered.sort((a, b) => a.score - b.score);

// ================= OUTPUT =================
const result = filtered.slice(0, 5).map(item => ({
  city: item.city,
  state: item.state,
  category: item.category,
  avg_temp: item.avg_temp,
  avg_humidity: item.avg_humidity,
  latitude: item.latitude,
  longitude: item.longitude,
}));

console.log(JSON.stringify(result));