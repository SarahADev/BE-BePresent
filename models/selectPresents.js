const cheerio = require("cheerio");
const axios = require("axios");

exports.selectPresents = (category) => {
    const url = `https://www.etsy.com/uk/c/${category}`;
    
    axios(url).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const itemList = [];
            $('a.listing-link', html).each(function() {
                if (itemList.length <= 10) {
                    const itemName = $(this).find('div.v2-listing-card__info').find('h2').text().trim();
                    const itemLink = $(this).attr('href');
                    const itemImage = $(this).find('img.wt-width-full').attr();
                    const itemPrice = $(this).find('span.currency-value').text();
                    itemList.push({
                        itemName,
                        itemLink,
                        itemImage : itemImage['data-src'],
                        itemPrice,
                        category
                    });
                } else {
                    console.log(itemList);
                    return itemList;
                };
        }).catch((err) => {
            console.log(err, "err")
        });
    });
};