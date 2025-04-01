// Main JavaScript file for common functionality

// Mock Auth object for demonstration purposes.  Replace with actual Auth implementation.
const Auth = {
  getCurrentUser: () => {
    // Replace with actual authentication logic
    return { isAdmin: false } // Default to non-admin
  },
}

document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      document.body.classList.toggle("mobile-menu-open")
    })
  }

  // Close modals when ESC key is pressed
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const activeModals = document.querySelectorAll(".modal.active")
      activeModals.forEach((modal) => {
        modal.classList.remove("active")
      })
    }
  })

  // Check if user is admin and set appropriate class
  const currentUser = Auth.getCurrentUser()
  if (currentUser && currentUser.isAdmin) {
    document.body.classList.add("is-admin")
  } else {
    document.body.classList.remove("is-admin")
  }
})

// Helper function to format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount)
}

// Helper function to format date
function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

// Helper function to format time
function formatTime(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date)
}

// Helper function to format date and time
function formatDateTime(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date)
}

// Helper function to truncate text
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

// Helper function to generate random ID
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Helper function to debounce function calls
function debounce(func, wait) {
  let timeout
  return function (...args) {
    
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

// Helper function to throttle function calls
function throttle(func, limit) {
  let inThrottle
  return function (...args) {
    
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

