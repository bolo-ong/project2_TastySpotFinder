const puppeteer = require("puppeteer");

export async function crawlData(url: string) {
  const dataSetArray = [];
  //페이지 초기 세팅
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(url);
  await new Promise((resolve) => setTimeout(resolve, 5000));

  //iframeSelect & 내부 컨텐츠에 접근
  const iframeSelector = "#myPlaceBookmarkListIframe";
  await page.waitForSelector(iframeSelector);
  const iframeHandle = await page.$(iframeSelector);
  const frame = await iframeHandle.contentFrame();

  //스크롤 끝까지 내려갔다가 최상단으로 복귀
  let prevHeight = 0;
  while (true) {
    await frame.evaluate("scrollTo(0, document.body.scrollHeight)");
    await new Promise((resolve) => setTimeout(resolve, 700));
    const currentHeight = await frame.evaluate("document.body.scrollHeight");
    if (currentHeight === prevHeight) {
      break;
    }
    prevHeight = currentHeight;
  }
  await frame.evaluate("scrollTo(0, 0)");
  await new Promise((resolve) => setTimeout(resolve, 700));

  //식당 리스트 Xpath와 Handles선언
  const listItemXpath = '//*[@id="__next"]/div/div/div[2]/div/div[2]/ul/li';
  const listItemHandles = await frame.$x(listItemXpath);

  //식당 리스트 내부의 식당들 크롤링 시작
  for (let i = 0; i < listItemHandles.length; i++) {
    await listItemHandles[i].click();
    //폐업 식당 모달창 종료를 위해 한번 더 클릭
    await listItemHandles[i].click();

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const iframeSelector = "#entryIframe";
    const iframeHandle = await page.$(iframeSelector);

    if (iframeHandle) {
      const frame = await iframeHandle.contentFrame();

      //스크롤 끝까지 내려가기
      let prevHeight = 0;
      while (true) {
        await frame.evaluate("scrollTo(0, document.body.scrollHeight)");
        await new Promise((resolve) => setTimeout(resolve, 700));
        // 현재 iframe 내부의 스크롤 높이 가져오기
        const currentHeight = await frame.evaluate(
          "document.body.scrollHeight"
        );
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
        if (
          validLocations.some((location) => locationText.includes(location))
        ) {
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
      const menuXpathSelector = [
        `//*[@id="app-root"]/div/div/div/div[7]/div/div[3]/div[1]/ul/li`,
        `//*[@id="app-root"]/div/div/div/div[7]/div/div[2]/div[1]/ul/li`,
      ];
      let menuElementHandles;
      let menuText = "등록되어 있지 않습니다.";
      for (const selector of menuXpathSelector) {
        menuElementHandles = await frame.$x(selector);
        menuText = await menuElementHandles[0]?.evaluate(
          (element: Element) => element.textContent
        );
        if (
          (menuText && menuText.includes("00원")) ||
          (menuText && menuText.includes("변동"))
        ) {
          for (let j = 0; j < menuElementHandles.length; j++) {
            menuText = await menuElementHandles[j].evaluate(
              (element: Element) => element.textContent
            );
            let cleanedText = menuText
              .replace(/(사진|대표)/g, "")
              .replace(/변동.*/, " 변동")
              .replace(/원.*/, "원")
              .replace(/(\d+(,\d+)원)/, " $1");
            menuDataArray.push(cleanedText);
          }
          break;
        }
      }

      const imgDataArray = [];
      const imgTabXpathSelector = [
        `//*[@id="app-root"]/div/div/div/div[7]/div/div[5]/div[1]/div/ul/li`,
        `//*[@id="app-root"]/div/div/div/div[7]/div/div[6]/div[1]/div/ul/li`,
        `//*[@id="app-root"]/div/div/div/div[7]/div/div[4]/div[1]/div/ul/li`,
        `//*[@id="app-root"]/div/div/div/div[7]/div/div[3]/div[1]/div/ul/li`,
      ];
      let imgTabElementHandles;
      for (const selector of imgTabXpathSelector) {
        imgTabElementHandles = await frame.$x(selector);
        if (imgTabElementHandles.length === 9) {
          let src;
          for (let j = 0; j < 4; j++) {
            imgTabElementHandles[j].click();
            await new Promise((resolve) => setTimeout(resolve, 300));
            const imgElementHandles = await page.$x(
              `/html/body/div[3]/div/div[1]/div/div/img`
            );
            for (const imgElementHandle of imgElementHandles) {
              src = await imgElementHandle.evaluate((element: Element) =>
                element.getAttribute("src")
              );
            }
            await imgDataArray.push(src);
            await page.keyboard.press("Escape");
          }
          break;
        }
      }

      type DataObject = {
        name: string;
        category: string;
        location: string;
        contact: string;
        menu: string[];
        img: string[];
      };

      const dataObject: DataObject = {
        name: nameText,
        category: categoryText,
        location: locationText,
        contact: contactText,
        menu: menuDataArray,
        img: imgDataArray,
      };
      //메뉴 데이터가 없으면 식당이 아닌걸로 판단
      if (menuDataArray.length > 0) {
        dataSetArray.push(dataObject);
      }
    }
  }
  await browser.close();
  return dataSetArray;
}
