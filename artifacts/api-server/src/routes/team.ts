import { Router, type IRouter } from "express";
import { db, teamMembersTable, insertTeamMemberSchema } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { deleteCloudinaryImages } from "../cloudinaryService.js";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const members = await db.select().from(teamMembersTable).orderBy(asc(teamMembersTable.order));
    res.json(members);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch team members" });
  }
});

router.post("/", async (req, res) => {
  try {
    const parsed = insertTeamMemberSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid team member data", details: parsed.error });
      return;
    }
    const [member] = await db.insert(teamMembersTable).values(parsed.data).returning();
    res.status(201).json(member);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create team member" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const parsed = insertTeamMemberSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid team member data", details: parsed.error });
      return;
    }

    const [existing] = await db.select().from(teamMembersTable).where(eq(teamMembersTable.id, id));
    if (!existing) {
      res.status(404).json({ error: "Team member not found" });
      return;
    }

    const oldPhoto = existing.photoUrl || "";
    const newPhoto = parsed.data.photoUrl || "";
    if (oldPhoto && oldPhoto !== newPhoto) {
      await deleteCloudinaryImages([oldPhoto]);
    }

    const [member] = await db.update(teamMembersTable).set(parsed.data).where(eq(teamMembersTable.id, id)).returning();
    res.json(member);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to update team member" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [existing] = await db.select().from(teamMembersTable).where(eq(teamMembersTable.id, id));
    if (existing?.photoUrl) {
      await deleteCloudinaryImages([existing.photoUrl]);
    }
    await db.delete(teamMembersTable).where(eq(teamMembersTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to delete team member" });
  }
});

export default router;
