const output = document.getElementById('output');
const history = document.getElementById('history');

let current = '0';
let previous = '';
let operator = null;
let justEvaluated = false;
let memory = 0;

function updateDisplay() {
  output.textContent = current;
  history.textContent = previous + (operator || '');
}

function clear() {
  current = '0';
  previous = '';
  operator = null;
  updateDisplay();
}

function backspace() {
  if (justEvaluated) {
    current = '0';
    justEvaluated = false;
  } else {
    current = current.length > 1 ? current.slice(0, -1) : '0';
  }
  updateDisplay();
}

function appendNumber(number) {
  if (justEvaluated) {
    current = number;
    justEvaluated = false;
  } else {
    current = current === '0' ? number : current + number;
  }
  updateDisplay();
}

function addDecimal() {
  if (!current.includes('.')) {
    current += '.';
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
  current = '0';
  justEvaluated = false;
  updateDisplay();
}

function evaluate() {
  let a = parseFloat(previous);
  let b = parseFloat(current);
  if (isNaN(a) || isNaN(b)) return;

  if (operator === 'power') {
    evaluatePower();
    return;
  }

  let result = 0;
  switch (operator) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '*': result = a * b; break;
    case '/': result = b !== 0 ? a / b : 'Error'; break;
    default: return;
  }

  current = result.toString();
  previous = '';
  operator = null;
  justEvaluated = true;
  updateDisplay();
}

function factorial(n) {
  n = parseFloat(n);
  if (n < 0 || !Number.isInteger(n)) {
    current = 'Error';
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
  current = '0';
  operator = 'power';
  updateDisplay();
}

function evaluatePower() {
  const base = parseFloat(previous);
  const exponent = parseFloat(current);
  if (isNaN(base) || isNaN(exponent)) return;

  current = Math.pow(base, exponent).toString();
  previous = '';
  operator = null;
  justEvaluated = true;
  updateDisplay();
}

function squareRoot(n) {
  n = parseFloat(n);
  current = n < 0 ? 'Error' : Math.sqrt(n).toString();
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

function copyHistory() {
  const text = `${history.textContent} ${output.textContent}`;
  navigator.clipboard.writeText(text).then(() => {
    alert('Copied!');
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
      current = 'Error';
      updateDisplay();
    }
  });
}

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    const number = btn.dataset.number;
    if (number !== undefined) appendNumber(number);
    else if (action === 'clear') clear();
    else if (action === 'backspace') backspace();
    else if (action === 'decimal') addDecimal();
    else if (action === 'sign') toggleSign();
    else if (action === 'percent') percent();
    else if (action === '=') evaluate();
    else if (['+', '-', '*', '/'].includes(action)) chooseOperator(action);
    else if (action === 'factorial') factorial(current);
    else if (action === 'power') powerMode();
    else if (action === 'sqrt') squareRoot(current);
    else if (action === 'm+') memoryAdd();
    else if (action === 'm-') memorySubtract();
    else if (action === 'mr') memoryRecall();
    else if (action === 'mc') memoryClear();
    else if (action === 'copy-history') copyHistory();
    else if (action === 'paste') pasteFromClipboard();
  });
});

const calculator = document.getElementById('calculator');
const header = document.getElementById('header');
const menuBtn = document.getElementById('menu-btn');
const toggleBtn = document.getElementById('toggle-extra');
const measures = document.querySelectorAll('.measure-btn');
const selectFrom = document.getElementById('convert-from');
const selectTo = document.getElementById('convert-to');

const unitsForMeasures = {
  weight: [
    '<option value="g"></option>',
    '<option value="kg"></option>',
    '<option value="t"></option>'
  ],
  length: [
    '<option value="cm"></option>',
    '<option value="m"></option>',
    '<option value="km"></option>'
  ],
  area: [
    '<option value="cm2"></option>',
    '<option value="m2"></option>',
    '<option value="km2"></option>',
    '<option value="ha"></option>'
  ],
  numsys: [
    '<option value="dec"></option>',
    '<option value="bin"></option>',
    '<option value="hex"></option>',
  ]
};

const translations = {
  en: {
    calculator: 'Calculator',
    converter: 'Converter',
    lang: 'Language',
    mode: 'Mode',
    copy: '📋 Copy',
    paste: '📥 Paste',
    expand: 'Expand',
    collapse: 'Collapse',
    from: 'From',
    to: 'To',
    convertBtn: 'Convert',
    weight: 'Weight',
    length: 'Length',
    area: 'Area',
    numsys: 'Numeral system',
    nomeasure: 'Choose measure first',
    nounit: '—',
    g: 'Grams, g',
    kg: 'Kilograms, kg',
    t: 'Tonnes, t',
    cm: 'Centimeters, cm',
    m: 'Meters, m',
    km: 'Kilometers, km',
    cm2: 'Square centimeters, cm²',
    m2: 'Square meters, m²',
    km2: 'Square kilometers, km²',
    ha: 'Hectares, ha',
    dec: 'Decimal',
    bin: 'Binary',
    hex: 'Hexadecimal'
  },
  uk: {
    calculator: 'Калькулятор',
    converter: 'Конвертер',
    lang: 'Мова',
    mode: 'Режим',
    copy: '📋 Копіювати',
    paste: '📥 Вставити',
    expand: 'Розгорнути',
    collapse: 'Згорнути',
    from: 'З',
    to: 'До',
    convertBtn: 'Конвертувати',
    weight: 'Вага',
    length: 'Довжина',
    area: 'Площа',
    numsys: 'Система числення',
    nomeasure: 'Оберіть спочатку міру',
    nounit: '—',
    g: 'Грами, г',
    kg: 'Кілограми, кг',
    t: 'Тонни, т',
    m: 'Метри, м',
    cm: 'Сантиметри, см',
    km: 'Кілометри, км',
    cm2: 'Квадратні сантиметри, см²',
    m2: 'Квадратні метри, м²',
    km2: 'Квадратні кілометри, км²',
    ha: 'Гектари, га',
    dec: 'Десяткова',
    bin: 'Двійкова',
    hex: 'Шістнадцяткова'
  }
};

