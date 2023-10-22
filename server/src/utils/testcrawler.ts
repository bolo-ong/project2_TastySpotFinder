const puppeteer = require("puppeteer");
import { RestaurantType } from "../models/Restaurant";

export async function crawlData(url: string): Promise<RestaurantType[]> {
  const dataSetArray = [];
  //페이지 초기 세팅
  const browser = await puppeteer.launch({
    headless: "new",
  });

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

      const menuTabXpathSelector = [
        `//*[@id="app-root"]/div/div/div/div[4]/div/div/div/div/a[2]/span`,
        `//*[@id="app-root"]/div/div/div/div[4]/div/div/div/div/a[3]/span`,
      ];
      const menuDataArray = [];
      const menuNameArray = [];
      const menuPriceArray = [];
      for (const selector of menuTabXpathSelector) {
        const menuTabElementHandles = await frame.$x(selector);
        const menuTabText = await menuTabElementHandles[0]?.evaluate(
          (element: Element) => element.textContent
        );
        if (menuTabText && menuTabText === "메뉴") {
          await menuTabElementHandles[0].click();
          await new Promise((resolve) => setTimeout(resolve, 2000));

          const menuNameXpathSelector = [
            `//*[@id="root"]/div[3]/div/div/div[2]/div[2]/div[2]/ul/li/div/a[1]/div[2]/div[1]`,
            `//*[@id="app-root"]/div/div/div/div[6]/div/div/div/ul/li/a/div/div/div/span[1]`,
          ];
          for (const selector of menuNameXpathSelector) {
            const menuNameElementHandles = await frame.$x(selector);
            if (menuNameElementHandles.length > 0) {
              for (let i = 0; i < menuNameElementHandles.length; i++) {
                let menuName = await menuNameElementHandles[i].evaluate(
                  (element: Element) => element.textContent
                );
                let cleanedMenuName = menuName.replace(/(사진|대표|인기)/g, "");
                menuNameArray.push(cleanedMenuName);
              }
              break;
            }
          }
          const menuPriceXpathSelector = [
            `//*[@id="root"]/div[3]/div/div/div[2]/div[2]/div[2]/ul/li/div/a[1]/div[2]/div[4]`,
            `//*[@id="app-root"]/div/div/div/div[6]/div/div/div/ul/li/a/div/div`,
          ];
          for (const selector of menuPriceXpathSelector) {
            const menuPriceElementHandles = await frame.$x(selector);
            if (menuPriceElementHandles.length > 0) {
              for (let i = 0; i < menuPriceElementHandles.length; i++) {
                let menuPrice = await menuPriceElementHandles[i].evaluate(
                  (element: Element) => element.textContent
                );
                if (
                  menuPrice &&
                  (menuPrice.includes("00원") || menuPrice.includes("변동"))
                ) {
                  menuPriceArray.push(menuPrice);
                }
              }
              break;
            }
          }
          break;
        }
      }
      const setMenuArray = [...new Set(menuNameArray)];
      for (let i = 0; i < setMenuArray.length; i++) {
        menuDataArray.push(setMenuArray[i] + " " + menuPriceArray[i]);
      }

      const imgTabXpathSelector = [
        `//*[@id="app-root"]/div/div/div/div[4]/div/div/div/div/a[4]/span`,
        `//*[@id="app-root"]/div/div/div/div[4]/div/div/div/div/a[5]/span`,
        `//*[@id="app-root"]/div/div/div/div[4]/div/div/div/div/a[6]/span`,
        `//*[@id="root"]/div[2]/div/header/div[2]/div/a[6]`,
        `//*[@id="root"]/div[2]/div/header/div[2]/div/a[5]`,
        `//*[@id="root"]/div[2]/div/header/div[2]/div/a[4]`,
      ];
      const imgDataArray: string[] = [];
      for (const selector of imgTabXpathSelector) {
        const imgTabElementHandles = await frame.$x(selector);
        const imgTabText = await imgTabElementHandles[0]?.evaluate(
          (element: Element) => element.textContent
        );

        if (imgTabText && imgTabText === "사진") {
          await imgTabElementHandles[0].click();
          await new Promise((resolve) => setTimeout(resolve, 3000));

          const visitorXpathSelector = [
            `//*[@id="app-root"]/div/div/div/div[6]/div/div/div/div/div/span`,
            `//*[@id="app-root"]/div/div/div/div[5]/div/div/div/div/div/span`,
            `//*[@id="app-root"]/div/div/div/div[4]/div/div/div/div/div/span`,
          ];
          for (const selector of visitorXpathSelector) {
            const visitorElementHandles = await frame.$x(selector);
            console.log(visitorElementHandles);
            for (let i = 0; i < visitorElementHandles.length; i++) {
              const visitorText = await visitorElementHandles[i].evaluate(
                (element: Element) => element.textContent
              );
              console.log(visitorText);
              if (visitorText === "방문자") {
                await visitorElementHandles[i].click();
                await new Promise((resolve) => setTimeout(resolve, 2000));

                const imgSelector = [
                  `//*[@id="app-root"]/div/div/div/div[6]/div[4]/div/div/div/div`,
                  `//*[@id="app-root"]/div/div/div/div[5]/div[4]/div/div/div/div`,
                  `//*[@id="app-root"]/div/div/div/div[4]/div[4]/div/div/div/div`,
                  `//*[@id="app-root"]/div/div/div/div[6]/div[3]/div/div/div/div`,
                  `//*[@id="app-root"]/div/div/div/div[5]/div[3]/div/div/div/div`,
                  `//*[@id="app-root"]/div/div/div/div[4]/div[3]/div/div/div/div`,
                ];
                for (const selector of imgSelector) {
                  const imgElementHandles = await frame.$x(selector);
                  console.log(imgElementHandles);
                  for (let i = 0; i < 4; i++) {
                    await imgElementHandles[i].click();
                    await new Promise((resolve) => setTimeout(resolve, 300));
                    const imgSrcElementHandle = await page.$x(
                      `/html/body/div[3]/div/div[1]/div/div/img | /html/body/div[3]/div/div[1]/div/div/video`
                    );
                    const src = await imgSrcElementHandle[0].evaluate(
                      (element: Element) => element.getAttribute("src")
                    );
                    await imgDataArray.push(src);
                    await page.keyboard.press("Escape");
                  }
                  break;
                }
              }
            }
            break;
          }
        }
      }

      // const imgTabXpathSelector = [
      //   `//*[@id="app-root"]/div/div/div/div/div/div[5]/div[1]/ul/li`,
      //   `//*[@id="app-root"]/div/div/div/div/div/div[6]/div[1]/ul/li`,
      //   `//*[@id="app-root"]/div/div/div/div/div/div[4]/div[1]/ul/li`,
      //   `//*[@id="app-root"]/div/div/div/div/div/div[3]/div[1]/ul/li`,
      // ];
      // let imgTabElementHandles;

      // for (const selector of imgTabXpathSelector) {
      //   imgTabElementHandles = await frame.$x(selector);
      //   if (imgTabElementHandles.length === 9) {
      //     let src;
      //     for (let j = 0; j < 4; j++) {
      //       await imgTabElementHandles[j].click();
      //       await new Promise((resolve) => setTimeout(resolve, 300));
      //       const imgElementHandles = await page.$x(
      //         `/html/body/div[3]/div/div[1]/div/div/img | /html/body/div[3]/div/div[1]/div/div/video`
      //       );
      //       for (const imgElementHandle of imgElementHandles) {
      //         src = await imgElementHandle.evaluate((element: Element) =>
      //           element.getAttribute("src")
      //         );
      //       }
      //       await imgDataArray.push(src);
      //       await page.keyboard.press("Escape");
      //     }

      //     break;
      //   }
      // }

      const dataObject: RestaurantType = {
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
  console.log(dataSetArray);
  console.log(dataSetArray.length);
  return dataSetArray;
}

crawlData("https://naver.me/IxWIraXF");
//crawlData("https://naver.me/IgDvylC0");
