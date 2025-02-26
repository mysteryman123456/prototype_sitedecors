const https = require('https');
const cheerio = require('cheerio');

const verifyUrl = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let html = '';
      response.on('data', (chunk) => {
        html += chunk;
      });
      response.on('end', () => {
        try {
          const $ = cheerio.load(html);
          const isVerified = $("small")
            .filter((_, element) => $(element).text().trim() === "SiteDecors-Verified-Listing")
            .length > 0;
          resolve(isVerified);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
};

module.exports = verifyUrl;
