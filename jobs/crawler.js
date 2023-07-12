console.log("crawler");
const Panda = require('../models/panda');
const Chapter = require('../models/chapter');
const Novel = require('../models/novel');
const CrawlerConfig = require('../models/crawler_config');
const configs = require('../config/crawler_config');
const logos = require('../config/logo_config');
const slug = require('slug')
const puppeteer = require('puppeteer-extra');
const CacheService = require('../service/cache_service');
const cacheHelper = new CacheService();
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const ftp = require("basic-ftp");
const types_crawler = require('../config/type_crawler');
const helper = require('../service/helper');
const fs = require('fs')
const schedule = require('node-schedule');
const moment = require('moment');
const new_links = [

    // 'https://www.webnovelpub.com/novel/the-predators-contract-partner-1330/chapter-1-30041322', 
    // 'https://www.webnovelpub.com/novel/she-professed-herself-the-pupil-of-the-wiseman-wn-1243/chapter-0', 

]

const job_new_link = async function () {
    const confirm = await helper.confirm();
    if (confirm == 'Y') {
        const browser = await puppeteer.launch({
            "headless": false,
            args: [
                '--window-size=1920,1080',
                '--disable-dev-profile',
                '--no-sandbox',
                '--disable-web-security'
            ]
        });
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(200000);
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (req.resourceType() == 'font') {
                req.abort();
            } else {
                req.continue();
            }
        });
        await page.goto(`https://www.webnovelpub.com/`);
        if (configs['webnovelpub.com'].cancel_popup_selector) {
            try {
                await page.waitForSelector(configs['webnovelpub.com'].cancel_popup_selector, { timeout: 6000 });
                await page.click(configs['webnovelpub.com'].cancel_popup_selector,{ timeout: 6000 });
            } catch (error) {
                 console.log(error, "Lỗi khi đóng popup")
            }
        }
        for (let index = 0; index < new_links.length; index++) {

            console.log(`BẮT ĐẦU XỬ LÝ LINK SỐ`, index);
            const config = {
                last_chapter_url: new_links[index],
                novel_name: null
            }

            await getChapters(page, config, types_crawler.GET_NEW_CHAPTER);

        }

        await browser.close();
    } else {
        console.log("Bye Bye");
    }
}

job_new_link();
// 
const job_panda = async function () {
    const browser = await puppeteer.launch({
        "headless": true,
        args: ["--no-sandbox", "--disabled-setupid-sandbox"],
        // executablePath: executablePath(),
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(200000);
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (req.resourceType() == 'font',req.resourceType() == 'css') {
            req.abort();
        } else {
            req.continue();
        }
    });
    await page.goto(`https://lightnovel-pub.com`);
    if (configs['lightnovel-pub.com'].cancel_popup_selector) {
        try {
            await page.waitForSelector(configs['lightnovel-pub.com'].cancel_popup_selector, { timeout: 6000 });
            await page.click(configs['lightnovel-pub.com'].cancel_popup_selector);
        } catch (error) {
            // console.log(error, "Lỗi khi đóng popup")
        }
    }
    const pandas = await CrawlerConfig.find({ domain: 'lightnovel-pub.com' });
    for (let index = 0; index < pandas.length; index++) {
        const item_panda = pandas[index];
        console.log(`BẮT ĐẦU XỬ LÝ ${item_panda.novel_name}`, index);
        await getChapters(page, item_panda, types_crawler.GET_NEW_CHAPTER);

    }

    await browser.close();
}

const job_lightnovelpub = async function () {
    const browser = await puppeteer.launch({
        "headless": true,
        args: [
            '--window-size=1920,1080',
            '--disable-dev-profile',
            '--no-sandbox',
            '--disable-web-security'
        ]

    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(200000);
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (req.resourceType() == 'font') {
            req.abort();
        } else {
            req.continue();
        }
    });
    await page.goto(`https://www.webnovelpub.com/`);
    if (configs['webnovelpub.com'].cancel_popup_selector) {
        try {
            await page.waitForSelector(configs['webnovelpub.com'].cancel_popup_selector, { timeout: 6000 });
            await page.click(configs['webnovelpub.com'].cancel_popup_selector);
        } catch (error) {
            // console.log(error, "Lỗi khi đóng popup")
        }
    }
    const webnovelpubs = await CrawlerConfig.find({ domain: 'webnovelpub.com' });
    for (let index = 0; index < webnovelpubs.length; index++) {
        const crawler_config = webnovelpubs[index];
        if(crawler_config.novel_name !== 'Classroom of the Elite (LN)') {
            console.log(`BẮT ĐẦU XỬ LÝ ${crawler_config.novel_name}`, index);
            await getChapters(page, crawler_config, types_crawler.GET_NEW_CHAPTER);
        }


    }

    await browser.close();
}



