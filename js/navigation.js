// Sistema de navegación profesional y responsive
class NavigationSystem {
  constructor() {
    this.init();
  }

  init() {
    this.createNavigationHTML();
    this.setupEventListeners();
    this.setupMobileMenu();
    this.setupScrollBehavior();
    this.highlightCurrentPage();
    // Configurar Alpine.js stores
    this.setupAlpineStores();
  }

  setupAlpineStores() {
    document.addEventListener('alpine:init', () => {
      if (window.Alpine) {
        // Store para el modo oscuro (integrado con DarkModeSystem)
        window.Alpine.store('darkMode', {
          isDark: false, // Se actualizará por DarkModeSystem
          
          toggle() {
            if (window.darkModeSystem) {
              window.darkModeSystem.toggle();
            }
          },
          
          setTheme(isDark) {
            if (window.darkModeSystem) {
              window.darkModeSystem.setTheme(isDark);
            }
          },
          
          getCurrentTheme() {
            return window.darkModeSystem ? window.darkModeSystem.getCurrentTheme() : 'light';
          }
        });
      }
    });
  }

  createNavigationHTML() {
    const nav = document.createElement('nav');
    nav.className = 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-700 transition-all duration-300';
    // Insertar navegación al inicio del body
    document.body.insertBefore(nav, document.body.firstChild);
    
    // Agregar padding-top al body para compensar la navegación fija
    document.body.style.paddingTop = '64px';
  }

  setupEventListeners() {
    // Toggle modo oscuro
    const themeToggle = document.getElementById('theme-toggle');
    const lightIcon = themeToggle.querySelector('.theme-icon-light');
    const darkIcon = themeToggle.querySelector('.theme-icon-dark');
    
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('darkMode', isDark);
      
      if (isDark) {
        lightIcon.classList.add('hidden');
        darkIcon.classList.remove('hidden');
      } else {
        lightIcon.classList.remove('hidden');
        darkIcon.classList.add('hidden');
      }
    });
    
    // Cargar preferencia de tema
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
      document.documentElement.classList.add('dark');
      lightIcon.classList.add('hidden');
      darkIcon.classList.remove('hidden');
    }
  }

  setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerIcon = mobileMenuToggle.querySelector('.hamburger-icon');
    const closeIcon = mobileMenuToggle.querySelector('.close-icon');
    
    mobileMenuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('hidden');
      
      if (!isOpen) {
        hamburgerIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
        mobileMenu.classList.add('animate-slide-down');
      } else {
        hamburgerIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
        mobileMenu.classList.remove('animate-slide-down');
      }
    });
    
    // Cerrar menú móvil al hacer clic en un enlace
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        hamburgerIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
      });
    });
  }

  setupScrollBehavior() {
    let lastScrollY = window.scrollY;
    const nav = document.getElementById('main-navigation');
    
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide nav
        nav.style.transform = 'translateY(-100%)';
      } else {
        // Scrolling up - show nav
        nav.style.transform = 'translateY(0)';
      }
      
      lastScrollY = currentScrollY;
    });
  }

  highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (currentPath.includes(href) || (href === '/index.html' && currentPath === '/'))) {
        link.classList.add('active');
      }
    });
  }

  // Método para crear breadcrumbs dinámicos
  createBreadcrumbs(items) {
    const breadcrumbContainer = document.createElement('div');
    breadcrumbContainer.className = 'breadcrumbs bg-gray-50 dark:bg-gray-800 py-3 border-b border-gray-200 dark:border-gray-700';
    breadcrumbContainer.style.marginTop = '64px';
    
    const breadcrumbHTML = `
      <div class="container mx-auto px-4">
        <nav class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          ${items.map((item, index) => {
            const isLast = index === items.length - 1;
            return `
              ${index > 0 ? '<span>/</span>' : ''}
              ${isLast 
                ? `<span class="text-gray-900 dark:text-gray-100 font-medium">${item.text}</span>`
                : `<a href="${item.href}" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">${item.text}</a>`
              }
            `;
          }).join('')}
        </nav>
      </div>
    `;
    
    breadcrumbContainer.innerHTML = breadcrumbHTML;
    
    // Insertar después de la navegación
    const nav = document.getElementById('main-navigation');
    nav.parentNode.insertBefore(breadcrumbContainer, nav.nextSibling);
    
    // Ajustar padding del body
    document.body.style.paddingTop = '112px';
  }
}

// Inicializar navegación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new NavigationSystem();
});

// Exportar para uso en otras páginas
window.NavigationSystem = NavigationSystem;