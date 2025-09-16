// Pricing Configurator Initialization
document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle Functionality
  const hamburger = document.querySelector('.hamburger');
  const mainNav = document.querySelector('.main-nav');
  
  if (hamburger && mainNav) {
    hamburger.addEventListener('click', function() {
      // Toggle hamburger state
      hamburger.classList.toggle('is-open');
      
      // Toggle mobile menu visibility
      mainNav.classList.toggle('is-visible');
      
      // Prevent body scroll when menu is open
      if (mainNav.classList.contains('is-visible')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = mainNav.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        hamburger.classList.remove('is-open');
        mainNav.classList.remove('is-visible');
        document.body.style.overflow = '';
      });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!hamburger.contains(event.target) && !mainNav.contains(event.target)) {
        hamburger.classList.remove('is-open');
        mainNav.classList.remove('is-visible');
        document.body.style.overflow = '';
      }
    });
  }

  const configurator = document.getElementById('growth-systems-config');
  const serviceTabs = document.querySelectorAll('.service-tab');
  
  if (configurator && serviceTabs.length > 0) {
    console.log('DOM loaded, checking for pricing elements...');
    
    // Handle hash-based routing for direct calculator access
    function handleHashRouting() {
      const hash = window.location.hash.substring(1); // Remove the #
      if (hash) {
        console.log('Hash detected:', hash);
        // Map hash to service type - using exact button titles
        const hashToService = {
          'intelligent-growth-systems': 'growth-systems',
          'ai-agent-development': 'ai-agents',
          'smart-conversion-websites': 'websites',
          'product-led-growth-prototyping': 'prototyping'
        };
        
        const serviceType = hashToService[hash];
        if (serviceType) {
          console.log('Showing service:', serviceType);
          showServiceContent(serviceType);
          
          // Update active tab if it exists
          const activeTab = document.querySelector(`[data-service="${serviceType}"]`);
          if (activeTab) {
            serviceTabs.forEach(t => t.classList.remove('active'));
            activeTab.classList.add('active');
          }
        }
      }
    }
    
    // Handle hash routing on page load
    handleHashRouting();
    
    // Handle hash changes (when user navigates with back/forward)
    window.addEventListener('hashchange', handleHashRouting);
    
    // Also handle hash routing after a short delay to ensure all elements are loaded
    setTimeout(handleHashRouting, 100);
    
    // Test hash routing - log current hash
    console.log('Current hash on page load:', window.location.hash);
    
    // Service tab functionality
    serviceTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        console.log('Tab clicked:', this.getAttribute('data-service'));
        
        // Remove active class from all tabs
        serviceTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        this.classList.add('active');
        
        // Show corresponding content
        const serviceType = this.getAttribute('data-service');
        console.log('Calling showServiceContent with:', serviceType);
        showServiceContent(serviceType);
        
        // Update URL hash for direct access - using exact button titles
        const hashMap = {
          'growth-systems': 'intelligent-growth-systems',
          'ai-agents': 'ai-agent-development',
          'websites': 'smart-conversion-websites',
          'prototyping': 'product-led-growth-prototyping'
        };
        const hash = hashMap[serviceType];
        if (hash) {
          console.log('Setting hash to:', hash);
          window.location.hash = hash;
        }
      });
    });
    
    // IGS Calculator event listeners (scoped to growth-systems-config only)
    const igsRadioButtons = document.querySelectorAll('#growth-systems-config input[type="radio"]');
    igsRadioButtons.forEach(radio => {
      radio.addEventListener('change', function() {
        console.log('IGS radio button changed:', this.value);
        updateRadioVisualState();
        calculatePrice();
        updateQuoteDisplay();
        showBannerOnUpdate(); // Show banner on calculator update
      });
    });
    
    // IGS Checkbox visual state management
    const igsCheckboxes = document.querySelectorAll('#growth-systems-config input[type="checkbox"]');
    igsCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        console.log('IGS checkbox changed:', this.value);
        updateCheckboxVisualState();
        calculatePrice();
        updateQuoteDisplay();
        showBannerOnUpdate(); // Show banner on calculator update
      });
    });
    
    // Add event listeners to IGS channel checkboxes
    const channelCheckboxes = document.querySelectorAll('#growth-systems-config input[name="channel"]');
    channelCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        console.log('IGS channel checkbox changed:', this.value);
        updateCheckboxVisualState();
        calculatePrice();
        updateQuoteDisplay();
        showBannerOnUpdate(); // Show banner on calculator update
      });
    });
    
    // Add event listeners to IGS CRM checkboxes
    const crmCheckboxes = document.querySelectorAll('#growth-systems-config input[name="crm"]');
    crmCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        console.log('IGS CRM checkbox changed:', this.value);
        updateCheckboxVisualState();
        calculatePrice();
        updateQuoteDisplay();
        showBannerOnUpdate(); // Show banner on calculator update
      });
    });

    // AI Agent Development event listeners - properly scoped to AI calculator container
    const aiRadioButtons = document.querySelectorAll('#ai-agents-config input[type="radio"][name^="ai-"]');
    aiRadioButtons.forEach(radio => {
      radio.addEventListener('change', function(e) {
        e.preventDefault(); // Prevent any default behavior
        e.stopPropagation(); // Stop event bubbling
        console.log('AI radio button changed:', this.name, this.value);
        console.log('Current service:', document.querySelector('.pricing-content.service-visible')?.id);
        updateAIButtonStates(); // Update button states
        calculateAIPrice();
        updateAIQuoteDisplay();
        updateAIStickyBannerPrice();
        showBannerOnUpdate();
      });
    });

    const aiCheckboxes = document.querySelectorAll('#ai-agents-config input[type="checkbox"][name^="ai-"]');
    aiCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function(e) {
        e.preventDefault(); // Prevent any default behavior
        e.stopPropagation(); // Stop event bubbling
        console.log('AI checkbox changed:', this.name, this.value);
        console.log('Current service:', document.querySelector('.pricing-content.service-visible')?.id);
        updateAIButtonStates(); // Update button states
        calculateAIPrice();
        updateAIQuoteDisplay();
        updateAIStickyBannerPrice();
        showBannerOnUpdate();
      });
    });

    // Initial visual state update
    updateRadioVisualState();
    updateCheckboxVisualState();
    updateAIButtonStates(); // Update AI calculator button states

    // Initial price calculation and quote display
    console.log('Running initial calculations...');
    calculatePrice();
    updateQuoteDisplay();
    
    // Initial AI Agent Development calculation
    calculateAIPrice();
    updateAIQuoteDisplay();
    updateAIStickyBannerPrice();
    
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
  
  // Case Studies Filtering Functionality
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

