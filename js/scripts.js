// Reframe.js - Responsive iframe handling

// Reframe.js - Responsive iframe handling
function reframe(selector) {
  const elements = typeof selector === 'string' ? document.querySelectorAll(selector) : [selector];
  
  elements.forEach(element => {
    if (element.classList.contains('js-reframe')) return;
    
    const wrapper = document.createElement('div');
    wrapper.className = 'js-reframe';
    wrapper.style.position = 'relative';
    wrapper.style.width = '100%';
    
    const aspectRatio = (element.height / element.width) * 100;
    wrapper.style.paddingTop = aspectRatio + '%';
    
    element.style.position = 'absolute';
    element.style.width = '100%';
    element.style.height = '100%';
    element.style.left = '0';
    element.style.top = '0';
    
    element.parentNode.insertBefore(wrapper, element);
    wrapper.appendChild(element);
  });
}

// LazyLoad - Image lazy loading
class LazyLoad {
  constructor(options = {}) {
    this.elements = document.querySelectorAll(options.elements_selector || '.lazy');
    this.init();
  }
  
  init() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadElement(entry.target);
            observer.unobserve(entry.target);
          }
        });
      });
      
      this.elements.forEach(element => observer.observe(element));
    } else {
      this.elements.forEach(element => this.loadElement(element));
    }
  }
  
  loadElement(element) {
    if (element.dataset.src) {
      element.src = element.dataset.src;
      element.classList.remove('lazy');
    }
  }
}

// Lightense - Image zoom functionality
function Lightense(selector, options = {}) {
  const elements = typeof selector === 'string' ? document.querySelectorAll(selector) : [selector];
  
  elements.forEach(element => {
    element.addEventListener('click', function(e) {
      e.preventDefault();
      
      const overlay = document.createElement('div');
      overlay.className = 'lightense-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: zoom-out;
      `;
      
      const img = document.createElement('img');
      img.src = element.src;
      img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
      `;
      
      overlay.appendChild(img);
      document.body.appendChild(overlay);
      
      overlay.addEventListener('click', function() {
        document.body.removeChild(overlay);
      });
    });
  });
}

