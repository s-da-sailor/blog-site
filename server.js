/*
 * Title: Server Sub-App
 * Description: This application starts a server and listens on a specefied port
 * Author: Akash Lanard
 * Date: 6 April 2022
 */

// DEPENDENCIES
const app = require('./app');

// PORT (defined in configuration file or 8000 if not defined)
const port = process.env.PORT || 8000;

// start the server on the specified port
app.listen(port, () => {
  console.log(`listening to port ${port}...`);
});
