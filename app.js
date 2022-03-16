require("dotenv").config(); 
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const route = require('./routes/index');
const port = (process.env.SERVER_PORT ?? 8081);
app.use(express.static('public'));

//console.log(require('crypto').randomBytes(64).toString('hex')); //To generate the token secret
app.use('/', route)

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});