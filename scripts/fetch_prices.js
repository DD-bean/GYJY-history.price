const fs = require("fs");

const API_URL = "http://gyjy.xmonecode.com/api/public/retail-prices";
const HISTORY_FILE = "history.json";

async function main() {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
  }

  const priceData = await res.json();

  let history = [];

  if (fs.existsSync(HISTORY_FILE)) {
    const text = fs.readFileSync(HISTORY_FILE, "utf8").trim();
    history = text ? JSON.parse(text) : [];
  }

  history.push({
    recorded_at: new Date().toISOString(),
    source: API_URL,
    data: priceData
  });

  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));

  console.log(`Saved snapshot. Total records: ${history.length}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
