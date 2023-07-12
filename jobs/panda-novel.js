const puppeteer = require('puppeteer-extra')
const axios = require('axios')
const utf8 = require('utf8')
// const StealthPlugin = require('puppeteer-extra-plugin-stealth')
// puppeteer.use(StealthPlugin())
const readline = require('readline');
const fs = require("fs");
let express = require('express');
let router = express.Router();
const request = require('request');
const CloudflFirstTime = 15000; //10s
const gapInTimes = 800; //1s
const Novel = require('../models/novel');
// const Logs = require('../models/logModel');
const Chapter = require('../models/chapter');
const Panda = require('../models/panda');
const CacheService = require('../service/cache_service');
const cacheHelper = new CacheService();
const slug = require('slug')
const schedule = require('node-schedule');
const userAgent = require('user-agents');
const { Readable } = require('stream');
const ftp = require("basic-ftp");
const {executablePath} = require('puppeteer');
const labels = [
    'Discord link for quickest updates of your favourate novels: https://discord.gg/novelcommunity',
    'Discord link for Pandanovel, for quick updates > https://discord.gg/Gmb86aUSFP',
    'If you any error ( broken links,etc....). Please keep reading on our NEWNOVEL.ORGThank you readers!',
    'Discord link for quickest updates of your favorite novels: https://discord.gg/novelcommunity',
    '<p> ?α?dαηθνε| </p>',
    'ƥαṇdαηθνε|',
    'ƥαṇdα- ηθνε|·ƈθm',
    'ƥαṇdα-ηθνε|·ƈθm',
    'panda novel',
    'ραпdα -n૦νe| , c૦m',
    'ραпdαn૦νel',
    'ραпdα- n૦νe|`c,0m',
    'eαglesnovel`c,om',
    'eαglesn૦νel',
    'ραпdα---n૦νa| сom',
    'pαndα`noνɐ1--сoМ',
    'ραпdα nᴏνa| сom',
    'pαndα,noνɐ1,сoМ',
    'ραпdα nᴏνɐ| сom ***',
    'pαпdα`noνɐ1`сoМ',
    'pαndα`noνɐ1~сoМ',
    'pαndα`noνɐ1~сoМ',
    'pαпdαnoνɐ1сoМ',
    'ραпdα `nᴏνɐ| сom',
    'ραпdα nᴏνɐ| сom',
    'pαпᵈα-noνɐ1·сoМ',
    'pαпdα Й?νê|,сòМ',
    'please visit pαпᵈα-:)ɴᴏᴠᴇ1.co)m',
    'pαndα noνɐ1,сoМ',
    'pαndα noνɐ1,сoМ',
    'pαпᵈα-noνɐ1.сoМ',
    'ραпdα-nᴏνɐ|-сom',
    'pαndα-noνɐ1,сoМ',
    'pαndα noνɐ1,сoМ',
    '<novelsnext>please visit p\u03B1\u043F\u1D48\u03B1-:)\u0274\u1D0F\u1D20\u1D071.co)m<\/novelsnext>',
    'ραпdα nᴏνɐ| сom',
    'pαпᵈα-:)ɴᴏᴠᴇ1.co)m',
    'ραпdα Йᴏνê|(сòm)',
    '<p>　&nbsp;　</p>',
    '<p>　　　 </p>',
    '<p>　　　 </p>',
    '<p>　　　　　　 </p>',
    '<p>　　　　　　 </p>',
    '<p>　　 </p>',
    '<p>　　 </p>',
    'pαпdα-ňᴏνêι·сóМ',
    'pǎпdǎ Йᴏνê1,сòМ',
    'ραпdα Йᴏνêl(сòm)',
    'ραпdα Йᴏνêl(сòm)',
    'ραпdǎ Йᴏνêl(сòm)',
    'pαпdα Йᴏνê1,сòМ',
    'pA ɴ,da-nᴏᴠᴇʟ.cᴏm',
    'pAn,D a-ɴᴏᴠ ᴇ1,c-o-m',
    'p An dD ɴᴏᴠᴇ1.cO,,m',
    '<novelsnext>please visit panda-:)ɴᴏᴠᴇ1.co)m</novelsnext>',
    'p、A,nd , A-n、o、ve,1',
    'please visit panda-:)ɴᴏᴠᴇ1.co)m',
    'p-A- n-d-A--n-0-v--e-1、(com',
    'p-n0v,e1、c--o-m',
    'pAn,D a-ɴᴏᴠ ᴇ1,c-o-m',
    'pA ɴ,da-nᴏᴠᴇʟ.cᴏm',
    'please visit panda-:)ɴᴏᴠᴇ1.co)m',
    '<novelsnext>please visit panda-:)ɴᴏᴠᴇ1.co)m</novelsnext>',
    'pA ɴ,da-nᴏᴠᴇʟ.cᴏm',
    'pAn,Da n&lt;0,&gt;v,e1',
    'pAnD a(-)n0ve1.com',
    'pAn,Da n<0,>v,e1',
    'please visit p(anda-n0ve1.co)m',
    'p Anda nOve1.cO,m',
    'pA n,dan(-)0ve1.c0m',
    'p AndD nOve1.cO,m',
    'pAn,D a-n0ve1,c-o-m',
    'pAn,Da-n0v e1,c',
    'pA(nd)A no ve1',
    'pAn,da n<0,>v,e1',
    'p AndD nOve1.cO,m',
    'pA(nD)A no ve1',
    'please visit panda(-)N0ve1.co)m',
    'panda(-)N0ve1.co)m',
    'pAnDa (nov)e1',
    'pAn,da n&lt;0,&gt;v,e1',
    'p Anda nOve1.cO,m',
    'pAn,da n<0,>v,e1',
    'pAn,da n<0,>v,e1',
    'pand(a-n0vel.c)om',
    'pand(a-n0vel.c)om',
    'pAn-d a-n0ve1.com',
    'pA n,dan0ve1.c0m',
    'pAnda (nov)e1',
    'pAn,da-n0v e1,c',
    'p、A,nd A-n、o、ve,1',
    'p-A- n-d-A-n-0-v-e-1、(c)om',
    'pan(da-n0vel.c)om',
    'pan(da-n0vel.c)om',
    'pan-d a-n0vel.com',
    'For more chapters, please visit',
    'panda-n(0ve)l.com',
    'pandan(o)vel',
    'panda n(O)vel',
    'panda-n(0ve)l.com',
    'panda-n(0ve)l.com',
    'panda (nov)el',
    'A quick look at FreeWebNovel.Com will leave you more fulfilled.',
    'panda novel',
    'Panda Novel',
    'pAn-d a-n0ve1.com',
    'panda-n( 0 ve)l.com',

    'pan,da-n0v el,c',
    'pan,da-n0v el,c,m',
    'p anda nOvel.cO,m',
    'p anda nOvel.cO,m',
    'pan-d a-n0vel.com',
    'p-a- n-d-a-n-0-v-e-l、(c)om',
    'pA n,dan0vel.c0m',
    'pa(nd)a no vel',
    'pan,d a-n0vel,c-o-m',
    'pan,da-n0v el,c,m',
    'p、a,nd a-n、o、ve,l',
    'p-n0vel、com',
    '<o>,m',
    '</o>',
    'pan,da n<0,>v,el',
    'pan,da-n0v el,c,m',
    'pa(nd)a no vel',
    'pan,d a-n0vel,c-o-m',
    'For more chapters, please visit panda-n( 0 ve)l.com',
    'p-a- n-d-a-n-0-v-e-l、(c)om',
    'pan-d a-n0vel.com',
    'pan-d a-n0vel.com',
    'pan-d a-n0vel.com',
    'p-a- n-d-a-n-0-v-e-l、(c)om',
    'p-a- n-d-a-n-0-v-e-l、(c)om',
    'pA n,dan0vel.c0m',
    'ᴘᴀɴ ᴅᴀ ɴ ᴏᴠᴇʟ',
    'pa(nd)a novel',
    'pan,da n<0,>v,el',
    'pan,da n<0,>v,el',
    '-n0vel、com',
    'panda nOvel.cO,m',
    'pan,da-n0vel,c,m',
    'pᴀɴᴅᴀ ɴ(O)ᴠᴇʟ',
    'ρꪖꪕᦔꪖꪕ(ꪫ)ꪣꫀ​ꪶ',
    'p<ᴀɴᴅ>ᴀ-ɴ0ᴠᴇʟ',
    'p<ᴀɴᴅ>ᴀ-ɴ0ᴠᴇʟ、ᴄᴏᴍ',
    'ρꪖnᦔa (nꪫ)ꪣꫀ​ꪶ',
    'p-ᴀ-ɴ-ᴅ-ᴀ ɴ-0-ᴠ-ᴇ-ʟ、ᴄ(ᴏᴍ)',
    'For more chapters, please visit panda-n(0ve)l.com',
    'pan,da n<0,>v,el',
    'pan,da-n0vel,c-o-m',
    'p、a,nd a-n、o、ve,l',
    'panda (nov)el',
    'pan,da-n0vel,c',
    'pAn,dan0vel.c0m',
    'pan-da-n0vel.com',
    'p、a,nd a-n、o、ve,l',
    'p-n0vel、com',
    'pan,da-n0vel,c-o-m',
    'pan,da-n0vel,c,m',
    'p-a-n-d-a-n-0-v-e-l、(c)om',
    'panda (nov)el',
    'pan,da n<0,>v,el',
    'pan,da n&lt;0,&gt;v,el',
    'p<anda>',
    '</anda>',
    '-n0ve1、com',
    'ƥαṇdαsηθνε|',
    'ραпdαs `nᴏνɐ| сom',
    'ƥαṇdαsηθνε|·ƈθm',
    'ƥαṇdαs ηθνε|·ƈθm ﻿',
    'ƥαṇdαs ηθνε|·ƈθm',
    'Discord link for quickest updates of your favorite novels:  https://discord.gg/novelcommunity</p>',
    '<p>Discord link for Pandanovel, for quick updates &gt; https://discord.gg/Gmb86aUSFP</p>'
]

