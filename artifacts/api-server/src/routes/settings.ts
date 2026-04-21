import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

async function ensureSettingsTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);
  const defaults = [
    { key: 'facebook_url', value: '' },
    { key: 'instagram_url', value: '' },
    { key: 'youtube_url', value: '' },
    { key: 'contact_email', value: 'sidevinayabhawan@gmail.com' },
    { key: 'contact_phone', value: '011-29957270' },
    { key: 'contact_address', value: '19/564 DDA Flats, Vinaya Bhawan, Madangir, New Delhi 110062' },
    { key: 'order_notification_email', value: '' },
    { key: 'volunteer_notification_email', value: '' },
  ];
  for (const d of defaults) {
    await db.execute(sql`INSERT INTO site_settings (key, value) VALUES (${d.key}, ${d.value}) ON CONFLICT (key) DO NOTHING`);
  }
}

router.get("/", async (req, res) => {
  try {
    await ensureSettingsTable();
    const rows = await db.execute(sql`SELECT key, value FROM site_settings`);
    const settings: Record<string, string> = {};
    for (const row of rows.rows as { key: string; value: string }[]) {
      settings[row.key] = row.value;
    }
    res.json(settings);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

router.put("/", async (req, res) => {
  try {
    await ensureSettingsTable();
    const updates = req.body as Record<string, string>;
    for (const [key, value] of Object.entries(updates)) {
      await db.execute(sql`INSERT INTO site_settings (key, value) VALUES (${key}, ${value}) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`);
    }
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to update settings" });
  }
});

export default router;
