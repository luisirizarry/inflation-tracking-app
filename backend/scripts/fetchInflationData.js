import axios from "axios";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;
const pool = new Pool(); // reads from DATABASE_URL or individual .env vars

const FRED_API_KEY = process.env.FRED_API_KEY;
const BASE_URL = "https://api.stlouisfed.org/fred/series/observations";
const START_DATE = "2023-01-01"; // adjust as needed

async function fetchDataForSeries(series_id) {
  const url = `${BASE_URL}?series_id=${series_id}&api_key=${FRED_API_KEY}&file_type=json&observation_start=${START_DATE}`;
  const res = await axios.get(url);
  return res.data.observations;
}

async function syncInflationData() {
  try {
    const { rows: trackedItems } = await pool.query(
      "SELECT id, name, series_id FROM tracked_items"
    );

    for (const item of trackedItems) {
      console.log(`Fetching data for ${item.name} (${item.series_id})...`);
      const observations = await fetchDataForSeries(item.series_id);

      for (const obs of observations) {
        const date = obs.date;
        const value = parseFloat(obs.value);

        // skip missing/invalid values
        if (isNaN(value)) continue;

        await pool.query(
          `INSERT INTO inflation_data (tracked_item_id, date, value)
           VALUES ($1, $2, $3)
           ON CONFLICT (tracked_item_id, date) DO NOTHING`,
          [item.id, date, value]
        );
      }

      console.log(`✓ Synced ${item.name}`);
    }

    console.log("✅ Inflation data sync complete");
    await pool.end();
  } catch (err) {
    console.error("❌ Error syncing data:", err);
    await pool.end();
    process.exit(1);
  }
}

syncInflationData();
