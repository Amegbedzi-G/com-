// Admin Fund Requests functionality for MyFans
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const requestsTabs = document.querySelectorAll('.requests-tab');
    const tabContents = document.querySelectorAll('.requests-tab-content');
    const pendingRequestsList = document.getElementById('pending-requests-list');
    const completedRequestsList = document.getElementById('completed-requests-list');
    const searchInput = document.getElementById('search-requests');
    const filterSelect = document.getElementById('filter-requests');
    const requestDetailsModal = document.getElementById('request-details-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    // Check if user is admin
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    // Initialize
    initAdminFundRequests();
    
  
    function setupEventListeners() {
      // Tab switching
      requestsTabs.forEach(tab => {
        tab.addEventListener('click', function() {
          const tabName = this.getAttribute('data-tab');
          switchTab(tabName);
        });
      });
      
      // Search input
      if (searchInput) {
        searchInput.addEventListener('input', function() {
          filterRequests();
        });
      }
      
      // Filter select
      if (filterSelect) {
        filterSelect.addEventListener('change', function() {
          filterRequests();
        });
      }
      
      // Close modals
      closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
          const modal = this.closest('.modal');
          modal.style.display = 'none';
        });
      });
      
      // Close modals when clicking outside
      window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
          e.target.style.display = 'none';
        }
      });
      
      // View request details
      document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-request-btn') || e.target.closest('.view-request-btn')) {
          const btn = e.target.classList.contains('view-request-btn') ? e.target : e.target.closest('.view-request-btn');
          const requestId = btn.getAttribute('data-request-id');
          viewRequestDetails(requestId);
        }
      });
      
      // Provide account details
      document.addEventListener('click', function(e) {
        if (e.target.classList.contains('provide-account-btn') || e.target.closest('.provide-account-btn')) {
          const btn = e.target.classList.contains('provide-account-btn') ? e.target : e.target.closest('.provide-account-btn');
          const requestId = btn.getAttribute('data-request-id');
          provideAccountDetails(requestId);
        }
      });
      
      // Approve fund request
      document.addEventListener('click', function(e) {
        if (e.target.classList.contains('approve-request-btn') || e.target.closest('.approve-request-btn')) {
          const btn = e.target.classList.contains('approve-request-btn') ? e.target : e.target.closest('.approve-request-btn');
          const requestId = btn.getAttribute('data-request-id');
          approveFundRequest(requestId);
        }
      });
      
      // Reject fund request
      document.addEventListener('click', function(e) {
        if (e.target.classList.contains('reject-request-btn') || e.target.closest('.reject-request-btn')) {
          const btn = e.target.classList.contains('reject-request-btn') ? e.target : e.target.closest('.reject-request-btn');
          const requestId = btn.getAttribute('data-request-id');
          rejectFundRequest(requestId);
        }
      });
    }
    
    // Switch between tabs
    function switchTab(tabName) {
      // Update active tab
      requestsTabs.forEach(tab => {
        if (tab.getAttribute('data-tab') === tabName) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });
      
      // Update active content
      tabContents.forEach(content => {
        if (content.id === `${tabName}-tab`) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
    }
    
    // Load fund requests
    function loadFundRequests() {
      // Get fund requests from localStorage
      const fundRequests = JSON.parse(localStorage.getItem('fundRequests') || '[]');
      
      // Filter pending requests
      const pendingRequests = fundRequests.filter(request => 
        ['pending', 'account_provided', 'awaiting_review', 'under_review'].includes(request.status)
      );
      
      // Filter completed requests
      const completedRequests = fundRequests.filter(request => 
        ['approved', 'funded', 'rejected', 'cancelled'].includes(request.status)
      );
      
      // Sort by date (newest first)
      pendingRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      completedRequests.sort((a, b) => new Date(b.updatedAt) - new Date(a.createdAt));
      
      // Update pending count in tab
      const pendingTab = document.querySelector('.requests-tab[data-tab="pending"]');
      if (pendingTab) {
        pendingTab.textContent = `Pending (${pendingRequests.length})`;
      }
      
      // Render pending requests
      renderPendingRequests(pendingRequests);
      
      // Render completed requests
      renderCompletedRequests(completedRequests);
    }
    
    // Render pending requests
    function renderPendingRequests(requests) {
      if (!pendingRequestsList) return;
      
      // Clear list
      pendingRequestsList.innerHTML = '';
      
      // If no requests, show message
      if (requests.length === 0) {
        pendingRequestsList.innerHTML = `
          <div class="no-requests">
            <i class="fas fa-check-circle"></i>
            <p>No pending fund requests</p>
          </div>
        `;
        return;
      }
      
      // Render requests
      requests.forEach(request => {
        const requestElement = createPendingRequestElement(request);
        pendingRequestsList.appendChild(requestElement);
      });
    }
    
    // Create pending request element
    function createPendingRequestElement(request) {
      const requestElement = document.createElement('div');
      requestElement.className = 'fund-request';
      
      // Format date
      const date = new Date(request.createdAt);
      const formattedDate = `${date.toLocaleDateString()} - ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      
      // Determine status badge class and text
      let statusClass = 'pending';
      let statusText = 'Pending';
      
      if (request.status === 'account_provided') {
        statusClass = 'processing';
        statusText = 'Account Provided';
      } else if (request.status === 'awaiting_review') {
        statusClass = 'awaiting';
        statusText = 'Proof Submitted';
      } else if (request.status === 'under_review') {
        statusClass = 'reviewing';
        statusText = 'Under Review';
      }
      
      // Determine actions based on status
      let actionsHtml = `
        <button class="btn btn-sm btn-primary provide-account-btn" data-request-id="${request.id}">Provide Account</button>
        <button class="btn btn-sm btn-outline view-request-btn" data-request-id="${request.id}">View Details</button>
      `;
      
      if (request.status === 'account_provided') {
        actionsHtml = `
          <button class="btn btn-sm btn-outline view-request-btn" data-request-id="${request.id}">View Details</button>
        `;
      } else if (request.status === 'awaiting_review') {
        actionsHtml = `
          <button class="btn btn-sm btn-primary approve-request-btn" data-request-id="${request.id}">Approve & Fund</button>
          <button class="btn btn-sm btn-danger reject-request-btn" data-request-id="${request.id}">Reject</button>
          <button class="btn btn-sm btn-outline view-request-btn" data-request-id="${request.id}">View Details</button>
        `;
      } else if (request.status === 'under_review') {
        actionsHtml = `
          <button class="btn btn-sm btn-primary approve-request-btn" data-request-id="${request.id}">Approve & Fund</button>
          <button class="btn btn-sm btn-danger reject-request-btn" data-request-id="${request.id}">Reject</button>
          <button class="btn btn-sm btn-outline view-request-btn" data-request-id="${request.id}">View Details</button>
        `;
      }
      
      requestElement.innerHTML = `
        <div class="request-info">
          <div class="request-user">
            <div class="user-avatar">
              <img src="/placeholder.svg?height=40&width=40" alt="User Avatar">
            </div>
            <div class="user-details">
              <h3>${request.userName}</h3>
              <p>User ID: ${request.userId}</p>
            </div>
          </div>
          <div class="request-details">
            <div class="request-amount">$${request.amount.toFixed(2)}</div>
            <div class="request-method">${formatPaymentMethod(request.paymentMethod)}</div>
            <div class="request-date">${formattedDate}</div>
            <div class="request-reference">Ref: ${request.reference}</div>
          </div>
          <div class="request-status">
            <span class="status-badge ${statusClass}">${statusText}</span>
          </div>
        </div>
        <div class="request-actions">
          ${actionsHtml}
        </div>
      `;
      
      return requestElement;
    }
    
    // Render completed requests
    function renderCompletedRequests(requests) {
      if (!completedRequestsList) return;
      
      // Clear list
      completedRequestsList.innerHTML = '';
      
      // If no requests, show message
      if (requests.length === 0) {
        completedRequestsList.innerHTML = `
          <div class="no-requests">
            <i class="fas fa-history"></i>
            <p>No completed fund requests</p>
          </div>
        `;
        return;
      }
      
      // Render requests
      requests.forEach(request => {
        const requestElement = createCompletedRequestElement(request);
        completedRequestsList.appendChild(requestElement);
      });
    }
    
    // Create completed request element
    function createCompletedRequestElement(request) {
      const requestElement = document.createElement('div');
      requestElement.className = 'fund-request';
      
      // Format date
      const date = new Date(request.updatedAt || request.createdAt);
      const formattedDate = `${date.toLocaleDateString()} - ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      
      // Determine status badge class and text
      let statusClass = 'approved';
      let statusText = 'Approved';
      
      if (request.status === 'funded') {
        statusClass = 'funded';
        statusText = 'Funded';
      } else if (request.status === 'rejected') {
        statusClass = 'rejected';
        statusText = 'Rejected';
      } else if (request.status === 'cancelled') {
        statusClass = 'cancelled';
        statusText = 'Cancelled';
      }
      
      requestElement.innerHTML = `
        <div class="request-info">
          <div class="request-user">
            <div class="user-avatar">
              <img src="/placeholder.svg?height=40&width=40" alt="User Avatar">
            </div>
            <div class="user-details">
              <h3>${request.userName}</h3>
              <p>User ID: ${request.userId}</p>
            </div>
          </div>
          <div class="request-details">
            <div class="request-amount">$${request.amount.toFixed(2)}</div>
            <div class="request-method">${formatPaymentMethod(request.paymentMethod)}</div>
            <div class="request-date">${formattedDate}</div>
            <div class="request-reference">Ref: ${request.reference}</div>
          </div>
          <div class="request-status">
            <span class="status-badge ${statusClass}">${statusText}</span>
          </div>
        </div>
        <div class="request-actions">
          <button class="btn btn-sm btn-outline view-request-btn" data-request-id="${request.id}">View Details</button>
        </div>
      `;
      
      return requestElement;
    }
    
    // Filter requests
    function filterRequests() {
      // Get search term and filter value
      const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
      const filterValue = filterSelect ? filterSelect.value : 'all';
      
      // Get fund requests from localStorage
      const fundRequests = JSON.parse(localStorage.getItem('fundRequests') || '[]');
      
      // Filter pending requests
      let pendingRequests = fundRequests.filter(request => 
        ['pending', 'account_provided', 'awaiting_review', 'under_review'].includes(request.status)
      );
      
      // Filter completed requests
      let completedRequests = fundRequests.filter(request => 
        ['approved', 'funded', 'rejected', 'cancelled'].includes(request.status)
      );
      
      // Apply search filter
      if (searchTerm) {
        pendingRequests = pendingRequests.filter(request => 
          request.userName.toLowerCase().includes(searchTerm) ||
          request.userId.toLowerCase().includes(searchTerm) ||
          request.reference.toLowerCase().includes(searchTerm)
        );
        
        completedRequests = completedRequests.filter(request => 
          request.userName.toLowerCase().includes(searchTerm) ||
          request.userId.toLowerCase().includes(searchTerm) ||
          request.reference.toLowerCase().includes(searchTerm)
        );
      }
      
      // Apply status filter
      if (filterValue !== 'all') {
        pendingRequests = pendingRequests.filter(request => request.status === filterValue);
        completedRequests = completedRequests.filter(request => request.status === filterValue);
      }
      
      // Sort by date (newest first)
      pendingRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      completedRequests.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
      
      // Render filtered requests
      renderPendingRequests(pendingRequests);
      renderCompletedRequests(completedRequests);
    }
    
    // View request details
    function viewRequestDetails(requestId) {
      // Redirect to request details page
      window.location.href = `fund-request-details.html?id=${requestId}`;
    }
    
    // Provide account details
    function provideAccountDetails(requestId) {
      // Get fund requests from localStorage
      const fundRequests = JSON.parse(localStorage.getItem('fundRequests') || '[]');
      
      // Find request index
      const requestIndex = fundRequests.findIndex(req => req.id === requestId);
      
      if (requestIndex === -1) {
        showToast('Request not found', 'error');
        return;
      }
      
      // Redirect to provide account details page
      window.location.href = `provide-account.html?id=${requestId}`;
    }
    
    // Approve fund request
    function approveFundRequest(requestId) {
      // Get fund requests from localStorage
      const fundRequests = JSON.parse(localStorage.getItem('fundRequests') || '[]');
      
      // Find request index
      const requestIndex = fundRequests.findIndex(req => req.id === requestId);
      
      if (requestIndex === -1) {
        showToast('Request not found', 'error');
        return;
      }
      
      // Get request
      const request = fundRequests[requestIndex];
      
      // Update request status
      request.status = 'approved';
      request.updatedAt = new Date().toISOString();
      
      // Save to localStorage
      localStorage.setItem('fundRequests', JSON.stringify(fundRequests));
      
      // Add funds to user's wallet
      addFundsToWallet(request.userId, request.amount);
      
      // Create transaction record
      createTransactionRecord(request);
      
      // Update request status to funded
      request.status = 'funded';
      request.updatedAt = new Date().toISOString();
      
      // Save to localStorage
      localStorage.setItem('fundRequests', JSON.stringify(fundRequests));
      
      // Show success message
      showToast('Fund request approved and account funded successfully', 'success');
      
      // Reload fund requests
      loadFundRequests();
    }
    
    // Reject fund request
    function rejectFundRequest(requestId) {
      // Get fund requests from localStorage
      const fundRequests = JSON.parse(localStorage.getItem('fundRequests') || '[]');
      
      // Find request index
      const requestIndex = fundRequests.findIndex(req => req.id === requestId);
      
      if (requestIndex === -1) {
        showToast('Request not found', 'error');
        return;
      }
      
      // Update request status
      fundRequests[requestIndex].status = 'rejected';
      fundRequests[requestIndex].updatedAt = new Date().toISOString();
      
      // Save to localStorage
      localStorage.setItem('fundRequests', JSON.stringify(fundRequests));
      
      // Show success message
      showToast('Fund request rejected successfully', 'success');
      
      // Reload fund requests
      loadFundRequests();
    }
    
    // Add funds to wallet
    function addFundsToWallet(userId, amount) {
      // Get current balance
      const currentBalance = parseFloat(localStorage.getItem(`walletBalance_${userId}`) || '0');
      
      // Add funds
      const newBalance = currentBalance + amount;
      
      // Save to localStorage
      localStorage.setItem(`walletBalance_${userId}`, newBalance.toString());
    }
    
    // Create transaction record
    function createTransactionRecord(request) {
      // Create transaction object
      const transaction = {
        id: generateId(),
        userId: request.userId,
        type: 'deposit',
        amount: request.amount,
        description: 'Wallet Deposit',
        date: new Date().toISOString(),
        reference: request.reference
      };
      
      // Get existing transactions
      const transactions = JSON.parse(localStorage.getItem(`transactions_${request.userId}`) || '[]');
      
      // Add new transaction
      transactions.push(transaction);
      
      // Save to localStorage
      localStorage.setItem(`transactions_${request.userId}`, JSON.stringify(transactions));
    }
    
    // Format payment method
    function formatPaymentMethod(method) {
      if (method === 'credit-card') {
        return 'Credit/Debit Card';
      } else if (method === 'bank-transfer') {
        return 'Bank Transfer';
      } else if (method === 'crypto') {
        return 'Cryptocurrency';
      } else {
        return method;
      }
    }
    
    // Generate a random ID
    function generateId() {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    
    // Show toast notification
    function showToast(message, type = 'success') {
      const toast = document.getElementById('toast');
      const toastMessage = toast.querySelector('.toast-message');
      const toastIcon = toast.querySelector('.toast-content i');
      
      // Set message
      toastMessage.textContent = message;
      
      // Set icon based on type
      if (type === 'success') {
        toastIcon.className = 'fas fa-check-circle';
      } else if (type === 'error') {
        toastIcon.className = 'fas fa-exclamation-circle';
      }
      
      // Add show class
      toast.classList.add('show');
      
      // Auto hide after 3 seconds
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }
  });
  