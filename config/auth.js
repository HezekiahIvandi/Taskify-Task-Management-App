module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Please Login To Access This Page");
    res.redirect("/login");
  },
  ensureNotAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect("/project");
    }
    next();
  },
};
