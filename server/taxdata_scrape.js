const cheerio = require('cheerio')

const url = 'https://www.irs.gov/filing/federal-income-tax-rates-and-brackets'



async function getTaxData() {
    try {
        const response = await fetch(url)
        const data = await response.text()

        const $ = cheerio.load(data)

        const taxData = $("tbody>tr>td").text();

        console.log(taxData.split('$'))
    } catch (error) {
        console.error(error)
    }
}
let string = "10%$0$11,60012%$11,601$47,15022%$47,151$100,52524%$100,526$191,95032%$191,951$243,72535%$243,726$609,35037%$609,351And up10%$0$23,20012%$23,201$94,30022%$94,301$201,05024%$201,051$383,90032%$383,901$487,45035%$487,451$731,20037%$731,201And up10%$0$11,60012%$11,601$47,15022%$47,151$100,52524%$100,526$191,95032%$191,951$243,72535%$243,726$365,60037%$365,601And up10%$0$16,55012%$16,551$63,10022%$63,101$100,50024%$100,501$191,95032%$191,951$243,70035%$243,701$609,35037%$609,351And up"

let taxBracket = [];
function parseTax (string) {
    let oneBracket = "";
    for (let i = 2; i < string.length; i++){
        if (string[i] === "%"){
            oneBracket += string[i - 2];
            oneBracket += string[i - 1];
            oneBracket += string[i];
        }
        else{
            if (string[i + 2] !== "%")
                oneBracket += string[i];
            else{
                taxBracket.push(oneBracket);
                oneBracket = "";
            }
        }
    }
}
// getTaxData();

parseTax(string);
console.log(taxBracket);