/**
 * Ultra-sophisticated Massage Spa Application - Final Fixed Version
 * Advanced JavaScript Architecture with Working Navigation and Forms
 */

class MassageSpaApp {
  constructor() {
    this.config = {
      whatsappNumber: '51919292253',
      particleCount: 40,
      animationSpeed: 0.016,
      scrollThreshold: 100,
      debounceDelay: 250,
      throttleDelay: 16,
      intersectionThreshold: 0.1
    };

    this.state = {
      isLoaded: false,
      isScrolling: false,
      currentSection: 'hero',
      formData: {},
      particleSystem: null,
      observers: new Map(),
      eventListeners: new Map(),
      animationFrames: new Set()
    };

    this.init();
  }

  /**
   * Initialize the application
   */
  init() {
    console.log('Initializing Massage Spa App...');
    
    // Wait for DOM to be fully ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupApp());
    } else {
      this.setupApp();
    }
  }

  setupApp() {
    this.initializeParticleSystem();
    this.setupSmoothScrolling();
    this.setupFormHandling();
    this.initializeNavigationSystem();
    this.initializeAdvancedAnimations();
    this.setupResponsiveHandling();
    this.setupPerformanceMonitoring();
    
    this.state.isLoaded = true;
    console.log('Massage Spa App initialized successfully');
  }

  /**
   * Fixed Particle System
   */
  initializeParticleSystem() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) {
      console.warn('Particle canvas not found');
      return;
    }

    const ctx = canvas.getContext('2d');
    const particles = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();

    // Enhanced Particle class
    class Particle {
      constructor() {
        this.reset();
        this.life = Math.random() * 0.8 + 0.2;
        this.maxLife = this.life;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = (Math.random() - 0.5) * 1.2;
        this.radius = Math.random() * 4 + 2;
        this.baseOpacity = Math.random() * 0.7 + 0.3;
        this.hue = Math.random() * 40 + 320; // Wine red spectrum
        this.saturation = Math.random() * 30 + 50;
        this.lightness = Math.random() * 30 + 40;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.002;

        if (this.life <= 0 || this.x < -50 || this.x > canvas.width + 50 || 
            this.y < -50 || this.y > canvas.height + 50) {
          this.reset();
          this.life = this.maxLife;
        }

        // Gentle movement
        this.vx += (Math.random() - 0.5) * 0.1;
        this.vy += (Math.random() - 0.5) * 0.1;
        this.vx *= 0.98;
        this.vy *= 0.98;
      }

      draw() {
        const lifeRatio = this.life / this.maxLife;
        const currentOpacity = this.baseOpacity * lifeRatio;
        
        ctx.globalAlpha = currentOpacity;
        ctx.beginPath();
        
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius * 2
        );
        gradient.addColorStop(0, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 0.8)`);
        gradient.addColorStop(1, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < this.config.particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();
    
    // Handle resize
    window.addEventListener('resize', this.throttle(resizeCanvas, 100));
    
    this.state.particleSystem = { canvas, ctx, particles };
    console.log('Particle system initialized');
  }

  /**
   * Fixed Smooth Scrolling System
   */
  setupSmoothScrolling() {
    console.log('Setting up smooth scrolling...');

    const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    
    const smoothScrollTo = (targetElement, duration = 1000) => {
      if (!targetElement) {
        console.warn('Target element not found for scrolling');
        return;
      }

      const startPosition = window.pageYOffset;
      const targetPosition = targetElement.getBoundingClientRect().top + startPosition - 80;
      const distance = targetPosition - startPosition;
      let startTime = null;

      console.log('Scrolling to element:', targetElement.id, 'Target position:', targetPosition);

      const animation = currentTime => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        const easeProgress = easeInOutCubic(progress);
        window.scrollTo(0, startPosition + distance * easeProgress);
        
        if (progress < 1) {
          requestAnimationFrame(animation);
        } else {
          console.log('Scroll animation completed');
        }
      };

      requestAnimationFrame(animation);
    };

    // Navigation link handler
    const handleNavigationClick = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      
      e.preventDefault();
      const targetId = link.getAttribute('href');
      console.log('Navigation link clicked:', targetId);
      
      if (targetId === '#' || targetId.length <= 1) return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        smoothScrollTo(targetElement);
        this.updateActiveNavLink(targetId);
      } else {
        console.warn('Target element not found:', targetId);
      }
    };

    // Button handler for hero section
    const handleButtonClick = (e) => {
      const button = e.target.closest('.btn');
      if (!button) return;

      if (button.classList.contains('hero-cta')) {
        e.preventDefault();
        const reservarSection = document.getElementById('reservar');
        if (reservarSection) {
          console.log('Hero CTA clicked - scrolling to reservar');
          smoothScrollTo(reservarSection);
        }
      } else if (button.classList.contains('hero-secondary')) {
        e.preventDefault();
        const serviciosSection = document.getElementById('servicios');
        if (serviciosSection) {
          console.log('Hero secondary clicked - scrolling to servicios');
          // Reduce duration to 300ms for faster scroll
          smoothScrollTo(serviciosSection, 50);
        }
      }
    };

    // Add event listeners
    document.addEventListener('click', handleNavigationClick);
    document.addEventListener('click', handleButtonClick);

    // Specifically target navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          console.log('Direct nav link clicked:', targetId);
          smoothScrollTo(targetElement);
        }
      });
    });

    console.log('Smooth scrolling setup complete');
  }

  /**
   * Fixed Form Handling System
   */
  setupFormHandling() {
    console.log('Setting up form handling...');
    
    const form = document.getElementById('reservationForm');
    if (!form) {
      console.warn('Reservation form not found');
      return;
    }

    // Ensure service dropdown has options
    this.populateServiceDropdown();

    // Set minimum date to today
    const fechaField = form.querySelector('[name="fecha"]');
    if (fechaField) {
      const today = new Date().toISOString().split('T')[0];
      fechaField.min = today;
    }

    // Form validation setup
    const validators = {
      nombre: {
        validate: (value) => value.trim().length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value.trim()),
        message: 'Ingrese un nombre válido (mínimo 2 caracteres, solo letras)'
      },
      telefono: {
        validate: (value) => /^(\+?51)?[9][0-9]{8}$/.test(value.replace(/\s/g, '')),
        message: 'Ingrese un teléfono válido (ej: 987654321)'
      },
      fecha: {
        validate: (value) => {
          if (!value) return false;
          const date = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date >= today;
        },
        message: 'Seleccione una fecha válida'
      },
      hora: {
        validate: (value) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value),
        message: 'Seleccione una hora válida'
      },
      habitacion: {
        validate: (value) => !!value,
        message: 'Seleccione el número de habitación'
      }
    };

    // Real-time validation
    Object.keys(validators).forEach(fieldName => {
      const field = form.querySelector(`[name="${fieldName}"]`);
      if (field) {
        field.addEventListener('blur', () => {
          this.validateField(field, validators[fieldName]);
        });
      }
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Form submission started');

      const submitButton = form.querySelector('button[type="submit"]');
      const originalContent = submitButton.innerHTML;
      
      // Show loading state
      submitButton.innerHTML = `
        <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
          <path d="M22 12A10 10 0 0 0 12 2" stroke="currentColor" stroke-width="2">
            <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" values="0 12 12;360 12 12"/>
          </path>
        </svg>
        Enviando...
      `;
      submitButton.disabled = true;

      // Validate form
      const isValid = await this.validateForm(form, validators);
      
      if (isValid) {
        // Prepare and submit to WhatsApp
        setTimeout(() => {
          this.submitToWhatsApp(form);
          submitButton.innerHTML = originalContent;
          submitButton.disabled = false;
        }, 1500);
      } else {
        submitButton.innerHTML = originalContent;
        submitButton.disabled = false;
      }
    });

    console.log('Form handling setup complete');
  }

  /**
   * Populate Service Dropdown
   */
  populateServiceDropdown() {
    const serviceSelect = document.querySelector('[name="servicio"]');
    if (!serviceSelect) return;

    const services = [
      { value: 'Masaje Relajante - $48 USD', text: 'Masaje Relajante - $48 USD' },
      { value: 'Masaje Inka - $65 USD', text: 'Masaje Inka - $65 USD' },
      { value: 'Masaje Sueco - $65 USD', text: 'Masaje Sueco - $65 USD' },
      { value: 'Piedras Calientes - $75 USD', text: 'Piedras Calientes - $75 USD' }
    ];

    // Clear existing options except the first one
    const firstOption = serviceSelect.querySelector('option[value=""]');
    serviceSelect.innerHTML = '';
    if (firstOption) {
      serviceSelect.appendChild(firstOption);
    } else {
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Seleccionar servicio...';
      serviceSelect.appendChild(defaultOption);
    }

    // Add service options
    services.forEach(service => {
      const option = document.createElement('option');
      option.value = service.value;
      option.textContent = service.text;
      serviceSelect.appendChild(option);
    });

    console.log('Service dropdown populated with', services.length, 'options');
  }

  /**
   * Field Validation
   */
  validateField(field, validator) {
    const value = field.value.trim();
    const isValid = validator.validate(value);
    
    this.toggleFieldState(field, isValid, validator.message);
    return isValid;
  }

  /**
   * Complete Form Validation
   */
  async validateForm(form, validators) {
    let isValid = true;
    const errors = [];

    // Validate all fields
    for (const [fieldName, validator] of Object.entries(validators)) {
      const field = form.querySelector(`[name="${fieldName}"]`);
      if (field) {
        const fieldValid = this.validateField(field, validator);
        if (!fieldValid) {
          isValid = false;
          errors.push(fieldName);
        }
      }
    }

    // Validate service selection
    const servicioField = form.querySelector('[name="servicio"]');
    if (!servicioField.value) {
      isValid = false;
      this.toggleFieldState(servicioField, false, 'Seleccione un tipo de masaje');
      errors.push('servicio');
    }
    // Validate habitacion selection
    const habitacionField = form.querySelector('[name="habitacion"]');
    if (!habitacionField.value) {
      isValid = false;
      this.toggleFieldState(habitacionField, false, 'Seleccione el número de habitación');
      errors.push('habitacion');
    }

    if (!isValid) {
      console.log('Form validation failed:', errors);
      this.focusFirstErrorField(form);
    }

    return isValid;
  }

  /**
   * WhatsApp Submission - Fixed Version
   */
  submitToWhatsApp(form) {
    console.log('Submitting to WhatsApp...');
    
    const formData = new FormData(form);
    const data = {};
    
    // Extract form data
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    console.log('Form data collected:', data);

    // Format date
    let fechaFormatted = 'No especificada';
    if (data.fecha) {
      try {
        const date = new Date(data.fecha + 'T00:00:00');
        fechaFormatted = date.toLocaleDateString('es-PE', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (e) {
        fechaFormatted = data.fecha;
      }
    }

    // Format time
    let horaFormatted = 'No especificada';
    if (data.hora) {
      try {
        const [hours, minutes] = data.hora.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        horaFormatted = date.toLocaleTimeString('es-PE', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      } catch (e) {
        horaFormatted = data.hora;
      }
    }

  // Create WhatsApp message
  const message = `¡Hola! Quiero reservar un masaje:

🧘‍♀️ *Servicio:* ${data.servicio || 'No especificado'}
👤 *Nombre:* ${data.nombre || 'No especificado'}
📱 *Teléfono:* ${data.telefono || 'No especificado'}
📅 *Fecha:* ${fechaFormatted}
🕐 *Hora:* ${horaFormatted}
🏨 *Habitación:* ${data.habitacion || 'No especificada'}
📝 *Notas adicionales:* ${data.notas || 'Ninguna'}

¡Gracias!`;

    console.log('WhatsApp message created:', message);

    // Create WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${this.config.whatsappNumber}?text=${encodedMessage}`;
    
    console.log('WhatsApp URL:', whatsappUrl);

    // Show success message
    this.showSuccessMessage();

    // Open WhatsApp after delay
    setTimeout(() => {
      console.log('Opening WhatsApp...');
      
      // Try to open in new window first
      const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      
      // Fallback for blocked popups
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        console.log('Popup blocked, using fallback...');
        window.location.href = whatsappUrl;
      }
      
      // Track successful submission
      this.trackEvent('whatsapp_submission', { service: data.servicio });
    }, 1000);
  }

  /**
   * Navigation System
   */
  initializeNavigationSystem() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScrollY = window.scrollY;

    const handleScroll = this.throttle(() => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > this.config.scrollThreshold) {
        header.classList.add('scrolled');
        
        if (currentScrollY > lastScrollY + 10) {
          header.classList.add('hidden');
        } else if (currentScrollY < lastScrollY - 10) {
          header.classList.remove('hidden');
        }
      } else {
        header.classList.remove('scrolled', 'hidden');
      }

      lastScrollY = currentScrollY;
    }, this.config.throttleDelay);

    window.addEventListener('scroll', handleScroll);
  }

  /**
   * Advanced Animations
   */
  initializeAdvancedAnimations() {
    // Service card staggered animations
    const cards = document.querySelectorAll('.service-card');
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1 + 0.2}s`;
    });

    // Button hover effects
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-2px) scale(1.02)';
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /**
   * Responsive Handling
   */
  setupResponsiveHandling() {
    const handleResize = this.debounce(() => {
      const width = window.innerWidth;
      
      // Adjust particle count based on screen size
      if (this.state.particleSystem && width < 768) {
        this.adjustParticleCount(20);
      }
    }, 250);

    window.addEventListener('resize', handleResize);
  }

  /**
   * Performance Monitoring
   */
  setupPerformanceMonitoring() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          if (perfData) {
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
          }
        }, 1000);
      });
    }
  }

  // Utility Functions
  debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  throttle(func, delay) {
    let lastCall = 0;
    return (...args) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func.apply(this, args);
      }
    };
  }

  trackEvent(event, data = {}) {
    console.log(`Event tracked: ${event}`, data);
  }

  // UI Helper Methods
  toggleFieldState(field, isValid, message = '') {
    const errorElement = field.parentNode.querySelector('.field-error') || 
                        this.createErrorElement();
    
    if (isValid) {
      field.classList.remove('error');
      field.classList.add('valid');
      if (errorElement) errorElement.style.display = 'none';
    } else {
      field.classList.remove('valid');
      field.classList.add('error');
      errorElement.textContent = message;
      errorElement.style.display = 'block';
      if (!field.parentNode.contains(errorElement)) {
        field.parentNode.appendChild(errorElement);
      }
    }
  }

  createErrorElement() {
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.style.cssText = `
      color: var(--wine-primary);
      font-size: var(--font-size-xs);
      margin-top: var(--space-xs);
      display: none;
      font-weight: 500;
    `;
    return errorElement;
  }

  showSuccessMessage() {
    // Remove existing success messages
    document.querySelectorAll('.success-message').forEach(msg => msg.remove());

    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--white-pure);
        padding: var(--space-xl);
        border-radius: var(--border-radius-lg);
        box-shadow: 0 20px 40px rgba(114, 47, 55, 0.3);
        text-align: center;
        z-index: 10000;
        animation: successPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        max-width: 90vw;
        width: 400px;
      ">
        <div style="
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, var(--wine-primary), var(--wine-light));
          border-radius: 50%;
          margin: 0 auto var(--space-lg);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round">
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
        </div>
        <h3 style="color: var(--wine-primary); margin-bottom: var(--space-md); font-size: var(--font-size-xl); font-weight: 600;">¡Formulario Enviado!</h3>
        <p style="color: var(--gray-warm); font-size: var(--font-size-base); margin-bottom: var(--space-sm);">Abriendo WhatsApp...</p>
        <div style="
          width: 30px;
          height: 4px;
          background: var(--wine-rose);
          border-radius: 2px;
          margin: var(--space-md) auto 0;
          animation: loadingBar 1s ease infinite;
        "></div>
      </div>
    `;

    document.body.appendChild(message);
    
    setTimeout(() => {
      if (message.parentNode) {
        message.remove();
      }
    }, 5000);
  }

  updateActiveNavLink(targetId) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === targetId) {
        link.classList.add('active');
      }
    });
  }

  focusFirstErrorField(form) {
    const firstErrorField = form.querySelector('.error');
    if (firstErrorField) {
      setTimeout(() => {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }

  adjustParticleCount(newCount) {
    console.log(`Adjusting particle count to ${newCount}`);
    // Implementation would adjust the actual particle system
  }
}

// Enhanced CSS for proper functionality
const enhancedStyles = `
  <style>
    /* Field validation styles */
    .field-error {
      color: var(--wine-primary);
      font-size: var(--font-size-xs);
      margin-top: var(--space-xs);
      display: none;
      font-weight: 500;
      animation: slideDown 0.3s ease;
    }
    
    .form-control.error {
      border-color: var(--wine-primary) !important;
      box-shadow: 0 0 0 3px rgba(114, 47, 55, 0.1) !important;
    }
    
    .form-control.valid {
      border-color: var(--wine-light) !important;
    }
    
    /* Navigation active state */
    .nav-link.active {
      color: var(--wine-primary) !important;
      background: rgba(212, 165, 169, 0.2);
    }
    
    /* Enhanced particle canvas */
    .particle-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      pointer-events: none;
      opacity: 0.7;
    }
    
    /* Success message animations */
    @keyframes successPop {
      0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.5);
      }
      50% {
        transform: translate(-50%, -50%) scale(1.05);
      }
      100% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
    }
    
    @keyframes slideDown {
      0% {
        opacity: 0;
        transform: translateY(-10px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes loadingBar {
      0%, 100% {
        transform: scaleX(0.3);
        opacity: 0.5;
      }
      50% {
        transform: scaleX(1);
        opacity: 1;
      }
    }
    
    /* Button loading state */
    .btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none !important;
    }
    
    /* Service dropdown fix */
    select.form-control {
      cursor: pointer;
    }
    
    select.form-control option {
      color: var(--black-soft);
      background: var(--white-pure);
      padding: var(--space-sm);
    }
    
    /* Mobile optimizations */
    @media (max-width: 768px) {
      .form-control:focus {
        transform: none;
      }
      
      .success-message > div {
        width: 95vw !important;
        padding: var(--space-lg) !important;
      }
    }
  </style>
`;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

function initializeApp() {
  // Inject enhanced styles
  document.head.insertAdjacentHTML('beforeend', enhancedStyles);
  
  // Initialize the application
  window.massageSpaApp = new MassageSpaApp();
  
  console.log('=== Massage Spa App Fully Loaded ===');
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.massageSpaApp) {
    console.log('Cleaning up Massage Spa App');
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MassageSpaApp;
}