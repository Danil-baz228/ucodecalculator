const output = document.getElementById('output');
const history = document.getElementById('history');

let current = '0';
let previous = '';
let operator = null;
let justEvaluated = false;
let newNum = true;
let expressionHistory = '';
let memory = 0;

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
    clipboard: 'Copied to clipboard!',
    zerodivision: 'Division by zero',
    error: 'Error',
    from: 'From',
    to: 'To',
    convertBtn: 'Convert',
    swapBtn: 'Swap',
    weight: 'Weight',
    length: 'Length',
    area: 'Area',
    numsys: 'Numeral system',
    time: 'Time',
    nomeasure: 'Choose measure first',
    invalidvalue: 'Invalid value',
    unsupportedunits: 'Unsupported units',
    nounit: '—',
    g: 'Grams, g',
    kg: 'Kilograms, kg',
    t: 'Tonnes, t',
    mm: 'Milimeters, mm',
    cm: 'Centimeters, cm',
    m: 'Meters, m',
    km: 'Kilometers, km',
    cm2: 'Square centimeters, cm²',
    m2: 'Square meters, m²',
    km2: 'Square kilometers, km²',
    ha: 'Hectares, ha',
    dec: 'Decimal',
    bin: 'Binary',
    hex: 'Hexadecimal',
    sec: 'Seconds, s',
    min: 'Minutes, min',
    hour: 'Hours, hrs',
    day: 'Days, d'
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
    clipboard: 'Скопійовано в буфер обміну!',
    zerodivision: 'Ділення на нуль',
    error: 'Помилка',
    from: 'З',
    to: 'До',
    convertBtn: 'Конвертувати',
    swapBtn: 'Поміняти',
    weight: 'Вага',
    length: 'Довжина',
    area: 'Площа',
    numsys: 'Система числення',
    time: 'Час',
    nomeasure: 'Оберіть спочатку міру',
    invalidvalue: 'Невалідне значення',
    unsupportedunits: 'Непідтримувані одиниці',
    nounit: '—',
    g: 'Грами, г',
    kg: 'Кілограми, кг',
    t: 'Тонни, т',
    mm: 'Міліметри, мм',
    cm: 'Сантиметри, см',
    m: 'Метри, м',
    km: 'Кілометри, км',
    cm2: 'Квадратні сантиметри, см²',
    m2: 'Квадратні метри, м²',
    km2: 'Квадратні кілометри, км²',
    ha: 'Гектари, га',
    dec: 'Десяткова',
    bin: 'Двійкова',
    hex: 'Шістнадцяткова',
    sec: 'Секунди, с',
    min: 'Хвилини, хв',
    hour: 'Години, год',
    day: 'Дні, дн'
  }
};

let currentLanguage = 'en';
let currentMode = 'calc';
let prevMeasure = null;
let t = translations[currentLanguage];

function updateDisplay() {
  const num = parseFloat(current);

  if (!isFinite(num)) {
    output.textContent = current;
  } else {
    let dec_d = current.split('.')[1];

    output.textContent
      = num.toLocaleString(undefined,
        { minimumFractionDigits: dec_d ? dec_d.length : 0 })
        + (current[current.length - 1] === '.' ? '.' : '');
  }
  history.textContent = expressionHistory;
}

function clear() {
  current = '0';
  previous = '';
  operator = null;
  expressionHistory = '';
  updateDisplay();
}

function backspace() {
  if (justEvaluated) {
    clear();
  } else {
    if (current.length > 1) {
      current = current.slice(0, -1);
    } else {
      current = '0';
      newNum = false;
    }
    updateDisplay();
  }
}

