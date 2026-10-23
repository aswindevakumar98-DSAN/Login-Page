
export function requireAuth(req, res, next) {
  if (!req.session?.user) {
    return res.status(401).json({
      success: false,
      message: "Please log in to access this resource.",
    });
  }

  next();
}
