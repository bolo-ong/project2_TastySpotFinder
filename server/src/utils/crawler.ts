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

/**
 * 주소를 좌표로 변환하는 함수
 */
async function convertAddressToCoordinates(
  address: string
): Promise<{ type: "Point"; coordinates: [number, number] } | null> {
  if (!address || address === "등록되어 있지 않습니다.") {
    return null;
  }

  try {
    // 지오코딩 API가 없으므로 null 반환
    // 좌표를 추출할 수 없는 경우 null 반환
    return null;
  } catch (error) {
    console.error("좌표 변환 중 오류:", error);
    return null;
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

  // 환경 변수에서 타임아웃 값 가져오기 (기본값: 240000ms)
  const protocolTimeout = parseInt(
    process.env.PUPPETEER_TIMEOUT || "240000",
    10
  );
  console.log("Puppeteer 타임아웃 설정:", protocolTimeout);

  try {
    browser = await puppeteer.launch({
      headless: true, // "new" 대신 true 사용 - 타입 호환성 문제 해결
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
        // 메모리 제한 증가 (512MB -> 2GB)
        "--js-flags=--max-old-space-size=2048",
        "--disable-dev-profile",
        "--window-size=1920,1080",
        "--start-maximized",
        "--disable-blink-features=AutomationControlled", // 자동화 방지 탐지 회피
        "--user-data-dir=/tmp/puppeteer",
      ],
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
    });

    console.log("브라우저 실행 완료");

    const page = await browser.newPage();

    // 페이지 종료 타임아웃 설정
    await page.setDefaultNavigationTimeout(90000); // 90초
    await page.setDefaultTimeout(60000); // 일반 작업 60초

    // 리소스 로딩 최적화
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const resourceType = request.resourceType();
      const url = request.url();

      // 아래 URL에 해당하는 리소스는 항상 허용
      if (
        url.includes("naver.com") ||
        url.includes("map.naver.com") ||
        url.includes("ssl.pstatic.net")
      ) {
        request.continue();
        return;
      }

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

    // 페이지 이동 - 직접 URL로 이동하는 대신 네이버 메인으로 이동 후 로그인
    try {
      await page.goto("https://www.naver.com", {
        waitUntil: "networkidle2",
        timeout: 60000,
      });
      console.log("네이버 메인 페이지 이동 완료");

      // 로그인 버튼 찾기 및 클릭
      try {
        const loginButtonSelector = "#account > a";
        await page.waitForSelector(loginButtonSelector, { timeout: 10000 });
        await page.click(loginButtonSelector);
        console.log("네이버 로그인 버튼 클릭");
      } catch (loginBtnError) {
        console.log(
          "네이버 로그인 버튼을 찾을 수 없습니다. 직접 로그인 페이지로 이동합니다."
        );
        await page.goto("https://nid.naver.com/nidlogin.login", {
          waitUntil: "networkidle2",
          timeout: 60000,
        });
      }

      // 로그인 폼 로드 대기
      await page.waitForSelector("#id", {
        timeout: 30000,
        visible: true,
      });
      console.log("로그인 폼 로드 완료");

      const crawlerId = process.env.CRAWLER_ID;
      const crawlerPw = process.env.CRAWLER_PW;

      if (!crawlerId || !crawlerPw) {
        throw new Error(
          "Crawler credentials not found in environment variables"
        );
      }

      // ID/PW 입력 및 로그인
      await page.type("#id", crawlerId, { delay: 100 });
      await page.type("#pw", crawlerPw, { delay: 100 });

      // IP 보안 체크박스 해제 시도
      try {
        await page.click("#keep"); // IP 보안 체크박스
      } catch (keepError) {
        console.log("IP 보안 체크박스가 이미 해제되어 있거나 없습니다.");
      }

      // 로그인 상태 유지 버튼 클릭 (기존 스위치 버튼)
      try {
        await page.click("#switch");
        console.log("로그인 상태 유지 버튼 클릭");
      } catch (switchError) {
        console.log("로그인 상태 유지 버튼이 없습니다.");
      }

      console.log("로그인 정보 입력 완료");

      // 로그인 버튼 클릭
      await page.click("#log\\.login");
      console.log("로그인 버튼 클릭");
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // 로그인 성공 확인
      const currentUrl = await page.url();
      if (
        currentUrl.includes("nidlogin.login") ||
        currentUrl.includes("login_error")
      ) {
        await page.screenshot({ path: "login_failed.png" });
        throw new Error("로그인 실패. 아이디/비밀번호를 확인하세요.");
      }

      console.log("로그인 성공, 북마크 URL로 이동합니다.");

      // 이제 북마크 URL로 직접 이동
      await page.goto(url, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });
      console.log("북마크 URL 이동 완료:", url);

      // 페이지 로딩 대기
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch (navigationError) {
      console.error("페이지 탐색 중 오류:", navigationError);
      await page.screenshot({ path: "navigation_error.png" });
      throw navigationError;
    }

    // 북마크 페이지 확인 및 iframe 처리
    try {
      console.log("북마크 페이지 구조 분석 중...");

      // 현재 페이지에 프레임이 있는지 확인
      const frames = await page.frames();
      console.log(`페이지에서 ${frames.length}개의 프레임을 발견했습니다.`);

      // 모든 iframe 분석 (디버깅용)
      const iframesInfo = await page.evaluate(() => {
        const iframes = document.querySelectorAll("iframe");
        return Array.from(iframes).map((iframe) => ({
          id: iframe.id,
          src: iframe.src,
          name: iframe.name,
          className: iframe.className,
        }));
      });
      console.log("iframe 정보:", JSON.stringify(iframesInfo));

      // myPlaceBookmarkListIframe을 찾기
      const iframeSelector = "#myPlaceBookmarkListIframe";
      await page
        .waitForSelector(iframeSelector, { timeout: 20000 })
        .catch((e) =>
          console.log("iframe 선택자를 찾을 수 없습니다:", e.message)
        );

      const iframeHandle = await page.$(iframeSelector);
      let frame = null;

      if (iframeHandle) {
        console.log("북마크 iframe을 찾았습니다");
        frame = await iframeHandle.contentFrame();

        if (frame) {
          console.log(
            "iframe 컨텐츠에 접근했습니다. iframe 내에서 작업을 진행합니다."
          );

          // 팝업 종료
          await page.keyboard.press("Escape");
          console.log("팝업 종료 시도");
        } else {
          console.log(
            "iframe 컨텐츠에 접근할 수 없습니다. 메인 페이지에서 작업을 진행합니다."
          );
          // 메인 페이지에서 작업 진행
          frame = page;
        }
      } else {
        console.log(
          "북마크 iframe을 찾을 수 없습니다. 메인 페이지에서 작업을 진행합니다."
        );
        await page.screenshot({ path: "no_iframe_found.png" });
        frame = page;
      }

      // 전체 탭을 클릭하여 모든 목록 표시 (iframe 또는 메인 페이지)
      const allTabSelector = `//*[@id="app"]/div/div[2]/div/div[2]/ul/li[1]`;
      const allTabElements = await findByXPath(frame, allTabSelector);

      if (allTabElements.length > 0) {
        await allTabElements[0].click();
        console.log("전체 탭 클릭 완료");
        await cleanupHandles(allTabElements);
      } else {
        console.log("전체 탭을 찾을 수 없음, 기본 목록으로 진행합니다.");
      }

      await new Promise((resolve) => setTimeout(resolve, 3000));

      console.log("전체 목록에서 크롤링을 시작합니다...");

      // 스크롤 작업을 수행
      let prevHeight = 0;
      let scrollCount = 0;
      const maxScrollAttempts = 50;
      let sameHeightCount = 0;

      while (scrollCount < maxScrollAttempts) {
        await frame.evaluate((scrollStep) => {
          window.scrollBy(0, scrollStep);
        }, 800);

        await new Promise((resolve) => setTimeout(resolve, 1500));
        scrollCount++;

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

        console.log(
          `스크롤 상태: ${currentHeight}/${totalHeight}, 시도 ${scrollCount}/${maxScrollAttempts}`
        );

        if (currentHeight >= totalHeight - 100) {
          console.log("페이지 끝에 도달하여 스크롤 중단");
          break;
        }

        if (currentHeight === prevHeight) {
          sameHeightCount++;
          if (sameHeightCount >= 3) {
            await frame.evaluate(() => {
              window.scrollBy(0, Math.floor(Math.random() * 200) + 100);
            });
            await new Promise((resolve) => setTimeout(resolve, 2000));
            sameHeightCount = 0;
          }
        } else {
          sameHeightCount = 0;
        }

        prevHeight = currentHeight;
      }

      // 전체 목록 로딩을 위해 처음부터 다시 스크롤
      console.log("리스트 전체 로딩을 위해 처음부터 다시 스크롤합니다...");
      await frame.evaluate(() => {
        window.scrollTo(0, 0);
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 처음부터 끝까지 천천히 스크롤
      for (let i = 0; i < 5; i++) {
        await frame.evaluate(
          (step, total) => {
            window.scrollTo(0, document.body.scrollHeight * (step / total));
          },
          i,
          5
        );
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      // 다시 상단으로 스크롤
      await frame.evaluate(() => {
        window.scrollTo(0, 0);
      });

      await new Promise((resolve) => setTimeout(resolve, 3000));

      // 식당 리스트 크롤링 시작 (iframe 내에서)
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

            // 목록이 다시 로드되었을 수 있으므로 핸들을 업데이트
            await cleanupHandles(listItemHandles);
            const newListItemHandles = await findByXPath(
              frame,
              '//*[@id="app"]/div/div/div/ul/li'
            );
            if (newListItemHandles.length > 0) {
              for (const handle of newListItemHandles) {
                listItemHandles.push(handle);
              }
              console.log(
                `목록 핸들을 새로 고침했습니다. 현재 총 ${listItemHandles.length}개 항목`
              );
            }
          }

          console.log(`항목 ${i + 1}/${listItemHandles.length} 처리 중...`);

          // 항목 클릭 전 현재 보이는 위치로 스크롤
          await frame.evaluate((index) => {
            const elements = document.querySelectorAll(
              "#app div div div ul li"
            );
            if (elements[index]) {
              elements[index].scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
          }, i);

          await new Promise((resolve) => setTimeout(resolve, 1000));

          await listItemHandles[i].click();
          console.log(`항목 ${i + 1} 클릭 완료`);

          // 중복 클릭 방지를 위한 지연
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const closedTextElements = await findByXPath(
            frame,
            `//*[@id="app"]/div/div[3]/ul/li/div/div[3]`
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
              console.log(`항목 ${i + 1}: 폐업 식당으로 건너뜁니다.`);
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

          // 주소 가져오기 로직 변경 - iframe에서 주소 가져오기
          let locationText = "등록되어 있지 않습니다.";

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
                console.log(
                  `항목 ${i + 1}: iframe 소스를 찾을 수 없음, 건너뜁니다.`
                );
                await iframeHandle.dispose();
                continue;
              }

              const naverPlaceMatch = iframeSrc.match(/place\/(\d+)/);
              if (!naverPlaceMatch) {
                console.log(
                  `항목 ${
                    i + 1
                  }: 네이버 플레이스 ID를 찾을 수 없음, 건너뜁니다.`
                );
                await iframeHandle.dispose();
                continue;
              }

              const naverPlaceId = naverPlaceMatch[1];

              // 중복 식당 체크
              if (processedNaverPlaceIds.has(naverPlaceId)) {
                console.log(
                  `항목 ${i + 1}: 중복 식당 발견: ${naverPlaceId}, 건너뜁니다.`
                );
                await iframeHandle.dispose();
                continue;
              }

              // 처리된 ID 추가
              processedNaverPlaceIds.add(naverPlaceId);
              console.log(`항목 ${i + 1}: 식당 ID ${naverPlaceId} 처리 시작`);

              const entryFrame = await iframeHandle.contentFrame();
              if (!entryFrame) {
                console.log(
                  `항목 ${i + 1}: iframe 프레임을 찾을 수 없음, 건너뜁니다.`
                );
                await iframeHandle.dispose();
                continue;
              }

              // iframe 내에서 스크롤
              await entryFrame.evaluate(() => window.scrollTo(0, 850));
              await new Promise((resolve) => setTimeout(resolve, 3000));

              // 주소 정보 가져오기 - iframe 내에서 가져옴
              // 모든 주소 추출 시도를 순차적으로 진행
              console.log(`항목 ${i + 1}: 주소 정보 추출 시도 시작`);

              // 가장 신뢰할 수 있는 방법부터 시도
              const addressElements = await findByXPath(
                entryFrame,
                `//*[@id="app-root"]//div[contains(@class, "place_section_content")]//div[contains(@class, "jvzv")]/span[1]`
              );

              if (addressElements.length > 0) {
                const text = await addressElements[0].evaluate(
                  (el: Element) => el.textContent || ""
                );

                if (text && text.includes("주소")) {
                  locationText = text.replace("주소", "").trim();
                  console.log(`항목 ${i + 1}: 첫 번째 방법으로 주소 추출 성공`);
                }
              }
              await cleanupHandles(addressElements);

              // 주소를 찾지 못했다면 다른 선택자로 시도
              if (locationText === "등록되어 있지 않습니다.") {
                const altAddressElements = await findByXPath(
                  entryFrame,
                  `//*[@id="app-root"]//span[contains(text(), "주소")]/following-sibling::span`
                );

                if (altAddressElements.length > 0) {
                  locationText = await altAddressElements[0].evaluate(
                    (el: Element) => el.textContent || ""
                  );
                  console.log(`항목 ${i + 1}: 두 번째 방법으로 주소 추출 성공`);
                }
                await cleanupHandles(altAddressElements);
              }

              // 여전히 주소를 찾지 못했다면 세 번째 선택자로 시도
              if (locationText === "등록되어 있지 않습니다.") {
                const thirdAddressElements = await findByXPath(
                  entryFrame,
                  `//*[@id="app-root"]//div[contains(@class, "place_section_content")]//div[contains(@class, "O8qbU")]/div[contains(@class, "LDgIH")]/div[contains(@class, "zPfVt")]`
                );

                if (thirdAddressElements.length > 0) {
                  locationText = await thirdAddressElements[0].evaluate(
                    (el: Element) => el.textContent || ""
                  );
                  console.log(`항목 ${i + 1}: 세 번째 방법으로 주소 추출 성공`);
                }
                await cleanupHandles(thirdAddressElements);
              }

              // 또 다른 주소 패턴 시도
              if (locationText === "등록되어 있지 않습니다.") {
                const fourthAddressElements = await findByXPath(
                  entryFrame,
                  `//*[@id="app-root"]//div[contains(@class, "place_section_content")]//div[contains(@class, "zugYT")]/div/span`
                );

                if (fourthAddressElements.length > 0) {
                  for (const addrElement of fourthAddressElements) {
                    const text = await addrElement.evaluate(
                      (el: Element) => el.textContent || ""
                    );
                    if (
                      text &&
                      (text.includes("주소") ||
                        text.includes("도") ||
                        text.includes("시") ||
                        text.includes("군") ||
                        text.includes("구"))
                    ) {
                      locationText = text.replace("주소", "").trim();
                      console.log(
                        `항목 ${i + 1}: 네 번째 방법으로 주소 추출 성공`
                      );
                      break;
                    }
                  }
                }
                await cleanupHandles(fourthAddressElements);
              }

              // 직접 주소 문자열 찾기
              if (locationText === "등록되어 있지 않습니다.") {
                try {
                  // 먼저 주소 헤더 찾기
                  const addressHeaders = await findByXPath(
                    entryFrame,
                    `//*[@id="app-root"]//strong[contains(text(), "주소")]`
                  );

                  if (addressHeaders.length > 0) {
                    // 주소 헤더의 부모 또는 형제 요소에서 주소 찾기
                    const parentElement =
                      await addressHeaders[0].evaluateHandle(
                        (el: Element) => el.parentElement
                      );

                    if (parentElement) {
                      // ElementHandle.evaluate 대신 page.evaluate 사용
                      const parentText = await entryFrame.evaluate(
                        (el) => (el && el.textContent) || "",
                        parentElement
                      );

                      if (parentText && parentText !== "주소") {
                        locationText = parentText.replace("주소", "").trim();
                        console.log(
                          `항목 ${i + 1}: 주소 헤더 부모에서 주소 추출 성공`
                        );
                      }

                      // 부모 요소 정리
                      await parentElement.dispose();
                    }
                  }
                  await cleanupHandles(addressHeaders);
                } catch (e) {
                  console.log(`항목 ${i + 1}: 주소 헤더 검색 실패`);
                }
              }

              // XPath 대신 CSS 선택자로도 시도
              if (locationText === "등록되어 있지 않습니다.") {
                try {
                  const addressElement = await entryFrame.$(
                    "div.place_section_content span.LDgIH"
                  );
                  if (addressElement) {
                    locationText = await addressElement.evaluate(
                      (el: Element) => el.textContent || ""
                    );
                    console.log(`항목 ${i + 1}: CSS 선택자로 주소 추출 성공`);
                    addressElement.dispose();
                  }
                } catch (e) {
                  console.log(
                    `항목 ${i + 1}: CSS 선택자를 통한 주소 추출 실패`
                  );
                }
              }

              // 마지막 방법으로 iframe 내 모든 텍스트에서 주소 패턴 찾기
              if (locationText === "등록되어 있지 않습니다.") {
                try {
                  const pageText = await entryFrame.evaluate(
                    () => document.body.innerText
                  );
                  const addressLines = pageText.split("\n");

                  // 주소 패턴을 찾기 위한 정규식
                  const addressRegexps = [
                    /주소\s*:\s*([^\n]+)/,
                    /([가-힣]+(시|도)\s[가-힣]+(구|군)\s[가-힣]+(동|읍|면)\s[0-9-]+)/,
                    /([가-힣]+(시|도)\s[가-힣]+(구|군)\s[가-힣]+(로|길)\s[0-9-]+)/,
                  ];

                  // 전체 텍스트에서 정규식으로 찾기
                  for (const regex of addressRegexps) {
                    const match = pageText.match(regex);
                    if (match && match[1]) {
                      locationText = match[1].trim();
                      console.log(
                        `항목 ${i + 1}: 정규식 ${regex}으로 주소 추출 성공`
                      );
                      break;
                    }
                  }

                  // 정규식으로 찾지 못한 경우 각 라인 검사
                  if (locationText === "등록되어 있지 않습니다.") {
                    for (const line of addressLines) {
                      // 주소 패턴 검색
                      if (
                        line.includes("주소") ||
                        (line.match(/[가-힣]+\s+[가-힣]+\s+[가-힣]+\s+\d+/) &&
                          (line.includes("도") ||
                            line.includes("시") ||
                            line.includes("군") ||
                            line.includes("구") ||
                            line.includes("동") ||
                            line.includes("로")))
                      ) {
                        locationText = line.replace("주소", "").trim();
                        console.log(
                          `항목 ${i + 1}: 라인 패턴으로 주소 추출 성공`
                        );
                        break;
                      }
                    }
                  }
                } catch (e) {
                  console.log(
                    `항목 ${i + 1}: 전체 텍스트에서 주소 추출 실패: ${e}`
                  );
                }
              }

              // 주소 정제
              if (locationText !== "등록되어 있지 않습니다.") {
                // 불필요한 텍스트 제거
                locationText = locationText
                  .replace(/[지도보기|복사]/g, "")
                  .replace(/도로명/, "")
                  .replace(/지번/, "")
                  .replace(/주소:/, "")
                  .replace(/주소 :/, "")
                  .replace(/주소/, "")
                  .trim();

                // 주소가 여러 줄인 경우 첫 번째 줄만 사용
                if (locationText.includes("\n")) {
                  locationText = locationText.split("\n")[0].trim();
                }

                console.log(
                  `항목 ${i + 1}: 주소 정보 최종 추출 성공: ${locationText}`
                );
              } else {
                console.log(`항목 ${i + 1}: 모든 방법으로 주소 추출 실패`);
              }

              let nameText = "등록되어 있지 않습니다.";
              const nameElements = await findByXPath(
                entryFrame,
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
                entryFrame,
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
                entryFrame,
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
                entryFrame,
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
                    const menuElements = await findByXPath(
                      entryFrame,
                      selector
                    );

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

              // 좌표 정보 추가 시도 - 찾을 수 있는 경우에만 추가
              try {
                // iframe에서 좌표 정보를 직접 추출 시도
                const coordsScript = await entryFrame.evaluate(() => {
                  // 네이버 지도 API의 좌표 데이터를 찾음
                  // 방법 1: 스크립트 태그에서 검색
                  for (const script of document.querySelectorAll("script")) {
                    const content = script.textContent || "";
                    if (content.includes("lat") && content.includes("lng")) {
                      return content;
                    }
                  }

                  // 방법 2: window 객체에 저장된 전역 변수 검색
                  try {
                    // @ts-ignore - 브라우저에서만 사용 가능한 전역 변수
                    const initMapData = window["initializeProductMap"];
                    if (initMapData && initMapData.coords) {
                      // @ts-ignore - 브라우저에서만 사용 가능한 전역 변수
                      return JSON.stringify(initMapData.coords);
                    }
                  } catch (e) {}

                  // 방법 3: data 속성 검색
                  const mapElement = document.querySelector(
                    "[data-lat][data-lng]"
                  );
                  if (mapElement) {
                    const lat = mapElement.getAttribute("data-lat");
                    const lng = mapElement.getAttribute("data-lng");
                    if (lat && lng) {
                      return JSON.stringify({ lat, lng });
                    }
                  }

                  // 방법 4: 지도 iframe에서 URL 파라미터 검색
                  const mapIframe = document.querySelector(
                    "iframe.nmap_static"
                  ) as HTMLIFrameElement;
                  if (mapIframe && mapIframe.src) {
                    return mapIframe.src;
                  }

                  return null;
                });

                if (coordsScript) {
                  let lat = 0,
                    lng = 0,
                    found = false;

                  // 방법 1: 정규식으로 스크립트 내용에서 좌표 추출
                  const latMatch = coordsScript.match(/lat['":\s]+([0-9.-]+)/);
                  const lngMatch = coordsScript.match(/lng['":\s]+([0-9.-]+)/);

                  if (latMatch && latMatch[1] && lngMatch && lngMatch[1]) {
                    lat = parseFloat(latMatch[1]);
                    lng = parseFloat(lngMatch[1]);
                    if (!isNaN(lat) && !isNaN(lng)) {
                      found = true;
                    }
                  }

                  // 방법 2: iframe URL에서 좌표 추출
                  if (!found && coordsScript.includes("ncurrent=")) {
                    const currentMatch = coordsScript.match(
                      /ncurrent=([0-9.-]+),([0-9.-]+)/
                    );
                    if (currentMatch && currentMatch[1] && currentMatch[2]) {
                      lng = parseFloat(currentMatch[1]);
                      lat = parseFloat(currentMatch[2]);
                      if (!isNaN(lat) && !isNaN(lng)) {
                        found = true;
                      }
                    }
                  }

                  // 방법 3: 좌표 파라미터 추출
                  if (
                    !found &&
                    coordsScript.includes("latitude=") &&
                    coordsScript.includes("longitude=")
                  ) {
                    const latParamMatch =
                      coordsScript.match(/latitude=([0-9.-]+)/);
                    const lngParamMatch =
                      coordsScript.match(/longitude=([0-9.-]+)/);

                    if (
                      latParamMatch &&
                      latParamMatch[1] &&
                      lngParamMatch &&
                      lngParamMatch[1]
                    ) {
                      lat = parseFloat(latParamMatch[1]);
                      lng = parseFloat(lngParamMatch[1]);
                      if (!isNaN(lat) && !isNaN(lng)) {
                        found = true;
                      }
                    }
                  }

                  if (found) {
                    dataObject.locationCoordinates = {
                      type: "Point",
                      coordinates: [lng, lat], // GeoJSON 형식: [경도, 위도]
                    };
                    console.log(
                      `항목 ${i + 1}: 좌표 정보 추출 성공: [${lng}, ${lat}]`
                    );
                  }
                }

                // 좌표 정보는 null로 유지하고 프론트엔드에서 주소 기반으로 처리하도록 함
                // 좌표를 직접 찾은 경우만 값을 설정하고, 그 외에는 locationCoordinates를 설정하지 않음
              } catch (error) {
                console.error(`항목 ${i + 1}: 좌표 정보 처리 중 오류:`, error);
                // 오류 발생해도 locationCoordinates는 설정하지 않음 (기본값 사용 X)
              }

              dataSetArray.push(dataObject);
              console.log(
                `식당 정보 추가: ${nameText} (${dataSetArray.length}개 수집, ID: ${naverPlaceId})`
              );
            } finally {
              // iframeHandle 정리
              await iframeHandle.dispose();
            }
          }
        } catch (error) {
          console.error(`항목 ${i + 1} 처리 중 오류:`, error);
          continue;
        }
      }

      // 리스트 아이템 핸들 정리
      await cleanupHandles(listItemHandles);
    } catch (frameError) {
      console.error("프레임 처리 중 오류:", frameError);
      await page.screenshot({ path: "frame_error.png" });
      // 오류 발생해도 계속 진행 시도
    }

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
