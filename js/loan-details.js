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

$("#hide-paid").on("change", function (event) {
  renderPayments(event.target.checked);
});

// Keep terms readable without JavaScript; collapse them only after jQuery loads.
$(".terms-content").hide();
$("#terms-toggle").prop("hidden", false);
$.fx.off = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

$("#terms-toggle").on("click", function () {
  const button = $(this);
  const content = button.closest(".card").find(".terms-content");
  const isExpanded = button.attr("aria-expanded") === "true";

  // Finish the previous effect so rapid clicks do not queue animations.
  content.stop(true, true);
  if (isExpanded) {
    content.slideUp(150);
  } else {
    content.slideDown(150);
  }

  button.attr("aria-expanded", String(!isExpanded));
  button.text(isExpanded ? "Show terms" : "Hide terms");
});

renderPayments(false);
