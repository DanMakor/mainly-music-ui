const express = require('express');
const path = require('path');

const root = './';
const port = (process.env.PORT || 3000);
const app = express();

app.use((req, res, next) => {
  let validIps = process.env.IPS?.split(',') || ['::12', '127.0.0.1']; // Put your IP whitelist in this array
  console.log(validIps);
  if(validIps.includes(req.socket.remoteAddress)){
      // IP is ok, so go on
      console.log("IP ok");
      next();
  }
  else{
      // Invalid ip
      console.log("Bad IP: " + req.socket.remoteAddress);
      const err = new Error("Bad IP: " + req.socket.remoteAddress);
      next(validIps);
  }
});
app.use(express.static(path.join(root, 'dist/')));
app.get('*', (req, res) => {
  res.sendFile('dist/index.html', {root});
});

// Error handler
app.use((err, req, res, next) => {
  console.log('Error handler', err);
  res.status(err.status || 500);
  res.send(err);
});

app.listen(port, () => console.log(`UI running on localhost:${port}`));