import puppeteer from "puppeteer-extra";
import { Browser, ElementHandle, Page, Frame } from "puppeteer";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { RestaurantType } from "../models/Restaurant";

// 스텔스 플러그인 추가
puppeteer.use(StealthPlugin());

/**
 * XPath로 요소를 찾고 클릭하는 헬퍼 함수
 */
async function clickByXPath(page: Page | Frame, xpath: string) {
  const elements = await page.$$(`xpath/${xpath}`);
  if (elements.length > 0) {
    await elements[0].click();
  }
}

/**
 * XPath로 요소들을 찾는 헬퍼 함수
 */
async function findByXPath(
  page: Page | Frame,
  xpath: string
): Promise<ElementHandle[]> {
  return await page.$$(`xpath/${xpath}`);
}

export async function crawlData(url: string): Promise<RestaurantType[]> {
  const dataSetArray = [];
  const noMenuRestaurants = [];
  let browser: Browser | null = null;

  console.log("크롤링 시작...");
  console.log(
    "Chrome 실행 경로:",
    process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/google-chrome-stable"
  );

  // 환경 변수에서 타임아웃 값 가져오기 (기본값: 120000ms)
  const protocolTimeout = parseInt(
    process.env.PUPPETEER_TIMEOUT || "120000",
    10
  );
  console.log("Puppeteer 타임아웃 설정:", protocolTimeout);

  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH ||
        "/usr/bin/google-chrome-stable",
      protocolTimeout: protocolTimeout,
      dumpio: true, // 브라우저 콘솔 로그 출력
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-extensions",
        "--disable-infobars",
        "--ignore-certificate-errors",
        "--ignore-certificate-errors-spki-list",
        "--disable-features=IsolateOrigins,site-per-process",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
        "--memory-pressure-off",
        "--disable-web-security",
        "--allow-running-insecure-content",
        "--proxy-server='direct://'",
        "--proxy-bypass-list=*",
        "--js-flags=--max-old-space-size=512",
        "--disable-dev-profile",
        "--window-size=1920,1080",
        "--start-maximized",
        "--user-data-dir=/tmp/puppeteer",
      ],
    });

    console.log("브라우저 실행 완료");

    const page = await browser.newPage();

    // 리소스 로딩 최적화
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const resourceType = request.resourceType();
      // 필요한 리소스만 로드하고 나머지는 차단
      if (["image", "stylesheet", "font", "media"].includes(resourceType)) {
        request.abort();
      } else {
        request.continue();
      }
    });

    // 유저 에이전트 설정
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    // 추가 페이지 설정
    await page.setJavaScriptEnabled(true);
    await Promise.all([
      page.setExtraHTTPHeaders({
        "Accept-Language": "ko-KR,ko;q=0.9",
      }),
    ]);

    console.log("페이지 설정 완료, URL로 이동 시도...");

    // 페이지 이동
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    console.log("URL 이동 완료:", url);

    // 페이지 로드 대기
    await page.waitForSelector("#id", {
      timeout: 60000,
      visible: true,
    });
    console.log("로그인 폼 로드 완료");

    // 로그인 탭에 로그인
    const loginSelector = `//*[@id="container"]/div/div[1]/ul/li[1]`;
    await clickByXPath(page, loginSelector);
    console.log("로그인 탭 클릭");

    await page.waitForSelector("#id");
    await new Promise((resolve) => setTimeout(resolve, 500));

    const crawlerId = process.env.CRAWLER_ID;
    const crawlerPw = process.env.CRAWLER_PW;

    if (!crawlerId || !crawlerPw) {
      throw new Error("Crawler credentials not found in environment variables");
    }

    await page.type("#id", crawlerId, { delay: 100 });
    await page.type("#pw", crawlerPw, { delay: 100 });
    await page.click("#switch");
    console.log("로그인 정보 입력 완료");

    // 로그인 버튼 클릭
    await clickByXPath(page, `//*[@id="log.login"]`);
    console.log("로그인 버튼 클릭");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 등록 버튼 클릭
    await clickByXPath(page, `//*[@id="new.save"]`);
    console.log("등록 버튼 클릭");
    await new Promise((resolve) => setTimeout(resolve, 5000));

    //iframeSelect & 내부 컨텐츠에 접근
    const iframeSelector = "#myPlaceBookmarkListIframe";
    await page.waitForSelector(iframeSelector);
    const iframeHandle = await page.$(iframeSelector);
    console.log("iframe 찾기 완료");

    if (!iframeHandle) {
      throw new Error("iframe not found");
    }

    const frame = await iframeHandle.contentFrame();
    console.log("iframe 컨텐츠 접근 완료");

    if (!frame) {
      throw new Error("frame content not found");
    }

    //팝업 종료
    await page.keyboard.press("Escape");
    console.log("팝업 종료");

    //탭을 순차적으로 크롤링
    const tabContainerSelector = `//*[@id="app"]/div/div[2]/div/div[2]`;
    const restaurantTabSelector = `${tabContainerSelector}/ul/li`;

    // 탭 요소들 가져오기
    const tabElements = await findByXPath(frame, restaurantTabSelector);
    console.log("찾은 탭 개수:", tabElements.length);

    const tabsToClick = [];
    for (const tabElement of tabElements) {
      const tabText = await tabElement.evaluate((el: Element) =>
        el.textContent?.trim()
      );
      if (tabText && tabText !== "전체") {
        tabsToClick.push({ element: tabElement, text: tabText });
      }
    }
    console.log(
      "클릭할 탭 목록:",
      tabsToClick.map((tab) => tab.text)
    );

    // 필터링된 탭 순차적으로 클릭 및 크롤링
    for (const { element, text } of tabsToClick) {
      try {
        console.log(`\n${text} 탭 처리 시작...`);
        // 탭이 화면에 보이는지 확인
        const isVisible = await element.evaluate((el: Element) => {
          const rect = el.getBoundingClientRect();
          return rect.top >= 0 && rect.bottom <= window.innerHeight;
        });

        if (!isVisible) {
          // 스크롤 시도
          await element.evaluate((el: Element) => {
            el.scrollIntoView({ block: "center" });
          });

          // 스크롤 후 잠시 대기
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        // 탭 클릭 시도
        await element.click();
        console.log("탭 클릭 완료");

        // 탭 클릭 후 초기 대기
        await new Promise((resolve) => setTimeout(resolve, 2000));

        //스크롤 끝까지 내려갔다가 최상단으로 복귀
        let prevHeight = 0;
        let scrollCount = 0;

        while (true) {
          await frame.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
          });

          await new Promise((resolve) => setTimeout(resolve, 700));

          const currentHeight = await frame.evaluate(
            () => document.body.scrollHeight
          );
          if (currentHeight === prevHeight) {
            break;
          }
          prevHeight = currentHeight;
        }
        await frame.evaluate(() => {
          window.scrollTo(0, 0);
        });

        await new Promise((resolve) => setTimeout(resolve, 3000));

        //식당 리스트 크롤링 시작
        const listItemHandles = await findByXPath(
          frame,
          '//*[@id="app"]/div/div/div/ul/li'
        );

        for (let i = 0; i < listItemHandles.length; i++) {
          try {
            await page.keyboard.press("Escape");

            await listItemHandles[i].click();
            const closedTextElements = await findByXPath(
              frame,
              `//*[@id="app"]/div/div[3]/ul/li[${i + 1}]/div/div[3]`
            );

            if (closedTextElements.length > 0) {
              const textContent = await closedTextElements[0].evaluate(
                (el: Element) => el.textContent || ""
              );

              if (textContent.includes("폐업")) {
                const closedModalElements = await findByXPath(
                  frame,
                  "/html/body/div[2]/div/div[1]"
                );
                if (closedModalElements.length > 0) {
                  await closedModalElements[0].click();
                }
              }
            }

            await new Promise((resolve) => setTimeout(resolve, 2000));

            try {
              const refreshButtons = await findByXPath(
                frame,
                '//*[@id="app-root"]/div/div/div/div[3]/a[2]'
              );

              if (refreshButtons.length > 0) {
                const buttonText = await refreshButtons[0].evaluate(
                  (el: Element) => el.textContent || ""
                );

                if (buttonText && buttonText.includes("새로고침")) {
                  console.log("페이지 오류 발생, 새로고침 시도...");
                  await new Promise((resolve) => setTimeout(resolve, 3000));
                }
              }
            } catch (refreshError) {
              // console.log("새로고침 버튼 처리 중 에러 발생");
            }

            let locationText = "등록되어 있지 않습니다.";
            const locationElements = await findByXPath(
              frame,
              `//*[@id="app"]/div/div[3]/div/ul/li[${i + 1}]/div[1]/div[2]/span`
            );

            for (const locationElement of locationElements) {
              const text = await locationElement.evaluate(
                (el: Element) => el.textContent || ""
              );

              const validLocations = [
                "도",
                "시",
                "군",
                "구",
                "동",
                "읍",
                "면",
                "리",
                "로",
                "길",
                "번길",
                "번지",
              ];

              if (validLocations.some((location) => text.includes(location))) {
                locationText = text;
                break;
              }
            }

            const iframeSelector = "#entryIframe";
            const iframeHandle = await page.$(iframeSelector);

            if (iframeHandle) {
              // 네이버 플레이스 해당 식당 id추출
              const iframeSrc = await page.evaluate((el: Element) => {
                if (el instanceof HTMLIFrameElement) {
                  return el.src;
                }
                return "";
              }, iframeHandle);

              if (!iframeSrc) {
                continue;
              }

              const naverPlaceMatch = iframeSrc.match(/place\/(\d+)/);
              if (!naverPlaceMatch) {
                continue;
              }

              const frame = await iframeHandle.contentFrame();
              if (!frame) {
                continue;
              }

              await frame.evaluate(() => window.scrollTo(0, 850));
              await new Promise((resolve) => setTimeout(resolve, 5000));

              let nameText = "등록되어 있지 않습니다.";
              const nameElements = await findByXPath(
                frame,
                `//*[@id="_title"]/div/span[1]`
              );

              if (nameElements.length > 0) {
                nameText = await nameElements[0].evaluate(
                  (el: Element) => el.textContent || ""
                );
              }

              let categoryText = "등록되어 있지 않습니다.";
              const categoryElements = await findByXPath(
                frame,
                `//*[@id="_title"]/div/span[2]`
              );

              if (categoryElements.length > 0) {
                categoryText = await categoryElements[0].evaluate(
                  (el: Element) => el.textContent || ""
                );
              }

              let contactText = "등록되어 있지 않습니다.";
              const contactElements = await findByXPath(
                frame,
                `//*[@id="app-root"]/div/div/div/div/div/div/div/div/div/div/span[1]`
              );

              for (const contactElement of contactElements) {
                const text = await contactElement.evaluate(
                  (el: Element) => el.textContent || ""
                );

                if (text.match(/\d+-\d+-\d+/)) {
                  contactText = text;
                  break;
                }
              }

              const imgDataArray: string[] = [];
              const imgElements = await findByXPath(
                frame,
                `//*[@id="app-root"]/div/div/div/div[1]//a/img`
              );

              for (const imgElement of imgElements) {
                if (imgDataArray.length >= 4) break;

                const src = await imgElement.evaluate(
                  (el: Element) => el.getAttribute("src") || ""
                );

                if (src && !imgDataArray.includes(src)) {
                  const url = new URL(src);
                  url.searchParams.delete("autoRotate");
                  url.searchParams.delete("type");
                  imgDataArray.push(url.toString());
                }
              }

              const menuDataArray = [];
              const menuSelectors = [
                `//*[@id="app-root"]/div/div/div/div/div/div/div/ul/li`,
                `//*[@id="app-root"]/div/div/div/div/div/div/div/ul/li/a/div`,
                `//*[@id="app-root"]/div/div/div/div/div/div/div/div/ul/li`,
                `//*[@id="app-root"]/div/div/div/div/div/div/div/div/div/div/ul/li`,
                `//*[@id="app-root"]//ul[contains(@class, "list_menu")]//li`,
                `//*[@id="app-root"]//div[contains(@class, "menu_list")]//li`,
                `//*[@id="app-root"]//div[contains(@class, "photo_menu_list")]//li`,
              ];

              let retryCount = 0;
              while (menuDataArray.length === 0 && retryCount < 3) {
                for (const selector of menuSelectors) {
                  try {
                    const menuElements = await findByXPath(frame, selector);

                    if (menuElements.length > 0) {
                      const menuText = await menuElements[0].evaluate(
                        (el: Element) => el.textContent || ""
                      );

                      if (
                        (menuText && menuText.includes("00원")) ||
                        (menuText && menuText.includes("변동")) ||
                        (menuText && menuText.includes("1원")) ||
                        (menuText && menuText.includes("무료"))
                      ) {
                        for (let j = 0; j < menuElements.length && j < 4; j++) {
                          const text = await menuElements[j].evaluate(
                            (el: Element) => el.textContent || ""
                          );

                          if (text && text.length <= 20) {
                            let cleanedText = text
                              .replace(/(사진|대표)/g, "")
                              .replace(/변동.*/, " 변동")
                              .replace(/원.*/, "원")
                              .replace(/(\d+(,\d+)원)/, " $1")
                              .replace(/무료$/, " 무료")
                              .replace(/([가-힣a-zA-Z]+)무료/, "$1 무료")
                              .replace(/일시적인 오류가 발생했습니다/g, "");
                            menuDataArray.push(cleanedText);
                          }
                        }
                        break;
                      }
                    }
                  } catch (error) {
                    continue;
                  }
                }

                if (menuDataArray.length === 0) {
                  retryCount++;
                  if (retryCount < 2) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                  }
                } else {
                  break;
                }
              }

              const dataObject: RestaurantType = {
                name: nameText,
                category: categoryText,
                location: locationText,
                contact: contactText,
                menu: menuDataArray,
                img: imgDataArray,
                naverPlaceId: naverPlaceMatch[1],
              };

              dataSetArray.push(dataObject);
            }
          } catch (error) {
            console.error(`${text} 탭 처리 중 오류:`, error);
            continue;
          }
        }
      } catch (error) {
        console.error(`${text} 탭 처리 중 오류:`, error);
        continue;
      }
    }
  } catch (error) {
    console.error("크롤링 중 오류 발생:", error);
    throw error;
  } finally {
    console.log("수집된 데이터:", JSON.stringify(dataSetArray, null, 2));
    if (browser) {
      await browser.close();
      console.log("브라우저 종료");
    }
  }

  return dataSetArray;
}

// crawlData("https://naver.me/5sma6gsq");