const getChapters = async function (page, crawler_config, type = types_crawler.GET_NEW_CHAPTER) {

    const domain = helper.getDomainFromUrl(crawler_config.last_chapter_url);
    const config = configs[domain];
    await page.goto(crawler_config.last_chapter_url);

    try {
        await page.waitForSelector(config.load_done_selector, { timeout: 10000 });
    } catch (error) {
        if (config.cloudfare_checkbox) {
            try {
                const elementHandle = await page.waitForSelector('iframe', { timeout: 100 });
                const frame = await elementHandle.contentFrame();
                var captcha = await frame.waitForSelector('.mark', { timeout: 100 });
                await captcha.evaluate(b => b.click());
                console.log("Da click checkbox")
            } catch (error) {
                console.log("Lỗi click checkbox")
            }

        }
        try {
            await page.waitForSelector(config.load_done_selector, { timeout: 10000 });
        } catch (error) {
            console.log(error, "Lỗi khi đợi load_done_selector lần 2")
            return 1;
        }
    }



    if (config.cancel_popup_selector) {
        try {
            await page.waitForSelector(config.cancel_popup_selector, { timeout: 1000 });
            await page.click(config.cancel_popup_selector);
        } catch (error) {
             console.log(error, "Lỗi khi đóng popup")
        }
    }
    while (true) {
        if (page.url().includes('#google')) {
            await page.reload();
        }
        // lấy và xử lý conntent
        try {
            await page.waitForSelector(config.load_done_selector, { timeout: 2000 });
            try {
                await page.evaluate((removes) => {
                    console.log(removes);
                    for (let i = 0; i < removes.length; i++) {
                        document.querySelectorAll(removes[i]).forEach(el => el.remove());
                    }

                }, config.ads_selector)
            } catch (error) {
                console.log(error, "Lỗi khi xóa quảng cáo")
            }

        } catch (error) {
            console.log(error, "Lỗi khi đợi content load done")
        }
        let chapter_content = '';
        let chapter_name = '';
        try{
             await page.waitForSelector(config.chapter_content_selector, { timeout: 2000 });
             chapter_content = await page.$eval(config.chapter_content_selector, element => element.innerHTML);

             await page.waitForSelector(config.chapter_name_selector, { timeout: 2000 });
             chapter_name = await page.$eval(config.chapter_name_selector, element => element.innerText);
        } catch(err) {
            console.log("không tìm được chapter content")
            break
        }
      
        if(chapter_content.length < 50 ) {
            chapter_content = 'We apologize for any inconvenience caused. Please note that the content of this chapter will soon be revised and updated.'
        }
        let novel_name = await page.$eval(config.novel_name_selector, element => element.innerText);

        if (config.novel_name_prefix.length) {
            for (let i = 0; i < config.novel_name_prefix.length; i++) {
                const prefix = config.novel_name_prefix[i];
                novel_name = novel_name.replace(prefix, '');

            }
        }
        novel_name = novel_name.trim();


        let currentNovel = await helper.checkNovelName(novel_name);
        if (currentNovel && crawler_config.novel_name && crawler_config.novel_name !== currentNovel.novel_name) {
            console.log("Vui lòng check lại config trên database của ", crawler_config.novel_name);
            writeLog(crawler_config.novel_name,'checkdb');
            break;
        }


        chapter_name = chapter_name.replace(`&#xFEFF;`, '');
        chapter_name = chapter_name.replace('Chapter', '');
        chapter_name = chapter_name.replace('Chapter', '');
        chapter_name = chapter_name.replace('chapter', '');
        chapter_name = chapter_name.replace('chapter', '');
        chapter_name = chapter_name.trim();
        chapter_name = 'Chapter ' + chapter_name;

        if (!currentNovel) {
            let btn_click_novel = await page.$("h1 a.booktitle");
            if (btn_click_novel) {
                await btn_click_novel.click();
                if (page.url().includes('#google')) {
                    await page.reload();
                }

                try {
                    await page.waitForSelector(".categories li", { timeout: 5000 });
                } catch (error) {
                    if (page.url().includes('#google')) {
                        await page.reload();
                    }
                    await page.waitForSelector(".categories li", { timeout: 5000 });
                }

            }

            await getNovel(page, chapter_name, novel_name, config.novel_selector);
        }
        currentNovel = await helper.checkNovelName(novel_name);
        if (currentNovel) {


            const check_chapter = await helper.checkChapterExits(currentNovel.novel_id, chapter_name);
            if (!check_chapter) {
                let chapter_detail = {};
                chapter_detail['chapter_content'] = chapter_content;
                chapter_detail['chapter_name'] = chapter_name;
                chapter_detail['chapter_id'] = slug(`${chapter_name}`);
                chapter_detail['crawler_date'] = new Date();
                chapter_detail['novel'] = {
                    novel_id: currentNovel['novel_id'],
                    novel_name: currentNovel['novel_name']
                };
                for (let j = 0; j < logos.length; j++) {
                    for (let k = 1; k < 6; k++) {
                        chapter_detail['chapter_content'] = chapter_detail['chapter_content'].replace(logos[j], '')
                    }
                }


                if (chapter_detail['chapter_content']) {
                    Chapter.create(chapter_detail, function (err, data) {
                        if (!err) {
                            if(chapter_detail['chapter_content'].length < 200) {
                                writeLog(`https://novelbank.net/novelbank/${currentNovel['novel_id']}/${chapter_detail['chapter_id']}`,'error_chapter')
                            }
                            console.log(`THÊM MỚI THÀNH CÔNG ${chapter_name}`);
                            helper.sendTele(`THÊM MỚI THÀNH CÔNG \n CHAPTER : ${chapter_name} \n NOVEL:  ${currentNovel['novel_name']} \n LINK:  https://novelbank.net/novelbank/${currentNovel['novel_id']}/${chapter_detail['chapter_id']}`)
                            let objUpdate = {
                                $inc: { "totalChapter": 1 }
                            }
                            objUpdate['recentChapter'] = {
                                chapter_id: chapter_detail['chapter_id'],
                                chapter_name: chapter_detail['chapter_name']
                            }

                            var dateOffset = (12 * 60 * 60 * 1000) * 1; //1 days
                            var myDate = new Date();
                            myDate.setTime(myDate.getTime() - dateOffset);
                            objUpdate['crawler_date'] = myDate;

                            cacheHelper.delete('getLastestNovel');
                            cacheHelper.delete(currentNovel['novel_id'])
                            Novel.updateOne({ novel_id: currentNovel['novel_id'] }, objUpdate, function (err, data) {
                                if (!err) {
                                    console.log(`CAP NHAT chapter cuoi cung cua ${currentNovel['novel_name']} thanh cong !`)
                                }
                            });
                            if (type == types_crawler.GET_NEW_CHAPTER) {
                                const update_or_create = {
                                    novel_name: currentNovel['novel_name'],
                                    domain: domain,
                                    view: currentNovel.view,
                                    last_chapter_url: page.url(),
                                    updated_date: new Date()
                                }
                                CrawlerConfig.update({ novel_name: currentNovel['novel_name'], domain: domain }, update_or_create, { upsert: true, setDefaultsOnInsert: true }, () => { });
                            }
                        } else {
                            console.log(err, "Loi tao chapter");
                        }
                    });
                }
            } else {
                if (type == types_crawler.UPDATE_CHAPTER) {
                    let chapter_detail = {};
                    chapter_detail['chapter_content'] = chapter_content;
                    for (let j = 0; j < logos.length; j++) {
                        for (let k = 1; k < 6; k++) {
                            chapter_detail['chapter_content'] = chapter_detail['chapter_content'].replace(logos[j], '')
                        }
                    }
                    Chapter.updateOne({ chapter_id: check_chapter.chapter_id, "novel.novel_id": check_chapter.novel.novel_id }, chapter_detail, function (err, data) {
                        if (!err) {
                            console.log(`UPDATE THÀNH CÔNG ${check_chapter.novel.novel_name} --- ${check_chapter.chapter_name}`)
                        }
                    });
                }
                if (type == types_crawler.GET_NEW_CHAPTER) {
                    const update_or_create = {
                        novel_name: currentNovel['novel_name'],
                        domain: domain,
                        view: currentNovel.view,
                        last_chapter_url: page.url(),
                        updated_date: new Date()
                    }
                    CrawlerConfig.update({ novel_name: currentNovel['novel_name'], domain: domain }, update_or_create, { upsert: true, setDefaultsOnInsert: true }, () => { });
                }

                CrawlerConfig.updateOne({ novel_name: currentNovel['novel_name'], domain: domain }, { view: currentNovel.view }, () => { });
            }

        } else {
            console.log(novel_name, "chưa được thêm vào CSDL")
            break;
        }

        const Nextbtnhtml = await page.$eval(config.next_button_selector, element => element.outerHTML);
        if (Nextbtnhtml.includes("disabled") || Nextbtnhtml.includes("isDisabled") || !Nextbtnhtml) {
            console.log("ĐÃ XỬ LÝ XONG", novel_name);
            break;
        } else {

            await page.click(config.next_button_selector);
        }
    }
    return 1;
}

