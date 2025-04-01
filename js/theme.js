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

