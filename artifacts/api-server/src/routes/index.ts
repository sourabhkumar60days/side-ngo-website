import { Router, type IRouter } from "express";
import healthRouter from "./health";
import eventsRouter from "./events";
import teamRouter from "./team";
import productsRouter from "./products";
import ordersRouter from "./orders";
import adminRouter from "./admin";
import settingsRouter from "./settings";
import volunteerRouter from "./volunteer";
import uploadRouter from "./upload";

const router: IRouter = Router(); // ✅ FIRST create router

// ✅ THEN use it
router.get("/ping", (req, res) => {
  res.send("pong");
});

router.use(healthRouter);
router.use("/events", eventsRouter);
router.use("/team", teamRouter);
router.use("/products", productsRouter);
router.use("/orders", ordersRouter);
router.use("/admin", adminRouter);
router.use("/settings", settingsRouter);
router.use("/volunteer", volunteerRouter);
router.use("/upload", uploadRouter);

export default router;
