const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());


async function imageToHTML(imagePath, apiKey) {
  // Đọc dữ liệu ảnh
  const image = fs.readFileSync(imagePath);

  // Tạo đối tượng FormData
  const formData = new FormData();
  formData.append('file', image, 'image.png');
  formData.append('apikey', apiKey);
  formData.append('isOverlayRequired', 'true');

  const response = await axios.post('https://api.ocr.space/parse/image', formData, {
    headers: {
      ...formData.getHeaders(),
      'Content-Length': formData.getLengthSync(),
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });

  // Kiểm tra phản hồi từ OCR.space API
  if (response.status === 200 && response.data && response.data.OCRExitCode === 1) {
    // Trích xuất văn bản từ phản hồi
    let text = response.data.ParsedResults[0].ParsedText;
    text = text.replace(/\\n/g, '</p> <p>');




    // Lưu HTML vào tệp đầu ra
    const htmlPath = 'output.txt';
    fs.writeFileSync(htmlPath, text);

    console.log(`Đã chuyển đổi ảnh thành HTML và lưu vào ${htmlPath}`);
  } else {
    console.error('Lỗi khi gửi yêu cầu OCR.space API:', response.data.ErrorMessage);
  }
}
// Sử dụng hàm imageToHTML
const imagePath = 'image.png';
const apiKey = 'K85003195388957';

const cookie = [
  {
    "domain": ".webnovel.com",
    "expirationDate": 1690992639.907408,
    "hostOnly": false,
    "httpOnly": false,
    "name": "_csrfToken",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "144ff1eb-5b59-4b0c-8229-da0863cb16c5",
    "id": 1
  },
  {
    "domain": ".webnovel.com",
    "expirationDate": 1722845548.133792,
    "hostOnly": false,
    "httpOnly": false,
    "name": "_ga",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "GA1.1.1260652221.1661791640",
    "id": 2
  },
  {
    "domain": ".webnovel.com",
    "expirationDate": 1722790561.376395,
    "hostOnly": false,
    "httpOnly": false,
    "name": "_ga_GG9P0S9KJK",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "GS1.1.1688230561.1.0.1688230561.60.0.0",
    "id": 3
  },
  {
    "domain": ".webnovel.com",
    "expirationDate": 1722845548.136897,
    "hostOnly": false,
    "httpOnly": false,
    "name": "_ga_PH6KHFG28N",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "GS1.1.1688284929.64.1.1688285548.58.0.0",
    "id": 4
  },
  {
    "domain": ".webnovel.com",
    "expirationDate": 1688285608,
    "hostOnly": false,
    "httpOnly": false,
    "name": "_gat",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "1",
    "id": 5
  },
  {
    "domain": ".webnovel.com",
    "expirationDate": 1688371948,
    "hostOnly": false,
    "httpOnly": false,
    "name": "_gid",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "GA1.2.1497115983.1688227844",
    "id": 6
  },
  {
    "domain": ".webnovel.com",
    "expirationDate": 1688288529,
    "hostOnly": false,
    "httpOnly": false,
    "name": "AMP_TOKEN",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "%24NOT_FOUND",
    "id": 7
  },
  {
    "domain": ".webnovel.com",
    "expirationDate": 1719820928,
    "hostOnly": false,
    "httpOnly": false,
    "name": "bookCitysex",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "1",
    "id": 8
  },
  {
    "domain": ".webnovel.com",
    "expirationDate": 1690877548,
    "hostOnly": false,
    "httpOnly": false,
    "name": "e1",
    "path": "/book/the-mech-touch_10636300105085505",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "%7B%22pid%22%3A%22qi_p_bookread%22%2C%22l1%22%3A1%2C%22eid%22%3A%22qi_P_reader%22%7D",
    "id": 9
  },
  {
    "domain": ".webnovel.com",
    "expirationDate": 1690876969,
    "hostOnly": false,
    "httpOnly": false,
    "name": "e1",
    "path": "/book",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "%7B%22pid%22%3A%22qi_p_bookdetail%22%2C%22eid%22%3A%22E10%22%2C%22l1%22%3A%2214%22%7D",
    "id": 10
  },
  {
    "domain": ".webnovel.com",
    "expirationDate": 1690876933,
    "hostOnly": false,
    "httpOnly": false,
    "name": "e1",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "%7B%22pid%22%3A%22bookstore%22%2C%22eid%22%3A%22qi_A_bookcover%22%7D",
    "id": 11
  },
  {
    "domain": ".webnovel.com",
    "expirationDate": 1690877548,
    "hostOnly": false,
    "httpOnly": false,
    "name": "e2",
    "path": "/book/the-mech-touch_10636300105085505",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "%7B%22pid%22%3A%22qi_p_bookread%22%2C%22l1%22%3A1%2C%22eid%22%3A%22qi_P_reader%22%7D",
    "id": 12
  },
  {
    "domain": ".webnovel.com",
    "expirationDate": 1690876969,
    "hostOnly": false,
    "httpOnly": false,
    "name": "e2",
    "path": "/book",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "%7B%22pid%22%3A%22qi_p_bookread%22%2C%22l1%22%3A1%2C%22eid%22%3A%22qi_P_reader%22%7D",
    "id": 13
  },
  {
    "domain": ".webnovel.com",
    "expirationDate": 1690876933,
    "hostOnly": false,
    "httpOnly": false,
    "name": "e2",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "%7B%22pid%22%3A%22bookstore%22%2C%22l1%22%3A%2299%22%7D",
    "id": 14
  },
  {
    "domain": ".webnovel.com",
    "expirationDate": 1719766468,
    "hostOnly": false,
    "httpOnly": false,
    "name": "para-comment-tip-show",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "1",
    "id": 15
  },
  {
    "domain": ".webnovel.com",
    "expirationDate": 1719766703,
    "hostOnly": false,
    "httpOnly": false,
    "name": "paragraphSwitch",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "0",
    "id": 16
  },
  {
    "domain": ".webnovel.com",
    "expirationDate": 1719820991,
    "hostOnly": false,
    "httpOnly": false,
    "name": "tc",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "_color3",
    "id": 17
  },
  {
    "domain": ".webnovel.com",
    "expirationDate": 1697211061,
    "hostOnly": false,
    "httpOnly": false,
    "name": "tf",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "_font2",
    "id": 18
  },
  {
    "domain": ".webnovel.com",
    "expirationDate": 1719820985,
    "hostOnly": false,
    "httpOnly": false,
    "name": "ts",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "14",
    "id": 19
  },
  {
    "domain": ".webnovel.com",
    "expirationDate": 1689581548,
    "hostOnly": false,
    "httpOnly": false,
    "name": "uid",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "4320658764",
    "id": 20
  },
  {
    "domain": ".webnovel.com",
    "expirationDate": 1689581548,
    "hostOnly": false,
    "httpOnly": false,
    "name": "ukey",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "u7xkMYFC9U3",
    "id": 21
  },
  {
    "domain": ".webnovel.com",
    "expirationDate": 1696351637.020007,
    "hostOnly": false,
    "httpOnly": false,
    "name": "webnovel_uuid",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "1661791637_323045510",
    "id": 22
  },
  {
    "domain": "www.webnovel.com",
    "hostOnly": true,
    "httpOnly": false,
    "name": "_yep_uuid",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": true,
    "storeId": "0",
    "value": "d80a158c-1a3b-d344-ed2d-f54be56c1497",
    "id": 23
  },
  {
    "domain": "www.webnovel.com",
    "expirationDate": 1722790564.473158,
    "hostOnly": true,
    "httpOnly": false,
    "name": "dontneedgoogleonetap",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "1",
    "id": 24
  }
]

// imageToHTML(imagePath, apiKey)
//   .catch((error) => {
//     console.error('Lỗi khi chuyển đổi ảnh thành HTML:', error);
//   });


const test = async function () {
  const browser = await puppeteer.launch({
    "headless": false,
    args: [
      '--window-size=1500,1080',
      '--disable-dev-profile',
      '--no-sandbox',
      '--disable-web-security'
    ]

  });
  //db cha-paragraph
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(200000);
  // await page.setRequestInterception(true);
  await page.setCookie(...cookie);
  // page.on('request', (req) => {
  //   if (req.resourceType() == 'font') {
  //     req.abort();
  //   } else {
  //     req.continue();
  //   }
  // });
  await page.goto(`https://www.webnovel.com/book/the-mech-touch_10636300105085505/how-to-progress-quickly_71620677567838896`);
  try {
    const elementSelector = '.chapter_content';
    let elementCount = 0;
    let firstElementCaptured = false;

    while (!firstElementCaptured) {
      await page.evaluate((selector) => {
        const element = document.querySelector(selector);
        if (element) {
          element.focus();
        }
      }, elementSelector);

      elementCount = await page.evaluate(selector => {
        const elements = document.querySelectorAll(selector);
        return elements.length;
      }, elementSelector);

      if (elementCount >= 2) {
        // Chụp ảnh của phần tử đầu tiên
        // await page.setJavaScriptEnabled(false);
        const firstElement = await page.$(elementSelector);
        await firstElement.screenshot({ path: 'screenshot.png' });
        firstElementCaptured = true;
      } else {

        await page.mouse.wheel({ deltaY: 10 }); // Cuộn chuột bằng 100px
        // await page.waitForTimeout(0); // Thời gian chờ giữa các lần cuộn (milisecond)
      }
    }


  } catch (error) {

  }
  //chapter_content
}
test()
