import { Router, type IRouter } from "express";
import { db, eventsTable, insertEventSchema } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { deleteCloudinaryImages } from "../cloudinaryService.js";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const events = await db.select().from(eventsTable).orderBy(desc(eventsTable.date));
    res.json(events);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const events = await db.select().from(eventsTable).where(eq(eventsTable.id, id));
    if (events.length === 0) {
      res.status(404).json({ error: "Event not found" });
      return;
    }
    res.json(events[0]);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

router.post("/", async (req, res) => {
  try {
    const parsed = insertEventSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid event data", details: parsed.error });
      return;
    }
    const [event] = await db.insert(eventsTable).values(parsed.data).returning();
    res.status(201).json(event);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create event" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const parsed = insertEventSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid event data", details: parsed.error });
      return;
    }

    const [existing] = await db.select().from(eventsTable).where(eq(eventsTable.id, id));
    if (!existing) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    const oldUrls = (existing.driveImageUrl || "").split(",").map(u => u.trim()).filter(Boolean);
    const newUrls = (parsed.data.driveImageUrl || "").split(",").map(u => u.trim()).filter(Boolean);
    const removedUrls = oldUrls.filter(u => !newUrls.includes(u));
    if (removedUrls.length > 0) {
      await deleteCloudinaryImages(removedUrls);
    }

    const [event] = await db.update(eventsTable).set(parsed.data).where(eq(eventsTable.id, id)).returning();
    res.json(event);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to update event" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [existing] = await db.select().from(eventsTable).where(eq(eventsTable.id, id));
    if (existing?.driveImageUrl) {
      await deleteCloudinaryImages(existing.driveImageUrl);
    }
    await db.delete(eventsTable).where(eq(eventsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

export default router;
