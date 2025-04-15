const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
    // 프로덕션 환경에서만 캐시 디렉토리 설정
    ...(process.env.NODE_ENV === 'production'
        ? {
            cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome-stable',
        }
        : {}),
};
