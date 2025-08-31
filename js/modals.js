// Sistema de Modales para EduHack
class ModalSystem {
  constructor() {
    this.activeModal = null;
    this.init();
  }

  init() {
    this.createModals();
    this.setupEventListeners();
  }

  createModals() {
    // Modal de Login
    const loginModal = this.createLoginModal();
    document.body.appendChild(loginModal);

    // Modal de Registro
    const registerModal = this.createRegisterModal();
    document.body.appendChild(registerModal);

    // Modal de Perfil
    const profileModal = this.createProfileModal();
    document.body.appendChild(profileModal);
  }

  createLoginModal() {
    const modal = document.createElement('div');
    modal.setAttribute('data-modal', 'login');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center hidden';
    modal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 scale-95 opacity-0" data-modal-content>
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Iniciar Sesión</h2>
            <span data-modal-close class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl cursor-pointer">&times;</span>
          </div>
          
          <form onsubmit="handleLogin(event)" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input type="email" name="email" required 
                     class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                     placeholder="tu@email.com">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contraseña</label>
              <input type="password" name="password" required 
                     class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                     placeholder="••••••••">
            </div>
            
            <div class="flex items-center justify-between">
              <label class="flex items-center">
                <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">Recordarme</span>
              </label>
              <a href="#" class="text-sm text-blue-600 hover:text-blue-500">¿Olvidaste tu contraseña?</a>
            </div>
            
            <button type="submit" 
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors duration-200">
              Iniciar Sesión
            </button>
          </form>
          
          <div class="mt-6 text-center">
            <p class="text-gray-600 dark:text-gray-400">¿No tienes cuenta? 
              <a data-modal-switch="register" class="text-blue-600 hover:text-blue-500 font-medium cursor-pointer">Regístrate aquí</a>
            </p>
          </div>
          
          <div class="mt-4">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white dark:bg-gray-800 text-gray-500">Cuenta de prueba</span>
              </div>
            </div>
            <div class="mt-4 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <p class="font-medium mb-1">Admin:</p>
              <p>Email: admin@eduhack.com</p>
              <p>Contraseña: EduHack2024!</p>
            </div>
          </div>
        </div>
      </div>
    `;
    return modal;
  }

  createRegisterModal() {
    const modal = document.createElement('div');
    modal.setAttribute('data-modal', 'register');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center hidden';
    modal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 scale-95 opacity-0" data-modal-content>
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Crear Cuenta</h2>
            <span data-modal-close class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl cursor-pointer">&times;</span>
          </div>
          
          <form onsubmit="handleRegister(event)" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre completo</label>
              <input type="text" name="name" required 
                     class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                     placeholder="Tu nombre completo">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input type="email" name="email" required 
                     class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                     placeholder="tu@email.com">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contraseña</label>
              <input type="password" name="password" required 
                     class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                     placeholder="••••••••">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirmar contraseña</label>
              <input type="password" name="confirmPassword" required 
                     class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                     placeholder="••••••••">
            </div>
            
            <div class="flex items-center">
              <input type="checkbox" required class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
              <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
                Acepto los <a href="#" class="text-blue-600 hover:text-blue-500">términos y condiciones</a>
              </span>
            </div>
            
            <button type="submit" 
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors duration-200">
              Crear Cuenta
            </button>
          </form>
          
          <div class="mt-6 text-center">
            <p class="text-gray-600 dark:text-gray-400">¿Ya tienes cuenta? 
              <a data-modal-switch="login" class="text-blue-600 hover:text-blue-500 font-medium cursor-pointer">Inicia sesión aquí</a>
            </p>
          </div>
        </div>
      </div>
    `;
    return modal;
  }