const cookie = [
    {
        "domain": ".zebranovel.com",
        "expirationDate": 1722822083,
        "hostOnly": false,
        "httpOnly": false,
        "name": "__gads",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "1",
        "value": "ID=65eb089d1a438c1a-22f763ed52e20061:T=1689126083:RT=1689128237:S=ALNI_MbJDlTsMvAMJat5Fwvd2FXiFnZUUQ",
        "id": 1
    },
    {
        "domain": ".zebranovel.com",
        "expirationDate": 1722822083,
        "hostOnly": false,
        "httpOnly": false,
        "name": "__gpi",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "1",
        "value": "UID=00000c1ff4b4a585:T=1689126083:RT=1689128237:S=ALNI_MbZRT6-KlAz2Q-l5-8eCM98n5S0rQ",
        "id": 2
    },
    {
        "domain": ".zebranovel.com",
        "expirationDate": 1723688243.909769,
        "hostOnly": false,
        "httpOnly": false,
        "name": "_ga",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "1",
        "value": "GA1.1.340617132.1689126084",
        "id": 3
    },
    {
        "domain": ".zebranovel.com",
        "expirationDate": 1723688243.909586,
        "hostOnly": false,
        "httpOnly": false,
        "name": "_ga_5WTW6SXR43",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "1",
        "value": "GS1.1.1689126083.1.1.1689128243.0.0.0",
        "id": 4
    },
    {
        "domain": ".zebranovel.com",
        "expirationDate": 1720663789.583992,
        "hostOnly": false,
        "httpOnly": true,
        "name": "cf_clearance",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "1",
        "value": "KVXytvI0BcoAvZ_HeIU1Wi2eUyB8j2qqrRCdK_8BDbI-1689127786-0-250",
        "id": 5
    },
    {
        "domain": ".zebranovel.com",
        "hostOnly": false,
        "httpOnly": false,
        "name": "googtrans",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": true,
        "storeId": "1",
        "value": "null",
        "id": 6
    },
    {
        "domain": "www.zebranovel.com",
        "expirationDate": 1689131386,
        "hostOnly": true,
        "httpOnly": false,
        "name": "cf_chl_2",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "1",
        "value": "4945249acc9e147",
        "id": 7
    },
    {
        "domain": "www.zebranovel.com",
        "hostOnly": true,
        "httpOnly": true,
        "name": "JSESSIONID",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": true,
        "storeId": "1",
        "value": "E01940F30F3DBB2619587D482B980388",
        "id": 8
    }
]

const jobDeleteLogoOfNovel = async function (novel_id) {
    const chapters = await Chapter.find({ "novel.novel_id": novel_id }).sort({ crawler_date: -1 }).limit(100);
    for (let i = 0; i < chapters.length; i++) {
        const chapter_id = chapters[i].chapter_id;
        let chapterContent = chapters[i].chapter_content;
        for (let j = 0; j < labels.length; j++) {
            chapterContent = chapterContent.replace(labels[j], '')
            chapterContent = chapterContent.replace(labels[j], '')
            chapterContent = chapterContent.replace(labels[j], '')
            chapterContent = chapterContent.replace(labels[j], '')
            chapterContent = chapterContent.replace(labels[j], '')
        }
        Chapter.updateOne({ "novel.novel_id": novel_id, chapter_id: chapter_id }, { chapter_content: chapterContent }, async function (err, data) {
            if (!err) {
                cacheHelper.delete(`chapter-${novel_id}-${chapter_id}`)
                console.log("update thanh cong !");

            } else {
                console.log(err)
            }
        });
    }

}
const writeLog = function (msg) {
    fs.appendFile('./log.txt', `${msg} \r\n`, function (err) {
        if (err) {
            // append failed
        } else {
            // done
        }
    })
}

const sendTele = function (message) {
    let chatId = '-1001913065449'
    let token = '6121475349:AAFSQwLQphC4c1LQDq6GE8D0cuolaSq4uyo'
    return new Promise(function (reslove, reject) {
        axios.get(`https://api.telegram.org/bot` + token + `/sendMessage?chat_id=` + chatId + `&text=` + utf8.encode(message))
            .then(response => {
                reslove(response)
            })
            .catch(error => {
                reject(error);
            });
    })
}
const arrays = [
    'https://www.panda-novel.com/content/dungeon-king-a-lady-knight-offered-by-my-goblins-2093-1664033/chapter-1',
    'https://www.panda-novel.com/content/the-strongest-assassin-reincarnates-in-another-world-2092-1664005/chapter-1',
    'https://www.panda-novel.com/content/transmigrated-as-the-perverted-young-master-2091-1663956/chapter-1',
    'https://www.panda-novel.com/content/my-interracial-harem-of-beautiful-queens-2090-1663920/chapter-1',
    'https://www.panda-novel.com/content/dread-sovereign-monster-girl-harem-2089-1663880/chapter-1',
    'https://www.panda-novel.com/content/one-wish-to-own-the-world-2088-1663819/chapter-1',
    'https://www.panda-novel.com/content/not-so-an-extra-2087-1663789/chapter-1',

];

const jobPanDa = schedule.scheduleJob('*/60 * * * *', async function () {

    let browser = await puppeteer.launch({
        "headless": false,
        args: [
            '--window-size=1920,1080',
        ]
    });

    let page = await browser.newPage();


    await page.setDefaultNavigationTimeout(200000);
    await page.setRequestInterception(true);
    // await page.authenticate({
    //     username: 'user49252',
    //     password: 'nMrWdifTMe'
    // })

    // await page.setViewport({ width: 350, height: 700});s
    page.on('request', (req) => {
        //req.resourceType() == 'stylesheet' || req.resssourceType() == 'font'
        if (req.resourceType() == 'font') {
            req.abort();
        } else {
            req.continue();
        }
    });

    await page.goto('https://www.panda-novel.com/top');
    await page.waitForSelector(".app-logo a", { timeout: 100000 });


    try {
        await page.waitForSelector('button[i-id="cancel"]', { timeout: 5000 });
        await page.click('button[i-id="cancel"]', { timeout: 5000 });
    } catch (error) {
        try {
            await page.click('button[i-id="ok"]', { timeout: 5000 });
        } catch (error) {
        }
    }




    let results = [];


    const novels = await Panda.find({}, { novel_name: 1, last_chapter_url: 1 }).sort({ updated_date: 1 }).lean();
    const names_sort = await Novel.find({ novel_name: { $in: novels.map(a => a.novel_name) } }, { novel_name: 1, _id: 0 }).sort({ viewToDay: -1 });

    for (let i = 0; i < names_sort.length; i++) {
        const found = novels.find(element => element.novel_name == names_sort[i].novel_name);
        results.push(found);
    }
    console.log(`Hiện đang có tổng ${results.length} truyện lấy từ panda novel !`)




    for (let nov = 0; nov < results.length; nov++) {

        const novel_item = results[nov];
        await getNewChapters(page, novel_item, nov);


    };


    await browser.close();


});



router.get('/startJob', async function (req, res) {
    job();
    return res.json({
        success: true,
        msg: 'Hệ thống đang xử lý'
    });
});


router.get('/getNewNovels', async function (req, res) {
    getNewsNovel();
    return res.json({
        success: true,
        msg: 'Hệ thống đang xử lý'
    });
});

// router.get('/fixLogo', async function (req, res) {
//     let novel_ids = [];
//     console.log("hahahaha")
//     await Panda.find({}, async function (err, panda_novels) {
//         if (!err) {
//             for (let j = 0; j < panda_novels.length; j++) {
//                 let novel_info = await checkNovelName(panda_novels[j].novel_name);
//                 if (novel_info) {
//                     console.log(novel_info.novel_id)
//                     Novel.updateOne({novel_id: novel_info.novel_id}, {isPanda: true}, function(err,data) {
//                         if(!err) {
//                             console.log("update thành công")
//                         }
//                     })
//                 }
//             }
//             // console.log(novel_ids)
//             // for (let _idx = 0; _idx < novel_ids.length; _idx++) {
//             //     const novel_id = novel_ids[_idx];
//             //     await Chapter.find({ "novel.novel_id": novel_id }, async function (err, chapters) {
//             //         if (!err) {
//             //             for (let i = 0; i < chapters.length; i++) {
//             //                 let chapterContent = chapters[i].chapter_content;

//             //                 for (let j = 0; j < labels.length; j++) {
//             //                     chapterContent = chapterContent.replace(labels[j], '')
//             //                     chapterContent = chapterContent.replace(labels[j], '')
//             //                     chapterContent = chapterContent.replace(labels[j], '')
//             //                 }

//             //                 await Chapter.updateOne({ "novel.novel_id": novel_id, chapter_id: chapters[i].chapter_id }, { chapter_content: chapterContent }, function (err, data) {
//             //                     if (!err) {
//             //                         cacheHelper.delete(`chapter-${novel_id}-${chapters[i].chapter_id}`)
//             //                         console.log("update thanh cong !")
//             //                     }
//             //                 })
//             //             }
//             //         }
//             //     }).sort({ crawler_date: -1 }).limit(50);
//             // }
//         }

