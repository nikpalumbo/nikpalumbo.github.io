---
layout: landing
title: "SDW Solutions - Soluzioni Digitali Complete"
description: "La crescita digitale, senza pensieri. Dalla visibilità online al supporto informatico quotidiano, fino alla protezione dei tuoi dati: soluzioni pensate per far crescere la tua attività in sicurezza."
keywords: "soluzioni digitali, visibilità online, sito web, supporto informatico, protezione dati, consulenza digitale, SDW Solutions, checkup gratuito"
image: '/images/social_home.jpg'
permalink: /soluzioni-digitali-complete/
author: "Nicola Palumbo"
date: 2025-01-19
last_modified_at: 2025-01-19
og_title: "SDW Solutions - Soluzioni Digitali Complete"
og_description: "La crescita digitale, senza pensieri. Soluzioni complete per far crescere la tua attività in sicurezza."
og_image: '/images/social_home.jpg'
og_type: "website"
twitter_card: "summary_large_image"
twitter_title: "SDW Solutions - Soluzioni Digitali Complete"
twitter_description: "La crescita digitale, senza pensieri. Soluzioni complete per far crescere la tua attività in sicurezza."
twitter_image: '/images/social_home.jpg'
canonical_url: "https://sdw.solutions/soluzioni-digitali-complete/"
robots: "index, follow"
---

<!-- Italian Landing Page -->
<div class="landing-page">
  <!-- Header with Logo and CTA -->
  <div class="landing-header">
    <div class="header-content">
      <div class="logo">
        <img src="/images/sdw.png" alt="SDW Solutions">
      </div>
      <a href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0-NcwHUpy2VQTbjOwTbXwdd0qIVBbaPQvmwg8sujsRnwtn8LEFTFOVc_qFpKQKZASWyQwaIJO8?gv=true" 
         class="header-cta book-call-btn" 
         target="_blank"
         rel="nofollow noopener"
         onclick="gtag('event', 'book_call', {event_category: 'engagement', event_label: 'italian_landing_header', value: 1.0}); twq('event', 'tw-qfk70-qfk72', {contents: [{content_type: 'service', content_name: 'AI Growth Consultation', content_price: '0'}], status: 'started'});">
        Prenota una Call
      </a>
    </div>
  </div>

  <!-- Main Content -->
  <div class="landing-main">
    <div class="landing-left">
      <h1 class="landing-title">Soluzioni Digitali Complete</h1>
      <p class="landing-subtitle">La crescita digitale, senza pensieri. Dalla visibilità online al supporto informatico quotidiano, fino alla protezione dei tuoi dati: soluzioni pensate per far crescere la tua attività in sicurezza.</p>
      
      <!-- Services List -->
      <div class="services-list">
        <div class="service-point">Visibilità Online</div>
        <div class="service-point">Sito Web</div>
        <div class="service-point">Supporto Informatico</div>
        <div class="service-point">Protezione Dati</div>
        <div class="service-point">Consulenza Digitale</div>
        <div class="service-point">Checkup Gratuito</div>
      </div>
      
    </div>
    
    <div class="landing-right">
      <div class="form-container">
        <h2 class="form-title">Richiedi il tuo Checkup Gratuito</h2>
        
        <form class="landing-form" id="checkup-form" action="https://formspree.io/f/xzzapqow" method="POST">
          <div class="form-group">
            <label for="name">Nome e Cognome *</label>
            <input type="text" id="name" name="name" placeholder="Il tuo nome completo" required>
          </div>
          
          <div class="form-group">
            <label for="email">Email *</label>
            <input type="email" id="email" name="email" placeholder="la-tua-email@esempio.com" required>
          </div>
          
          <div class="form-group">
            <label for="phone">Numero di Telefono *</label>
            <input type="tel" id="phone" name="phone" placeholder="+41 78 123 45 67" required>
          </div>
          
          <button type="submit" class="form-button" onclick="gtag('event', 'form_submit', {event_category: 'engagement', event_label: 'checkup_request', value: 1.0})">
            <i class="fas fa-paper-plane"></i> Richiedi Checkup Gratuito
          </button>
          
          <p style="color: white; font-size: 12px; text-align: center; margin-top: 10px;">
            * Campi obbligatori. Il checkup è completamente gratuito e senza impegno.
          </p>
        </form>
      </div>
    </div>
  </div>
</div>

<script>
// Handle form submission with success message
document.getElementById('checkup-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const formData = new FormData(this);
  
  // Submit to Formspree
  fetch('https://formspree.io/f/xzzapqow', {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      // Show success message
      document.querySelector('.form-container').innerHTML = `
        <div class="success-message" style="text-align: center; padding: 40px;">
          <h3 style="color: #FFD700; margin-bottom: 20px;">✅ Richiesta Inviata!</h3>
          <p style="color: white; margin-bottom: 20px;">
            Grazie per la tua richiesta! Ti contatteremo entro 24 ore per il tuo checkup gratuito.
          </p>
          <p style="color: white; font-size: 14px;">
            Nel frattempo, puoi contattarci direttamente:<br>
            📧 nicola@sdw.solutions<br>
            📱 +41 78 225 93 60
          </p>
        </div>
      `;
    } else {
      throw new Error('Form submission failed');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Si è verificato un errore. Puoi contattarci direttamente a nicola@sdw.solutions');
  });
});
</script>
