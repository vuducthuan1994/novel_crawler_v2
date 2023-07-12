const configs = {
    'lightnovel-pub.com': {
        cancel_popup_selector: `.ui-dialog-footer .btn-default`,
        load_done_selector: `#novelArticle2 p:nth-child(4)`,
        cloudfare_checkbox: true,
        next_button_selector: `.btn.btn-next`,
        ads_selector: [
            '.novel-content script',
            'div[class="novel-ins"]',
            'div[class="novel-ins2"]',
            'div[class="google-auto-placed ap_container"]',
            '#novelArticle1 del',
            '#novelArticle1 sub',
            '#novelArticle1 novelnext'
        ],
        chapter_content_selector : `#novelArticle2`,
        chapter_name_selector: `.breadcrumb-content .breadcrumb li:nth-child(3) span`,
        novel_name_selector : `.breadcrumb-content .breadcrumb li:nth-child(2) h1`,
        novel_name_prefix : [],
        novel_selector: {
            novel_name : `.novel-title`
        }
    },
    'webnovelpub.com': {
        cancel_popup_selector: null,
        load_done_selector: `#chapter-container p`,
        cloudfare_checkbox: false,
        next_button_selector: `.button.nextchap`,
        ads_selector: [
           '#chapter-container div'
        ],
        chapter_content_selector : `#chapter-container`,
        chapter_name_selector: `span.chapter-title`,
        novel_name_selector : `.titles h1 a`,
        novel_name_prefix : ['(Web Novel)','(WN)','(WN KR)','(Web Novel KR)','(WEB NOVEL KR)','(WEB NOVEL)'],
        novel_selector: {
            btn_click_novel: `h1 a.booktitle`,
            novel_image : `meta[property = 'og:image']`,
            novel_name : `.novel-title`,
            novel_author : `.author a`,
            novel_status : `.header-stats span:nth-child(4) strong`,
            novel_genres : `.categories ul li a`,
            novel_desc : `.summary .content`,
            ongoing_value : 'Ongoing'

        }
    }
}
module.exports = configs