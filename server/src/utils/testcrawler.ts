const puppeteer = require("puppeteer");

// const url = "https://naver.me/IxWIraXF";
const url = "https://naver.me/x3qhEqMD";
//const url = "https://naver.me/5DjLXi1A";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(url);
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // iframe 요소 선택자
  const iframeSelector = "#myPlaceBookmarkListIframe";

  // iframe 요소가 로딩될 때까지 대기
  await page.waitForSelector(iframeSelector);

  // iframe 요소에 대한 핸들을 가져옴
  const iframeHandle = await page.$(iframeSelector);

  // iframe 내부 컨텐츠로 이동
  const frame = await iframeHandle.contentFrame();

  // iframe 내부의 스크롤 높이 초기값
  let prevHeight = 0;

  while (true) {
    // iframe 내부의 스크롤 끝까지 내리기
    await frame.evaluate("scrollTo(0, document.body.scrollHeight)");

    // 1초 대기 (비동기적으로)
    await new Promise((resolve) => setTimeout(resolve, 1000));

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
  await page.waitForTimeout(1000);

  const listItemXpath = '//*[@id="__next"]/div/div/div[2]/div/div[2]/ul/li';
  const listItemHandles = await frame.$x(listItemXpath);

  const dataSetArray = [];

  for (let i = 0; i < listItemHandles.length; i++) {
    await listItemHandles[i].click();
    await page.waitForTimeout(3000);

    const iframeSelector = "#entryIframe";
    // iframe 요소에 대한 핸들을 가져옴
    const iframeHandle = await page
      .waitForSelector(iframeSelector, { timeout: 1000 })
      .catch(() => null);

    if (!iframeHandle) {
      console.log("아이프레임이 존재하지 않으므로 다음으로 넘어갑니다.");
      await listItemHandles[i].click();
      await page.waitForTimeout(3000);

      continue;
    }

    // iframe 내부 컨텐츠로 이동
    const frame = await iframeHandle.contentFrame();

    const nameXpathSelector = `//*[@id="_title"]/span[1]`;
    const categoryXpathSelector = `//*[@id="_title"]/span[2]`;
    const locationXpathSelector = `//*[@id="app-root"]/div/div/div/div[6]/div/div[2]/div/div/div[1]/div/a/span[1]`;
    //*[@id="app-root"]/div/div/div/div[7]/div/div[2]/div/div/div[1]/div/a/span[1]
    //*[@id="app-root"]/div/div/div/div[7]/div/div[2]/div/div/div[1]/div/a/span[1]
    //*[@id="app-root"]/div/div/div/div[6]/div/div[2]/div/div/div[1]/div/a/span[1]
    //*[@id="app-root"]/div/div/div/div[6]/div/div[2]/div/div/div[1]/div/a/span[1]
    //*[@id="app-root"]/div/div/div/div[6]/div/div[2]/div/div/div[1]/div/a/span[1]
    //*[@id="app-root"]/div/div/div/div[6]/div/div[2]/div/div/div[1]/div/a/span[1]
    const contactXpathSelector = `//*[@id="app-root"]/div/div/div/div[6]/div/div[2]/div/div/div[4]/div/span[1]`;
    //*[@id="app-root"]/div/div/div/div[7]/div/div[2]/div/div/div[4]/div/span[1]
    //*[@id="app-root"]/div/div/div/div[7]/div/div[2]/div/div/div[4]/div/span[1]
    //*[@id="app-root"]/div/div/div/div[6]/div/div[2]/div/div/div[3]/div/span[1]
    //*[@id="app-root"]/div/div/div/div[6]/div/div[2]/div/div/div[4]/div/span[1]
    //*[@id="app-root"]/div/div/div/div[6]/div/div[2]/div/div/div[4]/div/span[1]
    const snsXpathSelector = `//*[@id="app-root"]/div/div/div/div[7]/div/div[2]/div/div/div[6]/div/div/a`;
    // const descriptionXpathSelector = `//*[@id="app-root"]/div/div/div/div[7]/div/div[2]/div/div/div[7]/div/div/span`;

    const [
      nameElementHandle,
      categoryElementHandle,
      locationElementHandle,
      contactXpathHandle,
      snsXpathHandle,
      //   descriptionXpathHandle,
    ] = await Promise.all([
      frame.$x(nameXpathSelector),
      frame.$x(categoryXpathSelector),
      frame.$x(locationXpathSelector),
      frame.$x(contactXpathSelector),
      frame.$x(snsXpathSelector),
      //   frame.$x(descriptionXpathSelector),
    ]);

    const nameElementText =
      nameElementHandle && nameElementHandle[0]
        ? await nameElementHandle[0].evaluate(
            (element: Element) => element.textContent
          )
        : null;
    const categoryElementText =
      categoryElementHandle && categoryElementHandle[0]
        ? await categoryElementHandle[0].evaluate(
            (element: Element) => element.textContent
          )
        : null;
    const locationElementText =
      locationElementHandle && locationElementHandle[0]
        ? await locationElementHandle[0].evaluate(
            (element: Element) => element.textContent
          )
        : null;
    const contactElementText =
      contactXpathHandle && contactXpathHandle[0]
        ? await contactXpathHandle[0].evaluate(
            (element: Element) => element.textContent
          )
        : null;
    const snsElementText =
      snsXpathHandle && snsXpathHandle[0]
        ? await snsXpathHandle[0].evaluate(
            (element: Element) => element.textContent
          )
        : null;
    // const descriptionElementText =
    //   descriptionXpathHandle && descriptionXpathHandle[0]
    //     ? await descriptionXpathHandle[0].evaluate(
    //         (element: Element) => element.textContent
    //       )
    //     : null;

    const menuTabSelectors = [
      `//*[@id="app-root"]/div/div/div/div[5]/div/div/div/div/a[2]/span`,
      `//*[@id="app-root"]/div/div/div/div[5]/div/div/div/div/a[3]/span`,
    ];
    let menuTabHandles;
    for (const selector of menuTabSelectors) {
      menuTabHandles = await frame.$x(selector);
      const menuText = await menuTabHandles[0].evaluate(
        (element: Element) => element.textContent
      );
      if (menuText === "메뉴") {
        break;
      }
    }

    const menuDataArray = [];

    if (menuTabHandles) {
      await menuTabHandles[0].click();
      await page.waitForTimeout(3000);
      const menuXpathSelectors = [
        `//*[@id="root"]/div[3]/div/div/div[2]/div[2]/div[1]/ul/li`,
        `//*[@id="app-root"]/div/div/div/div[7]/div[2]/div[1]/div/ul/li`,
        `//*[@id="app-root"]/div/div/div/div[7]/div/div[3]/div/ul/li`,
        `//*[@id="app-root"]/div/div/div/div[7]/div/div/div/ul/li`,
        `//*[@id="app-root"]/div/div/div/div[6]/div/div/div/ul/li`,
      ];
      let menuElementHandles;
      for (const selector of menuXpathSelectors) {
        menuElementHandles = await frame.$x(selector);
        if (menuElementHandles.length > 0) {
          break;
        }
      }

      if (menuElementHandles) {
        for (let j = 0; j < menuElementHandles.length; j++) {
          const nameXpathSelectors = [
            `//*[@id="app-root"]/div/div/div/div/div/div/div/ul/li[${
              j + 1
            }]/a/div/div/div/span`,
            `//*[@id="root"]/div[3]/div/div/div[2]/div[2]/div/ul/li[${
              j + 1
            }]/div/a/div/div`,
          ];

          let nameElementHandles;
          let nameText;
          const nameFindMaxRetries = 3;
          let nameFindRetryCount = 0;

          while (
            nameFindRetryCount < nameFindMaxRetries &&
            (nameText === undefined || !nameText)
          ) {
            for (const selector of nameXpathSelectors) {
              nameElementHandles = await frame.$x(selector);
              for (const nameElementHandle of nameElementHandles) {
                nameText = await nameElementHandle.evaluate(
                  (element: Element) => element.textContent
                );
                if (nameText) {
                  break;
                }
              }
            }
            nameFindRetryCount++;
          }

          const priceXpathSelectors = [
            `//*[@id="app-root"]/div/div/div/div[7]/div/div/div/ul/li[${
              j + 1
            }]/a/div/div`,
            `//*[@id="root"]/div[3]/div/div/div/div/div/ul/li[${
              j + 1
            }]/div/a/div/div`,
          ];

          let priceElementHandles;
          let priceText;
          let isFind = false;
          const priceFindMaxRetries = 3;
          let priceFindRetryCount = 0;

          while (priceFindRetryCount < priceFindMaxRetries && isFind == false) {
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
                  isFind = true;
                  break;
                }
              }
            }
            priceFindRetryCount++;
          }

          const nameAndPrice = nameText + " " + priceText;
          menuDataArray.push(nameAndPrice);
        }
      }
    }

    // const reviewTabXpathSelector = `//*[@id="app-root"]/div/div/div/div[5]/div/div/div/div/a[3]/span`;
    // const [reviewTabHandle] = await frame.$x(reviewTabXpathSelector);
    // const reviewDataArray = [];
    // if (reviewTabHandle) {
    //   await reviewTabHandle.click();
    //   await page.waitForTimeout(1000);
    //   const reviewXpathSelector = `//*[@id="app-root"]/div/div/div/div[7]/div[2]/div[1]/div/ul/li`;
    //   const [reviewElementHandles] = await frame.$x(reviewXpathSelector);
    //   if (reviewElementHandles && reviewElementHandles.length) {
    //     for (let j = 0; j < reviewElementHandles.length; j++) {
    //       const reviewElementText = await reviewElementHandles[j].evaluate(
    //         (element: Element) => element.textContent
    //       );
    //       reviewDataArray.push(reviewElementText);
    //     }
    //   }
    // }

    // const imgTabXpathSelector = `//*[@id="app-root"]/div/div/div/div[5]/div/div/div/div/a[3]/span`;
    // const [imgTabHandle] = await frame.$x(imgTabXpathSelector);
    // const imgDataArray = [];
    // if (imgTabHandle) {
    //   await imgTabHandle.click();
    //   await page.waitForTimeout(2000);
    //   const imgXpathSelector = `//*[@id="app-root"]/div/div/div/div[7]/div[2]/div[1]/div/ul/li`;
    //   const [imgElementHandles] = await frame.$x(imgXpathSelector);
    //   if (imgElementHandles && imgElementHandles.length) {
    //     for (let j = 0; j < imgElementHandles.length; j++) {
    //       const imgElement = imgElementHandles[j];
    //       const imgSrc = await imgElement.evaluate((element: Element) =>
    //         element.getAttribute("src")
    //       );
    //       imgDataArray.push(imgSrc);
    //     }
    //   }
    // }

    const dataObject = {
      name: nameElementText,
      category: categoryElementText,
      location: locationElementText,
      contact: contactElementText,
      sns: snsElementText,
      //   description: descriptionElementText,
      menu: menuDataArray,
      //   review: reviewDataArray,
      //   img: imgDataArray,
    };
    dataSetArray.push(dataObject);
    console.log(dataObject);
  }
  //   console.log(dataSetArray);
  // 여기에 데이터를 어딘가에 저장하는 코드를 추가할 수 있습니다.

  await browser.close();
})();
