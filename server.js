const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.listen(PORT, err => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server listening on port: ${PORT} CNTL-C to Quit`);
    console.log('172.0.0.1');
  }
});
