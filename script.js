let display = document.getElementById('display');
let currentInput = '';
let previousInput = '';
let operator = '';
let shouldResetDisplay = false;

// Function to append numbers to display
function appendNumber(number) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    // Prevent multiple decimal points
    if (number === '.' && currentInput.includes('.')) {
        return;
    }
    
    currentInput += number;
    display.value = currentInput;
}

// Function to append operators (+, -, *, /)
function appendOperator(op) {
    if (currentInput === '') return;
    
    // If there's a previous calculation, calculate it first
    if (previousInput !== '' && operator !== '' && !shouldResetDisplay) {
        calculate();
    }
    
    operator = op;
    previousInput = currentInput;
    currentInput = '';
    shouldResetDisplay = false;
}

// Function to perform calculation
function calculate() {
    if (previousInput === '' || currentInput === '' || operator === '') return;
    
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    // Perform calculation based on operator
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert('Cannot divide by zero');
                clearAll();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    // Handle decimal results
    if (result % 1 !== 0) {
        result = parseFloat(result.toFixed(8)); // Limit decimal places
    }
    
    currentInput = result.toString();
    display.value = currentInput;
    previousInput = '';
    operator = '';
    shouldResetDisplay = true;
}

// Function to clear all (C button)
function clearAll() {
    currentInput = '';
    previousInput = '';
    operator = '';
    shouldResetDisplay = false;
    display.value = '';
}

// Function to clear entry (CE button)
function clearEntry() {
    currentInput = '';
    display.value = '';
}

// Function to delete last character (backspace functionality)
function deleteLast() {
    if (currentInput.length > 0) {
        currentInput = currentInput.slice(0, -1);
        display.value = currentInput;
    }
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Number keys
    if (key >= '0' && key <= '9') {
        appendNumber(key);
    }
    
    // Decimal point
    if (key === '.') {
        appendNumber('.');
    }
    
    // Operator keys
    if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendOperator(key);
    }
    
    // Enter or equals for calculation
    if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    }
    
    // Escape or 'c' for clear all
    if (key === 'Escape' || key.toLowerCase() === 'c') {
        clearAll();
    }
    
    // Backspace for delete
    if (key === 'Backspace') {
        event.preventDefault();
        deleteLast();
    }
});

// Initialize display
display.value = '';

// Additional utility functions
function formatNumber(num) {
    // Format large numbers with commas
    if (Math.abs(num) >= 1000000000) {
        return (num / 1000000000).toFixed(2) + 'B';
    } else if (Math.abs(num) >= 1000000) {
        return (num / 1000000).toFixed(2) + 'M';
    } else if (Math.abs(num) >= 1000) {
        return num.toLocaleString();
    }
    return num.toString();
}

// Error handling for invalid operations
function handleError(errorType) {
    switch (errorType) {
        case 'divisionByZero':
            display.value = 'Error: Division by zero';
            break;
        case 'invalidOperation':
            display.value = 'Error: Invalid operation';
            break;
        default:
            display.value = 'Error';
    }
    
    // Clear after showing error
    setTimeout(() => {
        clearAll();
    }, 2000);
}