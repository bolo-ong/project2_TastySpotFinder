FROM --platform=linux/amd64 node:18-slim

ENV \
    # Configure default locale
    LANG=ko_KR.UTF-8 \
    LC_ALL=ko_KR.UTF-8 \
    # Set Puppeteer cache directory and executable path
    PUPPETEER_CACHE_DIR=/app/.cache/puppeteer \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    # 타임아웃 설정 증가
    PUPPETEER_TIMEOUT=120000

# Upgrade npm to a compatible version
RUN npm install -g npm@10.2.4 && npm cache clean --force

# Install necessary packages including Chrome
RUN apt-get update \
    && apt-get install -y wget gnupg ca-certificates \
    && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google-chrome.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main" | tee /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
    google-chrome-stable \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-thai-tlwg \
    fonts-khmeros \
    fonts-kacst \
    fonts-freefont-ttf \
    locales \
    apt-utils \
    xvfb \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libxss1 \
    libxtst6 \
    && locale-gen ko_KR.UTF-8 \
    && rm -rf /var/lib/apt/lists/*

# Set up app directory and install dependencies
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies including Puppeteer packages
RUN npm install \
    && npm install puppeteer puppeteer-core @puppeteer/browsers \
    && npm install puppeteer-extra puppeteer-extra-plugin-stealth

# Copy app source and build
COPY . .
RUN npm run build

# Set up Xvfb
ENV DISPLAY=:99
RUN printf '#!/bin/sh\nXvfb :99 -screen 0 1280x1024x24 &\nexec "$@"\n' > /entrypoint.sh \
    && chmod +x /entrypoint.sh

# Verify Chrome installation and set permissions
RUN google-chrome-stable --version || echo "Chrome not installed correctly" \
    && mkdir -p /tmp/.X11-unix && chmod 1777 /tmp/.X11-unix \
    && mkdir -p /tmp/puppeteer && chmod 777 /tmp/puppeteer \
    && mkdir -p /app/.cache && chmod -R 777 /app/.cache

WORKDIR /app

EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]
CMD ["npm", "start"]
