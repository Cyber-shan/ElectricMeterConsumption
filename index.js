document.addEventListener('DOMContentLoaded', function() {
  const meterInput = document.getElementById('meter');
  const meterError = document.getElementById('meter-error');

  const prevReadInput = document.getElementById('prevRead');
  const currReadInput = document.getElementById('currRead');

  // Create error message spans
  const prevReadError = document.createElement('span');
  prevReadError.classList.add('error-message');
  prevReadInput.insertAdjacentElement('afterend', prevReadError);

  const currReadError = document.createElement('span');
  currReadError.classList.add('error-message');
  currReadInput.insertAdjacentElement('afterend', currReadError);

  const form = document.querySelector('form');

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
      const prevReadPattern = /^\d{5}$/; // Must be exactly 5 digits

      if (!prevReadPattern.test(prevReadValue)) {
          prevReadError.textContent = "Previous reading must be exactly 5 digits and non-negative.";
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

  // Function to validate Current Meter Reading (Only triggers when user interacts with it)
  function validateCurrRead() {
      if (currReadInput.value.trim() === "") {
          currReadError.textContent = "";
          currReadError.style.display = 'none';
          currReadInput.style.border = 'none';
          return true;
      }

      const prevReadValue = parseInt(prevReadInput.value.trim(), 10);
      const currReadValue = parseInt(currReadInput.value.trim(), 10);
      const currReadPattern = /^\d{5}$/; // Must be exactly 5 digits

      if (!currReadPattern.test(currReadInput.value.trim())) {
          currReadError.textContent = "Current reading must be exactly 5 digits and non-negative.";
          currReadError.style.display = 'block';
          currReadInput.style.border = '2px solid #ff0000';
          return false;
      } else if (!validatePrevRead()) {
          // Do not show current reading errors if previous reading is invalid
          currReadError.textContent = "";
          currReadError.style.display = 'none';
          currReadInput.style.border = 'none';
          return false;
      } else if (currReadValue < prevReadValue) {
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

  // Validate on input change
  meterInput.addEventListener('input', validateMeter);
  prevReadInput.addEventListener('input', function () {
      validatePrevRead();
  });
  currReadInput.addEventListener('input', validateCurrRead);

  // Validate on form submission
  form.addEventListener('submit', function(event) {
      if (!validateMeter() || !validatePrevRead() || !validateCurrRead()) {
          event.preventDefault(); // Prevent form submission if any validation fails
      }
  });
});
