const convert = document.getElementById('convert');
const decimalInput = document.getElementById('decimal')
const resultP = document.getElementById('result')

const toBit = (val, res) => {
        let original = parseFloat(val.value); console.log(original)
        let decimal = parseFloat(val.value)
        let count = '';
        if(decimal > 0) {
            for(let i = 0; i < val.value; i++) {
                if (decimal < 1) {
                    if(original % 2) {
                        let print = `${original} = ${count}`
                        val.value = ''
                        console.log(print)
                        return res.innerText = print
                    } else {
                        let print = `${original} = ${count.split('').reverse().join('')}`
                        val.value = ''
                        console.log(print)
                        return res.innerText = print
                    }
                }
                if (decimal % 2) {
                    count += '1'
                    decimal = (Math.round(decimal) - 1)
                    console.log(count)
                } else if(decimal === 1) {
                    count += '1'
                    console.log(count)
                } else {
                    count += '0'
                    console.log(count)
                }
                decimal /= 2;
                console.log(decimal); console.log(original)
            }
        }
        if(original % 2) {
            let print = `${original} = ${count}`
            console.log(print)
            return res.innerText = print
        } else {
            let print = `${original} = ${count.split('').reverse().join('')}`
            console.log(print)
            return res.innerText = print
        }
}

convert.addEventListener("click", () => toBit(decimalInput, resultP));