document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality when the page loads
    initMobileMenu();
    initSmoothScrolling();
    initFormValidation();
    initWhatsAppIntegration();
    initRideSearch();
    initFadeInAnimations();
    initLocalStorage();
    
    console.log('CampusRide website initialized successfully!');
});

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('show');
            
            // Update button icon (hamburger to X)
            const icon = mobileMenuButton.querySelector('svg path');
            if (mobileMenu.classList.contains('show')) {
                icon.setAttribute('d', 'M6 18L18 6M6 6l12 12'); // X icon
            } else {
                icon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16'); // Hamburger icon
            }
        });
        
        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('show');
            });
        });
    }
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form Validation
function initFormValidation() {
    // Ride Request Form Validation
    const rideRequestForm = document.getElementById('ride-request-form');
    if (rideRequestForm) {
        rideRequestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateRideRequestForm()) {
                submitRideRequest();
            }
        });
        
        // Real-time validation
        const inputs = rideRequestForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearError(this);
            });
        });
    }
    
    // Driver Registration Form Validation
    const driverRegistrationForm = document.getElementById('driver-registration-form');
    if (driverRegistrationForm) {
        driverRegistrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateDriverRegistrationForm()) {
                submitDriverRegistration();
            }
        });
        
        // Real-time validation
        const inputs = driverRegistrationForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearError(this);
            });
        });
    }
}

// Validate individual form fields
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number.';
        }
    }
    
    // Date validation (not in the past)
    if (field.type === 'date' && value) {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            isValid = false;
            errorMessage = 'Please select a future date.';
        }
    }
    
    // Year validation
    if (field.name === 'year' && value) {
        const year = parseInt(value);
        const currentYear = new Date().getFullYear();
        if (year < 2000 || year > currentYear) {
            isValid = false;
            errorMessage = `Please enter a year between 2000 and ${currentYear}.`;
        }
    }
    
    // Show or hide error message
    showFieldError(field, isValid, errorMessage);
    
    return isValid;
}

// Show field error
function showFieldError(field, isValid, errorMessage) {
    const errorElement = field.parentNode.querySelector('.error-message');
    
    if (errorElement) {
        if (!isValid) {
            errorElement.textContent = errorMessage;
            errorElement.classList.remove('hidden');
            errorElement.classList.add('show');
            field.classList.add('border-red-500');
            field.classList.remove('border-gray-300');
        } else {
            errorElement.classList.add('hidden');
            errorElement.classList.remove('show');
            field.classList.remove('border-red-500');
            field.classList.add('border-gray-300');
        }
    }
}

// Clear field error
function clearError(field) {
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.classList.add('hidden');
        errorElement.classList.remove('show');
        field.classList.remove('border-red-500');
        field.classList.add('border-gray-300');
    }
}

// Validate ride request form
function validateRideRequestForm() {
    const form = document.getElementById('ride-request-form');
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    // Check terms checkbox
    const termsCheckbox = form.querySelector('#terms');
    if (termsCheckbox && !termsCheckbox.checked) {
        isValid = false;
        alert('Please accept the Terms of Service and Privacy Policy.');
    }
    
    return isValid;
}

// Validate driver registration form
function validateDriverRegistrationForm() {
    const form = document.getElementById('driver-registration-form');
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    // Check availability checkboxes
    const availabilityCheckboxes = form.querySelectorAll('input[name="availability"]:checked');
    if (availabilityCheckboxes.length === 0) {
        isValid = false;
        const errorElement = form.querySelector('input[name="availability"]').closest('div').querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = 'Please select at least one day of availability.';
            errorElement.classList.remove('hidden');
            errorElement.classList.add('show');
        }
    }
    
    // Check required checkboxes
    const requiredCheckboxes = form.querySelectorAll('#terms-driver, #insurance, #background');
    requiredCheckboxes.forEach(checkbox => {
        if (!checkbox.checked) {
            isValid = false;
            alert('Please check all required agreements.');
        }
    });
    
    return isValid;
}

// Submit ride request
function submitRideRequest() {
    const form = document.getElementById('ride-request-form');
    const submitButton = form.querySelector('button[type="submit"]');
    const successMessage = document.getElementById('success-message');
    
    // Show loading state
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    
    // Collect form data
    const formData = new FormData(form);
    const rideData = Object.fromEntries(formData.entries());
    
    // Save to localStorage (simulating backend)
    saveRideRequest(rideData);
    
    // Simulate API call delay
    setTimeout(() => {
        // Hide loading state
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Request';
        
        // Show success message
        successMessage.classList.remove('hidden');
        successMessage.classList.add('success-message');
        
        // Reset form
        form.reset();
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        console.log('Ride request submitted:', rideData);
    }, 2000);
}

// Submit driver registration
function submitDriverRegistration() {
    const form = document.getElementById('driver-registration-form');
    const submitButton = form.querySelector('button[type="submit"]');
    const successMessage = document.getElementById('success-message-driver');
    
    // Show loading state
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting Application...';
    
    // Collect form data
    const formData = new FormData(form);
    const driverData = Object.fromEntries(formData.entries());
    
    // Handle checkbox arrays (availability)
    const availability = [];
    form.querySelectorAll('input[name="availability"]:checked').forEach(checkbox => {
        availability.push(checkbox.value);
    });
    driverData.availability = availability;
    
    // Save to localStorage (simulating backend)
    saveDriverRegistration(driverData);
    
    // Simulate API call delay
    setTimeout(() => {
        // Hide loading state
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Application';
        
        // Show success message
        successMessage.classList.remove('hidden');
        successMessage.classList.add('success-message');
        
        // Reset form
        form.reset();
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        console.log('Driver registration submitted:', driverData);
    }, 2000);
}

