import { Router, type IRouter } from "express";
import { db, ordersTable, insertOrderSchema } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { sendOrderNotification, sendOrderConfirmation } from "../email.js";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const orders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));
    res.json(orders);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = { ...req.body, totalAmount: String(req.body.totalAmount ?? "") };
    const parsed = insertOrderSchema.safeParse(body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid order data", details: parsed.error });
      return;
    }
    const [order] = await db.insert(ordersTable).values({ ...parsed.data, status: "pending" }).returning();
    res.status(201).json(order);

    const orderPayload = { ...order, totalAmount: String(order.totalAmount) };
    sendOrderNotification(orderPayload).catch(e =>
      req.log.warn({ err: e }, "Order notification to admin failed (non-fatal)")
    );
    sendOrderConfirmation(orderPayload).catch(e =>
      req.log.warn({ err: e }, "Order confirmation to customer failed (non-fatal)")
    );
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body as { status: string };
    const validStatuses = ["pending", "confirmed", "processing", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: "Invalid status" });
      return;
    }
    const [updated] = await db.update(ordersTable).set({ status }).where(eq(ordersTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "Order not found" }); return; }
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to update order" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(ordersTable).where(eq(ordersTable.id, id));
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

export default router;
