const puppeteer = require("puppeteer");

// const url = "https://naver.me/IxWIraXF";
const url = "https://naver.me/x3qhEqMD";
//const url = "https://naver.me/5DjLXi1A";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(url);
  await page.waitForTimeout(5000);

  const iframeSelector = "#myPlaceBookmarkListIframe";
  await page.waitForSelector(iframeSelector);
  const iframeHandle = await page.$(iframeSelector);
  const frame = await iframeHandle.contentFrame();

  let prevHeight = 0;
  while (true) {
    // 스크롤 끝까지 내리기
    await frame.evaluate("scrollTo(0, document.body.scrollHeight)");
    await page.waitForTimeout(700);
    // 현재 iframe 내부의 스크롤 높이 가져오기
    const currentHeight = await frame.evaluate("document.body.scrollHeight");
    // 스크롤이 더 이상 되지 않으면 종료
    if (currentHeight === prevHeight) {
      break;
    }
    prevHeight = currentHeight;
  }
  // 스크롤이 맨 아래까지 내려간 후, 맨 위로 올리기
  await frame.evaluate("scrollTo(0, 0)");
  await page.waitForTimeout(700);

  const listItemXpath = '//*[@id="__next"]/div/div/div[2]/div/div[2]/ul/li';
  const listItemHandles = await frame.$x(listItemXpath);

  const dataSetArray = [];

  for (let i = 0; i < listItemHandles.length; i++) {
    await listItemHandles[i].click();
    //폐업 식당 모달창 종료를 위해 한번 더 클릭
    await listItemHandles[i].click();

    await page.waitForTimeout(3000);

    const iframeSelector = "#entryIframe";
    const iframeHandle = await page.$(iframeSelector);

    if (!iframeHandle) {
      console.log("아이프레임이 존재하지 않으므로 다음으로 넘어갑니다.");
      continue;
    }

    const frame = await iframeHandle.contentFrame();

    let prevHeight = 0;
    while (true) {
      // 스크롤 끝까지 내리기
      await frame.evaluate("scrollTo(0, document.body.scrollHeight)");
      await page.waitForTimeout(700);
      // 현재 iframe 내부의 스크롤 높이 가져오기
      const currentHeight = await frame.evaluate("document.body.scrollHeight");
      // 스크롤이 더 이상 되지 않으면 종료
      if (currentHeight === prevHeight) {
        break;
      }
      prevHeight = currentHeight;
    }

    let nameText = "등록되어 있지 않습니다.";
    const nameXpathSelector = `//*[@id="_title"]/span[1]`;
    const nameElementHandles = await frame.$x(nameXpathSelector);
    for (const nameElementHandle of nameElementHandles) {
      nameText = await nameElementHandle.evaluate(
        (element: Element) => element.textContent
      );
    }

    let categoryText = "등록되어 있지 않습니다.";
    const categoryXpathSelector = `//*[@id="_title"]/span[2]`;
    const categoryElementHandles = await frame.$x(categoryXpathSelector);
    for (const categoryElementHandle of categoryElementHandles) {
      categoryText = await categoryElementHandle.evaluate(
        (element: Element) => element.textContent
      );
    }

    let locationText = "등록되어 있지 않습니다.";
    const locationXpathSelector = `//*[@id="app-root"]/div/div/div/div/div/div/div/div/div[1]/div/a/span[1]`;
    const locationElementHandles = await frame.$x(locationXpathSelector);
    for (const locationElementHandle of locationElementHandles) {
      locationText = await locationElementHandle.evaluate(
        (element: Element) => element.textContent
      );
      const validLocations = ["도", "시", "군", "구", "동", "읍", "면", "리"];
      if (validLocations.some((location) => locationText.includes(location))) {
        break;
      } else {
        locationText = "등록되어 있지 않습니다.";
      }
    }

    let contactText = "등록되어 있지 않습니다.";
    const contactXpathSelector = `//*[@id="app-root"]/div/div/div/div/div/div/div/div/div/div/span[1]`;
    const contactElementHandles = await frame.$x(contactXpathSelector);
    for (const contactElementHandle of contactElementHandles) {
      contactText = await contactElementHandle.evaluate(
        (element: Element) => element.textContent
      );
      if (contactText.match(/\d+-\d+-\d+/)) {
        break;
      } else {
        contactText = "등록되어 있지 않습니다.";
      }
    }

    const menuDataArray = [];
    const menuTabXpathSelector = `//*[@id="app-root"]/div/div/div/div[7]/div/div[3]/div[1]/ul/li`;
    const menuTabElementHandles = await frame.$x(menuTabXpathSelector);
    if (menuTabElementHandles) {
      let menuText = "등록되어 있지 않습니다.";
      let priceText = "등록되어 있지 않습니다.";
      for (let j = 0; j < menuTabElementHandles.length; j++) {
        const menuXpathSelectors = [
          `//*[@id="app-root"]/div/div/div/div[7]/div/div[3]/div[1]/ul/li[${
            j + 1
          }]/a/div[2]/div[1]/div`,
          `//*[@id="app-root"]/div/div/div/div[7]/div/div[3]/div[1]/ul/li[${
            j + 1
          }]/div/div/span/a[1]`,
        ];
        let menuElementHandles;
        for (const selector of menuXpathSelectors) {
          menuElementHandles = await frame.$x(selector);
          for (const menuElementHandle of menuElementHandles) {
            menuText = await menuElementHandle.evaluate(
              (element: Element) => element.textContent
            );
            if (menuText) {
              break;
            }
          }
        }

        const priceXpathSelectors = [
          `//*[@id="app-root"]/div/div/div/div[7]/div/div[3]/div[1]/ul/li[${
            j + 1
          }]/a/div[2]/div[2]/div`,
          `//*[@id="app-root"]/div/div/div/div[7]/div/div[3]/div[1]/ul/li[${
            j + 1
          }]/div/em`,
        ];
        let priceElementHandles;
        for (const selector of priceXpathSelectors) {
          priceElementHandles = await frame.$x(selector);
          for (const priceElementHandle of priceElementHandles) {
            priceText = await priceElementHandle.evaluate(
              (element: Element) => element.textContent
            );
            if (
              (priceText && priceText.includes("00원")) ||
              (priceText && priceText.includes("변동"))
            ) {
              break;
            }
          }
        }
        const nameAndPrice = menuText + " " + priceText;
        menuDataArray.push(nameAndPrice);
      }
    }

    const imgDataArray = [];
    const imgTabXpathSelector = `//*[@id="app-root"]/div/div/div/div[7]/div/div/div[1]/div/ul/li`;
    const imgTabElementHandles = await frame.$x(imgTabXpathSelector);
    if (imgTabElementHandles) {
      let src;
      for (let j = 0; j < 4; j++) {
        imgTabElementHandles[j].click();
        await page.waitForTimeout(300);
        const imgElementHandles = await page.$x(
          `  /html/body/div[3]/div/div[1]/div/div/img`
        );
        for (const imgElementHandle of imgElementHandles) {
          src = await imgElementHandle.evaluate((element: Element) =>
            element.getAttribute("src")
          );
        }
        await imgDataArray.push(src);
        await page.keyboard.press("Escape");
      }
    }

    const dataObject = {
      name: nameText,
      category: categoryText,
      location: locationText,
      contact: contactText,
      menu: menuDataArray,
      img: imgDataArray,
    };

    dataSetArray.push(dataObject);
    console.log(dataObject);
  }

  //   console.log(dataSetArray);
  // 여기에 데이터를 어딘가에 저장하는 코드를 추가할 수 있습니다.

  await browser.close();
})();
