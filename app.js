const express = require('express'),
  bodyparser = require('body-parser'),
  fileUpload = require('express-fileupload'),
  router = require('./routes/router'),
  app = express(),
  cors = require('cors');
app.use(cors());
app.set('view engine', 'ejs');
app.use(fileUpload());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(express.static('public'));

router(app);

app.listen(8080, () => {
  console.log('Port 8080');
});
