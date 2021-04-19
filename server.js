const express = require('express');
const path = require('path');

const root = './';
const port = (process.env.PORT || 3000);
const app = express();

app.use((req, res, next) => {
  let validIps = process.env.IPS?.split(',') || ['::12', '127.0.0.1']; // Put your IP whitelist in this array
  let clientIp = req.headers['x-forwarded-for'];
  if(validIps.includes(clientIp)) {
      // IP is ok, so go on
      console.log("IP ok");
      next();
  }
  else{
      // Invalid ip
      console.log("Bad IP: " + clientIp);
      next(clientIp);
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