// auth.js

document.addEventListener("DOMContentLoaded", () => {
  const authTabs = document.querySelectorAll(".auth-tab");
  const authForms = document.querySelectorAll(".auth-form");
  const switchFormLinks = document.querySelectorAll(".switch-form");
  const togglePasswordBtns = document.querySelectorAll(".toggle-password");

  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  // Fake users
  const users = [
    {
      username: "admin",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
    },
    {
      username: "user1",
      email: "user1@example.com",
      password: "password123",
      role: "user",
    },
  ];

  // Toggle Tabs
  authTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      authTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const target = tab.dataset.tab;
      authForms.forEach(form => {
        form.classList.remove("active");
      });
      document.getElementById(`${target}-form`).classList.add("active");
    });
  });

  // Switch form from mobile link
  switchFormLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const form = link.dataset.form;
      document.querySelector(`.auth-tab[data-tab="${form}"]`).click();
    });
  });

  // Toggle password visibility
  togglePasswordBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const input = btn.previousElementSibling;
      input.type = input.type === "password" ? "text" : "password";
      btn.querySelector("i").classList.toggle("fa-eye");
      btn.querySelector("i").classList.toggle("fa-eye-slash");
    });
  });

  // Login Handler
  loginForm.addEventListener("submit", e => {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      if (user.role === "admin") {
        window.location.href = "/admin-side/index.html";
      } else {
        window.location.href = "/user-side/index.html";
      }
    } else {
      showToast("Invalid login credentials");
    }
  });

  // Signup Handler
  signupForm.addEventListener("submit", e => {
    e.preventDefault();

    const username = document.getElementById("signup-username").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const terms = document.getElementById("terms-checkbox").checked;

    if (!terms) {
      showToast("You must agree to the Terms of Service");
      return;
    }

    // Simulate saving user (in real app, send to backend)
    users.push({
      username,
      email,
      password,
      role: "user",
    });

    showToast("Account created successfully!");
    setTimeout(() => {
      window.location.href = "/user-side/index.html";
    }, 1000);
  });

  // Simple Toast Function
  function showToast(message) {
    const toast = document.getElementById("toast");
    const toastMessage = toast.querySelector(".toast-message");
    const progress = toast.querySelector(".toast-progress");

    toastMessage.textContent = message;
    toast.classList.add("show");
    progress.classList.add("animate");

    setTimeout(() => {
      toast.classList.remove("show");
      progress.classList.remove("animate");
    }, 3000);
  }

  // Password Strength Checker (optional)
  const passwordInput = document.getElementById("signup-password");
  const strengthText = document.querySelector(".strength-text span");
  const strengthFill = document.querySelector(".strength-meter-fill");

  passwordInput.addEventListener("input", () => {
    const value = passwordInput.value;
    let strength = 0;

    if (value.length >= 6) strength += 1;
    if (/[A-Z]/.test(value)) strength += 1;
    if (/[0-9]/.test(value)) strength += 1;
    if (/[^A-Za-z0-9]/.test(value)) strength += 1;

    strengthFill.dataset.strength = strength;
    strengthFill.style.width = `${(strength / 4) * 100}%`;

    const strengthLabels = ["Weak", "Moderate", "Good", "Strong"];
    strengthText.textContent = strengthLabels[strength - 1] || "Weak";
  });
});
