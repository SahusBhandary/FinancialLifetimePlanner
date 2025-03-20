const cheerio = require('cheerio')

const url = 'https://www.irs.gov/taxtopics/tc409'

function parseCapitalTaxData(text) {
    const taxData = [];

    // Regular expressions to match the required taxable income thresholds and rates
    const singlePattern = /more than \$(\d{1,3}(?:,\d{3})*) but less than or equal to \$(\d{1,3}(?:,\d{3})*) for single/;
    const marriedJointlyPattern = /more than \$(\d{1,3}(?:,\d{3})*) but less than or equal to \$(\d{1,3}(?:,\d{3})*) for married filing jointly/;

    // Match the patterns in the text
    const singleMatch = text.match(singlePattern);
    const marriedJointlyMatch = text.match(marriedJointlyPattern);

    // Extract and store the data if matches are found
    if (singleMatch) {
        const singleCapitalGains = [];
        singleCapitalGains.push({
            lower: 0,
            upper: parseInt(singleMatch[1].replace(/,/g, '')),
            rate: 0,
        })
        singleCapitalGains.push({
            lower: parseInt(singleMatch[1].replace(/,/g, '')),
            upper: parseInt(singleMatch[2].replace(/,/g, '')),
            rate: 15,
        })
        singleCapitalGains.push({
            lower: parseInt(singleMatch[2].replace(/,/g, '')),
            upper: 'infinity',
            rate: 20,
        })
        taxData.push(singleCapitalGains);
    }

    if (marriedJointlyMatch) {
        const marriedCapitalGains = [];
        marriedCapitalGains.push({
            lower: 0,
            upper: parseInt(marriedJointlyMatch[1].replace(/,/g, '')),
            rate: 0,
        })
        marriedCapitalGains.push({
            lower: parseInt(marriedJointlyMatch[1].replace(/,/g, '')),
            upper: parseInt(marriedJointlyMatch[2].replace(/,/g, '')),
            rate: 15,
        });
        marriedCapitalGains.push({
            lower: parseInt(marriedJointlyMatch[2].replace(/,/g, '')),
            upper: 'infinity',
            rate: 20,
        });
        taxData.push(marriedCapitalGains);
    }

    return taxData;
}

async function getCapitalTaxData() {
    try {
        const response = await fetch(url)
        const data = await response.text()

        const $ = cheerio.load(data)

        const capitalTaxData = $('.field--name-body.field--type-text-with-summary.field--label-hidden.field--item').find('ul').first();
        const prevParagraph = capitalTaxData.prev('p');

        const secondCapitalTaxData = $('.field--name-body.field--type-text-with-summary.field--label-hidden.field--item').find('ul').eq(1);
        const secondPrevParagraph = secondCapitalTaxData.prev('p');
        const nextParagraph = secondCapitalTaxData.next('p');

        const string = prevParagraph.text() +  capitalTaxData.text() + secondPrevParagraph.text() + secondCapitalTaxData.text() + nextParagraph.text();

        const singleCapitalTax = parseCapitalTaxData(string)[0];
        const marriedCapitalTax = parseCapitalTaxData(string)[1];

        return { singleCapitalTax, marriedCapitalTax }

    } catch (error) {
        console.error(error)
    }
}

module.exports = getCapitalTaxData;


