const output = document.getElementById("output");
const history = document.getElementById("history");

let current = "0";
let previous = "";
let operator = null;
let justEvaluated = false;
let memory = 0;

function updateDisplay() {
    output.textContent = current;
    history.textContent = previous + (operator || "");
}

function clear() {
    current = "0";
    previous = "";
    operator = null;
    updateDisplay();
}

function appendNumber(number) {
    if (justEvaluated) {
        current = number;
        justEvaluated = false;
    } else {
        current = current === "0" ? number : current + number;
    }
    updateDisplay();
}

function addDecimal() {
    if (!current.includes(".")) {
        current += ".";
    }
    updateDisplay();
}

function toggleSign() {
    current = (parseFloat(current) * -1).toString();
    updateDisplay();
}

function percent() {
    current = (parseFloat(current) / 100).toString();
    updateDisplay();
}

function chooseOperator(op) {
    if (previous && operator && !justEvaluated) {
        evaluate();
    }
    operator = op;
    previous = current;
    current = "0";
    justEvaluated = false;
    updateDisplay();
}

function evaluate() {
    let a = parseFloat(previous);
    let b = parseFloat(current);
    if (isNaN(a) || isNaN(b)) return;

    if (operator === "power") {
        evaluatePower();
        return;
    }

    let result = 0;
    switch (operator) {
        case "+": result = a + b; break;
        case "-": result = a - b; break;
        case "*": result = a * b; break;
        case "/": result = b !== 0 ? a / b : "Error"; break;
        default: return;
    }

    current = result.toString();
    previous = "";
    operator = null;
    justEvaluated = true;
    updateDisplay();
}

function factorial(n) {
    n = parseFloat(n);
    if (n < 0 || !Number.isInteger(n)) {
        current = "Error";
    } else {
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        current = result.toString();
    }
    updateDisplay();
}

function powerMode() {
    previous = current;
    current = "0";
    operator = "power";
    updateDisplay();
}

function evaluatePower() {
    const base = parseFloat(previous);
    const exponent = parseFloat(current);
    if (isNaN(base) || isNaN(exponent)) return;

    current = Math.pow(base, exponent).toString();
    previous = "";
    operator = null;
    justEvaluated = true;
    updateDisplay();
}

function squareRoot(n) {
    n = parseFloat(n);
    if (n < 0) {
        current = "Error";
    } else {
        current = Math.sqrt(n).toString();
    }
    updateDisplay();
}

function memoryAdd() {
    memory += parseFloat(current);
    justEvaluated = true;
}

function memorySubtract() {
    memory -= parseFloat(current);
    justEvaluated = true;
}

function memoryRecall() {
    current = memory.toString();
    justEvaluated = true;
    updateDisplay();
}

function memoryClear() {
    memory = 0;
}

function convertLength() {
    const meters = parseFloat(current);
    if (isNaN(meters)) return;
    const cm = meters * 100;
    const km = meters / 1000;
    current = `${cm} cm | ${km} km`;
    justEvaluated = true;
    updateDisplay();
}

function convertWeight() {
    const kg = parseFloat(current);
    if (isNaN(kg)) return;
    const grams = kg * 1000;
    const tonnes = kg / 1000;
    current = `${grams} g | ${tonnes} t`;
    justEvaluated = true;
    updateDisplay();
}

function convertArea() {
    const m2 = parseFloat(current);
    if (isNaN(m2)) return;
    const cm2 = m2 * 10000;
    const hectares = m2 / 10000;
    current = `${cm2} cm² | ${hectares} ha`;
    justEvaluated = true;
    updateDisplay();
}

function toBinary() {
    const num = parseInt(current);
    if (isNaN(num)) return;
    current = num.toString(2);
    justEvaluated = true;
    updateDisplay();
}

function toDecimal() {
    const result = parseInt(current, 16);
    current = isNaN(result) ? "Error" : result.toString();
    justEvaluated = true;
    updateDisplay();
}



function toHex() {
    const num = parseInt(current);
    if (isNaN(num)) return;
    current = num.toString(16).toUpperCase();
    justEvaluated = true;
    updateDisplay();
}

function copyHistory() {
    const text = `${history.textContent} ${output.textContent}`;
    navigator.clipboard.writeText(text).then(() => {
        alert("History copied!");
    });
}

function pasteFromClipboard() {
    navigator.clipboard.readText().then(text => {
        const clean = text.match(/[0-9.\-]+/);
        if (clean) {
            current = clean[0];
            justEvaluated = true;
            updateDisplay();
        } else {
            current = "Error";
            updateDisplay();
        }
    });
}

function convertUnits() {
    const value = parseFloat(document.getElementById("convert-value").value);
    const from = document.getElementById("convert-from").value;
    const to = document.getElementById("convert-to").value;
    const resultEl = document.getElementById("convert-result");

    if (isNaN(value)) {
        resultEl.textContent = "Invalid value";
        return;
    }

    const units = {
   
        m: 1,
        cm: 0.01,
        km: 1000,

 
        g: 0.001,
        kg: 1,
        t: 1000,


        m2: 1,
        cm2: 0.0001,
        km2: 1_000_000,
        ha: 10_000,
    };

    if (!units[from] || !units[to]) {
        resultEl.textContent = "Unsupported units";
        return;
    }

    const base = value * units[from];
    const converted = base / units[to];

    resultEl.textContent = `${converted} ${to}`;
}


document.getElementById("toggle-extra").addEventListener("click", () => {
    const calculator = document.getElementById("calculator");
    calculator.classList.toggle("expanded");

    const toggleBtn = document.getElementById("toggle-extra");
    toggleBtn.textContent = calculator.classList.contains("expanded") ? "Collapse" : "Expand";
});

document.getElementById("open-converter").addEventListener("click", () => {
    const panel = document.getElementById("converter-panel");
    panel.style.display = panel.style.display === "none" ? "block" : "none";
});


document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const action = btn.dataset.action;
        const number = btn.dataset.number;
        if (number !== undefined) appendNumber(number);
        else if (action === "clear") clear();
        else if (action === "decimal") addDecimal();
        else if (action === "sign") toggleSign();
        else if (action === "percent") percent();
        else if (action === "=") evaluate();
        else if (["+", "-", "*", "/"].includes(action)) chooseOperator(action);
        else if (action === "factorial") factorial(current);
        else if (action === "power") powerMode();
        else if (action === "sqrt") squareRoot(current);
        else if (action === "m+") memoryAdd();
        else if (action === "m-") memorySubtract();
        else if (action === "mr") memoryRecall();
        else if (action === "mc") memoryClear();
        else if (action === "convert-length") convertLength();
        else if (action === "convert-weight") convertWeight();
        else if (action === "convert-area") convertArea();
        else if (action === "to-binary") toBinary();
        else if (action === "to-decimal") toDecimal();
        else if (action === "to-hex") toHex();
        else if (action === "copy-history") copyHistory();
        else if (action === "paste") pasteFromClipboard();


    });
});

updateDisplay();