function appendNumber(number) {
  newNum = true;
  if (justEvaluated) {
    current = number;
    expressionHistory = '';
    justEvaluated = false;
  } else {
    if (current.match(/\d/g).length < 15)
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
  if (expressionHistory.slice(-1) === '/'
    && newNum && current === '0') {
    clear();
    current = t.zerodivision;
  } else {
    if (operator === 'pow') {
      expressionHistory
        = expressionHistory.replace('?', newNum ? current : '1');
    } else if (!['fact', 'sqrt'].includes(operator)) {
      if (current[current.length - 1] === '.')
        current = current.slice(0, -1);
      if (justEvaluated) {
        expressionHistory = current;
        justEvaluated = false;
      } else {
        if (!expressionHistory) {
          expressionHistory = current;
        } else if (!newNum) {
          expressionHistory = expressionHistory.slice(0, -2);
        } else {
          expressionHistory += ' ' + current;
        }
      }
    }
    expressionHistory += ` ${op}`;
    current = '0';
    newNum = false;
    operator = op;
  }
  updateDisplay();
}

function fact(n) {
  let result = 1;

  for (let i = 2; i <= n; i++)
    result *= i;
  return result;
}

function sqrt(n) {
  return Math.sqrt(n);
}

function pow(base, exponent) {
  return Math.pow(base, exponent);
}

const extra = {fact, sqrt, pow};

function chooseExtraOperator(op) {
  let num = parseFloat(current);

  if (justEvaluated) {
    expressionHistory = '';
    justEvaluated = false;
    newNum = true;
  }
  if (newNum && op === 'pow') {
    if (operator !== `${op}`
      && !['fact', 'sqrt'].includes(operator)) {
      expressionHistory += (expressionHistory ? ' ' : '')
        + `${op}(${current}, ?)`;
    } else {
      expressionHistory = expressionHistory.substring(0,
        expressionHistory.lastIndexOf(`${operator}`)) + `${op}(${current}, ?)`;
    }
  }
  else if (newNum && Number.isInteger(num) && num >= 0) {
    if (operator !== `${op}`
      && !['fact', 'sqrt', 'pow'].includes(operator)) {
      expressionHistory += (expressionHistory ? ' ' : '')
        + `${op}(${current})`;
    } else {
      expressionHistory = expressionHistory.substring(0,
        expressionHistory.lastIndexOf(`${operator}`)) + `${op}(${current})`;
    }
  } else if (['fact', 'sqrt', 'pow'].includes(operator)) {
    current = previous;
    expressionHistory = expressionHistory.substring(0,
      expressionHistory.lastIndexOf(`${operator}`))
        + (op === 'pow' ? `${op}(${current}, ?)` : `${op}(${current})`);
  } else {
    alert(t.error);
    return;
  }
  previous = current;
  current = '0';
  newNum = false;
  operator = op;
  updateDisplay();
}

function evaluate() {
  if (expressionHistory.slice(-1) === '/'
    && newNum && current === '0') {
    clear();
    current = t.zerodivision;
  } else if (!justEvaluated) {
    if (operator === 'pow') {
      expressionHistory
        = expressionHistory.replace('?', newNum ? current : '1');
    } else if (!['fact', 'sqrt'].includes(operator)) {
      if (newNum) {
        expressionHistory += (expressionHistory ? ' ' : '') + current;
      } else {
        expressionHistory = expressionHistory.slice(0, -2);
      }
    }

    let hist = expressionHistory.replace(/, /g, ',').split(' ');
    let tmp = [];

    for (let i = 0; i < hist.length; i++)
      hist[i] = compute(hist[i]);
    for (let i = 0; i < hist.length; i++) {
      if (hist[i] === '*') {
        hist[i - 1] = hist[i - 1] * hist[i + 1];
        hist[i + 1] = hist[i - 1];
        tmp.push(hist[i - 1]);
      } else if (hist[i] === '/') {
        hist[i - 1] = hist[i - 1] / hist[i + 1];
        hist[i + 1] = hist[i - 1];
        tmp.push(hist[i - 1]);
      } else if (hist[i - 1] !== '*' && hist[i + 1] !== '*'
        && hist[i - 1] !== '/' && hist[i + 1] !== '/') {
        tmp.push(hist[i]);
      }
    }
    for (let i = 1; i < tmp.length - 1; i++) {
      if (tmp[i] === '+') {
        tmp[i - 1] = tmp[i - 1] + tmp[i + 1];
        tmp[i + 1] = tmp[i - 1];
      } else if (tmp[i] === '-') {
        tmp[i - 1] = tmp[i - 1] - tmp[i + 1];
        tmp[i + 1] = tmp[i - 1];
      }
    }
    current = tmp[tmp.length - 1].toString();
    justEvaluated = true;
    operator = null;
    expressionHistory += ' =';
  }
  updateDisplay();
}

function compute(el) {
  if (!isNaN(el))
    return parseFloat(el);
  else if (['+', '-', '*', '/'].includes(el))
    return el;
  const func = el.slice(0, el.indexOf('('));
  let arg = el.slice(el.indexOf('(') + 1, el.indexOf(')'));

  if (func !== 'pow') {
    return extra[func](parseFloat(arg));
  } else {
    arg = arg.split(',');
    return extra[func](parseFloat(arg[0]), parseFloat(arg[1]));
  }
}

function memoryAdd() {
  memory += parseFloat(current);
}

function memorySubtract() {
  memory -= parseFloat(current);
}

function memoryRecall() {
  if (justEvaluated) {
    clear();
    justEvaluated = false;
  }
  current = memory.toString();
  newNum = true;
  updateDisplay();
}

function memoryClear() {
  memory = 0;
}

function copyHistory() {
  let text = '';

  if (justEvaluated) {
    text = history.textContent + ' ' + output.textContent;
  } else if (!expressionHistory) {
    text = current;
  } else if (['fact', 'sqrt'].includes(operator)) {
    text = expressionHistory;
  } else if (operator === 'pow') {
    text = expressionHistory.replace('?', newNum ? current : '1');
  } else if (newNum) {
    text = expressionHistory + ' ' + current;
  } else {
    text = expressionHistory.slice(0, -2);
  }

  navigator.clipboard.writeText(text).then(() => {
    alert(t.clipboard);
  });
}

function pasteFromClipboard() {
  clear();
  justEvaluated = false;
  navigator.clipboard.readText().then(text => {
    let hist = text.replace(/, /g, ',').split(' ');

    for (let i = 0; i < hist.length; i++) {
      if (!/^([+-]?\d+(\.\d+)?|[-+*/])$/.test(hist[i])
        && !/^(fact\(\d+\)|sqrt\(\d+\))$/.test(hist[i])
        && !/^pow\([+-]?\d+(\.\d+)?,[+-]?\d+(\.\d+)?\)$/.test(hist[i])) {
        current = t.error;
        updateDisplay();
        return;
      }
    }
    let last = hist[hist.length - 1].replace(',', ', ');

    if (['+', '-', '*', '/'].includes(hist[0]))
      hist.unshift('0');
    text = hist.slice(0, -1).join(' ').replace(',', ', ');
    expressionHistory = text;
    if (!isNaN(last)) {
      current = last;
      newNum = true;
    } else if (['+', '-', '*', '/'].includes(last)) {
      expressionHistory += (expressionHistory ? ' ' : '') + last;
      current = '0';
      newNum = false;
    } else {
      expressionHistory += (expressionHistory ? ' ' : '') + last;
      current = '0';
      newNum = false;
      operator = last.substring(0, last.indexOf('('));
      previous = last.slice(last.indexOf('(') + 1, last.indexOf(')'));
      if (operator === 'pow') {
        previous = previous.split(',')[0];
      }
    }
    updateDisplay();
  });
}

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const number = btn.dataset.number;
    const action = btn.dataset.action;

    if (isNaN(current))
      clear();
    if (number) appendNumber(number);
    else if (action === 'clear') clear();
    else if (action === 'backspace') backspace();
    else if (action === 'decimal') addDecimal();
    else if (action === 'sign') toggleSign();
    else if (action === 'percent') percent();
    else if (action === '=') evaluate();
    else if (['+', '-', '*', '/'].includes(action)) chooseOperator(action);
    else if (['fact', 'sqrt', 'pow'].includes(action)) chooseExtraOperator(action);
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
const convValue = document.getElementById('convert-value')
const convRes = document.getElementById('convert-result');

const unitsForMeasures = {
  weight: [
    '<option value="g"></option>',
    '<option value="kg"></option>',
    '<option value="t"></option>'
  ],
  length: [
    '<option value="mm"></option>',
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
    '<option value="hex"></option>'
  ],
  time: [
    '<option value="sec"></option>',
    '<option value="min"></option>',
    '<option value="hour"></option>',
    '<option value="day"></option>'
  ]
};

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
  const measure = document.querySelector('.selected');

  if (!measure) {
    convRes.textContent = t.nomeasure;
    return;
  }
  const from = selectFrom.value;
  const to = selectTo.value;
  const units = {
    mm: 0.001,
    cm: 0.01,
    m: 1,
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
    hex: 16,
    sec: 1,
    min: 60,
    hour: 60 * 60,
    day: 60 * 60 * 24,
  };

  if (!units[from] || !units[to]) {
    convRes.textContent = t.unsupportedunits;
    return;
  }
  let value = convValue.value.trim().replace(',', '.');
  let converted = value;

  if (['weight', 'length', 'area', 'time'].includes(measure.value)) {
    value = value.match(/^\d+(\.\d+)?$/) ? parseFloat(value) : NaN;
    if (isNaN(value)) {
      convRes.textContent = t.invalidvalue;
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
      convRes.textContent = t.invalidvalue;
      return;
    }
    converted = value.toString(units[to]);
  } else {
    convRes.textContent = t.nomeasure;
    return;
  }
  convRes.textContent = `${converted}`;
}

