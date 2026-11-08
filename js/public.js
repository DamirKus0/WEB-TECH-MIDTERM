// Shared field helpers are also used by application.js.
function showFieldError(field, message) {
  const error = document.getElementById(field.id + '-error');
  field.classList.toggle('is-invalid', message !== '');
  field.setAttribute('aria-invalid', message ? 'true' : 'false');
  if (error) error.textContent = message;
}

function validateLoanFields(amountField, termField) {
  const amount = Number(amountField.value);
  const term = Number(termField.value);
  const amountError = !Number.isFinite(amount) || amount < 100 || amount > 5000
    ? 'Enter an amount from $100 to $5,000.' : '';
  const termError = !Number.isInteger(term) || term < 1 || term > 24
    ? 'Enter a whole number of months from 1 to 24.' : '';
  showFieldError(amountField, amountError);
  showFieldError(termField, termError);
  return !amountError && !termError;
}

function formatMoney(amount) {
  return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

const calculatorForm = document.getElementById('loan-calculator');

if (calculatorForm) {
  const amountField = document.getElementById('loan-amount');
  const termField = document.getElementById('loan-term');
  const results = document.getElementById('calculation-results');
  const applyLink = document.getElementById('calculator-apply');
  const message = document.getElementById('calculator-message');

  function clearCalculation() {
    results.hidden = true;
    applyLink.hidden = true;
    applyLink.removeAttribute('href');
    message.textContent = '';
  }

  function updateCalculation() {
    clearCalculation();
    if (!validateLoanFields(amountField, termField)) return;
    if (!window.MicroLoan || typeof window.MicroLoan.calculateLoan !== 'function') {
      message.textContent = 'The calculator is unavailable. Please try again when the data module is connected.';
      return;
    }

    try {
      // The formula belongs only to store.js; do not repeat it here.
      const amount = Number(amountField.value);
      const term = Number(termField.value);
      const loan = window.MicroLoan.calculateLoan(amount, term, 0.05);
      if (![loan.interest, loan.total, loan.monthlyPayment].every(function (value) {
        return Number.isFinite(value) && value >= 0;
      })) throw new Error('Invalid calculation result');

      document.getElementById('loan-interest').textContent = formatMoney(loan.interest);
      document.getElementById('loan-total').textContent = formatMoney(loan.total);
      document.getElementById('monthly-payment').textContent = formatMoney(loan.monthlyPayment);
      applyLink.href = 'apply.html?amount=' + amount + '&term=' + term;
      results.hidden = false;
      applyLink.hidden = false;
    } catch (error) {
      message.textContent = 'The payment could not be calculated. Check the amount and term and try again.';
    }
  }

  calculatorForm.addEventListener('submit', function (event) {
    event.preventDefault();
    updateCalculation();
    const invalid = calculatorForm.querySelector('[aria-invalid="true"]');
    if (invalid) invalid.focus();
  });

  calculatorForm.addEventListener('input', function () {
    clearCalculation();
    validateLoanFields(amountField, termField);
  });

  updateCalculation();
}
