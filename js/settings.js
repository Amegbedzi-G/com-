document.addEventListener('DOMContentLoaded', function() {
    // Tab Navigation
    const settingsNavItems = document.querySelectorAll('.settings-nav-item');
    const settingsTabs = document.querySelectorAll('.settings-tab');
  
    settingsNavItems.forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        const tabId = this.getAttribute('data-tab');
        
        // Update active navigation item
        settingsNavItems.forEach(navItem => {
          navItem.classList.remove('active');
        });
        this.classList.add('active');
        
        // Show the corresponding tab
        settingsTabs.forEach(tab => {
          tab.classList.remove('active');
        });
        document.getElementById(`${tabId}-tab`).classList.add('active');
      });
    });
  
    // Toggle Dark Mode
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
      darkModeToggle.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode', this.checked);
        localStorage.setItem('darkMode', this.checked ? 'enabled' : 'disabled');
        
        // Also update the header theme toggle button
        const themeToggleBtn = document.getElementById('theme-toggle-btn');
        if (themeToggleBtn) {
          const icon = themeToggleBtn.querySelector('i');
          if (this.checked) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
          } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
          }
        }
        
        showToast(this.checked ? 'Dark mode enabled' : 'Light mode enabled');
      });
      
      // Check if dark mode was previously set
      const savedDarkMode = localStorage.getItem('darkMode');
      if (savedDarkMode === 'enabled') {
        darkModeToggle.checked = true;
        document.body.classList.add('dark-mode');
        
        const themeToggleBtn = document.getElementById('theme-toggle-btn');
        if (themeToggleBtn) {
          const icon = themeToggleBtn.querySelector('i');
          icon.classList.remove('fa-moon');
          icon.classList.add('fa-sun');
        }
      }
    }
  
    // Form Submissions
    const accountForm = document.getElementById('account-form');
    if (accountForm) {
      accountForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showToast('Account settings saved successfully');
      });
    }
  
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
      profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showToast('Profile settings saved successfully');
      });
    }
  
    const socialLinksForm = document.getElementById('social-links-form');
    if (socialLinksForm) {
      socialLinksForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showToast('Social links saved successfully');
      });
    }
  
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
      passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (!currentPassword || !newPassword || !confirmPassword) {
          showToast('Please fill in all password fields', 'error');
          return;
        }
        
        if (newPassword !== confirmPassword) {
          showToast('New passwords do not match', 'error');
          return;
        }
        
        showToast('Password updated successfully');
        passwordForm.reset();
      });
    }
  
    // Profile Picture Upload
    const uploadPictureBtn = document.getElementById('upload-picture-btn');
    const profilePictureInput = document.getElementById('profile-picture-input');
    
    if (uploadPictureBtn && profilePictureInput) {
      uploadPictureBtn.addEventListener('click', function() {
        profilePictureInput.click();
      });
      
      profilePictureInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
          const file = e.target.files[0];
          const reader = new FileReader();
          
          reader.onload = function(e) {
            const currentPicture = document.querySelector('.current-picture img');
            if (currentPicture) {
              currentPicture.src = e.target.result;
              showToast('Profile picture updated');
            }
          };
          
          reader.readAsDataURL(file);
        }
      });
    }
  
    // Cover Photo Upload
    const uploadCoverBtn = document.getElementById('upload-cover-btn');
    const coverPhotoInput = document.getElementById('cover-photo-input');
    
    if (uploadCoverBtn && coverPhotoInput) {
      uploadCoverBtn.addEventListener('click', function() {
        coverPhotoInput.click();
      });
      
      coverPhotoInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
          const file = e.target.files[0];
          const reader = new FileReader();
          
          reader.onload = function(e) {
            const currentCover = document.querySelector('.current-cover img');
            if (currentCover) {
              currentCover.src = e.target.result;
              showToast('Cover photo updated');
            }
          };
          
          reader.readAsDataURL(file);
        }
      });
    }
  
    // Remove Profile Picture
    const removePictureBtn = document.getElementById('remove-picture-btn');
    if (removePictureBtn) {
      removePictureBtn.addEventListener('click', function() {
        const currentPicture = document.querySelector('.current-picture img');
        if (currentPicture) {
          currentPicture.src = '/placeholder.svg?height=100&width=100';
          showToast('Profile picture removed');
        }
      });
    }
  
    // Remove Cover Photo
    const removeCoverBtn = document.getElementById('remove-cover-btn');
    if (removeCoverBtn) {
      removeCoverBtn.addEventListener('click', function() {
        const currentCover = document.querySelector('.current-cover img');
        if (currentCover) {
          currentCover.src = '/placeholder.svg?height=200&width=600';
          showToast('Cover photo removed');
        }
      });
    }
  
    // Delete Account Modal
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    const deleteAccountModal = document.getElementById('delete-account-modal');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const deleteConfirmationInput = document.getElementById('delete-confirmation');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    if (deleteAccountBtn && deleteAccountModal) {
      deleteAccountBtn.addEventListener('click', function() {
        deleteAccountModal.style.display = 'flex';
      });
      
      if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', function() {
          deleteAccountModal.style.display = 'none';
          if (deleteConfirmationInput) {
            deleteConfirmationInput.value = '';
          }
        });
      }
      
      if (deleteConfirmationInput && confirmDeleteBtn) {
        deleteConfirmationInput.addEventListener('input', function() {
          confirmDeleteBtn.disabled = this.value !== 'DELETE';
        });
        
        confirmDeleteBtn.addEventListener('click', function() {
          if (deleteConfirmationInput.value === 'DELETE') {
            deleteAccountModal.style.display = 'none';
            showToast('Account deleted successfully');
            // In a real application, you would redirect to a logout page or home
            setTimeout(() => {
              window.location.href = '/index.html';
            }, 2000);
          }
        });
      }
    }
  
    // Close Modals
    closeModalBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const modal = this.closest('.modal');
        if (modal) {
          modal.style.display = 'none';
        }
      });
    });
  
    // Two-Factor Authentication
    const enable2faBtn = document.getElementById('enable-2fa-btn');
    const setup2faModal = document.getElementById('setup-2fa-modal');
    const setupSteps = document.querySelectorAll('.setup-step');
    const nextStepBtns = document.querySelectorAll('.next-step');
    const prevStepBtns = document.querySelectorAll('.prev-step');
    
    if (enable2faBtn && setup2faModal) {
      enable2faBtn.addEventListener('click', function() {
        setup2faModal.style.display = 'flex';
      });
      
      if (nextStepBtns) {
        nextStepBtns.forEach(btn => {
          btn.addEventListener('click', function() {
            const nextStep = this.getAttribute('data-next');
            setupSteps.forEach(step => {
              step.classList.remove('active');
            });
            document.querySelector(`.setup-step[data-step="${nextStep}"]`).classList.add('active');
          });
        });
      }
      
      if (prevStepBtns) {
        prevStepBtns.forEach(btn => {
          btn.addEventListener('click', function() {
            const prevStep = this.getAttribute('data-prev');
            setupSteps.forEach(step => {
              step.classList.remove('active');
            });
            document.querySelector(`.setup-step[data-step="${prevStep}"]`).classList.add('active');
          });
        });
      }
      
      const complete2faSetupBtn = document.getElementById('complete-2fa-setup');
      if (complete2faSetupBtn) {
        complete2faSetupBtn.addEventListener('click', function() {
          setup2faModal.style.display = 'none';
          
          // Update 2FA status
          const twoFactorStatus = document.querySelector('.two-factor-status .status-info h4');
          if (twoFactorStatus) {
            twoFactorStatus.innerHTML = 'Two-Factor Authentication is <span class="status-enabled">Enabled</span>';
          }
          
          const enable2faBtn = document.getElementById('enable-2fa-btn');
          if (enable2faBtn) {
            enable2faBtn.textContent = 'Disable';
            enable2faBtn.classList.remove('btn-primary');
            enable2faBtn.classList.add('btn-outline-danger');
          }
          
          showToast('Two-factor authentication enabled successfully');
        });
      }
    }
  
    // Notification Toggles
    const notificationSwitches = document.querySelectorAll('.notification-control input[type="checkbox"]');
    notificationSwitches.forEach(switchEl => {
      switchEl.addEventListener('change', function() {
        const notificationName = this.closest('.notification-item').querySelector('h4').textContent;
        showToast(`${notificationName} notifications ${this.checked ? 'enabled' : 'disabled'}`);
      });
    });
  
    // Privacy Setting Changes
    const privacySelects = document.querySelectorAll('#privacy-tab select');
    privacySelects.forEach(select => {
      select.addEventListener('change', function() {
        const settingName = this.closest('.privacy-item').querySelector('h4').textContent;
        showToast(`${settingName} setting updated`);
      });
    });
  
    // Function to show toast messages
    function showToast(message, type = 'success') {
      const toast = document.getElementById('toast');
      const toastMessage = document.querySelector('.toast-message');
      const toastIcon = document.querySelector('.toast i');
      
      if (toast && toastMessage) {
        toastMessage.textContent = message;
        
        if (toastIcon) {
          toastIcon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
        }
        
        toast.classList.add('show');
        
        setTimeout(() => {
          toast.classList.remove('show');
        }, 3000);
      }
    }
  
    // Handle Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showToast('Logging out...');
        setTimeout(() => {
          window.location.href = '/index.html';
        }, 1500);
      });
    }
  
    // Handle Logout All Sessions
    const logoutAllBtn = document.getElementById('logout-all-btn');
    if (logoutAllBtn) {
      logoutAllBtn.addEventListener('click', function() {
        showToast('Logged out of all other sessions');
      });
    }
  
    // Handle session logout buttons
    const sessionLogoutBtns = document.querySelectorAll('.session-action .btn-outline-danger');
    sessionLogoutBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const sessionItem = this.closest('.session-item');
        if (sessionItem) {
          const deviceName = sessionItem.querySelector('h4').textContent;
          sessionItem.remove();
          showToast(`Logged out from ${deviceName}`);
        }
      });
    });
  
    // Handle unblock user buttons
    const unblockUserBtns = document.querySelectorAll('.blocked-user-item .btn-outline');
    unblockUserBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const userItem = this.closest('.blocked-user-item');
        if (userItem) {
          const userName = userItem.querySelector('h4').textContent;
          userItem.remove();
          showToast(`Unblocked ${userName}`);
          
          // Show empty state if no blocked users remain
          const blockedUsersList = document.querySelector('.blocked-users-list');
          const blockedUsersItems = document.querySelectorAll('.blocked-user-item');
          const emptyState = document.querySelector('.blocked-users-list .empty-state');
          
          if (blockedUsersList && blockedUsersItems.length === 0 && emptyState) {
            emptyState.style.display = 'block';
          }
        }
      });
    });
  
    // Deactivate Account
    const deactivateAccountBtn = document.getElementById('deactivate-account-btn');
    if (deactivateAccountBtn) {
      deactivateAccountBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to deactivate your account? You can reactivate it anytime by logging in.')) {
          showToast('Account deactivated successfully');
          // In a real application, you would redirect to a logout page or home
          setTimeout(() => {
            window.location.href = '/index.html';
          }, 2000);
        }
      });
    }
  
    // Password Strength Meter
    const newPasswordInput = document.getElementById('new-password');
    if (newPasswordInput) {
      newPasswordInput.addEventListener('input', function() {
        const password = this.value;
        const strengthBar = document.querySelector('.strength-level');
        const strengthText = document.querySelector('.strength-text');
        
        if (strengthBar && strengthText) {
          let strength = 0;
          
          // Check length
          if (password.length >= 8) {
            strength += 25;
          }
          
          // Check for lowercase letters
          if (/[a-z]/.test(password)) {
            strength += 25;
          }
          
          // Check for uppercase letters
          if (/[A-Z]/.test(password)) {
            strength += 25;
          }
          
          // Check for numbers and special characters
          if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) {
            strength += 25;
          }
          
          strengthBar.style.width = `${strength}%`;
          
          if (strength <= 25) {
            strengthBar.style.backgroundColor = '#ff4d4d';
            strengthText.textContent = 'Weak';
          } else if (strength <= 50) {
            strengthBar.style.backgroundColor = '#ffa64d';
            strengthText.textContent = 'Fair';
          } else if (strength <= 75) {
            strengthBar.style.backgroundColor = '#ffff4d';
            strengthText.textContent = 'Good';
          } else {
            strengthBar.style.backgroundColor = '#4dff4d';
            strengthText.textContent = 'Strong';
          }
        }
      });
    }
  
    // Handle Theme Toggle Button in Header
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', function() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDarkMode ? 'disabled' : 'enabled');
        
        const icon = this.querySelector('i');
        if (isDarkMode) {
          icon.classList.remove('fa-sun');
          icon.classList.add('fa-moon');
        } else {
          icon.classList.remove('fa-moon');
          icon.classList.add('fa-sun');
        }
        
        // Also update the settings page toggle if we're on that page
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (darkModeToggle) {
          darkModeToggle.checked = !isDarkMode;
        }
        
        showToast(isDarkMode ? 'Light mode enabled' : 'Dark mode enabled');
      });
    }
  });