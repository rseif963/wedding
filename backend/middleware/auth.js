import jwt from "jsonwebtoken";

/**
 * auth middleware - verifies JWT and attaches user { id, role } to req.user
 */
export const auth = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, role: payload.role };
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/**
 * permit(...roles) - role guard middleware
 */
export const permit = (...allowedRoles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (!allowedRoles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
  next();
};
