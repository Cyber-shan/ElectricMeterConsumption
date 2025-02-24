   // METER
document.getElementById('meter').addEventListener('input', function(e) {

  // Convert to uppercase and remove invalid characters
  let value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
   
  // Split into letters and numbers
   let letters = value.match(/[A-Z]/g) || [];
   let numbers = value.match(/\d/g) || [];

   // Build new value with format: 4 letters + 4 numbers
   let newValue = letters.slice(0,4).join('') + numbers.slice(0,4).join('');

   // Update input value (max 8 characthers)
   this.value = newValue.slice(0.8);

    // Force uppercase for the letters portion
    if(letters.length < 4 ) {
      this.value = this.value.toUpperCase;
    }

});

  // PREV METER READING 

  document.getElementById('numericInput').addEventListener('input', function(e) {
    // Remove any non-digit characters
    this.value = this.value.replace(/\D/g, '');
    
    // Truncate to 5 digits
    if(this.value.length > 5) {
      this.value = this.value.slice(0,5);
    }
  });
  
  // Optional: Prevent paste of non-numeric content
  document.getElementById('numericInput').addEventListener('paste', function(e) {
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '');
    e.preventDefault();
    this.value = pasteData.slice(0,5);
  });


 // CURRENT READING 
 
 