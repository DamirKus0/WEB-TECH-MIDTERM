const loanStatusFilter = document.getElementById('loan-status');
const loanActionMessage = document.getElementById('loan-action-message');
const loanEditor = document.getElementById('loan-editor');
const editForm = document.getElementById('edit-application');
const editAmount = document.getElementById('edit-amount');
const editTerm = document.getElementById('edit-term');
const editPurpose = document.getElementById('edit-purpose');
const purposeLabels = {
  education: 'Education',
  business: 'Business',
  personal: 'Personal',
  other: 'Other'
};
let editingLoanId = null;

function renderLoans(status) {
  const list = document.querySelector("#loans-list");
  list.replaceChildren();
  let visibleCount = 0;

  if (loanLoadError) {
    document.querySelector('#loans-count').textContent = loanLoadError;
    return;
  }

  for (const loan of loans) {
    if (status !== "all" && loan.status !== status) {
      continue;
    }
    const column = document.createElement("div");
    column.className = "col-12 col-md-6 col-lg-4";
    const statusClass = loan.status === "pending" ? "status-pending" : "text-success";
    column.innerHTML = `
      <article class="card h-100 p-3">
        <h3 class="card-title"></h3>
        <p class="mb-1">Amount: <strong class="loan-amount"></strong></p>
        <p class="mb-1">Term: <strong class="loan-term"></strong></p>
        <p class="mb-1">Purpose: <strong class="loan-purpose"></strong></p>
        <p class="mb-1">Status: <strong class="loan-state"></strong></p>
        <p class="mb-3">Due Date: <strong class="loan-date"></strong></p>
        <div class="loan-actions d-flex flex-wrap gap-2"></div>
      </article>`;

    column.querySelector('h3').textContent = 'Loan ID: ' + loan.id;
    column.querySelector('.loan-amount').textContent = formatMoney(loan.amount);
    column.querySelector('.loan-term').textContent = loan.termMonths + ' months';
    column.querySelector('.loan-purpose').textContent = purposeLabels[loan.purpose] || 'Not specified';
    column.querySelector('.loan-state').textContent = getStatusLabel(loan.status);
    column.querySelector('.loan-state').className = 'loan-state ' + statusClass;
    column.querySelector('.loan-date').textContent = loan.dueDate || 'N/A';

    const actions = column.querySelector('.loan-actions');
    if (loan.status === 'pending') {
      const editButton = document.createElement('button');
      editButton.type = 'button';
      editButton.className = 'btn btn-outline-primary';
      editButton.textContent = 'Edit';
      editButton.setAttribute('aria-label', 'Edit application ' + loan.id);
      editButton.setAttribute('aria-controls', 'loan-editor');
      editButton.addEventListener('click', function () { startEditing(loan.id); });

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'btn btn-outline-danger';
      deleteButton.textContent = 'Delete';
      deleteButton.setAttribute('aria-label', 'Delete application ' + loan.id);
      deleteButton.addEventListener('click', function () { removeApplication(loan.id); });
      actions.append(editButton, deleteButton);
    } else if (loan.status === 'approved') {
      const detailsLink = document.createElement('a');
      detailsLink.className = 'btn btn-primary';
      detailsLink.href = 'loan-details.html';
      detailsLink.textContent = 'View Details';
      detailsLink.setAttribute('aria-label', 'View details for loan ' + loan.id);
      actions.append(detailsLink);
    }

    list.append(column);
    visibleCount++;
  }

  document.querySelector("#loans-count").textContent = visibleCount === 0
    ? (loans.length === 0 ? "No loan applications yet." : "No loans match this status.")
    : `Showing ${visibleCount} of ${loans.length} loans.`;
}

function renderLatestApplication() {
  const latestStatus = document.querySelector('#latest-application-status');
  const latestLink = document.querySelector('#latest-application-link');
  if (loanLoadError || loans.length === 0) {
    latestStatus.textContent = loanLoadError ? 'Unavailable' : 'No applications';
    latestStatus.className = '';
    latestLink.hidden = true;
  } else {
    const latest = loans[loans.length - 1];
    latestStatus.textContent = getStatusLabel(latest.status);
    latestStatus.className = latest.status === 'pending' ? 'status-pending' : 'text-success';
    latestLink.href = latest.status === 'approved' ? 'loan-details.html' : '#loans-list';
    latestLink.textContent = 'View ' + latest.id;
    latestLink.hidden = false;
  }
}

function refreshDashboard() {
  // Read again after saving so cards, the counter and the latest application agree.
  loans = window.MicroLoan.getLoans();
  loanLoadError = '';
  renderLoans(loanStatusFilter.value);
  renderLatestApplication();
}

function showLoanMessage(message, isError) {
  loanActionMessage.textContent = message;
  loanActionMessage.className = 'mt-3 mb-0 ' + (isError ? 'text-danger' : 'text-success');
}

function startEditing(id) {
  try {
    const loan = window.MicroLoan.getLoanById(id);
    if (!loan || loan.status !== 'pending') {
      showLoanMessage('This application is no longer pending or has been removed. Reload the page to see current loans.', true);
      return;
    }
    editingLoanId = id;
    editAmount.value = loan.amount;
    editTerm.value = loan.termMonths;
    editPurpose.value = loan.purpose;
    showFieldError(editAmount, '');
    showFieldError(editTerm, '');
    showFieldError(editPurpose, '');
    document.getElementById('edit-loan-id').textContent = id;
    loanActionMessage.textContent = '';
    loanEditor.hidden = false;
    editAmount.focus();
  } catch (error) {
    showLoanMessage('The application could not be loaded. Browser storage may be unavailable or contain invalid data. Your entries have been kept.', true);
  }
}

function closeEditor() {
  loanEditor.hidden = true;
  editingLoanId = null;
  loanStatusFilter.focus();
}

editForm.addEventListener('submit', function (event) {
  event.preventDefault();
  loanActionMessage.textContent = '';
  const validFields = validateLoanFields(editAmount, editTerm);
  const validPurpose = ['education', 'business', 'personal', 'other'].includes(editPurpose.value);
  showFieldError(editPurpose, validPurpose ? '' : 'Choose a loan purpose.');
  if (!validFields || !validPurpose) {
    editForm.querySelector('[aria-invalid="true"]').focus();
    return;
  }

  try {
    window.MicroLoan.updateApplication(editingLoanId, {
      amount: Number(editAmount.value),
      termMonths: Number(editTerm.value),
      purpose: editPurpose.value
    });
    refreshDashboard();
    closeEditor();
    showLoanMessage('Application updated successfully.', false);
  } catch (error) {
    showLoanMessage('The application could not be updated. Check browser storage and that the application is still pending, then try again. Your entries have been kept.', true);
  }
});

document.getElementById('cancel-edit').addEventListener('click', function () {
  closeEditor();
  showLoanMessage('Editing canceled. No changes saved.', false);
});

function removeApplication(id) {
  loanActionMessage.textContent = '';
  if (!window.confirm('Delete application ' + id + '? This cannot be undone.')) return;

  try {
    window.MicroLoan.deleteApplication(id);
    refreshDashboard();
    if (editingLoanId === id) closeEditor();
    loanStatusFilter.focus();
    showLoanMessage('Application deleted successfully.', false);
  } catch (error) {
    showLoanMessage('The application could not be deleted. Check browser storage and that the application is still pending, then try again.', true);
  }
}

loanStatusFilter.addEventListener('change', function (event) {
  renderLoans(event.target.value);
});

renderLoans(loanStatusFilter.value);
renderLatestApplication();
