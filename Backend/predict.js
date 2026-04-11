const fs = require("fs");

// ================= INPUT =================
const temp = parseFloat(process.argv[2]);
const humidity = parseFloat(process.argv[3]);
const categoryInput = process.argv[4].trim().toLowerCase();

// ================= LOAD DATA =================
const df = JSON.parse(fs.readFileSync("tourist_places.json", "utf-8"));

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

// normalize category
const category = categoryMap[categoryInput] || "Beach";

// ================= FILTER =================
let filtered = df.filter(item => item.category === category);

if (filtered.length === 0) {
  console.log(JSON.stringify([]));
  process.exit(0);
}

// ================= SCORE CALCULATION =================
filtered = filtered.map(item => {
  const score =
    Math.pow(item.avg_temp - temp, 2) +
    Math.pow(item.avg_humidity - humidity, 2);

  return { ...item, score };
});

// ================= SORT + TOP 5 =================
filtered.sort((a, b) => a.score - b.score);

const topPlaces = filtered.slice(0, 5);

// ================= OUTPUT =================
const result = topPlaces.map(item => ({
  city: item.city,
  state: item.state,
  category: item.category,
  avg_temp: item.avg_temp,
  avg_humidity: item.avg_humidity,
  latitude: item.latitude,
  longitude: item.longitude,
}));

console.log(JSON.stringify(result));