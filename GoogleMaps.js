const puppeteer = require('puppeteer');

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// class for place names = "qBF1Pd fontHeadlineSmall"

async function parsePlaces(page){
    let places = [];

    const elements = await page.$$(".qBF1Pd.fontHeadlineSmall");
    if (elements && elements.length) {
        for (const el of elements) {
            const name = await el.evaluate(span => span.textContent);
        places.push({ name });
    }
}
    return places;
    }

// image class="p0Hhde FQ2IWe"

async function parseImages(page) {
  let images = [];

  const elements = await page.$$(".p0Hhde.FQ2IWe");
  if (elements && elements.length) {
    for (const el of elements) {
      const imgElement = await el.$("img");
      if (imgElement) {
        const src = await imgElement.evaluate(img => img.src);
        images.push(src);
      }
    }
  }

  return images;
}




// link class = ".hfpxzc" and for the parent div class = "Nv2PK THOPZb CpccDe "

async function parseLink(page) {
    let links = [];
  
    const elements = await page.$$(".Nv2PK.THOPZb.CpccDe .hfpxzc");
    if (elements && elements.length) {
      for (const el of elements) {
        const href = await el.evaluate(a => a.href);
        links.push(href);
      }
    }
  
    return links;
  }
  
// class of Review span element class = ".ZkP5Je"
// class of paraint element = "e4rVHe fontBodyMedium"

  async function parseReview(page) {
  let reviews = [];

  const elements = await page.$$(".e4rVHe.fontBodyMedium .ZkP5Je");
  if (elements && elements.length) {
    for (const el of elements) {
      const ariaLabel = await el.evaluate(span => span.getAttribute('aria-label'));
      reviews.push(ariaLabel);
    }
  }

  return reviews;
}

// Small discription on the place spicific page with class = "PYvSYb" 


async function parseDesc(page){

  const elements = await page.$$(".PYvSYb");
  if (elements && elements.length) {
    for (const el of elements) {
          const Desc = await el.evaluate(span => span.textContent);
        return Desc;
    }
  }
  }




// class for scrolabe section is "m6QErb DxyBCb kA9KIf dS8AEf ecceSd"

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

// to get a list of Descriptions

async function DescRun(page, Links) {
  let Description = [];

  for (const link of Links) {
      await page.goto(link,  {waitUntil: 'domcontentloaded'});
      await page.waitForTimeout(1000);  
      const Desc = await parseDesc(page);
      Description.push(Desc)
      if (Desc){
      console.log("Sucessfuly fetched a description")
      }
      else{
        console.log("Failed to fatch -  " + link)
      }
  }

  return Description
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

  const places = await parsePlaces(page);
  const Images = await parseImages(page);
  const Links = await parseLink(page);
  const Review = await parseReview(page);


  console.log(places)
  console.log(places.length)
  console.log(Images)
  console.log(Images.length)
  console.log(Links)
  console.log(Links.length)
  console.log(Review)
  console.log(Review.length)

  console.log("Fetching the Descriptions")
  console.log("--".repeat(30))

  const Description = await DescRun(page,Links);
    
  console.log(Description)
  console.log(Description.length)

  await browser.close();
}


let Location; 
rl.question('Enter a location name - ', (loc) => {
  Base = loc;
  rl.close();
  Location = "Most popular Tourist attractions in " + Base;
  run(Location);
});

