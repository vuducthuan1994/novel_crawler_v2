'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PandaSchema = new Schema({
    novel_name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    last_chapter_url: {
        type: String,
        required: true,
        trim: true
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    updated_date: {
        type: Date,
        default: Date.now
    }
});
let Panda = mongoose.model('panda', PandaSchema);
module.exports = Panda;