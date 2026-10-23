
import { Router } from "express";
import { mockUsers } from "../data/mockUsers.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/login", (req, res, next) => {
  const email =
    typeof req.body?.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";

  const password =
    typeof req.body?.password === "string"
      ? req.body.password
      : "";

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  if (!emailPattern.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Enter a valid email address.",
    });
  }

  if (password.length < 8 || password.length > 128) {
    return res.status(400).json({
      success: false,
      message: "Password must be between 8 and 128 characters.",
    });
  }

  const user = mockUsers.find(
    (item) => item.email === email && item.password === password
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  // Replace any previous session ID to reduce session fixation risk.
  req.session.regenerate((error) => {
    if (error) return next(error);

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    req.session.save((saveError) => {
      if (saveError) return next(saveError);

      return res.json({
        success: true,
        message: "Login successful.",
        user: req.session.user,
      });
    });
  });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({
    success: true,
    user: req.session.user,
  });
});

router.post("/logout", requireAuth, (req, res, next) => {
  req.session.destroy((error) => {
    if (error) return next(error);

    res.clearCookie("nexadesk.sid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res.json({
      success: true,
      message: "Logged out successfully.",
    });
  });
});

export default router;