//     }).lean();
//     res.json({
//         msg: " dang xu ly"
//     });


// });
router.get('/fixLogoV2', async function (req, res) {

    const novel_ids = await Novel.find({ isPanda: true }, { novel_id: 1, _id: 0 }).lean().sort({ viewToDay: -1 }).limit(800);
    res.json({
        novel_ids: novel_ids,
        msg: " dang xu ly"
    });
    for (let _idx = 0; _idx < novel_ids.length; _idx++) {
        const novel_id = novel_ids[_idx].novel_id;
        await Chapter.find({ "novel.novel_id": novel_id }, async function (err, chapters) {
            if (!err) {
                for (let i = 0; i < chapters.length; i++) {
                    let chapterContent = chapters[i].chapter_content;
                    for (let tag_idx = 0; tag_idx < labels.length; tag_idx++) {
                        chapterContent = chapterContent.replace(labels[tag_idx], "");
                        chapterContent = chapterContent.replace(labels[tag_idx], "");
                        chapterContent = chapterContent.replace(labels[tag_idx], "");
                        chapterContent = chapterContent.replace(labels[tag_idx], "");
                    }
                    Chapter.updateOne({ "novel.novel_id": novel_id, chapter_id: chapters[i].chapter_id }, { chapter_content: chapterContent }, function (err, data) {
                        if (!err) {
                            cacheHelper.delete(`chapter-${novel_id}-${chapters[i].chapter_id}`)
                            console.log("update thanh cong !")
                        }
                    })
                }
            }
        }).sort({ crawler_date: -1 }).limit(30);
    }


});

// router.get('/fixLogoV3', async function (req, res) {
//     const water_mark = [
//         'ɴᴇᴡ ɴᴏᴠᴇʟ ᴄʜᴀᴘᴛᴇʀs ᴀʀᴇ ᴘᴜʙʟɪsʜᴇᴅ ᴏɴ ꜰʀᴇᴇᴡᴇʙɴ(ᴏᴠᴇ)ʟ.ᴄ(ᴏ)ᴍ',
//         'If you want to read more chapters, please visit NovelBin.Com to experience faster update speed',
//         'If you want to read more chapters, please visit NovelBin.Net to experience faster update speed',
//         'This chapter upload first at NovelNext.com',
//         'If you want to read more chapters, please visit NovelNext.com to experience faster update speed',
//         'If you want to read more chapters, please visit NovelNext.Com to experience faster update speed',
//         'Bookmark this website Free(web)nᴏvel.(c)om to update the latest novels.',
//         'Panda Novel',
//         'Panda Novel',
//         'Thank you for reading on myAllNovelFull.Com',
//         'ɴᴇᴡ ɴᴏᴠᴇʟ ᴄʜᴀᴘᴛᴇʀs ᴀʀᴇ ᴘᴜʙʟɪsʜᴇᴅ ᴏɴ ꜰʀᴇᴇᴡᴇʙɴ(ᴏ)ᴠᴇʟ. ᴄᴏᴍ',
//         'ɪꜰ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ʀᴇᴀᴅ ᴍᴏʀᴇ ᴄʜᴀᴘᴛᴇʀs, ᴘʟᴇᴀsᴇ ᴠɪsɪᴛ ꜰʀᴇᴇᴡᴇʙɴ(o)ᴠᴇʟ.ᴄᴏᴍ ᴛᴏ ᴇxᴘᴇʀɪᴇɴᴄᴇ ꜰᴀsᴛᴇʀ ᴜᴘᴅᴀᴛᴇ sᴘᴇᴇᴅ.',
//         'ʀᴇᴀᴅ ʟᴀᴛᴇsᴛ ᴄʜᴀᴘᴛᴇʀs ᴀᴛ ꜰʀᴇᴇᴡᴇʙɴ(ᴏ)ᴠᴇʟ. ᴄoᴍ ᴏɴʟʏ.',
//         'ᴛʜɪs ᴄʜᴀᴘᴛᴇʀ ɪs ᴜᴘᴅᴀᴛᴇ ʙʏ ꜰʀᴇᴇᴡᴇʙɴ(o)ᴠᴇʟ. ᴄᴏᴍ.',
//         'ᴜᴘᴅᴀᴛᴇ ꜰʀᴏᴍ ꜰʀᴇᴇᴡᴇʙɴ(ᴏ)ᴠᴇʟ. ᴄᴏᴍ.',
//         'New novel chapters are published on  Freeᴡebn(ᴏ)vel.cᴏm.',
//         'Follow current novels on  Freewebn(o)vel.com.',
//         'This chapter is updated by  Freewebn(o)vel.cᴏm',
//         'The source of this content is  Freeᴡebn(ᴏ)vel.cᴏm.',
//         'Visit (Myb o xn ov e l. com) to read, pls!',
//         'Continue reading on MYB0X N0 VEL. COM',
//         'New novel chapters are published on Freewebnᴏvel.cᴏm',
//         'Follow current novels on Freeᴡebnovel.cᴏm',
//         'The source of this content is Freewebnᴏvel.com',
//         'This chapter is updated by Freeᴡebnᴏvel.cᴏm',
//         'Freeᴡebnᴏvel.cᴏm',
//         'Freewebnᴏvel.com',
//         'Freeᴡebnovel.cᴏm',
//         'Freewebnᴏvel.cᴏm',
//         'Freeᴡebn(ᴏ)vel.cᴏm',
//         'Freewebn(o)vel.com',
//         'Freewebn(o)vel.cᴏm',
//         'ꜰʀᴇᴇᴡᴇʙɴoᴠᴇʟ.ᴄᴏᴍ',
//         'ꜰʀᴇᴇ ᴡᴇʙ ɴ(ᴏ)ᴠᴇʟ. ᴄᴏᴍ',
//         'ꜰʀᴇᴇ ᴡᴇʙ ɴ(o)ᴠᴇʟ',
//         'ꜰʀᴇᴇ ᴡᴇʙ ɴ(o)ᴠᴇʟ. ᴄoᴍ',
//         'ꜰʀᴇᴇᴡᴇʙɴᴏᴠᴇʟ.ᴄᴏᴍ',
//         'Visit (Mybo x novel. com) to read, pls!',
//         'If you want to read more chapters, Please visit Libread.com to experience faster update speed',
//         'If you want to read more chapters, Please visit Libread.com to experience faster update speed.',
//         'Visit ʟɪʙʀᴇᴀᴅ.ᴄᴏᴍ for a better_user experience',
//         'Visit ʟɪʙʀᴇᴀᴅ.ᴄoᴍ, for the best no_vel_read_ing experience',
//         'The latest_epi_sodes are on_the ʟɪʙʀᴇᴀᴅ.ᴄᴏᴍ.website.',
//         'New novel ᴄhapters are published on Libread.cᴏm.',
//         'Follow current novels on Libread.ᴄom.',
//         'The source of this ᴄontent is  Libread.com.',
//         'This chapter is updated by  Libread.cᴏm.',
//         'Support us at FreeWebNovel.Com.',
//         'We are FreeWebNovel.Com, find us on google.',
//         "When you're just trying to make great content at FreeWebNovel.Com.",
//         "Find the original at FreeWebNovel.Com.",
//         "This novel is available on FreeWebNovel.Com.",
//         "Search FreeWebNovel.Com for the original.",
//         "The Novel will be updated first on Freeᴡebnᴏvel. cᴏm . Come back and continue reading tomorrow, everyone!😉",
//         "The Novel will be updated first on Freeᴡebn(ᴏ)vel. cᴏm . Come back and continue reading tomorrow, everyone!😉",
//         "If you want to read more chapters, Please visit Freewebn(ᴏv)el. c0m to experience faster update speed."
//     ]

