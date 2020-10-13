const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require('body-parser');

const db = require('./db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/wallpapers', async (req, res) => {
  const wallpapers = await db.getAllWallpapers();
  res.send(wallpapers);
});

app.post('/wallpapers', async (req, res) => {
  console.log(req.body);
  const wallpapers = await db.insertWallpaper(req.body.name, req.body.img);
  res.send(wallpapers);
});

app.delete('/wallpapers/:id', async (req, res) => {
  const wallpapers = await db.deleteWallpapers(req.params.id);
  res.send(wallpapers);
});

app.listen(port, () => console.log(`Wallpaper app listening on port ${port}!`));
