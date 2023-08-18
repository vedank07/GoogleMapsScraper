# Google Maps Scraper

This is a Node.js project that utilizes Puppeteer to scrape information from Google Maps. It can extract place names, images, links, reviews and descriptions for a given location's top tourist attractions.

## Usage

1. Clone the repo
2. Run `npm install` to install dependencies 
3. Run `node index.js`
4. Enter a location when prompted

The script will launch a headless Chrome instance and scrape the following for the top 20 search results on Google Maps:

- Place names
- Image URLs
- Place detail page URLs 
- Review snippet text
- Short descriptions (by scrolling down the place detail pages)

The results will be printed to the console.

## Code Overview

The main logic lies in `index.js`. It initializes a Puppeteer browser and page, navigates to the Google Maps search URL, and calls various scraping functions:

- `parsePlaces` - Extracts place name text from result elements 
- `parseImages` - Extracts image SRCs
- `parseLink` - Extracts place detail page URLs
- `parseReview` - Extracts review snippet text 
- `parseDesc` - Extracts short descriptions from place detail pages
- `autoScroll` - Automatically scrolls down detail pages to load more content

These functions utilize Puppeteer to find elements by class name and extract text or attributes.

`DescRun` iterates through the list of detail page URLs, navigates to each, and collects the descriptions.

Finally, `run` orchestrates the entire scraping process. It launches the browser, navigates to Google Maps, calls the parsing functions, handles the input, and closes the browser when finished.

## To Do

- Add option to specify number of results to scrape
- Save results to a CSV or JSON file
- Expand info gathered, like address, phone number etc.
- Add CI/CD workflow

## Dependencies

- [Puppeteer](https://github.com/puppeteer/puppeteer) - Headless Chrome automation
- [ readline](https://nodejs.org/api/readline.html)- For user input


## Contributing

Contributions are welcome! Please open an issue first to discuss any additions or changes.

## License

This project is licensed under the MIT license - see [LICENSE.md](LICENSE.md) for details.

## Acknowledgements 

- [Puppeteer recipes](https://github.com/puppeteer/recipes) - Examples that helped with implementation
- [Google Maps](https://www.google.com/maps) - Page scraped for info 

## Disclaimer

This project is for educational purposes only. Make sure to follow Google's terms when scraping.

Let me know if you would like me to expand or modify the README further. I aimed to cover the key aspects of the project, usage, technology overview, and next steps. A good README helps others understand how to use the project and contribute to it.
