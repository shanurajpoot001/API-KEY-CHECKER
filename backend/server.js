import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { providers } from "./providers.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/check", async (req, res) => {
  const { key } = req.body;
  const provider = Object.keys(providers).find((p) => providers[p].detect(key));

  if (!provider) return res.json({ message: "❌ Unknown API Key format" });

  const cfg = providers[provider];
  try {
    const r = await fetch(cfg.url, { headers: cfg.header(key) });
    if (r.status === 200) return res.json({ message: `✅ ${provider} Key is Valid` });
    if (r.status === 401 || r.status === 403) return res.json({ message: `❌ ${provider} Key Invalid/Expired` });
    if (r.status === 429) return res.json({ message: `⚠️ ${provider} Key valid but quota exceeded` });
    return res.json({ message: `❌ ${provider} Error ${r.status}` });
  } catch (err) {
    return res.json({ message: `❌ Request Failed: ${err.message}` });
  }
});

app.listen(5000, () => console.log("✅ Server running at http://localhost:5000"));