// Show service content based on selected tab
function showServiceContent(serviceType) {
  console.log('showServiceContent called with:', serviceType);
  
  // Hide all service content (add service-hidden, remove service-visible)
  const allContent = document.querySelectorAll('.pricing-content');
  allContent.forEach(content => {
    content.classList.remove('service-visible');
    content.classList.add('service-hidden');
  });

  // Handle IGS calculator separately
  const igsCalculator = document.querySelector('#growth-systems-config');
  const igsHeader = document.querySelector('#growth-systems-config .config-header');
  
  // Handle AI Agent Development calculator
  const aiCalculator = document.querySelector('#ai-agents-config');
  const aiHeader = document.querySelector('#ai-agents-config .config-header');

  if (serviceType === 'growth-systems') {
    if (igsCalculator) {
      igsCalculator.classList.remove('service-hidden');
      igsCalculator.classList.add('service-visible');
    }
    if (igsHeader) {
      igsHeader.classList.remove('service-hidden');
      igsHeader.classList.add('service-visible');
    }
    // Hide AI calculator
    if (aiCalculator) {
      aiCalculator.classList.remove('service-visible');
      aiCalculator.classList.add('service-hidden');
    }
    if (aiHeader) {
      aiHeader.classList.remove('service-visible');
      aiHeader.classList.add('service-hidden');
    }
  } else if (serviceType === 'ai-agents') {
    console.log('Switching to AI agents service');
    if (aiCalculator) {
      aiCalculator.classList.remove('service-hidden');
      aiCalculator.classList.add('service-visible');
      console.log('AI calculator made visible');
    }
    if (aiHeader) {
      aiHeader.classList.remove('service-hidden');
      aiHeader.classList.add('service-visible');
      console.log('AI header made visible');
    }
    // Hide IGS calculator
    if (igsCalculator) {
      igsCalculator.classList.remove('service-visible');
      igsCalculator.classList.add('service-hidden');
      console.log('IGS calculator hidden');
    }
    if (igsHeader) {
      igsHeader.classList.remove('service-visible');
      igsHeader.classList.add('service-hidden');
      console.log('IGS header hidden');
    }
  } else {
    // Hide both calculators for other services
    if (igsCalculator) {
      igsCalculator.classList.remove('service-visible');
      igsCalculator.classList.add('service-hidden');
    }
    if (igsHeader) {
      igsHeader.classList.remove('service-visible');
      igsHeader.classList.add('service-hidden');
    }
    if (aiCalculator) {
      aiCalculator.classList.remove('service-visible');
      aiCalculator.classList.add('service-hidden');
    }
    if (aiHeader) {
      aiHeader.classList.remove('service-visible');
      aiHeader.classList.add('service-hidden');
    }
  }

  // Show selected service content (remove service-hidden, add service-visible)
  const selectedContent = document.getElementById(serviceType + '-content');
  if (selectedContent) {
    selectedContent.classList.remove('service-hidden');
    selectedContent.classList.add('service-visible');
  }
}

