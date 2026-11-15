const comparedLoans = [];
const comparisonRows = document.getElementById('comparison-rows');
const comparisonTable = document.getElementById('comparison-table');
const comparisonEmpty = document.getElementById('comparison-empty');
const comparisonMessage = document.getElementById('comparison-message');
const addComparisonButton = document.getElementById('add-comparison');
const clearComparisonButton = document.getElementById('clear-comparison');

function renderComparison() {
  comparisonRows.replaceChildren();
  comparisonEmpty.hidden = comparedLoans.length > 0;
  comparisonTable.hidden = comparedLoans.length === 0;
  clearComparisonButton.disabled = comparedLoans.length === 0;

  comparedLoans.forEach(function (loan, index) {
    const row = document.createElement('tr');
    const values = [
      formatMoney(loan.amount),
      loan.termMonths + ' months',
      formatMoney(loan.getInterest()),
      formatMoney(loan.getTotal()),
      formatMoney(loan.getMonthlyPayment())
    ];

    values.forEach(function (value) {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.append(cell);
    });

    const actionCell = document.createElement('td');
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'btn btn-outline-danger btn-sm';
    removeButton.textContent = 'Remove';
    removeButton.setAttribute('aria-label', 'Remove option ' + (index + 1));
    removeButton.addEventListener('click', function () {
      comparedLoans.splice(index, 1);
      renderComparison();
      comparisonMessage.textContent = 'Option removed.';
      addComparisonButton.focus();
    });
    actionCell.append(removeButton);
    row.append(actionCell);
    comparisonRows.append(row);
  });
}

addComparisonButton.addEventListener('click', function () {
  comparisonMessage.textContent = '';
  if (comparedLoans.length === 3) {
    comparisonMessage.textContent = 'You can compare up to 3 options. Remove an option to add another.';
    return;
  }

  const amountField = document.getElementById('loan-amount');
  const termField = document.getElementById('loan-term');
  if (!validateLoanFields(amountField, termField)) {
    document.querySelector('#loan-calculator [aria-invalid="true"]').focus();
    return;
  }

  try {
    const loan = new Loan(Number(amountField.value), Number(termField.value), 0.05);
    comparedLoans.push(loan);
    renderComparison();
    comparisonMessage.textContent = comparedLoans.length === 3
      ? '3 options added. The comparison limit is reached. Remove an option to add another.'
      : 'Option added to comparison.';
  } catch (error) {
    comparisonMessage.textContent = 'The option could not be added. Check the amount and term and try again.';
  }
});

clearComparisonButton.addEventListener('click', function () {
  comparedLoans.length = 0;
  renderComparison();
  comparisonMessage.textContent = 'Comparison cleared.';
  addComparisonButton.focus();
});

renderComparison();
