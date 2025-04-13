// Wallet Functionality
document.addEventListener('DOMContentLoaded', function() {
  initWalletFundingProcess();
  initPaymentMethodToggle();
  initFileUpload();
  initBalanceDisplay();
});

// Initialize wallet funding process
function initWalletFundingProcess() {
  // Get DOM elements
  const fundSteps = document.querySelectorAll('.fund-step');
  const nextButtons = document.querySelectorAll('.next-step');
  const prevButtons = document.querySelectorAll('.prev-step');
  const amountOptions = document.querySelectorAll('.amount-option');
  const customAmountInput = document.getElementById('custom-fund-amount');
  const submitProofButton = document.getElementById('submit-payment-proof');
  
  // Set default selected amount (if any)
  let selectedAmount = 0;

  // Handle amount selection
  amountOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Remove active class from all options
      amountOptions.forEach(opt => opt.classList.remove('active'));
      
      // Add active class to clicked option
      this.classList.add('active');
      
      // Set the selected amount
      selectedAmount = parseFloat(this.dataset.amount);
      
      // Clear custom amount input
      if (customAmountInput) {
        customAmountInput.value = '';
      }
      
      // Enable the continue button
      const continueBtn = this.closest('.fund-step').querySelector('.next-step');
      if (continueBtn) {
        continueBtn.removeAttribute('disabled');
      }
    });
  });

  // Handle custom amount input
  if (customAmountInput) {
    customAmountInput.addEventListener('input', function() {
      // Remove active class from pre-defined options
      amountOptions.forEach(opt => opt.classList.remove('active'));
      
      // Set the selected amount from input
      selectedAmount = parseFloat(this.value) || 0;
      
      // Enable/disable continue button based on valid amount
      const continueBtn = this.closest('.fund-step').querySelector('.next-step');
      if (continueBtn) {
        if (selectedAmount >= 5) {
          continueBtn.removeAttribute('disabled');
        } else {
          continueBtn.setAttribute('disabled', 'disabled');
        }
      }
    });
  }

  // Handle next step buttons
  nextButtons.forEach(button => {
    button.addEventListener('click', function() {
      const currentStep = parseInt(this.closest('.fund-step').dataset.step);
      const nextStep = parseInt(this.dataset.next);
      
      // Validate current step
      if (currentStep === 1 && selectedAmount < 5) {
        showToast('Please select or enter a valid amount (minimum $5)', 'error');
        return;
      }
      
      if (currentStep === 2) {
        const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked');
        if (!selectedPaymentMethod) {
          showToast('Please select a payment method', 'error');
          return;
        }
        
        // Update payment details in step 3
        updatePaymentDetails(selectedAmount, selectedPaymentMethod.value);
        
        // Show payment details after a short delay (simulating loading)
        setTimeout(() => {
          document.querySelector('.payment-waiting').style.display = 'none';
          document.querySelector('.payment-details').style.display = 'block';
        }, 1500);
      }
      
      // Hide current step
      this.closest('.fund-step').classList.remove('active');
      
      // Show next step
      document.querySelector(`.fund-step[data-step="${nextStep}"]`).classList.add('active');
    });
  });

  // Handle previous step buttons
  prevButtons.forEach(button => {
    button.addEventListener('click', function() {
      const currentStep = parseInt(this.closest('.fund-step').dataset.step);
      const prevStep = parseInt(this.dataset.prev);
      
      // Hide current step
      this.closest('.fund-step').classList.remove('active');
      
      // Show previous step
      document.querySelector(`.fund-step[data-step="${prevStep}"]`).classList.add('active');
    });
  });

  // Handle submit payment proof button
  if (submitProofButton) {
    submitProofButton.addEventListener('click', function() {
      // Show confirmation step
      document.querySelector('.fund-step[data-step="3"]').classList.remove('active');
      document.querySelector('.fund-step[data-step="4"]').classList.add('active');
      
      // Generate random transaction reference
      const transactionRef = 'MF' + Math.floor(100000 + Math.random() * 900000);
      document.getElementById('transaction-reference').textContent = transactionRef;
      
      // Show success toast
      showToast('Payment proof submitted successfully!', 'success');
    });
  }
}

