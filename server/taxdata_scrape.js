const cheerio = require('cheerio')

const url = 'https://www.irs.gov/filing/federal-income-tax-rates-and-brackets'

function parseTaxBrackets(input) {
    const tables = input.split(/(?=10%\$0)/g); // Split into separate tables
    
    return tables.map(table => {
        const parts = table.match(/(\d+)%\$(\d{1,3}(?:,\d{3})*)(?:\$(\d{1,3}(?:,\d{3})*))?|\d+%\$(\d{1,3}(?:,\d{3})*)And up/g);
        if (!parts) return [];
        
        return parts.map(part => {
            const match = part.match(/(\d+)%\$(\d{1,3}(?:,\d{3})*)(?:\$(\d{1,3}(?:,\d{3})*))?/);
            if (!match) return null;
            
            return {
                rate: parseInt(match[1], 10),
                lower: parseInt(match[2].replace(/,/g, ''), 10),
                upper: match[3] ? parseInt(match[3].replace(/,/g, ''), 10) : "And up"
            };
        }).filter(Boolean);
    });
}

async function getTaxData() {
    try {
        const response = await fetch(url)
        const data = await response.text()

        const $ = cheerio.load(data)

        const genre = $("tbody>tr>td").text()
        console.log(genre)
        console.log(parseTaxBrackets(genre));
    } catch (error) {
        console.error(error)
    }
}

getTaxData();


