const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let entries = []; // in-memory store

app.post("/api/entry", (req, res) => {
  const { date, mood } = req.body;
  const existing = entries.find((e) => e.date === date);
  if (existing) {
    existing.mood = mood;
  } else {
    entries.push({ date, mood });
  }
  res.json({ success: true });
});

app.post("/api/entry", (req, res) => {
  const { date, mood, period } = req.body;
  db[date] = { mood, period };
  res.status(200).send();
});

app.get("/api/entry", (req, res) => {
  const { month } = req.query; // format: YYYY-MM
  if (!month) return res.json(entries);
  const filtered = entries.filter((e) => e.date.startsWith(month));
  res.json(filtered);
});

app.listen(3000, () => {
  console.log("✅ Backend running on http://localhost:3000");
});
