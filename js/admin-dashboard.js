import { Chart } from "@/components/ui/chart"
// Admin Dashboard JavaScript
document.addEventListener("DOMContentLoaded", () => {
  // Mock Auth object for demonstration purposes.  In a real application,
  // this would be replaced with a proper authentication library.
  const Auth = {
    getCurrentUser: () => {
      // Replace with actual authentication logic
      // For example, check for a token in local storage
      const isAdmin = localStorage.getItem("isAdmin") === "true" // Example: check local storage
      return {
        isAdmin: isAdmin,
      }
    },
  }

  // Check if user is admin
  const currentUser = Auth.getCurrentUser()
  if (!currentUser || !currentUser.isAdmin) {
    window.location.href = "index.html" // Redirect non-admin users
    return
  }

  // Initialize dashboard tabs
  initDashboardTabs()

  // Initialize charts
  initCharts()

  // Initialize create post modal
  initCreatePostModal()

  // Initialize view proof modal
  initViewProofModal()

  // Initialize post type toggle
  initPostTypeToggle()
})

// Initialize dashboard tabs
function initDashboardTabs() {
  const tabs = document.querySelectorAll(".dashboard-tab")
  const tabContents = document.querySelectorAll(".dashboard-tab-content")

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Remove active class from all tabs
      tabs.forEach((t) => t.classList.remove("active"))

      // Add active class to clicked tab
      this.classList.add("active")

      // Hide all tab contents
      tabContents.forEach((content) => {
        content.classList.remove("active")
      })

      // Show selected tab content
      const tabId = this.getAttribute("data-tab") + "-tab"
      document.getElementById(tabId).classList.add("active")
    })
  })
}

// Initialize charts
function initCharts() {
  // Revenue Chart
  const revenueCtx = document.getElementById("revenue-chart")
  if (revenueCtx) {
    const revenueChart = new Chart(revenueCtx, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Revenue",
            data: [150, 230, 180, 290, 320, 250, 400],
            backgroundColor: "rgba(94, 53, 177, 0.2)",
            borderColor: "rgba(94, 53, 177, 1)",
            borderWidth: 2,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => "$" + value,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => "$" + context.raw,
            },
          },
        },
      },
    })

    // Chart period buttons
    const revenuePeriodBtns = document.querySelectorAll(".chart-card:first-child .period-btn")
    revenuePeriodBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        // Remove active class from all buttons
        revenuePeriodBtns.forEach((b) => b.classList.remove("active"))

        // Add active class to clicked button
        this.classList.add("active")

        // Update chart data based on period
        const period = this.getAttribute("data-period")
        let labels, data

        if (period === "week") {
          labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
          data = [150, 230, 180, 290, 320, 250, 400]
        } else if (period === "month") {
          labels = ["Week 1", "Week 2", "Week 3", "Week 4"]
          data = [1200, 1500, 1800, 2100]
        } else if (period === "year") {
          labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
          data = [4500, 5200, 4800, 5500, 6200, 5800, 6500, 7000, 6800, 7200, 7500, 8000]
        }

        revenueChart.data.labels = labels
        revenueChart.data.datasets[0].data = data
        revenueChart.update()
      })
    })
  }

  // Subscribers Chart
  const subscribersCtx = document.getElementById("subscribers-chart")
  if (subscribersCtx) {
    const subscribersChart = new Chart(subscribersCtx, {
      type: "bar",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "New Subscribers",
            data: [12, 19, 15, 25, 22, 30, 35],
            backgroundColor: "rgba(255, 64, 129, 0.7)",
            borderColor: "rgba(255, 64, 129, 1)",
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    })

    // Chart period buttons
    const subscribersPeriodBtns = document.querySelectorAll(".chart-card:nth-child(2) .period-btn")
    subscribersPeriodBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        // Remove active class from all buttons
        subscribersPeriodBtns.forEach((b) => b.classList.remove("active"))

        // Add active class to clicked button
        this.classList.add("active")

        // Update chart data based on period
        const period = this.getAttribute("data-period")
        let labels, data

        if (period === "week") {
          labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
          data = [12, 19, 15, 25, 22, 30, 35]
        } else if (period === "month") {
          labels = ["Week 1", "Week 2", "Week 3", "Week 4"]
          data = [85, 95, 110, 125]
        } else if (period === "year") {
          labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
          data = [150, 180, 210, 250, 280, 320, 350, 380, 410, 450, 480, 520]
        }

        subscribersChart.data.labels = labels
        subscribersChart.data.datasets[0].data = data
        subscribersChart.update()
      })
    })
  }
}