//     //  Chapter.find({  }, async function (err, chapters) {
//     //     if (!err) {
//     //         for (let i = 0; i < chapters.length; i++) {
//     //             let chapterContent = chapters[i].chapter_content;
//     //             const novel_id = chapters[i].novel.novel_id
//     //             const tags = [
//     //                 'ɴᴇᴡ ɴᴏᴠᴇʟ ᴄʜᴀᴘᴛᴇʀs ᴀʀᴇ ᴘᴜʙʟɪsʜᴇᴅ ᴏɴ ꜰʀᴇᴇᴡᴇʙɴ(ᴏ)ᴠᴇʟ. ᴄᴏᴍ',
//     //                 'ɪꜰ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ʀᴇᴀᴅ ᴍᴏʀᴇ ᴄʜᴀᴘᴛᴇʀs, ᴘʟᴇᴀsᴇ ᴠɪsɪᴛ ꜰʀᴇᴇᴡᴇʙɴ(o)ᴠᴇʟ.ᴄᴏᴍ ᴛᴏ ᴇxᴘᴇʀɪᴇɴᴄᴇ ꜰᴀsᴛᴇʀ ᴜᴘᴅᴀᴛᴇ sᴘᴇᴇᴅ.',
//     //                 'ʀᴇᴀᴅ ʟᴀᴛᴇsᴛ ᴄʜᴀᴘᴛᴇʀs ᴀᴛ ꜰʀᴇᴇᴡᴇʙɴ(ᴏ)ᴠᴇʟ. ᴄoᴍ ᴏɴʟʏ.',
//     //                 'ᴛʜɪs ᴄʜᴀᴘᴛᴇʀ ɪs ᴜᴘᴅᴀᴛᴇ ʙʏ ꜰʀᴇᴇᴡᴇʙɴ(o)ᴠᴇʟ. ᴄᴏᴍ.',
//     //                 'ᴜᴘᴅᴀᴛᴇ ꜰʀᴏᴍ ꜰʀᴇᴇᴡᴇʙɴ(ᴏ)ᴠᴇʟ. ᴄᴏᴍ.',
//     //                 'New novel chapters are published on  Freeᴡebn(ᴏ)vel.cᴏm.',
//     //                 'Follow current novels on  Freewebn(o)vel.com.',
//     //                 'This chapter is updated by  Freewebn(o)vel.cᴏm',
//     //                 'ɴᴇᴡ ɴᴏᴠᴇʟ ᴄʜᴀᴘᴛᴇʀs ᴀʀᴇ ᴘᴜʙʟɪsʜᴇᴅ ᴏɴ ꜰʀᴇᴇᴡᴇʙɴ(ᴏ)ᴠᴇʟ. ᴄᴏᴍ',
//     //                 'ʀᴇᴀᴅ ʟᴀᴛᴇsᴛ ᴄʜᴀᴘᴛᴇʀs ᴀᴛ ꜰʀᴇᴇᴡᴇʙɴ(ᴏ)ᴠᴇʟ. ᴄoᴍ ᴏɴʟʏ.',
//     //                 'ᴛʜɪs ᴄʜᴀᴘᴛᴇʀ ɪs ᴜᴘᴅᴀᴛᴇ ʙʏ ꜰʀᴇᴇᴡᴇʙɴ(o)ᴠᴇʟ. ᴄᴏᴍ.',
//     //                 'ᴜᴘᴅᴀᴛᴇ ꜰʀᴏᴍ ꜰʀᴇᴇᴡᴇʙɴ(ᴏ)ᴠᴇʟ. ᴄᴏᴍ.',
//     //                 'Follow current novels on  Freewebn(o)vel.com.',
//     //                 'The source of this content is  Freeᴡebn(ᴏ)vel.cᴏm.',
//     //                 'Visit (Myb o xn ov e l. com) to read, pls!',
//     //                 'Continue reading on MYB0X N0 VEL. COM',
//     //                 'New novel chapters are published on Freewebnᴏvel.cᴏm',
//     //                 'Follow current novels on Freeᴡebnovel.cᴏm',
//     //                 'The source of this content is Freewebnᴏvel.com',
//     //                 'This chapter is updated by Freeᴡebnᴏvel.cᴏm',
//     //                 'Freeᴡebnᴏvel.cᴏm',
//     //                 'Freewebnᴏvel.com',
//     //                 'Freeᴡebnovel.cᴏm',
//     //                 'Freewebnᴏvel.cᴏm',
//     //                 'Freeᴡebn(ᴏ)vel.cᴏm',
//     //                 'Freewebn(o)vel.com',
//     //                 'Freewebn(o)vel.cᴏm',
//     //                 'ꜰʀᴇᴇᴡᴇʙɴoᴠᴇʟ.ᴄᴏᴍ',
//     //                 'ꜰʀᴇᴇ ᴡᴇʙ ɴ(ᴏ)ᴠᴇʟ. ᴄᴏᴍ',
//     //                 'ꜰʀᴇᴇ ᴡᴇʙ ɴ(o)ᴠᴇʟ',
//     //                 'ꜰʀᴇᴇ ᴡᴇʙ ɴ(o)ᴠᴇʟ. ᴄoᴍ',
//     //                 'ꜰʀᴇᴇᴡᴇʙɴᴏᴠᴇʟ.ᴄᴏᴍ',
//     //                 'This chapter is updated by',
//     //                 'New novel chapters are published on .',
//     //                 'Visit (Mybo x novel. com) to read, pls!',
//     //                 'This chapter upload first at Freewebnovel.Com',
//     //                 "This chapter upload first at Freewebnovel.Com",
//     //                 "The Novel will be updated first on Freeᴡebn(ᴏ)vel. cᴏm . Come back and continue reading tomorrow, everyone!😉",
//     //                 'Support us at FreeWebNovel.Com.',
//     //                 'We are FreeWebNovel.Com, find us on google.',
//     //                 "When you're just trying to make great content at FreeWebNovel.Com.",
//     //                 "Find the original at FreeWebNovel.Com.",
//     //                 "This novel is available on FreeWebNovel.Com.",
//     //                 "Search FreeWebNovel.Com for the original.",
//     //                 "The Novel will be updated first on Freeᴡebnᴏvel. cᴏm . Come back and continue reading tomorrow, everyone!😉",
//     //                 "If you want to read more chapters, Please visit Freewebn(ᴏv)el. c0m to experience faster update speed."
//     //             ]
//     //             for (let tag_idx = 0; tag_idx < tags.length; tag_idx++) {
//     //                 chapterContent = chapterContent.replace(tags[tag_idx], "");
//     //                 chapterContent = chapterContent.replace(tags[tag_idx], "");
//     //                 chapterContent = chapterContent.replace(tags[tag_idx], "");
//     //             }


//     //             await Chapter.updateOne({ "novel.novel_id": novel_id, chapter_id: chapters[i].chapter_id }, { chapter_content: chapterContent }, function (err, data) {
//     //                 if (!err) {
//     //                     console.log(`chapter-${novel_id}-${chapters[i].chapter_id}`, 'cache_id')
//     //                     cacheHelper.delete(`chapter-${novel_id}-${chapters[i].chapter_id}`)
//     //                     console.log("update thanh cong !")
//     //                 }
//     //             })
//     //         }
//     //     }
//     // }).sort({ created_date: -1 }).limit(80);


//     Logs.find({}, { chapterId: 1, novelId: 1, link_novel_usb:1, _id: 0 }, async function (err, logs) {
//         for (let j = 0; j < logs.length; j++) {
//             const log_item = logs[j];
//             const chap = await Chapter.findOne({ "novel.novel_id": log_item.novelId, "chapter_id": log_item.chapterId }).lean();
//             if(chap) {
//                 let chapter_content = chap.chapter_content;
//                 if(chapter_content.includes('Chapter 664')) {
//                     console.log(log_item.link_novel_usb)
//                 }
//                 for (let i = 0; i < water_mark.length; i++) {
//                     chapter_content = chapter_content.replace(water_mark[i], '')
//                     chapter_content = chapter_content.replace(water_mark[i], '')
//                     chapter_content = chapter_content.replace(water_mark[i], '')
//                 }

//                  Chapter.updateOne({ "novel.novel_id": log_item.novelId, chapter_id: log_item.chapterId }, { chapter_content: chapter_content }, function (err, data) {
//                     if (!err) {
//                         cacheHelper.delete(`chapter-${log_item.novelId}-${log_item.chapterId}`)
//                         console.log("update thanh cong !")
//                     } else {
//                         console.log(err)
//                     }
//                 });
//             }
//         }
//     }).lean().sort({created_date : -1});
//     let novel_ids = []
//     await Panda.find({}, async function (err, panda_novels) {
//         if (!err) {
//             for (let j = 0; j < panda_novels.length; j++) {
//                 let novel_info = await checkNovelName(panda_novels[j].novel_name);
//                 if (novel_info) {
//                     novel_ids.push(novel_info.novel_id)
//                 }
//             }
//             for (let _idx = 0; _idx < novel_ids.length; _idx++) {
//                 const novel_id = novel_ids[_idx];
//                 await Chapter.find({ "novel.novel_id": novel_id }, async function (err, chapters) {
//                     if (!err) {
//                         for (let i = 0; i < chapters.length; i++) {
//                             let chapterContent = chapters[i].chapter_content;

//                             for (let j = 0; j < labels.length; j++) {
//                                 chapterContent = chapterContent.replace(labels[j], '')
//                                 chapterContent = chapterContent.replace(labels[j], '')
//                                 chapterContent = chapterContent.replace(labels[j], '')
//                             }

//                             await Chapter.updateOne({ "novel.novel_id": novel_id, chapter_id: chapters[i].chapter_id }, { chapter_content: chapterContent }, function (err, data) {
//                                 if (!err) {
//                                     cacheHelper.delete(`chapter-${novel_id}-${chapters[i].chapter_id}`)
//                                     console.log("update thanh cong !")
//                                 }
//                             })
//                         }
//                     }
//                 }).sort({ crawler_date: -1 }).limit(250);
//             }
//         }

//     }).lean();
//     res.json({
//         msg: " dang xu ly",
//     });


// });
// router.get('/getChapters', function (req, res) {
//     crawl();
//     return res.json({
//         success: true,
//         msg: 'Hệ thống đang xử lý'
//     });
// })

