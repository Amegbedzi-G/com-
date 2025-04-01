// Posts Module
const Posts = (() => {
  // Mock Auth object for demonstration purposes
  const Auth = {
    getCurrentUser: () => {
      const user = localStorage.getItem("currentUser")
      return user ? JSON.parse(user) : null
    },
    isLoggedIn: () => {
      return localStorage.getItem("currentUser") !== null
    },
    updateProfile: (updatedUser) => {
      return new Promise((resolve) => {
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
        setTimeout(() => {
          resolve()
        }, 100)
      })
    },
  }

  // Mock showToast function for demonstration purposes
  function showToast(message, type) {
    console.log(`Toast: ${message} (Type: ${type})`)
    // In a real application, this would display a visual toast notification
  }

  // Private variables and functions
  const mockPosts = [
    {
      id: 1,
      userId: 1,
      username: "admin",
      userAvatar: "images/image.png",
      verified: true,
      verifiedType: "admin",
      caption: "Welcome to my exclusive content! Subscribe for more premium posts and behind-the-scenes content.",
      media: {
        type: "image",
        url: "images/image1.png",
        aspectRatio: "1:1",
      },
      isPremium: false,
      price: 0,
      likes: 245,
      comments: [
        {
          id: 1,
          userId: 2,
          username: "user1",
          text: "Great content! Looking forward to more.",
          createdAt: "2023-05-15T14:30:00Z",
        },
      ],
      createdAt: "2023-05-15T12:00:00Z",
    },
    {
      id: 2,
      userId: 1,
      username: "admin",
      userAvatar: "images/image.png",
      verified: true,
      verifiedType: "admin",
      caption: "Exclusive behind-the-scenes content from my latest photoshoot. Unlock to see more!",
      media: {
        type: "image",
        url: "images/image.png",
        aspectRatio: "4:3",
      },
      isPremium: true,
      price: 5.99,
      likes: 189,
      comments: [],
      createdAt: "2023-05-14T10:15:00Z",
    },
    {
      id: 3,
      userId: 1,
      username: "admin",
      userAvatar: "images/image.png",
      verified: true,
      verifiedType: "admin",
      caption: "Check out this amazing view from my vacation! More exclusive content coming soon.",
      media: {
        type: "video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnail: "/placeholder.svg?height=600&width=800",
        aspectRatio: "16:9",
      },
      isPremium: false,
      price: 0,
      likes: 312,
      comments: [
        {
          id: 2,
          userId: 2,
          username: "user1",
          text: "Wow, that looks amazing!",
          createdAt: "2023-05-13T16:45:00Z",
        },
        {
          id: 3,
          userId: 3,
          username: "user2",
          text: "Where is this? I need to visit!",
          createdAt: "2023-05-13T17:20:00Z",
        },
      ],
      createdAt: "2023-05-13T15:30:00Z",
    },
    {
      id: 4,
      userId: 1,
      username: "admin",
      userAvatar: "images/image.png",
      verified: true,
      verifiedType: "admin",
      caption: "Premium subscribers only! Exclusive content from my latest project.",
      media: {
        type: "image",
        url: "images/image1.png",
        aspectRatio: "1:1",
      },
      isPremium: true,
      price: 9.99,
      likes: 156,
      comments: [],
      createdAt: "2023-05-12T09:45:00Z",
    },
  ]

  // Get all posts
  function getPosts() {
    return new Promise((resolve) => {
      // Simulate API request
      setTimeout(() => {
        resolve(mockPosts)
      }, 1000)
    })
  }

  // Get post by ID
  function getPostById(postId) {
    return new Promise((resolve, reject) => {
      // Simulate API request
      setTimeout(() => {
        const post = mockPosts.find((p) => p.id === Number.parseInt(postId))

        if (post) {
          resolve(post)
        } else {
          reject(new Error("Post not found"))
        }
      }, 500)
    })
  }

  // Like a post
  function likePost(postId) {
    return new Promise((resolve, reject) => {
      // Simulate API request
      setTimeout(() => {
        const postIndex = mockPosts.findIndex((p) => p.id === Number.parseInt(postId))

        if (postIndex !== -1) {
          // Increment likes
          mockPosts[postIndex].likes += 1
          resolve(mockPosts[postIndex])
        } else {
          reject(new Error("Post not found"))
        }
      }, 500)
    })
  }

  // Unlike a post
  function unlikePost(postId) {
    return new Promise((resolve, reject) => {
      // Simulate API request
      setTimeout(() => {
        const postIndex = mockPosts.findIndex((p) => p.id === Number.parseInt(postId))

        if (postIndex !== -1) {
          // Decrement likes
          mockPosts[postIndex].likes = Math.max(0, mockPosts[postIndex].likes - 1)
          resolve(mockPosts[postIndex])
        } else {
          reject(new Error("Post not found"))
        }
      }, 500)
    })
  }

  // Add comment to post
  function addComment(postId, commentText) {
    return new Promise((resolve, reject) => {
      // Simulate API request
      setTimeout(() => {
        const postIndex = mockPosts.findIndex((p) => p.id === Number.parseInt(postId))

        if (postIndex !== -1) {
          const currentUser = Auth.getCurrentUser()

          if (!currentUser) {
            reject(new Error("User not logged in"))
            return
          }

          // Create new comment
          const newComment = {
            id: Date.now(),
            userId: currentUser.id,
            username: currentUser.username,
            text: commentText,
            createdAt: new Date().toISOString(),
          }

          // Add comment to post
          mockPosts[postIndex].comments.push(newComment)
          resolve(newComment)
        } else {
          reject(new Error("Post not found"))
        }
      }, 500)
    })
  }

  // Unlock premium content
  function unlockPremiumContent(postId) {
    return new Promise((resolve, reject) => {
      // Simulate API request
      setTimeout(() => {
        const post = mockPosts.find((p) => p.id === Number.parseInt(postId))

        if (!post) {
          reject(new Error("Post not found"))
          return
        }

        if (!post.isPremium) {
          reject(new Error("This content is not premium"))
          return
        }

        const currentUser = Auth.getCurrentUser()

        if (!currentUser) {
          reject(new Error("User not logged in"))
          return
        }

        // Check if user has enough balance
        if (currentUser.balance < post.price) {
          reject(new Error("Insufficient balance"))
          return
        }

        // Deduct from user's balance
        const updatedUser = {
          ...currentUser,
          balance: currentUser.balance - post.price,
        }

        // Update user in localStorage
        Auth.updateProfile(updatedUser)
          .then(() => {
            // Return unlocked post
            resolve({
              post,
              newBalance: updatedUser.balance,
            })
          })
          .catch((error) => {
            reject(error)
          })
      }, 1000)
    })
  }

  // Format post date
  function formatPostDate(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    }

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    }

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) {
      return `${diffInDays}d ago`
    }

    const options = { year: "numeric", month: "short", day: "numeric" }
    return date.toLocaleDateString(undefined, options)
  }

  // Render post HTML
  function renderPostHTML(post, isUnlocked = false) {
    const currentUser = Auth.getCurrentUser()
    const isLoggedIn = Auth.isLoggedIn()

    // Determine if post should be blurred
    const shouldBlur = post.isPremium && !isUnlocked && isLoggedIn

    // Create post element
    const postElement = document.createElement("div")
    postElement.className = "post-card"
    postElement.setAttribute("data-post-id", post.id)

    // Post header
    const postHeader = `
      <div class="post-header">
        <div class="post-avatar">
          <img src="${post.userAvatar}" alt="${post.username}">
        </div>
        <div class="post-user-info">
          <div class="post-username">
            ${post.username}
            ${post.verified ? `<span class="verified-badge ${post.verifiedType}"><i class="fas fa-check-circle"></i></span>` : ""}
          </div>
          <div class="post-date">${formatPostDate(post.createdAt)}</div>
        </div>
        <div class="post-options">
          <button class="post-options-btn">
            <i class="fas fa-ellipsis-h"></i>
          </button>
          <div class="post-options-menu">
            <a href="#" class="report-post">Report Post</a>
            ${currentUser && currentUser.isAdmin ? `<a href="#" class="edit-post">Edit Post</a>` : ""}
          </div>
        </div>
      </div>
    `

    // Post content
    let postContent = `
      <div class="post-content">
        ${post.isPremium ? `<div class="premium-indicator"><i class="fas fa-crown"></i> Premium</div>` : ""}
    `

    // Media content
    if (post.media.type === "image") {
      postContent += `
        <div class="post-media">
          <img src="${post.media.url}" alt="Post Image" class="${shouldBlur ? "blurred" : ""}">
          ${
            shouldBlur
              ? `
            <div class="premium-overlay">
              <p>Premium Content</p>
              <div class="premium-price">$${post.price.toFixed(2)}</div>
              <button class="btn btn-primary unlock-premium" data-post-id="${post.id}">Unlock Now</button>
            </div>
          `
              : ""
          }
        </div>
      `
    } else if (post.media.type === "video") {
      postContent += `
        <div class="post-media">
          ${
            shouldBlur
              ? `
            <img src="${post.media.thumbnail}" alt="Video Thumbnail" class="blurred">
            <div class="premium-overlay">
              <p>Premium Content</p>
              <div class="premium-price">$${post.price.toFixed(2)}</div>
              <button class="btn btn-primary unlock-premium" data-post-id="${post.id}">Unlock Now</button>
            </div>
          `
              : `
            <video controls poster="${post.media.thumbnail}">
              <source src="${post.media.url}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          `
          }
        </div>
      `
    }

    // Caption
    postContent += `
        <div class="post-caption">
          <p>${post.caption}</p>
        </div>
      </div>
    `

    // Post actions
    const postActions = `
      <div class="post-actions">
        <div class="post-action like-action" data-post-id="${post.id}">
          <i class="far fa-heart"></i>
          <span>${post.likes}</span>
        </div>
        <div class="post-action comment-action" data-post-id="${post.id}">
          <i class="far fa-comment"></i>
          <span>${post.comments.length}</span>
        </div>
        <div class="post-action tip-action" data-post-id="${post.id}">
          <i class="fas fa-coins"></i>
          <span>Tip</span>
        </div>
      </div>
    `

    // Post stats and comments
    let postStats = `
      <div class="post-stats">
        <div class="post-likes">${post.likes} likes</div>
    `

    // Comments preview (show up to 2)
    if (post.comments.length > 0) {
      postStats += `<div class="post-comments-preview">`

      const commentsToShow = post.comments.slice(0, 2)

      commentsToShow.forEach((comment) => {
        postStats += `
          <div class="post-comment">
            <span class="post-comment-username">${comment.username}</span>
            <span>${comment.text}</span>
          </div>
        `
      })

      if (post.comments.length > 2) {
        postStats += `<div class="view-all-comments">View all ${post.comments.length} comments</div>`
      }

      postStats += `</div>`
    }

    postStats += `
        <div class="post-time">${formatPostDate(post.createdAt)}</div>
      </div>
    `

    // Add comment form
    const addCommentForm = isLoggedIn
      ? `
      <div class="post-add-comment">
        <input type="text" placeholder="Add a comment..." class="comment-input" data-post-id="${post.id}">
        <button class="post-comment-btn" data-post-id="${post.id}" disabled>Post</button>
      </div>
    `
      : ""

    // Combine all sections
    postElement.innerHTML = postHeader + postContent + postActions + postStats + addCommentForm

    return postElement
  }

  // Initialize posts
  function init() {
    const postsContainer = document.getElementById("posts-feed")

    if (postsContainer) {
      // Show loading spinner
      postsContainer.innerHTML = `
        <div class="loading-spinner">
          <div class="spinner"></div>
        </div>
      `

      // Get posts
      getPosts()
        .then((posts) => {
          // Clear loading spinner
          postsContainer.innerHTML = ""

          // Render posts
          posts.forEach((post) => {
            const postElement = renderPostHTML(post)
            postsContainer.appendChild(postElement)
          })

          // Setup post interactions
          setupPostInteractions()
        })
        .catch((error) => {
          console.error("Error loading posts:", error)
          postsContainer.innerHTML = `
            <div class="error-message">
              <p>Failed to load posts. Please try again later.</p>
              <button class="btn btn-primary retry-btn">Retry</button>
            </div>
          `

          // Setup retry button
          const retryBtn = postsContainer.querySelector(".retry-btn")
          if (retryBtn) {
            retryBtn.addEventListener("click", init)
          }
        })
    }
  }

  // Setup post interactions
  function setupPostInteractions() {
    // Like/unlike posts
    const likeActions = document.querySelectorAll(".like-action")
    likeActions.forEach((action) => {
      action.addEventListener("click", function () {
        if (!Auth.isLoggedIn()) {
          showLoginModal()
          return
        }

        const postId = this.getAttribute("data-post-id")
        const likeIcon = this.querySelector("i")
        const likeCount = this.querySelector("span")

        if (likeIcon.classList.contains("fas")) {
          // Unlike post
          unlikePost(postId)
            .then((post) => {
              likeIcon.classList.remove("fas")
              likeIcon.classList.add("far")
              likeCount.textContent = post.likes
              this.classList.remove("liked")
            })
            .catch((error) => {
              console.error("Error unliking post:", error)
              showToast("Failed to unlike post", "error")
            })
        } else {
          // Like post
          likePost(postId)
            .then((post) => {
              likeIcon.classList.remove("far")
              likeIcon.classList.add("fas")
              likeCount.textContent = post.likes
              this.classList.add("liked")
            })
            .catch((error) => {
              console.error("Error liking post:", error)
              showToast("Failed to like post", "error")
            })
        }
      })
    })

    // Comment on posts
    const commentInputs = document.querySelectorAll(".comment-input")
    commentInputs.forEach((input) => {
      input.addEventListener("input", function () {
        const postId = this.getAttribute("data-post-id")
        const commentBtn = document.querySelector(`.post-comment-btn[data-post-id="${postId}"]`)

        if (this.value.trim()) {
          commentBtn.disabled = false
        } else {
          commentBtn.disabled = true
        }
      })

      input.addEventListener("keypress", function (e) {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault()
          const postId = this.getAttribute("data-post-id")
          const commentBtn = document.querySelector(`.post-comment-btn[data-post-id="${postId}"]`)

          if (!commentBtn.disabled) {
            commentBtn.click()
          }
        }
      })
    })

    const commentBtns = document.querySelectorAll(".post-comment-btn")
    commentBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const postId = this.getAttribute("data-post-id")
        const commentInput = document.querySelector(`.comment-input[data-post-id="${postId}"]`)
        const commentText = commentInput.value.trim()

        if (commentText) {
          // Disable button while submitting
          this.disabled = true

          addComment(postId, commentText)
            .then((comment) => {
              // Clear input
              commentInput.value = ""

              // Update comment count
              const commentAction = document.querySelector(`.comment-action[data-post-id="${postId}"]`)
              const commentCountSpan = commentAction.querySelector("span")
              const currentCount = Number.parseInt(commentCountSpan.textContent)
              commentCountSpan.textContent = currentCount + 1

              // Add comment to preview
              const commentsPreview = document.querySelector(
                `.post-card[data-post-id="${postId}"] .post-comments-preview`,
              )

              if (commentsPreview) {
                // If there are already comments
                const newCommentHTML = `
                  <div class="post-comment">
                    <span class="post-comment-username">${comment.username}</span>
                    <span>${comment.text}</span>
                  </div>
                `

                commentsPreview.insertAdjacentHTML("afterbegin", newCommentHTML)

                // Update "View all comments" text if needed
                const viewAllComments = commentsPreview.querySelector(".view-all-comments")
                if (viewAllComments) {
                  const totalComments = currentCount + 1
                  viewAllComments.textContent = `View all ${totalComments} comments`
                }
              } else {
                // If this is the first comment
                const postStats = document.querySelector(`.post-card[data-post-id="${postId}"] .post-stats`)
                const newCommentsPreviewHTML = `
                  <div class="post-comments-preview">
                    <div class="post-comment">
                      <span class="post-comment-username">${comment.username}</span>
                      <span>${comment.text}</span>
                    </div>
                  </div>
                `

                const postTime = postStats.querySelector(".post-time")
                postStats.insertBefore(
                  document.createRange().createContextualFragment(newCommentsPreviewHTML),
                  postTime,
                )
              }

              showToast("Comment added successfully", "success")
            })
            .catch((error) => {
              console.error("Error adding comment:", error)
              showToast(error.message, "error")
            })
            .finally(() => {
              this.disabled = false
            })
        }
      })
    })

    // Unlock premium content
    const unlockButtons = document.querySelectorAll(".unlock-premium")
    unlockButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const postId = this.getAttribute("data-post-id")

        // Get post details
        getPostById(postId)
          .then((post) => {
            // Show payment modal
            const paymentModal = document.getElementById("payment-modal")
            const paymentAmount = paymentModal.querySelector("#payment-amount")
            const walletBalance = paymentModal.querySelector("#wallet-balance")
            const currentUser = Auth.getCurrentUser()

            paymentAmount.textContent = `$${post.price.toFixed(2)}`
            walletBalance.textContent = `$${currentUser.balance.toFixed(2)}`

            // Show modal
            paymentModal.classList.add("active")

            // Setup pay from wallet button
            const payFromWalletBtn = document.getElementById("pay-from-wallet")

            // Remove existing event listeners
            const newPayFromWalletBtn = payFromWalletBtn.cloneNode(true)
            payFromWalletBtn.parentNode.replaceChild(newPayFromWalletBtn, payFromWalletBtn)

            // Add new event listener
            newPayFromWalletBtn.addEventListener("click", function () {
              // Disable button while processing
              this.disabled = true
              this.textContent = "Processing..."

              unlockPremiumContent(postId)
                .then((result) => {
                  // Close modal
                  paymentModal.classList.remove("active")

                  // Update post to show unblurred content
                  const postCard = document.querySelector(`.post-card[data-post-id="${postId}"]`)

                  if (postCard) {
                    // Replace the post card with updated content
                    const updatedPostElement = renderPostHTML(result.post, true)
                    postCard.parentNode.replaceChild(updatedPostElement, postCard)

                    // Setup interactions for the new post
                    setupPostInteractions()
                  }

                  // Update wallet balance in UI
                  const walletBalanceElements = document.querySelectorAll("#wallet-balance")
                  walletBalanceElements.forEach((element) => {
                    element.textContent = `$${result.newBalance.toFixed(2)}`
                  })

                  showToast("Content unlocked successfully!", "success")
                })
                .catch((error) => {
                  console.error("Error unlocking content:", error)
                  showToast(error.message, "error")
                })
                .finally(() => {
                  // Re-enable button
                  this.disabled = false
                  this.textContent = "Pay from Wallet"
                })
            })
          })
          .catch((error) => {
            console.error("Error getting post details:", error)
            showToast("Failed to load post details", "error")
          })
      })
    })

    // Tip posts
    const tipActions = document.querySelectorAll(".tip-action")
    tipActions.forEach((action) => {
      action.addEventListener("click", () => {
        if (!Auth.isLoggedIn()) {
          showLoginModal()
          return
        }

        // Show tip modal
        // This would be implemented in a separate module
        showToast("Tipping feature coming soon!", "info")
      })
    })

    // Post options menu
    const postOptionsBtns = document.querySelectorAll(".post-options-btn")
    postOptionsBtns.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation()
        const optionsContainer = this.closest(".post-options")
        optionsContainer.classList.toggle("active")
      })
    })

    // Close post options menu when clicking outside
    document.addEventListener("click", () => {
      const activeOptions = document.querySelectorAll(".post-options.active")
      activeOptions.forEach((options) => {
        options.classList.remove("active")
      })
    })
  }

  // Show login modal
  function showLoginModal() {
    const loginModal = document.getElementById("login-modal")
    if (loginModal) {
      loginModal.classList.add("active")
    } else {
      // Redirect to login page if modal doesn't exist
      window.location.href = "login.html"
    }
  }

  // Public API
  return {
    getPosts,
    getPostById,
    likePost,
    unlikePost,
    addComment,
    unlockPremiumContent,
    renderPostHTML,
    init,
    setupPostInteractions,
  }
})()

// Initialize posts on page load
document.addEventListener("DOMContentLoaded", () => {
  Posts.init()

  // Close modals
  const closeModalBtns = document.querySelectorAll(".close-modal")
  closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const modal = this.closest(".modal")
      modal.classList.remove("active")
    })
  })

  // Close modal when clicking outside
  const modals = document.querySelectorAll(".modal")
  modals.forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        this.classList.remove("active")
      }
    })
  })
})

