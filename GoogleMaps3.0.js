const puppeteer = require('puppeteer');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const SELECTORS = {
  places: ".qBF1Pd.fontHeadlineSmall",
  images: ".p0Hhde.FQ2IWe",
  links: ".Nv2PK.THOPZb.CpccDe .hfpxzc",
  reviews: ".e4rVHe.fontBodyMedium .ZkP5Je",
};

async function parseData(page) {
  const places = await page.$$eval(SELECTORS.places, elements =>
    elements.map(el => el.textContent.trim())
  );
  const images = await page.$$eval(SELECTORS.images, elements =>
    elements.map(el => el.querySelector('img').src)
  );
  const links = await page.$$eval(SELECTORS.links, elements =>
    elements.map(el => el.href)
  );
  const reviews = await page.$$eval(SELECTORS.reviews, elements =>
    elements.map(el => el.getAttribute('aria-label'))
  );

  const data = [];
  const itemCount = Math.min(places.length, images.length, links.length, reviews.length);

  for (let i = 0; i < itemCount; i++) {
    data.push({
      place: places[i],
      image: images[i],
      link: links[i],
      review: reviews[i]
    });
  }

  return data;
}

async function run(location) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1300, height: 900 });

  location = location.replace(/ /g, '+');
  const url = 'https://www.google.co.in/maps/search/' + location + '/';

  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const parsedData = await parseData(page);
  console.log(JSON.stringify(parsedData, null, 2));

  await browser.close();
}
location = "Most popular Tourist attractions in New york";
run(location);
