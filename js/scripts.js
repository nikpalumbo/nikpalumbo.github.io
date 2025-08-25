// Pricing Configurator Initialization
document.addEventListener('DOMContentLoaded', function() {
  const configurator = document.getElementById('growth-systems-config');
  const serviceTabs = document.querySelectorAll('.service-tab');
  
  if (configurator && serviceTabs.length > 0) {
    console.log('DOM loaded, checking for pricing elements...');
    
    // Service tab functionality
    serviceTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // Remove active class from all tabs
        serviceTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        this.classList.add('active');
        
        // Show corresponding content
        const serviceType = this.getAttribute('data-service');
        showServiceContent(serviceType);
      });
    });
    
    // Radio button visual state management
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
      radio.addEventListener('change', function() {
        console.log('Radio button changed:', this.value);
        updateRadioVisualState();
        calculatePrice();
        updateQuoteDisplay();
        showBannerOnUpdate(); // Show banner on calculator update
      });
    });
    
    // Checkbox visual state management
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        console.log('Checkbox changed:', this.value);
        updateCheckboxVisualState();
        calculatePrice();
        updateQuoteDisplay();
        showBannerOnUpdate(); // Show banner on calculator update
      });
    });
    
    // Add event listeners to channel checkboxes
    const channelCheckboxes = document.querySelectorAll('input[name="channel"]');
    channelCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        console.log('Channel checkbox changed:', this.value);
        updateCheckboxVisualState();
        calculatePrice();
        updateQuoteDisplay();
        showBannerOnUpdate(); // Show banner on calculator update
      });
    });
    
    // Add event listeners to CRM checkboxes
    const crmCheckboxes = document.querySelectorAll('input[name="crm"]');
    crmCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        console.log('CRM checkbox changed:', this.value);
        updateCheckboxVisualState();
        calculatePrice();
        updateQuoteDisplay();
        showBannerOnUpdate(); // Show banner on calculator update
      });
    });

    // Initial visual state update
    updateRadioVisualState();
    updateCheckboxVisualState();

    // Initial price calculation and quote display
    console.log('Running initial calculations...');
    calculatePrice();
    updateQuoteDisplay();
    
    // Ensure banner starts hidden
    const stickyBanner = document.getElementById('sticky-price-banner');
    if (stickyBanner) {
      stickyBanner.classList.remove('visible');
      console.log('Banner initialized as hidden');
      
      // Force remove visible class multiple times to ensure it's hidden
      stickyBanner.classList.remove('visible');
      stickyBanner.classList.remove('visible');
      stickyBanner.classList.remove('visible');
      
      // Check if it's still visible
      console.log('Banner classes after removal:', stickyBanner.className);
      console.log('Banner has visible class:', stickyBanner.classList.contains('visible'));
    }
    
    // Force banner to be hidden initially
    setTimeout(() => {
      if (stickyBanner) {
        stickyBanner.classList.remove('visible');
        console.log('Banner forced to be hidden after timeout');
        console.log('Final banner classes:', stickyBanner.className);
      }
    }, 100);
    
    // Add another timeout to be extra sure
    setTimeout(() => {
      if (stickyBanner) {
        stickyBanner.classList.remove('visible');
        console.log('Banner forced to be hidden after second timeout');
      }
    }, 500);
    
    // Add scroll event listener for sticky banner visibility
    window.addEventListener('scroll', checkStickyBannerVisibility);
    
    // Handle form submissions
    setupFormHandling();
    
    // Show IGS content initially
    showServiceContent('growth-systems');

  } else {
    console.log('Not on pricing page or elements not found');
  }
});