// Pricing Configurator
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, checking for pricing elements...');
  
  // Check if we're on the pricing page
  const configurator = document.getElementById('growth-systems-config');
  const serviceTabs = document.querySelectorAll('.service-tab');
  const pricingContents = document.querySelectorAll('.pricing-content');
  
  console.log('Configurator element:', configurator);
  console.log('Service tabs found:', serviceTabs.length);
  console.log('Pricing contents found:', pricingContents.length);
  
  // Only run pricing code if we're on the pricing page
  if (configurator && serviceTabs.length > 0) {
    console.log('Pricing page detected, initializing...');
    
    // Service tab switching
    serviceTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetService = tab.dataset.service;
        console.log('Service tab clicked:', targetService);
        
        // Update active tab
        serviceTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show/hide configurator or content
        if (targetService === 'growth-systems') {
          configurator.style.display = 'block';
          pricingContents.forEach(content => content.style.display = 'none');
        } else {
          configurator.style.display = 'none';
          pricingContents.forEach(content => {
            content.style.display = 'none';
            if (content.id === targetService + '-content') {
              content.style.display = 'block';
            }
          });
        }
      });
    });

    // Initialize configurator as visible
    configurator.style.display = 'block';
    pricingContents.forEach(content => content.style.display = 'none');

    // Radio button and checkbox functionality
    const radioGroups = document.querySelectorAll('input[type="radio"]');
    const channelCheckboxes = document.querySelectorAll('input[name="channel"]');
    const crmCheckboxes = document.querySelectorAll('input[name="crm"]');
    
    console.log('Radio buttons found:', radioGroups.length);
    console.log('Channel checkboxes found:', channelCheckboxes.length);
    console.log('CRM checkboxes found:', crmCheckboxes.length);
    
    // Function to update visual state of radio buttons
    function updateRadioVisualState() {
      radioGroups.forEach(radio => {
        const label = radio.nextElementSibling;
        if (label && label.tagName === 'LABEL') {
          if (radio.checked) {
            label.classList.add('selected');
          } else {
            label.classList.remove('selected');
          }
        }
      });
    }
    
    // Function to update visual state of checkboxes
    function updateCheckboxVisualState() {
      const allCheckboxes = [...channelCheckboxes, ...crmCheckboxes];
      allCheckboxes.forEach(checkbox => {
        const label = checkbox.parentElement;
        if (label && label.tagName === 'LABEL') {
          if (checkbox.checked) {
            label.classList.add('selected');
          } else {
            label.classList.remove('selected');
          }
        }
      });
    }
    
    // Add event listeners to ALL radio buttons (including optimization and delivery)
    radioGroups.forEach(radio => {
      radio.addEventListener('change', function() {
        console.log('Radio changed:', this.name, this.value);
        updateRadioVisualState();
        calculatePrice();
        updateQuoteDisplay();
      });
    });
    
    // Add event listeners to channel checkboxes
    channelCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        console.log('Channel checkbox changed:', this.value);
        updateCheckboxVisualState();
        calculatePrice();
        updateQuoteDisplay();
      });
    });
    
    // Add event listeners to CRM checkboxes
    crmCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        console.log('CRM checkbox changed:', this.value);
        updateCheckboxVisualState();
        calculatePrice();
        updateQuoteDisplay();
      });
    });

    // Initial visual state update
    updateRadioVisualState();
    updateCheckboxVisualState();

    // Email start button functionality
    const emailStartBtn = document.getElementById('email-start-btn');
    if (emailStartBtn) {
      emailStartBtn.addEventListener('click', function() {
        const configData = collectConfigData();
        const emailUrl = generateEmailUrl(configData);
        window.open(emailUrl, '_blank');
      });
    }

    // Initial price calculation and quote display
    console.log('Running initial calculations...');
    calculatePrice();
    updateQuoteDisplay();
  } else {
    console.log('Not on pricing page or elements not found');
  }
});

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
}

// Collect configuration data for email
function collectConfigData() {
  const data = {
    companySize: document.querySelector('input[name="company-size"]:checked')?.nextElementSibling?.textContent.trim() || '',
    leadStrategy: document.querySelector('input[name="lead-strategy"]:checked')?.nextElementSibling?.textContent.trim() || '',
    channels: Array.from(document.querySelectorAll('input[name="channel"]:checked')).map(cb => cb.parentElement?.textContent.trim() || '').filter(text => text.length > 0),
    crmLevel: Array.from(document.querySelectorAll('input[name="crm"]:checked')).map(cb => cb.parentElement?.textContent.trim() || '').filter(text => text.length > 0).join(', '),
    optimization: document.querySelector('input[name="optimization"]:checked')?.nextElementSibling?.textContent.trim() || '',
    delivery: document.querySelector('input[name="delivery"]:checked')?.nextElementSibling?.textContent.split('(')[0].trim() || '',
    estimatedPrice: document.getElementById('estimated-price')?.textContent || ''
  };
  
  return data;
}

// Generate email URL with pre-filled parameters
function generateEmailUrl(configData) {
  const subject = encodeURIComponent('Intelligent Growth System - Custom Quote Request');
  
  const body = encodeURIComponent(`Hi Nicola,

I'm interested in your Intelligent Growth System services. Here are my requirements:

Company Profile:
- Company Size: ${configData.companySize}

Scope & Automation:
- Current Stage: ${configData.leadStrategy}
- Marketing Channels: ${configData.channels.join(', ')}
- CRM Integration: ${configData.crmLevel}

Optimization & Delivery:
- Optimization Cycles: ${configData.optimization}
- Delivery Speed: ${configData.delivery}

Estimated Investment: CHF ${configData.estimatedPrice}

I'd like to discuss this further and get a detailed proposal. When would be a good time to schedule a call?

Best regards,
[Your Name]`);
  
  return `mailto:nicola@sdw.solutions?subject=${subject}&body=${body}`;
}