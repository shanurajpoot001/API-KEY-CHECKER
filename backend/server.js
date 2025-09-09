import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { providers } from "./providers.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/check", async (req, res) => {
  const { key } = req.body;

  // Validate key presence
  if (!key) return res.status(400).json({ message: "❌ API Key is required" });

  const provider = Object.keys(providers).find((p) => providers[p].detect(key));
  if (!provider) return res.json({ message: "❌ Unknown API Key format" });

  const cfg = providers[provider];

  try {
    const r = await fetch(cfg.url, { headers: cfg.header(key) });

    if (r.ok) {
      return res.json({ message: `✅ ${provider} Key is Valid` });
    } else if (r.status === 401 || r.status === 403) {
      return res.json({ message: `❌ ${provider} Key Invalid/Expired` });
    } else if (r.status === 429) {
      return res.json({ message: `⚠️ ${provider} Key valid but quota exceeded` });
    } else {
      // fetch returned non-200 status
      let text = await r.text().catch(() => "");
      return res.json({ message: `❌ ${provider} Error ${r.status} ${text}` });
    }
  } catch (err) {
    console.error("Fetch failed:", err);
    return res.status(500).json({ message: `❌ Request Failed: ${err.message}` });
  }
});

app.listen(5000, () => console.log("✅ Server running at http://localhost:5000"));