// Show service content based on selected tab
function showServiceContent(serviceType) {
  // Hide all service content (add service-hidden, remove service-visible)
  const allContent = document.querySelectorAll('.pricing-content');
  allContent.forEach(content => {
    content.classList.remove('service-visible');
    content.classList.add('service-hidden');
  });

  // Handle IGS calculator separately
  const igsCalculator = document.querySelector('.pricing-configurator');
  const igsHeader = document.querySelector('.config-header');

  if (serviceType === 'growth-systems') {
    if (igsCalculator) {
      igsCalculator.classList.remove('service-hidden');
      igsCalculator.classList.add('service-visible');
    }
    if (igsHeader) {
      igsHeader.classList.remove('service-hidden');
      igsHeader.classList.add('service-visible');
    }
  } else {
    if (igsCalculator) {
      igsCalculator.classList.remove('service-visible');
      igsCalculator.classList.add('service-hidden');
    }
    if (igsHeader) {
      igsHeader.classList.remove('service-visible');
      igsHeader.classList.add('service-hidden');
    }
  }

  // Show selected service content (remove service-hidden, add service-visible)
  const selectedContent = document.getElementById(serviceType + '-content');
  if (selectedContent) {
    selectedContent.classList.remove('service-hidden');
    selectedContent.classList.add('service-visible');
  }
}

// Update radio button visual state
function updateRadioVisualState() {
  const radioButtons = document.querySelectorAll('input[type="radio"]');
  radioButtons.forEach(radio => {
    const label = radio.nextElementSibling;
    if (label) {
      if (radio.checked) {
        label.classList.add('selected');
      } else {
        label.classList.remove('selected');
      }
    }
  });
}

// Update checkbox visual state
function updateCheckboxVisualState() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    const label = checkbox.parentElement;
    if (label) {
      if (checkbox.checked) {
        label.classList.add('selected');
      } else {
        label.classList.remove('selected');
      }
    }
  });
}

// Calculate pricing based on configuration
function calculatePrice() {
  // Check if pricing elements exist before calculating
  const companySizeElement = document.querySelector('input[name="company-size"]:checked');
  if (!companySizeElement) return; // Exit early if elements don't exist
  
  let basePrice = 5000; // Base price CHF 5,000
  
  // Company size adjustment
  const companySize = companySizeElement.value;
  if (companySize === 'sme') basePrice += 1500;      // SME: +1,500
  else if (companySize === 'enterprise') basePrice += 3500; // Enterprise: +3,500
  
  // Current stage adjustment (experience level)
  const leadStrategyElement = document.querySelector('input[name="lead-strategy"]:checked');
  if (!leadStrategyElement) return;
  const leadStrategy = leadStrategyElement.value;
  if (leadStrategy === 'increase') basePrice += 1000;  // Want to Improve: +1,000
  else if (leadStrategy === 'scale') basePrice += 2500; // Ready to Scale: +2,500
  
  // Marketing channels adjustment
  const channels = document.querySelectorAll('input[name="channel"]:checked');
  if (channels.length > 2) {
    basePrice += (channels.length - 2) * 500; // +500 per additional channel beyond base 2
  }
  
  // CRM integration complexity
  const crmSystems = document.querySelectorAll('input[name="crm"]:checked');
  if (crmSystems.length > 0) {
    // Check for complex CRMs
    const hasComplexCRM = Array.from(crmSystems).some(crm => 
      ['salesforce', 'dynamics', 'sugar'].includes(crm.value)
    );
    if (hasComplexCRM) basePrice += 1500; // Complex CRM: +1,500
    
    // Multiple CRMs add complexity
    if (crmSystems.length > 1) basePrice += 800; // Multiple CRMs: +800
  } else {
    basePrice += 300; // No CRM: +300 (setup from scratch)
  }
  
  // Optimization frequency
  const optimizationElement = document.querySelector('input[name="optimization"]:checked');
  if (!optimizationElement) return;
  const optimization = optimizationElement.value;
  if (optimization === 'monthly') basePrice += 800;      // Monthly: +800
  else if (optimization === 'bi-monthly') basePrice += 400;   // Bi-monthly: +400
  else if (optimization === 'quarterly') basePrice += 0;      // Quarterly: +0
  else if (optimization === 'bi-weekly') basePrice += 1200;   // Bi-weekly: +1,200
  
  // Delivery speed
  const deliveryElement = document.querySelector('input[name="delivery"]:checked');
  if (!deliveryElement) return;
  const delivery = deliveryElement.value;
  if (delivery === 'comprehensive') basePrice += 0;      // Comprehensive (12+ weeks): +0 (base)
  else if (delivery === 'standard') basePrice += 800;    // Standard (8-12 weeks): +800
  else if (delivery === 'fast') basePrice += 1500;       // Fast (4-6 weeks): +1,500
  
  // Update price display
  const priceElement = document.getElementById('estimated-price');
  if (priceElement) {
    priceElement.textContent = Math.round(basePrice).toLocaleString();
  }
}

