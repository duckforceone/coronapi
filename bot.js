const express = require('express'); // Adding Express
const app = express(); // Initializing Express
const puppeteer = require('puppeteer')

//const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
//puppeteer.use(AdblockerPlugin())

app.get('/bayern', (req, res) => {
    puppeteer.launch().then(async (browser) => {
        const page = await browser.newPage();
        await page.goto('https://www.corona-in-zahlen.de/bundeslaender/bayern/');

        await page.screenshot( { path: 'bayern.png' } );

   
        const cases = await page.evaluate( () => {
            let update = document.querySelector('span[class="badge badge-secondary"]').innerText;
            let inhabitants = document.querySelectorAll('div[class="card-body"] > p[class="card-title"]')[0].innerText;
            let infections = document.querySelectorAll('div[class="card-body"] > p[class="card-title"]')[1].innerText;
            let infectionRate = document.querySelectorAll('div[class="card-body"] > p[class="card-title"]')[2].innerText;
            let deaths = document.querySelectorAll('div[class="card-body"] > p[class="card-title"]')[3].innerText;
            let lethalityRate = document.querySelectorAll('div[class="card-body"] > p[class="card-title"]')[4].innerText;

            return {
                inhabitants,
                "infections": {
                    "total": infections,
                    "rate": infectionRate
                },
                "deaths": {
                    "total": deaths,
                    "lethality_rate": lethalityRate
                },
                update
            };
        });
        


            await browser.close();

            res.json(cases);

    });
});


app.get('/country', (req, res) => {
    if(!req.query) return res.send('Please set a country with the \'country\' parameter!')
    const country = req.query.country.toLowerCase();
    puppeteer.launch().then(async (browser) => {
        const page = await browser.newPage();
        await page.goto(`https://www.corona-in-zahlen.de/weltweit/${country}/`);

        await page.screenshot( { path: 'DE.png' } );

   
        const cases = await page.evaluate( () => {
            let update = document.querySelector('span[class="badge badge-secondary"]').innerText;
            let inhabitants = document.querySelectorAll('div[class="card-body"] > p[class="card-title"]')[0].innerText;
            let infections = document.querySelectorAll('div[class="card-body"] > p[class="card-title"]')[4].innerText;
            //let infectionsNew = document.querySelectorAll('div[class="card-body"] > p[class="card-text"] ')[4].innerText.split(' ')[1];
            let infectionRate = document.querySelectorAll('div[class="card-body"] > p[class="card-title"]')[7].innerText;
            let deaths = document.querySelectorAll('div[class="card-body"] > p[class="card-title"]')[5].innerText;
            let deathsNew = document.querySelectorAll('div[class="card-body"] > p[class="card-text"] ')[6].innerText.split(' ')[1]
            let lethalityRate = document.querySelectorAll('div[class="card-body"] > p[class="card-title"]')[8].innerText;

            return {
                    inhabitants,
                    "infections": {
                        "total": infections,
                        //"new": infectionsNew,
                        "rate": infectionRate
                    },
                    "deaths": {
                        "total": deaths,
                        "new": deathsNew,
                        "lethality_rate": lethalityRate
                    },
                    update
                };
        });
        


            await browser.close();

            res.json(cases);

    });
});


app.listen(3030, () => {
    console.log('listening on http://localhost:3030');
})