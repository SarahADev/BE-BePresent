const axios = require("axios");
const cheerio = require("cheerio");
exports.selectProduct = async (categories) => {
  try {
    const promises = categories.map(async (category) => {
        const url = `https://www.etsy.com/uk/c/${category}`;
        const response = await axios(url)
        const html = response.data;
        const $ = cheerio.load(html);
        const itemList = [];
        $("a.listing-link", html).each(function () {
            const itemName = $(this)
            .find("div.v2-listing-card__info")
            .find("h2")
            .text()
            .trim();
            const itemLink = $(this).attr("href");
            const itemImage = $(this).find("img.wt-width-full").attr();
            const itemPrice = $(this)
            .find("p.wt-text-title-01.lc-price")
            .find("span.currency-value")
            .text();
            itemList.push({
                itemName,
                itemLink,
                itemImage: itemImage["data-src"],
                itemPrice,
                category,
            });
        });
        return itemList.slice(16);
      })
    const mapping = await Promise.all(promises);
    return mapping.flat()
  } catch (err) {
    console.log(err, "catch in try model");
  }
};
