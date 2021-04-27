const alreadyLogged = () => {
  return (req, res, next) => {
    // not a page for who is logged
    if (req.isAuthenticated()) {
      // req.session.user // req.user
      res.redirect('/private');
    } else {
      next();
    }
  };
};
const loginCheck = () => {
  return (req, res, next) => {
    // check if the user is logged in
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/login');
    }
  };
};

const isAdmin = () => {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.role == 'ADMIN') {
      next();
    } else if (!req.isAuthenticated()) {
      res.redirect('/login');
    } else {
      res.redirect('/private');
    }
  };
};

const isEditor = () => {
  return (req, res, next) => {
    if (req.isAuthenticated() && ['ADMIN', 'EDITOR'].includes(req.user.role)) {
      next();
    } else if (!req.isAuthenticated()) {
      res.redirect('/login');
    } else {
      res.redirect('/private');
    }
  };
};

module.exports = {
  alreadyLogged,
  loginCheck,
  isAdmin,
  isEditor,
};