// Initialize payment method toggle
function initPaymentMethodToggle() {
  const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
  
  paymentMethods.forEach(method => {
    method.addEventListener('change', function() {
      // Update the payment method display
      const methodDisplay = document.getElementById('payment-method-display');
      if (methodDisplay) {
        let displayText = '';
        
        switch(this.value) {
          case 'credit-card':
            displayText = 'Credit/Debit Card';
            break;
          case 'bank-transfer':
            displayText = 'Bank Transfer';
            break;
          case 'crypto':
            displayText = 'Cryptocurrency';
            break;
          default:
            displayText = 'Bank Transfer';
        }
        
        methodDisplay.textContent = displayText;
      }
    });
  });
}

// Initialize file upload functionality
function initFileUpload() {
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('payment-proof');
  const previewArea = document.getElementById('uploaded-preview');
  const previewImage = document.getElementById('proof-preview');
  const removeButton = document.getElementById('remove-upload');
  const submitButton = document.getElementById('submit-payment-proof');
  
  if (uploadArea && fileInput && previewArea && previewImage && removeButton) {
    // Handle click on upload area
    uploadArea.addEventListener('click', function() {
      fileInput.click();
    });
    
    // Handle drag events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      uploadArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
      uploadArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
      uploadArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
      uploadArea.classList.add('highlight');
    }
    
    function unhighlight() {
      uploadArea.classList.remove('highlight');
    }
    
    // Handle file drop
    uploadArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
      const dt = e.dataTransfer;
      const files = dt.files;
      
      if (files.length) {
        handleFiles(files);
      }
    }
    
    // Handle file selection via input
    fileInput.addEventListener('change', function() {
      if (this.files.length) {
        handleFiles(this.files);
      }
    });
    
    function handleFiles(files) {
      const file = files[0]; // Only handle the first file
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
          // Display preview
          previewImage.src = e.target.result;
          uploadArea.style.display = 'none';
          previewArea.style.display = 'block';
          
          // Enable submit button
          if (submitButton) {
            submitButton.removeAttribute('disabled');
          }
        };
        
        reader.readAsDataURL(file);
      } else {
        showToast('Please upload an image file', 'error');
      }
    }
    
    // Handle remove button click
    removeButton.addEventListener('click', function() {
      // Clear input and preview
      fileInput.value = '';
      previewImage.src = '';
      uploadArea.style.display = 'block';
      previewArea.style.display = 'none';
      
      // Disable submit button
      if (submitButton) {
        submitButton.setAttribute('disabled', 'disabled');
      }
    });
  }
}

// Update payment details in step 3
function updatePaymentDetails(amount, paymentMethod) {
  const amountDisplay = document.getElementById('payment-amount-display');
  const methodDisplay = document.getElementById('payment-method-display');
  const referenceDisplay = document.getElementById('payment-reference');
  
  if (amountDisplay) {
    amountDisplay.textContent = '$' + parseFloat(amount).toFixed(2);
  }
  
  if (methodDisplay) {
    let displayText = '';
    
    switch(paymentMethod) {
      case 'credit-card':
        displayText = 'Credit/Debit Card';
        break;
      case 'bank-transfer':
        displayText = 'Bank Transfer';
        break;
      case 'crypto':
        displayText = 'Cryptocurrency';
        break;
      default:
        displayText = 'Bank Transfer';
    }
    
    methodDisplay.textContent = displayText;
  }
  
  if (referenceDisplay) {
    // Generate a random reference number
    const reference = 'MF' + Math.floor(100000 + Math.random() * 900000);
    referenceDisplay.textContent = reference;
  }
}

