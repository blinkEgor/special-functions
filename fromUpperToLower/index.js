const enter = document.getElementById('upper-text');
const result = document.getElementById('result');
const send = document.getElementById('send');

const fromUpperTolower = (enter, result) => {
    result.innerHTML = enter.value.toLowerCase();
    enter.value = "";
};

send.addEventListener("click", () => fromUpperTolower(enter, result));