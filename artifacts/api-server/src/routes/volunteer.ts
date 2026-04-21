import { Router, type IRouter } from "express";
import { sendVolunteerNotification, sendVolunteerConfirmation } from "../email.js";

const router: IRouter = Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, area, message } = req.body ?? {};
    if (!name || !email || !phone || !area || !message) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }
    if (!email.includes("@")) {
      res.status(400).json({ error: "Invalid email address" });
      return;
    }
    res.status(200).json({ success: true, message: "Application received" });

    sendVolunteerNotification({ name, email, phone, area, message }).catch(e =>
      req.log.warn({ err: e }, "Volunteer notification to admin failed (non-fatal)")
    );
    sendVolunteerConfirmation({ name, email, phone, area, message }).catch(e =>
      req.log.warn({ err: e }, "Volunteer confirmation to applicant failed (non-fatal)")
    );
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to process application" });
  }
});

export default router;