let getNewsNovel = async function () {
    //user49278:DXFovHmPtA@154.53.46.29:49278
    const browser = await puppeteer.launch({
        "headless": false,
        args: [
            '--window-size=1920,1080',
            // '--proxy-server=154.53.46.29:49278'
        ]
    });

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(200000);
    await page.setRequestInterception(true);
    // await page.authenticate({
    //     username: 'user49278',
    //     password: 'DXFovHmPtA'
    // })
    page.on('request', (req) => {
        //req.resourceType() == 'stylesheet' || req.resourceType() == 'font'
        if (false) {
            req.abort();
        } else {
            req.continue();
        }
    });

    for (let _page = 1; _page < 100; _page++) {
        await page.goto(`https://www.panda-novel.com/newnovel/${_page}`);
        await page.waitForSelector(".body-title span", { timeout: 100000 });
        try {
            await page.waitForSelector('button[i-id="cancel"]', { timeout: 5000 });
            await page.click('button[i-id="cancel"]', { timeout: 5000 });
        } catch (error) {
            try {
                await page.click('button[i-id="ok"]', { timeout: 5000 });
            } catch (error) {
            }
        }
        await page.waitForSelector(".body-title span", { timeout: 100000 });
        const novels = await page.evaluate(() => {
            let results = [];
            const novelUrls = document.querySelectorAll('.novel-ul .novel-li');
            novelUrls.forEach((novel) => {
                let novelItem = {};
                try {
                    novelItem['novel_url'] = novel.querySelector('.mask-link').href;
                    novelItem['novel_name'] = novel.querySelector('.novel-desc h4').innerText
                } catch (err) {
                    console.log(err)
                }
                results.push(novelItem);
            });
            return results;
        });
        // console.log(novels);
        for (let index = 0; index < novels.length; index++) {
            const novelInfo = novels[index];
            const checkNovel = await checkNovelName(novelInfo.novel_name);
            if (!checkNovel) {
                const selectorPage = `a[href="${novelInfo.novel_url.replace('https://www.panda-novel.com', '')}"]`;
                const btn_novel_info = await page.$(selectorPage);
                if (btn_novel_info) {

                    try {
                        await btn_novel_info.click();
                        await page.waitForSelector(".btn-read", { timeout: 10000 });
                        let novel_link = await page.$eval('.btn-read a', element => element.href);
                        console.log(novel_link)
                        writeLog(`'${novel_link}',`);
                        await page.waitForTimeout(600);
                        await page.goBack();
                        if (page.url().includes('#google')) {
                            await page.reload();
                        }
                    } catch (error) {
                        console.log(error)
                        await page.goBack();
                    }


                }
            }
        }
    }



}

let job = async function () {
    const browser = await puppeteer.launch({
        "headless": true,
        args: ["--no-sandbox", "--disabled-setupid-sandbox"],
        // executablePath: executablePath()
    });


    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(200000);
    // await page.setRequestInterception(true);
    // page.on('request', (req) => {
    //     if (req.resourceType() == 'font') {
    //         req.abort();
    //     } else {
    //         req.continue();
    //     }
    // });

    // await page.setViewport({
    //     width: 1920,
    //     height: 1080,
    //     deviceScaleFactor: 1,
    //     hasTouch: false,
    //     isMobile: false,
    //     isLandscape: false,
    // });
    // await page.setExtraHTTPHeaders({
    //     'Accept-Language': 'en-US,en;q=0.9',
    // });
    await page.goto('https://www.zebranovel.com/top');
    await page.waitForSelector(".app-logo a", { timeout: 10000 });

    try {
        await page.waitForSelector('button[i-id="cancel"]', { timeout: 5000 });
        await page.click('button[i-id="cancel"]', { timeout: 5000 });
    } catch (error) {
        try {
            await page.click('button[i-id="ok"]', { timeout: 5000 });
        } catch (error) {
        }
    }



    const isStart = 1
    if (isStart == '1' || isStart == '2') {
        let results = [];

        if (isStart == '1') {
            const novels = await Panda.find({}, { novel_name: 1, last_chapter_url: 1 }).sort({ updated_date: 1 }).lean();
            const names_sort = await Novel.find({ novel_name: { $in: novels.map(a => a.novel_name) } }, { novel_name: 1, _id: 0 }).sort({ viewToDay: -1 });

            for (let i = 0; i < names_sort.length; i++) {
                const found = novels.find(element => element.novel_name == names_sort[i].novel_name);
                results.push(found);
            }
            console.log(`Hiện đang có tổng ${results.length} truyện lấy từ panda novel !`)
        }

        if (isStart == '2') {
            results = arrays;
            console.log(`Hiện đang có tổng ${results.length} truyện lấy từ mảng array !`)
        }

        let start = 0;
        let end = results.length;
        if (Number.isInteger(start) && Number.isInteger(end)) {

        } else {
            start = 0;
            end = results.length;
        }

        for (let nov = start; nov < end; nov++) {
            const novel_item = results[nov];
            await getNewChapters(page, novel_item, nov);
        };

        await browser.close();
    } else {
        console.log("bye bye!");
        await browser.close();
    }
}

