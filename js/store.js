// Shared demo data and calculation. No server or real payments are used.
const loanStorageKey = 'microloan.loans.v1';

function calculateLoan(amount, termMonths, annualRate) {
  if (typeof amount !== 'number' || !(amount >= 100 && amount <= 5000)) {
    throw new Error('Amount must be from $100 to $5,000.');
  }
  if (typeof termMonths !== 'number' || !(termMonths >= 1 && termMonths <= 24 && termMonths % 1 === 0)) {
    throw new Error('Term must be a whole number from 1 to 24.');
  }
  if (typeof annualRate !== 'number' || !(annualRate >= 0 && annualRate <= 1)) {
    throw new Error('Invalid annual interest rate.');
  }
  const interest = amount * annualRate * termMonths / 12;
  const total = amount + interest;
  return { interest: interest, total: total, monthlyPayment: total / termMonths };
}

function getDemoLoans() {
  return [
    { id: 'ML001', firstName: 'Demo', lastName: 'User', email: 'demo@example.com', amount: 1000, termMonths: 12, annualRate: 0.05, purpose: 'personal', status: 'approved', createdAt: '2026-01-15T00:00:00.000Z', disbursedAt: '2026-01-15', dueDate: '2027-01-15' },
    { id: 'ML002', firstName: 'Demo', lastName: 'User', email: 'demo@example.com', amount: 500, termMonths: 6, annualRate: 0.05, purpose: 'education', status: 'pending', createdAt: '2026-01-16T00:00:00.000Z', disbursedAt: null, dueDate: null }
  ];
}

function getLoans() {
  const saved = localStorage.getItem(loanStorageKey);
  if (saved === null) return getDemoLoans();
  const records = JSON.parse(saved);
  if (!Array.isArray(records)) throw new Error('Saved loans are not a list.');
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    if (!record || typeof record.id !== 'string' || record.id === '' ||
        !(record.status === 'pending' || record.status === 'approved' || record.status === 'repaid')) {
      throw new Error('A saved loan has an invalid format.');
    }
    const idNumber = Number(record.id.slice(2));
    if (record.id.slice(0, 2) !== 'ML' || !(idNumber >= 1 && idNumber % 1 === 0)) {
      throw new Error('A saved loan has an invalid ID.');
    }
    calculateLoan(record.amount, record.termMonths, record.annualRate);
    for (let j = 0; j < i; j++) {
      if (records[j].id === record.id) throw new Error('Duplicate saved loan ID.');
    }
  }
  return records;
}

function getLoanById(id) {
  const records = getLoans();
  for (let i = 0; i < records.length; i++) {
    if (records[i].id === id) return records[i];
  }
  return null;
}

function addApplication(data) {
  calculateLoan(data.amount, data.termMonths, 0.05);
  if (typeof data.firstName !== 'string' || data.firstName.trim().length < 2 ||
      typeof data.lastName !== 'string' || data.lastName.trim().length < 2) {
    throw new Error('Enter a first name and last name.');
  }
  // Use the same browser email-format check as the application form.
  const emailField = document.createElement('input');
  emailField.type = 'email';
  emailField.value = typeof data.email === 'string' ? data.email.trim() : '';
  if (emailField.value === '' || emailField.validity.typeMismatch) throw new Error('Invalid email.');
  if (!(data.purpose === 'education' || data.purpose === 'business' || data.purpose === 'personal' || data.purpose === 'other')) {
    throw new Error('Choose a loan purpose.');
  }

  const records = getLoans();
  let nextNumber = 1;
  for (let i = 0; i < records.length; i++) {
    const number = Number(records[i].id.slice(2));
    if (number >= nextNumber) nextNumber = number + 1;
  }
  // Padding keeps IDs consistent with the original ML001 and ML002 examples.
  const record = {
    id: 'ML' + String(nextNumber).padStart(3, '0'),
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: emailField.value,
    amount: data.amount,
    termMonths: data.termMonths,
    annualRate: 0.05,
    purpose: data.purpose,
    status: 'pending',
    createdAt: new Date().toISOString(),
    disbursedAt: null,
    dueDate: null
  };
  records.push(record);
  // Return only after writing succeeds; errors are handled by the form.
  localStorage.setItem(loanStorageKey, JSON.stringify(records));
  return record;
}

window.MicroLoan = {
  calculateLoan: calculateLoan,
  getLoans: getLoans,
  getLoanById: getLoanById,
  addApplication: addApplication
};
