const calculationStorageKey = 'microloan.calculations.v1';
const savedCalculationList = document.getElementById('saved-calculation-list');
const savedCalculationEmpty = document.getElementById('saved-calculation-empty');
const savedCalculationMessage = document.getElementById('saved-calculation-message');
const clearCalculationButton = document.getElementById('clear-saved-calculations');

function readSavedCalculations() {
  const saved = localStorage.getItem(calculationStorageKey);
  if (saved === null) return [];
  const records = JSON.parse(saved);
  if (!Array.isArray(records)) throw new Error('Saved calculations must be a list.');

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    if (!record || typeof record.id !== 'string' || record.id === '' || record.annualRate !== 0.05) {
      throw new Error('Invalid saved calculation.');
    }
    // Use the shared function to check saved values; do not repeat the formula.
    const expected = window.MicroLoan.calculateLoan(record.amount, record.termMonths, record.annualRate);
    if (record.interest !== expected.interest || record.total !== expected.total ||
        record.monthlyPayment !== expected.monthlyPayment) {
      throw new Error('Invalid saved calculation result.');
    }
    for (let j = 0; j < i; j++) {
      if (records[j].id === record.id) throw new Error('Duplicate calculation ID.');
    }
  }
  return records;
}

function renderSavedCalculations() {
  savedCalculationList.replaceChildren();
  savedCalculationEmpty.hidden = true;
  try {
    const records = readSavedCalculations();
    savedCalculationEmpty.hidden = records.length !== 0;
    clearCalculationButton.disabled = records.length === 0;
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const item = document.createElement('li');
      item.className = 'card saved-calculation';
      const heading = document.createElement('h3');
      heading.textContent = formatPaymentAmount(record.amount) + ' for ' + record.termMonths + ' months';
      const rate = document.createElement('p');
      rate.textContent = 'Annual rate: 5%. Interest: ' + formatPaymentAmount(record.interest);
      const total = document.createElement('p');
      total.textContent = 'Total to repay: ' + formatPaymentAmount(record.total);
      const monthly = document.createElement('p');
      monthly.textContent = 'Monthly payment: ' + formatPaymentAmount(record.monthlyPayment);
      item.append(heading, rate, total, monthly);
      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.className = 'btn btn-outline-danger btn-sm align-self-start';
      removeButton.textContent = 'Remove';
      removeButton.setAttribute('aria-label', 'Remove saved calculation ' + (i + 1));
      removeButton.addEventListener('click', function () { removeSavedCalculation(record.id); });
      item.append(removeButton);
      savedCalculationList.append(item);
    }
  } catch (error) {
    // Clearing is an explicit action: damaged data is never reset on its own.
    clearCalculationButton.disabled = false;
    savedCalculationMessage.textContent = 'Saved calculations could not be read. Check browser storage, or use Clear saved calculations to remove damaged entries.';
  }
}

function removeSavedCalculation(id) {
  try {
    const records = readSavedCalculations();
    const remaining = [];
    for (let i = 0; i < records.length; i++) {
      if (records[i].id !== id) remaining.push(records[i]);
    }
    localStorage.setItem(calculationStorageKey, JSON.stringify(remaining));
    renderSavedCalculations();
    savedCalculationMessage.textContent = 'Calculation removed.';
    document.getElementById('saved-calculations-title').focus();
  } catch (error) {
    savedCalculationMessage.textContent = 'The calculation could not be removed. Existing entries have been kept. Please try again.';
  }
}

if (clearCalculationButton) {
  clearCalculationButton.addEventListener('click', function () {
    try {
      // Only this key is removed. Applications and the theme are untouched.
      localStorage.removeItem(calculationStorageKey);
      renderSavedCalculations();
      savedCalculationMessage.textContent = 'Saved calculations cleared.';
      document.getElementById('saved-calculations-title').focus();
    } catch (error) {
      savedCalculationMessage.textContent = 'Saved calculations could not be cleared. Please try again.';
    }
  });
}

if (savedCalculationList) renderSavedCalculations();

const saveCalculationButton = document.getElementById('save-calculation');
if (saveCalculationButton) {
  saveCalculationButton.addEventListener('click', function () {
    savedCalculationMessage.textContent = '';
    // Check both the successful result and the current fields, including edits
    // made without an input event. Stale estimates must not be saved.
    if (!currentCalculation || document.getElementById('calculation-results').hidden ||
        currentCalculation.amount !== Number(document.getElementById('loan-amount').value) ||
        currentCalculation.termMonths !== Number(document.getElementById('loan-term').value)) {
      savedCalculationMessage.textContent = 'Calculate again before saving this estimate.';
      return;
    }
    try {
      const records = readSavedCalculations();
      let nextId = Date.now();
      for (let i = 0; i < records.length; i++) {
        const number = Number(records[i].id.slice(4));
        if (number >= nextId) nextId = number + 1;
      }
      const record = {
        id: 'CALC' + nextId,
        amount: currentCalculation.amount,
        termMonths: currentCalculation.termMonths,
        annualRate: currentCalculation.annualRate,
        interest: currentCalculation.interest,
        total: currentCalculation.total,
        monthlyPayment: currentCalculation.monthlyPayment
      };
      records.push(record);
      localStorage.setItem(calculationStorageKey, JSON.stringify(records));
      renderSavedCalculations();
      savedCalculationMessage.textContent = 'Calculation saved.';
    } catch (error) {
      savedCalculationMessage.textContent = 'The calculation could not be saved. Check browser storage and try again. Existing entries have been kept.';
    }
  });
}