let getNewChapters = async function (page, novel_item, chapter_index = 1) {

    const last_chapter_url = (novel_item.last_chapter_url || novel_item.trim());
    const current_novel_name = novel_item.novel_name ? novel_item.novel_name : null;
    try {
        // await page.waitForSelector('.app-logo a', { timeout: 95000 });
        // await page.click(".app-logo a");


        // await page.waitForSelector(".section-title a.more", { timeout: 80000 });

        // let link = last_chapter_url.replace('panda-novel.com', 'zebranovel.com');
        // link = link.replace('lightnovel-pub.com', 'zebranovel.com');


        let link = last_chapter_url.replace('panda-novel.com', 'zebranovel.com');
        link = link.replace('lightnovel-pub.com', 'zebranovel.com');


        console.log("Going to link", link);
        try {
            await page.goto(link, { timeout: 90000 });

        } catch (error) {
            console.log(error)
            return 1
        }
        // await page.evaluate((link) => {
        //     let a = document.querySelector('.section-title a.more');
        //     a.href = link;
        // }, link);
        // await page.click('.section-title a.more');


        try {
            await page.waitForSelector('#novelArticle2 p:nth-child(4)', { timeout: 5000 });
            try {
                await page.click('button[i-id="cancel"]');
            } catch (error1) {

            }
        } catch (error) {
            const elementHandle = await page.waitForSelector('iframe', { timeout: 1000 });
            const frame = await elementHandle.contentFrame();
            var captcha = await frame.waitForSelector('.mark', { timeout: 1000 });
            await captcha.evaluate(b => b.click());
            await page.waitForSelector('#novelArticle2 p:nth-child(4)');
        }

        // try {
        //     await page.waitForSelector("#novelArticle2 p:nth-child(4)", { timeout: timeout });
        // } catch (error) {
        //     fs.appendFile('./error_panda.txt', `${link} \r\n`, function (err) {
        //         if (err) {
        //             // append failed
        //         } else {
        //             // done
        //         }
        //     })
        //     return 1;
        // }
        while (true) {

            // try {
            //     await page.waitForSelector('button[i-id="cancel"]', { timeout: 3000 });
            //     await page.click('button[i-id="cancel"]');
            // } catch (error2) {
            //     console.log(error2)
            // }

            try {
                await page.evaluate(() => {
                    document.querySelectorAll(".novel-content script").forEach(el => el.remove());
                    document.querySelectorAll('div[class="novel-ins"]').forEach(el => el.remove());
                    document.querySelectorAll('div[class="novel-ins2"]').forEach(el => el.remove());

                    document.querySelectorAll('div[class="google-auto-placed ap_container"]').forEach(el => el.remove())
                    document.querySelectorAll('#novelArticle2 del').forEach(el => el.remove())
                    document.querySelectorAll('#novelArticle2 sub').forEach(el => el.remove())
                    document.querySelectorAll('#novelArticle2 novelnext').forEach(el => el.remove())
                })
            } catch (error) {
                console.log(error, "error 1")
            }


            try {
                let chapterContent = await page.$eval('#novelArticle2', element => element.innerHTML);
                const Nextbtnhtml = await page.$eval('.novel-footer .btn.btn-next', element => element.outerHTML);



                let chapterName = await page.$eval('.breadcrumb-content .breadcrumb li:nth-child(3) span', element => element.innerText);
                chapterName = chapterName.trim().replace(`&#xFEFF;`, '');
                let novel_name = await page.$eval('.breadcrumb-content .breadcrumb li:nth-child(2) h1', element => element.innerText);
                novel_name = novel_name.trim();
                if (novel_name == 'Death... and me') {
                    novel_name = 'Death… and me';
                }
                if (novel_name == 'The Man Picked Up by the Gods (Reboot)') {
                    novel_name = 'The Man Picked Up By the Gods (Reboot)';
                }
                if (novel_name == 'My Three Wives Are Beautiful Vampires.') {
                    novel_name == 'My Three Wives Are Beautiful Vampires'
                }
                if (novel_name == "Affinity:Chaos") {
                    novel_name = "Affinity: Chaos";
                }
                if (novel_name == "The Yun Family’s Ninth Child is an Imp!") {
                    novel_name = "The Yun Family's Ninth Child Is An Imp!";
                }
                if (novel_name == "Dual Cultivator Reborn[System In The Cultivation World]") {
                    novel_name = " Dual Cultivator Reborn [System In The Cultivation World]";
                }
                if (novel_name == "The Demon Lord And His Hero") {
                    novel_name = "The Demon Lord and his Hero (BL)";
                }
                // if(current_novel_name && current_novel_name !== novel_name) {
                //     fs.appendFile('./error_panda.txt', `${current_novel_name} - ${novel_name} \n`, function (err) {
                //         if (err) {
                //             // append failed
                //         } else {
                //             // done
                //         }
                //     })
                //     return 2;
                // }
                let checkNovel = await checkNovelName(novel_name);
                //
                if (1) {
                    chapterName = chapterName.replace('Chapter', '');
                    chapterName = chapterName.replace('chapter', '');
                    chapterName = chapterName.replace('Chapter', '');
                    chapterName = chapterName.replace('chapter', '');
                    chapterName = chapterName.trim();
                }
                // if (checkNovel && checkNovel['novel_name'] == `Paragon Of Sin`) {
                //     chapterName = chapterName.replace('Chapter', '');
                //     chapterName = chapterName.replace('chapter', '');
                // }
                // if (checkNovel && checkNovel['novel_name'] == `Invicinble Colorless Butler`) {
                //     chapterName = chapterName.replace('Chapter', '');
                //     chapterName = chapterName.replace('chapter', '');
                // }
                // if (checkNovel && checkNovel['novel_name'] == `Reincarnated With A Summoning System`) {
                //     chapterName = chapterName.replace('Chapter', '');
                //     chapterName = chapterName.replace('chapter', '');
                // }
                // if (checkNovel && checkNovel['novel_name'] == `The Incubus System`) {
                //     chapterName = chapterName.replace('Chapter', '');
                //     chapterName = chapterName.replace('chapter', '');
                // }
                // if (checkNovel && checkNovel['novel_name'] == `Beauty and the Bodyguard`) {
                //     chapterName = chapterName.replace('Chapter', '');
                //     chapterName = chapterName.replace('chapter', '');
                // }
                // if (checkNovel && checkNovel['novel_name'] == `Marry A Sweetheart And Get Another Free: President, Please Sign This!`) {
                //     chapterName = chapterName.replace('Chapter', '');
                //     chapterName = chapterName.replace('chapter', '')
                // }
                // if (checkNovel && checkNovel['novel_name'] == `Starting With A Space Battleship`) {
                //     chapterName = chapterName.replace('Chapter', '');
                //     chapterName = chapterName.replace('chapter', '')
                // }
                // if (checkNovel && checkNovel['novel_name'] == `Tales of Herding Gods`) {
                //     chapterName = chapterName.replace('Chapter', '');
                //     chapterName = chapterName.replace('chapter', '')
                // }

                if (chapterName.toUpperCase().includes('CHAPTER')) {
                    if (/(Chapter|chapter) ([+]?([0-9]*[.])?[0-9]+)/.test(`${chapterName}`)) {
                        chapterName = /(Chapter|chapter) ([+]?([0-9]*[.])?[0-9]+)/.exec(`${chapterName}`)[0];
                    } else {
                        chapterName = 'Chapter ' + chapterName;
                    }
                } else {
                    chapterName = 'Chapter ' + chapterName;
                }

                if (!checkNovel) {
                    console.log(novel_name, "chưa tồn tại")
                    // fs.appendFile('./error_panda.txt', `${novel_name} \n`, function (err) {
                    //     if (err) {
                    //         // append failed
                    //     } else {
                    //         // done
                    //     }
                    // });
                    // return 5;
                    const btn_click_novel = await page.$(".breadcrumb-content .breadcrumb li:nth-child(2) a");
                    if (btn_click_novel) {
                        await btn_click_novel.click();
                        try {
                            await page.click('button[class="btn-leave"]');
                        } catch (error) {

                        }
                        await page.waitForSelector(".header-content .novel-desc h1", { timeout: 100000 });
                    }
                    await getNovelV2(page, chapterName);
                }
                checkNovel = await checkNovelName(novel_name);
                if (checkNovel) {
                    Novel.updateOne({ novel_name: novel_name }, { isPanda: true }, function (err, data) {
                        if (!err) {
                            console.log("ẩn truyện thành công")
                        }
                    })
                    let checkChapter = await checkChapterExits(checkNovel['novel_id'], chapterName);
                    if (!checkChapter) {
                        let chapterDetail = {};
                        chapterDetail['chapter_content'] = chapterContent;
                        chapterDetail['chapter_name'] = chapterName;
                        chapterDetail['chapter_id'] = slug(`${chapterName}`);
                        chapterDetail['crawler_date'] = new Date();
                        chapterDetail['novel'] = {
                            novel_id: checkNovel['novel_id'],
                            novel_name: checkNovel['novel_name']
                        };
                        chapterDetail['chapter_content'] = chapterContent
                        for (let j = 0; j < labels.length; j++) {
                            chapterDetail['chapter_content'] = chapterDetail['chapter_content'].replace(labels[j], '')
                            chapterDetail['chapter_content'] = chapterDetail['chapter_content'].replace(labels[j], '')
                            chapterDetail['chapter_content'] = chapterDetail['chapter_content'].replace(labels[j], '')
                            chapterDetail['chapter_content'] = chapterDetail['chapter_content'].replace(labels[j], '')
                            chapterDetail['chapter_content'] = chapterDetail['chapter_content'].replace(labels[j], '')
                            chapterDetail['chapter_content'] = chapterDetail['chapter_content'].replace(labels[j], '')
                        }
                        if (chapterDetail['chapter_content']) {
                            Chapter.create(chapterDetail, function (err, data) {
                                if (!err) {
                                    console.log(`Them moi thanh cong ${chapterName}`);
                                    sendTele(`THÊM MỚI THÀNH CÔNG \n CHAPTER : ${chapterName} \n NOVEL:  ${checkNovel['novel_name']} \n LINK:  https://novelbank.net/novelbank/${checkNovel['novel_id']}/${chapterDetail['chapter_id']}`)
                                    let objUpdate = {
                                        $inc: { "totalChapter": 1 }
                                    }
                                    objUpdate['recentChapter'] = {
                                        chapter_id: chapterDetail['chapter_id'],
                                        chapter_name: chapterDetail['chapter_name']
                                    }
                                    // var dateOffset = (12 * 60 * 60 * 1000) * 1; //1 days
                                    // var myDate = new Date();
                                    // myDate.setTime(myDate.getTime() - dateOffset);

                                    objUpdate['crawler_date'] = new Date();
                                    cacheHelper.delete('getLastestNovel');
                                    cacheHelper.delete(checkNovel['novel_id'])
                                    Novel.updateOne({ novel_id: checkNovel['novel_id'] }, objUpdate, function (err, data) {
                                        if (!err) {
                                            console.log(`CAP NHAT chapter cuoi cung cua ${checkNovel['novel_name']} thanh cong !`)
                                        }
                                    });
                                } else {
                                    console.log(err);
                                }
                            });
                            let objPandaUpdate = {
                                novel_name: checkNovel['novel_name'],
                                last_chapter_url: page.url().replace('lightnovel-pub.com', 'panda-novel.com'),
                                updated_date: new Date()
                            }
                            Panda.update({ novel_name: checkNovel['novel_name'] }, objPandaUpdate, { upsert: true, setDefaultsOnInsert: true }, function (err, data) {
                                if (!err) {
                                    console.log("tạo vết thành công")
                                } else {
                                    console.log(err)
                                }
                            });
                        }

                    } else {
                        console.log(`${chapterName} da ton tai`);
                        let objPandaUpdate = {
                            updated_date: new Date(),
                            last_chapter_url: page.url().replace('lightnovel-pub.com', 'panda-novel.com')
                        }
                        Panda.update({ novel_name: checkNovel['novel_name'] }, objPandaUpdate, { upsert: true, setDefaultsOnInsert: true }, function (err, data) {
                            if (!err) {
                                console.log("tạo vết thành công ", chapter_index)
                            } else {
                                console.log(err)
                            }
                        });
                    }
                } else {
                    console.log(novel_name + " Not Exits");
                    break;
                }
                if (Nextbtnhtml.includes("disabled")) {
                    console.log(novel_name + " Completed");
                    break;
                }
                try {
                    await page.click('a[class="btn btn-next"]');
                    await page.waitForSelector("#novelArticle2 p:nth-child(4)", { timeout: 30000 });
                } catch (error3) {
                    console.log(novel_name + " Completed");
                    break;
                }


                // if (page.url().includes('#google')) {
                //     await page.reload();
                //     await page.click('a[class="btn btn-next"]');
                //     await page.waitForSelector("#novelArticle2 .novel-ins", { timeout: 20000 });
                // }

            } catch (error6) {
                console.log(error6);
                const err = await readLine();
                if (err == 'n') {
                    console.log(novel_name.join(" ") + " NOT Completed");
                    break;
                }
            }
        }
        return 1;

    } catch (error123) {
        console.log(error123)
        return 1
    }



}
let download_bannerV2 = function (page, image_link, file_name) {
    // console.log("image_link", image_link);
    // console.log("file_name", file_name);

    return new Promise(async function (reslove, reject) {

        let link = image_link;

        await page.evaluate((link) => {
            let a = document.querySelector('.btn.btn-read');
            a.href = link;
        }, link);
        await page.waitForTimeout(4000);
        const btn_link_to_image = await page.$(".btn.btn-read");
        await page.waitForTimeout(4000);
        await btn_link_to_image.click();
        await page.waitForSelector("body img", { timeout: 100000 });
        await page.waitForTimeout(1000);
        const response = await page.reload({ timeout: 0, waitUntil: 'networkidle0' })

        // const response = await page.goto(image_url, { timeout: 0, waitUntil: 'networkidle0' })

        const imageBuffer = await response.buffer();
        const client = new ftp.Client(10000)
        client.ftp.verbose = true
        try {
            await client.access({
                host: process.env.FTP_HOST,
                user: process.env.FTP_USER,
                password: process.env.FTP_PASSWORD,
                port: 21
            });
            await client.uploadFrom(bufferToStream(imageBuffer), `image_service/public/novel/${file_name}.jpg`);
            const request = require('request');
            request(`http://media.noveltop1.me/resizeImage/${file_name}.jpg`, { json: true }, (err, res, body) => {
                if (!err) {
                    console.log(" Nhan doi anh thanh cong");
                }
            });
            console.log("REPLACE BANNER DONE");
        } catch (err) {
            console.log(err)
            console.log("Dowload banner loi")
        }
        client.close();
        await page.goBack();
        reslove(true)
    })
}


