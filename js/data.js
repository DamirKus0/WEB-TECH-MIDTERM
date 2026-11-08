"use strict";

// Fixed sample data for the educational demo.
const loans = [
  { id: "ML001", amount: 1000, status: "approved", dueDate: "2027-01-15" },
  { id: "ML002", amount: 500, status: "pending", dueDate: null }
];

function formatMoney(amount) {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function getStatusLabel(status) {
  const labels = {
    approved: "Approved",
    pending: "Pending",
    paid: "Paid",
    overdue: "Overdue",
    upcoming: "Upcoming"
  };

  return labels[status];
}
