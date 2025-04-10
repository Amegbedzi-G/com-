document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const viewButtons = document.querySelectorAll('.view-btn');
    const splitViewContent = document.querySelector('.split-view-content');
    const userSide = document.querySelector('.user-side');
    const adminSide = document.querySelector('.admin-side');
    const userMessages = document.getElementById('user-messages');
    const adminMessages = document.getElementById('admin-messages');
    const userMessageInput = document.getElementById('user-message-input');
    const adminMessageInput = document.getElementById('admin-message-input');
    const userSendBtn = document.getElementById('user-send-btn');
    const adminSendBtn = document.getElementById('admin-send-btn');
    const userTypingIndicator = document.querySelector('.user-typing-indicator');
    const adminTypingIndicator = document.querySelector('.admin-typing-indicator');
    const quickResponseBtns = document.querySelectorAll('.quick-response-btn');
    const attachmentBtns = document.querySelectorAll('.btn[title="Attach File"]');
    const attachmentModal = document.getElementById('attachment-modal');
    const ppvBtns = document.querySelectorAll('.btn[title="Send PPV Content"]');
    const ppvModal = document.getElementById('ppv-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const cancelAttachmentBtn = document.getElementById('cancel-attachment');
    const sendAttachmentBtn = document.getElementById('send-attachment');
    const cancelPpvBtn = document.getElementById('cancel-ppv');
    const sendPpvBtn = document.getElementById('send-ppv');
    
    // View Switching
    viewButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        // Remove active class from all buttons
        viewButtons.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Get view value
        const view = this.getAttribute('data-view');
        
        // Update view
        if (view === 'split') {
          splitViewContent.style.flexDirection = window.innerWidth <= 992 ? 'column' : 'row';
          userSide.style.display = 'flex';
          adminSide.style.display = 'flex';
        } else if (view === 'user') {
          splitViewContent.style.flexDirection = 'row';
          userSide.style.display = 'flex';
          adminSide.style.display = 'none';
        } else if (view === 'admin') {
          splitViewContent.style.flexDirection = 'row';
          userSide.style.display = 'none';
          adminSide.style.display = 'flex';
        }
      });
    });
    
    // Auto-resize textarea
    function autoResizeTextarea(textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = (textarea.scrollHeight) + 'px';
    }
    
    userMessageInput.addEventListener('input', function() {
      autoResizeTextarea(this);
      
      // Show typing indicator on admin side
      if (this.value.trim() !== '') {
        adminTypingIndicator.classList.add('active');
      } else {
        adminTypingIndicator.classList.remove('active');
      }
    });
    
    adminMessageInput.addEventListener('input', function() {
      autoResizeTextarea(this);
      
      // Show typing indicator on user side
      if (this.value.trim() !== '') {
        userTypingIndicator.classList.add('active');
      } else {
        userTypingIndicator.classList.remove('active');
      }
    });
    
    // Send message function
    function sendMessage(sender, message) {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Create message elements
      const messageDiv = document.createElement('div');
      messageDiv.className = sender === 'user' ? 'message sent' : 'message received';
      
      let messageHTML = '';
      
      if (sender === 'user') {
        messageHTML = `
          <div class="message-content">
            <div class="message-text">${message}</div>
            <div class="message-time">${timeString}</div>
            <div class="message-status">
              <i class="fas fa-check"></i>
            </div>
          </div>
        `;
      } else {
        messageHTML = `
          <div class="message-avatar">
            <img src="/placeholder.svg?height=40&width=40" alt="Admin Avatar">
          </div>
          <div class="message-content">
            <div class="message-sender">Sarah Williams</div>
            <div class="message-text">${message}</div>
            <div class="message-time">${timeString}</div>
          </div>
        `;
      }
      
      messageDiv.innerHTML = messageHTML;
      
      // Add message to both chat windows
      if (sender === 'user') {
        // Add to user side as sent
        userMessages.appendChild(messageDiv.cloneNode(true));
        
        // Add to admin side as received
        const adminMessageDiv = document.createElement('div');
        adminMessageDiv.className = 'message received';
        adminMessageDiv.innerHTML = `
          <div class="message-avatar">
            <img src="/placeholder.svg?height=40&width=40" alt="User Avatar">
          </div>
          <div class="message-content">
            <div class="message-sender">John Smith</div>
            <div class="message-text">${message}</div>
            <div class="message-time">${timeString}</div>
          </div>
        `;
        adminMessages.appendChild(adminMessageDiv);
      } else {
        // Add to admin side as sent
        adminMessages.appendChild(messageDiv.cloneNode(true));
        
        // Add to user side as received
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'message received';
        userMessageDiv.innerHTML = `
          <div class="message-avatar">
            <img src="/placeholder.svg?height=40&width=40" alt="Admin Avatar">
          </div>
          <div class="message-content">
            <div class="message-sender">Sarah Williams</div>
            <div class="message-text">${message}</div>
            <div class="message-time">${timeString}</div>
          </div>
        `;
        userMessages.appendChild(userMessageDiv);
      }
      
      // Scroll to bottom
      userMessages.scrollTop = userMessages.scrollHeight;
      adminMessages.scrollTop = adminMessages.scrollHeight;
      
      // Update message status after a delay (simulate delivery)
      setTimeout(() => {
        const statusIcons = document.querySelectorAll('.message-status i.fa-check');
        statusIcons.forEach(icon => {
          icon.className = 'fas fa-check-double';
        });
      }, 1000);
    }
    
    // Send message from user
    userSendBtn.addEventListener('click', function() {
      const message = userMessageInput.value.trim();
      
      if (message !== '') {
        // Hide typing indicator
        adminTypingIndicator.classList.remove('active');
        
        // Send message
        sendMessage('user', message);
        
        // Clear input
        userMessageInput.value = '';
        userMessageInput.style.height = 'auto';
        
        // Simulate admin typing after a delay
        setTimeout(() => {
          userTypingIndicator.classList.add('active');
          
          // Simulate admin response after typing
          setTimeout(() => {
            userTypingIndicator.classList.remove('active');
            
            // Random responses
            const responses = [
              "Thanks for your message!",
              "I appreciate your feedback!",
              "That's great to hear!",
              "Let me know if you have any questions!",
              "I'll get back to you on that soon."
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            sendMessage('admin', randomResponse);
          }, 2000);
        }, 1000);
      }
    });
    
    // Send message from admin
    adminSendBtn.addEventListener('click', function() {
      const message = adminMessageInput.value.trim();
      
      if (message !== '') {
        // Hide typing indicator
        userTypingIndicator.classList.remove('active');
        
        // Send message
        sendMessage('admin', message);
        
        // Clear input
        adminMessageInput.value = '';
        adminMessageInput.style.height = 'auto';
      }
    });
    
    // Send message on Enter key (but allow Shift+Enter for new line)
    userMessageInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        userSendBtn.click();
      }
    });
    
    adminMessageInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        adminSendBtn.click();
      }
    });
    
    // Quick response buttons
    quickResponseBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const response = this.textContent;
        adminMessageInput.value = response;
        adminSendBtn.click();
      });
    });
    
    // Attachment buttons
    attachmentBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        attachmentModal.style.display = 'flex';
      });
    });
    
    // PPV buttons
    ppvBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        ppvModal.style.display = 'flex';
      });
    });
    
    // Close modals
    closeModalBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        attachmentModal.style.display = 'none';
        ppvModal.style.display = 'none';
      });
    });
    
    // Cancel attachment
    cancelAttachmentBtn.addEventListener('click', function() {
      attachmentModal.style.display = 'none';
    });
    
    // Send attachment
    sendAttachmentBtn.addEventListener('click', function() {
      // Simulate sending attachment
      showToast('Attachment sent successfully!');
      attachmentModal.style.display = 'none';
      
      // Add attachment message
      const attachmentMessage = `
        <div class="message-text">Here's the file you requested:</div>
        <div class="message-media">
          <img src="/placeholder.svg?height=200&width=300" alt="Attachment">
        </div>
      `;
      
      // Create message elements
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message sent';
      
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      messageDiv.innerHTML = `
        <div class="message-content">
          ${attachmentMessage}
          <div class="message-time">${timeString}</div>
          <div class="message-status">
            <i class="fas fa-check"></i>
          </div>
        </div>
      `;
      
      // Add to admin side
      adminMessages.appendChild(messageDiv);
      
      // Add to user side as received
      const userMessageDiv = document.createElement('div');
      userMessageDiv.className = 'message received';
      userMessageDiv.innerHTML = `
        <div class="message-avatar">
          <img src="/placeholder.svg?height=40&width=40" alt="Admin Avatar">
        </div>
        <div class="message-content">
          <div class="message-sender">Sarah Williams</div>
          ${attachmentMessage}
          <div class="message-time">${timeString}</div>
        </div>
      `;
      userMessages.appendChild(userMessageDiv);
      
      // Scroll to bottom
      userMessages.scrollTop = userMessages.scrollHeight;
      adminMessages.scrollTop = adminMessages.scrollHeight;
    });
    
    // Cancel PPV
    cancelPpvBtn.addEventListener('click', function() {
      ppvModal.style.display = 'none';
    });
    
    // Send PPV
    sendPpvBtn.addEventListener('click', function() {
      // Get PPV content and price
      const ppvContent = document.getElementById('ppv-content').value.trim();
      const ppvPrice = document.getElementById('ppv-price').value;
      
      if (ppvContent !== '') {
        // Simulate sending PPV content
        showToast('PPV content sent successfully!');
        ppvModal.style.display = 'none';
        
        // Add PPV message
        const ppvMessage = `
          <div class="message-text">${ppvContent}</div>
          <div class="message-media ppv-content">
            <div class="ppv-preview">
              <img src="/placeholder.svg?height=200&width=300" alt="PPV Content Preview" class="blurred">
              <div class="ppv-overlay">
                <div class="ppv-info">
                  <i class="fas fa-lock"></i>
                  <p>Pay-per-view content</p>
                  <p class="ppv-price">$${ppvPrice}</p>
                </div>
                <button class="btn btn-primary unlock-ppv">Unlock Now</button>
              </div>
            </div>
          </div>
        `;
        
        // Create message elements
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message sent';
        
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
          <div class="message-content">
            ${ppvMessage}
            <div class="message-time">${timeString}</div>
            <div class="message-status">
              <i class="fas fa-check"></i>
            </div>
          </div>
        `;
        
        // Add to admin side
        adminMessages.appendChild(messageDiv);
        
        // Add to user side as received
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'message received';
        userMessageDiv.innerHTML = `
          <div class="message-avatar">
            <img src="/placeholder.svg?height=40&width=40" alt="Admin Avatar">
          </div>
          <div class="message-content">
            <div class="message-sender">Sarah Williams</div>
            ${ppvMessage}
            <div class="message-time">${timeString}</div>
          </div>
        `;
        userMessages.appendChild(userMessageDiv);
        
        // Scroll to bottom
        userMessages.scrollTop = userMessages.scrollHeight;
        adminMessages.scrollTop = adminMessages.scrollHeight;
        
        // Add event listener to unlock button
        const unlockBtns = document.querySelectorAll('.unlock-ppv');
        unlockBtns.forEach(btn => {
          btn.addEventListener('click', function() {
            showToast('Content unlocked successfully!');
            
            // Replace PPV overlay with actual content
            const ppvPreview = this.closest('.ppv-preview');
            const img = ppvPreview.querySelector('img');
            img.classList.remove('blurred');
            
            const ppvOverlay = ppvPreview.querySelector('.ppv-overlay');
            ppvOverlay.style.display = 'none';
          });
        });
      }
    });
    
    // Toast notification function
    function showToast(message, type = 'success') {
      const toast = document.getElementById('toast');
      const toastMessage = toast.querySelector('.toast-message');
      const toastIcon = toast.querySelector('.toast-content i');
      
      // Set message
      toastMessage.textContent = message;
      
      // Set icon based on type
      if (type === 'success') {
        toastIcon.className = 'fas fa-check-circle';
        toastIcon.style.color = 'var(--color-success)';
      } else if (type === 'error') {
        toastIcon.className = 'fas fa-exclamation-circle';
        toastIcon.style.color = 'var(--color-danger)';
      } else if (type === 'warning') {
        toastIcon.className = 'fas fa-exclamation-triangle';
        toastIcon.style.color = 'var(--color-warning)';
      } else if (type === 'info') {
        toastIcon.className = 'fas fa-info-circle';
        toastIcon.style.color = 'var(--color-info)';
      }
      
      // Show toast
      toast.classList.add('show');
      
      // Hide toast after 3 seconds
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
      const activeView = document.querySelector('.view-btn.active');
      if (activeView && activeView.getAttribute('data-view') === 'split') {
        splitViewContent.style.flexDirection = window.innerWidth <= 992 ? 'column' : 'row';
      }
    });
    
    // Initialize
    userMessages.scrollTop = userMessages.scrollHeight;
    adminMessages.scrollTop = adminMessages.scrollHeight;
  });