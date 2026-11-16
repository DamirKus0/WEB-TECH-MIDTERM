const currencyForm = document.getElementById('currency-form');

if (currencyForm) {
  const currencyAmount = document.getElementById('currency-amount');
  const currencyButton = document.getElementById('convert-currency');
  const currencyMessage = document.getElementById('currency-message');
  const currencyResult = document.getElementById('currency-result');

  currencyForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (currencyButton.disabled) return;
    currencyResult.replaceChildren();
    currencyMessage.textContent = '';
    const amount = Number(currencyAmount.value);
    if (!(amount >= 0.01 && amount < Infinity)) {
      showFieldError(currencyAmount, 'Enter a USD amount of at least $0.01.');
      currencyAmount.focus();
      return;
    }

    showFieldError(currencyAmount, '');
    currencyButton.disabled = true;
    currencyAmount.readOnly = true;
    currencyForm.setAttribute('aria-busy', 'true');
    currencyMessage.textContent = 'Loading exchange rate…';
    const controller = new AbortController();
    const timeout = setTimeout(function () { controller.abort(); }, 12000);
    try {
      const response = await fetch('https://api.frankfurter.dev/v2/rate/USD/KZT', {
        signal: controller.signal
      });
      if (!response.ok) throw new Error('Exchange rate request failed.');
      const data = await response.json();
      if (!data || data.rate === undefined || data.rate === null) {
        currencyMessage.textContent = 'The API returned no USD/KZT rate. Press Convert to try again.';
        return;
      }
      if (data.base !== 'USD' || data.quote !== 'KZT' ||
          typeof data.rate !== 'number' || !(data.rate > 0 && data.rate < Infinity)) {
        throw new Error('Invalid exchange rate.');
      }
      const converted = amount * data.rate;
      if (!(converted > 0 && converted < Infinity)) throw new Error('Invalid conversion result.');

      const conversion = document.createElement('p');
      conversion.className = 'fw-bold mb-2';
      conversion.textContent = amount.toFixed(2) + ' USD = ' + converted.toFixed(2) + ' KZT';
      const rate = document.createElement('p');
      rate.className = 'mb-1';
      rate.textContent = 'Rate: 1 USD = ' + data.rate + ' KZT';
      currencyResult.append(conversion, rate);
      if (typeof data.date === 'string' && data.date !== '') {
        const date = document.createElement('p');
        date.className = 'small mb-0';
        date.textContent = 'Rate date: ' + data.date;
        currencyResult.append(date);
      }
      currencyMessage.textContent = '';
    } catch (error) {
      currencyMessage.textContent = 'The exchange rate could not be loaded. Check your connection and press Convert to retry.';
    } finally {
      clearTimeout(timeout);
      currencyButton.disabled = false;
      currencyAmount.readOnly = false;
      currencyForm.setAttribute('aria-busy', 'false');
    }
  });

  currencyAmount.addEventListener('input', function () {
    currencyResult.replaceChildren();
    currencyMessage.textContent = '';
    showFieldError(currencyAmount, '');
  });
}
