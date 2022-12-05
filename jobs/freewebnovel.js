const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const Novel = require('../models/novel');
const Reports = require('../models/reportModel');
const Chapter = require('../models/chapter');
const userAgent = require('user-agents');
const Queue = require('better-queue');
const slug = require('slug')
const fs = require('fs')
const express = require('express');
const router = express.Router();
const BASE_URL = 'https://libread.com/sort/latest-release-novel/';
const CacheService = require('../cache/cache_service');
const cacheHelper = new CacheService();
const schedule = require('node-schedule');
const request = require('request');
const ftp = require("basic-ftp");
const { Readable } = require('stream');
const tags = [
    '[Visit freewebnovel.com for the best novel reading experience]',
    'Visit freewebnovel.com for a better experience',
    'You can read the novel online free at freewebnovel.com',
    'Read novel online free fast updates at freewebnovel.com',
    'Sorry, content is lost, You are reading Novel on Freewebnovel.Com, we will fix it as soon as possible, thank you',
    'For more, visit freewebnovel.com',
    'Read novel fast updates at freewebnovel.com',
    'Thank you for reading on freewebnovel.com',
    'Read novel fast updates at Freewebnovel.com',
    'ɴᴇᴡ ɴᴏᴠᴇʟ ᴄʜᴀᴘᴛᴇʀs ᴀʀᴇ ᴘᴜʙʟɪsʜᴇᴅ ᴏɴ ꜰʀᴇᴇᴡᴇʙɴ(ᴏ)ᴠᴇʟ. ᴄᴏᴍ',
    'ɪꜰ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ʀᴇᴀᴅ ᴍᴏʀᴇ ᴄʜᴀᴘᴛᴇʀs, ᴘʟᴇᴀsᴇ ᴠɪsɪᴛ ꜰʀᴇᴇᴡᴇʙɴ(o)ᴠᴇʟ.ᴄᴏᴍ ᴛᴏ ᴇxᴘᴇʀɪᴇɴᴄᴇ ꜰᴀsᴛᴇʀ ᴜᴘᴅᴀᴛᴇ sᴘᴇᴇᴅ.',
    'ʀᴇᴀᴅ ʟᴀᴛᴇsᴛ ᴄʜᴀᴘᴛᴇʀs ᴀᴛ ꜰʀᴇᴇᴡᴇʙɴ(ᴏ)ᴠᴇʟ. ᴄoᴍ ᴏɴʟʏ.',
    'ᴛʜɪs ᴄʜᴀᴘᴛᴇʀ ɪs ᴜᴘᴅᴀᴛᴇ ʙʏ ꜰʀᴇᴇᴡᴇʙɴ(o)ᴠᴇʟ. ᴄᴏᴍ.',
    'ᴜᴘᴅᴀᴛᴇ ꜰʀᴏᴍ ꜰʀᴇᴇᴡᴇʙɴ(ᴏ)ᴠᴇʟ. ᴄᴏᴍ.',
    'New novel chapters are published on  Freeᴡebn(ᴏ)vel.cᴏm.',
    'Follow current novels on  Freewebn(o)vel.com.',
    'This chapter is updated by  Freewebn(o)vel.cᴏm',
    'The source of this content is  Freeᴡebn(ᴏ)vel.cᴏm.',
    'Visit (Myb o xn ov e l. com) to read, pls!',
    'Continue reading on MYB0X N0 VEL. COM',
    'New novel chapters are published on Freewebnᴏvel.cᴏm',
    'Follow current novels on Freeᴡebnovel.cᴏm',
    'The source of this content is Freewebnᴏvel.com',
    'This chapter is updated by Freeᴡebnᴏvel.cᴏm',
    'Freeᴡebnᴏvel.cᴏm',
    'Freewebnᴏvel.com',
    'Freeᴡebnovel.cᴏm',
    'Freewebnᴏvel.cᴏm',
    'Freeᴡebn(ᴏ)vel.cᴏm',
    'Freewebn(o)vel.com',
    'Freewebn(o)vel.cᴏm',
    'ꜰʀᴇᴇᴡᴇʙɴoᴠᴇʟ.ᴄᴏᴍ',
    'ꜰʀᴇᴇ ᴡᴇʙ ɴ(ᴏ)ᴠᴇʟ. ᴄᴏᴍ',
    'ꜰʀᴇᴇ ᴡᴇʙ ɴ(o)ᴠᴇʟ',
    'ꜰʀᴇᴇ ᴡᴇʙ ɴ(o)ᴠᴇʟ. ᴄoᴍ',
    'ꜰʀᴇᴇᴡᴇʙɴᴏᴠᴇʟ.ᴄᴏᴍ',
    'Visit (Mybo x novel. com) to read, pls!',
    'If you want to read more chapters, Please visit Libread.com to experience faster update speed',
    'If you want to read more chapters, Please visit Libread.com to experience faster update speed.',
    'Visit ʟɪʙʀᴇᴀᴅ.ᴄᴏᴍ for a better_user experience',
    'Visit ʟɪʙʀᴇᴀᴅ.ᴄoᴍ, for the best no_vel_read_ing experience',
    'The latest_epi_sodes are on_the ʟɪʙʀᴇᴀᴅ.ᴄᴏᴍ.website.',
    'New novel ᴄhapters are published on Libread.cᴏm.',
    'Follow current novels on Libread.ᴄom.',
    'The source of this ᴄontent is  Libread.com.',
    'This chapter is updated by  Libread.cᴏm.',
    'Support us at FreeWebNovel.Com.',
    'We are FreeWebNovel.Com, find us on google.',
    "When you're just trying to make great content at FreeWebNovel.Com.",
    "Find the original at FreeWebNovel.Com.",
    "This novel is available on FreeWebNovel.Com.",
    "Search FreeWebNovel.Com for the original.",
    "The Novel will be updated first on Freeᴡebnᴏvel. cᴏm . Come back and continue reading tomorrow, everyone!😉",
    "The Novel will be updated first on Freeᴡebn(ᴏ)vel. cᴏm . Come back and continue reading tomorrow, everyone!😉",
    "If you want to read more chapters, Please visit Freewebn(ᴏv)el. c0m to experience faster update speed.",
    "Theft is never good, try looking at FreeWebNovel.Com."
]

