/**
 * Cookie Consent Manager
 * GDPR-compliant cookie banner for Smart Data Way GmbH
 */

class CookieConsent {
  constructor() {
    this.cookieName = 'sdw-cookie-consent';
    this.cookieExpiry = 365; // days
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.bindEvents();
    this.checkConsent();
  }

  bindEvents() {
    // Banner buttons
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');
    const settingsBtn = document.getElementById('cookie-settings');

    // Modal buttons
    const modalClose = document.getElementById('cookie-modal-close');
    const saveSettingsBtn = document.getElementById('cookie-save-settings');
    const modalOverlay = document.querySelector('.cookie-modal__overlay');

    if (acceptBtn) acceptBtn.addEventListener('click', () => this.acceptAll());
    if (declineBtn) declineBtn.addEventListener('click', () => this.declineAnalytics());
    if (settingsBtn) settingsBtn.addEventListener('click', () => this.showSettings());
    if (modalClose) modalClose.addEventListener('click', () => this.hideSettings());
    if (saveSettingsBtn) saveSettingsBtn.addEventListener('click', () => this.saveSettings());
    if (modalOverlay) modalOverlay.addEventListener('click', () => this.hideSettings());

    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.hideSettings();
    });
  }

  checkConsent() {
    const consent = this.getConsent();
    
    if (!consent) {
      // No consent stored, show banner
      this.showBanner();
    } else {
      // Apply stored consent
      this.applyConsent(consent);
    }
  }

  showBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.style.display = 'block';
      // Trigger animation after display
      setTimeout(() => banner.classList.add('show'), 100);
    }
  }

  hideBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.classList.remove('show');
      setTimeout(() => banner.style.display = 'none', 300);
    }
  }

  showSettings() {
    const modal = document.getElementById('cookie-settings-modal');
    const analyticsToggle = document.getElementById('analytics-cookies');
    
    if (modal && analyticsToggle) {
      // Set current analytics preference
      const consent = this.getConsent();
      analyticsToggle.checked = consent ? consent.analytics : false;
      
      modal.style.display = 'flex';
      setTimeout(() => modal.classList.add('show'), 10);
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }
  }

  hideSettings() {
    const modal = document.getElementById('cookie-settings-modal');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.style.display = 'none', 300);
      
      // Restore body scroll
      document.body.style.overflow = '';
    }
  }

  acceptAll() {
    const consent = {
      essential: true,
      analytics: true,
      timestamp: Date.now()
    };
    
    this.saveConsent(consent);
    this.applyConsent(consent);
    this.hideBanner();
    
    // Track consent acceptance
    this.trackEvent('cookie_consent', 'accept_all');
  }

  declineAnalytics() {
    const consent = {
      essential: true,
      analytics: false,
      timestamp: Date.now()
    };
    
    this.saveConsent(consent);
    this.applyConsent(consent);
    this.hideBanner();
    
    // Track consent decline (without analytics)
    console.log('Analytics cookies declined');
  }

  saveSettings() {
    const analyticsToggle = document.getElementById('analytics-cookies');
    
    if (analyticsToggle) {
      const consent = {
        essential: true,
        analytics: analyticsToggle.checked,
        timestamp: Date.now()
      };
      
      this.saveConsent(consent);
      this.applyConsent(consent);
      this.hideSettings();
      this.hideBanner();
      
      // Show confirmation
      this.showNotification('Cookie preferences saved!');
    }
  }

  saveConsent(consent) {
    const consentString = JSON.stringify(consent);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + this.cookieExpiry);
    
    document.cookie = `${this.cookieName}=${consentString}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
  }

  getConsent() {
    const cookies = document.cookie.split(';');
    const consentCookie = cookies.find(cookie => 
      cookie.trim().startsWith(`${this.cookieName}=`)
    );
    
    if (consentCookie) {
      try {
        const consentString = consentCookie.split('=')[1];
        return JSON.parse(consentString);
      } catch (e) {
        console.error('Error parsing consent cookie:', e);
        return null;
      }
    }
    
    return null;
  }

  applyConsent(consent) {
    if (consent.analytics) {
      this.enableAnalytics();
    } else {
      this.disableAnalytics();
    }
  }

  enableAnalytics() {
    // Enable analytics tracking with existing GA setup
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
      
      // Consent granted - page view already tracked automatically
    }
    
    console.log('Analytics cookies enabled');
  }

  disableAnalytics() {
    // Disable analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
    
    // Remove existing analytics cookies
    this.removeAnalyticsCookies();
    
    console.log('Analytics cookies disabled');
  }

  // No longer needed - GA is already loaded via Jekyll include

  removeAnalyticsCookies() {
    // Remove Google Analytics cookies
    const gaCookies = ['_ga', '_ga_', '_gid', '_gat'];
    
    gaCookies.forEach(cookieName => {
      // Remove for current domain
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      // Remove for domain with dot prefix
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
    });
  }

  trackEvent(eventName, eventAction, eventLabel = '') {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventAction, {
        'event_category': eventName,
        'event_label': eventLabel
      });
    }
  }

  showNotification(message) {
    // Simple notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--primary-color);
      color: var(--dark);
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 600;
      z-index: 10001;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  }

  // Public method to revoke consent (can be called from privacy policy page)
  revokeConsent() {
    document.cookie = `${this.cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    this.removeAnalyticsCookies();
    location.reload();
  }

  // Public method to check current consent status
  getConsentStatus() {
    return this.getConsent();
  }
}

// Initialize cookie consent when script loads
const cookieConsent = new CookieConsent();

// Make it globally available for privacy policy page
window.cookieConsent = cookieConsent;
