"use strict";

function renderPayments(hidePaid) {
  const tableBody = document.querySelector("#payments-list");
  const statusClasses = {
    paid: "text-success",
    overdue: "text-danger",
    upcoming: "status-pending"
  };
  tableBody.replaceChildren();
  let visibleCount = 0;

  payments.forEach(function (payment) {
    if (hidePaid && payment.status === "paid") {
      return;
    }

    const row = document.createElement("tr");
    row.innerHTML = `
      <th scope="row" class="fw-normal">${payment.number}</th>
      <td><time datetime="${payment.dueDate}">${payment.dueDate}</time></td>
      <td>${formatMoney(payment.amount)}</td>
      <td class="${statusClasses[payment.status]}">${getStatusLabel(payment.status)}</td>`;
    tableBody.append(row);
    visibleCount++;
  });

  document.querySelector("#payments-count").textContent =
    `Showing ${visibleCount} of ${payments.length} sample payments.`;
}

document.querySelector("#hide-paid").addEventListener("change", function (event) {
  renderPayments(event.target.checked);
});

renderPayments(false);