// const job1 = schedule.scheduleJob('*/40 * * * *', async function () { 
//     job_lightnovelpub()
// })



job_panda();

const init_crawler_config = async function () {
    const pandas = await Panda.find({}).lean();
    for (let i = 0; i < pandas.length; i++) {
        const item = pandas[i];
        let url = item.last_chapter_url;
        url = url.replace('panda-novel.com','lightnovel-pub.com');
        url = url.replace('zebranovel.com','lightnovel-pub.com');
        if(url.includes('lightnovel-pub.com')) {
               await CrawlerConfig.create({
                novel_name: item.novel_name,
                last_chapter_url: url,
                view: 0,
                domain: 'lightnovel-pub.com'
            })
        }
    }
}
// init_crawler_config()



const getNovel = async function (page, chapter_name, novel_name, selector) {
    await page.waitForTimeout(3000)
    return new Promise(async function (reslove, reject) {
        let novelInfo = await page.evaluate(async (selectors) => {
            const novel_victim_banner = document.querySelector(selectors.novel_image).content || '';
            const novel_name = document.querySelector(selectors.novel_name).innerText || '';
            let novel_other_name = novel_name;
            let novel_author = document.querySelector(selectors.novel_author).innerText || '';


            let novel_status = 1;
            if (document.querySelector(selectors.novel_status).innerText.trim() == selectors.ongoing_value) {
                novel_status = 0;
            }

            let novel_genres = [];
            let genresContainer = document.querySelectorAll(selectors.novel_genres);
            genresContainer.forEach(genreItem => {
                let genreId = genreItem.innerText.toUpperCase().trim();
                novel_genres.push(genreId);
            });
            let isHot = false;
            let isNew = true;

            const novel_desc = document.querySelector(selectors.novel_desc).innerText;
            let avgPointType2 = 10;
            let voteCountType2 = 1;

            return {
                novel_victim_banner: novel_victim_banner,
                novel_author: novel_author,
                novel_source: '',
                novel_other_name: novel_other_name,
                novel_status: novel_status,
                novel_genres: novel_genres,
                novel_desc: novel_desc,
                avgPointType2: avgPointType2,
                voteCountType2: voteCountType2,
                // novel_name: novel_name,
                hot: isHot,
                firstChapter: {
                    chapter_name: "Chapter 1",
                    chapter_id: "chapter-1"
                },
                new: isNew
            };
        }, selector);
        novelInfo['novel_name'] = novel_name;
        novelInfo['firstChapter']['chapter_name'] = chapter_name;
        novelInfo['firstChapter']['chapter_id'] = slug(chapter_name);
        novelInfo['crawler_date'] = new Date();
        novelInfo['totalChapter'] = 0;
        novelInfo['safeAds'] = true;
        novelInfo['novel_id'] = slug(novelInfo['novel_name']);
        await Novel.create(novelInfo, function (err, data) {
            if (!err) {
                console.log("Tao thanh cong novel", novelInfo['novel_id']);
                cacheHelper.delete('getLastestNovel');
            } else {
                console.log(err)
                console.log(novelInfo['novel_name'], "da ton tai")
            }
        });
        await download_bannerV2(page, novelInfo['novel_victim_banner'], novelInfo['novel_id']);
        await page.goBack();
        reslove(true)
    });
}

