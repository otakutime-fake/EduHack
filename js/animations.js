// Sistema de animaciones y transiciones profesionales
// Mejora la experiencia de usuario con efectos suaves y elegantes

class AnimationSystem {
  constructor() {
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupScrollAnimations();
    this.setupHoverEffects();
    this.setupLoadingAnimations();
    this.setupPageTransitions();
  }

  // Observador de intersección para animaciones al hacer scroll
  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          entry.target.classList.remove('animate-out');
        }
      });
    }, observerOptions);

    // Observar elementos con clase 'animate-on-scroll'
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  // Animaciones de scroll suaves
  setupScrollAnimations() {
    // Parallax suave para elementos hero
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.parallax');
      
      parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    });

    // Fade in/out de la navegación
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const nav = document.querySelector('nav');
      
      if (nav) {
        if (scrollTop > lastScrollTop && scrollTop > 100) {
          nav.style.transform = 'translateY(-100%)';
        } else {
          nav.style.transform = 'translateY(0)';
        }
      }
      lastScrollTop = scrollTop;
    });
  }

  // Efectos hover mejorados
  setupHoverEffects() {
    // Efecto de elevación para tarjetas
    document.querySelectorAll('.card, .course-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
        card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '';
      });
    });

    // Efecto ripple para botones
    document.querySelectorAll('.btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        button.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
  }

  // Animaciones de carga
  setupLoadingAnimations() {
    // Animación de entrada escalonada para elementos
    const animateElements = document.querySelectorAll('.stagger-animation');
    animateElements.forEach((element, index) => {
      element.style.animationDelay = `${index * 0.1}s`;
      element.classList.add('fade-in-up');
    });

    // Contador animado para estadísticas
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target);
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      // Iniciar cuando el elemento sea visible
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            updateCounter();
            observer.unobserve(entry.target);
          }
        });
      });
      observer.observe(counter);
    });
  }

  // Transiciones entre páginas
  setupPageTransitions() {
    // Fade out al cambiar de página
    document.querySelectorAll('a[href]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Solo para enlaces internos
        if (href.startsWith('#') || href.startsWith('/') || href.includes(window.location.hostname)) {
          e.preventDefault();
          
          document.body.style.opacity = '0';
          document.body.style.transform = 'translateY(20px)';
          
          setTimeout(() => {
            window.location.href = href;
          }, 300);
        }
      });
    });

    // Fade in al cargar la página
    window.addEventListener('load', () => {
      document.body.style.opacity = '1';
      document.body.style.transform = 'translateY(0)';
    });
  }

  // Animación de escritura para texto
  typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    const type = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    };
    
    type();
  }

  // Animación de progreso para barras
  animateProgressBar(element, targetWidth, duration = 1000) {
    let width = 0;
    const increment = targetWidth / (duration / 16);
    
    const animate = () => {
      width += increment;
      if (width < targetWidth) {
        element.style.width = width + '%';
        requestAnimationFrame(animate);
      } else {
        element.style.width = targetWidth + '%';
      }
    };
    
    animate();
  }

  // Shake animation para errores
  shake(element) {
    element.classList.add('shake');
    setTimeout(() => {
      element.classList.remove('shake');
    }, 500);
  }

  // Pulse animation para notificaciones
  pulse(element) {
    element.classList.add('pulse');
    setTimeout(() => {
      element.classList.remove('pulse');
    }, 1000);
  }
}

// Inicializar el sistema de animaciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new AnimationSystem();
});

// Exportar para uso global
window.AnimationSystem = AnimationSystem;