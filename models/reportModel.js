'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ReportSchema = new Schema({
    url: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    reason: {
        type: String,
        trim: true,
        required: true
    },
    chapterId: {
        type: String,
        trim: true,
        required: true
    }
});

let Reports = mongoose.model('Reports', ReportSchema);
module.exports = Reports;