const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://fr.wikipedia.org/wiki/Johnny_Hallyday';

axios.get(url)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
    let content = '';

    $('p').each((index, element) => {
      content += $(element).text() + '\n';
    });

    fs.writeFileSync('content.txt', content);
    console.log('Scraping completed.');
  })
  .catch(error => {
    console.error('Error fetching the URL:', error);
  });
