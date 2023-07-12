'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;
var NovelSchema = new Schema({
    novel_status: {
        type: Number,
        require: true
    },
    hot: {
        type: Boolean,
        default: false
    },
    safeAds: {
        type: Boolean,
        default: false
    },
    new: {
        type: Boolean,
        default: false
    },
    novel_source: {
        type: String,
        trim: true
    },
    totalChapter: {
        type: Number,
        default: 0
    },
    avgPointType2: {
        type: SchemaTypes.Decimal128,
        default: 0
    },
    followCount: {
        type: Number,
        default: 0
    },
    voteCountType2: {
        type: Number,
        default: 0
    },
    view: {
        type: Number,
        default: 0
    },
    viewToDay: {
        type: Number,
        default: 0
    },
    novel_name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    novel_other_name: {
        type: String,
        trim: true
    },
    novel_author: {
        type: String,
        required: true,
        trim: true
    },
    novel_id: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    novel_desc: {
        type: String,
        trim: true
    },
    safeAds: {
        type: Boolean,
        default: false
    },
    isPanda: {
        type: Boolean,
        default: true
    },
    novel_genres: {
        type: Array,
        required: true
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    recentChapter: {
        type: Object
    },
    firstChapter: {
        type: Object
    },
    crawler_date: {
        type: Date,
        default: Date.now
    },
});

let Novel = mongoose.model('Novels', NovelSchema);
module.exports = Novel;