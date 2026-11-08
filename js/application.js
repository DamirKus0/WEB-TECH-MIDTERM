const applicationForm = document.getElementById('application-form');

if (applicationForm) {
  const firstName = document.getElementById('first-name');
  const lastName = document.getElementById('last-name');
  const email = document.getElementById('email');
  const amount = document.getElementById('application-amount');
  const term = document.getElementById('application-term');
  const purpose = document.getElementById('purpose');
  const consent = document.getElementById('consent');
  const message = document.getElementById('application-message');
  const submitButton = document.getElementById('submit-application');
  const allowedPurposes = ['education', 'business', 'personal', 'other'];
  let submitted = false;
  let validationStarted = false;

  function validateApplication() {
    showFieldError(firstName, firstName.value.trim().length < 2 ? 'Enter a first name with at least 2 characters.' : '');
    showFieldError(lastName, lastName.value.trim().length < 2 ? 'Enter a last name with at least 2 characters.' : '');
    // type="email" checks the format; JavaScript displays our own error message.
    const validEmail = email.value.trim() !== '' && !email.validity.typeMismatch;
    showFieldError(email, validEmail ? '' : 'Enter a valid email address.');
    validateLoanFields(amount, term);
    let validPurpose = false;
    for (let i = 0; i < allowedPurposes.length; i++) {
      if (purpose.value === allowedPurposes[i]) validPurpose = true;
    }
    showFieldError(purpose, validPurpose ? '' : 'Choose a loan purpose.');
    showFieldError(consent, consent.checked ? '' : 'Confirm that you agree to the demonstration terms.');
    return applicationForm.querySelector('[aria-invalid="true"]') === null;
  }

  // URLSearchParams reads amount and term from the calculator link.
  // The same range checks are used here and in the calculator.
  const parameters = new URLSearchParams(window.location.search);
  const urlAmount = parameters.get('amount');
  const urlTerm = parameters.get('term');
  if (urlAmount !== null) {
    if (isValidAmount(urlAmount)) {
      amount.value = Number(urlAmount);
    } else {
      showFieldError(amount, 'The amount in the link is invalid. Enter $100 to $5,000.');
    }
  }
  if (urlTerm !== null) {
    if (isValidTerm(urlTerm)) {
      term.value = Number(urlTerm);
    } else {
      showFieldError(term, 'The term in the link is invalid. Enter 1 to 24 whole months.');
    }
  }
  validationStarted = applicationForm.querySelector('[aria-invalid="true"]') !== null;

  function updateValidation() {
    if (submitted) return;
    if (validationStarted) validateApplication();
    message.textContent = '';
    message.className = '';
  }

  applicationForm.addEventListener('input', updateValidation);
  applicationForm.addEventListener('change', updateValidation);
  applicationForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (submitted) return;
    validationStarted = true;
    if (!validateApplication()) {
      applicationForm.querySelector('[aria-invalid="true"]').focus();
      return;
    }

    if (!window.MicroLoan || typeof window.MicroLoan.addApplication !== 'function') {
      message.className = 'alert alert-warning mt-3';
      message.textContent = 'Saving is unavailable until the data module is connected. Your entries have been kept.';
      return;
    }

    const data = {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: email.value.trim(),
      amount: Number(amount.value),
      termMonths: Number(term.value),
      annualRate: 0.05,
      purpose: purpose.value,
      status: 'pending',
      createdAt: new Date().toISOString(),
      disbursedAt: null
    };

    try {
      const saved = window.MicroLoan.addApplication(data);
      // Only the data module can confirm saving and provide the unique ID.
      submitted = true;
      submitButton.disabled = true;
      const fields = applicationForm.querySelectorAll('input, select');
      for (let i = 0; i < fields.length; i++) {
        fields[i].disabled = true;
      }
      message.className = 'alert alert-success mt-3';
      message.textContent = 'Demo application ' + saved.id + ' saved successfully. Status: pending.';
      document.getElementById('application-next').hidden = false;
    } catch (error) {
      message.className = 'alert alert-danger mt-3';
      message.textContent = 'Your application could not be saved. Your entries have been kept. Please try again.';
    }
  });
}
