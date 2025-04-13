// Theme Module
const Theme = (() => {
  // Private variables and functions
  const storageKey = "myfans_theme"
  const darkModeClass = "dark-mode"
  const lightModeClass = "light-mode"

  // Get current theme
  function getCurrentTheme() {
    return localStorage.getItem(storageKey) || "light"
  }

  // Set theme
  function setTheme(theme) {
    localStorage.setItem(storageKey, theme)

    if (theme === "dark") {
      document.body.classList.remove(lightModeClass)
      document.body.classList.add(darkModeClass)
      updateThemeToggleIcons("dark")
    } else {
      document.body.classList.remove(darkModeClass)
      document.body.classList.add(lightModeClass)
      updateThemeToggleIcons("light")
    }
  }

  // Toggle theme
  function toggleTheme() {
    const currentTheme = getCurrentTheme()
    const newTheme = currentTheme === "light" ? "dark" : "light"
    setTheme(newTheme)
    return newTheme
  }

  // Update theme toggle icons
  function updateThemeToggleIcons(theme) {
    const themeToggles = document.querySelectorAll("#theme-toggle-btn")

    themeToggles.forEach((toggle) => {
      const icon = toggle.querySelector("i")

      if (theme === "dark") {
        icon.className = "fas fa-sun"
      } else {
        icon.className = "fas fa-moon"
      }
    })
  }

  // Initialize theme
  function init() {
    const savedTheme = getCurrentTheme()
    setTheme(savedTheme)

    // Setup theme toggle buttons
    const themeToggles = document.querySelectorAll("#theme-toggle-btn")

    themeToggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        toggleTheme()
      })
    })
  }

  // Public API
  return {
    getCurrentTheme,
    setTheme,
    toggleTheme,
    init,
  }
})()

// Initialize theme on page load
document.addEventListener("DOMContentLoaded", () => {
  Theme.init()
})



// Theme toggle functionality for MyFans

document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
  
  // Initialize
  initTheme();
  
  function initTheme() {
    // Check saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      // Apply saved theme
      document.body.className = savedTheme;
      updateThemeIcon(savedTheme);
    } else {
      // Check system preference
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const defaultTheme = prefersDarkMode ? 'dark-mode' : 'light-mode';
      
      // Apply default theme
      document.body.className = defaultTheme;
      localStorage.setItem('theme', defaultTheme);
      updateThemeIcon(defaultTheme);
    }
    
    // Set up event listeners
    setupEventListeners();
  }
  
  function setupEventListeners() {
    // Theme toggle button
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', toggleTheme);
    }
    
    // System theme change
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      const newTheme = e.matches ? 'dark-mode' : 'light-mode';
      document.body.className = newTheme;
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }
  
  // Toggle between light and dark mode
  function toggleTheme() {
    const currentTheme = document.body.className;
    const newTheme = currentTheme === 'light-mode' ? 'dark-mode' : 'light-mode';
    
    // Apply new theme
    document.body.className = newTheme;
    
    // Save preference
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    updateThemeIcon(newTheme);
  }
  
  // Update the theme toggle icon
  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    
    if (theme === 'dark-mode') {
      themeIcon.className = 'fas fa-sun';
    } else {
      themeIcon.className = 'fas fa-moon';
    }
  }
});