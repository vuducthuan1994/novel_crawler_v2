'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ChapterSchema = new Schema({
    chapter_name: {
        type: String,
        required: true,
        trim: true
    },
    chapter_content: {
        type: String,
        required: true,
        trim: true
    },
    chapter_id: {
        type: String,
        required: true,
        trim: true
    },
    novel: {
        type: Object,
        require: true
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    crawler_date: {
        type: Date,
        default: Date.now
    },
});
ChapterSchema.index({ "chapter_id": 1, "novel.novel_id": 1 }, { "unique": true });
let Chapter = mongoose.model('Chapters', ChapterSchema);
module.exports = Chapter;