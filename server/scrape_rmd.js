const cheerio = require('cheerio');
const { parse } = require('dotenv');

const url = 'https://www.irs.gov/publications/p590b#en_US_2023_publink100090310'

function parseAgeDistribution(input) {
  const regex = /(\d{2})(\d+.\d)/g;
  const map = new Map();
  let match;

  while ((match = regex.exec(input)) !== null) {
      const key = match[1];
      const value = parseFloat(match[2]);
      map.set(key, value);
  }

  const lastIndex = input.lastIndexOf("120 and over");
  if (lastIndex !== -1) {
      const valueMatch = input.slice(lastIndex).match(/(\d+.\d)/);
      if (valueMatch) {
          map.set("120 and over", parseFloat(valueMatch[1]));
      }
  }

  return Object.fromEntries(map);
}


async function getRMDData() {
    try {
        let rmdTable = [];
        const response = await fetch(url)
        const data = await response.text()

        const $ = cheerio.load(data)

        const rmdData = $('table[summary="Appendix B. Uniform Lifetime Table"]>tbody>tr>td')

        rmdData.each(function(index, element) {
          let cellData = $(element).text().trim();
          if (!isNaN(parseFloat(cellData)))
            rmdTable.push(parseFloat(cellData));
        });

        let rmdMap = {};

        for (let i = 0; i < rmdTable.length; i += 2) {
          rmdMap[rmdTable[i]] = rmdTable[i + 1];
        }

        let sortedRMDMap = Object.fromEntries(
          Object.entries(rmdMap).sort((a, b) => Number(a[0]) - Number(b[0])).map(([key, value]) => key === "120" ? ["120 and over", value] : [key, value])
        );

        console.log(sortedRMDMap);
    } catch (error) {
        console.error(error)
    }
}

getRMDData();