// WhatsApp Integration
function initWhatsAppIntegration() {
    const bookRideBtn = document.getElementById('book-ride-btn');
    const whatsappBtn = document.getElementById('whatsapp-btn');
    
    if (bookRideBtn) {
        bookRideBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openWhatsApp('I would like to book a ride through CampusRide. Can you help me?');
        });
    }
    
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get form data if available
            const form = document.getElementById('ride-request-form');
            let message = 'I would like to request a ride through CampusRide.';
            
            if (form) {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                if (data.fullName && data.pickupLocation && data.destination) {
                    message = `Hi! I'm ${data.fullName} and I would like to request a ride through CampusRide.
                    
Pickup: ${data.pickupLocation}
Destination: ${data.destination}
Date: ${data.date || 'Not specified'}
Time: ${data.time || 'Not specified'}
Passengers: ${data.passengers || '1'}

${data.notes ? 'Additional notes: ' + data.notes : ''}

Please let me know if you can help!`;
                }
            }
            
            openWhatsApp(message);
        });
    }
}

// Open WhatsApp with pre-filled message
function openWhatsApp(message) {
    const phoneNumber = '1234567890'; // Replace with actual WhatsApp business number
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

// Ride Search Functionality
function initRideSearch() {
    const searchInput = document.getElementById('search-rides');
    const filterDate = document.getElementById('filter-date');
    const searchBtn = document.getElementById('search-btn');
    const ridesContainer = document.getElementById('rides-container');
    const noResults = document.getElementById('no-results');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    function performSearch() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const dateFilter = filterDate ? filterDate.value : '';
        
        const rideCards = document.querySelectorAll('.ride-card');
        let visibleCount = 0;
        
        rideCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            const matchesSearch = !searchTerm || cardText.includes(searchTerm);
            
            // Simple date filtering (in a real app, this would be more sophisticated)
            let matchesDate = true;
            if (dateFilter) {
                const cardDate = card.querySelector('svg + span').textContent.toLowerCase();
                switch (dateFilter) {
                    case 'today':
                        matchesDate = cardDate.includes('today');
                        break;
                    case 'tomorrow':
                        matchesDate = cardDate.includes('tomorrow');
                        break;
                    case 'week':
                        matchesDate = cardDate.includes('today') || cardDate.includes('tomorrow') || 
                                     cardDate.includes('friday') || cardDate.includes('saturday') || cardDate.includes('sunday');
                        break;
                }
            }
            
            if (matchesSearch && matchesDate) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show/hide no results message
        if (noResults) {
            if (visibleCount === 0) {
                noResults.classList.remove('hidden');
                ridesContainer.style.display = 'none';
            } else {
                noResults.classList.add('hidden');
                ridesContainer.style.display = 'grid';
            }
        }
        
        console.log(`Search performed: "${searchTerm}", Date: "${dateFilter}", Results: ${visibleCount}`);
    }
}

// Fade-in animations on scroll
function initFadeInAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements that should fade in
    const fadeElements = document.querySelectorAll('.ride-card, .feature-card, .step-card');
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Local Storage Functions (Simulating Backend)
function initLocalStorage() {
    // Initialize localStorage if not exists
    if (!localStorage.getItem('campusRideRequests')) {
        localStorage.setItem('campusRideRequests', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('campusRideDrivers')) {
        localStorage.setItem('campusRideDrivers', JSON.stringify([]));
    }
}

function saveRideRequest(data) {
    const requests = JSON.parse(localStorage.getItem('campusRideRequests') || '[]');
    data.id = Date.now().toString();
    data.timestamp = new Date().toISOString();
    data.status = 'pending';
    
    requests.push(data);
    localStorage.setItem('campusRideRequests', JSON.stringify(requests));
    
    console.log('Ride request saved to localStorage:', data);
}

function saveDriverRegistration(data) {
    const drivers = JSON.parse(localStorage.getItem('campusRideDrivers') || '[]');
    data.id = Date.now().toString();
    data.timestamp = new Date().toISOString();
    data.status = 'pending_verification';
    
    drivers.push(data);
    localStorage.setItem('campusRideDrivers', JSON.stringify(drivers));
    
    console.log('Driver registration saved to localStorage:', data);
}

// Utility Functions
function formatPhoneNumber(phoneNumber) {
    // Simple phone number formatting
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phoneNumber;
}

function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

function getCurrentTime() {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
}

// Set minimum date for date inputs to today
document.addEventListener('DOMContentLoaded', function() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = getCurrentDate();
    
    dateInputs.forEach(input => {
        input.min = today;
    });
});

// Book ride functionality for ride cards
document.addEventListener('click', function(e) {
    if (e.target.textContent === 'Book Ride') {
        e.preventDefault();
        
        const rideCard = e.target.closest('.ride-card');
        const driverName = rideCard.querySelector('h3').textContent;
        const from = rideCard.querySelector('span:contains("From:")').nextSibling.textContent;
        const to = rideCard.querySelector('span:contains("To:")').nextSibling.textContent;
        const time = rideCard.querySelector('svg + span').textContent;
        const price = rideCard.querySelector('.text-lg.font-bold').textContent;
        
        const message = `Hi ${driverName}! I would like to book your ride from ${from} to ${to} at ${time} for ${price}. Is it still available?`;
        
        openWhatsApp(message);
    }
});

// Add loading spinner utility
function showLoadingSpinner(element) {
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    element.appendChild(spinner);
}

function hideLoadingSpinner(element) {
    const spinner = element.querySelector('.spinner');
    if (spinner) {
        spinner.remove();
    }
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In a production app, you might want to send this to an error tracking service
});

// Performance monitoring
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
});

console.log('CampusRide JavaScript loaded successfully!');

