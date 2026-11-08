"use strict";

function renderLoans(status) {
  const list = document.querySelector("#loans-list");
  list.replaceChildren();
  let visibleCount = 0;

  for (const loan of loans) {
    if (status !== "all" && loan.status !== status) {
      continue;
    }

    const column = document.createElement("div");
    column.className = "col-12 col-md-6 col-lg-4";
    const statusClass = loan.status === "approved" ? "text-success" : "status-pending";

    // Only fixed demo values from data.js are inserted into this template.
    column.innerHTML = `
      <article class="card h-100 p-3">
        <h3 class="card-title">Loan ID: ${loan.id}</h3>
        <p class="mb-1">Amount: <strong>${formatMoney(loan.amount)}</strong></p>
        <p class="mb-1">Status: <strong class="${statusClass}">${getStatusLabel(loan.status)}</strong></p>
        <p class="mb-3">Due Date: <strong>${loan.dueDate ? `<time datetime="${loan.dueDate}">${loan.dueDate}</time>` : "N/A"}</strong></p>
        ${loan.status === "approved"
          ? `<a class="btn btn-primary align-self-start" href="loan-details.html" aria-label="View details for loan ${loan.id}">View Details</a>`
          : `<button class="btn btn-primary align-self-start" type="button" disabled aria-describedby="note-${loan.id}">View Details</button>
             <p id="note-${loan.id}" class="small text-secondary mt-2 mb-0">Details are available after approval.</p>`}
      </article>`;

    list.append(column);
    visibleCount++;
  }

  document.querySelector("#loans-count").textContent = visibleCount === 0
    ? "No loans match this status."
    : `Showing ${visibleCount} of ${loans.length} loans.`;
}

document.querySelector("#loan-status").addEventListener("change", function (event) {
  renderLoans(event.target.value);
});

renderLoans("all");
