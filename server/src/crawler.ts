const puppeteer = require("puppeteer");

// const url = "https://naver.me/x3qhEqMD";
const url =
  "https://map.naver.com/p/favorite/myPlace/folder/75c369fbdc064e0b86bcfe9f185018b9?c=9.00,0,0,0,adh";

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
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
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 현재 iframe 내부의 스크롤 높이 가져오기
    const currentHeight = await frame.evaluate("document.body.scrollHeight");

    // 스크롤이 더 이상 되지 않으면 종료
    if (currentHeight === prevHeight) {
      break;
    }

    prevHeight = currentHeight;
  }

  await new Promise((resolve) => setTimeout(resolve, 2000));

  // 데이터 추출
  const title =
    '//*[@id="__next"]/div/div/div[2]/div/div[2]/ul/li/button/div[2]/span[1]';
  const category =
    '//*[@id="__next"]/div/div/div[2]/div/div[2]/ul/li/button/div[2]/span[2]';
  const location =
    '//*[@id="__next"]/div/div/div[2]/div/div[2]/ul/li/button/div[3]/span[1]';
  const img =
    '//*[@id="__next"]/div/div/div[2]/div/div[2]/ul/li/button//div/div[1]/div/div';

  const [firstElementHandles, secondElementHandles, thirdElementHandles] =
    await Promise.all([frame.$x(title), frame.$x(location), frame.$x(img)]);

  const dataSetArray = [];

  for (
    let i = 0;
    i <
    Math.min(
      firstElementHandles.length,
      secondElementHandles.length,
      thirdElementHandles.length
    );
    i++
  ) {
    const firstElementText = await firstElementHandles[i].evaluate(
      (element: HTMLElement) => element.textContent
    );
    const secondElementText = await secondElementHandles[i].evaluate(
      (element: HTMLElement) => element.textContent
    );
    const thirdElementStyle = await thirdElementHandles[i].evaluate(
      (element: HTMLElement) => element.getAttribute("style")
    );

    // 스타일 속성에서 이미지 URL 추출
    const styleMatch = thirdElementStyle.match(
      /background-image: url\("([^"]+)"\)/
    );
    const imgURL = styleMatch ? styleMatch[1] : undefined;

    const dataObject = {
      name: `${firstElementText}`,
      location: `${secondElementText}`,
      img: imgURL,
    };

    dataSetArray.push(dataObject);
  }

  console.log(dataSetArray);

  await browser.close();
})();
