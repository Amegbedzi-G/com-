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