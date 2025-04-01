// Auth Module
const Auth = (() => {
  // Private variables and functions
  const storageKeyUser = "myfans_user"
  const storageKeyToken = "myfans_token"

  // Mock user data for demo
  const mockUsers = [
    {
      id: 1,
      username: "admin",
      email: "admin@example.com",
      password: "password123",
      isAdmin: true,
      avatar: "/placeholder.svg?height=150&width=150",
      verified: true,
      verifiedType: "admin",
      balance: 1000.0,
      bio: "Content creator sharing my journey and exclusive content with my fans.",
      createdAt: "2023-01-01T00:00:00Z",
    },
    {
      id: 2,
      username: "user1",
      email: "user1@example.com",
      password: "password123",
      isAdmin: false,
      avatar: "/placeholder.svg?height=150&width=150",
      verified: true,
      verifiedType: "user",
      balance: 100.0,
      bio: "Fan and supporter of great content.",
      createdAt: "2023-02-15T00:00:00Z",
    },
  ]

  // Check if user is logged in
  function isLoggedIn() {
    return !!getToken()
  }

  // Get current user
  function getCurrentUser() {
    const userJson = localStorage.getItem(storageKeyUser)
    return userJson ? JSON.parse(userJson) : null
  }

  // Get auth token
  function getToken() {
    return localStorage.getItem(storageKeyToken)
  }

  // Login user
  function login(email, password) {
    return new Promise((resolve, reject) => {
      // Simulate API request
      setTimeout(() => {
        const user = mockUsers.find((u) => u.email === email && u.password === password)

        if (user) {
          // Remove password from user object
          const { password, ...userWithoutPassword } = user

          // Store user in localStorage
          localStorage.setItem(storageKeyUser, JSON.stringify(userWithoutPassword))

          // Generate a fake token
          const token = `fake_token_${Date.now()}`
          localStorage.setItem(storageKeyToken, token)

          // Set body class based on user role
          if (user.isAdmin) {
            document.body.classList.add("is-admin")
          } else {
            document.body.classList.remove("is-admin")
          }

          resolve(userWithoutPassword)
        } else {
          reject(new Error("Invalid email or password"))
        }
      }, 1000)
    })
  }

  // Register user
  function register(username, email, password) {
    return new Promise((resolve, reject) => {
      // Simulate API request
      setTimeout(() => {
        // Check if email already exists
        if (mockUsers.some((u) => u.email === email)) {
          reject(new Error("Email already in use"))
          return
        }

        // Check if username already exists
        if (mockUsers.some((u) => u.username === username)) {
          reject(new Error("Username already taken"))
          return
        }

        // Create new user
        const newUser = {
          id: mockUsers.length + 1,
          username,
          email,
          password,
          isAdmin: false,
          avatar: "/placeholder.svg?height=150&width=150",
          verified: false,
          balance: 0.0,
          bio: "",
          createdAt: new Date().toISOString(),
        }

        // Add to mock users
        mockUsers.push(newUser)

        // Remove password from user object
        const { password: _, ...userWithoutPassword } = newUser

        // Store user in localStorage
        localStorage.setItem(storageKeyUser, JSON.stringify(userWithoutPassword))

        // Generate a fake token
        const token = `fake_token_${Date.now()}`
        localStorage.setItem(storageKeyToken, token)

        // Set body class based on user role
        document.body.classList.remove("is-admin")

        resolve(userWithoutPassword)
      }, 1000)
    })
  }

  // Logout user
  function logout() {
    localStorage.removeItem(storageKeyUser)
    localStorage.removeItem(storageKeyToken)
    document.body.classList.remove("is-admin")

    // Redirect to login page if not already there
    if (!window.location.pathname.includes("login.html")) {
      window.location.href = "login.html"
    }
  }

  // Update user profile
  function updateProfile(userData) {
    return new Promise((resolve, reject) => {
      // Simulate API request
      setTimeout(() => {
        const currentUser = getCurrentUser()

        if (!currentUser) {
          reject(new Error("User not logged in"))
          return
        }

        // Update user data
        const updatedUser = { ...currentUser, ...userData }

        // Store updated user in localStorage
        localStorage.setItem(storageKeyUser, JSON.stringify(updatedUser))

        resolve(updatedUser)
      }, 1000)
    })
  }

  // Initialize auth state
  function init() {
    const currentUser = getCurrentUser()

    if (currentUser) {
      // Set body class based on user role
      if (currentUser.isAdmin) {
        document.body.classList.add("is-admin")
      } else {
        document.body.classList.remove("is-admin")
      }

      // If on login page and already logged in, redirect to home
      if (window.location.pathname.includes("login.html")) {
        window.location.href = "index.html"
      }
    } else {
      // If not logged in and not on login page, redirect to login
      if (!window.location.pathname.includes("login.html")) {
        window.location.href = "login.html"
      }
    }
  }

  // Public API
  return {
    isLoggedIn,
    getCurrentUser,
    getToken,
    login,
    register,
    logout,
    updateProfile,
    init,
  }
})()

