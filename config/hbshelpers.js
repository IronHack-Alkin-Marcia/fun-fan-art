module.exports = (hbs) => {
  hbs.registerHelper('isMyself', function (id, user, opts) {
    if (id && user && String(id) == String(user._id)) return opts.fn(this);
    else return opts.inverse(this);
  });

  hbs.registerHelper('isAdmin', function (user, opts) {
    if (user && user.role == 'ADMIN') return opts.fn(this);
    else return opts.inverse(this);
  });

  hbs.registerHelper('isEditor', function (user, opts) {
    if (user && ['ADMIN', 'EDITOR'].includes(user.role)) return opts.fn(this);
    else return opts.inverse(this);
  });
};