const writeLog = function (msg) {
    fs.appendFile('./log.txt', `${msg} \r\n`, function (err) {
        if (err) {
            // append failed
        } else {
            // done
        }
    })
}
let bufferToStream = function (binary) {
    const readableInstanceStream = new Readable({
        read() {
            this.push(binary);
            this.push(null);
        }
    });
    return readableInstanceStream;
}
let getDataFromUrlImage = function (url) {
    return new Promise(function (reslove, reject) {
        var options = {
            url: url,
            encoding: null
        }
        request.get(options, async function (err, res, body) {
            let data = bufferToStream(body)
            reslove(data);
        });
    })
}

let download_banner = async function (comic_victim_url, file_name) {
    const client = new ftp.Client(10000)
    client.ftp.verbose = true
    try {
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
            //secure: true,
            port: 21
        });
        let data = await getDataFromUrlImage(comic_victim_url);
        await client.uploadFrom(data, `image_service/public/novel/${file_name}.jpg`);
        const request = require('request');
        request(`http://${process.env.FTP_HOST}:6200/resizeImage/${file_name}.jpg`, { json: true }, (err, res, body) => {
            if (!err) {
                console.log(" Nhan doi anh thanh cong");
            }
        });
        console.log("REPLACE BANNER DONE");
    } catch (err) {
        console.log("Dowload banner loi")
        console.log(err)
    }
    client.close()
};
router.get('/testJob', async function (req, res) {
    crawler_quece.push({
        url: 'https://libread.com/novel/after-favorability-is-maxed.html'
    });
    return res.json({
        success: true,
        msg: 'Hệ thống đang xử lý'
    });
});

router.get('/start/:from/:to', async function (req, res) {
    const from = Number(req.params.from);
    const to = Number(req.params.to);
    if (from && to) {
        getNovelUrls(from, to);
        return res.json({
            success: true,
            msg: 'Đang xử lý'
        })
    } else {
        return res.json({
            success: false,
            msg: 'Check param'
        })
    }
});

const getNovelUrls = async function (from, to) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-dev-profile', '--disable-web-security'],
        timeout: 35000
    });
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    await page.setDefaultNavigationTimeout(30000);
    page.on('request', (req) => {
        if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image' || req.resourceType() === "script") {
            req.abort();
        } else {
            req.continue();
        }
    });
    try {
        for (let page_index = from; page_index <= to; page_index++) {
            await page.goto(`${BASE_URL}${page_index}`);
            const novelUrls = await page.evaluate(() => {
                let results = [];
                const novelUrls = document.querySelectorAll('.ss-custom .li-row .li');
                novelUrls.forEach((novel) => {
                    try {
                        results.push(novel.querySelector('h3.tit a').href);
                    } catch (err) {
                        console.log(err)
                    }
                });
                return results;
            });
            novelUrls.forEach(url => {
                crawler_quece.push({
                    url : url
                });
            });
        }
    }catch(err) {
        await browser.close();
    }
 
    await browser.close();
}


