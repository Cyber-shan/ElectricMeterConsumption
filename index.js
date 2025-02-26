document.addEventListener('DOMContentLoaded', function() {
    const meterInput = document.getElementById('meter');
    const prevReadInput = document.getElementById('prevRead');
    const currReadInput = document.getElementById('currRead');
    const costInput = document.getElementById('cost');
    const form = document.querySelector('form');
  
    // Create error message elements if they don't exist already
    let meterError = document.getElementById('meter-error');
    if (!meterError) {
      meterError = document.createElement('span');
      meterError.id = 'meter-error';
      meterError.className = 'error-message';
      meterInput.insertAdjacentElement('afterend', meterError);
    }
  
    let prevReadError = document.getElementById('prevRead-error');
    if (!prevReadError) {
      prevReadError = document.createElement('span');
      prevReadError.id = 'prevRead-error';
      prevReadError.className = 'error-message';
      prevReadInput.insertAdjacentElement('afterend', prevReadError);
    }
  
    let currReadError = document.getElementById('currRead-error');
    if (!currReadError) {
      currReadError = document.createElement('span');
      currReadError.id = 'currRead-error';
      currReadError.className = 'error-message';
      currReadInput.insertAdjacentElement('afterend', currReadError);
    }
  
    let costError = document.getElementById('cost-error');
    if (!costError) {
      costError = document.createElement('span');
      costError.id = 'cost-error';
      costError.className = 'error-message';
      costInput.insertAdjacentElement('afterend', costError);
    }
  
    // Apply consistent styling to error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
      error.style.color = '#ff0000';
      error.style.fontSize = '14px';
      error.style.display = 'none';
      error.style.textAlign = 'left';
      error.style.width = '100%';
    });
  
    // Function to validate meter number
    function validateMeter() {
      const meterValue = meterInput.value.trim();
      const meterPattern = /^[A-Za-z]{4}\d{4}$/;
      
      if (!meterPattern.test(meterValue)) {
        meterError.textContent = "Meter number must be 8 characters: 4 letters followed by 4 numbers (e.g. ABCD1234)";
        meterError.style.display = 'block';
        meterInput.style.border = '2px solid #ff0000';
        return false;
      } else {
        meterError.textContent = "";
        meterError.style.display = 'none';
        meterInput.style.border = 'none';
        return true;
      }
    }
  
    // Function to validate Previous Meter Reading
    function validatePrevRead() {
      const prevReadValue = prevReadInput.value.trim();
      const prevReadPattern = /^\d{1,5}(\.\d+)?$/; // 1-5 digits with optional decimal
    
      if (!prevReadPattern.test(prevReadValue)) {
        prevReadError.textContent = "Previous reading must be 1-5 digits and can include decimals.";
        prevReadError.style.display = 'block';
        prevReadInput.style.border = '2px solid #ff0000';
        return false;
      } else {
        prevReadError.textContent = "";
        prevReadError.style.display = 'none';
        prevReadInput.style.border = 'none';
        return true;
      }
    }
  
    // Function to validate Current Meter Reading
    function validateCurrRead() {
      const currReadValue = currReadInput.value.trim();
      const currReadPattern = /^\d{1,5}(\.\d+)?$/; // 1-5 digits with optional decimal
      
      if (!currReadPattern.test(currReadValue)) {
        currReadError.textContent = "Current reading must be 1-5 digits and can include decimals.";
        currReadError.style.display = 'block';
        currReadInput.style.border = '2px solid #ff0000';
        return false;
      } else if (parseFloat(currReadValue) < parseFloat(prevReadInput.value.trim())) {
        currReadError.textContent = "Current reading must be greater than or equal to previous reading.";
        currReadError.style.display = 'block';
        currReadInput.style.border = '2px solid #ff0000';
        return false;
      } else {
        currReadError.textContent = "";
        currReadError.style.display = 'none';
        currReadInput.style.border = 'none';
        return true;
      }
    }

    // Function to validate Cost per kWh
    function validateCost() {
      const costValue = costInput.value.trim();
  
      if (costValue === "" || isNaN(costValue) || parseFloat(costValue) <= 0) {
        costError.textContent = "Cost per kWh must be a number greater than 0.";
        costError.style.display = 'block';
        costInput.style.border = '2px solid #ff0000';
        return false;
      } else {
        costError.textContent = "";
        costError.style.display = 'none';
        costInput.style.border = 'none';
        return true;
      }
    }
  
    // Reset error messages and borders on focus
    const inputFields = [meterInput, prevReadInput, currReadInput, costInput];
    inputFields.forEach(input => {
      input.addEventListener('focus', function() {
        // Only change to blue focus if not currently showing an error
        if (this.style.border !== '2px solid #ff0000') {
          this.style.border = '2px solid #5B78DF';
        }
      });
      
      input.addEventListener('blur', function() {
        // Don't remove red error border on blur - let validation handle this
        if (this.style.border === '2px solid #5B78DF') {
          this.style.border = 'none';
        }
      });
    });
  
    // Validate on input change
   meterInput.addEventListener('input', function() {
  validateMeter();
});
prevReadInput.addEventListener('input', function() {
  validatePrevRead();
});
currReadInput.addEventListener('input', function() {
  validateCurrRead();
});
costInput.addEventListener('input', function() {
  validateCost();
});
  
    // Handle form submission
    form.addEventListener('submit', function(event) {
      event.preventDefault(); // Always prevent default submission
      
      // Validate all fields
      const isValid = validateMeter() && validatePrevRead() && validateCurrRead() && validateCost();
      
      if (isValid) {
        // Calculate consumption
        const prevReading = parseInt(prevReadInput.value.trim());
        const currReading = parseInt(currReadInput.value.trim());
        const costPerKwh = parseFloat(costInput.value.trim());
        
        // Consumption = Current Reading - Previous Reading
        const consumption = currReading - prevReading;
        const totalCost = consumption * costPerKwh;
        
        // Store calculation results in localStorage to retrieve in result page
        localStorage.setItem('consumption', consumption.toFixed(2));
        localStorage.setItem('totalCost', totalCost.toFixed(2));
        localStorage.setItem('costPerKwh', costPerKwh.toFixed(2));
        
        // Redirect to calculation page for 2 seconds, then to result page
        window.location.href = 'calculate.html';
      }
    });
  });
  
  // For calculate.html - Redirect to result.html after 2 seconds
  if (window.location.pathname.includes('calculate.html')) {
    setTimeout(function() {
      window.location.href = 'result.html';
    }, 2000);
  }
  
  // For result.html - Display the calculation results
  if (window.location.pathname.includes('result.html')) {
    document.addEventListener('DOMContentLoaded', function() {
      // Retrieve consumption value from localStorage
      const consumption = localStorage.getItem('consumption');
      const valueElement = document.querySelector('.consumption-box .value');
      
      if (valueElement && consumption) {
        valueElement.textContent = consumption + ' kWh';
      }
      
      // Add event listener to Sayonara button
      const sayonaraButton = document.querySelector('.button');
      if (sayonaraButton) {
        sayonaraButton.addEventListener('click', function() {
          window.location.href = 'end.html';
        });
      }
    });
  }
  
  // For end.html - Redirect to index.html after 2 seconds
  if (window.location.pathname.includes('end.html')) {
    setTimeout(function() {
      window.location.href = 'index.html';
    }, 2000);
  }