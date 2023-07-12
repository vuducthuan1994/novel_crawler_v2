'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const CrawlerConfigSchema = new Schema({
    novel_name: {
        type: String,
        required: true,
        trim: true
    },
    view: {
        type: Number,
        default: 0
    },
    domain: {
        type: String,
        required: true,
        trim: true,
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
CrawlerConfigSchema.index({ "domain": 1, "novel_name": 1 }, { "unique": true });
const CrawlerConfig = mongoose.model('crawler_config', CrawlerConfigSchema);
module.exports = CrawlerConfig;