function swapUnits() {
  if (!document.querySelector('.selected')) {
    convRes.textContent = t.nomeasure;
    return;
  }
  [[selectFrom.value, selectTo.value]
    = [selectTo.value, selectFrom.value]];

  if (convValue.value && convRes.textContent
    && !['nomeasure', 'unsupportedunits', 'invalidvalue']
    .find(key => t[key] === convRes.textContent)) {
  [[convValue.value, convRes.textContent]
    = [convRes.textContent, convValue.value]];
  } else {
    convValue.value = '', convRes.textContent = '';
  }
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
  let invCalc = ['zerodivision', 'error']
    .find(key => t[key] === output.textContent);
  let invConv = ['nomeasure', 'unsupportedunits', 'invalidvalue']
    .find(key => t[key] === convRes.textContent);

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
  document.getElementById('swap-btn').textContent = t.swapBtn;
  measures.forEach(opt => opt.textContent = t[opt.value]);
  Array.from(selectFrom.options).forEach(opt => opt.textContent = t[opt.value]);
  Array.from(selectTo.options).forEach(opt => opt.textContent = t[opt.value]);

  if (invCalc)
    output.textContent = t[invCalc];
  if (invConv)
    convRes.textContent = t[invConv];
}

updateDisplay();
changeLanguage(currentLanguage);
