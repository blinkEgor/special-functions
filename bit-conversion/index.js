const check = (original, count, val, res) => {
    let print = `${original} = ${count.split('').reverse().join('')}`
    val.value = ''
    return res.innerText = print
};

const toBit = (val, res) => {
        let original = parseFloat(val.value);
        let decimal = parseFloat(val.value)
        let count = '';
        if(decimal > 0) {
            for(let i = 0; i < val.value; i++) {
                if (decimal % 2) {
                    count += '1'
                    decimal = (Math.round(decimal) - 1)
                } else if(decimal === 1) {
                    count += '1'
                } else {
                    count += '0'
                }
                decimal /= 2;
                if (decimal < 1) {
                    check(original, count, val, res)
                }
            }
        } else {
            count = '0'
            check(original, count, val, res)    
        }
        check(original, count, val, res)
};

const toDecimal = (val, res) => {
    let original = val.value;
    let bit = val.value.split('').reverse().join('');
    let count = 0;
    if(original.length > 0) {
        for(let i = 0; i < original.length; i++) {
            if(bit[i] === '1') {
                count += (2**i);
            }
        }
    } else {
        return res.innerText = "No value";
    }
    res.innerText = `${original} = ${count}`;
    val.value = '';
};

document.getElementById('convert-to-bit').addEventListener("click", () => toBit(
    document.getElementById('decimal'),
    document.getElementById('result-bit')
));

document.getElementById('convert-to-decimal').addEventListener("click", () => toDecimal(
    document.getElementById('bit'),
    document.getElementById('result-decimal')
))