// Update quote display in real-time
function updateQuoteDisplay() {
  // Company type
  const companyType = document.querySelector('input[name="company-size"]:checked');
  if (companyType && companyType.nextElementSibling) {
    const companyTypeLabel = companyType.nextElementSibling.textContent.trim();
    const companyTypeElement = document.getElementById('quote-company-type');
    if (companyTypeElement) companyTypeElement.textContent = companyTypeLabel;
  }
  
  // Lead strategy
  const leadStrategy = document.querySelector('input[name="lead-strategy"]:checked');
  if (leadStrategy && leadStrategy.nextElementSibling) {
    const leadStrategyLabel = leadStrategy.nextElementSibling.textContent.trim();
    const leadStrategyElement = document.getElementById('quote-lead-strategy');
    if (leadStrategyElement) leadStrategyElement.textContent = leadStrategyLabel;
  }
  
  // Channels
  const channels = Array.from(document.querySelectorAll('input[name="channel"]:checked'))
    .map(cb => cb.parentElement ? cb.parentElement.textContent.trim() : '')
    .filter(text => text.length > 0);
  const channelsElement = document.getElementById('quote-channels');
  if (channelsElement) channelsElement.textContent = channels.join(', ');
  
  // CRM level
  const crmSystems = Array.from(document.querySelectorAll('input[name="crm"]:checked'))
    .map(cb => cb.parentElement ? cb.parentElement.textContent.trim() : '')
    .filter(text => text.length > 0);
  const crmElement = document.getElementById('quote-crm');
  if (crmElement) crmElement.textContent = crmSystems.join(', ');
  
  // Optimization
  const optimization = document.querySelector('input[name="optimization"]:checked');
  if (optimization && optimization.nextElementSibling) {
    const optimizationLabel = optimization.nextElementSibling.textContent.trim();
    const optimizationElement = document.getElementById('quote-optimization');
    if (optimizationElement) {
      optimizationElement.textContent = optimizationLabel;
    }
  }
  
  // Delivery
  const delivery = document.querySelector('input[name="delivery"]:checked');
  if (delivery && delivery.nextElementSibling) {
    const deliveryLabel = delivery.nextElementSibling.textContent.split('(')[0].trim();
    const deliveryElement = document.getElementById('quote-delivery');
    if (deliveryElement) deliveryElement.textContent = deliveryLabel;
  }
  
  // Update sticky banner price
  updateStickyBannerPrice();
  
  // Show banner when calculator is updated
  showBannerOnUpdate();
  
  // Update hidden form fields
  updateFormFields();
}

// Update sticky banner price
function updateStickyBannerPrice() {
  const stickyPrice = document.getElementById('sticky-price');
  const mainPrice = document.getElementById('estimated-price');
  
  if (stickyPrice && mainPrice) {
    stickyPrice.textContent = mainPrice.textContent;
  }
}

// Check sticky banner visibility
function checkStickyBannerVisibility() {
  const stickyBanner = document.getElementById('sticky-price-banner');
  const quoteSection = document.querySelector('.cta-section');
  
  if (!stickyBanner || !quoteSection) return;
  
  const quoteRect = quoteSection.getBoundingRect();
  const viewportHeight = window.innerHeight;
  
  // Show banner when quote section is not visible in viewport
  const isQuoteVisible = quoteRect.bottom > 0 && quoteRect.top < viewportHeight;
  
  if (!isQuoteVisible) {
    stickyBanner.classList.add('visible');
  } else {
    stickyBanner.classList.remove('visible');
  }
}

