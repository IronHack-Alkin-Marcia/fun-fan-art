// Global properties in Express & Handlebars
module.exports = (app) => {
  app.use((req, res, next) => {
    res.locals.loggedUser = req.user;
    next();
  });
};
