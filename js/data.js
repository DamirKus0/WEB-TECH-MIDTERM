"use strict";

// Fixed sample data for the educational demo.
const loans = [
  { id: "ML001", amount: 1000, status: "approved", dueDate: "2027-01-15" },
  { id: "ML002", amount: 500, status: "pending", dueDate: null }
];

// First four payments of the existing sample loan ML001.
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
    paid: "Paid",
    overdue: "Overdue",
    upcoming: "Upcoming"
  };

  return labels[status];
}