const getNovel = async function (config, callback) {
    const novelUrl = config.url;
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-dev-profile', '--disable-web-security'],
        timeout: 35000
    });
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    await page.setDefaultNavigationTimeout(30000);
    page.on('request', (req) => {
        if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image' || req.resourceType() === "script") {
            req.abort();
        } else {
            req.continue();
        }
    });
    try {
        await page.goto(novelUrl);
        await page.waitForSelector(".m-desc h1", { timeout: 10000 });
        let novelInfo = await page.evaluate(async () => {

            const novel_victim_banner = document.querySelector('.m-imgtxt .pic img').src || '';
            const novel_name = document.querySelector(".m-desc h1.tit").innerText || '';
            let novel_other_name = '';
            let novel_author = '';
            let novel_status = 1;
            let novel_genres = [];
            let novel_source = '';
            let temp = novel_victim_banner.split("/");
            let novel_victim_id = temp[temp.length - 1].replace("s.jpg", "");
            let isHot = (document.querySelector(".m-newest .col-l ul li:first-child .item span") && document.querySelector(".m-newest .col-l ul li:first-child .item span").innerText == 'HOT') ? true : false;
            let isNew = (document.querySelector(".m-newest .col-l ul li:first-child .item span") && document.querySelector(".m-newest .col-l ul li:first-child .item span").innerText == 'NEW') ? true : false;

            let meta_info = document.querySelectorAll('.m-imgtxt .txt .item');
            meta_info.forEach(meta_item => {
                if (meta_item.querySelector('span.glyphicon').title.trim() == 'Alternative names') {
                    novel_other_name = meta_item.querySelector('.right span') ? meta_item.querySelector('.right span').innerText.trim() : '';
                }
                if (meta_item.querySelector('span.glyphicon').title.trim() == 'Author') {
                    novel_author = meta_item.querySelector('.right a') ? meta_item.querySelector('.right a').innerText.trim() : '';
                }
                if (meta_item.querySelector('span.glyphicon').title.trim() == 'Source') {
                    novel_source = meta_item.querySelector('.right span') ? meta_item.querySelector('.right span').innerText.trim() : '';
                }
                if (meta_item.querySelector('span.glyphicon').title.trim() == 'Status') {
                    if (meta_item.querySelector('a').innerText.trim() == 'OnGoing') {
                        novel_status = 0;
                    }
                }
                if (meta_item.querySelector('span.glyphicon').title.trim() == 'Genre') {
                    let genresContainer = meta_item.querySelectorAll('a');
                    genresContainer.forEach(genreItem => {
                        let genreId = genreItem.innerText.toUpperCase().trim();
                        novel_genres.push(genreId);
                    });
                }
            });
            const novel_desc = document.querySelector('.m-desc .txt .inner').innerText;
            let avgPointType2 = 7;
            let voteCountType2 = 35;
            let votes = document.querySelector('.score .vote').innerText;
            if (votes.includes('votes')) {
                avgPointType2 = Number(votes.split('/')[0]) * 2;
                voteCountType2 = Number(votes.split('(')[1].replace(/\D/g, ''));
            }

            return {
                novel_victim_banner: novel_victim_banner,
                novel_author: novel_author,
                novel_source: novel_source,
                novel_victim_id: novel_victim_id,
                novel_other_name: novel_other_name,
                novel_status: novel_status,
                novel_genres: novel_genres,
                novel_desc: novel_desc,
                avgPointType2: avgPointType2,
                voteCountType2: voteCountType2,
                novel_name: novel_name,
                hot: isHot,
                new: isNew
            };
        });
        novelInfo['novel_id'] = novelUrl.match(/.*\/(.*)$/)[1].replace('.html', '').trim();
        novelInfo['onDb'] = true;
        let novel_on_db = await checkNovelExits(novelInfo['novel_name'].trim(), novelInfo['novel_id']);

        if (novel_on_db) {
            novelInfo['novel_id'] = novel_on_db.novel_id;
        }
        const chapter_url = `https://libread.com/api/chapterlist.php?aid=${novelInfo['novel_victim_id']}&acode=${novelUrl.match(/.*\/(.*)$/)[1].replace('.html', '').trim()}&cid=1`
        await page.goto(chapter_url);
        let chapters = await page.evaluate(async () => {
            let chapters = [];
            let chapterContainers = document.querySelectorAll('option');
            chapterContainers.forEach(chapterItem => {
                let chapterUrl = chapterItem.value.replaceAll('"', '').replaceAll('\\', '');
                let chapterName = chapterItem.label.replace(`?C.`, 'Chapter ').replace('C.', 'Chapter ').replace("<\\/option>", '').replace("Chpater", "Chapter").replace('&#xFEFF;', '').trim();
                chapters.push({
                    chapter_url: `https://libread.com` + chapterUrl,
                    chapter_name: chapterName.replace(`"}`, '')
                })
            });
            return chapters;
        })
        novelInfo['chapters'] = chapters;
        novelInfo['crawler_date'] = new Date();
        novelInfo['totalChapter'] = chapters.length;
        Novel.create(novelInfo, function (err, data) {
            if (!err) {
                if (novelInfo.novel_victim_banner) {
                    const file_name = novelInfo['novel_id'];
                    download_banner(novelInfo.novel_victim_banner, file_name);
                }
                console.log(`Them thanh cong novel ${novelInfo.novel_name}`)
            } else {
                console.log(`Thong bao ${novelInfo.novel_name} da ton tai`);
                const file_name = novelInfo['novel_id'];
                download_banner(novelInfo.novel_victim_banner, file_name);

                Novel.updateOne({ novel_id: novelInfo['novel_id'] }, {
                    hot: novelInfo['hot'],
                    new: novelInfo['new'],
                    totalChapter: novelInfo.chapters.length,
                    novel_status: novelInfo['novel_status']
                }, function (err, res) {
                    // if (!err) {
                    //     console.log("CAP NHAT HOT NEW THANH CONG !")
                    // }
                })
            }
        });
        let total_chapter_crawler = await countChapter(novelInfo['novel_id']);
        console.log(`TONG SO CHAPTER ${novelInfo['novel_name']} DA CAO`, total_chapter_crawler);
        console.log(`TONG SO CHAPTER ${novelInfo['novel_name']} VICTIM`, novelInfo.chapters.length);
        if(process.env.ENV == 'DEV') {
            if(total_chapter_crawler < novelInfo.chapters.length) {
                writeLog(`TONG SO CHAPTER ${novelInfo['novel_name']} DA CAO ${total_chapter_crawler}`);
                writeLog(`TONG SO CHAPTER ${novelInfo['novel_name']} VICTIM ${novelInfo.chapters.length}`)
                writeLog(`\n`);
            }
        }
      

        for (let j = total_chapter_crawler; j < novelInfo.chapters.length; j++) {
            const chapter_victim_url = novelInfo.chapters[j].chapter_url;
            const chapter_id = chapter_victim_url.match(/.*\/(.*)$/)[1].replace('.html', '').trim();
            let checkChapter = null;
            if (novel_on_db && total_chapter_crawler !== 0) {
                checkChapter = await checkChapterExits(novelInfo['novel_id'].trim(), chapter_id, novelInfo.chapters[j].chapter_name.trim());
            }
            if (!checkChapter) {
                try {
                    await page.setUserAgent(userAgent.toString())
                    await page.goto(chapter_victim_url, { timeout: 30000 });
                    let chapterDetail = await page.evaluate(async () => {
                        document.querySelectorAll("div[style = 'margin-top: 5px; margin-bottom: 5px;']").forEach(el => el.remove());
                        document.querySelectorAll("#pf-6282088417d0810027b05464").forEach(el => el.remove());
                        document.querySelectorAll(".ads-holder").forEach(el => el.remove());
                        document.querySelectorAll('.txt a').forEach(el => el.remove());
                        document.querySelectorAll('.txt .ul-list7').forEach(el => el.remove());
                        document.querySelectorAll('.txt .tips').forEach(el => el.remove());
                        document.querySelectorAll('.txt p sub').forEach(el => el.remove());

                        let chapter_name = document.querySelector('.top span.chapter').innerText.trim();
                        chapter_name = chapter_name.trim().replace(`&#xFEFF;`, '').trim();
                        const chapter_content = document.querySelector('.txt') ? document.querySelector('.txt').innerHTML.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').replace(/<!--.*?-->/sg, "") : '';
                        return {
                            chapter_name: chapter_name,
                            chapter_content: chapter_content
                        }
                    });
                    chapterDetail['chapter_id'] = slug(`c${chapterDetail.chapter_name}`);
                    chapterDetail['crawler_date'] = new Date()
                    chapterDetail['novel'] = {
                        novel_id: novelInfo['novel_id'],
                        novel_name: novelInfo['novel_name']
                    }
                    let __idx = j;
                    if (chapterDetail['chapter_content'].length || chapterDetail['chapter_content'].includes('img')) {
                      
                        for (let tag_idx = 0; tag_idx < tags.length; tag_idx++) {
                            chapterDetail['chapter_content'] = chapterDetail['chapter_content'].replace(tags[tag_idx], "");
                            chapterDetail['chapter_content'] = chapterDetail['chapter_content'].replace(tags[tag_idx], "");
                            chapterDetail['chapter_content'] = chapterDetail['chapter_content'].replace(tags[tag_idx], "");
                        }
                        Chapter.create(chapterDetail, function (err, data) {
                            if (!err) {
                                console.log("Them moi thanh cong chapter");
                                if (chapterDetail['chapter_content'].includes('Chapter content is missing')) {
                                    Reports.create({
                                        chapterId: chapterDetail['chapter_id'],
                                        reason: 'Chapter content is missing',
                                        url: `https://novelbin.com/b/${chapterDetail['novel'].novel_id}/${chapterDetail['chapter_id']}`
                                    }, function (err, data) {
                                        if (!err) {
                                            console.log("Bao loi thanh cong")
                                        }
                                    })
                                }
                                cacheHelper.delete('getLastestNovel');
                                cacheHelper.delete(novelInfo['novel_id']);
                                Novel.updateOne({ novel_id: novelInfo['novel_id'] }, {
                                    recentChapter: {
                                        chapter_id: chapterDetail['chapter_id'],
                                        chapter_name: chapterDetail['chapter_name']
                                    },
                                    crawler_date: new Date()
                                }, function (err, data) {
                                    if (!err) {
                                        console.log(" CAP NHAT chapter cuoi cung thanh cong !")
                                    }
                                });
                                if (__idx == 0) {
                                    Novel.updateOne({ novel_id: novelInfo['novel_id'] }, {
                                        firstChapter: {
                                            chapter_id: chapterDetail['chapter_id'],
                                            chapter_name: chapterDetail['chapter_name']
                                        }
                                    }, function (err, data) {
                                        if (!err) {
                                            console.log(" CAP NHAT chapter dau tien thanh cong !")
                                        }
                                    })
                                }
                            } else {
                                console.log(err)
                            }
                        });
                    }
                } catch (err) {
                    console.log(`${chapter_victim_url} KHONG VAO DUOC - ${JSON.stringify(err)}`)
                    writeLog(`${chapter_victim_url}  KHONG VAO DUOC - ${JSON.stringify(err)}`)
                }
            } else {
                console.log(`chapter da ton tai || ${novelInfo['novel_name']} || ${checkChapter.chapter_name}`);
                // writeLog(`TONG SO CHAPTER ${novelInfo['novel_name']} DA CAO ${total_chapter_crawler}`);
                // writeLog(`TONG SO CHAPTER ${novelInfo['novel_name']} VICTIM ${novelInfo.chapters.length}`)
                // writeLog(`\n`);
            }
        }
        console.log(`Novel Name: ${novelInfo.novel_name} XỬ LÝ XONG`)

    } catch (error) {
        console.log(error)
        writeLog(`LỖI NOVEL: ${novelUrl} không vào được ${JSON.stringify(error)}`)
        callback(null, {
            success: false,
            msg: `Lỗi cào ${error}`
        });
    }
    await browser.close();
    callback(null, {
        success: true,
        msg: `Cào thành công`
    });
}