  createProfileModal() {
    const modal = document.createElement('div');
    modal.setAttribute('data-modal', 'profile');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center hidden';
    modal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 opacity-0" data-modal-content>
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Mi Perfil</h2>
            <span data-modal-close class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl cursor-pointer">&times;</span>
          </div>
          
          <div id="profile-content">
            <!-- El contenido se cargará dinámicamente -->
          </div>
        </div>
      </div>
    `;
    return modal;
  }

  setupEventListeners() {
    // Cerrar modales
    document.addEventListener('click', (e) => {
      if (e.target.hasAttribute('data-modal-close') || e.target.hasAttribute('data-modal')) {
        this.closeModal();
      }
    });

    // Cambiar entre modales
    document.addEventListener('click', (e) => {
      if (e.target.hasAttribute('data-modal-switch')) {
        const targetModal = e.target.getAttribute('data-modal-switch');
        this.closeModal();
        setTimeout(() => this.openModal(targetModal), 150);
      }
    });

    // Abrir modales
    document.addEventListener('click', (e) => {
      if (e.target.hasAttribute('data-modal-open')) {
        const targetModal = e.target.getAttribute('data-modal-open');
        this.openModal(targetModal);
      }
    });

    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.closeModal();
      }
    });
  }

  openModal(modalName) {
    const modal = document.querySelector(`[data-modal="${modalName}"]`);
    if (!modal) return;

    // Cargar contenido dinámico si es necesario
    if (modalName === 'profile') {
      this.loadProfileContent(modal);
    }

    this.activeModal = modal;
    modal.classList.remove('hidden');
    
    // Animar entrada
    setTimeout(() => {
      const content = modal.querySelector('[data-modal-content]');
      content.classList.remove('scale-95', 'opacity-0');
      content.classList.add('scale-100', 'opacity-100');
    }, 10);

    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    if (!this.activeModal) return;

    const content = this.activeModal.querySelector('[data-modal-content]');
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
      this.activeModal.classList.add('hidden');
      this.activeModal = null;
      document.body.style.overflow = '';
    }, 150);
  }

  loadProfileContent(modal) {
    const user = window.authSystem?.currentUser;
    if (!user) return;

    const stats = window.authSystem.getUserStats();
    const content = modal.querySelector('#profile-content');
    
    content.innerHTML = `
      <div class="space-y-6">
        <!-- Header del perfil -->
        <div class="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white">
          <img src="${user.avatar}" alt="Avatar" class="w-16 h-16 rounded-full border-2 border-white">
          <div>
            <h3 class="text-xl font-bold">${user.name}</h3>
            <p class="text-blue-100">${user.email}</p>
            <span class="inline-block px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs font-medium mt-1">
              ${user.role === 'admin' ? 'Administrador' : 'Estudiante'}
            </span>
          </div>
        </div>

        <!-- Estadísticas -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">${stats.totalCourses}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Cursos</div>
          </div>
          <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">${stats.completedCourses}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Completados</div>
          </div>
          <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">${stats.inProgressCourses}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">En Progreso</div>
          </div>
          <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">${stats.totalProgress}%</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Progreso</div>
          </div>
        </div>

        <!-- Información del perfil -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Información Personal</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre</label>
              <input type="text" value="${user.name}" 
                     class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input type="email" value="${user.email}" disabled
                     class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-gray-300">
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Biografía</label>
            <textarea rows="3" placeholder="Cuéntanos sobre ti..."
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">${user.profile?.bio || ''}</textarea>
          </div>
        </div>

        <!-- Cursos recientes -->
        ${stats.totalCourses > 0 ? `
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Cursos Recientes</h4>
          <div class="space-y-2">
            ${user.profile.enrolledCourses.slice(0, 3).map(courseId => `
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">Curso ${courseId}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Progreso: ${user.profile.progress[courseId]?.progress || 0}%</div>
                </div>
                <div class="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                  <div class="h-full bg-blue-500 rounded-full" style="width: ${user.profile.progress[courseId]?.progress || 0}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <!-- Botones de acción -->
        <div class="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <button class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors">
            Guardar Cambios
          </button>
          <button onclick="handleLogout()" class="px-6 py-2 border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900 rounded-lg font-medium transition-colors">
            Cerrar Sesión
          </button>
        </div>
      </div>
    `;
  }
}

// Inicializar sistema de modales
const modalSystem = new ModalSystem();

// Exportar para uso global
window.modalSystem = modalSystem;