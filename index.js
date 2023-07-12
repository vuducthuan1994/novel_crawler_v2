const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const freewebnovel = require('./jobs/freewebnovel');
const fixChapter = require('./jobs/fixMissChapter');

const crawler = require('./jobs/crawler');

const path = require('path');
app.use('/freewebnovel', freewebnovel);


const PandaNovel = require('./jobs/panda-novel');
app.use('/panda-novel', PandaNovel);

// const test = require('./jobs/test');

mongoose.connect(process.env.DB_URL, {
    user: process.env.DB_USER,
    pass: process.env.DB_PASSWORD,
    useUnifiedTopology: true,
    useNewUrlParser: true
}, function(err) {
    if (!err) {
        console.log("Connect database successful")
    } else {
        console.log(err)
    }
});

const port = process.env.PORT || 6868;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});