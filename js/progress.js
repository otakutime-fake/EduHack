// Sistema de seguimiento de progreso por usuario
class ProgressSystem {
  constructor() {
    this.userProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
    this.achievements = JSON.parse(localStorage.getItem('userAchievements') || '[]');
    this.streaks = JSON.parse(localStorage.getItem('learningStreaks') || '{}');
    this.init();
  }

  init() {
    // Initialize progress tracking for current user
    if (window.authSystem && window.authSystem.isLoggedIn()) {
      const currentUser = window.authSystem.getCurrentUser();
      if (currentUser && !this.userProgress[currentUser.email]) {
        this.userProgress[currentUser.email] = {
          coursesCompleted: [],
          routesCompleted: [],
          totalWatchTime: 0,
          lastActivity: new Date().toISOString(),
          level: 1,
          experience: 0,
          coursesInProgress: {},
          routesInProgress: {},
          dailyGoal: 30, // minutes
          weeklyGoal: 210, // minutes
          currentStreak: 0,
          longestStreak: 0
        };
        this.saveProgress();
      }
    }
  }

  getCurrentUserProgress() {
    if (!window.authSystem || !window.authSystem.isLoggedIn()) {
      return null;
    }
    const currentUser = window.authSystem.getCurrentUser();
    return this.userProgress[currentUser.email] || null;
  }

  updateCourseProgress(courseId, progressPercent, watchTime = 0) {
    const userProgress = this.getCurrentUserProgress();
    if (!userProgress) return;

    const currentUser = window.authSystem.getCurrentUser();
    
    // Update course progress
    userProgress.coursesInProgress[courseId] = {
      progress: progressPercent,
      lastWatched: new Date().toISOString(),
      totalWatchTime: (userProgress.coursesInProgress[courseId]?.totalWatchTime || 0) + watchTime
    };

    // Add watch time to total
    userProgress.totalWatchTime += watchTime;
    userProgress.lastActivity = new Date().toISOString();

    // Check if course is completed
    if (progressPercent >= 100 && !userProgress.coursesCompleted.includes(courseId)) {
      this.completeCourse(courseId);
    }

    // Update daily streak
    this.updateDailyStreak();

    // Add experience points
    this.addExperience(Math.floor(watchTime / 5)); // 1 XP per 5 minutes

    this.saveProgress();
    this.checkAchievements();
  }

  updateRouteProgress(routeId, progressPercent) {
    const userProgress = this.getCurrentUserProgress();
    if (!userProgress) return;

    userProgress.routesInProgress[routeId] = {
      progress: progressPercent,
      lastUpdated: new Date().toISOString()
    };

    // Check if route is completed
    if (progressPercent >= 100 && !userProgress.routesCompleted.includes(routeId)) {
      this.completeRoute(routeId);
    }

    this.saveProgress();
    this.checkAchievements();
  }

  completeCourse(courseId) {
    const userProgress = this.getCurrentUserProgress();
    if (!userProgress) return;

    userProgress.coursesCompleted.push(courseId);
    this.addExperience(100); // Bonus XP for completing course
    
    // Remove from in-progress
    delete userProgress.coursesInProgress[courseId];

    window.showNotification('¡Felicidades! Has completado el curso', 'success');
    this.saveProgress();
    this.checkAchievements();
  }

  completeRoute(routeId) {
    const userProgress = this.getCurrentUserProgress();
    if (!userProgress) return;

    userProgress.routesCompleted.push(routeId);
    this.addExperience(500); // Bonus XP for completing route
    
    // Remove from in-progress
    delete userProgress.routesInProgress[routeId];

    window.showNotification('¡Increíble! Has completado una ruta completa', 'success');
    this.saveProgress();
    this.checkAchievements();
  }

  addExperience(xp) {
    const userProgress = this.getCurrentUserProgress();
    if (!userProgress) return;

    userProgress.experience += xp;
    
    // Check for level up
    const newLevel = this.calculateLevel(userProgress.experience);
    if (newLevel > userProgress.level) {
      userProgress.level = newLevel;
      window.showNotification(`¡Nivel ${newLevel} alcanzado!`, 'success');
    }
  }

  calculateLevel(experience) {
    // Level formula: level = floor(sqrt(experience / 100)) + 1
    return Math.floor(Math.sqrt(experience / 100)) + 1;
  }

  getExperienceForNextLevel(currentLevel) {
    return Math.pow(currentLevel, 2) * 100;
  }

  updateDailyStreak() {
    const userProgress = this.getCurrentUserProgress();
    if (!userProgress) return;

    const today = new Date().toDateString();
    const lastActivity = new Date(userProgress.lastActivity).toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (lastActivity === today) {
      // Already counted today
      return;
    } else if (lastActivity === yesterday) {
      // Continuing streak
      userProgress.currentStreak += 1;
    } else {
      // Streak broken, start new
      userProgress.currentStreak = 1;
    }

    // Update longest streak
    if (userProgress.currentStreak > userProgress.longestStreak) {
      userProgress.longestStreak = userProgress.currentStreak;
    }
  }

  getDailyProgress() {
    const userProgress = this.getCurrentUserProgress();
    if (!userProgress) return { minutes: 0, goal: 30, percentage: 0 };

    const today = new Date().toDateString();
    const todayWatchTime = this.getTodayWatchTime();
    
    return {
      minutes: todayWatchTime,
      goal: userProgress.dailyGoal,
      percentage: Math.min(100, (todayWatchTime / userProgress.dailyGoal) * 100)
    };
  }

