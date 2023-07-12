const Chapter = require('../models/chapter');
const Novel = require('../models/novel');

const slug = require('slug');
const axios = require('axios')
const utf8 = require('utf8')
const readline = require('readline');

const { Readable } = require('stream');

const checkNovelName = function (novel_name) {
    let name = novel_name;
    if (novel_name == 'Death... and me') {
        name = 'Death… and me';
    }
    if (novel_name == 'The Man Picked Up by the Gods (Reboot)') {
        name = 'The Man Picked Up By the Gods (Reboot)';
    }
    if (novel_name == 'My Three Wives Are Beautiful Vampires.') {
        name = 'My Three Wives Are Beautiful Vampires'
    }
    if (novel_name == "Affinity:Chaos") {
        name = "Affinity: Chaos";
    }
    if (novel_name == "The Yun Family’s Ninth Child is an Imp!") {
        name = "The Yun Family's Ninth Child Is An Imp!";
    }
    if (novel_name == "Dual Cultivator Reborn[System In The Cultivation World]") {
        name = " Dual Cultivator Reborn [System In The Cultivation World]";
    }
    if (novel_name == "The Demon Lord And His Hero") {
        name = "The Demon Lord and his Hero (BL)";
    }
    return new Promise(function (reslove, reject) {
        Novel.findOne({
            $or: [
                { novel_name: new RegExp(`^${name.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")}$`, 'i') },
                { novel_name: new RegExp(`^${name.replace(`'`, `’`).replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")}$`, 'i') },
                { novel_name: new RegExp(`^${name.replace(`'`, `’`).replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1").substring(0, name.length - 1)}$`, 'i') },
                { novel_name: new RegExp(`^${name.replace(`’`, `'`).replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")}$`, 'i') },
                { novel_id: slug(name) },
                { novel_name: name }
            ]
        }, function (err, novel) {
            if (!err) {
                if (novel) {
                    reslove(novel);
                } else {
                    reslove(null);
                }
            } else {
                reslove(null)
            }
        }).sort({ crawler_date: -1 }).limit(1);
    });
}

const checkChapterExits = function (novel_id, chapter_name) {
    let chapterNumber = 'Chapter -1';
    if (/(.*?)(Chapter|chapter) ([+]?([0-9]*[.])?[0-9]+)/.test(`${chapter_name}`)) {
        chapterNumber = /(.*?)(Chapter|chapter) ([+]?([0-9]*[.])?[0-9]+)/.exec(`${chapter_name}`)[0];
    }

    //Chapter &#xFEFF;
    return new Promise(function (reslove, reject) {

        const query = {
            $or: [
                { "novel.novel_id": novel_id, "chapter_name": new RegExp(`${chapterNumber.replace(`Chapter `, `Chapter ﻿`)}\\b`, 'i') },
                { "novel.novel_id": novel_id, "chapter_name": new RegExp(`${chapterNumber.replace(`Chapter `, `Chapter ﻿`)}\\b`, 'i') },
                { "novel.novel_id": novel_id, "chapter_name": new RegExp(`${chapterNumber.replace(`Chapter `, `Chapter `)}\\b`, 'i') },
                { "novel.novel_id": novel_id, "chapter_name": new RegExp(`${chapterNumber}\\b`, 'i') },
                { "novel.novel_id": novel_id, "chapter_content": new RegExp(`<(h3|h4|p)>${chapterNumber}\\b`, 'i') },
                { "novel.novel_id": novel_id, "chapter_name": new RegExp(`${chapter_name.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")}`, 'i') },
                { "novel.novel_id": novel_id, "chapter_name": new RegExp(`${chapter_name.replace(`'`, `’`).replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")}`, 'i') },
            ]
        }
        Chapter.findOne(query, function (err, chapter) {
            if (!err) {
                if (chapter) {
                    reslove(chapter)
                } else {
                    reslove(null);
                }
            } else {
                console.log(err)
                reslove(null)
            }
        }).sort({ crawler_date: -1 }).limit(1);
    })
}

const sendTele = function (message) {
    let chatId = '-1001913065449'
    let token = '6121475349:AAFSQwLQphC4c1LQDq6GE8D0cuolaSq4uyo'
    return new Promise(function (reslove, reject) {
        try {
            axios.get(`https://api.telegram.org/bot` + token + `/sendMessage?chat_id=` + chatId + `&text=` + utf8.encode(message))
            .then(response => {
                reslove(response)
            })
            .catch(error => {
                reslove(error);
            });
        } catch (error) {
            reslove(null)
        }
  
    })
}

const getDomainFromUrl = function (url) {
    let domain = (new URL(url));
    domain = domain.hostname;
    domain = domain.replace('www.', '');
    return domain;
}

const bufferToStream = function (binary) {
    const readableInstanceStream = new Readable({
        read() {
            this.push(binary);
            this.push(null);
        }
    });
    return readableInstanceStream;
}

const confirm = function () {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout

    });
    return new Promise(resolve => {
        rl.question('Bạn muốn thực hiện trên dữ liệu Array? (Y/N)', (answer) => {
            rl.close();
            resolve(answer)
        });
    })
}


module.exports = {
    checkNovelName: checkNovelName,
    sendTele: sendTele,
    checkChapterExits: checkChapterExits,
    getDomainFromUrl: getDomainFromUrl,
    bufferToStream: bufferToStream,
    confirm: confirm
}