// Initialize auth on page load
document.addEventListener("DOMContentLoaded", () => {
  Auth.init()

  // Setup logout button
  const logoutBtn = document.getElementById("logout-btn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      Auth.logout()
    })
  }

  // Setup login form
  const loginForm = document.getElementById("login-form")
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const email = document.getElementById("login-email").value
      const password = document.getElementById("login-password").value

      // Show loading state
      const submitBtn = loginForm.querySelector('button[type="submit"]')
      const originalBtnText = submitBtn.innerHTML
      submitBtn.disabled = true
      submitBtn.innerHTML = "Logging in..."

      Auth.login(email, password)
        .then((user) => {
          showToast("Login successful!", "success")
          setTimeout(() => {
            window.location.href = "index.html"
          }, 1000)
        })
        .catch((error) => {
          showToast(error.message, "error")
          submitBtn.disabled = false
          submitBtn.innerHTML = originalBtnText
        })
    })
  }

  // Setup signup form
  const signupForm = document.getElementById("signup-form")
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const username = document.getElementById("signup-username").value
      const email = document.getElementById("signup-email").value
      const password = document.getElementById("signup-password").value
      const confirmPassword = document.getElementById("signup-confirm-password").value

      // Validate passwords match
      if (password !== confirmPassword) {
        showToast("Passwords do not match", "error")
        return
      }

      // Show loading state
      const submitBtn = signupForm.querySelector('button[type="submit"]')
      const originalBtnText = submitBtn.innerHTML
      submitBtn.disabled = true
      submitBtn.innerHTML = "Creating account..."

      Auth.register(username, email, password)
        .then((user) => {
          showToast("Account created successfully!", "success")
          setTimeout(() => {
            window.location.href = "index.html"
          }, 1000)
        })
        .catch((error) => {
          showToast(error.message, "error")
          submitBtn.disabled = false
          submitBtn.innerHTML = originalBtnText
        })
    })
  }

  // Auth tabs (login/signup)
  const authTabs = document.querySelectorAll(".auth-tab")
  if (authTabs.length) {
    authTabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        // Remove active class from all tabs
        authTabs.forEach((t) => t.classList.remove("active"))

        // Add active class to clicked tab
        this.classList.add("active")

        // Hide all forms
        document.querySelectorAll(".auth-form").forEach((form) => {
          form.classList.remove("active")
        })

        // Show selected form
        const formId = this.getAttribute("data-tab") + "-form"
        document.getElementById(formId).classList.add("active")
      })
    })
  }

  // Show signup form
  const showSignup = document.getElementById("show-signup")
  if (showSignup) {
    showSignup.addEventListener("click", (e) => {
      e.preventDefault()
      document.getElementById("login-modal").classList.remove("active")
      document.getElementById("signup-modal").classList.add("active")
    })
  }

  // Show login form
  const showLogin = document.getElementById("show-login")
  if (showLogin) {
    showLogin.addEventListener("click", (e) => {
      e.preventDefault()
      document.getElementById("signup-modal").classList.remove("active")
      document.getElementById("login-modal").classList.add("active")
    })
  }
})

// Toast notification function
function showToast(message, type = "success") {
  const toast = document.getElementById("toast")
  const toastMessage = toast.querySelector(".toast-message")
  const toastIcon = toast.querySelector(".toast-content i")

  // Set message
  toastMessage.textContent = message

  // Set icon based on type
  if (type === "success") {
    toastIcon.className = "fas fa-check-circle"
    toastIcon.style.color = "var(--color-success)"
  } else if (type === "error") {
    toastIcon.className = "fas fa-exclamation-circle"
    toastIcon.style.color = "var(--color-danger)"
  } else if (type === "warning") {
    toastIcon.className = "fas fa-exclamation-triangle"
    toastIcon.style.color = "var(--color-warning)"
  } else if (type === "info") {
    toastIcon.className = "fas fa-info-circle"
    toastIcon.style.color = "var(--color-info)"
  }

  // Show toast
  toast.classList.add("show")

  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show")
  }, 3000)
}

