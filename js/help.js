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
    list.find('.faq-item').remove();
    let count = 0;
    const searchText = query.trim().toLowerCase();

    for (let i = 0; i < faqItems.length; i++) {
      const item = faqItems[i];
      const fullText = (item.question + ' ' + item.answer).toLowerCase();
      if (fullText.indexOf(searchText) === -1) continue;
      count += 1;

      const article = $('<article class="card faq-item"></article>');
      const heading = $('<h2 class="mb-0 fs-6"></h2>');
      const button = $('<button type="button" class="faq-question"></button>');
      button.attr('id', 'faq-question-' + i);
      button.attr('aria-expanded', 'false');
      button.attr('aria-controls', 'faq-answer-' + i);
      button.text(item.question);
      button.append('<span class="faq-symbol" aria-hidden="true">+</span>');

      const answer = $('<div class="faq-answer"></div>');
      answer.attr('id', 'faq-answer-' + i);
      answer.attr('aria-labelledby', 'faq-question-' + i);
      answer.hide();
      const paragraph = $('<p></p>');
      paragraph.text(item.answer);
      answer.append(paragraph);
      heading.append(button);
      article.append(heading);
      article.append(answer);
      list.append(article);
    }

    if (count === 0) $('#faq-empty').show();
    else $('#faq-empty').hide();
    $('#faq-count').text(count + (count === 1 ? ' question found' : ' questions found'));
    $('.faq-question').on('click', toggleAnswer);
  }

  function toggleAnswer() {
    const button = $(this);
    const answer = button.closest('.faq-item').find('.faq-answer');
    const isOpen = button.attr('aria-expanded') === 'true';
    answer.stop(true, true);
    if (isOpen) {
      button.attr('aria-expanded', 'false');
      button.find('.faq-symbol').text('+');
      answer.slideUp(150);
    } else {
      button.attr('aria-expanded', 'true');
      button.find('.faq-symbol').text('−');
      answer.slideDown(150);
    }
  }

  search.on('input', function () { renderFaq(this.value); });
  $('#clear-faq').on('click', function () {
    document.getElementById('faq-search').value = '';
    renderFaq('');
    document.getElementById('faq-search').focus();
  });

  $('#faq-status').text('');
  renderFaq('');
}
