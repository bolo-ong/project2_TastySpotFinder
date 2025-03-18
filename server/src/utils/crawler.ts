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
    // 메모리 관리를 위해 핸들러 해제
    for (const element of elements) {
      await element.dispose();
    }
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

/**
 * 메모리 관리를 위한 도우미 함수
 * ElementHandle 배열을 정리하고 가비지 컬렉션을 유도
 */
async function cleanupHandles(handles: ElementHandle[]) {
  for (const handle of handles) {
    try {
      await handle.dispose();
    } catch (error) {
      // 이미 해제된 핸들 등의 오류 무시
    }
  }
  handles.length = 0;
}

/**
 * 가비지 컬렉션 강제 실행 함수
 */
async function forceGC(page: Page) {
  try {
    // @ts-ignore - Chrome DevTools Protocol을 통한 GC 강제 실행
    await page.evaluate(() => {
      if (window.gc) {
        window.gc();
      }
    });
  } catch (error) {
    console.log("GC 강제 실행 중 오류(무시해도 됨):", error);
  }
}

export async function crawlData(url: string): Promise<RestaurantType[]> {
  const dataSetArray: RestaurantType[] = [];
  const processedNaverPlaceIds = new Set<string>(); // 중복 식당 방지를 위한 ID 세트
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
        // 메모리 제한 증가 (512MB -> 1GB)
        "--js-flags=--max-old-space-size=1024",
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
      if (
        ["image", "stylesheet", "font", "media", "other"].includes(resourceType)
      ) {
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

    // 전체 탭을 클릭하여 모든 목록 표시
    const allTabSelector = `//*[@id="app"]/div/div[2]/div/div[2]/ul/li[1]`;
    const allTabElements = await findByXPath(frame, allTabSelector);

    if (allTabElements.length > 0) {
      await allTabElements[0].click();
      console.log("전체 탭 클릭 완료");
      await cleanupHandles(allTabElements);
    } else {
      console.log("전체 탭을 찾을 수 없음, 기본 목록으로 진행합니다.");
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("전체 목록에서 크롤링을 시작합니다...");

    // 스크롤 방식 개선: 한 번에 전체를 스크롤하지 않고 점진적으로 스크롤
    // 더 많은 항목을 로드하기 위해 스크롤 반복 횟수 증가
    let prevHeight = 0;
    let scrollCount = 0;
    const maxScrollAttempts = 30; // 스크롤 시도 횟수 증가

    while (scrollCount < maxScrollAttempts) {
      await frame.evaluate((scrollStep) => {
        window.scrollBy(0, scrollStep);
      }, 800); // 한 번에 800px씩 스크롤

      await new Promise((resolve) => setTimeout(resolve, 1000));
      scrollCount++;

      // 3회 스크롤마다 메모리 정리
      if (scrollCount % 3 === 0) {
        await forceGC(page);
        console.log(`${scrollCount}번째 스크롤 후 메모리 정리`);
      }

      const currentHeight = await frame.evaluate(
        () => window.scrollY + window.innerHeight
      );
      const totalHeight = await frame.evaluate(
        () => document.body.scrollHeight
      );

      // 페이지 끝에 도달하면 스크롤 중단
      if (currentHeight >= totalHeight - 100 || currentHeight === prevHeight) {
        console.log("페이지 끝에 도달하여 스크롤 중단");
        break;
      }
      prevHeight = currentHeight;
    }

    // 다시 상단으로 스크롤
    await frame.evaluate(() => {
      window.scrollTo(0, 0);
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 식당 리스트 크롤링 시작
    const listItemHandles = await findByXPath(
      frame,
      '//*[@id="app"]/div/div/div/ul/li'
    );

    console.log(`총 ${listItemHandles.length}개의 항목을 찾았습니다.`);

    // 모든 항목 처리
    for (let i = 0; i < listItemHandles.length; i++) {
      try {
        await page.keyboard.press("Escape");

        // 각 식당 항목 처리 전 메모리 정리 (10개마다)
        if (i > 0 && i % 10 === 0) {
          await forceGC(page);
          console.log(
            `${i}번째 항목 처리 후 메모리 정리 수행 (${dataSetArray.length}개 수집)`
          );
        }

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
            await cleanupHandles(closedModalElements);
            await cleanupHandles(closedTextElements);
            continue; // 폐업 식당은 건너뜀
          }
        }
        await cleanupHandles(closedTextElements);

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
          await cleanupHandles(refreshButtons);
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
        await cleanupHandles(locationElements);

        const iframeSelector = "#entryIframe";
        const iframeHandle = await page.$(iframeSelector);

        if (iframeHandle) {
          try {
            // 네이버 플레이스 해당 식당 id추출
            const iframeSrc = await page.evaluate((el: Element) => {
              if (el instanceof HTMLIFrameElement) {
                return el.src;
              }
              return "";
            }, iframeHandle);

            if (!iframeSrc) {
              await iframeHandle.dispose();
              continue;
            }

            const naverPlaceMatch = iframeSrc.match(/place\/(\d+)/);
            if (!naverPlaceMatch) {
              await iframeHandle.dispose();
              continue;
            }

            const naverPlaceId = naverPlaceMatch[1];

            // 중복 식당 체크
            if (processedNaverPlaceIds.has(naverPlaceId)) {
              console.log(`중복 식당 발견: ${naverPlaceId}, 건너뜁니다.`);
              await iframeHandle.dispose();
              continue;
            }

            // 처리된 ID 추가
            processedNaverPlaceIds.add(naverPlaceId);

            const frame = await iframeHandle.contentFrame();
            if (!frame) {
              await iframeHandle.dispose();
              continue;
            }

            await frame.evaluate(() => window.scrollTo(0, 850));
            await new Promise((resolve) => setTimeout(resolve, 3000));

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
            await cleanupHandles(nameElements);

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
            await cleanupHandles(categoryElements);

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
            await cleanupHandles(contactElements);

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
            await cleanupHandles(imgElements);

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
                      await cleanupHandles(menuElements);
                      break;
                    }
                  }
                  await cleanupHandles(menuElements);
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
              naverPlaceId: naverPlaceId,
            };

            dataSetArray.push(dataObject);
            console.log(
              `식당 정보 추가: ${nameText} (${dataSetArray.length}개 수집)`
            );
          } finally {
            // iframeHandle 정리
            await iframeHandle.dispose();
          }
        }
      } catch (error) {
        console.error(`항목 처리 중 오류:`, error);
        continue;
      }
    }

    // 리스트 아이템 핸들 정리
    await cleanupHandles(listItemHandles);

    // 최종 메모리 정리
    await forceGC(page);
  } catch (error) {
    console.error("크롤링 중 오류 발생:", error);
    throw error;
  } finally {
    console.log("중복 제거 후 총 수집된 데이터:", dataSetArray.length);
    if (browser) {
      await browser.close();
      console.log("브라우저 종료");
    }
  }

  return dataSetArray;
}

// crawlData("https://naver.me/5sma6gsq");