  getWeeklyProgress() {
    const userProgress = this.getCurrentUserProgress();
    if (!userProgress) return { minutes: 0, goal: 210, percentage: 0 };

    const weekWatchTime = this.getWeekWatchTime();
    
    return {
      minutes: weekWatchTime,
      goal: userProgress.weeklyGoal,
      percentage: Math.min(100, (weekWatchTime / userProgress.weeklyGoal) * 100)
    };
  }

  getTodayWatchTime() {
    // This would need to be implemented with more detailed tracking
    // For now, return a simulated value
    return Math.floor(Math.random() * 60);
  }

  getWeekWatchTime() {
    // This would need to be implemented with more detailed tracking
    // For now, return a simulated value
    return Math.floor(Math.random() * 300);
  }

  checkAchievements() {
    const userProgress = this.getCurrentUserProgress();
    if (!userProgress) return;

    const currentUser = window.authSystem.getCurrentUser();
    const userAchievements = this.achievements.filter(a => a.userId === currentUser.email);
    
    const possibleAchievements = [
      {
        id: 'first_course',
        name: 'Primer Curso',
        description: 'Completa tu primer curso',
        condition: () => userProgress.coursesCompleted.length >= 1,
        icon: '🎓'
      },
      {
        id: 'course_master',
        name: 'Maestro de Cursos',
        description: 'Completa 10 cursos',
        condition: () => userProgress.coursesCompleted.length >= 10,
        icon: '👨‍🎓'
      },
      {
        id: 'first_route',
        name: 'Primera Ruta',
        description: 'Completa tu primera ruta de aprendizaje',
        condition: () => userProgress.routesCompleted.length >= 1,
        icon: '🛤️'
      },
      {
        id: 'streak_week',
        name: 'Semana Consistente',
        description: 'Mantén una racha de 7 días',
        condition: () => userProgress.currentStreak >= 7,
        icon: '🔥'
      },
      {
        id: 'level_10',
        name: 'Nivel 10',
        description: 'Alcanza el nivel 10',
        condition: () => userProgress.level >= 10,
        icon: '⭐'
      },
      {
        id: 'night_owl',
        name: 'Búho Nocturno',
        description: 'Estudia después de las 10 PM',
        condition: () => new Date().getHours() >= 22,
        icon: '🦉'
      }
    ];

    possibleAchievements.forEach(achievement => {
      const alreadyEarned = userAchievements.some(a => a.achievementId === achievement.id);
      if (!alreadyEarned && achievement.condition()) {
        this.unlockAchievement(achievement);
      }
    });
  }

  unlockAchievement(achievement) {
    const currentUser = window.authSystem.getCurrentUser();
    
    this.achievements.push({
      userId: currentUser.email,
      achievementId: achievement.id,
      name: achievement.name,
      description: achievement.description,
      icon: achievement.icon,
      unlockedAt: new Date().toISOString()
    });

    localStorage.setItem('userAchievements', JSON.stringify(this.achievements));
    
    // Show achievement notification
    this.showAchievementNotification(achievement);
  }

  showAchievementNotification(achievement) {
    // Create custom achievement notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    notification.innerHTML = `
      <div class="flex items-center space-x-3">
        <span class="text-2xl">${achievement.icon}</span>
        <div>
          <h4 class="font-bold">¡Logro Desbloqueado!</h4>
          <p class="text-sm">${achievement.name}</p>
          <p class="text-xs opacity-90">${achievement.description}</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);
    
    // Animate out after 5 seconds
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 5000);
  }

  getUserStats() {
    const userProgress = this.getCurrentUserProgress();
    if (!userProgress) return null;

    const currentUser = window.authSystem.getCurrentUser();
    const userAchievements = this.achievements.filter(a => a.userId === currentUser.email);
    
    return {
      level: userProgress.level,
      experience: userProgress.experience,
      experienceForNext: this.getExperienceForNextLevel(userProgress.level),
      coursesCompleted: userProgress.coursesCompleted.length,
      routesCompleted: userProgress.routesCompleted.length,
      totalWatchTime: userProgress.totalWatchTime,
      currentStreak: userProgress.currentStreak,
      longestStreak: userProgress.longestStreak,
      achievements: userAchievements.length,
      dailyProgress: this.getDailyProgress(),
      weeklyProgress: this.getWeeklyProgress()
    };
  }

  saveProgress() {
    localStorage.setItem('userProgress', JSON.stringify(this.userProgress));
  }

  // Method to simulate course watching (for demo purposes)
  simulateWatching(courseId, minutes) {
    const currentProgress = this.getCurrentUserProgress()?.coursesInProgress[courseId]?.progress || 0;
    const newProgress = Math.min(100, currentProgress + (minutes * 2)); // 2% per minute
    this.updateCourseProgress(courseId, newProgress, minutes);
  }
}

// Initialize progress system
window.progressSystem = new ProgressSystem();

// Global functions for easy access
window.updateCourseProgress = (courseId, progress, watchTime) => {
  window.progressSystem.updateCourseProgress(courseId, progress, watchTime);
};

window.updateRouteProgress = (routeId, progress) => {
  window.progressSystem.updateRouteProgress(routeId, progress);
};

window.getUserStats = () => {
  return window.progressSystem.getUserStats();
};

window.simulateWatching = (courseId, minutes) => {
  window.progressSystem.simulateWatching(courseId, minutes);
};