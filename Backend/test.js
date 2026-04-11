// test.js
import { PythonShell } from "python-shell";
import path from "path";

// Path to your Python prediction script
const predictScriptPath = path.join(process.cwd(), "predict.py");

// Sample test input
const testInput = {
  temp: 25,
  humidity: 50,
  category: "Adventure"
};

// PythonShell options
const options = {
  mode: "text",
   pythonPath: "pythonPath: C:\\Users\\sharm\\AppData\\Local\\Programs\\Python\\Python310\\python.exe",
  pythonOptions: ["-u"], // unbuffered output
  args: [testInput.temp, testInput.humidity, testInput.category]
};

// Run Python script
PythonShell.run(predictScriptPath, options, (err, results) => {
  if (err) {
    console.error("Python Error:", err);
    return;
  }

  console.log("Python script output:");
  console.log(results);

  try {
    const recommended = JSON.parse(results[results.length - 1]);
    console.log("Parsed Recommendations:");
    console.log(recommended);
  } catch (e) {
    console.error("JSON parse error:", e);
    console.log("Raw Python output:", results);
  }
});