const download_bannerV2 = function (page, image_link, file_name) {
    console.log("image_link", image_link);
    console.log("file_name", file_name);
    return new Promise(async function (reslove, reject) {
        page.goto(image_link);
        await page.waitForTimeout(4000);
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
            await client.uploadFrom(helper.bufferToStream(imageBuffer), `image_service/public/novel/${file_name}.jpg`);
            const request = require('request');
            request(`http://${process.env.FTP_HOST}:6200/resizeImage/${file_name}.jpg`, { json: true }, (err, res, body) => {
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


const getNewsNovel = async function () {
    const browser = await puppeteer.launch({
        "headless": false,
        args: [
            '--window-size=1920,1080',
        ]
    });

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(200000);
    await page.setRequestInterception(true);

    page.on('request', (req) => {
        if (req.resourceType() == 'font') {
            req.abort();
        } else {
            req.continue();
        }
    });

    for (let _page = 1; _page < 100; _page++) {
        await page.goto(`https://www.webnovelpub.com/browse/genre-all-04061342/order-new/status-all?page=${_page}`);
        try {
            await page.waitForSelector(".novel-item", { timeout: 10000 });
        } catch (error) {
            if (page.url().includes('#google')) {
                await page.reload();
            }
            await page.waitForSelector(".novel-item", { timeout: 10000 });
        }

        const novels = await page.evaluate(() => {
            let results = [];
            const novelUrls = document.querySelectorAll('li.novel-item');
            novelUrls.forEach((novel) => {
                let novelItem = {};
                try {
                    novelItem['novel_url'] = novel.querySelector('a').href;
                    novelItem['novel_name'] = novel.querySelector('a').title
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
            novelInfo.novel_name = novelInfo.novel_name;

            novelInfo.novel_name = novelInfo.novel_name.replace(`(Web Novel)`, '');
            novelInfo.novel_name = novelInfo.novel_name.replace(`(WN)`, '');
            novelInfo.novel_name = novelInfo.novel_name.replace(`(WN KR)`, '');
            novelInfo.novel_name = novelInfo.novel_name.replace(`(Web Novel KR)`, '');


            const checkNovel = await helper.checkNovelName(novelInfo.novel_name);
            if (!checkNovel) {
                const selectorPage = `a[href="${novelInfo.novel_url.replace('https://www.webnovelpub.com', '')}"]`;
                const btn_novel_info = await page.$(selectorPage);
                if (btn_novel_info) {

                    try {
                        await btn_novel_info.click();
                        if (page.url().includes('#google')) {
                            await page.reload();
                        }

                        await page.waitForSelector("#readchapterbtn", { timeout: 10000 });
                        let novel_link = await page.$eval('#readchapterbtn', element => element.href);
                        writeLog(novelInfo.novel_name, 'novel');
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

const checkUpdate = async function () {
    const browser = await puppeteer.launch({
        "headless": false,
        args: [
            '--window-size=1920,1080',
        ]
    });

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(200000);
    await page.setRequestInterception(true);

    page.on('request', (req) => {
        if (req.resourceType() == 'font') {
            req.abort();
        } else {
            req.continue();
        }
    });

    for (let _page = 1; _page < 100; _page++) {
        await page.goto(`https://www.webnovelpub.com/browse/genre-all-04061342/order-popular/status-ongoing?page=${_page}`);
        try {
            await page.waitForSelector(".novel-item", { timeout: 10000 });
        } catch (error) {
            if (page.url().includes('#google')) {
                await page.reload();
            }
            await page.waitForSelector(".novel-item", { timeout: 10000 });
        }

        const novels = await page.evaluate(() => {
            let results = [];
            const novelUrls = document.querySelectorAll('li.novel-item');
            novelUrls.forEach((novel) => {
                let novelItem = {};
                try {
                    novelItem['novel_url'] = novel.querySelector('a').href;
                    novelItem['novel_name'] = novel.querySelector('a').title
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
            novelInfo.novel_name = novelInfo.novel_name;

            novelInfo.novel_name = novelInfo.novel_name.replace(`(Web Novel)`, '');
            novelInfo.novel_name = novelInfo.novel_name.replace(`(WN)`, '');
            novelInfo.novel_name = novelInfo.novel_name.replace(`(WN KR)`, '');
            novelInfo.novel_name = novelInfo.novel_name.replace(`(Web Novel KR)`, '');


            const checkNovel = await helper.checkNovelName(novelInfo.novel_name);
            if (checkNovel) {
                const selectorPage = `a[href="${novelInfo.novel_url.replace('https://www.webnovelpub.com', '')}"]`;
                const btn_novel_info = await page.$(selectorPage);
                if (btn_novel_info) {

                    try {
                        await btn_novel_info.click();
                        if (page.url().includes('#google')) {
                            await page.reload();
                        }
                        await page.waitForSelector(".latest.text1row", { timeout: 10000 });
                        let last_chapter_name = await page.$eval('.latest.text1row', element => element.innerText);
                        const check_chapterr =  await helper.checkChapterExits(checkNovel.novel_id, last_chapter_name);

                        if(!check_chapterr) {
                            writeLog(novelInfo.novel_url, 'novel');
                        }

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

const writeLog = function (msg, file_name = 'log') {
    fs.appendFile(`./${file_name}.txt`, `${msg} \r\n`, function (err) {
        if (err) {
            // append failed
        } else {
            // done
        }
    })
}

//  getNewsNovel()
// checkUpdate()