let currentLanguage = 'en';
let currentMode = 'calc';
let prevMeasure = null;
let t = translations[currentLanguage];

toggleBtn.addEventListener('click', () => {
  calculator.classList.toggle('expanded');
  toggleBtn.textContent = calculator.classList.contains('expanded')
    ? t.collapse : t.expand;
});

measures.forEach(measure => {
  measure.addEventListener('click', () => {
    selectFrom.innerHTML = '';
    selectFrom.innerHTML = unitsForMeasures[measure.value];
    selectTo.innerHTML = '';
    selectTo.innerHTML = unitsForMeasures[measure.value];
    if (prevMeasure)
      prevMeasure.classList.remove('selected');
    measure.classList.add('selected');
    prevMeasure = measure;
    Array.from(selectFrom.options).forEach(opt => opt.textContent = t[opt.value]);
    Array.from(selectTo.options).forEach(opt => opt.textContent = t[opt.value]);
  });
});

function convertUnits() {
  const resultEl = document.getElementById('convert-result');
  const measure = document.querySelector('.selected');

  if (!measure) {
    resultEl.textContent = t.nomeasure;
    return;
  }
  const from = selectFrom.value;
  const to = selectTo.value;
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
    dec: 10,
    bin: 2,
    hex: 16
  };

  if (!units[from] || !units[to]) {
    resultEl.textContent = 'Unsupported units';
    return;
  }
  let value = document.getElementById('convert-value').value
    .trim().replace(',', '.');
  let converted = value;

  if (['weight', 'length', 'area'].includes(measure.value)) {
    value = value.match(/^\d+(\.\d+)?$/) ? parseFloat(value) : NaN;
    if (isNaN(value)) {
      resultEl.textContent = 'Invalid value';
      return;
    }
    converted = (value * units[from]) / units[to];
  } else if (measure.value === 'numsys') {
    if (from === 'dec' && !value.match(/^[+-]?\d+$/)) {
      value = NaN;
    } else if (from === 'bin' && !value.match(/^[+-]?[01]+$/)) {
      value = NaN;
    } else if (from === 'hex' && !value.match(/^[+-]?[a-f\d]+$/i)) {
      value = NaN;
    }
    value = parseInt(value, units[from]);

    if (isNaN(value)) {
      resultEl.textContent = 'Invalid value';
      return;
    }
    converted = value.toString(units[to]);
  } else {
    resultEl.textContent = t.nomeasure;
    return;
  }
  resultEl.textContent = `${converted}`;
}

menuBtn.addEventListener('click', () => {
  const menu = document.getElementById('menu');

  menu.style.display = menu.style.display === 'none'
    ? 'block' : 'none';
});

document.getElementById('mode-select').addEventListener('change', (e) => {
  const conv = document.getElementById('conv');
  const calc = document.getElementById('calc');

  if (e.target.value === 'conv') {
    currentMode = 'conv';
    header.textContent = t.converter;
    conv.style.display = 'block';
    if (calculator.classList.contains('expanded'))
      toggleBtn.click();
    calc.style.display = 'none';
  } else {
    currentMode = 'calc';
    header.textContent = t.calculator;
    conv.style.display = 'none';
    calc.style.display = 'block';
  }
  menuBtn.click();
});

document.getElementById('lang-select').addEventListener('change', (e) => {
  changeLanguage(e.target.value);
});

function changeLanguage(lang) {
  currentLanguage = lang;
  t = translations[currentLanguage];

  header.textContent = currentMode === 'calc' ? t.calculator : t.converter;
  document.querySelector('label[for="lang-select"]').textContent = t.lang + ':';
  document.querySelector('label[for="mode-select"]').textContent = t.mode + ':';
  document.querySelector('option[value="calc"]').textContent = t.calculator;
  document.querySelector('option[value="conv"]').textContent = t.converter;
  document.querySelector('[data-action="copy-history"]').textContent = t.copy;
  document.querySelector('[data-action="paste"]').textContent = t.paste;
  toggleBtn.textContent = calculator.classList.contains('expanded')
    ? t.collapse : t.expand;

  document.getElementById('label-from').textContent = t.from + ':';
  document.getElementById('label-to').textContent = t.to + ':';
  document.getElementById('convert-btn').textContent = t.convertBtn;
  measures.forEach(opt => opt.textContent = t[opt.value]);
  Array.from(selectFrom.options).forEach(opt => opt.textContent = t[opt.value]);
  Array.from(selectTo.options).forEach(opt => opt.textContent = t[opt.value]);
}

updateDisplay();
changeLanguage(currentLanguage);
