// Shared field helpers are also used by application.js.
function showFieldError(field, message) {
  const error = document.getElementById(field.id + '-error');
  field.setAttribute('aria-invalid', message ? 'true' : 'false');
  if (error) error.textContent = message;
}

function validateLoanFields(amountField, termField) {
  let amountError = '';
  let termError = '';
  if (!isValidAmount(amountField.value)) {
    amountError = 'Enter an amount from $100 to $5,000.';
  }
  if (!isValidTerm(termField.value)) {
    termError = 'Enter a whole number of months from 1 to 24.';
  }
  showFieldError(amountField, amountError);
  showFieldError(termField, termError);
  return !amountError && !termError;
}

function isValidAmount(value) {
  const amount = Number(value);
  return amount >= 100 && amount <= 5000;
}

function isValidTerm(value) {
  const term = Number(value);
  // A whole number has no remainder after division by 1.
  return term >= 1 && term <= 24 && term % 1 === 0;
}

function formatPaymentAmount(amount) {
  return '$' + amount.toFixed(2);
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
      const values = [loan.interest, loan.total, loan.monthlyPayment];
      for (let i = 0; i < values.length; i++) {
        if (!(values[i] >= 0 && values[i] < Infinity)) {
          message.textContent = 'The calculator returned an invalid result. Please try again.';
          return;
        }
      }

      document.getElementById('loan-interest').textContent = formatPaymentAmount(loan.interest);
      document.getElementById('loan-total').textContent = formatPaymentAmount(loan.total);
      document.getElementById('monthly-payment').textContent = formatPaymentAmount(loan.monthlyPayment);
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
