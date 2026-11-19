# Micro-Loan Platform

A browser-based micro-loan demo created for a Web Technologies final project.
 
## Features

- Loan calculator for amounts from $100 to $5,000 and terms from 1 to 24 whole months, using 5% annual simple interest.
- Saved calculations: keep estimates in browser storage, remove individual entries, or clear the list.
- USD-to-KZT converter using the Frankfurter API, with loading, error, and retry feedback. Loan amounts and repayments remain in USD.
- Loan application form with HTML and JavaScript validation, calculator values passed into the form, and confirmation with an application ID.
- Borrower dashboard with demo loans, application statuses, and payment information.
- Editing and deleting pending applications; approved and repaid loans cannot be edited or deleted.
- Comparison of up to three loan options, including interest, total repayment, and monthly payment. Comparison options last until the page is reloaded.
- Loan details and repayment schedules for approved loans.
- Searchable FAQ with expandable answers.
- Light and dark themes with a saved preference, plus responsive navigation.

## Getting Started

No package installation or build step is required. Open `index.html` in a modern browser with JavaScript enabled.

For consistent browser storage behavior, serve the project locally. If Python 3 is installed, run this command from the project directory:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

An internet connection is required for CDN assets (Bootstrap, Bootstrap Icons, and jQuery) and exchange-rate requests. The project has no backend or database server.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home page, calculator, saved estimates, and currency converter |
| `apply.html` | Loan application form |
| `success.html` | Submission confirmation |
| `loans.html` | Borrower dashboard, pending application management, and loan comparison |
| `loan-details.html` | Loan details and repayment schedule |
| `help.html` | Searchable FAQ |

## Project Structure

- `css/common.css` — Shared styles.
- `css/public.css` — Home, application, and help page styles.
- `css/navbar.css` — Responsive navigation.
- `css/theme.css` — Dark theme styles.
- `css/style.css` — Confirmation page styles.
- `css2/style2.css` — Dashboard and loan details styles.
- `js/store.js` — Loan validation, calculations, and application storage.
- `js/public.js` — Calculator and shared form helpers.
- `js/application.js` — Application submission and confirmation data.
- `js/data.js` — Loan loading, sample payments, and formatting helpers.
- `js/dashboard.js` — Dashboard rendering and pending application editing/deletion.
- `js/loan-details.js` — Loan details and repayment schedule rendering.
- `js/loan.js` and `js/comparison.js` — Loan class and comparison table.
- `js/currency.js` — USD-to-KZT API requests.
- `js/saved-calculations.js` — Saved estimate management.
- `js/theme.js` — Theme selection and persistence.
- `js/help.js` — FAQ search and accordion behavior using jQuery.

## Calculations and Storage

The calculator uses simple interest:

```text
interest = amount × annualRate × termMonths / 12
repaymentTotal = amount + interest
monthlyPayment = repaymentTotal / termMonths
```

For example, $1,000 over 12 months at 5% annual interest produces $50 interest, a $1,050 total, and an $87.50 monthly payment.

Data is stored in `localStorage` for the current browser and origin:

| Key | Contents |
| --- | --- |
| `microloan.loans.v1` | Submitted applications and saved loan records |
| `microloan.calculations.v1` | Saved calculator estimates |
| `microloan.theme.v1` | Light or dark theme preference |

When no saved loan records exist, the dashboard starts with two demo loans. Clearing the relevant storage entries resets saved data. Different browsers or local server addresses do not share this storage.

## Demo Scope

This is a student demonstration. It does not issue loans, process payments, send emails, or connect to a bank. Payment records are sample data. Use fictional personal details in applications; submitted details are saved in browser storage.
