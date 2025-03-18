const cheerio = require('cheerio')

const url = 'https://www.irs.gov/publications/p17#en_US_2024_publink1000283782'

function parseTaxDeductions(input) {
  const regex = /(Single or Married filing separately|Married filing jointly or Qualifying surviving spouse|Head of household)\$?([\d,]+)/g;
  let match;
  const results = [];

  while ((match = regex.exec(input)) !== null) {
    results.push({ status: match[1], deduction: `$${match[2]}` });
  }

  return results;
}

async function getTaxDeductionData() {
    try {
        const response = await fetch(url)
        const data = await response.text()

        const $ = cheerio.load(data)
        
        const taxData = $('table[summary="Table 10-1.Standard Deduction Chart for Most People*"]>tbody>tr>td').text();
        const singleTaxDeductions = parseTaxDeductions(taxData)[0];
        const marriedTaxDeductions = parseTaxDeductions(taxData)[1];
        console.log(singleTaxDeductions);
        console.log(marriedTaxDeductions);
    } catch (error) {
        console.error(error)
    }
}

getTaxDeductionData();


