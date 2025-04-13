// Main feed functionality for MyFans user home page

document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const postsContainer = document.querySelector('.posts-container');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const categoryList = document.querySelector('.category-list');
  
  // State management
  let posts = [];
  let currentFilter = 'all';
  let categories = ['Fitness', 'Gaming', 'Photography', 'Art', 'Music', 'Fashion'];
  
  // Initialize the feed
  initFeed();
  
  // Main initialization function
  function initFeed() {
    // Fetch posts from API (simulated for now)
    fetchPosts();
    
    // Set up event listeners
    setupEventListeners();
    
    // Render categories
    renderCategories();
  }
  
  // Fetch posts from the server
  function fetchPosts() {
    // Simulate API call - in a real app, this would be a fetch to your backend
    setTimeout(() => {
      // This would normally come from your server
      posts = getSamplePosts();
      renderPosts(posts);
    }, 500);
  }
  
  // Set up all event listeners
  function setupEventListeners() {
    // Filter buttons
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');
        filterPosts(filter);
        
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
      });
    });
    
    // Post interaction delegation (for dynamically created elements)
    postsContainer.addEventListener('click', handlePostInteractions);
    
    // Comment form submission
    postsContainer.addEventListener('submit', function(e) {
      if (e.target.closest('.comment-form')) {
        e.preventDefault();
        const form = e.target.closest('.comment-form');
        const input = form.querySelector('.comment-input');
        const postId = form.closest('.post').getAttribute('data-post-id');
        
        if (input.value.trim()) {
          addComment(postId, input.value);
          input.value = '';
        }
      }
    });
    
    // Handle "Enter" key in comment inputs
    postsContainer.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && e.target.classList.contains('comment-input')) {
        e.preventDefault();
        const form = e.target.closest('.comment-form');
        const submitBtn = form.querySelector('.comment-submit');
        submitBtn.click();
      }
    });
    
    // PPV unlock buttons
    document.querySelectorAll('.unlock-ppv').forEach(button => {
      button.addEventListener('click', function() {
        const postId = this.closest('.post').getAttribute('data-post-id');
        showUnlockModal(postId);
      });
    });
    
    // Modal close button
    document.querySelector('.close-modal').addEventListener('click', function() {
      document.getElementById('unlock-ppv-modal').classList.remove('show');
    });
    
    // Confirm unlock PPV content
    document.getElementById('confirm-unlock-ppv').addEventListener('click', function() {
      const postId = this.getAttribute('data-post-id');
      unlockPPVContent(postId);
    });
  }
  
  // Handle post interactions (likes, comments, bookmarks, shares)
  function handlePostInteractions(e) {
    const target = e.target;
    const actionBtn = target.closest('.post-action-btn');
    
    if (!actionBtn) return;
    
    const post = actionBtn.closest('.post');
    const postId = post.getAttribute('data-post-id');
    
    // Like button
    if (actionBtn.textContent.trim().includes('Like')) {
      toggleLike(postId, post);
    }
    
    // Comment button
    else if (actionBtn.textContent.trim().includes('Comment')) {
      focusCommentInput(post);
    }
    
    // Save/Bookmark button
    else if (actionBtn.textContent.trim().includes('Save')) {
      toggleBookmark(postId, post);
    }
    
    // Share button
    else if (actionBtn.textContent.trim().includes('Share')) {
      sharePost(postId);
    }
  }
  
  // Filter posts based on selected filter
  function filterPosts(filter) {
    currentFilter = filter;
    let filteredPosts = [];
    
    switch(filter) {
      case 'subscribed':
        filteredPosts = posts.filter(post => post.isSubscribed);
        break;
      case 'trending':
        filteredPosts = posts.filter(post => post.isTrending);
        break;
      case 'recent':
        filteredPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'all':
      default:
        filteredPosts = posts;
        break;
    }
    
    renderPosts(filteredPosts);
  }
  
  // Render posts to the DOM
  function renderPosts(postsToRender) {
    postsContainer.innerHTML = '';
    
    if (postsToRender.length === 0) {
      postsContainer.innerHTML = `
        <div class="no-posts">
          <i class="fas fa-inbox"></i>
          <p>No posts to display</p>
        </div>
      `;
      return;
    }
    
    postsToRender.forEach(post => {
      const postElement = createPostElement(post);
      postsContainer.appendChild(postElement);
    });
    
    // Initialize any post-specific functionality
    initializePostFunctionality();
  }
  
  // Create a post DOM element
  function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    postDiv.setAttribute('data-post-id', post.id);
    
    // Create post header
    const postHeader = createPostHeader(post);
    
    // Create post content
    const postContent = createPostContent(post);
    
    // Create post stats
    const postStats = createPostStats(post);
    
    // Create post actions bar
    const postActions = createPostActions(post);
    
    // Create post comments (if not PPV or if unlocked)
    let postComments = '';
    if (!post.isPPV || post.isUnlocked) {
      postComments = createPostComments(post);
    }
    
    // Assemble the post
    postDiv.innerHTML = `
      ${postHeader}
      ${postContent}
      ${postStats}
      ${postActions}
      ${postComments}
    `;
    
    return postDiv;
  }
  
  // Create post header HTML
  function createPostHeader(post) {
    return `
      <div class="post-header">
        <div class="post-user">
          <div class="post-avatar">
            <img src="${post.author.avatar}" alt="${post.author.name} Avatar" style="object-fit: fill;">
          </div>
          <div class="post-user-info">
            <div class="post-username">
              ${post.author.name} <span class="verified-badge admin"><i class="fas fa-check-circle"></i></span>
            </div>
            <div class="post-time">${formatTimeAgo(post.date)}</div>
          </div>
        </div>
        <div class="post-actions">
          <button class="btn btn-icon">
            <i class="fas fa-ellipsis-h"></i>
          </button>
        </div>
      </div>
    `;
  }
  
  // Create post content HTML based on post type
  function createPostContent(post) {
    let mediaContent = '';
    
    // Text content
    const textContent = `
      <div class="post-text">
        <p>${post.content}</p>
      </div>
    `;
    
    // Media content based on type
    if (post.type === 'image' && post.media) {
      mediaContent = `
        <div class="post-media">
          <img src="${post.media}" alt="Post Image" class="post-image">
        </div>
      `;
    } else if (post.type === 'video' && post.media) {
      mediaContent = `
        <div class="post-media">
          <div class="video-container">
            <video controls poster="${post.thumbnail || '/placeholder.svg?height=400&width=600'}">
              <source src="${post.media}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
            ${post.duration ? `<div class="video-duration">${post.duration}</div>` : ''}
          </div>
        </div>
      `;
    } else if (post.type === 'gallery' && post.gallery) {
      // Create gallery layout
      const galleryImages = post.gallery.map(img => 
        `<img src="${img}" alt="Gallery Image" class="gallery-image">`
      ).join('');
      
      const halfLength = Math.ceil(post.gallery.length / 2);
      const firstRow = post.gallery.slice(0, halfLength);
      const secondRow = post.gallery.slice(halfLength);
      
      const firstRowImages = firstRow.map(img => 
        `<img src="${img}" alt="Gallery Image" class="gallery-image">`
      ).join('');
      
      const secondRowImages = secondRow.map(img => 
        `<img src="${img}" alt="Gallery Image" class="gallery-image">`
      ).join('');
      
      mediaContent = `
        <div class="post-media">
          <div class="image-gallery">
            <div class="image-gallery-row">
              ${firstRowImages}
            </div>
            ${secondRow.length > 0 ? `<div class="image-gallery-row">${secondRowImages}</div>` : ''}
          </div>
        </div>
      `;
    } else if (post.isPPV && !post.isUnlocked) {
      // Pay-per-view content
      mediaContent = `
        <div class="post-media ppv-content">
          <div class="ppv-preview">
            <img src="${post.thumbnail || '/placeholder.svg?height=400&width=600'}" alt="PPV Content Preview" class="blurred">
            <div class="ppv-overlay">
              <div class="ppv-info">
                <i class="fas fa-lock"></i>
                <p>Pay-per-view content</p>
                <p class="ppv-price">$${post.price.toFixed(2)}</p>
              </div>
              <button class="btn btn-primary unlock-ppv">Unlock Now</button>
            </div>
          </div>
        </div>
      `;
    }
    
    return `
      <div class="post-content">
        ${textContent}
        ${mediaContent}
      </div>
    `;
  }
  
  // Create post stats HTML
  function createPostStats(post) {
    return `
      <div class="post-stats">
        <div class="post-stat">
          <i class="fas fa-heart"></i>
          <span>${post.likes}</span>
        </div>
        <div class="post-stat">
          <i class="fas fa-comment"></i>
          <span>${post.comments.length}</span>
        </div>
        <div class="post-stat">
          <i class="fas fa-bookmark"></i>
          <span>${post.bookmarks}</span>
        </div>
        <div class="post-stat">
          <i class="fas fa-share"></i>
          <span>${post.shares}</span>
        </div>
      </div>
    `;
  }
  
  // Create post actions HTML
  function createPostActions(post) {
    return `
      <div class="post-actions-bar">
        <button class="post-action-btn ${post.isLiked ? 'active' : ''}">
          <i class="${post.isLiked ? 'fas' : 'far'} fa-heart"></i>
          <span>Like</span>
        </button>
        <button class="post-action-btn">
          <i class="far fa-comment"></i>
          <span>Comment</span>
        </button>
        <button class="post-action-btn ${post.isBookmarked ? 'active' : ''}">
          <i class="${post.isBookmarked ? 'fas' : 'far'} fa-bookmark"></i>
          <span>Save</span>
        </button>
        <button class="post-action-btn">
          <i class="far fa-share-square"></i>
          <span>Share</span>
        </button>
      </div>
    `;
  }
  
  // Create post comments HTML
  function createPostComments(post) {
    // Only show first 2 comments, with a "view more" button if there are more
    const visibleComments = post.comments.slice(0, 2);
    const hasMoreComments = post.comments.length > 2;
    
    const commentsHTML = visibleComments.map(comment => `
      <div class="comment">
        <div class="comment-avatar">
          <img src="${comment.avatar || '/placeholder.svg?height=40&width=40'}" alt="${comment.username} Avatar">
        </div>
        <div class="comment-content">
          <div class="comment-user">${comment.username}</div>
          <div class="comment-text">${comment.text}</div>
          <div class="comment-actions">
            <span class="comment-time">${formatTimeAgo(comment.date)}</span>
            <button class="comment-like">Like</button>
            <button class="comment-reply">Reply</button>
          </div>
        </div>
      </div>
    `).join('');
    
    return `
      <div class="post-comments">
        <div class="comment-form">
          <div class="comment-avatar">
            <img src="/images/image1.png" alt="User Avatar">
          </div>
          <div class="comment-input-container">
            <input type="text" placeholder="Write a comment..." class="comment-input">
            <button class="comment-submit">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
        
        <div class="comments-list">
          ${commentsHTML}
          ${hasMoreComments ? `<button class="view-more-comments">View more comments</button>` : ''}
        </div>
      </div>
    `;
  }
  
  // Render categories in the sidebar
  function renderCategories() {
    categoryList.innerHTML = categories.map(category => `
      <div class="category-item">
        <a href="#" data-category="${category.toLowerCase()}">${category}</a>
      </div>
    `).join('');
    
    // Add event listeners to category links
    document.querySelectorAll('.category-item a').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const category = this.getAttribute('data-category');
        filterByCategory(category);
      });
    });
  }
  
  // Filter posts by category
  function filterByCategory(category) {
    const filteredPosts = posts.filter(post => 
      post.categories && post.categories.includes(category)
    );
    renderPosts(filteredPosts);
  }
  
  // Toggle like on a post
  function toggleLike(postId, postElement) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const likeButton = postElement.querySelector('.post-action-btn:nth-child(1)');
    const likeIcon = likeButton.querySelector('i');
    const likeCount = postElement.querySelector('.post-stat:nth-child(1) span');
    
    if (post.isLiked) {
      post.likes--;
      post.isLiked = false;
      likeIcon.className = 'far fa-heart';
      likeButton.classList.remove('active');
    } else {
      post.likes++;
      post.isLiked = true;
      likeIcon.className = 'fas fa-heart';
      likeButton.classList.add('active');
      
      // Show toast notification
      showToast('Post liked!');
    }
    
    likeCount.textContent = post.likes;
    
    // In a real app, you would send this update to the server
    // updatePostLike(postId, post.isLiked);
  }
  
  // Toggle bookmark on a post
  function toggleBookmark(postId, postElement) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const bookmarkButton = postElement.querySelector('.post-action-btn:nth-child(3)');
    const bookmarkIcon = bookmarkButton.querySelector('i');
    const bookmarkCount = postElement.querySelector('.post-stat:nth-child(3) span');
    
    if (post.isBookmarked) {
      post.bookmarks--;
      post.isBookmarked = false;
      bookmarkIcon.className = 'far fa-bookmark';
      bookmarkButton.classList.remove('active');
    } else {
      post.bookmarks++;
      post.isBookmarked = true;
      bookmarkIcon.className = 'fas fa-bookmark';
      bookmarkButton.classList.add('active');
      
      // Show toast notification
      showToast('Post saved to your bookmarks!');
    }
    
    bookmarkCount.textContent = post.bookmarks;
    
    // In a real app, you would send this update to the server
    // updatePostBookmark(postId, post.isBookmarked);
  }
  
  // Focus the comment input
  function focusCommentInput(postElement) {
    const commentInput = postElement.querySelector('.comment-input');
    if (commentInput) {
      commentInput.focus();
    }
  }
  
  // Add a new comment to a post
  function addComment(postId, commentText) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    // Create new comment object
    const newComment = {
      id: generateId(),
      username: 'You',
      avatar: '/images/image1.png',
      text: commentText,
      date: new Date(),
      likes: 0
    };
    
    // Add to post comments
    post.comments.unshift(newComment);
    
    // Update comment count in UI
    const postElement = document.querySelector(`.post[data-post-id="${postId}"]`);
    const commentCount = postElement.querySelector('.post-stat:nth-child(2) span');
    commentCount.textContent = post.comments.length;
    
    // Update comments list
    const commentsList = postElement.querySelector('.comments-list');
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    commentElement.innerHTML = `
      <div class="comment-avatar">
        <img src="${newComment.avatar}" alt="${newComment.username} Avatar">
      </div>
      <div class="comment-content">
        <div class="comment-user">${newComment.username}</div>
        <div class="comment-text">${newComment.text}</div>
        <div class="comment-actions">
          <span class="comment-time">Just now</span>
          <button class="comment-like">Like</button>
          <button class="comment-reply">Reply</button>
        </div>
      </div>
    `;
    
    // Insert at the beginning of the comments list
    if (commentsList.firstChild) {
      commentsList.insertBefore(commentElement, commentsList.firstChild);
    } else {
      commentsList.appendChild(commentElement);
    }
    
    // Show toast notification
    showToast('Comment added!');
    
    // In a real app, you would send this update to the server
    // addCommentToPost(postId, newComment);
  }
  
  // Share a post
  function sharePost(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    // Increment share count
    post.shares++;
    
    // Update share count in UI
    const postElement = document.querySelector(`.post[data-post-id="${postId}"]`);
    const shareCount = postElement.querySelector('.post-stat:nth-child(4) span');
    shareCount.textContent = post.shares;
    
    // Show share options (in a real app)
    // For now, just show a toast
    showToast('Share options would appear here!');
    
    // In a real app, you would send this update to the server
    // updatePostShares(postId);
  }
  
  // Show the unlock PPV modal
  function showUnlockModal(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const modal = document.getElementById('unlock-ppv-modal');
    const priceElement = modal.querySelector('.ppv-price');
    const confirmButton = document.getElementById('confirm-unlock-ppv');
    const previewImage = modal.querySelector('.ppv-preview-modal img');
    
    // Set the post ID on the confirm button
    confirmButton.setAttribute('data-post-id', postId);
    
    // Set the price
    priceElement.textContent = `$${post.price.toFixed(2)}`;
    
    // Set the preview image
    if (post.thumbnail) {
      previewImage.src = post.thumbnail;
    }
    
    // Show the modal
    modal.classList.add('show');
  }
  
  // Unlock PPV content
  function unlockPPVContent(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    // Get user's wallet balance (in a real app, this would come from the server)
    const walletBalance = parseFloat(document.getElementById('wallet-balance-ppv').textContent.replace('$', ''));
    
    // Check if user has enough balance
    if (walletBalance < post.price) {
      showToast('Insufficient balance. Please top up your wallet.', 'error');
      return;
    }
    
    // Update post to be unlocked
    post.isUnlocked = true;
    
    // Close the modal
    document.getElementById('unlock-ppv-modal').classList.remove('show');
    
    // Update the post in the UI
    renderPosts(posts);
    
    // Show success toast
    showToast('Content unlocked successfully!');
    
    // In a real app, you would send this update to the server
    // unlockPPVContent(postId);
  }
  
  // Initialize post-specific functionality
  function initializePostFunctionality() {
    // View more comments buttons
    document.querySelectorAll('.view-more-comments').forEach(button => {
      button.addEventListener('click', function() {
        const postId = this.closest('.post').getAttribute('data-post-id');
        loadMoreComments(postId);
      });
    });
    
    // Comment submit buttons
    document.querySelectorAll('.comment-submit').forEach(button => {
      button.addEventListener('click', function() {
        const form = this.closest('.comment-form');
        const input = form.querySelector('.comment-input');
        const postId = this.closest('.post').getAttribute('data-post-id');
        
        if (input.value.trim()) {
          addComment(postId, input.value);
          input.value = '';
        }
      });
    });
  }
  
  // Load more comments for a post
  function loadMoreComments(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const postElement = document.querySelector(`.post[data-post-id="${postId}"]`);
    const commentsList = postElement.querySelector('.comments-list');
    const viewMoreButton = commentsList.querySelector('.view-more-comments');
    
    // Remove the "view more" button
    if (viewMoreButton) {
      viewMoreButton.remove();
    }
    
    // Get all comments that aren't already displayed
    const displayedComments = commentsList.querySelectorAll('.comment').length;
    const remainingComments = post.comments.slice(displayedComments);
    
    // Add the remaining comments
    remainingComments.forEach(comment => {
      const commentElement = document.createElement('div');
      commentElement.className = 'comment';
      commentElement.innerHTML = `
        <div class="comment-avatar">
          <img src="${comment.avatar || '/placeholder.svg?height=40&width=40'}" alt="${comment.username} Avatar">
        </div>
        <div class="comment-content">
          <div class="comment-user">${comment.username}</div>
          <div class="comment-text">${comment.text}</div>
          <div class="comment-actions">
            <span class="comment-time">${formatTimeAgo(comment.date)}</span>
            <button class="comment-like">Like</button>
            <button class="comment-reply">Reply</button>
          </div>
        </div>
      `;
      commentsList.appendChild(commentElement);
    });
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
  
  // Format time ago (e.g., "2 hours ago")
  function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) {
      return 'Just now';
    } else if (diffMin < 60) {
      return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    } else if (diffHour < 24) {
      return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    } else if (diffDay < 7) {
      return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
  
  // Generate a random ID
  function generateId() {
    return Math.random().toString(36).substring(2, 15);
  }
  
  // Sample posts data (in a real app, this would come from the server)
  function getSamplePosts() {
    return [
      {
        id: 'post1',
        author: {
          name: 'John Doe',
          avatar: '/images/image1.png'
        },
        content: 'Just finished a new workout routine! Check out these exercises for building core strength. Let me know what you think in the comments below!',
        type: 'image',
        media: '/images/image.png',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        likes: 245,
        isLiked: false,
        comments: [
          {
            id: 'comment1',
            username: 'Sarah M.',
            avatar: '/placeholder.svg?height=40&width=40',
            text: 'Great workout routine! I\'ll definitely try these exercises.',
            date: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
            likes: 5
          },
          {
            id: 'comment2',
            username: 'Mike T.',
            avatar: '/placeholder.svg?height=40&width=40',
            text: 'What equipment do I need for this routine?',
            date: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
            likes: 2
          }
        ],
        bookmarks: 18,
        isBookmarked: false,
        shares: 5,
        categories: ['Fitness', 'Health'],
        isSubscribed: true,
        isTrending: true
      },
      {
        id: 'post2',
        author: {
          name: 'Mike Johnson',
          avatar: '/images/image1.png'
        },
        content: 'New gaming tutorial! Learn how to master these advanced techniques.',
        type: 'video',
        media: '#', // In a real app, this would be a video URL
        thumbnail: '/placeholder.svg?height=400&width=600',
        duration: '12:45',
        date: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        likes: 189,
        isLiked: false,
        comments: [
          {
            id: 'comment3',
            username: 'Alex G.',
            avatar: '/placeholder.svg?height=40&width=40',
            text: 'This helped me level up my game so much!',
            date: new Date(Date.now - 3 * 60 * 60 * 1000), // 3 hours ago
            likes: 8
          },
          {
            id: 'comment4',
            username: 'Jamie L.',
            avatar: '/placeholder.svg?height=40&width=40',
            text: 'Can you make more tutorials like this?',
            date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            likes: 3
          }
        ],
        bookmarks: 42,
        isBookmarked: false,
        shares: 8,
        categories: ['Gaming', 'Technology'],
        isSubscribed: true,
        isTrending: false
      },
      {
        id: 'post3',
        author: {
          name: 'Sarah Williams',
          avatar: '/images/image1.png'
        },
        content: 'Exclusive photoshoot! Unlock to see all the images.',
        type: 'image',
        thumbnail: '/images/image1.png',
        isPPV: true,
        isUnlocked: false,
        price: 5.00,
        date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        likes: 312,
        isLiked: false,
        comments: [
          {
            id: 'comment5',
            username: 'Taylor R.',
            avatar: '/placeholder.svg?height=40&width=40',
            text: 'Can\'t wait to see the full set!',
            date: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago
            likes: 15
          },
          {
            id: 'comment6',
            username: 'Jordan K.',
            avatar: '/placeholder.svg?height=40&width=40',
            text: 'Is it worth the price?',
            date: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
            likes: 7
          }
        ],
        bookmarks: 56,
        isBookmarked: false,
        shares: 3,
        categories: ['Photography', 'Fashion'],
        isSubscribed: false,
        isTrending: true
      },
      {
        id: 'post4',
        author: {
          name: 'Emma Thompson',
          avatar: '/images/image1.png'
        },
        content: 'I\'m excited to announce that I\'ll be hosting a live Q&A session next week! Drop your questions in the comments and I\'ll try to answer as many as possible during the stream.\n\nThe session will be on Friday at 7 PM EST. Mark your calendars!\n\nSubscribers will get priority for questions, so make sure you\'re subscribed to my channel!',
        type: 'text',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        likes: 178,
        isLiked: false,
        comments: [
          {
            id: 'comment7',
            username: 'Chris P.',
            avatar: '/placeholder.svg?height=40&width=40',
            text: 'Will you be talking about your new project?',
            date: new Date(Date.now() - 40 * 60 * 60 * 1000), // 40 hours ago
            likes: 12
          },
          {
            id: 'comment8',
            username: 'Sam B.',
            avatar: '/placeholder.svg?height=40&width=40',
            text: 'Looking forward to it!',
            date: new Date(Date.now() - 36 * 60 * 60 * 1000), // 36 hours ago
            likes: 5
          },
          {
            id: 'comment9',
            username: 'Riley J.',
            avatar: '/placeholder.svg?height=40&width=40',
            text: 'What platform will you be streaming on?',
            date: new Date(Date.now() - 30 * 60 * 60 * 1000), // 30 hours ago
            likes: 3
          }
        ],
        bookmarks: 12,
        isBookmarked: false,
        shares: 7,
        categories: ['Announcements', 'Q&A'],
        isSubscribed: true,
        isTrending: false
      },
      {
        id: 'post5',
        author: {
          name: 'David Williams',
          avatar: '/images/image1.png'
        },
        content: 'Some highlights from my recent photography trip. Which one is your favorite?',
        type: 'gallery',
        gallery: [
          '/images/image.png',
          '/images/image1.png',
          '/images/image1.png',
          '/images/image.png'
        ],
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        likes: 256,
        isLiked: false,
        comments: [
          {
            id: 'comment10',
            username: 'Morgan L.',
            avatar: '/placeholder.svg?height=40&width=40',
            text: 'The second one is stunning! Where was this taken?',
            date: new Date(Date.now() - 65 * 60 * 60 * 1000), // 65 hours ago
            likes: 9
          },
          {
            id: 'comment11',
            username: 'Casey T.',
            avatar: '/placeholder.svg?height=40&width=40',
            text: 'I love the composition in the first one!',
            date: new Date(Date.now() - 60 * 60 * 60 * 1000), // 60 hours ago
            likes: 7
          }
        ],
        bookmarks: 29,
        isBookmarked: false,
        shares: 12,
        categories: ['Photography', 'Travel'],
        isSubscribed: false,
        isTrending: true
      }
    ];
  }
});// Feed functionality for MyFans user home page

