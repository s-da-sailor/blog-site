/*
* Title: Server Sub-App
* Description: This application starts a server and listens on a specefied port 
* Author: Akash Lanard
* Date: 6 April 2022
*/

// dependencies
const app = require('./app');

// port (@TODO: add this in the environment variables later)
const port = 3000;

// start the server on the specified port
app.listen(port, () => {
  console.log(`listening to port ${port}...`);
});