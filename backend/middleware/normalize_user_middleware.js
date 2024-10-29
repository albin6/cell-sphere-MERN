export function normalizeUserMiddleware(req, res, next) {
  if (req.user && req.user.user) {
    // If req.user has a nested 'user' object, extract it
    req.user = req.user.user;
  }
  next();
}
