---
layout: landing
title: "From 20K to 100 Clients - Your AI Growth Roadmap"
description: "Download the complete roadmap that shows how successful companies scale from 20K to 100+ clients using AI-powered growth systems. Get the exact strategies and frameworks."
keywords: "AI growth roadmap, scaling from 20K to 100 clients, growth systems, startup scaling, client acquisition"
image: '/images/social_roadmap.jpg'
permalink: /from-20K-to-100-clients/
---

<style>
/* Hide footer for landing page */
.footer {
  display: none !important;
}

/* Hide the main navigation to prevent double header */
.main-nav {
  display: none !important;
}

/* Fix landing page layout and prevent scrolling */
.landing-page {
  min-height: 100vh;
  overflow: hidden;
}

.landing-page .landing-main {
  min-height: calc(100vh - 80px);
  padding-top: 80px;
  display: flex;
  align-items: center;
}

/* Custom styles for form text colors and positioning */
.landing-page .form-help {
  color: white !important;
  font-size: 14px;
  margin-top: 0 !important;
  margin-bottom: 8px !important;
  text-align: center;
  display: block;
}

.landing-page .success-message {
  color: white !important;
}

.landing-page .success-message h3,
.landing-page .success-message p,
.landing-page .success-message ul,
.landing-page .success-message li {
  color: white !important;
}

.landing-page .error-message {
  color: white !important;
}

.landing-page .error-message h3,
.landing-page .error-message p {
  color: white !important;
}

/* Fix hover issues - prevent second logo and unwanted hover effects */
.landing-page .landing-header {
  position: relative;
  z-index: 1000;
}

.landing-page .landing-header .logo {
  position: relative;
  z-index: 1001;
}

.landing-page .landing-header .header-cta {
  position: relative;
  z-index: 1001;
}

/* Prevent any unwanted hover effects on the landing page */
.landing-page *:hover {
  transform: none !important;
}

.landing-page .form-button:hover {
  transform: translateY(-1px) !important;
}

/* Ensure input text is visible */
.landing-page input {
  color: #1f2937 !important;
  background-color: white !important;
}

.landing-page input::placeholder {
  color: #6b7280 !important;
}
</style>

<!-- Amplemarket-Style Landing Page -->
<div class="landing-page">
  <!-- Header with Logo and CTA -->
  <div class="landing-header">
    <div class="header-content">
      <div class="logo">
        <img src="/images/sdw.png" alt="SDW Solutions">
      </div>
      <a href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0-NcwHUpy2VQTbjOwTbXwdd0qIVBbaPQvmwg8sujsRnwtn8LEFTFOVc_qFpKQKZASWyQwaIJO8?gv=true" 
         class="header-cta book-call-btn" 
         onclick="trackCTA('Book a Call', 'Landing Header'); twq('event', 'tw-qfk70-qfk72', {contents: [{content_type: 'service', content_name: 'AI Growth Consultation', content_price: '0'}], status: 'started'});">
        Book a Call
      </a>
    </div>
  </div>

  <!-- Main Content -->
  <div class="landing-main">
    <div class="landing-left">
      <h1 class="landing-title">How I Turned 20K into 100+ Paying Clients</h1>
      <p class="landing-subtitle">Discover the exact steps we used to launch fast, scale lean, and land 100+ clients with just 20K.</p>
      
      <div class="testimonial">
        <div class="testimonial-content">
          "Stop wasting time and money. With 20K we built a production-grade MVP in weeks and scaled to 100+ clients. Now I am sharing the exact roadmap with you."
        </div>
        <div class="testimonial-author">
          <img src="/images/nicola-professional.jpg" alt="Nicola Palumbo">
          <div class="author-info">
            <div class="author-name">Nicola Palumbo</div>
            <div class="author-title">AI Product Manager & Growth Strategist</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="landing-right">
      <div class="form-container">
        <h2 class="form-title">Get Your Free Growth Roadmap</h2>
        <p class="urgency-text">Downloaded by 100+ founders already.</p>
        
        <form class="landing-form" id="roadmap-form" onsubmit="submitRoadmapForm(event)">
          <div class="form-group">
            <label for="name">Name *</label>
            <input type="text" id="name" name="name" placeholder="Your name" required>
          </div>
          
          <div class="form-group">
            <label for="phone">Phone Number *</label>
            <input type="tel" id="phone" name="phone" placeholder="+1234567890" required>
            <small class="form-help">We'll send the roadmap via WhatsApp</small>
          </div>
          
          <button type="submit" class="form-button" onclick="twq('event', 'tw-qfk70-qfk72', {contents: [{content_type: 'lead_magnet', content_name: 'Growth Roadmap', content_price: '0'}], status: 'completed'});">
            <i class="whatsapp-icon">📱</i> Send Me the Roadmap
          </button>
        </form>
      </div>
    </div>
  </div>
