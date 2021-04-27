// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// move all passports configuration to /config/
// **** using one file per Strategy to make it more readable
require('./config/passport.local')(app);
require('./config/passport')(app);
require('./config/passport.global')(app);

// custom handlebars functions
require('./config/hbshelpers')(hbs);

// default value for title local
const projectName = 'fun-fan-art';
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)} created with Ironlauncher`;

// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);

app.use('/', require('./routes/auth'));
app.use('/artapi', require('./routes/artapi'));
app.use('/webconfig', require('./routes/config'));
app.use('/', require('./routes/saving'));
app.use('/bookmark', require('./routes/bookmark'));

// remove before going life
app.use('/testartapi', require('./routes/testartapi'));

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;