let countChapter = function (novel_id) {
    return new Promise(function (reslove, reject) {
        Chapter.count({ "novel.novel_id": novel_id }, function (err, count) {
            if (!err) {
                reslove(count)
            } else {
                reslove(10000)
            }
        });
    })
}
const checkChapterExits = function (novel_id, chapter_id, chapter_name) {
    let chapterNumber = 'Chapter -1';
    if (/(.*?)Chapter ([+]?([0-9]*[.])?[0-9]+)/.test(`${chapter_name}`)) {
        chapterNumber = /(.*?)Chapter ([+]?([0-9]*[.])?[0-9]+)/.exec(`${chapter_name}`)[0];
    }
    if (/(.*?)(Chapter|chapter) ([+]?([0-9]*[.])?[0-9]+)[(-|" ")]?[(]?(Part|part) ([+]?([0-9]*[.])?[0-9]+)[)]?/.test(`${chapter_name}`)) {
        chapterNumber = /(.*?)(Chapter|chapter) ([+]?([0-9]*[.])?[0-9]+)[(-|" ")]?[(]?(Part|part) ([+]?([0-9]*[.])?[0-9]+)[)]?/.exec(`${chapter_name}`)[0];
    }
    if(/(.*?)(Chapter|chapter) ([+]?([0-9]*[.])?[0-9]+)(.*?)[(]?(Part|part)? ?([+]?([0-9]*[.])?[0-9]+)[)]?/.test(`${chapter_name}`)) {
        chapterNumber = /(.*?)(Chapter|chapter) ([+]?([0-9]*[.])?[0-9]+)(.*?)[(]?(Part|part)? ?([+]?([0-9]*[.])?[0-9]+)[)]?/.exec(`${chapter_name}`)[0];
    }
    if (/(.*?)Chapter ([+]?([0-9]*[.])?[0-9]+) ?([(][0-9][)])/.test(`${chapter_name}`)) {
        chapterNumber = /(.*?)Chapter ([+]?([0-9]*[.])?[0-9]+) ?([(][0-9][)])/.exec(`${chapter_name}`)[0];
    }
    return new Promise(function (reslove, reject) {
        const query = {
            $or: [
                { "novel.novel_id": novel_id, "chapter_name": new RegExp(`${chapterNumber.replace(`Chapter `,`Chapter ﻿`)}\\b`, 'i') },
                { "novel.novel_id": novel_id, "chapter_name": new RegExp(`${chapterNumber.replace(`Chapter `,`Chapter ﻿`)}\\b`, 'i') },
                { "novel.novel_id": novel_id, "chapter_name": new RegExp(`${chapterNumber.replace(`Chapter `,`Chapter `)}\\b`, 'i') },

                { "novel.novel_id": novel_id, "chapter_name": new RegExp(`${chapterNumber}\\b`, 'i') },
                //{ "novel.novel_id": novel_id, "chapter_content": new RegExp(`<(h3|h4|p)>${chapterNumber}\\b`, 'i') },
                { "novel.novel_id": novel_id, "chapter_name": new RegExp(`${chapter_name.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")}`, 'i') },
                { "novel.novel_id": novel_id, "chapter_name": new RegExp(`${chapter_name.replace(`'`, `’`).replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")}`, 'i') }
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

let checkNovelExits = function (novel_name, novel_id) {
    return new Promise(function (reslove, reject) {
        Novel.findOne({
            $or: [
                { novel_name: new RegExp(`^${novel_name.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")}$`, 'i') },
                { novel_name: new RegExp(`^${novel_name.replace(`'`, `’`).replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")}$`, 'i') },
                { novel_name: novel_name },
                { novel_id: novel_id.trim() },

            ]
        }, function (err, novel) {
            if (!err) {
                if (novel) {
                    reslove(novel)
                } else {
                    reslove(null);
                }
            } else {
                reslove(null)
            }
        }).sort({ crawler_date: -1 }).limit(1);
    });
}

const crawler_quece = new Queue(getNovel, { concurrent: 1 });
crawler_quece.on('task_finish', async function (taskId, result, stats) {
    console.log(result)
});
if(process.env.TIME_CRAWLER) {
    const job = schedule.scheduleJob(process.env.TIME_CRAWLER, async function() {
        getNovelUrls(1,3);
    });
}

if(process.env.TIME_CRAWLER_2) {
    const job_30_page = schedule.scheduleJob(process.env.TIME_CRAWLER_2, async function() {
        getNovelUrls(4,34);
    });
}

if(process.env.TIME_RESET_VIEWTODAY) {
    const jobResetView = schedule.scheduleJob(process.env.TIME_RESET_VIEWTODAY, function() {
        try {
            Novel.updateMany({}, { viewToDay: 0 }, function(err, novels) {
                if (!err) {
                    console.log("update thanh cong")
                }
            });
        } catch (err) {
    
        }
    });
    
}

module.exports = router;
