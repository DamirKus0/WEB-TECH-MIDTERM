const calculationStorageKey = 'microloan.calculations.v1';
const savedCalculationList = document.getElementById('saved-calculation-list');
const savedCalculationEmpty = document.getElementById('saved-calculation-empty');
const savedCalculationMessage = document.getElementById('saved-calculation-message');

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
      savedCalculationList.append(item);
    }
  } catch (error) {
    savedCalculationMessage.textContent = 'Saved calculations could not be read. Browser storage may be unavailable or contain damaged entries.';
  }
}

if (savedCalculationList) renderSavedCalculations();