let getNovelV2 = function (page, chapter_name) {
    return new Promise(async function (reslove, reject) {
        let novelInfo = await page.evaluate(async () => {
            const novel_victim_banner = document.querySelector("meta[property = 'og:image']").content || '';
            const novel_name = document.querySelector(".header-content .novel-desc h1").innerText || '';
            let novel_other_name = novel_name;
            let novel_author = document.querySelector(".header-content .novel-desc .n-attrs p:nth-child(1) a").innerText || '';

            let novel_status = 1;
            if (document.querySelector('.header-content .novel-desc .novel-attr li:nth-child(4) strong').innerText.trim() == 'Ongoing') {
                novel_status = 0;
            }

            let novel_genres = [];
            let genresContainer = document.querySelectorAll('.header-content .novel-desc .novel-labels a');
            genresContainer.forEach(genreItem => {
                let genreId = genreItem.innerText.toUpperCase().trim();
                novel_genres.push(genreId);
            });

            let novel_source = document.querySelector(".header-content .novel-desc .n-attrs p:nth-child(2) em").innerText || '';

            let isHot = false;
            let isNew = true;

            const novel_desc = document.querySelector('.details-section dl dd').innerText;
            let avgPointType2 = 10;
            let voteCountType2 = 1;

            return {
                novel_victim_banner: novel_victim_banner,
                novel_author: novel_author,
                novel_source: novel_source,
                novel_other_name: novel_other_name,
                novel_status: novel_status,
                novel_genres: novel_genres,
                novel_desc: novel_desc,
                avgPointType2: avgPointType2,
                voteCountType2: voteCountType2,
                novel_name: novel_name,
                hot: isHot,
                firstChapter: {
                    chapter_name: "Chapter 1",
                    chapter_id: "chapter-1"
                },
                new: isNew
            };
        });
        novelInfo['firstChapter']['chapter_name'] = chapter_name;
        novelInfo['firstChapter']['chapter_id'] = slug(chapter_name);
        novelInfo['crawler_date'] = new Date();
        novelInfo['totalChapter'] = 0;
        novelInfo['safeAds'] = false;
        novelInfo['novel_id'] = slug(novelInfo['novel_name']);
        console.log(novelInfo)
        await Novel.create(novelInfo, function (err, data) {
            if (!err) {
                console.log("Tao thanh cong novel", novelInfo['novel_id']);
                cacheHelper.delete('getLastestNovel');
            } else {
                console.log(err)
                console.log(novelInfo['novel_name'], "da ton tai")
            }
        });
        //novelInfo['novel_id']

        await download_bannerV2(page, novelInfo['novel_victim_banner'], novelInfo['novel_id']);
        await page.goBack();
        reslove(true)
    })
}

async function getNovel(novel_link) {
    const browser = await puppeteer.launch({
        "headless": false,
        timeout: 100000

    });
    const page = await browser.newPage();
    await page.goto(novel_link, { waitUntil: 'networkidle0' });
    await page.waitForTimeout(CloudflFirstTime);
    let novelInfo = await page.evaluate(async () => {

        const novel_victim_banner = document.querySelector('.header-content .novel-cover i')['dataset'].src || '';
        const novel_name = document.querySelector(".header-content .novel-desc h1").innerText || '';
        let novel_other_name = novel_name;
        let novel_author = document.querySelector(".header-content .novel-desc .n-attrs p:nth-child(1) a").innerText || '';

        let novel_status = 1;
        if (document.querySelector('.header-content .novel-desc .novel-attr li:nth-child(4) strong').innerText.trim() == 'Ongoing') {
            novel_status = 0;
        }

        let novel_genres = [];
        let genresContainer = document.querySelectorAll('.header-content .novel-desc .novel-labels a');
        genresContainer.forEach(genreItem => {
            let genreId = genreItem.innerText.toUpperCase().trim();
            novel_genres.push(genreId);
        });

        let novel_source = document.querySelector(".header-content .novel-desc .n-attrs p:nth-child(2) em").innerText || '';

        let isHot = true;
        let isNew = true;

        const novel_desc = document.querySelector('.details-section dl dd').innerText;
        let avgPointType2 = 10;
        let voteCountType2 = 1;

        return {
            novel_victim_banner: novel_victim_banner,
            novel_author: novel_author,
            novel_source: novel_source,
            novel_other_name: novel_other_name,
            novel_status: novel_status,
            novel_genres: novel_genres,
            novel_desc: novel_desc,
            avgPointType2: avgPointType2,
            voteCountType2: voteCountType2,
            novel_name: novel_name,
            hot: isHot,
            firstChapter: {
                chapter_name: "Chapter 1",
                chapter_id: "chapter-1"
            },
            new: isNew
        };
    });



    novelInfo['crawler_date'] = new Date();
    novelInfo['totalChapter'] = 0;
    novelInfo['novel_id'] = slug(novelInfo['novel_name'])

    Novel.create(novelInfo, function (err, data) {
        if (!err) {
            if (novelInfo.novel_victim_banner) {
                const file_name = novelInfo['novel_id'];
                console.log("Tao thanh cong novel", novelInfo['novel_id'])
                // download_banner(novelInfo.novel_victim_banner, file_name);
            }
        } else {
            console.log(err)
            console.log(novelInfo['novel_name'], "da ton tai")
        }
    });

}
// async function grabChaps(CurrChaplink) {
//     const browser = await puppeteer.launch({
//         "headless": false,

//     });

//     const page = await browser.newPage();

//     await page.goto(CurrChaplink, { waitUntil: 'networkidle0' });
//     await page.waitForSelector(".novel-content p");
//     // await page.waitForTimeout(CloudflFirstTime);

//     var ad = true;

//     while (true) {
//         await page.waitForTimeout(gapInTimes);

//         try {
//             await page.click('button[i-id="cancel"]');
//             // await page.waitForTimeout(gapInTimes);

//         } catch (error) {
//             try {
//                 await page.click('button[i-id="ok"]');
//                 // await page.waitForTimeout(gapInTimes);

//             } catch (error) {
//                 // await page.waitForTimeout(gapInTimes);

//             }
//         }

//         const novelUrl = await page.url();
//         const novelName = await novelUrl.split("/")[4].split("-");
//         const extraID = await novelName.pop();
//         const novelNameFolder = await novelName.join(' ');
//         const chapName = await novelUrl.split("/")[5];



//         try {
//             await page.evaluate(() => {
//                 ;
//                 (document.querySelectorAll('div[class="novel-ins"]') || []).forEach(el => el.remove())
//             })
//         } catch (error) { }

//         try {
//             await page.evaluate(() => {
//                 ; (document.querySelectorAll('div[class="novel-ins"]') || []).forEach(el => el.remove())
//                     (document.querySelectorAll('div[class="google-auto-placed ap_container"]') || []).forEach(el => el.remove())
//                     (document.querySelectorAll('#novelArticle1 del') || []).forEach(el => el.remove())
//                     (document.querySelectorAll('#novelArticle1 sub') || []).forEach(el => el.remove());
//                     (document.querySelectorAll('#novelArticle1 novelnext') || []).forEach(el => el.remove());
//                     (document.querySelectorAll('#novelArticle2 novelnext') || []).forEach(el => el.remove());
//             })
//         } catch (error) { }

//         try {
//             let chapterContent = await page.$eval('div[class="novel-content"] div', element => element.innerHTML);
//             const Nextbtnhtml = await page.$eval('.novel-footer .btn.btn-next', element => element.outerHTML);

//             const PandaNovelMark = ['p,ᴀ,ɴ,ᴅ,ᴀ,-,ɴ,0,ᴠ,ᴇ,ʟ', 'p,ᴀ,ɴ,ᴅ,ᴀ,,ɴ,0,ᴠ,ᴇ,ʟ', 'p,a,n,d,a,-,n,o,v,e,l', 'P,a,n,d,a,N,o,v,e,l', '[\u1D3E],[\u1D43],[\u207F],[\u1D48],[\u1D43],[\u207F],[\u1D52],[\u1D5B],[\u1D49],[\u02E1]', 'ᴘ,ᴀ,n,ᴅ,ᴀ,-,ɴ,o,ᴠ,ᴇ,ʟ'];
//             for (let i of PandaNovelMark) {
//                 Markset1 = new RegExp(i.split(',').join('[^;\\s]*') + '[^;\\s]*', 'g');
//                 Markset2 = new RegExp(i.split(',').join('[\\s]*') + '[\\s]*', 'g');

//                 chapterContent = await chapterContent.replace(Markset1, '');
//                 chapterContent = await chapterContent.replace(Markset2, '\n\n');
//             }

//             const mark = new RegExp(/(ᴘ)[(.|" ")]?ᴀ[(.|" ")]?ɴ[(.|" ")]?ᴅ[(.|" ")]?ᴀ[(.|" ")]?ɴ[(.|" ")]?ᴏ[(.|" ")]?ᴠ[(.|" ")]?ᴇ[(.|" ")]?ʟ[(.|" ")]?/, 'gi');
//             const mark2 = new RegExp(/(P)[(.|" ")]?a[(.|" ")]?n[(.|" ")]?d[(.|" ")]?a[(.|" ")]?N[(.|" ")]?o[(.|" ")]?v[(.|" ")]?e[(.|" ")]?l[(.|" ")]?/, 'gi');
//             const mark3 = new RegExp(/(ᴘ)[(.|" ")]?ᴀ[(.|" ")]?ɴ[(.|" ")]?ᴅ[(.|" ")]?ᴀ[(.|" ")]?n[(.|" ")]?ᴏ[(.|" ")]?ᴠ[(.|" ")]?ᴇ[(.|" ")]?ʟ[(.|" ")]?/, 'gi');
//             chapterContent = await chapterContent.replace(mark, '');
//             chapterContent = await chapterContent.replace(mark2, '');
//             chapterContent = await chapterContent.replace(mark3, '');

