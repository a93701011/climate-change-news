const PORT = process.env.PORT || 8000;
const axios = require('axios');
const express = require('express');
const cheerio = require('cheerio');
const { response } = require('express');

const app = express()
const newspapers = [
    {
        name: 'theguardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''

    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change/',
        base: 'https://www.telegraph.co.uk'
    },
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    }
]
const articles = []

newspapers.forEach(newpaper => {

    axios.get(newpaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                articles.push({
                    title,
                    url: newpaper.base + url,
                    source: newpaper.name
                })
            })
        })
})


app.get('/', (req, res) => {
    res.json('welcome to my climate change News API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspapersAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspapersBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base


    // console.log(newspapersAddress)
    axios.get(newspapersAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []
            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspapersBase + url,
                    source:newspaperId
                })
            })
            res.json(specificArticles)
        }).catch((err) => console.log(err))
       
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))