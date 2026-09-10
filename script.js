// Get form elements
const form = document.getElementById('registrationForm');
const successMessage = document.getElementById('successMessage');

// Form field mappings for error messages
const fieldErrorMap = {
    fullName: { element: 'fullNameError', rules: validateName },
    email: { element: 'emailError', rules: validateEmail },
    phone: { element: 'phoneError', rules: validatePhone },
    eventType: { element: 'eventTypeError', rules: validateSelect },
    attendees: { element: 'attendeesError', rules: validateAttendees },
    terms: { element: 'termsError', rules: validateTerms }
};

// Validation Functions
function validateName(value) {
    if (!value.trim()) {
        return 'Full name is required';
    }
    if (value.trim().length < 3) {
        return 'Name must be at least 3 characters long';
    }
    if (!/^[a-zA-Z\s'-]+$/.test(value)) {
        return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    }
    return '';
}

function validateEmail(value) {
    if (!value.trim()) {
        return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
    }
    return '';
}

function validatePhone(value) {
    if (!value.trim()) {
        return 'Phone number is required';
    }
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        return 'Please enter a valid phone number';
    }
    return '';
}

function validateSelect(value) {
    if (!value) {
        return 'Please select an event type';
    }
    return '';
}

function validateAttendees(value) {
    if (!value) {
        return 'Number of attendees is required';
    }
    if (parseInt(value) < 1) {
        return 'Must have at least 1 attendee';
    }
    if (parseInt(value) > 10) {
        return 'Maximum 10 attendees allowed';
    }
    return '';
}

function validateTerms(checked) {
    if (!checked) {
        return 'You must agree to the terms and conditions';
    }
    return '';
}

// Display error message
function showError(fieldName, errorMessage) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(fieldErrorMap[fieldName].element);
    const formGroup = field.parentElement;

    if (errorMessage) {
        formGroup.classList.add('error');
        errorElement.textContent = errorMessage;
        errorElement.classList.add('show');
    } else {
        formGroup.classList.remove('error');
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

// Validate individual field
function validateField(fieldName) {
    const field = document.getElementById(fieldName);
    const value = fieldName === 'terms' ? field.checked : field.value;
    
    const error = fieldErrorMap[fieldName].rules(value);
    showError(fieldName, error);
    
    return !error;
}

// Validate all fields
function validateForm() {
    let isValid = true;
    
    Object.keys(fieldErrorMap).forEach(fieldName => {
        if (!validateField(fieldName)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Add real-time validation
Object.keys(fieldErrorMap).forEach(fieldName => {
    const field = document.getElementById(fieldName);
    
    if (fieldName === 'terms') {
        field.addEventListener('change', () => validateField(fieldName));
    } else {
        field.addEventListener('blur', () => validateField(fieldName));
        field.addEventListener('input', () => {
            if (document.getElementById(fieldErrorMap[fieldName].element).classList.contains('show')) {
                validateField(fieldName);
            }
        });
    }
});

// Form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (validateForm()) {
        // Collect form data
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            eventType: document.getElementById('eventType').value,
            attendees: document.getElementById('attendees').value,
            company: document.getElementById('company').value,
            message: document.getElementById('message').value,
            registrationDate: new Date().toLocaleString()
        };
        
        // Store in localStorage (for demonstration)
        const registrations = JSON.parse(localStorage.getItem('eventRegistrations')) || [];
        registrations.push(formData);
        localStorage.setItem('eventRegistrations', JSON.stringify(registrations));
        
        // Log to console
        console.log('Registration submitted:', formData);
        
        // Show success message
        form.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Reset form after 3 seconds
        setTimeout(() => {
            form.reset();
            form.style.display = 'flex';
            successMessage.style.display = 'none';
        }, 3000);
    } else {
        console.log('Form validation failed');
    }
});

// Reset form
form.addEventListener('reset', () => {
    Object.keys(fieldErrorMap).forEach(fieldName => {
        showError(fieldName, '');
    });
});

// Optional: Display stored registrations
console.log('Stored Registrations:', JSON.parse(localStorage.getItem('eventRegistrations')) || []);