// Initialize create post modal
function initCreatePostModal() {
  const createPostBtn = document.getElementById("create-post-btn")
  const createPostModal = document.getElementById("create-post-modal")
  const closeModalBtns = document.querySelectorAll(".close-modal")

  if (createPostBtn && createPostModal) {
    createPostBtn.addEventListener("click", () => {
      createPostModal.classList.add("active")
    })

    closeModalBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const modal = this.closest(".modal")
        modal.classList.remove("active")
      })
    })

    // Close modal when clicking outside
    createPostModal.addEventListener("click", function (e) {
      if (e.target === this) {
        this.classList.remove("active")
      }
    })

    // Media upload
    const mediaUploadArea = document.getElementById("media-upload-area")
    const mediaUpload = document.getElementById("media-upload")
    const mediaPreview = document.getElementById("media-preview")

    if (mediaUploadArea && mediaUpload && mediaPreview) {
      mediaUploadArea.addEventListener("click", () => {
        mediaUpload.click()
      })

      mediaUploadArea.addEventListener("dragover", function (e) {
        e.preventDefault()
        this.style.borderColor = "var(--color-primary)"
        this.style.backgroundColor = "rgba(94, 53, 177, 0.05)"
      })

      mediaUploadArea.addEventListener("dragleave", function (e) {
        e.preventDefault()
        this.style.borderColor = "var(--color-border)"
        this.style.backgroundColor = ""
      })

      mediaUploadArea.addEventListener("drop", function (e) {
        e.preventDefault()
        this.style.borderColor = "var(--color-border)"
        this.style.backgroundColor = ""

        const files = e.dataTransfer.files
        handleFiles(files)
      })

      mediaUpload.addEventListener("change", function () {
        handleFiles(this.files)
      })

      function handleFiles(files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]

          if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
            const reader = new FileReader()

            reader.onload = (e) => {
              const mediaItem = document.createElement("div")
              mediaItem.className = "media-preview-item"

              if (file.type.startsWith("image/")) {
                const img = document.createElement("img")
                img.src = e.target.result
                img.alt = "Media Preview"
                mediaItem.appendChild(img)
              } else if (file.type.startsWith("video/")) {
                const video = document.createElement("video")
                video.src = e.target.result
                video.muted = true
                video.autoplay = true
                video.loop = true
                mediaItem.appendChild(video)
              }

              const removeBtn = document.createElement("div")
              removeBtn.className = "remove-media"
              removeBtn.innerHTML = '<i class="fas fa-times"></i>'
              removeBtn.addEventListener("click", () => {
                mediaItem.remove()
              })

              mediaItem.appendChild(removeBtn)
              mediaPreview.appendChild(mediaItem)
            }

            reader.readAsDataURL(file)
          }
        }
      }
    }

    // Form submission
    const createPostForm = document.getElementById("create-post-form")

    if (createPostForm) {
      createPostForm.addEventListener("submit", (e) => {
        e.preventDefault()

        // Get form data
        const caption = document.getElementById("post-caption").value
        const postType = document.querySelector('input[name="post-type"]:checked').value
        const price = document.getElementById("post-price").value

        // Validate form
        if (!caption) {
          showToast("Please enter a caption for your post", "error")
          return
        }

        if (postType === "premium" && (!price || Number.parseFloat(price) < 0.99)) {
          showToast("Please enter a valid price (minimum $0.99)", "error")
          return
        }

        if (mediaPreview.children.length === 0) {
          showToast("Please upload at least one image or video", "error")
          return
        }

        // Simulate API request
        const submitBtn = createPostForm.querySelector('button[type="submit"]')
        const originalBtnText = submitBtn.innerHTML
        submitBtn.disabled = true
        submitBtn.innerHTML = "Publishing..."

        setTimeout(() => {
          // Reset form
          createPostForm.reset()
          mediaPreview.innerHTML = ""
          document.querySelector(".premium-options").style.display = "none"

          // Close modal
          createPostModal.classList.remove("active")

          // Show success message
          showToast("Post published successfully!", "success")

          // Reset button
          submitBtn.disabled = false
          submitBtn.innerHTML = originalBtnText
        }, 2000)
      })
    }
  }
}

// Initialize view proof modal
function initViewProofModal() {
  const viewProofBtns = document.querySelectorAll(".view-proof")
  const viewProofModal = document.getElementById("view-proof-modal")

  if (viewProofBtns.length && viewProofModal) {
    viewProofBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        viewProofModal.classList.add("active")
      })
    })
  }
}

// Initialize post type toggle
function initPostTypeToggle() {
  const postTypeRadios = document.querySelectorAll('input[name="post-type"]')
  const premiumOptions = document.querySelector(".premium-options")

  if (postTypeRadios.length && premiumOptions) {
    postTypeRadios.forEach((radio) => {
      radio.addEventListener("change", function () {
        if (this.value === "premium") {
          premiumOptions.style.display = "block"
        } else {
          premiumOptions.style.display = "none"
        }
      })
    })
  }
}

// Helper function to show toast notifications
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

