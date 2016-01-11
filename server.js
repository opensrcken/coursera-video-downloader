"use strict";

const https = require('https');
const fs = require('fs');
const invariant = require('invariant');
const mkdirp = require('mkdirp');
const express = require('express');
const bodyParser = require('body-parser');
const sanitizeFilename = require('sanitize-filename');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const DOWNLOADS_FOLDER = 'downloads';

const requiredBodyParams = [
  'section',
  'filename',
  'url'
];

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.post('/', function (req, res) {
  console.log("==================");
  console.log("DOWNLOAD REQUEST RECEIVED");
  console.log("\n");
  console.log("REQUEST BODY:");
  console.log("******");
  let isFirst = true;
  for (var prop in req.body) {
    if (isFirst) {
      isFirst = false;
    } else {
      console.log("\n");
    }
    console.log(`${prop.toUpperCase()}: ${req.body[prop]}`);
  }
  console.log("******");
  console.log("\n");
  requiredBodyParams.forEach(p => {
    invariant(req.body[p], `Required param missing: ${p}`);
  });

  const dir = DOWNLOADS_FOLDER + '/' + req.body.section;
  const initialFilename = req.body.filename;
  const intermediateFilename = initialFilename.replace('/', '(slash)');
  const filename = sanitizeFilename(intermediateFilename);

  // ensure directory: section
  mkdirp.sync(dir);

  const filePath = dir + '/' + filename;

  console.log('Creating File: ' + filePath);
  console.log("\n");

  const file = fs.createWriteStream(filePath);
  https.get(req.body.url, function(response) {
    response.pipe(file);
    console.log('SUCCESS!');
    console.log("\n");
    res.sendStatus(200);
  });
});

https.createServer({
  key: fs.readFileSync('ssl/server.key'),
  cert: fs.readFileSync('ssl/server.crt')
}, app).listen(3000);

console.log("Listening for HTTPS on 3000");