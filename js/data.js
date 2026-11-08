let loans = [];
let loanLoadError = '';
try {
  loans = window.MicroLoan.getLoans();
} catch (error) {
  loanLoadError = 'Saved loans could not be loaded. Browser storage may be unavailable or contain invalid data.';
}

const payments = [
  { number: 1, dueDate: "2026-02-15", amount: 87.50, status: "paid" },
  { number: 2, dueDate: "2026-03-15", amount: 87.50, status: "paid" },
  { number: 3, dueDate: "2026-04-15", amount: 87.50, status: "overdue" },
  { number: 4, dueDate: "2026-05-15", amount: 87.50, status: "upcoming" }
];

function formatMoney(amount) {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function getStatusLabel(status) {
  const labels = {
    approved: "Approved",
    pending: "Pending",
    repaid: "Repaid",
    paid: "Paid",
    overdue: "Overdue",
    upcoming: "Upcoming"
  };

  return labels[status];
}
