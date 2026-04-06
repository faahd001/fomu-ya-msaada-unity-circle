import express from "express";
import { createServer as createViteServer } from "vite";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize SQLite database
  const db = await open({
    filename: "unity_circle.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS msaada_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      jina_kamili TEXT NOT NULL,
      aina_tatizo TEXT NOT NULL,
      maelezo TEXT NOT NULL,
      kiasi REAL,
      tarehe_tukio TEXT,
      ushahidi TEXT,
      mawasiliano TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // API routes FIRST
  app.post("/api/submit", async (req, res) => {
    try {
      const {
        jina_kamili,
        aina_tatizo,
        maelezo,
        kiasi,
        tarehe_tukio,
        ushahidi,
        mawasiliano,
      } = req.body;

      const result = await db.run(
        `INSERT INTO msaada_requests (jina_kamili, aina_tatizo, maelezo, kiasi, tarehe_tukio, ushahidi, mawasiliano) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [jina_kamili, aina_tatizo, maelezo, kiasi, tarehe_tukio, ushahidi, mawasiliano]
      );

      res.json({ success: true, id: result.lastID });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Kuna tatizo kwenye kuhifadhi taarifa." });
    }
  });

  app.get("/api/requests", async (req, res) => {
    try {
      const requests = await db.all("SELECT * FROM msaada_requests ORDER BY created_at DESC");
      res.json(requests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Kuna tatizo kwenye kupata taarifa." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on http://localhost:" + PORT);
  });
}

startServer();
