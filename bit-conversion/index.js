const aniPlace = (dec, bit) => {
    let countDec = "";
    let constBit = "";
    dec.placeholder = countDec;
    bit.placeholder = constBit;
    for(let i = 0; i < 6; i++) {
        const ani = () => {
            countDec += i;
            dec.placeholder = countDec;
            if(!(i % 2)) { constBit += "1" }
            else { constBit += "0" }
            bit.placeholder = constBit;
        }
        setTimeout(ani, 1000 * i);
    }
};
aniPlace(document.getElementById("decimal"), document.getElementById("bit"));

const check = (original, count, val, res) => {
    let print = `${original} = ${count.split('').reverse().join('')}`;
    val.value = '';
    if(count.length == 0) {
        return res.innerText = "No value or Invalid input";
    }
    return res.innerText = print;
};

const toBit = (val, res) => {
        let original = parseFloat(val.value);
        let decimal = parseFloat(val.value);
        let count = '';
        if(original > 0) {
            for(let i = 0; i < val.value; i++) {
                if (decimal % 2) {
                    count += '1';
                    decimal = (Math.round(decimal) - 1);
                } else if(decimal === 1) {
                    count += '1';
                } else {
                    count += '0';
                }
                decimal /= 2;
                if (decimal < 1) {
                    check(original, count, val, res);
                }
            }
        } else if(original == 0) {
            count = '0';
            check(original, count, val, res);
        } else {
            val.value = '';
            return res.innerText = "No value or Invalid input";
        }
        check(original, count, val, res);
};

const toDecimal = (val, res) => {
    let original = val.value;
    let bit = val.value.split('').reverse().join('');
    let count = 0;
    if(original.length > 0) {
        for(let i = 0; i < original.length; i++) {
            if(bit[i] === '1') {
                count += (2**i);
            } else if(bit[i] === '0') {
                count += 0;
            } else {
                val.value = '';
                return res.innerText = "Invalid input";
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
));