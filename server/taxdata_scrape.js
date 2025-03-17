const cheerio = require('cheerio')

const url = 'https://www.irs.gov/filing/federal-income-tax-rates-and-brackets'

async function getTaxData() {
    try {
        const response = await fetch(url)
        const data = await response.text()

        const $ = cheerio.load(data)

        const genre = $("td")
        console.log(genre)
    } catch (error) {
        console.error(error)
    }
}
getTaxData();