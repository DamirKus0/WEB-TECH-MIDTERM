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
    // Keep the HTML structure static; insert stored values as text.
    column.innerHTML = `
      <article class="card h-100 p-3">
        <h3 class="card-title"></h3>
        <p class="mb-1">Amount: <strong class="loan-amount"></strong></p>
        <p class="mb-1">Status: <strong class="loan-state"></strong></p>
        <p class="mb-3">Due Date: <strong class="loan-date"></strong></p>
        ${loan.status === "approved"
          ? `<a class="btn btn-primary align-self-start" href="loan-details.html" aria-label="View details for loan ${loan.id}">View Details</a>`
          : `<button class="btn btn-primary align-self-start" type="button" disabled aria-describedby="note-${loan.id}">View Details</button>
             <p id="note-${loan.id}" class="small text-secondary mt-2 mb-0">Details are available after approval.</p>`}
      </article>`;

    column.querySelector('h3').textContent = 'Loan ID: ' + loan.id;
    column.querySelector('.loan-amount').textContent = formatMoney(loan.amount);
    column.querySelector('.loan-state').textContent = getStatusLabel(loan.status);
    column.querySelector('.loan-state').className = 'loan-state ' + statusClass;
    column.querySelector('.loan-date').textContent = loan.dueDate || 'N/A';

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
}
