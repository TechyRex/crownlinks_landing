document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Star rating for reviews
    const stars = document.querySelectorAll('.stars i');
    const ratingInput = document.getElementById('rating');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.getAttribute('data-rating');
            ratingInput.value = rating;
            
            stars.forEach(s => {
                if (s.getAttribute('data-rating') <= rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
        
        star.addEventListener('mouseover', function() {
            const hoverRating = this.getAttribute('data-rating');
            
            stars.forEach(s => {
                if (s.getAttribute('data-rating') <= hoverRating) {
                    s.classList.add('hover');
                } else {
                    s.classList.remove('hover');
                }
            });
        });
        
        star.addEventListener('mouseout', function() {
            stars.forEach(s => {
                s.classList.remove('hover');
            });
        });
    });
    
    // Newsletter Form Submission (using SheetDB)
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterMessage = document.getElementById('form-message');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Replace with your SheetDB API endpoint
            const sheetdbEndpoint = 'https://sheetdb.io/api/v1/YOUR_SHEET_ID';
            
            const formData = new FormData(newsletterForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                interest: formData.get('interest'),
                timestamp: new Date().toISOString()
            };
            
            fetch(sheetdbEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                newsletterMessage.textContent = 'Thank you for subscribing! You will receive admission updates soon.';
                newsletterMessage.classList.remove('error');
                newsletterMessage.classList.add('success');
                newsletterMessage.style.display = 'block';
                newsletterForm.reset();
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    newsletterMessage.style.display = 'none';
                }, 5000);
            })
            .catch(error => {
                newsletterMessage.textContent = 'There was an error submitting your form. Please try again later.';
                newsletterMessage.classList.remove('success');
                newsletterMessage.classList.add('error');
                newsletterMessage.style.display = 'block';
                
                console.error('Error:', error);
            });
        });
    }
    
    // Review Form Submission (using SheetDB)
    const reviewForm = document.getElementById('review-form');
    const reviewMessage = document.getElementById('review-message');
    
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Replace with your SheetDB API endpoint for reviews
            const sheetdbEndpoint = 'https://sheetdb.io/api/v1/YOUR_SHEET_ID_FOR_REVIEWS';
            
            const formData = new FormData(reviewForm);
            const data = {
                name: formData.get('name'),
                school: formData.get('school'),
                message: formData.get('message'),
                rating: formData.get('rating'),
                timestamp: new Date().toISOString()
            };
            
            fetch(sheetdbEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                reviewMessage.textContent = 'Thank you for your review! It will be displayed after moderation.';
                reviewMessage.classList.remove('error');
                reviewMessage.classList.add('success');
                reviewMessage.style.display = 'block';
                reviewForm.reset();
                
                // Reset stars
                stars.forEach(star => {
                    star.classList.remove('active');
                });
                ratingInput.value = '0';
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    reviewMessage.style.display = 'none';
                }, 5000);
            })
            .catch(error => {
                reviewMessage.textContent = 'There was an error submitting your review. Please try again later.';
                reviewMessage.classList.remove('success');
                reviewMessage.classList.add('error');
                reviewMessage.style.display = 'block';
                
                console.error('Error:', error);
            });
        });
    }
    
    // Contact Form Submission (using SheetDB)
    const contactForm = document.getElementById('contact-form');
    const contactFormMessage = document.getElementById('contact-message');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Replace with your SheetDB API endpoint for contacts
            const sheetdbEndpoint = 'https://sheetdb.io/api/v1/YOUR_SHEET_ID_FOR_CONTACTS';
            
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message'),
                timestamp: new Date().toISOString()
            };
            
            fetch(sheetdbEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                contactFormMessage.textContent = 'Thank you for your message! We will get back to you soon.';
                contactFormMessage.classList.remove('error');
                contactFormMessage.classList.add('success');
                contactFormMessage.style.display = 'block';
                contactForm.reset();
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    contactFormMessage.style.display = 'none';
                }, 5000);
            })
            .catch(error => {
                contactFormMessage.textContent = 'There was an error submitting your message. Please try again later.';
                contactFormMessage.classList.remove('success');
                contactFormMessage.classList.add('error');
                contactFormMessage.style.display = 'block';
                
                console.error('Error:', error);
            });
        });
    }

});

// Add this to your existing script.js file