// Initialize balance display
function initBalanceDisplay() {
  const balanceDisplay = document.querySelector('.balance-amount');
  
  // Get current user to display correct balance
  const currentUser = Auth.getCurrentUser();
  
  if (balanceDisplay && currentUser) {
    balanceDisplay.textContent = '$' + parseFloat(currentUser.balance).toFixed(2);
  }
}


// Wallet functionality for MyFans
document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const walletTabs = document.querySelectorAll('.wallet-tab');
  const tabContents = document.querySelectorAll('.wallet-tab-content');
  const fundWalletBtn = document.getElementById('fund-wallet-btn');
  const withdrawBtn = document.getElementById('withdraw-btn');
  const fundWalletModal = document.getElementById('fund-wallet-modal');
  const closeModalBtns = document.querySelectorAll('.close-modal');
  const amountOptions = document.querySelectorAll('.amount-option');
  const customAmountInput = document.getElementById('custom-fund-amount');
  const nextStepBtns = document.querySelectorAll('.next-step');
  const prevStepBtns = document.querySelectorAll('.prev-step');
  const fundSteps = document.querySelectorAll('.fund-step');
  const paymentMethodInputs = document.querySelectorAll('input[name="payment-method"]');
  const paymentAmountDisplay = document.getElementById('payment-amount-display');
  const paymentMethodDisplay = document.getElementById('payment-method-display');
  const paymentReference = document.getElementById('payment-reference');
  const uploadArea = document.getElementById('upload-area');
  const paymentProofInput = document.getElementById('payment-proof');
  const uploadedPreview = document.getElementById('uploaded-preview');
  const proofPreview = document.getElementById('proof-preview');
  const removeUploadBtn = document.getElementById('remove-upload');
  const submitPaymentProofBtn = document.getElementById('submit-payment-proof');
  const balanceAmount = document.querySelector('.balance-amount');
  const pendingTransactionsList = document.querySelector('.pending-transactions');
  const transactionsList = document.querySelector('.transactions-list');
  const paymentWaiting = document.querySelector('.payment-waiting');
  const paymentDetails = document.querySelector('.payment-details');
  
  // Check if user is admin
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  
  // Initialize
  initWallet();
  
  function initWallet() {
    // Set up event listeners
    setupEventListeners();
    
    // Load wallet data
    loadWalletData();
    
    // Update UI for admin/user
    updateUIForRole();
  }
  
  function setupEventListeners() {
    // Tab switching
    walletTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const tabName = this.getAttribute('data-tab');
        switchTab(tabName);
      });
    });
    
    // Fund wallet button
    if (fundWalletBtn) {
      fundWalletBtn.addEventListener('click', function() {
        if (isAdmin) {
          window.location.href = 'admin-fund-requests.html';
        } else {
          showFundWalletModal();
        }
      });
    }
    
    // Withdraw button
    if (withdrawBtn) {
      withdrawBtn.addEventListener('click', function() {
        showToast('Withdraw feature coming soon!');
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
    
    // Amount options
    amountOptions.forEach(option => {
      option.addEventListener('click', function() {
        const amount = this.getAttribute('data-amount');
        selectAmount(amount);
      });
    });
    
    // Custom amount input
    if (customAmountInput) {
      customAmountInput.addEventListener('input', function() {
        // Deselect amount options
        amountOptions.forEach(option => {
          option.classList.remove('selected');
        });
      });
    }
    
    // Next step buttons
    nextStepBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const nextStep = this.getAttribute('data-next');
        goToStep(nextStep);
      });
    });
    
    // Previous step buttons
    prevStepBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const prevStep = this.getAttribute('data-prev');
        goToStep(prevStep);
      });
    });
    
    // Payment method selection
    paymentMethodInputs.forEach(input => {
      input.addEventListener('change', function() {
        updatePaymentMethodDisplay();
      });
    });
    
    // Upload area click
    if (uploadArea) {
      uploadArea.addEventListener('click', function() {
        paymentProofInput.click();
      });
    }
    
    // Upload area drag and drop
    if (uploadArea) {
      uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
      });
      
      uploadArea.addEventListener('dragleave', function() {
        this.classList.remove('dragover');
      });
      
      uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        
        if (e.dataTransfer.files.length) {
          handleFileUpload(e.dataTransfer.files[0]);
        }
      });
    }
    
    // Payment proof input change
    if (paymentProofInput) {
      paymentProofInput.addEventListener('change', function() {
        if (this.files.length) {
          handleFileUpload(this.files[0]);
        }
      });
    }
    
    // Remove upload button
    if (removeUploadBtn) {
      removeUploadBtn.addEventListener('click', function() {
        removeUpload();
      });
    }
    
    // Submit payment proof button
    if (submitPaymentProofBtn) {
      submitPaymentProofBtn.addEventListener('click', function() {
        submitPaymentProof();
      });
    }
    
    // View details buttons for pending transactions
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('view-details-btn') || e.target.closest('.view-details-btn')) {
        const btn = e.target.classList.contains('view-details-btn') ? e.target : e.target.closest('.view-details-btn');
        const requestId = btn.getAttribute('data-request-id');
        viewFundRequestDetails(requestId);
      }
    });
    
    // Complete payment buttons for pending transactions
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('complete-payment-btn') || e.target.closest('.complete-payment-btn')) {
        const btn = e.target.classList.contains('complete-payment-btn') ? e.target : e.target.closest('.complete-payment-btn');
        const requestId = btn.getAttribute('data-request-id');
        completePayment(requestId);
      }
    });
    
    // Cancel buttons for pending transactions
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('cancel-request-btn') || e.target.closest('.cancel-request-btn')) {
        const btn = e.target.classList.contains('cancel-request-btn') ? e.target : e.target.closest('.cancel-request-btn');
        const requestId = btn.getAttribute('data-request-id');
        cancelFundRequest(requestId);
      }
    });
  }
  
  // Switch between tabs
  function switchTab(tabName) {
    // Update active tab
    walletTabs.forEach(tab => {
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
  
  // Show fund wallet modal
  function showFundWalletModal() {
    // Reset modal
    resetFundModal();
    
    // Show modal
    fundWalletModal.style.display = 'block';
  }
  
  // Reset fund modal
  function resetFundModal() {
    // Reset steps
    goToStep(1);
    
    // Reset amount options
    amountOptions.forEach(option => {
      option.classList.remove('selected');
    });
    
    // Reset custom amount
    if (customAmountInput) {
      customAmountInput.value = '';
    }
    
    // Reset payment method
    if (paymentMethodInputs.length) {
      paymentMethodInputs[0].checked = true;
    }
    
    // Reset upload
    removeUpload();
    
    // Reset payment details
    if (paymentWaiting) {
      paymentWaiting.style.display = 'block';
    }
    
    if (paymentDetails) {
      paymentDetails.style.display = 'none';
    }
    
    // Reset submit button
    if (submitPaymentProofBtn) {
      submitPaymentProofBtn.disabled = true;
    }
  }
  
  // Select amount
  function selectAmount(amount) {
    // Update selected amount option
    amountOptions.forEach(option => {
      if (option.getAttribute('data-amount') === amount) {
        option.classList.add('selected');
      } else {
        option.classList.remove('selected');
      }
    });
    
    // Clear custom amount
    if (customAmountInput) {
      customAmountInput.value = '';
    }
  }
  
  // Go to step
  function goToStep(stepNumber) {
    // Validate current step before proceeding
    if (!validateCurrentStep(stepNumber)) {
      return;
    }
    
    // Update steps
    fundSteps.forEach(step => {
      if (step.getAttribute('data-step') === stepNumber) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
    
    // If going to step 3, simulate loading payment details
    if (stepNumber === '3') {
      loadPaymentDetails();
    }
  }
  
  // Validate current step
  function validateCurrentStep(nextStep) {
    // Get current step
    const currentStep = document.querySelector('.fund-step.active').getAttribute('data-step');
    
    // If going backwards, always allow
    if (parseInt(nextStep) < parseInt(currentStep)) {
      return true;
    }
    
    // Validate step 1 (amount)
    if (currentStep === '1') {
      const selectedAmount = document.querySelector('.amount-option.selected');
      const customAmount = customAmountInput ? customAmountInput.value : '';
      
      if (!selectedAmount && (!customAmount || customAmount < 5)) {
        showToast('Please select or enter a valid amount (minimum $5)', 'error');
        return false;
      }
      
      // Update amount display for step 3
      if (paymentAmountDisplay) {
        const amount = selectedAmount ? selectedAmount.getAttribute('data-amount') : customAmount;
        paymentAmountDisplay.textContent = `$${parseFloat(amount).toFixed(2)}`;
      }
    }
    
    // Validate step 2 (payment method)
    if (currentStep === '2') {
      const selectedMethod = document.querySelector('input[name="payment-method"]:checked');
      
      if (!selectedMethod) {
        showToast('Please select a payment method', 'error');
        return false;
      }
      
      // Update payment method display for step 3
      if (paymentMethodDisplay) {
        const methodValue = selectedMethod.value;
        let methodText = 'Credit/Debit Card';
        
        if (methodValue === 'bank-transfer') {
          methodText = 'Bank Transfer';
        } else if (methodValue === 'crypto') {
          methodText = 'Cryptocurrency';
        }
        
        paymentMethodDisplay.textContent = methodText;
      }
    }
    
    return true;
  }
  
  // Update payment method display
  function updatePaymentMethodDisplay() {
    const selectedMethod = document.querySelector('input[name="payment-method"]:checked');
    
    if (selectedMethod && paymentMethodDisplay) {
      const methodValue = selectedMethod.value;
      let methodText = 'Credit/Debit Card';
      
      if (methodValue === 'bank-transfer') {
        methodText = 'Bank Transfer';
      } else if (methodValue === 'crypto') {
        methodText = 'Cryptocurrency';
      }
      
      paymentMethodDisplay.textContent = methodText;
    }
  }
  
  // Load payment details
  function loadPaymentDetails() {
    if (!paymentWaiting || !paymentDetails) return;
    
    // Show loading spinner
    paymentWaiting.style.display = 'block';
    paymentDetails.style.display = 'none';
    
    // Generate reference number
    const reference = `MF${Math.floor(100000 + Math.random() * 900000)}`;
    if (paymentReference) {
      paymentReference.textContent = reference;
    }
    
    // Simulate API call to get payment details
    setTimeout(() => {
      // Create fund request
      createFundRequest();
      
      // Hide loading spinner
      paymentWaiting.style.display = 'none';
      paymentDetails.style.display = 'block';
    }, 2000);
  }
  
  // Handle file upload
  function handleFileUpload(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file', 'error');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('File size exceeds 5MB limit', 'error');
      return;
    }
    
    // Create file reader
    const reader = new FileReader();
    
    reader.onload = function(e) {
      // Show preview
      if (proofPreview) {
        proofPreview.src = e.target.result;
      }
      
      if (uploadedPreview) {
        uploadedPreview.style.display = 'block';
      }
      
      if (uploadArea) {
        uploadArea.style.display = 'none';
      }
      
      // Enable submit button
      if (submitPaymentProofBtn) {
        submitPaymentProofBtn.disabled = false;
      }
    };
    
    reader.readAsDataURL(file);
  }
  
  // Remove upload
  function removeUpload() {
    if (paymentProofInput) {
      paymentProofInput.value = '';
    }
    
    if (uploadedPreview) {
      uploadedPreview.style.display = 'none';
    }
    
    if (uploadArea) {
      uploadArea.style.display = 'block';
    }
    
    if (submitPaymentProofBtn) {
      submitPaymentProofBtn.disabled = true;
    }
  }
  
  // Submit payment proof
  function submitPaymentProof() {
    // Get current fund request
    const fundRequests = JSON.parse(localStorage.getItem('fundRequests') || '[]');
    const currentUserId = localStorage.getItem('currentUserId') || 'user1';
    
    // Find the most recent pending request for the current user
    const userRequests = fundRequests.filter(request => 
      request.userId === currentUserId && 
      (request.status === 'pending' || request.status === 'account_provided')
    );
    
    if (userRequests.length === 0) {
      showToast('No pending fund request found', 'error');
      return;
    }
    
    // Get the most recent request
    const request = userRequests[userRequests.length - 1];
    
    // Update request status
    request.status = 'awaiting_review';
    request.proofImage = proofPreview.src;
    request.proofSubmittedAt = new Date().toISOString();
    
    // Save updated requests
    localStorage.setItem('fundRequests', JSON.stringify(fundRequests));
    
    // Show success message
    showToast('Payment proof submitted successfully!', 'success');
    
    // Close modal
    fundWalletModal.style.display = 'none';
    
    // Reload wallet data
    loadWalletData();
    
    // If on fund-account.html, go to step 4
    if (window.location.pathname.includes('fund-account.html')) {
      goToStep(4);
      
      // Update transaction reference
      const transactionReference = document.getElementById('transaction-reference');
      if (transactionReference) {
        transactionReference.textContent = request.reference;
      }
    }
  }
  
  // Create fund request
  function createFundRequest() {
    // Get amount and payment method
    const selectedAmount = document.querySelector('.amount-option.selected');
    const customAmount = customAmountInput ? customAmountInput.value : '';
    const amount = selectedAmount ? selectedAmount.getAttribute('data-amount') : customAmount;
    
    const selectedMethod = document.querySelector('input[name="payment-method"]:checked');
    const paymentMethod = selectedMethod ? selectedMethod.value : 'bank-transfer';
    
    // Generate reference
    const reference = paymentReference ? paymentReference.textContent : `MF${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Create request object
    const request = {
      id: generateId(),
      userId: localStorage.getItem('currentUserId') || 'user1',
      userName: localStorage.getItem('currentUserName') || 'John Doe',
      amount: parseFloat(amount),
      paymentMethod: paymentMethod,
      reference: reference,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Get existing requests
    const fundRequests = JSON.parse(localStorage.getItem('fundRequests') || '[]');
    
    // Add new request
    fundRequests.push(request);
    
    // Save to localStorage
    localStorage.setItem('fundRequests', JSON.stringify(fundRequests));
  }
  
  // Load wallet data
  function loadWalletData() {
    // Load wallet balance
    loadWalletBalance();
    
    // Load transactions
    loadTransactions();
    
    // Load pending transactions
    loadPendingTransactions();
  }
  
  // Load wallet balance
  function loadWalletBalance() {
    if (!balanceAmount) return;
    
    // Get current user
    const currentUserId = localStorage.getItem('currentUserId') || 'user1';
    
    // Get wallet balance from localStorage
    const walletBalance = parseFloat(localStorage.getItem(`walletBalance_${currentUserId}`) || '0');
    
    // Update balance display
    balanceAmount.textContent = `$${walletBalance.toFixed(2)}`;
  }
  
  // Load transactions
  function loadTransactions() {
    if (!transactionsList) return;
    
    // Get current user
    const currentUserId = localStorage.getItem('currentUserId') || 'user1';
    
    // Get transactions from localStorage
    const transactions = JSON.parse(localStorage.getItem(`transactions_${currentUserId}`) || '[]');
    
    // Sort by date (newest first)
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Clear transactions list
    transactionsList.innerHTML = '';
    
    // If no transactions, show message
    if (transactions.length === 0) {
      transactionsList.innerHTML = `
        <div class="no-transactions">
          <i class="fas fa-receipt"></i>
          <p>No transactions yet</p>
        </div>
      `;
      return;
    }
    
    // Render transactions
    transactions.forEach(transaction => {
      const transactionElement = createTransactionElement(transaction);
      transactionsList.appendChild(transactionElement);
    });
  }
  
  // Create transaction element
  function createTransactionElement(transaction) {
    const transactionElement = document.createElement('div');
    transactionElement.className = 'transaction';
    
    // Determine transaction type
    let iconClass = 'deposit';
    let icon = 'arrow-down';
    
    if (transaction.type === 'withdrawal') {
      iconClass = 'withdrawal';
      icon = 'arrow-up';
    } else if (transaction.type === 'subscription') {
      iconClass = 'subscription';
      icon = 'star';
    } else if (transaction.type === 'tip') {
      iconClass = 'tip';
      icon = 'coins';
    } else if (transaction.type === 'content') {
      iconClass = 'content';
      icon = 'lock-open';
    }
    
    // Format date
    const date = new Date(transaction.date);
    const formattedDate = `${date.toLocaleDateString()} - ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    
    // Format amount
    const isPositive = transaction.type === 'deposit';
    const formattedAmount = `${isPositive ? '+' : '-'}$${Math.abs(transaction.amount).toFixed(2)}`;
    
    transactionElement.innerHTML = `
      <div class="transaction-icon ${iconClass}">
        <i class="fas fa-${icon}"></i>
      </div>
      <div class="transaction-details">
        <div class="transaction-title">${transaction.description}</div>
        <div class="transaction-date">${formattedDate}</div>
      </div>
      <div class="transaction-amount ${isPositive ? 'deposit' : 'payment'}">${formattedAmount}</div>
    `;
    
    return transactionElement;
  }
  
  // Load pending transactions
  function loadPendingTransactions() {
    if (!pendingTransactionsList) return;
    
    // Get current user
    const currentUserId = localStorage.getItem('currentUserId') || 'user1';
    
    // Get fund requests from localStorage
    const fundRequests = JSON.parse(localStorage.getItem('fundRequests') || '[]');
    
    // Filter requests for current user and pending status
    const pendingRequests = fundRequests.filter(request => 
      request.userId === currentUserId && 
      ['pending', 'account_provided', 'awaiting_review', 'under_review'].includes(request.status)
    );
    
    // Sort by date (newest first)
    pendingRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Clear pending transactions list
    pendingTransactionsList.innerHTML = '';
    
    // If no pending transactions, show message
    if (pendingRequests.length === 0) {
      pendingTransactionsList.innerHTML = `
        <div class="no-pending-transactions">
          <i class="fas fa-check-circle"></i>
          <p>No pending transactions</p>
        </div>
      `;
      return;
    }
    
    // Update pending count in tab
    const pendingTab = document.querySelector('.wallet-tab[data-tab="pending"]');
    if (pendingTab) {
      pendingTab.textContent = `Pending (${pendingRequests.length})`;
    }
    
    // Render pending transactions
    pendingRequests.forEach(request => {
      const pendingElement = createPendingElement(request);
      pendingTransactionsList.appendChild(pendingElement);
    });
  }
  
  // Create pending element
  function createPendingElement(request) {
    const pendingElement = document.createElement('div');
    pendingElement.className = 'pending-transaction';
    
    // Format date
    const date = new Date(request.createdAt);
    const formattedDate = `${date.toLocaleDateString()} - ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    
    // Determine status text
    let statusText = 'Awaiting confirmation';
    
    if (request.status === 'account_provided') {
      statusText = 'Awaiting payment';
    } else if (request.status === 'awaiting_review') {
      statusText = 'Proof submitted, awaiting review';
    } else if (request.status === 'under_review') {
      statusText = 'Under review';
    }
    
    // Determine actions based on status
    let actionsHtml = `
      <button class="btn btn-sm btn-outline view-details-btn" data-request-id="${request.id}">View Details</button>
      <button class="btn btn-sm btn-outline cancel-request-btn" data-request-id="${request.id}">Cancel</button>
    `;
    
    if (request.status === 'account_provided') {
      actionsHtml = `
        <button class="btn btn-sm btn-primary complete-payment-btn" data-request-id="${request.id}">Complete Payment</button>
        <button class="btn btn-sm btn-outline cancel-request-btn" data-request-id="${request.id}">Cancel</button>
      `;
    } else if (request.status === 'awaiting_review' || request.status === 'under_review') {
      actionsHtml = `
        <button class="btn btn-sm btn-outline view-details-btn" data-request-id="${request.id}">View Details</button>
      `;
    }
    
    pendingElement.innerHTML = `
      <div class="pending-details">
        <div class="pending-title">Wallet Deposit</div>
        <div class="pending-amount">$${request.amount.toFixed(2)}</div>
        <div class="pending-date">${formattedDate}</div>
        <div class="pending-status">${statusText}</div>
      </div>
      <div class="pending-actions">
        ${actionsHtml}
      </div>
    `;
    
    return pendingElement;
  }
  
  // View fund request details
  function viewFundRequestDetails(requestId) {
    // Get fund requests from localStorage
    const fundRequests = JSON.parse(localStorage.getItem('fundRequests') || '[]');
    
    // Find request
    const request = fundRequests.find(req => req.id === requestId);
    
    if (!request) {
      showToast('Request not found', 'error');
      return;
    }
    
    // Redirect to fund request details page
    window.location.href = `fund-request-details.html?id=${requestId}`;
  }
  
  // Complete payment
  function completePayment(requestId) {
    // Redirect to fund request details page
    window.location.href = `fund-request-details.html?id=${requestId}`;
  }
  
  // Cancel fund request
  function cancelFundRequest(requestId) {
    // Get fund requests from localStorage
    const fundRequests = JSON.parse(localStorage.getItem('fundRequests') || '[]');
    
    // Find request index
    const requestIndex = fundRequests.findIndex(req => req.id === requestId);
    
    if (requestIndex === -1) {
      showToast('Request not found', 'error');
      return;
    }
    
    // Update request status
    fundRequests[requestIndex].status = 'cancelled';
    fundRequests[requestIndex].updatedAt = new Date().toISOString();
    
    // Save to localStorage
    localStorage.setItem('fundRequests', JSON.stringify(fundRequests));
    
    // Show success message
    showToast('Fund request cancelled successfully', 'success');
    
    // Reload pending transactions
    loadPendingTransactions();
  }
  
  // Update UI for role
  function updateUIForRole() {
    if (isAdmin) {
      // Update fund wallet button text
      if (fundWalletBtn) {
        fundWalletBtn.textContent = 'Manage Fund Requests';
      }
      
      // Show admin-only elements
      document.querySelectorAll('.admin-only').forEach(el => {
        el.style.display = 'block';
      });
      
      // Hide user nav, show admin nav
      const userNav = document.querySelector('.user-nav');
      const adminNav = document.querySelector('.admin-nav');
      
      if (userNav) userNav.style.display = 'none';
      if (adminNav) adminNav.style.display = 'flex';
    } else {
      // Hide admin-only elements
      document.querySelectorAll('.admin-only').forEach(el => {
        el.style.display = 'none';
      });
      
      // Show user nav, hide admin nav
      const userNav = document.querySelector('.user-nav');
      const adminNav = document.querySelector('.admin-nav');
      
      if (userNav) userNav.style.display = 'flex';
      if (adminNav) adminNav.style.display = 'none';
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
