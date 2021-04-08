const express = require('express');
const path = require('path');

const root = './';
const port = (process.env.PORT || 3000);
const app = express();

app.use(express.static(path.join(root, 'dist/')));
app.get('*', (req, res) => {
  res.sendFile('dist/index.html', {root});
});

app.listen(port, () => console.log(`UI running on localhost:${port}`));