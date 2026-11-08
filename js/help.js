const faqItems = [
  { question: 'How do I apply for a loan?', answer: 'Open Apply for Loan, enter demonstration details, choose an amount and term, and submit the form. A successful submission shows your application ID.' },
  { question: 'What loan amounts and terms are available?', answer: 'The demo accepts $100 to $5,000 for a whole number of months from 1 to 24.' },
  { question: 'How is the monthly payment calculated?', answer: 'We use 5% annual simple interest. Interest equals the amount times 0.05 times the number of months divided by 12. The total is divided by the term. For $1,000 over 12 months, the payment is $87.50.' },
  { question: 'What does pending mean?', answer: 'Pending means that the demonstration application is waiting for a decision. It does not have a confirmed repayment schedule.' },
  { question: 'Where can I see the repayment schedule?', answer: 'Open My Loans, select an approved loan, and open its details. The details page contains the repayment schedule.' },
  { question: 'Where are my demonstration details stored?', answer: 'Applications and your profile are stored in localStorage in this browser after the data module is connected. Clearing browser storage removes the saved data. Use fictional information only.' },
  { question: 'Are applications and payments real?', answer: 'No. This is a student project. It does not issue loans, process payments, send emails, or connect to a bank.' }
];

if (window.jQuery && document.getElementById('faq-list')) {
  const $ = window.jQuery;
  const search = $('#faq-search');
  const list = $('#faq-list');

  function renderFaq(query) {
    list.empty();
    let count = 0;
    const searchText = query.trim().toLowerCase();

    faqItems.forEach(function (item, index) {
      if (!(item.question + ' ' + item.answer).toLowerCase().includes(searchText)) return;
      count += 1;
      const article = document.createElement('article');
      article.className = 'card faq-item';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'faq-question';
      button.id = 'faq-question-' + index;
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', 'faq-answer-' + index);
      const title = document.createElement('span');
      title.textContent = item.question;
      const icon = document.createElement('span');
      icon.className = 'faq-symbol';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = '+';
      button.append(title, icon);
      const heading = document.createElement('h2');
      heading.className = 'mb-0 fs-6';
      heading.append(button);
      const answer = document.createElement('div');
      answer.className = 'faq-answer';
      answer.id = 'faq-answer-' + index;
      answer.setAttribute('aria-labelledby', button.id);
      answer.style.display = 'none';
      const paragraph = document.createElement('p');
      paragraph.textContent = item.answer;
      answer.append(paragraph);
      article.append(heading, answer);
      list.append(article);
    });

    $('#faq-empty').prop('hidden', count !== 0);
    $('#faq-count').text(count + (count === 1 ? ' question found' : ' questions found'));
  }

  list.on('click', '.faq-question', function () {
    const button = $(this);
    const answer = button.closest('.faq-item').find('.faq-answer');
    const isOpen = button.attr('aria-expanded') === 'true';
    button.attr('aria-expanded', String(!isOpen));
    button.find('.faq-symbol').text(isOpen ? '+' : '−');
    // Finish the previous effect to avoid queues after quick clicks.
    answer.stop(true, true);
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 150;
    if (isOpen) answer.slideUp(duration);
    else answer.slideDown(duration);
  });

  search.on('input', function () { renderFaq(this.value); });
  $('#clear-faq').on('click', function () {
    search.val('');
    renderFaq('');
    search.trigger('focus');
  });

  $('#faq-status').text('');
  renderFaq('');
}
