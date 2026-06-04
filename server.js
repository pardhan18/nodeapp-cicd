const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('<h1>Hello from NodeApp! v1</h1><p>Deployed via Jenkins CI/CD Pipeline</p>');
});

app.listen(3000, () => {
  console.log('App running on port 3000');
});
