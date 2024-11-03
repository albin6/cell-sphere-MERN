export function normalizeUserMiddleware(req, res, next) {
  console.log("in normalize user middleware =>", req.user);
  if (req.user && req.user.user) {
    // If req.user has a nested 'user' object, extract it
    req.user = req.user.user;
    console.log(req.user);
  }
  next();
}
