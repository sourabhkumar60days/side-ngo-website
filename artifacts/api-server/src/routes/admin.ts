import { Router, type IRouter } from "express";

const router: IRouter = Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Side@admin2024";

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    (req.session as any).admin = { authenticated: true, username };
    res.json({ success: true, message: "Login successful" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, message: "Logged out" });
  });
});

router.get("/me", (req, res) => {
  const admin = (req.session as any).admin;
  if (admin && admin.authenticated) {
    res.json({ authenticated: true, username: admin.username });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

export default router;
