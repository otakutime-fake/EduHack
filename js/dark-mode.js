// Sistema de modo oscuro profesional con persistencia y transiciones suaves
// Maneja el tema de toda la aplicación de forma consistente

class DarkModeSystem {
  constructor() {
    this.storageKey = 'eduplatform-theme';
    this.darkClass = 'dark';
    this.transitionClass = 'theme-transition';
    this.init();
  }

  init() {
    this.loadTheme();
    this.setupToggleButtons();
    this.setupSystemThemeDetection();
    this.setupTransitions();
    this.setupAlpineStore();
  }

  // Cargar tema guardado o detectar preferencia del sistema
  loadTheme() {
    const savedTheme = localStorage.getItem(this.storageKey);
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let isDark;
    
    if (savedTheme) {
      isDark = savedTheme === 'dark';
    } else {
      // Establecer modo oscuro como predeterminado
      isDark = true;
    }
    
    this.setTheme(isDark, false); // false = sin animación inicial
    
    // Guardar el tema predeterminado si no existe preferencia guardada
    if (!savedTheme) {
      localStorage.setItem(this.storageKey, 'dark');
    }
  }

  // Establecer tema con o sin animación
  setTheme(isDark, animate = true) {
    const html = document.documentElement;
    const body = document.body;
    
    if (animate) {
      // Agregar clase de transición
      body.classList.add(this.transitionClass);
      
      // Remover después de la transición
      setTimeout(() => {
        body.classList.remove(this.transitionClass);
      }, 300);
    }
    
    if (isDark) {
      html.classList.add(this.darkClass);
      body.classList.add(this.darkClass);
    } else {
      html.classList.remove(this.darkClass);
      body.classList.remove(this.darkClass);
    }
    
    // Guardar preferencia
    localStorage.setItem(this.storageKey, isDark ? 'dark' : 'light');
    
    // Actualizar Alpine.js store si existe
    if (window.Alpine && window.Alpine.store('darkMode')) {
      window.Alpine.store('darkMode').isDark = isDark;
    }
    
    // Disparar evento personalizado
    window.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { isDark, theme: isDark ? 'dark' : 'light' }
    }));
    
    // Actualizar meta theme-color
    this.updateThemeColor(isDark);
  }

  // Alternar tema
  toggle() {
    const isDark = document.documentElement.classList.contains(this.darkClass);
    this.setTheme(!isDark, true);
  }

  // Obtener tema actual
  getCurrentTheme() {
    return document.documentElement.classList.contains(this.darkClass) ? 'dark' : 'light';
  }

  // Verificar si está en modo oscuro
  isDarkMode() {
    return document.documentElement.classList.contains(this.darkClass);
  }

  // Configurar botones de alternancia
  setupToggleButtons() {
    // Buscar todos los botones de toggle
    const toggleButtons = document.querySelectorAll('[data-theme-toggle]');
    
    toggleButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle();
        
        // Efecto visual en el botón
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
          button.style.transform = 'scale(1)';
        }, 150);
      });
    });
    
    // Actualizar iconos inicialmente
    this.updateToggleIcons();
    
    // Escuchar cambios de tema para actualizar iconos
    window.addEventListener('themeChanged', () => {
      this.updateToggleIcons();
    });
  }

  // Actualizar iconos de los botones toggle
  updateToggleIcons() {
    const isDark = this.isDarkMode();
    const toggleButtons = document.querySelectorAll('[data-theme-toggle]');
    
    toggleButtons.forEach(button => {
      const lightIcon = button.querySelector('[data-light-icon]');
      const darkIcon = button.querySelector('[data-dark-icon]');
      
      if (lightIcon && darkIcon) {
        if (isDark) {
          lightIcon.style.display = 'inline';
          darkIcon.style.display = 'none';
        } else {
          lightIcon.style.display = 'none';
          darkIcon.style.display = 'inline';
        }
      } else {
        // Fallback para botones simples
        button.textContent = isDark ? '☀️' : '🌙';
      }
    });
  }

  // Detectar cambios en la preferencia del sistema
  setupSystemThemeDetection() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
      // Solo cambiar si no hay preferencia guardada
      const savedTheme = localStorage.getItem(this.storageKey);
      if (!savedTheme) {
        this.setTheme(e.matches, true);
      }
    });
  }

  // Configurar transiciones suaves
  setupTransitions() {
    // Agregar estilos de transición
    const style = document.createElement('style');
    style.textContent = `
      .theme-transition,
      .theme-transition *,
      .theme-transition *:before,
      .theme-transition *:after {
        transition: background-color 0.3s ease, 
                   border-color 0.3s ease, 
                   color 0.3s ease, 
                   fill 0.3s ease, 
                   stroke 0.3s ease,
                   box-shadow 0.3s ease !important;
        transition-delay: 0s !important;
      }
      
      /* Transiciones específicas para elementos comunes */
      .card, .btn, .nav-link, .form-input {
        transition: background-color 0.3s ease, 
                   border-color 0.3s ease, 
                   color 0.3s ease,
                   box-shadow 0.3s ease;
      }
      
      /* Evitar transiciones en elementos que no las necesitan */
      .no-transition,
      .no-transition * {
        transition: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Actualizar meta theme-color para navegadores móviles
  updateThemeColor(isDark) {
    let themeColorMeta = document.querySelector('meta[name="theme-color"]');
    
    if (!themeColorMeta) {
      themeColorMeta = document.createElement('meta');
      themeColorMeta.name = 'theme-color';
      document.head.appendChild(themeColorMeta);
    }
    
    themeColorMeta.content = isDark ? '#1f2937' : '#ffffff';
  }

  // Configurar Alpine.js store
  setupAlpineStore() {
    // Esperar a que Alpine.js esté disponible
    document.addEventListener('alpine:init', () => {
      if (window.Alpine) {
        window.Alpine.store('darkMode', {
          isDark: this.isDarkMode(),
          toggle: () => this.toggle(),
          setTheme: (isDark) => this.setTheme(isDark, true),
          getCurrentTheme: () => this.getCurrentTheme()
        });
      }
    });
  }

  // Método para forzar recálculo de estilos (útil para componentes dinámicos)
  refreshStyles() {
    const isDark = this.isDarkMode();
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
  }

  // Obtener colores del tema actual
  getThemeColors() {
    const isDark = this.isDarkMode();
    
    return {
      primary: isDark ? '#3b82f6' : '#2563eb',
      secondary: isDark ? '#8b5cf6' : '#7c3aed',
      background: isDark ? '#1f2937' : '#ffffff',
      surface: isDark ? '#374151' : '#f9fafb',
      text: isDark ? '#f9fafb' : '#1f2937',
      textSecondary: isDark ? '#d1d5db' : '#6b7280'
    };
  }

  // Aplicar tema a elementos específicos
  applyThemeToElement(element, customColors = {}) {
    const colors = { ...this.getThemeColors(), ...customColors };
    const isDark = this.isDarkMode();
    
    element.style.backgroundColor = colors.background;
    element.style.color = colors.text;
    
    if (isDark) {
      element.classList.add('dark');
    } else {
      element.classList.remove('dark');
    }
  }

  // Método para debugging
  debug() {
    console.log('Dark Mode System Debug:', {
      currentTheme: this.getCurrentTheme(),
      isDark: this.isDarkMode(),
      savedTheme: localStorage.getItem(this.storageKey),
      systemPreference: window.matchMedia('(prefers-color-scheme: dark)').matches,
      themeColors: this.getThemeColors()
    });
  }
}

// Inicializar el sistema cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.darkModeSystem = new DarkModeSystem();
});

// Exportar para uso global
window.DarkModeSystem = DarkModeSystem;

// Función de conveniencia global
window.toggleDarkMode = () => {
  if (window.darkModeSystem) {
    window.darkModeSystem.toggle();
  }
};

// Función para obtener el tema actual
window.getCurrentTheme = () => {
  return window.darkModeSystem ? window.darkModeSystem.getCurrentTheme() : 'light';
};

// Función para verificar si está en modo oscuro
window.isDarkMode = () => {
  return window.darkModeSystem ? window.darkModeSystem.isDarkMode() : false;
};