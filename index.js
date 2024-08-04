async function getExchangeRates(baseCurrency = 'USD') {
    const apiKey = 'b046d6f0fee4f4bf7298256a';
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.conversion_rates;
    } catch (error) {
        console.error('Error:', error);
    }
}

function populateCurrencyDropdowns(rates) {
    let fromCurrencySelect = document.getElementById('from_currency');
    let toCurrencySelect = document.getElementById('to_currency');
    
    fromCurrencySelect.innerHTML = ''; // Clear existing options
    toCurrencySelect.innerHTML = ''; // Clear existing options

    // Add a default "Select a currency" option
    const defaultOption = '<option value="">Select a currency</option>';
    fromCurrencySelect.innerHTML += defaultOption;
    toCurrencySelect.innerHTML += defaultOption;

    for (const [currencyCode] of Object.entries(rates)) {
        const option = document.createElement('option');
        option.value = currencyCode;
        option.textContent = currencyCode;
        fromCurrencySelect.appendChild(option);
        toCurrencySelect.appendChild(option.cloneNode(true)); // Clone for the second dropdown
    }
}

function convert_currency(amount, from_currency, to_currency, rates) {
    if (from_currency === to_currency) {
        return amount;
    }

    if (from_currency !== 'USD') {
        amount = amount / rates[from_currency];
    }

    return amount * rates[to_currency];
}

async function main() {
    const rates = await getExchangeRates();

    if (rates) {
        populateCurrencyDropdowns(rates);

        document.getElementById("reverse").addEventListener("click", function(){
            const fromCurrencySelect = document.getElementById('from_currency');
            const toCurrencySelect = document.getElementById('to_currency');
            
            const holder = fromCurrencySelect.value;
            fromCurrencySelect.value = toCurrencySelect.value;
            toCurrencySelect.value = holder;
        });

        document.getElementById('converter_form').addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent form from submitting and refreshing the page

            const amount = parseFloat(document.getElementById('amount').value);
            const from_currency = document.getElementById('from_currency').value.toUpperCase();
            const to_currency = document.getElementById('to_currency').value.toUpperCase();

            const conversionResultDiv = document.getElementById('conversion_result');

            if (from_currency && to_currency && from_currency in rates && to_currency in rates) {
                const converted_amount = convert_currency(amount, from_currency, to_currency, rates);
                conversionResultDiv.innerHTML = `${amount} ${from_currency} is equal to ${converted_amount.toFixed(2)} ${to_currency}`;
            } else {
                conversionResultDiv.innerHTML = 'Invalid currency code or selection';
            }
    });
    }
}

main();
