export const check_role = (role = []) => {
  return (req, res, next) => {
    console.log("in check role middleware =>", req.user.role, role);
    if (role.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({
        message:
          "Access denied, you are not authorized to perform this action.",
      });
    }
  };
};
