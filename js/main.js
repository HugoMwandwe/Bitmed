document.addEventListener('DOMContentLoaded', function() {
    // Load header
    const headerDiv = document.getElementById('header');
    if (headerDiv) {
        fetch('components/header.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                headerDiv.innerHTML = data;
                highlightCurrentPage();
            })
            .catch(error => {
                console.error('Error loading header:', error);
                headerDiv.innerHTML = '<header><div class="navbar"><div class="logo"><a href="index.html" class="brand-name">BeautyMed</a></div></div></header>';
            });
    }

    // Load footer
    const footerDiv = document.getElementById('footer');
    if (footerDiv) {
        fetch('components/footer.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                footerDiv.innerHTML = data;
            })
            .catch(error => {
                console.error('Error loading footer:', error);
                footerDiv.innerHTML = `
                    <footer class="site-footer">
                        <div class="footer-content">
                            <p>&copy; 2024 BeautyMed. All rights reserved.</p>
                        </div>
                    </footer>`;
            });
    }

    // Hamburger Menu Functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Existing services object
    const services = {
        beauty: [
            "Professional Hair Styling & Coloring",
            "Manicure & Pedicure Services",
            "Facial Treatments & Skincare",
            "Professional Makeup Services",
            "Waxing & Hair Removal",
            "Eyelash Extensions & Tinting"
        ],
        barber: [
            "Classic & Modern Haircuts",
            "Beard Trimming & Shaping",
            "Hot Towel Shaves",
            "Hair Styling & Products",
            "Scalp Treatments",
            "Kids' Haircuts"
        ],
        medical: [
            "General Health Checkups",
            "Dermatology Consultations",
            "Dental Services",
            "Cosmetic Procedures",
            "Wellness Consultations",
            "Preventive Care"
        ]
    };

    // Update services dropdown based on selection
    function updateServices() {
        const serviceType = document.getElementById('serviceType').value;
        const specificService = document.getElementById('specificService');
        specificService.innerHTML = '<option value="">Select a specific service</option>';

        if (serviceType) {
            services[serviceType].forEach(service => {
                const option = document.createElement('option');
                option.value = service;
                option.textContent = service;
                specificService.appendChild(option);
            });
        }
    }

    // Initialize date picker with today as minimum date
    const datePicker = document.getElementById('appointmentDate');
    if (datePicker) {
        datePicker.min = new Date().toISOString().split('T')[0];
    }

    // Initialize form submission handler
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', handleFormSubmission);
    }
});

// Handle form submission
function handleFormSubmission(e) {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
        return;
    }

    // Create and show overlay
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.classList.add('show');
    }, 0);

    // Create and show success popup
    const popup = createSuccessPopup();
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.classList.add('show');
    }, 100);

    // Disable submit button
    const submitButton = this.querySelector('.submit-btn');
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="loading-spinner"></span> Booking...';

    // Store appointment data (you can send to server here)
    const appointmentData = {
        serviceType: document.getElementById('serviceType').value,
        specificService: document.getElementById('specificService').value,
        date: document.getElementById('appointmentDate').value,
        time: document.getElementById('appointmentTime').value,
        notes: document.getElementById('notes').value
    };

    // Simulate API call
    setTimeout(() => {
        // Redirect to home page
        window.location.href = 'index.html';
    }, 2000);
}

// Form validation
function validateForm() {
    const required = ['serviceType', 'specificService', 'appointmentDate', 'appointmentTime'];
    let isValid = true;

    required.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value) {
            isValid = false;
            highlightError(field);
        } else {
            removeError(field);
        }
    });

    return isValid;
}

// Error highlighting
function highlightError(field) {
    field.classList.add('error');
    field.addEventListener('input', () => removeError(field), { once: true });
}

function removeError(field) {
    field.classList.remove('error');
}

// Create success popup
function createSuccessPopup() {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div class="popup-content">
            <div class="success-icon">✓</div>
            <h3>Booking Successful!</h3>
            <p>Your appointment has been scheduled.</p>
            <p class="redirect-text">Redirecting to home page...</p>
        </div>
    `;
    return popup;
}

// Add these styles to your CSS
const styles = `
    .error {
        border-color: #ff3333 !important;
    }

    .loading-spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s ease-in-out infinite;
        margin-right: 8px;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .success-icon {
        font-size: 48px;
        color: #4CAF50;
        margin-bottom: 16px;
    }

    .redirect-text {
        font-size: 14px;
        margin-top: 8px;
        opacity: 0.8;
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Function to highlight current page in navigation
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
} 