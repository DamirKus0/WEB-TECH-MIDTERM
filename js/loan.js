class Loan {
  constructor(amount, termMonths, annualRate) {
    // Keep validation and the calculation formula in the shared module.
    window.MicroLoan.calculateLoan(amount, termMonths, annualRate);
    this.amount = amount;
    this.termMonths = termMonths;
    this.annualRate = annualRate;
  }

  getInterest() {
    return window.MicroLoan.calculateLoan(this.amount, this.termMonths, this.annualRate).interest;
  }

  getTotal() {
    return window.MicroLoan.calculateLoan(this.amount, this.termMonths, this.annualRate).total;
  }

  getMonthlyPayment() {
    return window.MicroLoan.calculateLoan(this.amount, this.termMonths, this.annualRate).monthlyPayment;
  }
}
