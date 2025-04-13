// Fund Request Details functionality for MyFans
document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const requestDetailsContainer = document.querySelector(".request-details-container")
    const backButton = document.querySelector(".back-button")
    const provideAccountForm = document.getElementById("provide-account-form")
    const accountDetailsContainer = document.querySelector(".account-details-container")
    const paymentProofContainer = document.querySelector(".payment-proof-container")
    const approveRequestBtn = document.getElementById("approve-request-btn")
    const rejectRequestBtn = document.getElementById("reject-request-btn")
  
    // Check if user is admin
    const isAdmin = localStorage.getItem("isAdmin") === "true"
  
    // Get request ID from URL
    const urlParams = new URLSearchParams(window.location.search)
    const requestId = urlParams.get("id")
  
    // Initialize
    initRequestDetails()
  
    function initRequestDetails() {
      // Set up event listeners
      setupEventListeners()
  
      // Load request details
      loadRequestDetails()
    }
  
    function setupEventListeners() {
      // Back button
      if (backButton) {
        backButton.addEventListener("click", () => {
          if (isAdmin) {
            window.location.href = "admin-fund-requests.html"
          } else {
            window.location.href = "wallet.html"
          }
        })
      }
  
      // Provide account form
      if (provideAccountForm) {
        provideAccountForm.addEventListener("submit", (e) => {
          e.preventDefault()
          submitAccountDetails()
        })
      }
  
      // Approve request button
      if (approveRequestBtn) {
        approveRequestBtn.addEventListener("click", () => {
          approveFundRequest()
        })
      }
  
      // Reject request button
      if (rejectRequestBtn) {
        rejectRequestBtn.addEventListener("click", () => {
          rejectFundRequest()
        })
      }
    }
  
    // Load request details
    function loadRequestDetails() {
      if (!requestId) {
        showToast("Request ID not found", "error")
        return
      }
  
      // Get fund requests from localStorage
      const fundRequests = JSON.parse(localStorage.getItem("fundRequests") || "[]")
  
      // Find request
      const request = fundRequests.find((req) => req.id === requestId)
  
      if (!request) {
        showToast("Request not found", "error")
        return
      }
  
      // Render request details
      renderRequestDetails(request)
    }
  
    // Render request details
    function renderRequestDetails(request) {
      if (!requestDetailsContainer) return
  
      // Format dates
      const createdDate = new Date(request.createdAt)
      const formattedCreatedDate = `${createdDate.toLocaleDateString()} - ${createdDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
  
      let updatedDate = null
      let formattedUpdatedDate = ""
  
      if (request.updatedAt && request.updatedAt !== request.createdAt) {
        updatedDate = new Date(request.updatedAt)
        formattedUpdatedDate = `${updatedDate.toLocaleDateString()} - ${updatedDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
      }
  
      // Determine status badge class and text
      let statusClass = "pending"
      let statusText = "Pending"
  
      if (request.status === "account_provided") {
        statusClass = "processing"
        statusText = "Account Provided"
      } else if (request.status === "awaiting_review") {
        statusClass = "awaiting"
        statusText = "Proof Submitted"
      } else if (request.status === "under_review") {
        statusClass = "reviewing"
        statusText = "Under Review"
      } else if (request.status === "approved") {
        statusClass = "approved"
        statusText = "Approved"
      } else if (request.status === "funded") {
        statusClass = "funded"
        statusText = "Funded"
      } else if (request.status === "rejected") {
        statusClass = "rejected"
        statusText = "Rejected"
      } else if (request.status === "cancelled") {
        statusClass = "cancelled"
        statusText = "Cancelled"
      }
  
      // Create request details HTML
      const requestDetailsHTML = `
        <div class="request-header">
          <h1>Fund Request Details</h1>
          <div class="request-status">
            <span class="status-badge ${statusClass}">${statusText}</span>
          </div>
        </div>
        
        <div class="request-info-card">
          <div class="request-info-section">
            <h2>Request Information</h2>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Request ID</div>
                <div class="info-value">${request.id}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Reference</div>
                <div class="info-value">${request.reference}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Amount</div>
                <div class="info-value">$${request.amount.toFixed(2)}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Payment Method</div>
                <div class="info-value">${formatPaymentMethod(request.paymentMethod)}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Created Date</div>
                <div class="info-value">${formattedCreatedDate}</div>
              </div>
              ${
                updatedDate
                  ? `
              <div class="info-item">
                <div class="info-label">Last Updated</div>
                <div class="info-value">${formattedUpdatedDate}</div>
              </div>
              `
                  : ""
              }
            </div>
          </div>
          
          <div class="request-info-section">
            <h2>User Information</h2>
            <div class="user-info">
              <div class="user-avatar">
                <img src="/placeholder.svg?height=60&width=60" alt="User Avatar">
              </div>
              <div class="user-details">
                <h3>${request.userName}</h3>
                <p>User ID: ${request.userId}</p>
              </div>
            </div>
          </div>
        </div>
      `
  
      // Update request details container
      requestDetailsContainer.innerHTML = requestDetailsHTML
  
      // Render account details section if admin
      if (isAdmin && request.status === "pending") {
        renderProvideAccountSection(request)
      }
  
      // Render account details if provided
      if (request.accountDetails) {
        renderAccountDetails(request)
      }
  
      // Render payment proof if submitted
      if (request.proofImage) {
        renderPaymentProof(request)
      }
  
      // Render admin actions if admin and appropriate status
      if (isAdmin && (request.status === "awaiting_review" || request.status === "under_review")) {
        renderAdminActions()
      }
    }
  
    // Render provide account section
    function renderProvideAccountSection(request) {
      const provideAccountSection = document.createElement("div")
      provideAccountSection.className = "provide-account-section"
  
      provideAccountSection.innerHTML = `
        <h2>Provide Account Details</h2>
        <p>Provide the account details for the user to make the payment.</p>
        
        <form id="provide-account-form">
          <div class="form-group">
            <label for="bank-name">Bank Name</label>
            <input type="text" id="bank-name" required>
          </div>
          
          <div class="form-group">
            <label for="account-name">Account Name</label>
            <input type="text" id="account-name" required>
          </div>
          
          <div class="form-group">
            <label for="account-number">Account Number</label>
            <input type="text" id="account-number" required>
          </div>
          
          <div class="form-group">
            <label for="additional-info">Additional Information (Optional)</label>
            <textarea id="additional-info" rows="3"></textarea>
          </div>
          
          <button type="submit" class="btn btn-primary">Submit Account Details</button>
        </form>
      `
  
      requestDetailsContainer.appendChild(provideAccountSection)
    }
  
    // Render account details
    function renderAccountDetails(request) {
      if (!accountDetailsContainer) {
        const container = document.createElement("div")
        container.className = "account-details-container"
        requestDetailsContainer.appendChild(container)
        const accountDetailsContainer = container
      }
  
      accountDetailsContainer.innerHTML = `
        <div class="account-details-card">
          <h2>Payment Account Details</h2>
          <div class="account-details">
            <div class="account-detail-item">
              <div class="detail-label">Bank Name</div>
              <div class="detail-value">${request.accountDetails.bankName}</div>
            </div>
            <div class="account-detail-item">
              <div class="detail-label">Account Name</div>
              <div class="detail-value">${request.accountDetails.accountName}</div>
            </div>
            <div class="account-detail-item">
              <div class="detail-label">Account Number</div>
              <div class="detail-value">${request.accountDetails.accountNumber}</div>
            </div>
            ${
              request.accountDetails.additionalInfo
                ? `
            <div class="account-detail-item">
              <div class="detail-label">Additional Information</div>
              <div class="detail-value">${request.accountDetails.additionalInfo}</div>
            </div>
            `
                : ""
            }
          </div>
        </div>
      `
  
      // If user and status is account_provided, show upload proof section
      if (!isAdmin && request.status === "account_provided") {
        renderUploadProofSection()
      }
    }
  
    // Render upload proof section
    function renderUploadProofSection() {
      const uploadProofSection = document.createElement("div")
      uploadProofSection.className = "upload-proof-section"
  
      uploadProofSection.innerHTML = `
        <h2>Upload Payment Proof</h2>
        <p>Please upload a screenshot or photo of your payment receipt.</p>
        
        <div class="upload-area" id="upload-area">
          <i class="fas fa-cloud-upload-alt"></i>
          <p>Drag & drop your payment screenshot or click to browse</p>
          <input type="file" id="payment-proof" accept="image/*" hidden>
        </div>
        <div class="uploaded-preview" id="uploaded-preview" style="display: none;">
          <img src="/placeholder.svg" alt="Payment Proof" id="proof-preview">
          <button class="remove-upload" id="remove-upload">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <button class="btn btn-primary" id="submit-payment-proof" disabled>Submit Payment Proof</button>
      `
  
      accountDetailsContainer.appendChild(uploadProofSection)
  
      // Set up event listeners for upload
      setupUploadEventListeners()
    }
  
    // Set up upload event listeners
    function setupUploadEventListeners() {
      const uploadArea = document.getElementById("upload-area")
      const paymentProofInput = document.getElementById("payment-proof")
      const uploadedPreview = document.getElementById("uploaded-preview")
      const proofPreview = document.getElementById("proof-preview")
      const removeUploadBtn = document.getElementById("remove-upload")
      const submitPaymentProofBtn = document.getElementById("submit-payment-proof")
  
      if (uploadArea) {
        uploadArea.addEventListener("click", () => {
          paymentProofInput.click()
        })
  
        uploadArea.addEventListener("dragover", function (e) {
          e.preventDefault()
          this.classList.add("dragover")
        })
  
        uploadArea.addEventListener("dragleave", function () {
          this.classList.remove("dragover")
        })
  
        uploadArea.addEventListener("drop", function (e) {
          e.preventDefault()
          this.classList.remove("dragover")
  
          if (e.dataTransfer.files.length) {
            handleFileUpload(e.dataTransfer.files[0])
          }
        })
      }
  
      if (paymentProofInput) {
        paymentProofInput.addEventListener("change", function () {
          if (this.files.length) {
            handleFileUpload(this.files[0])
          }
        })
      }
  
      if (removeUploadBtn) {
        removeUploadBtn.addEventListener("click", () => {
          removeUpload()
        })
      }
  
      if (submitPaymentProofBtn) {
        submitPaymentProofBtn.addEventListener("click", () => {
          submitPaymentProof()
        })
      }
    }
  
    // Handle file upload
    function handleFileUpload(file) {
      const uploadArea = document.getElementById("upload-area")
      const uploadedPreview = document.getElementById("uploaded-preview")
      const proofPreview = document.getElementById("proof-preview")
      const submitPaymentProofBtn = document.getElementById("submit-payment-proof")
  
      // Validate file type
      if (!file.type.startsWith("image/")) {
        showToast("Please upload an image file", "error")
        return
      }
  
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast("File size exceeds 5MB limit", "error")
        return
      }
  
      // Create file reader
      const reader = new FileReader()
  
      reader.onload = (e) => {
        // Show preview
        if (proofPreview) {
          proofPreview.src = e.target.result
        }
  
        if (uploadedPreview) {
          uploadedPreview.style.display = "block"
        }
  
        if (uploadArea) {
          uploadArea.style.display = "none"
        }
  
        // Enable submit button
        if (submitPaymentProofBtn) {
          submitPaymentProofBtn.disabled = false
        }
      }
  
      reader.readAsDataURL(file)
    }
  
    // Remove upload
    function removeUpload() {
      const paymentProofInput = document.getElementById("payment-proof")
      const uploadedPreview = document.getElementById("uploaded-preview")
      const uploadArea = document.getElementById("upload-area")
      const submitPaymentProofBtn = document.getElementById("submit-payment-proof")
  
      if (paymentProofInput) {
        paymentProofInput.value = ""
      }
  
      if (uploadedPreview) {
        uploadedPreview.style.display = "none"
      }
  
      if (uploadArea) {
        uploadArea.style.display = "block"
      }
  
      if (submitPaymentProofBtn) {
        submitPaymentProofBtn.disabled = true
      }
    }
  
    // Submit payment proof
    function submitPaymentProof() {
      const proofPreview = document.getElementById("proof-preview")
  
      if (!requestId) {
        showToast("Request ID not found", "error")
        return
      }
  
      // Get fund requests from localStorage
      const fundRequests = JSON.parse(localStorage.getItem("fundRequests") || "[]")
  
      // Find request index
      const requestIndex = fundRequests.findIndex((req) => req.id === requestId)
  
      if (requestIndex === -1) {
        showToast("Request not found", "error")
        return
      }
  
      // Update request status
      fundRequests[requestIndex].status = "awaiting_review"
      fundRequests[requestIndex].proofImage = proofPreview.src
      fundRequests[requestIndex].proofSubmittedAt = new Date().toISOString()
      fundRequests[requestIndex].updatedAt = new Date().toISOString()
  
      // Save to localStorage
      localStorage.setItem("fundRequests", JSON.stringify(fundRequests))
  
      // Show success message
      showToast("Payment proof submitted successfully!", "success")
  
      // Reload request details
      loadRequestDetails()
    }
  
    // Render payment proof
    function renderPaymentProof(request) {
      if (!paymentProofContainer) {
        const container = document.createElement("div")
        container.className = "payment-proof-container"
        requestDetailsContainer.appendChild(container)
        const paymentProofContainer = container
      }
  
      // Format date
      const proofDate = new Date(request.proofSubmittedAt || request.updatedAt)
      const formattedProofDate = `${proofDate.toLocaleDateString()} - ${proofDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
  
      paymentProofContainer.innerHTML = `
        <div class="payment-proof-card">
          <h2>Payment Proof</h2>
          <div class="proof-info">
            <p>Submitted on: ${formattedProofDate}</p>
          </div>
          <div class="proof-image">
            <img src="${request.proofImage}" alt="Payment Proof">
          </div>
        </div>
      `
    }
  
    // Render admin actions
    function renderAdminActions() {
      const adminActionsSection = document.createElement("div")
      adminActionsSection.className = "admin-actions-section"
  
      adminActionsSection.innerHTML = `
        <h2>Admin Actions</h2>
        <p>Review the payment proof and take appropriate action.</p>
        
        <div class="admin-actions">
          <button class="btn btn-primary" id="approve-request-btn">Approve & Fund Account</button>
          <button class="btn btn-danger" id="reject-request-btn">Reject Request</button>
        </div>
      `
  
      requestDetailsContainer.appendChild(adminActionsSection)
    }
  
    // Submit account details
    function submitAccountDetails() {
      const bankName = document.getElementById("bank-name").value
      const accountName = document.getElementById("account-name").value
      const accountNumber = document.getElementById("account-number").value
      const additionalInfo = document.getElementById("additional-info").value
  
      if (!requestId) {
        showToast("Request ID not found", "error")
        return
      }
  
      // Get fund requests from localStorage
      const fundRequests = JSON.parse(localStorage.getItem("fundRequests") || "[]")
  
      // Find request index
      const requestIndex = fundRequests.findIndex((req) => req.id === requestId)
  
      if (requestIndex === -1) {
        showToast("Request not found", "error")
        return
      }
  
      // Create account details object
      const accountDetails = {
        bankName,
        accountName,
        accountNumber,
        additionalInfo,
      }
  
      // Update request
      fundRequests[requestIndex].accountDetails = accountDetails
      fundRequests[requestIndex].status = "account_provided"
      fundRequests[requestIndex].updatedAt = new Date().toISOString()
  
      // Save to localStorage
      localStorage.setItem("fundRequests", JSON.stringify(fundRequests))
  
      // Show success message
      showToast("Account details provided successfully", "success")
  
      // Reload request details
      loadRequestDetails()
    }
  
    // Approve fund request
    function approveFundRequest() {
      if (!requestId) {
        showToast("Request ID not found", "error")
        return
      }
  
      // Get fund requests from localStorage
      const fundRequests = JSON.parse(localStorage.getItem("fundRequests") || "[]")
  
      // Find request index
      const requestIndex = fundRequests.findIndex((req) => req.id === requestId)
  
      if (requestIndex === -1) {
        showToast("Request not found", "error")
        return
      }
  
      // Get request
      const request = fundRequests[requestIndex]
  
      // Update request status
      request.status = "approved"
      request.updatedAt = new Date().toISOString()
  
      // Save to localStorage
      localStorage.setItem("fundRequests", JSON.stringify(fundRequests))
  
      // Add funds to user's wallet
      addFundsToWallet(request.userId, request.amount)
  
      // Create transaction record
      createTransactionRecord(request)
  
      // Update request status to funded
      request.status = "funded"
      request.updatedAt = new Date().toISOString()
  
      // Save to localStorage
      localStorage.setItem("fundRequests", JSON.stringify(fundRequests))
  
      // Show success message
      showToast("Fund request approved and account funded successfully", "success")
  
      // Reload request details
      loadRequestDetails()
    }
  
    // Reject fund request
    function rejectFundRequest() {
      if (!requestId) {
        showToast("Request ID not found", "error")
        return
      }
  
      // Get fund requests from localStorage
      const fundRequests = JSON.parse(localStorage.getItem("fundRequests") || "[]")
  
      // Find request index
      const requestIndex = fundRequests.findIndex((req) => req.id === requestId)
  
      if (requestIndex === -1) {
        showToast("Request not found", "error")
        return
      }
  
      // Update request status
      fundRequests[requestIndex].status = "rejected"
      fundRequests[requestIndex].updatedAt = new Date().toISOString()
  
      // Save to localStorage
      localStorage.setItem("fundRequests", JSON.stringify(fundRequests))
  
      // Show success message
      showToast("Fund request rejected successfully", "success")
  
      // Reload request details
      loadRequestDetails()
    }
  
    // Add funds to wallet
    function addFundsToWallet(userId, amount) {
      // Get current balance
      const currentBalance = Number.parseFloat(localStorage.getItem(`walletBalance_${userId}`) || "0")
  
      // Add funds
      const newBalance = currentBalance + amount
  
      // Save to localStorage
      localStorage.setItem(`walletBalance_${userId}`, newBalance.toString())
    }
  
    // Create transaction record
    function createTransactionRecord(request) {
      // Create transaction object
      const transaction = {
        id: generateId(),
        userId: request.userId,
        type: "deposit",
        amount: request.amount,
        description: "Wallet Deposit",
        date: new Date().toISOString(),
        reference: request.reference,
      }
  
      // Get existing transactions
      const transactions = JSON.parse(localStorage.getItem(`transactions_${request.userId}`) || "[]")
  
      // Add new transaction
      transactions.push(transaction)
  
      // Save to localStorage
      localStorage.setItem(`transactions_${request.userId}`, JSON.stringify(transactions))
    }
  
    // Format payment method
    function formatPaymentMethod(method) {
      if (method === "credit-card") {
        return "Credit/Debit Card"
      } else if (method === "bank-transfer") {
        return "Bank Transfer"
      } else if (method === "crypto") {
        return "Cryptocurrency"
      } else {
        return method
      }
    }
  
    // Generate a random ID
    function generateId() {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }
  
    // Show toast notification
    function showToast(message, type = "success") {
      const toast = document.getElementById("toast")
      const toastMessage = toast.querySelector(".toast-message")
      const toastIcon = toast.querySelector(".toast-content i")
  
      // Set message
      toastMessage.textContent = message
  
      // Set icon based on type
      if (type === "success") {
        toastIcon.className = "fas fa-check-circle"
      } else if (type === "error") {
        toastIcon.className = "fas fa-exclamation-circle"
      }
  
      // Add show class
      toast.classList.add("show")
  
      // Auto hide after 3 seconds
      setTimeout(() => {
        toast.classList.remove("show")
      }, 3000)
    }
  })
  