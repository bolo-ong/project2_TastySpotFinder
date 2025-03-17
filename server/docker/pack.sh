#!/bin/bash

# Packs puppeteer using npm and moves the archive file to server directory.
# Expected cwd: server directory

set -e

# Pack the packages
npm pack puppeteer@24.1.1
npm pack puppeteer-core@24.1.1
npm pack @puppeteer/browsers@2.7.0

# Move and rename the files
mv puppeteer-24.1.1.tgz puppeteer-latest.tgz
mv puppeteer-core-24.1.1.tgz puppeteer-core-latest.tgz
mv puppeteer-browsers-2.7.0.tgz puppeteer-browsers-latest.tgz