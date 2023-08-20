const puppeteer = require('puppeteer');

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const SELECTORS = {
  Block: ".Nv2PK.THOPZb.CpccDe",
  names: ".qBF1Pd.fontHeadlineSmall",
  images: ".p0Hhde.FQ2IWe img",
  links: ".Nv2PK.THOPZb.CpccDe .hfpxzc",
  reviews: ".e4rVHe.fontBodyMedium .ZkP5Je",
};

async function parseData(page) {
  const dataBlocks = await page.$$(".Nv2PK.THOPZb.CpccDe");
  const parsedData = [];

  for (const block of dataBlocks) {
    const nameElement = await block.$(".qBF1Pd.fontHeadlineSmall");
    const imageElement = await block.$(".p0Hhde.FQ2IWe img");
    const linkElement = await block.$(".Nv2PK.THOPZb.CpccDe .hfpxzc");
    const reviewElement = await block.$(".e4rVHe.fontBodyMedium .ZkP5Je");

    if (nameElement && imageElement && linkElement && reviewElement) {
      const name = await nameElement.evaluate(span => span.textContent);
      const imageSrc = await imageElement.evaluate(img => img.src);
      const link = await linkElement.evaluate(a => a.href);
      const reviewAriaLabel = await reviewElement.evaluate(span => span.getAttribute('aria-label'));

      const inputString = reviewAriaLabel;

      // Extract rating
      const ratingRegex = /^([\d.]+) stars/;
      const ratingMatch = inputString.match(ratingRegex);
      const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;

      // Extract number of reviews
      const reviewsRegex = /([\d,]+) Reviews$/;
      const reviewsMatch = inputString.match(reviewsRegex);
      const numReviews = reviewsMatch ? parseInt(reviewsMatch[1].replace(/,/g, ''), 10) : null;

      parsedData.push({
        name: name,
        imageSrc: imageSrc,
        link: link,
        review: reviewAriaLabel,
        rating: rating,
        numReviews: numReviews

      });
    }
  }

  return parsedData;
}


async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 300;
            var timer = setInterval(() => {
                const element = document.querySelectorAll(".m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd")[1];
                var scrollHeight = element.scrollHeight;
                element.scrollBy(0,distance);
                totalHeight += distance;

                const n = 2;

                if(totalHeight >= (scrollHeight + window.innerHeight)*n){
                    clearInterval(timer);
                    resolve();
                }
            }, 200);
        });
    });
}

// the main function

async function run(Location) {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({
    width: 1300,
    height: 900
  })

  Location = Location.replace(/ /g, '+');

  // slow
  //await page.goto('https://www.google.co.in/maps/search/'+ Location +'/');  
  
  // if you only want 20 results and quickly
  console.log("Starting the Instance")
  console.log("-".repeat(30));
  
  await page.goto('https://www.google.co.in/maps/search/'+ Location +'/' ,{waitUntil: 'domcontentloaded'});
  await page.waitForTimeout(3000); 

  console.log("Starting the To scrap all data")
  console.log("-".repeat(30));
  
  await autoScroll(page);

  const data = await parseData(page);
  console.log(data);
  console.log(data.length)


  await browser.close();
}


let Location; 
rl.question('Enter a location name - ', (loc) => {
  Base = loc;
  rl.close();
  Location = "Top Tourist attractions in " + Base;
  run(Location);
});


//run(Location);