document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const postsContainer = document.querySelector('.posts-container');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const categoryList = document.querySelector('.category-list');
  const unlockPpvModal = document.getElementById('unlock-ppv-modal');
  const closeModalBtn = document.querySelector('.close-modal');
  const confirmUnlockBtn = document.getElementById('confirm-unlock-ppv');
  
  // State management
  let posts = [];
  let currentFilter = 'all';
  let categories = ['Fitness', 'Gaming', 'Photography', 'Art', 'Music', 'Fashion'];
  let currentPpvPostId = null;
  
  // Initialize the feed
  initFeed();
  
  // Main initialization function
  function initFeed() {
    // Fetch posts from localStorage (admin posts)
    fetchPosts();
    
    // Set up event listeners
    setupEventListeners();
    
    // Render categories
    renderCategories();
  }
  
  // Fetch posts from localStorage (admin posts)
  function fetchPosts() {
    // Get published posts from localStorage
    const publishedPosts = JSON.parse(localStorage.getItem('publishedPosts') || '[]');
    
    // Sort by date (newest first)
    publishedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // If no posts from localStorage, use sample posts
    if (publishedPosts.length === 0) {
      posts = getSamplePosts();
    } else {
      posts = publishedPosts;
    }
    
    // Render posts
    renderPosts(posts);
  }
  
  // Set up all event listeners
  function setupEventListeners() {
    // Filter buttons
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');
        filterPosts(filter);
        
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
      });
    });
    
    // Post interaction delegation (for dynamically created elements)
    postsContainer.addEventListener('click', handlePostInteractions);
    
    // Comment form submission
    postsContainer.addEventListener('submit', function(e) {
      if (e.target.closest('.comment-form')) {
        e.preventDefault();
        const form = e.target.closest('.comment-form');
        const input = form.querySelector('.comment-input');
        const postId = form.closest('.post').getAttribute('data-post-id');
        
        if (input.value.trim()) {
          addComment(postId, input.value);
          input.value = '';
        }
      }
    });
    
    // Handle "Enter" key in comment inputs
    postsContainer.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && e.target.classList.contains('comment-input')) {
        e.preventDefault();
        const form = e.target.closest('.comment-form');
        const submitBtn = form.querySelector('.comment-submit');
        submitBtn.click();
      }
    });
    
    // Close PPV modal
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', function() {
        unlockPpvModal.style.display = 'none';
      });
    }
    
    // Confirm unlock PPV content
    if (confirmUnlockBtn) {
      confirmUnlockBtn.addEventListener('click', function() {
        unlockPPVContent(currentPpvPostId);
      });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
      if (e.target === unlockPpvModal) {
        unlockPpvModal.style.display = 'none';
      }
    });
  }
  
  // Handle post interactions (likes, comments, bookmarks, shares)
  function handlePostInteractions(e) {
    const target = e.target;
    const postElement = target.closest('.post');
    
    if (!postElement) return;
    
    const postId = postElement.getAttribute('data-post-id');
    
    // Like button
    if (target.closest('.post-action-btn') && target.closest('.post-action-btn').textContent.trim() === 'Like') {
      toggleLike(postId, postElement);
    }
    
    // Comment button
    else if (target.closest('.post-action-btn') && target.closest('.post-action-btn').textContent.trim() === 'Comment') {
      focusCommentInput(postElement);
    }
    
    // Save/Bookmark button
    else if (target.closest('.post-action-btn') && target.closest('.post-action-btn').textContent.trim() === 'Save') {
      toggleBookmark(postId, postElement);
    }
    
    // Share button
    else if (target.closest('.post-action-btn') && target.closest('.post-action-btn').textContent.trim() === 'Share') {
      sharePost(postId);
    }
    
    // Unlock PPV button
    else if (target.closest('.unlock-ppv')) {
      showUnlockModal(postId);
    }
    
    // View more comments button
    else if (target.classList.contains('view-more-comments')) {
      loadMoreComments(postId, postElement);
    }
  }
  
  // Render posts to the container
  function renderPosts(postsToRender) {
    // Clear container
    postsContainer.innerHTML = '';
    
    // If no posts, show message
    if (postsToRender.length === 0) {
      postsContainer.innerHTML = `
        <div class="no-posts">
          <i class="fas fa-inbox"></i>
          <p>No posts to show. Follow some creators to see their content!</p>
        </div>
      `;
      return;
    }
    
    // Render each post
    postsToRender.forEach(post => {
      const postElement = createPostElement(post);
      postsContainer.appendChild(postElement);
    });
  }
  
  // Create a post element
  function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.setAttribute('data-post-id', post.id);
    
    // Format date
    const postDate = new Date(post.createdAt);
    const formattedDate = formatTimeAgo(postDate);
    
    // Create media content based on post type
    let mediaContent = '';
    
    if (post.media && post.media.length > 0) {
      const media = post.media[0];
      
      // Pay-per-view content
      if (post.visibility === 'ppv') {
        mediaContent = `
          <div class="post-media ppv-content">
            <div class="ppv-preview">
              <img src="${media.url}" alt="PPV Content Preview" class="blurred">
              <div class="ppv-overlay">
                <div class="ppv-info">
                  <i class="fas fa-lock"></i>
                  <p>Pay-per-view content</p>
                  <p class="ppv-price">$${post.price.toFixed(2)}</p>
                </div>
                <button class="btn btn-primary unlock-ppv">Unlock Now</button>
              </div>
            </div>
          </div>
        `;
      }
      // Regular image
      else if (media.type === 'image') {
        mediaContent = `
          <div class="post-media">
            <img src="${media.url}" alt="Post Image" class="post-image">
          </div>
        `;
      }
      // Video
      else if (media.type === 'video') {
        mediaContent = `
          <div class="post-media">
            <div class="video-container">
              <video controls>
                <source src="${media.url}" type="video/mp4">
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        `;
      }
      // Gallery (multiple images)
      else if (post.media.length > 1 && post.media.every(m => m.type === 'image')) {
        const galleryHTML = `
          <div class="image-gallery">
            <div class="image-gallery-row">
              ${post.media.slice(0, Math.ceil(post.media.length / 2)).map(m => 
                `<img src="${m.url}" alt="Gallery Image" class="gallery-image">`
              ).join('')}
            </div>
            ${post.media.length > Math.ceil(post.media.length / 2) ? `
              <div class="image-gallery-row">
                ${post.media.slice(Math.ceil(post.media.length / 2)).map(m => 
                  `<img src="${m.url}" alt="Gallery Image" class="gallery-image">`
                ).join('')}
              </div>
            ` : ''}
          </div>
        `;
        mediaContent = `<div class="post-media">${galleryHTML}</div>`;
      }
    }
    
    // Create visibility badge for subscribers-only content
    let visibilityBadge = '';
    if (post.visibility === 'subscribers' && post.visibility !== 'ppv') {
      visibilityBadge = '<span class="post-visibility-badge subscribers">Subscribers Only</span>';
    }
    
    // Create post HTML
    postElement.innerHTML = `
      <div class="post-header">
        <div class="post-user">
          <div class="post-avatar">
            <img src="${post.author?.avatar || '/images/image1.png'}" alt="Creator Avatar">
          </div>
          <div class="post-user-info">
            <div class="post-username">
              ${post.author?.name || 'Creator'} <span class="verified-badge admin"><i class="fas fa-check-circle"></i></span>
            </div>
            <div class="post-time">${formattedDate}</div>
          </div>
        </div>
        <div class="post-actions">
          <button class="btn btn-icon">
            <i class="fas fa-ellipsis-h"></i>
          </button>
        </div>
      </div>
      
      <div class="post-content">
        ${post.title ? `<h3 class="post-title">${post.title}</h3>` : ''}
        <div class="post-text">
          <p>${post.content}</p>
        </div>
        ${mediaContent}
        ${visibilityBadge}
      </div>
      
      <div class="post-stats">
        <div class="post-stat">
          <i class="fas fa-heart"></i>
          <span>${post.stats?.likes || Math.floor(Math.random() * 300)}</span>
        </div>
        <div class="post-stat">
          <i class="fas fa-comment"></i>
          <span>${post.stats?.comments || Math.floor(Math.random() * 50)}</span>
        </div>
        <div class="post-stat">
          <i class="fas fa-bookmark"></i>
          <span>${post.stats?.bookmarks || Math.floor(Math.random() * 30)}</span>
        </div>
        <div class="post-stat">
          <i class="fas fa-share"></i>
          <span>${post.stats?.shares || Math.floor(Math.random() * 15)}</span>
        </div>
      </div>
      
      <div class="post-actions-bar">
        <button class="post-action-btn">
          <i class="far fa-heart"></i>
          <span>Like</span>
        </button>
        <button class="post-action-btn">
          <i class="far fa-comment"></i>
          <span>Comment</span>
        </button>
        <button class="post-action-btn">
          <i class="far fa-bookmark"></i>
          <span>Save</span>
        </button>
        <button class="post-action-btn">
          <i class="far fa-share-square"></i>
          <span>Share</span>
        </button>
      </div>
      
      <div class="post-comments">
        <div class="comment-form">
          <div class="comment-avatar">
            <img src="/placeholder.svg?height=40&width=40" alt="User Avatar">
          </div>
          <div class="comment-input-container">
            <input type="text" placeholder="Write a comment..." class="comment-input">
            <button class="comment-submit">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
        
        <div class="comments-list">
          ${post.comments && post.comments.length > 0 ? 
            post.comments.slice(0, 2).map(comment => createCommentHTML(comment)).join('') : 
            ''
          }
          ${post.comments && post.comments.length > 2 ? 
            '<button class="view-more-comments">View more comments</button>' : 
            ''
          }
        </div>
      </div>
    `;
    
    return postElement;
  }
  
  // Create HTML for a comment
  function createCommentHTML(comment) {
    return `
      <div class="comment" data-comment-id="${comment.id}">
        <div class="comment-avatar">
          <img src="${comment.user.avatar || '/placeholder.svg?height=40&width=40'}" alt="User Avatar">
        </div>
        <div class="comment-content">
          <div class="comment-user">${comment.user.name}</div>
          <div class="comment-text">${comment.text}</div>
          <div class="comment-actions">
            <span class="comment-time">${formatTimeAgo(new Date(comment.createdAt))}</span>
            <button class="comment-like">Like</button>
            <button class="comment-reply">Reply</button>
          </div>
        </div>
      </div>
    `;
  }
  
  // Filter posts based on selected filter
  function filterPosts(filter) {
    currentFilter = filter;
    
    let filteredPosts = [];
    
    switch (filter) {
      case 'subscribed':
        // In a real app, this would filter posts from creators the user is subscribed to
        filteredPosts = posts.filter(post => post.visibility !== 'ppv');
        break;
      case 'trending':
        // In a real app, this would show trending posts based on engagement
        filteredPosts = [...posts].sort((a, b) => {
          const aEngagement = (a.stats?.likes || 0) + (a.stats?.comments || 0) * 2;
          const bEngagement = (b.stats?.likes || 0) + (b.stats?.comments || 0) * 2;
          return bEngagement - aEngagement;
        });
        break;
      case 'recent':
        // Show most recent posts
        filteredPosts = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'all':
      default:
        filteredPosts = posts;
        break;
    }
    
    renderPosts(filteredPosts);
  }
  
  // Render categories in the sidebar
  function renderCategories() {
    if (!categoryList) return;
    
    categoryList.innerHTML = '';
    
    categories.forEach(category => {
      const categoryItem = document.createElement('div');
      categoryItem.className = 'category-item';
      categoryItem.innerHTML = `
        <span class="category-name">${category}</span>
        <span class="category-count">${Math.floor(Math.random() * 20) + 5}</span>
      `;
      
      categoryItem.addEventListener('click', () => {
        // In a real app, this would filter posts by category
        showToast(`Showing ${category} posts`);
      });
      
      categoryList.appendChild(categoryItem);
    });
  }
  
  // Toggle like on a post
  function toggleLike(postId, postElement) {
    const likeButton = postElement.querySelector('.post-action-btn:nth-child(1)');
    const likeIcon = likeButton.querySelector('i');
    const likeCount = postElement.querySelector('.post-stat:nth-child(1) span');
    
    const isLiked = likeIcon.classList.contains('fas');
    
    if (isLiked) {
      // Unlike
      likeIcon.className = 'far fa-heart';
      likeCount.textContent = parseInt(likeCount.textContent) - 1;
    } else {
      // Like
      likeIcon.className = 'fas fa-heart';
      likeCount.textContent = parseInt(likeCount.textContent) + 1;
      
      // Show animation
      const heart = document.createElement('div');
      heart.className = 'heart-animation';
      heart.innerHTML = '<i class="fas fa-heart"></i>';
      postElement.appendChild(heart);
      
      setTimeout(() => {
        heart.remove();
      }, 1000);
    }
    
    // Update post in state
    updatePostStats(postId, 'likes', !isLiked);
  }
  
  // Focus the comment input
  function focusCommentInput(postElement) {
    const commentInput = postElement.querySelector('.comment-input');
    if (commentInput) {
      commentInput.focus();
      
      // Scroll to comment input
      commentInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  
  // Toggle bookmark on a post
  function toggleBookmark(postId, postElement) {
    const bookmarkButton = postElement.querySelector('.post-action-btn:nth-child(3)');
    const bookmarkIcon = bookmarkButton.querySelector('i');
    const bookmarkCount = postElement.querySelector('.post-stat:nth-child(3) span');
    
    const isBookmarked = bookmarkIcon.classList.contains('fas');
    
    if (isBookmarked) {
      // Remove bookmark
      bookmarkIcon.className = 'far fa-bookmark';
      bookmarkCount.textContent = parseInt(bookmarkCount.textContent) - 1;
    } else {
      // Add bookmark
      bookmarkIcon.className = 'fas fa-bookmark';
      bookmarkCount.textContent = parseInt(bookmarkCount.textContent) + 1;
    }
    
    // Update post in state
    updatePostStats(postId, 'bookmarks', !isBookmarked);
    
    // Show toast
    showToast(isBookmarked ? 'Post removed from saved items' : 'Post saved to your profile');
  }
  
  // Share a post
  function sharePost(postId) {
    // In a real app, this would open a share dialog
    // For demo purposes, we'll just show a toast
    showToast('Share functionality coming soon!');
    
    // Update share count
    const post = posts.find(p => p.id === postId);
    if (post) {
      if (!post.stats) post.stats = {};
      post.stats.shares = (post.stats.shares || 0) + 1;
      
      // Update UI
      const postElement = document.querySelector(`.post[data-post-id="${postId}"]`);
      if (postElement) {
        const shareCount = postElement.querySelector('.post-stat:nth-child(4) span');
        shareCount.textContent = post.stats.shares;
      }
    }
  }
  
  // Show the unlock PPV modal
  function showUnlockModal(postId) {
    currentPpvPostId = postId;
    
    // Get post
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    // Set price in modal
    const priceElement = unlockPpvModal.querySelector('.ppv-price');
    if (priceElement) {
      priceElement.textContent = `$${post.price.toFixed(2)}`;
    }
    
    // Set preview image
    const previewImage = unlockPpvModal.querySelector('.ppv-preview-modal img');
    if (previewImage && post.media && post.media.length > 0) {
      previewImage.src = post.media[0].url;
    }
    
    // Show modal
    unlockPpvModal.style.display = 'block';
  }
  
  // Unlock PPV content
  function unlockPPVContent(postId) {
    // Get post
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    // Get wallet balance
    const walletBalance = parseFloat(document.getElementById('wallet-balance-ppv').textContent.replace('$', ''));
    
    // Check if user has enough balance
    if (walletBalance < post.price) {
      showToast('Insufficient balance. Please top up your wallet.', 'error');
      return;
    }
    
    // Deduct from wallet
    const newBalance = walletBalance - post.price;
    document.getElementById('wallet-balance-ppv').textContent = `$${newBalance.toFixed(2)}`;
    
    // Update post to be unlocked for this user
    post.unlockedForCurrentUser = true;
    
    // Close modal
    unlockPpvModal.style.display = 'none';
    
    // Update UI
    const postElement = document.querySelector(`.post[data-post-id="${postId}"]`);
    if (postElement) {
      const ppvContent = postElement.querySelector('.ppv-content');
      if (ppvContent) {
        // Replace PPV overlay with actual content
        if (post.media && post.media.length > 0) {
          const media = post.media[0];
          
          if (media.type === 'image') {
            ppvContent.innerHTML = `
              <img src="${media.url}" alt="Post Image" class="post-image">
            `;
          } else if (media.type === 'video') {
            ppvContent.innerHTML = `
              <div class="video-container">
                <video controls>
                  <source src="${media.url}" type="video/mp4">
                  Your browser does not support the video tag.
                </video>
              </div>
            `;
          }
        }
      }
    }
    
    // Show success message
    showToast('Content unlocked successfully!');
  }
  
  // Add a comment to a post
  function addComment(postId, commentText) {
    // Get post
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    // Create comment object
    const comment = {
      id: generateId(),
      text: commentText,
      user: {
        name: 'You',
        avatar: '/placeholder.svg?height=40&width=40'
      },
      createdAt: new Date(),
      likes: 0
    };
    
    // Add comment to post
    if (!post.comments) post.comments = [];
    post.comments.unshift(comment);
    
    // Update comment count
    if (!post.stats) post.stats = {};
    post.stats.comments = (post.stats.comments || 0) + 1;
    
    // Update UI
    const postElement = document.querySelector(`.post[data-post-id="${postId}"]`);
    if (postElement) {
      // Update comment count
      const commentCount = postElement.querySelector('.post-stat:nth-child(2) span');
      commentCount.textContent = post.stats.comments;
      
      // Add comment to list
      const commentsList = postElement.querySelector('.comments-list');
      const commentHTML = createCommentHTML(comment);
      
      // If there's a "View more comments" button, insert before it
      const viewMoreBtn = commentsList.querySelector('.view-more-comments');
      if (viewMoreBtn) {
        viewMoreBtn.insertAdjacentHTML('beforebegin', commentHTML);
      } else {
        commentsList.insertAdjacentHTML('afterbegin', commentHTML);
      }
    }
  }
  
  // Load more comments for a post
  function loadMoreComments(postId, postElement) {
    // Get post
    const post = posts.find(p => p.id === postId);
    if (!post || !post.comments) return;
    
    // Get comments list
    const commentsList = postElement.querySelector('.comments-list');
    const viewMoreBtn = commentsList.querySelector('.view-more-comments');
    
    // Get current number of comments shown
    const currentComments = commentsList.querySelectorAll('.comment').length;
    
    // Show 5 more comments
    const moreComments = post.comments.slice(currentComments, currentComments + 5);
    
    // Add comments to list
    moreComments.forEach(comment => {
      const commentHTML = createCommentHTML(comment);
      viewMoreBtn.insertAdjacentHTML('beforebegin', commentHTML);
    });
    
    // Hide "View more" button if all comments are shown
    if (currentComments + moreComments.length >= post.comments.length) {
      viewMoreBtn.style.display = 'none';
    }
  }
  
  // Update post stats in state
  function updatePostStats(postId, statType, increment) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    if (!post.stats) post.stats = {};
    
    if (increment) {
      post.stats[statType] = (post.stats[statType] || 0) + 1;
    } else {
      post.stats[statType] = Math.max(0, (post.stats[statType] || 0) - 1);
    }
  }
  
  // Format time ago (e.g., "2 hours ago")
  function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) {
      return 'Just now';
    } else if (diffMin < 60) {
      return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    } else if (diffHour < 24) {
      return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    } else if (diffDay < 7) {
      return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
  
  // Generate a random ID
  function generateId() {
    return Math.random().toString(36).substring(2, 15);
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
  
  // Get sample posts (used if no posts in localStorage)
  function getSamplePosts() {
    return [
      {
        id: 'sample1',
        title: '',
        content: 'Just finished a new workout routine! Check out these exercises for building core strength. Let me know what you think in the comments below!',
        media: [
          {
            type: 'image',
            url: '/images/image.png'
          }
        ],
        visibility: 'public',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        author: {
          name: 'John Doe',
          avatar: '/images/image1.png'
        },
        stats: {
          likes: 245,
          comments: 32,
          bookmarks: 18,
          shares: 5
        },
        comments: [
          {
            id: 'comment1',
            text: 'Great workout routine! I\'ll definitely try these exercises.',
            user: {
              name: 'Sarah M.',
              avatar: '/placeholder.svg?height=40&width=40'
            },
            createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
            likes: 3
          },
          {
            id: 'comment2',
            text: 'What equipment do I need for this routine?',
            user: {
              name: 'Mike T.',
              avatar: '/placeholder.svg?height=40&width=40'
            },
            createdAt: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
            likes: 1
          }
        ]
      },
      {
        id: 'sample2',
        title: '',
        content: 'New gaming tutorial! Learn how to master these advanced techniques.',
        media: [
          {
            type: 'video',
            url: '#'
          }
        ],
        visibility: 'public',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        author: {
          name: 'Mike Johnson',
          avatar: '/images/image1.png'
        },
        stats: {
          likes: 189,
          comments: 24,
          bookmarks: 42,
          shares: 8
        }
      },
      {
        id: 'sample3',
        title: '',
        content: 'Exclusive photoshoot! Unlock to see all the images.',
        media: [
          {
            type: 'image',
            url: '/images/image1.png'
          }
        ],
        visibility: 'ppv',
        price: 5.00,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        author: {
          name: 'Sarah Williams',
          avatar: '/images/image1.png'
        },
        stats: {
          likes: 312,
          comments: 18,
          bookmarks: 56,
          shares: 3
        }
      },
      {
        id: 'sample4',
        title: '',
        content: 'I\'m excited to announce that I\'ll be hosting a live Q&A session next week! Drop your questions in the comments and I\'ll try to answer as many as possible during the stream.\n\nThe session will be on Friday at 7 PM EST. Mark your calendars!\n\nSubscribers will get priority for questions, so make sure you\'re subscribed to my channel!',
        media: [],
        visibility: 'public',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        author: {
          name: 'Emma Thompson',
          avatar: '/images/image1.png'
        },
        stats: {
          likes: 178,
          comments: 45,
          bookmarks: 12,
          shares: 7
        }
      },
      {
        id: 'sample5',
        title: '',
        content: 'Some highlights from my recent photography trip. Which one is your favorite?',
        media: [
          {
            type: 'image',
            url: '/images/image.png'
          },
          {
            type: 'image',
            url: '/images/image1.png'
          },
          {
            type: 'image',
            url: '/images/image1.png'
          },
          {
            type: 'image',
            url: '/images/image.png'
          }
        ],
        visibility: 'public',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        author: {
          name: 'David Williams',
          avatar: '/images/image1.png'
        },
        stats: {
          likes: 256,
          comments: 38,
          bookmarks: 29,
          shares: 12
        }
      }
    ];
  }
});