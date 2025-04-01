// Auth Module
const Auth = (() => {
  const storageKeyUser = "myfans_user";
  const storageKeyToken = "myfans_token";

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
  ];

  function isLoggedIn() {
    return !!getToken();
  }

  function getCurrentUser() {
    const userJson = localStorage.getItem(storageKeyUser);
    return userJson ? JSON.parse(userJson) : null;
  }

  function getToken() {
    return localStorage.getItem(storageKeyToken);
  }

  function login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find((u) => u.email === email && u.password === password);

        if (user) {
          const { password, ...userWithoutPassword } = user;
          localStorage.setItem(storageKeyUser, JSON.stringify(userWithoutPassword));
          const token = `fake_token_${Date.now()}`;
          localStorage.setItem(storageKeyToken, token);
          resolve(userWithoutPassword);
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 1000);
    });
  }

  function register(username, email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (mockUsers.some((u) => u.email === email)) {
          reject(new Error("Email already in use"));
          return;
        }

        if (mockUsers.some((u) => u.username === username)) {
          reject(new Error("Username already taken"));
          return;
        }

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
        };

        mockUsers.push(newUser);
        const { password: _, ...userWithoutPassword } = newUser;
        localStorage.setItem(storageKeyUser, JSON.stringify(userWithoutPassword));
        const token = `fake_token_${Date.now()}`;
        localStorage.setItem(storageKeyToken, token);
        resolve(userWithoutPassword);
      }, 1000);
    });
  }

  function logout() {
    localStorage.removeItem(storageKeyUser);
    localStorage.removeItem(storageKeyToken);
  }

  return { isLoggedIn, getCurrentUser, getToken, login, register, logout };
})();

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  if (!toast) {
    console.error("Toast element not found!");
    alert(message); // Fallback if toast element doesn't exist
    return;
  }
  
  const toastMessage = toast.querySelector(".toast-message");
  const toastIcon = toast.querySelector(".toast-content i");
  
  if (toastMessage) toastMessage.textContent = message;

  const iconClasses = {
    success: "fas fa-check-circle",
    error: "fas fa-exclamation-circle",
    warning: "fas fa-exclamation-triangle",
    info: "fas fa-info-circle",
  };
  
  if (toastIcon) toastIcon.className = iconClasses[type] || "fas fa-info-circle";
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

document.addEventListener("DOMContentLoaded", function () {
  // Debug: Check if we're on the login page
  console.log("Document loaded. Looking for login form...");
  
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("sigynup-form");
  
  // Handle tab switching
  const authTabs = document.querySelectorAll('.auth-tab');
  const authForms = document.querySelectorAll('.auth-form');
  
  authTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabTarget = this.getAttribute('data-tab');
      
      // Update active tab
      authTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Show corresponding form
      authForms.forEach(form => {
        form.classList.remove('active');
        if (form.id === `${tabTarget}-form`) {
          form.classList.add('active');
        }
      });
    });
  });
  
  // Handle form switch links
  const switchLinks = document.querySelectorAll('.switch-form');
  switchLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const formTarget = this.getAttribute('data-form');
      
      // Update active tab
      authTabs.forEach(t => {
        t.classList.remove('active');
        if (t.getAttribute('data-tab') === formTarget) {
          t.classList.add('active');
        }
      });
      
      // Show corresponding form
      authForms.forEach(form => {
        form.classList.remove('active');
        if (form.id === `${formTarget}-form`) {
          form.classList.add('active');
        }
      });
    });
  });

  if (loginForm) {
    console.log("Login form found, adding event listener");
    
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      console.log("Login form submitted");
      
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      if (!email || !password) {
        showToast("Please fill in all fields", "error");
        return;
      }

      const submitBtn = loginForm.querySelector("button[type='submit']");
      let originalText = "";
      
      if (submitBtn) {
        originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Logging in...";
      }

      console.log("Attempting login with:", email);
      
      Auth.login(email, password)
        .then((user) => {
          console.log("Login successful, user:", user);
          showToast("Login successful!", "success");
          
          // Add debug to check if this part is executing
          console.log("Preparing to redirect to index.html...");
          
          setTimeout(() => {
            console.log("Redirecting now...");
            window.location.href = "index.html";
          }, 1500);
        })
        .catch((error) => {
          console.error("Login error:", error);
          showToast(error.message, "error");
          
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText || "Login";
          }
        });
    });
  } else {
    console.warn("Login form not found in the document!");
  }

  if (signupForm) {
    console.log("Signup form found, adding event listener");
    
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();
      console.log("Signup form submitted");
      
      const username = document.getElementById("signup-username").value;
      const email = document.getElementById("signup-email").value;
      const password = document.getElementById("signup-password").value;

      if (!username || !email || !password) {
        showToast("Please fill in all fields", "error");
        return;
      }

      const submitBtn = signupForm.querySelector("button[type='submit']");
      let originalText = "";
      
      if (submitBtn) {
        originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Signing up...";
      }

      Auth.register(username, email, password)
        .then((user) => {
          console.log("Registration successful, user:", user);
          showToast("Account created successfully!", "success");
          
          setTimeout(() => {
            window.location.href = "index.html";
          }, 1500);
        })
        .catch((error) => {
          console.error("Registration error:", error);
          showToast(error.message, "error");
          
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText || "Sign Up";
          }
        });
    });
  }

  // Check if already logged in and redirect if needed
  if (Auth.isLoggedIn()) {
    // Check if we're on the login page (you may need to adjust this logic)
    const currentPath = window.location.pathname;
    if (currentPath.includes('login.html') || currentPath.endsWith('/login')) {
      window.location.href = "index.html";
    }
  }
});

document.addEventListener("DOMContentLoaded", function() {
  // Get current user information
  const currentUser = Auth.getCurrentUser();
  
  // Show the appropriate navigation based on user role
  const userNav = document.querySelector('.user-nav');
  const adminNav = document.querySelector('.admin-nav');
  
  if (currentUser && currentUser.isAdmin) {
    // Show admin navigation
    if (userNav) userNav.style.display = 'none';
    if (adminNav) adminNav.style.display = 'flex';
  } else {
    // Show regular user navigation
    if (userNav) userNav.style.display = 'flex';
    if (adminNav) adminNav.style.display = 'none';
  }
  
  // Highlight the active navigation item based on current page
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.mobile-nav a');
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (currentPath.includes(link.getAttribute('href'))) {
      link.classList.add('active');
    }
  });
});