// Show banner on calculator update
function showBannerOnUpdate() {
  const stickyBanner = document.getElementById('sticky-price-banner');
  if (stickyBanner) {
    stickyBanner.classList.add('visible');
    
    // Keep banner visible for longer (10 seconds instead of 5)
    setTimeout(() => {
      if (stickyBanner.classList.contains('visible')) {
        checkStickyBannerVisibility();
      }
    }, 10000);
  }
}

// Update hidden form fields with current configuration
function updateFormFields() {
  // Get current configuration values
  const companyType = document.querySelector('input[name="company-size"]:checked')?.nextElementSibling?.textContent.trim() || '';
  const currentStage = document.querySelector('input[name="lead-strategy"]:checked')?.nextElementSibling?.textContent.trim() || '';
  const channels = Array.from(document.querySelectorAll('input[name="channel"]:checked'))
    .map(cb => cb.parentElement?.textContent.trim() || '')
    .filter(text => text.length > 0)
    .join(', ');
  const crmLevel = Array.from(document.querySelectorAll('input[name="crm"]:checked'))
    .map(cb => cb.parentElement?.textContent.trim() || '')
    .filter(text => text.length > 0)
    .join(', ');
  const optimization = document.querySelector('input[name="optimization"]:checked')?.nextElementSibling?.textContent.trim() || '';
  const delivery = document.querySelector('input[name="delivery"]:checked')?.nextElementSibling?.textContent.split('(')[0].trim() || '';
  const estimatedPrice = document.getElementById('estimated-price')?.textContent || '';
  
  // Update main form fields
  const mainFormFields = {
    'form-company-type': companyType,
    'form-current-stage': currentStage,
    'form-channels': channels,
    'form-crm-level': crmLevel,
    'form-optimization': optimization,
    'form-delivery': delivery,
    'form-estimated-price': estimatedPrice
  };
  
  // Update sticky banner form fields
  const stickyFormFields = {
    'sticky-form-company-type': companyType,
    'sticky-form-current-stage': currentStage,
    'sticky-form-channels': channels,
    'sticky-form-crm-level': crmLevel,
    'sticky-form-optimization': optimization,
    'sticky-form-delivery': delivery,
    'sticky-form-estimated-price': estimatedPrice
  };
  
  // Update main form
  Object.entries(mainFormFields).forEach(([id, value]) => {
    const field = document.getElementById(id);
    if (field) field.value = value;
  });
  
  // Update sticky banner form
  Object.entries(stickyFormFields).forEach(([id, value]) => {
    const field = document.getElementById(id);
    if (field) field.value = value;
  });
}

// Setup form handling for Formspree submissions
function setupFormHandling() {
  // Main form
  const mainForm = document.querySelector('.email-simple-form');
  if (mainForm) {
    mainForm.addEventListener('submit', function(e) {
      // Formspree will handle the submission
      // We can add a loading state or success message here if needed
      const submitBtn = mainForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
      }
    });
  }
  
  // Sticky banner form
  const bannerForm = document.querySelector('.banner-email-form');
  if (bannerForm) {
    bannerForm.addEventListener('submit', function(e) {
      // Formspree will handle the submission
      const submitBtn = bannerForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
      }
    });
  }
}

// Case Studies Filtering Functionality
document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const caseStudyCards = document.querySelectorAll('.case-study-card');
  
  if (filterButtons.length > 0 && caseStudyCards.length > 0) {
    console.log('Case studies filtering initialized');
    
    // Add click event listeners to filter buttons
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        const category = this.getAttribute('data-category');
        
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        
        // Filter case studies
        filterCaseStudies(category);
      });
    });
  }
});

// Filter case studies based on selected category
function filterCaseStudies(category) {
  const caseStudyCards = document.querySelectorAll('.case-study-card');
  
  caseStudyCards.forEach(card => {
    const cardCategory = card.getAttribute('data-category');
    
    if (category === 'all' || cardCategory === category) {
      card.style.display = 'block';
      card.classList.remove('hidden');
    } else {
      card.style.display = 'none';
      card.classList.add('hidden');
    }
  });
  
  console.log(`Filtered case studies by category: ${category}`);
}