// Update radio button visual state for IGS calculator
function updateRadioVisualState() {
  const radioButtons = document.querySelectorAll('#growth-systems-config input[type="radio"]');
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

// Update checkbox visual state for IGS calculator
function updateCheckboxVisualState() {
  const checkboxes = document.querySelectorAll('#growth-systems-config input[type="checkbox"]');
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
  
  const quoteRect = quoteSection.getBoundingClientRect();
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

// AI Agent Development Calculator Functions
function calculateAIPrice() {
  // Check if AI pricing elements exist before calculating
  const companyTypeElement = document.querySelector('#ai-agents-config input[name="ai-company-type"]:checked');
  if (!companyTypeElement) return; // Exit early if elements don't exist
  
  let basePrice = 8000; // Base price CHF 8,000
  
  // Company type adjustment
  const companyType = companyTypeElement.value;
  if (companyType === 'sme') basePrice += 1000;      // SME: +1,000
  else if (companyType === 'enterprise') basePrice += 2000; // Enterprise: +2,000
  
  // Primary model adjustment
  const primaryModelElement = document.querySelector('#ai-agents-config input[name="ai-primary-model"]:checked');
  if (primaryModelElement && primaryModelElement.value === 'azure') {
    basePrice += 1000; // Azure OpenAI: +1,000
  }
  
  // Ollama adjustment
  const ollamaElement = document.querySelector('#ai-agents-config input[name="ai-ollama"]:checked');
  if (ollamaElement) {
    const ollama = ollamaElement.value;
    if (ollama === 'single') basePrice += 2000;  // Single model: +2,000
    else if (ollama === 'multi') basePrice += 4000; // Multi-model: +4,000
  }
  
  // RAG adjustment
  const ragElement = document.querySelector('#ai-agents-config input[name="ai-rag"]:checked');
  if (ragElement) {
    const rag = ragElement.value;
    if (rag === 'simple') basePrice += 2000;  // Simple RAG: +2,000
    else if (rag === 'standard') basePrice += 4000; // Standard RAG: +4,000
    else if (rag === 'advanced') basePrice += 6000; // Advanced RAG: +6,000
  }
  
  // Tools adjustment
  const toolsElement = document.querySelector('#ai-agents-config input[name="ai-tools"]:checked');
  if (toolsElement) {
    const tools = toolsElement.value;
    if (tools === '3-5') basePrice += 1000;  // 3-5 tools: +1,000
    else if (tools === '6-10') basePrice += 2000; // 6-10 tools: +2,000
    else if (tools === '10+') basePrice += 3000; // 10+ tools: +3,000
  }
  
  // Interface adjustment
  const interfaceElement = document.querySelector('#ai-agents-config input[name="ai-interface"]:checked');
  if (interfaceElement) {
    const interface = interfaceElement.value;
    if (interface === 'widget') basePrice += 1200;  // Web widget: +1,200
    else if (interface === 'webapp') basePrice += 3000; // Full web app: +3,000
  }
  

  
  // Authentication
  const authElement = document.querySelector('#ai-agents-config input[name="ai-auth"]:checked');
  if (authElement) {
    const auth = authElement.value;
    if (auth === 'basic') basePrice += 800;  // Basic: +800
    else if (auth === 'sso') basePrice += 2000; // SSO: +2,000
  }
  
  // Authorization
  const authzElement = document.querySelector('#ai-agents-config input[name="ai-authz"]:checked');
  if (authzElement && authzElement.value === 'rbac') {
    basePrice += 2000; // RBAC: +2,000
  }
  
  // Guardrails
  const guardrailsElement = document.querySelector('#ai-agents-config input[name="ai-guardrails"]:checked');
  if (guardrailsElement) {
    const guardrails = guardrailsElement.value;
    if (guardrails === 'injection') basePrice += 1000;  // Injection/PII: +1,000
    else if (guardrails === 'eval') basePrice += 2000; // Eval harness: +2,000
  }
  
  // Compliance
  const complianceElement = document.querySelector('#ai-agents-config input[name="ai-compliance"]:checked');
  if (complianceElement && complianceElement.value === 'dpia') {
    basePrice += 2000; // DPIA: +2,000
  }
  
  // Observability
  const observabilityElement = document.querySelector('#ai-agents-config input[name="ai-observability"]:checked');
  if (observabilityElement && observabilityElement.value === 'tracing') {
    basePrice += 1000; // Tracing: +1,000
  }
  

  
  // Delivery speed
  const deliveryElement = document.querySelector('#ai-agents-config input[name="ai-delivery"]:checked');
  if (deliveryElement && deliveryElement.value === 'fast') {
    basePrice += 2000; // Fast delivery: +2,000
  }
  
  // Apply clamping: min CHF 8,000, max CHF 45,000
  basePrice = Math.max(8000, Math.min(basePrice, 45000));
  
  // Update price display
  const priceElement = document.getElementById('ai-estimated-price');
  if (priceElement) {
    priceElement.textContent = Math.round(basePrice).toLocaleString();
  }
  
  // Calculate and show care plan
  calculateAICarePlan();
}

function calculateAICarePlan() {
  const carePlanElement = document.querySelector('#ai-agents-config input[name="ai-care"]:checked');
  const carePlanEstimate = document.getElementById('ai-care-plan-estimate');
  const carePlanPriceElement = document.getElementById('ai-care-plan-price');
  
  if (!carePlanElement || !carePlanEstimate || !carePlanPriceElement) return;
  
  const carePlan = carePlanElement.value;
  let monthlyPrice = 0;
  
  if (carePlan === 'essentials') {
    monthlyPrice = 700; // CHF 500-900/mo, using middle value
  } else if (carePlan === 'optimize') {
    monthlyPrice = 1600; // CHF 1,200-2,000/mo, using middle value
  }
  
  if (monthlyPrice > 0) {
    carePlanEstimate.style.display = 'block';
    carePlanPriceElement.textContent = monthlyPrice.toLocaleString();
  } else {
    carePlanEstimate.style.display = 'none';
  }
}

function updateAIQuoteDisplay() {
  // Company type
  const companyType = document.querySelector('#ai-agents-config input[name="ai-company-type"]:checked');
  if (companyType && companyType.nextElementSibling) {
    const companyTypeLabel = companyType.nextElementSibling.textContent.trim();
    const companyTypeElement = document.getElementById('ai-quote-company-type');
    if (companyTypeElement) companyTypeElement.textContent = companyTypeLabel;
  }
  
  // LLM Stack
  const primaryModel = document.querySelector('#ai-agents-config input[name="ai-primary-model"]:checked');
  let llmStack = 'OpenAI (ChatGPT) / Anthropic (Claude) / Google (Gemini) API';
  
  if (primaryModel && primaryModel.value === 'azure') {
    llmStack = 'Azure OpenAI (enterprise policies/SLA)';
  }
  
  const llmElement = document.getElementById('ai-quote-llm');
  if (llmElement) llmElement.textContent = llmStack;
  
  // Ollama Configuration (separate from LLM Stack)
  const ollama = document.querySelector('#ai-agents-config input[name="ai-ollama"]:checked');
  let ollamaConfig = 'None';
  
  if (ollama && ollama.value !== 'none') {
    if (ollama.value === 'single') {
      ollamaConfig = 'Single Model (CPU)';
    } else if (ollama.value === 'multi') {
      ollamaConfig = 'Multi-Model Pool + Shared Storage + Autoscaling';
    }
  }
  
  const ollamaElement = document.getElementById('ai-quote-ollama');
  if (ollamaElement) ollamaElement.textContent = ollamaConfig;
  
  // RAG Level
  const ragElement = document.querySelector('#ai-agents-config input[name="ai-rag"]:checked');
  if (ragElement && ragElement.nextElementSibling) {
    const ragLabel = ragElement.nextElementSibling.textContent.trim();
    const ragQuoteElement = document.getElementById('ai-quote-rag');
    if (ragQuoteElement) ragQuoteElement.textContent = ragLabel;
  }
  
  // Tools
  const toolsElement = document.querySelector('#ai-agents-config input[name="ai-tools"]:checked');
  if (toolsElement && toolsElement.nextElementSibling) {
    const toolsLabel = toolsElement.nextElementSibling.textContent.trim();
    const toolsQuoteElement = document.getElementById('ai-quote-tools');
    if (toolsQuoteElement) toolsQuoteElement.textContent = toolsLabel;
  }
  
  // Interface
  const interfaceElement = document.querySelector('#ai-agents-config input[name="ai-interface"]:checked');
  if (interfaceElement && interfaceElement.nextElementSibling) {
    const interfaceLabel = interfaceElement.nextElementSibling.textContent.trim();
    const interfaceQuoteElement = document.getElementById('ai-quote-interface');
    if (interfaceQuoteElement) interfaceQuoteElement.textContent = interfaceLabel;
  }
  
  // Delivery
  const deliveryElement = document.querySelector('#ai-agents-config input[name="ai-delivery"]:checked');
  if (deliveryElement && deliveryElement.nextElementSibling) {
    const deliveryLabel = deliveryElement.nextElementSibling.textContent.split('(')[0].trim();
    const deliveryQuoteElement = document.getElementById('ai-quote-delivery');
    if (deliveryQuoteElement) deliveryQuoteElement.textContent = deliveryLabel;
  }
  
  // Authentication
  const authElement = document.querySelector('#ai-agents-config input[name="ai-auth"]:checked');
  if (authElement && authElement.nextElementSibling) {
    const authLabel = authElement.nextElementSibling.textContent.trim();
    const authQuoteElement = document.getElementById('ai-quote-auth');
    if (authQuoteElement) authQuoteElement.textContent = authLabel;
  }
  
  // Authorization
  const authzElement = document.querySelector('#ai-agents-config input[name="ai-authz"]:checked');
  if (authzElement && authzElement.nextElementSibling) {
    const authzLabel = authzElement.nextElementSibling.textContent.trim();
    const authzQuoteElement = document.getElementById('ai-quote-authz');
    if (authzQuoteElement) authzQuoteElement.textContent = authzLabel;
  }
  
  // Guardrails
  const guardrailsElement = document.querySelector('#ai-agents-config input[name="ai-guardrails"]:checked');
  if (guardrailsElement && guardrailsElement.nextElementSibling) {
    const guardrailsLabel = guardrailsElement.nextElementSibling.textContent.trim();
    const guardrailsQuoteElement = document.getElementById('ai-quote-guardrails');
    if (guardrailsQuoteElement) guardrailsQuoteElement.textContent = guardrailsLabel;
  }
  
  // Compliance
  const complianceElement = document.querySelector('#ai-agents-config input[name="ai-compliance"]:checked');
  if (complianceElement && complianceElement.nextElementSibling) {
    const complianceLabel = complianceElement.nextElementSibling.textContent.trim();
    const complianceQuoteElement = document.getElementById('ai-quote-compliance');
    if (complianceQuoteElement) complianceQuoteElement.textContent = complianceLabel;
  }
  
  // Observability
  const observabilityElement = document.querySelector('#ai-agents-config input[name="ai-observability"]:checked');
  if (observabilityElement && observabilityElement.nextElementSibling) {
    const observabilityLabel = observabilityElement.nextElementSibling.textContent.trim();
    const observabilityQuoteElement = document.getElementById('ai-quote-observability');
    if (observabilityQuoteElement) observabilityQuoteElement.textContent = observabilityLabel;
  }
  
  // Update form fields
  updateAIFormFields();
}

function updateAIFormFields() {
  // Get current AI configuration values
  const companyType = document.querySelector('#ai-agents-config input[name="ai-company-type"]:checked')?.nextElementSibling?.textContent.trim() || '';
  const primaryModel = document.querySelector('#ai-agents-config input[name="ai-primary-model"]:checked')?.value || '';
  const ollama = document.querySelector('#ai-agents-config input[name="ai-ollama"]:checked')?.value || '';
  
  // Separate LLM Stack and Ollama Configuration
  let llmStack = 'OpenAI (ChatGPT) / Anthropic (Claude) / Google (Gemini) API';
  if (primaryModel === 'azure') {
    llmStack = 'Azure OpenAI (enterprise policies/SLA)';
  }
  
  let ollamaConfig = 'None';
  if (ollama !== 'none') {
    if (ollama === 'single') {
      ollamaConfig = 'Single Model (CPU)';
    } else if (ollama === 'multi') {
      ollamaConfig = 'Multi-Model Pool + Shared Storage + Autoscaling';
    }
  }
  
  const ragLevel = document.querySelector('#ai-agents-config input[name="ai-rag"]:checked')?.nextElementSibling?.textContent.trim() || '';
  const toolsCount = document.querySelector('#ai-agents-config input[name="ai-tools"]:checked')?.nextElementSibling?.textContent.trim() || '';
  const interfaceType = document.querySelector('#ai-agents-config input[name="ai-interface"]:checked')?.nextElementSibling?.textContent.trim() || '';
  const deliverySpeed = document.querySelector('#ai-agents-config input[name="ai-delivery"]:checked')?.nextElementSibling?.textContent.split('(')[0].trim() || '';
  const carePlan = document.querySelector('#ai-agents-config input[name="ai-care"]:checked')?.nextElementSibling?.textContent.trim() || '';
  const estimatedPrice = document.getElementById('ai-estimated-price')?.textContent || '';
  const carePlanPrice = document.getElementById('ai-care-plan-price')?.textContent || '';
  
  // Advanced options
  const auth = document.querySelector('#ai-agents-config input[name="ai-auth"]:checked')?.nextElementSibling?.textContent.trim() || '';
  const authz = document.querySelector('#ai-agents-config input[name="ai-authz"]:checked')?.nextElementSibling?.textContent.trim() || '';
  const guardrails = document.querySelector('#ai-agents-config input[name="ai-guardrails"]:checked')?.nextElementSibling?.textContent.trim() || '';
  const compliance = document.querySelector('#ai-agents-config input[name="ai-compliance"]:checked')?.nextElementSibling?.textContent.trim() || '';
  const observability = document.querySelector('#ai-agents-config input[name="ai-observability"]:checked')?.nextElementSibling?.textContent.trim() || '';
  
  // Update AI form fields
  const aiFormFields = {
    'ai-form-company-type': companyType,
    'ai-form-llm-stack': llmStack,
    'ai-form-ollama-config': ollamaConfig,
    'ai-form-rag-level': ragLevel,
    'ai-form-tools-count': toolsCount,
    'ai-form-interface-type': interfaceType,
    'ai-form-delivery-speed': deliverySpeed,
    'ai-form-care-plan': carePlan,
    'ai-form-auth': auth,
    'ai-form-authz': authz,
    'ai-form-guardrails': guardrails,
    'ai-form-compliance': compliance,
    'ai-form-observability': observability,
    'ai-form-estimated-price': estimatedPrice,
    'ai-form-care-plan-price': carePlanPrice
  };
  
  // Update AI form
  Object.entries(aiFormFields).forEach(([id, value]) => {
    const field = document.getElementById(id);
    if (field) field.value = value;
  });
}

// Update AI sticky banner price
function updateAIStickyBannerPrice() {
  const stickyPrice = document.getElementById('sticky-price');
  const aiPrice = document.getElementById('ai-estimated-price');
  
  if (stickyPrice && aiPrice) {
    stickyPrice.textContent = aiPrice.textContent;
  }
}

// Accordion functionality
function toggleAccordion(accordionId) {
  const accordionContent = document.getElementById(accordionId);
  const accordionHeader = accordionContent?.previousElementSibling;
  
  if (accordionContent && accordionHeader) {
    const isExpanded = accordionContent.classList.contains('expanded');
    
    if (isExpanded) {
      accordionContent.classList.remove('expanded');
      accordionHeader.classList.remove('expanded');
    } else {
      accordionContent.classList.add('expanded');
      accordionHeader.classList.add('expanded');
    }
  }
}

// Update AI calculator button states
function updateAIButtonStates() {
  // Update AI radio buttons - properly scoped to AI calculator container
  const aiRadioButtons = document.querySelectorAll('#ai-agents-config input[type="radio"][name^="ai-"]');
  aiRadioButtons.forEach(radio => {
    const label = radio.nextElementSibling;
    if (label) {
      if (radio.checked) {
        label.classList.add('selected');
      } else {
        label.classList.remove('selected');
      }
    }
  });
  
  // Update AI checkboxes - properly scoped to AI calculator container
  const aiCheckboxes = document.querySelectorAll('#ai-agents-config input[type="checkbox"][name^="ai-"]');
  aiCheckboxes.forEach(checkbox => {
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

// Handle quote request functionality
function handleQuoteRequest(serviceType) {
  console.log('Quote request for service:', serviceType);
  
  // Get the email input
  const emailInput = serviceType === 'ai-agent' ? 
    document.getElementById('ai-email-input') : 
    document.getElementById('email-input');
  
  if (!emailInput || !emailInput.value) {
    alert('Please enter your email address first.');
    return;
  }
  
  // Collect configuration data
  const configData = collectConfigData(serviceType);
  
  // Generate email URL
  const emailUrl = generateQuoteEmailUrl(configData, serviceType);
  
  // Open email client
  window.open(emailUrl, '_blank');
}

// Collect configuration data for quote request
function collectConfigData(serviceType) {
  const data = {
    email: serviceType === 'ai-agent' ? 
      document.getElementById('ai-email-input').value : 
      document.getElementById('email-input').value,
    serviceType: serviceType === 'ai-agent' ? 'AI Agent Development' : 'Intelligent Growth Systems'
  };
  
  if (serviceType === 'ai-agent') {
    // AI Agent specific data
    data.companyType = document.getElementById('ai-form-company-type')?.value || 'Unknown';
    data.llmStack = document.getElementById('ai-form-llm-stack')?.value || 'Unknown';
    data.agentType = document.getElementById('ai-form-agent-type')?.value || 'Unknown';
    data.integrationComplexity = document.getElementById('ai-form-integration-complexity')?.value || 'Unknown';
    data.estimatedPrice = document.getElementById('ai-estimated-price')?.textContent || '0';
  } else {
    // Growth Systems specific data
    data.companyType = document.getElementById('form-company-type')?.value || 'Unknown';
    data.currentStage = document.getElementById('form-current-stage')?.value || 'Unknown';
    data.channels = document.getElementById('form-channels')?.value || 'Unknown';
    data.estimatedPrice = document.getElementById('estimated-price')?.textContent || '0';
  }
  
  return data;
}

// Generate email URL for quote request
function generateQuoteEmailUrl(configData, serviceType) {
  const subject = `Quote Request - ${configData.serviceType}`;
  const body = `Hi Nicola,

I'm interested in getting a detailed quote for ${configData.serviceType}.

My details:
- Email: ${configData.email}
- Company Type: ${configData.companyType}
- Estimated Price: CHF ${configData.estimatedPrice}

${serviceType === 'ai-agent' ? 
  `AI Agent Details:
- LLM Stack: ${configData.llmStack}
- Agent Type: ${configData.agentType}
- Integration Complexity: ${configData.integrationComplexity}` :
  `Growth Systems Details:
- Current Stage: ${configData.currentStage}
- Channels: ${configData.channels}`
}

Please send me a detailed proposal.

Best regards`;

  return `mailto:nicola@sdw.solutions?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