//             chapterContent = chapterContent.replace(`pAɴᴅᴀ ɴ(O)ᴠᴇʟ`, '');
//             chapterContent = chapterContent.replace(`pᴀɴᴅᴀ ɴ(O)ᴠᴇʟ`, '');
//             chapterContent = chapterContent.replaceAll(`ρꪖꪕᦔꪖꪕ(ꪫ)ꪣꫀ​ꪶ`, '');

//             let novelName = await page.$eval('.breadcrumb-content .breadcrumb li:nth-child(2) h1', element => element.innerText);
//             if (novelName == 'Death... and me') {
//                 novelName = 'Death… and me';
//             }
//             if (novelName == 'My Three Wives Are Beautiful Vampires.') {
//                 novelName == 'My Three Wives Are Beautiful Vampires'
//             }
//             if (novelName == "Affinity:Chaos") {
//                 novelName = "Affinity: Chaos";
//             }

//             if (novelName == "Dual Cultivator Reborn[System In The Cultivation World]") {
//                 novelName = " Dual Cultivator Reborn [System In The Cultivation World]";
//             }
//             let checkNovel = await checkNovelName(novelName);

//             let chapterName = await page.$eval('.breadcrumb-content .breadcrumb li:nth-child(3) span', element => element.innerText);
//             if (checkNovel && checkNovel['novel_name'] == `Paragon Of Sin`) {
//                 chapterName = chapterName.replace('Chapter', '')
//             }
//             if (checkNovel && checkNovel['novel_name'] == `Reincarnated With A Summoning System`) {
//                 chapterName = chapterName.replace('Chapter', '')
//             }
//             if (chapterName.toUpperCase().includes('CHAPTER')) {
//                 if (/(Chapter|chapter) ([+]?([0-9]*[.])?[0-9]+)(.*)/.test(`${chapterName}`)) {
//                     chapterName = /(Chapter|chapter) ([+]?([0-9]*[.])?[0-9]+)(.*)/.exec(`${chapterName}`)[0];
//                 } else {
//                     chapterName = 'Chapter ' + chapterName;
//                 }
//             } else {
//                 chapterName = 'Chapter ' + chapterName;
//             }
//             chapterContent = `<h3>${chapterName}</h3>` + chapterContent;

//             // console.log(chapterName);


//             if (checkNovel) {
//                 let checkChapter = await checkChapterExits(checkNovel['novel_id'], chapterName);
//                 if (!checkChapter) {
//                     let chapterDetail = {};
//                     chapterDetail['chapter_content'] = chapterContent
//                     const labels = [
//                         'pan,da-n0vel,c,m',
//                         'pᴀɴᴅᴀ ɴ(O)ᴠᴇʟ',
//                         'ρꪖꪕᦔꪖꪕ(ꪫ)ꪣꫀ​ꪶ',
//                         'p<ᴀɴᴅ>ᴀ-ɴ0ᴠᴇʟ',
//                         'p<ᴀɴᴅ>ᴀ-ɴ0ᴠᴇʟ、ᴄᴏᴍ',
//                         'ρꪖnᦔa (nꪫ)ꪣꫀ​ꪶ',
//                         'p-ᴀ-ɴ-ᴅ-ᴀ ɴ-0-ᴠ-ᴇ-ʟ、ᴄ(ᴏᴍ)',
//                         'For more chapters, please visit panda-n(0ve)l.com',
//                         'pan,da n<0,>v,el',
//                         'pan,da-n0vel,c-o-m',
//                         'p、a,nd a-n、o、ve,l',
//                         'panda (nov)el',
//                         'pan,da-n0vel,c',
//                         'pAn,dan0vel.c0m',
//                         'pan-da-n0vel.com',
//                         'p、a,nd a-n、o、ve,l',
//                         'p-n0vel、com',
//                         'pan,da-n0vel,c-o-m',
//                         'pan,da-n0vel,c,m',
//                         'p-a-n-d-a-n-0-v-e-l、(c)om',
//                         'panda (nov)el'
//                     ]
//                     for (let j = 0; j < labels.length; j++) {
//                         chapterDetail['chapter_content'] = chapterDetail['chapter_content'].replace(labels[j], '')
//                         chapterDetail['chapter_content'] = chapterDetail['chapter_content'].replace(labels[j], '')
//                         chapterDetail['chapter_content'] = chapterDetail['chapter_content'].replace(labels[j], '')
//                     }

//                     chapterDetail['chapter_name'] = chapterName;
//                     chapterDetail['chapter_id'] = slug(`${chapterName}`);
//                     chapterDetail['crawler_date'] = new Date();
//                     chapterDetail['novel'] = {
//                         novel_id: checkNovel['novel_id'],
//                         novel_name: checkNovel['novel_name']
//                     };
//                     Chapter.create(chapterDetail, function (err, data) {
//                         if (!err) {
//                             console.log(`Them moi thanh cong ${chapterName}`);
//                             let objUpdate = {
//                                 $inc: { "totalChapter": 1 }
//                             }
//                             objUpdate['recentChapter'] = {
//                                 chapter_id: chapterDetail['chapter_id'],
//                                 chapter_name: chapterDetail['chapter_name']
//                             }

//                             var dateOffset = (12 * 60 * 60 * 1000) * 1; //1 days
//                             var myDate = new Date();
//                             myDate.setTime(myDate.getTime() - dateOffset);

//                             objUpdate['crawler_date'] = myDate;
//                             Novel.updateOne({ novel_id: checkNovel['novel_id'] }, objUpdate, function (err, data) {
//                                 if (!err) {
//                                     cacheHelper.delete('getLastestNovel');
//                                     cacheHelper.delete(checkNovel['novel_id']);
//                                     console.log(`CAP NHAT chapter cuoi cung cua ${checkNovel['novel_name']} thanh cong !`)
//                                 }
//                             });
//                         } else {
//                             console.log(err);
//                         }
//                     });
//                     let objPandaUpdate = {
//                         novel_name: checkNovel['novel_name'],
//                         last_chapter_url: page.url(),
//                         updated_date: new Date()
//                     }
//                     Panda.update({ novel_name: checkNovel['novel_name'] }, objPandaUpdate, { upsert: true, setDefaultsOnInsert: true }, function (err, data) {
//                         if (!err) {
//                             console.log("tạo vết thành công")
//                         }
//                     });
//                 } else {
//                     console.log(`${chapterName} da ton tai`);
//                     let objPandaUpdate = {
//                         updated_date: new Date(),
//                         last_chapter_url: page.url()
//                     }
//                     Panda.update({ novel_name: checkNovel['novel_name'] }, objPandaUpdate, { upsert: true, setDefaultsOnInsert: true }, function (err, data) {
//                         if (!err) {
//                             console.log("tạo vết thành công 1")
//                         }
//                     });
//                 }
//             } else {
//                 console.log(novelName + " Not Exits");
//                 break;
//             }

//             // try {
//             //     await fs.writeFileSync("./" + novelNameFolder + "/" + chapName + extraID + ".html", html);
//             // } catch (error) {
//             //     await fs.mkdirSync("./" + novelNameFolder);
//             //     await fs.writeFileSync("./" + novelNameFolder + "/" + chapName + extraID + ".html", html);
//             // }

//             if (!(Nextbtnhtml.includes("/content"))) {
//                 console.log(novelName + " Completed");
//                 break;
//             }

//             await page.waitForTimeout(gapInTimes);
//             await page.click('a[class="btn btn-next"]');
//             await page.waitForSelector("#novelArticle2 .novel-ins");
//             if (page.url().includes('#google')) {
//                 await page.reload();
//                 await page.waitForTimeout(gapInTimes);
//                 await page.click('a[class="btn btn-next"]');
//                 await page.waitForSelector("#novelArticle2 .novel-ins");
//             }

//         } catch (error) {
//             console.log(error);
//             const err = await readLine();

//             if (err == 'n') {
//                 console.log(novelName.join(" ") + " NOT Completed");
//                 break;
//             }

//         }
//     }
//     await browser.close();
// }

let bufferToStream = function (binary) {
    const readableInstanceStream = new Readable({
        read() {
            this.push(binary);
            this.push(null);
        }
    });
    return readableInstanceStream;
}
let getDataFromUrlImage = function (image_url) {
    return new Promise(async function (reslove, reject) {
        var options = {
            url: image_url,
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


let checkNovelName = function (novel_name) {
    let name = novel_name;
    if (novel_name == 'Death... and me') {
        name = 'Death… and me';
    }
    if (novel_name == 'Global Lord: 100% Drop Rate') {
        novel_name = 'Global Lord: 100\% Drop Rate'
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

let checkChapterExits = function (novel_id, chapter_name) {
    let chapterNumber = 'Chapter -1';
    if (/(.*?)Chapter ([+]?([0-9]*[.])?[0-9]+)/.test(`${chapter_name}`)) {
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
async function readLine() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout

    });

    return new Promise(resolve => {
        rl.question('Error happend, Continue? (y/n): ', (answer) => {
            rl.close();
            resolve(answer)

        });
    })
}


async function startJob() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout

    });
    return new Promise(resolve => {
        rl.question('Start DB or Array ? (1/2): ', (answer) => {
            rl.close();
            resolve(answer)
        });
    })
}

async function getStart() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout

    });
    return new Promise(resolve => {
        rl.question('Điền số start ( nếu không muốn chọn thì điền No )', (answer) => {
            rl.close();
            resolve(Number(answer))
        });
    })
}
async function getEnd() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout

    });
    return new Promise(resolve => {
        rl.question('Điền số kết thúc ( nếu không muốn chọn thì điền No )', (answer) => {
            rl.close();
            resolve(Number(answer))
        });
    })
}

module.exports = router;