</div>

<script>
// API configuration - will be set by build process
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:8081' : 'https://api.sdw.solutions';
const API_KEY = 'your_frontend_api_key'; // Replace with your frontend API key

function validatePhoneNumber(phone) {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Check if it starts with + and has 10-15 digits
  if (!cleaned.startsWith('+')) {
    return false;
  }
  
  const digits = cleaned.substring(1); // Remove the +
  return digits.length >= 10 && digits.length <= 15;
}

function formatPhoneNumber(phone) {
  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // Ensure it starts with +
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }
  
  return cleaned;
}

async function submitRoadmapForm(event) {
  event.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  
  // Validate inputs
  if (!name) {
    alert('Please enter your name');
    return;
  }
  
  if (!phone) {
    alert('Please enter your phone number');
    return;
  }
  
  if (!validatePhoneNumber(phone)) {
    alert('Please enter a valid phone number (e.g., +1234567890)');
    return;
  }
  
  // Format phone number
  const formattedPhone = formatPhoneNumber(phone);
  
  // Show loading state
  const submitButton = document.querySelector('.form-button');
  const originalText = submitButton.innerHTML;
  submitButton.innerHTML = '<i class="loading-icon">⏳</i> Sending...';
  submitButton.disabled = true;
  
  try {
    // Submit to API
    const response = await fetch(`${API_URL}/api/whatsapp/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({
        name: name,
        phone: formattedPhone,
        source: 'landing_page'
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Show success message
      const form = document.getElementById('roadmap-form');
      form.innerHTML = `
        <div class="success-message">
          <h3 style="color: #FFD700 !important; text-align: center; font-weight: bold;">✅ Roadmap Sent!</h3>
          <p style="color: #ffd700; font-size: 18px; font-weight: bold; text-align: center;">Check your WhatsApp messages</p>
        </div>
      `;
      
      // Track conversion
      twq('event', 'tw-qfk70-qfk72', {
        contents: [{
          content_type: 'lead_magnet',
          content_name: 'Growth Roadmap',
          content_price: '0'
        }],
        status: 'completed',
        phone_number: formattedPhone
      });
      
    } else {
      throw new Error(result.error || 'Failed to send roadmap');
    }
    
  } catch (error) {
    console.error('Error submitting form:', error);
    
    // Show error message
    const form = document.getElementById('roadmap-form');
    form.innerHTML = `
      <div class="error-message">
        <h3>❌ Error Sending Roadmap</h3>
        <p>Sorry, there was an error sending the roadmap. Please try again or contact us directly.</p>
        <button onclick="location.reload()" class="form-button">Try Again</button>
      </div>
    `;
    
  } finally {
    // Reset button state
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
  }
}

// Track form interactions
document.addEventListener('DOMContentLoaded', function() {
  // Track form views
  twq('event', 'tw-qfk70-qfk72', {
    contents: [{
      content_type: 'lead_magnet',
      content_name: 'Growth Roadmap',
      content_price: '0'
    }],
    status: 'viewed'
  });
  
  // Track form field interactions
  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  
  nameInput.addEventListener('focus', function() {
    twq('event', 'tw-qfk70-qfk72', {
      contents: [{
        content_type: 'lead_magnet',
        content_name: 'Growth Roadmap',
        content_price: '0'
      }],
      status: 'form_interaction'
    });
  });
  
  phoneInput.addEventListener('focus', function() {
    twq('event', 'tw-qfk70-qfk72', {
      contents: [{
        content_type: 'lead_magnet',
        content_name: 'Growth Roadmap',
        content_price: '0'
      }],
      status: 'form_interaction'
    });
  });
});
</script>
