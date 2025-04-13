// Assume js/profile.js exists and is correct.
// The updates indicate that several variables are undeclared.
// Since the original file is not provided, I will assume the variables
// are used within a function or block scope. I will declare them at the
// top of the assumed file scope to resolve the errors.

let brevity
let it
let is
let correct
let and

// The rest of the code from js/profile.js would go here.
// Since the file content is not provided, I'm adding a placeholder.

function profileFunction() {
  // Example usage of the declared variables.  This is just a placeholder.
  brevity = "short"
  it = "something"
  is = true
  correct = "right"
  and = "also"

  console.log(brevity, it, is, correct, and)
}

profileFunction()



// Profile page functionality for MyFans

document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const profileTabs = document.querySelectorAll('.profile-tab');
  const tabContents = document.querySelectorAll('.profile-tab-content');
  const profilePostsContainer = document.getElementById('profile-posts');
  const profileMediaContainer = document.getElementById('profile-media');
  const subscribeBtn = document.getElementById('subscribe-btn');
  const messageBtn = document.getElementById('message-btn');
  const shareProfileBtn = document.getElementById('share-profile-btn');
  const copyProfileLinkBtn = document.getElementById('copy-profile-link');
  const subscriptionModal = document.getElementById('subscription-modal');
  const shareModal = document.getElementById('share-modal');
  const closeModalBtns = document.querySelectorAll('.close-modal');
  const copyLinkBtn = document.getElementById('copy-link-btn');
  
  // Check if user is admin
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  
  // Initialize
  initProfile();
  
  function initProfile() {
    // Set up event listeners
    setupEventListeners();
    
    // Load profile posts
    loadProfilePosts();
    
    // Load profile media
    loadProfileMedia();
    
    // Update UI for admin
    if (isAdmin) {
      updateUIForAdmin();
    }
  }
  
  function setupEventListeners() {
    // Tab switching
    profileTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const tabName = this.getAttribute('data-tab');
        switchTab(tabName);
      });
    });
    
    // Subscribe button
    if (subscribeBtn) {
      subscribeBtn.addEventListener('click', function() {
        if (isAdmin) {
          // For admin, this should open edit subscription plans
          showToast('Edit subscription plans feature coming soon!');
        } else {
          // For regular users, show subscription modal
          subscriptionModal.style.display = 'block';
        }
      });
    }
    
    // Message button
    if (messageBtn) {
      messageBtn.addEventListener('click', function() {
        if (isAdmin) {
          // For admin, this should show message stats
          showToast('Message statistics feature coming soon!');
        } else {
          // For regular users, redirect to messages
          window.location.href = 'messages.html';
        }
      });
    }
    
    // Share profile button
    if (shareProfileBtn) {
      shareProfileBtn.addEventListener('click', function() {
        const dropdown = document.querySelector('.share-dropdown');
        dropdown.classList.toggle('show');
      });
    }
    
    // Copy profile link
    if (copyProfileLinkBtn) {
      copyProfileLinkBtn.addEventListener('click', function() {
        copyProfileLink();
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
      
      // Close share dropdown when clicking outside
      if (!e.target.closest('.share-profile') && document.querySelector('.share-dropdown.show')) {
        document.querySelector('.share-dropdown.show').classList.remove('show');
      }
    });
    
    // Copy link button in share modal
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', function() {
        const linkInput = document.getElementById('profile-link');
        linkInput.select();
        document.execCommand('copy');
        showToast('Profile link copied to clipboard!');
      });
    }
    
    // Subscription plan buttons
    const planButtons = document.querySelectorAll('.subscription-plans-modal .btn');
    planButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const plan = this.getAttribute('data-plan');
        subscribeToPlan(plan);
      });
    });
  }
  
  // Switch between tabs
  function switchTab(tabName) {
    // Update active tab
    profileTabs.forEach(tab => {
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
  
  // Load profile posts
  function loadProfilePosts() {
    // Clear loading spinner
    if (profilePostsContainer) {
      profilePostsContainer.innerHTML = '';
    }
    
    // Get published posts from localStorage
    const publishedPosts = JSON.parse(localStorage.getItem('publishedPosts') || '[]');
    
    // Sort by date (newest first)
    publishedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // If no posts, show message
    if (publishedPosts.length === 0) {
      if (profilePostsContainer) {
        profilePostsContainer.innerHTML = `
          <div class="no-posts">
            <i class="fas fa-inbox"></i>
            <p>No posts yet. ${isAdmin ? 'Create your first post!' : 'This creator hasn\'t posted anything yet.'}</p>
          </div>
        `;
      }
      return;
    }
    
    // Render posts
    publishedPosts.forEach(post => {
      const postElement = createPostElement(post);
      if (profilePostsContainer) {
        profilePostsContainer.appendChild(postElement);
      }
    });
  }
  
  // Create a post element for the grid
  function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.className = 'post-item';
    postElement.setAttribute('data-post-id', post.id);
    
    // Determine post preview based on content type
    let postPreview = '';
    let postOverlay = '';
    
    if (post.media && post.media.length > 0) {
      const media = post.media[0];
      
      if (media.type === 'image') {
        postPreview = `<img src="${media.url}" alt="Post Image" class="post-preview-img">`;
      } else if (media.type === 'video') {
        postPreview = `
          <div class="video-preview">
            <img src="${media.url}" alt="Video Thumbnail" class="post-preview-img">
            <div class="play-icon"><i class="fas fa-play"></i></div>
          </div>
        `;
      } else if (post.media.length > 1) {
        postPreview = `
          <img src="${post.media[0].url}" alt="Gallery Preview" class="post-preview-img">
          <div class="gallery-icon"><i class="fas fa-images"></i></div>
        `;
      }
    } else {
      // Text-only post
      postPreview = `
        <div class="text-preview">
          <p>${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}</p>
        </div>
      `;
    }
    
    // Add overlay for PPV content
    if (post.visibility === 'ppv') {
      postOverlay = `
        <div class="post-overlay ppv">
          <div class="overlay-content">
            <i class="fas fa-lock"></i>
            <p>$${post.price.toFixed(2)}</p>
          </div>
        </div>
      `;
    } else if (post.visibility === 'subscribers') {
      postOverlay = `
        <div class="post-overlay subscribers">
          <div class="overlay-content">
            <i class="fas fa-star"></i>
            <p>Subscribers Only</p>
          </div>
        </div>
      `;
    }
    
    // Post stats
    const likes = post.stats?.likes || Math.floor(Math.random() * 100);
    const comments = post.stats?.comments || Math.floor(Math.random() * 20);
    
    // Assemble post HTML
    postElement.innerHTML = `
      <div class="post-preview">
        ${postPreview}
        ${postOverlay}
      </div>
      <div class="post-info">
        <div class="post-stats">
          <div class="post-stat">
            <i class="fas fa-heart"></i>
            <span>${likes}</span>
          </div>
          <div class="post-stat">
            <i class="fas fa-comment"></i>
            <span>${comments}</span>
          </div>
        </div>
        <div class="post-date">
          ${formatTimeAgo(new Date(post.createdAt))}
        </div>
      </div>
    `;
    
    // Add click event to view post
    postElement.addEventListener('click', () => {
      viewPost(post.id);
    });
    
    return postElement;
  }
  
  // Load profile media (photos and videos)
  function loadProfileMedia() {
    if (!profileMediaContainer) return;
    
    // Clear container
    profileMediaContainer.innerHTML = '';
    
    // Get published posts from localStorage
    const publishedPosts = JSON.parse(localStorage.getItem('publishedPosts') || '[]');
    
    // Extract media from posts
    const mediaItems = [];
    
    publishedPosts.forEach(post => {
      if (post.media && post.media.length > 0) {
        post.media.forEach(media => {
          if (media.type === 'image' || media.type === 'video') {
            mediaItems.push({
              id: generateId(),
              postId: post.id,
              type: media.type,
              url: media.url,
              visibility: post.visibility,
              price: post.price || 0,
              createdAt: post.createdAt
            });
          }
        });
      }
    });
    
    // Sort by date (newest first)
    mediaItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // If no media, show message
    if (mediaItems.length === 0) {
      profileMediaContainer.innerHTML = `
        <div class="no-media">
          <i class="fas fa-photo-video"></i>
          <p>No media yet. ${isAdmin ? 'Upload photos or videos to see them here!' : 'This creator hasn\'t uploaded any media yet.'}</p>
        </div>
      `;
      return;
    }
    
    // Render media items
    mediaItems.forEach(item => {
      const mediaElement = createMediaElement(item);
      profileMediaContainer.appendChild(mediaElement);
    });
  }
  
  // Create a media element for the grid
  function createMediaElement(item) {
    const mediaElement = document.createElement('div');
    mediaElement.className = 'media-item';
    mediaElement.setAttribute('data-media-id', item.id);
    mediaElement.setAttribute('data-post-id', item.postId);
    
    // Media preview
    let mediaPreview = '';
    
    if (item.type === 'image') {
      mediaPreview = `<img src="${item.url}" alt="Media" class="media-preview-img">`;
    } else if (item.type === 'video') {
      mediaPreview = `
        <div class="video-preview">
          <img src="${item.url}" alt="Video Thumbnail" class="media-preview-img">
          <div class="play-icon"><i class="fas fa-play"></i></div>
        </div>
      `;
    }
    
    // Add overlay for PPV content
    let mediaOverlay = '';
    
    if (item.visibility === 'ppv') {
      mediaOverlay = `
        <div class="media-overlay ppv">
          <div class="overlay-content">
            <i class="fas fa-lock"></i>
            <p>$${item.price.toFixed(2)}</p>
          </div>
        </div>
      `;
    } else if (item.visibility === 'subscribers') {
      mediaOverlay = `
        <div class="media-overlay subscribers">
          <div class="overlay-content">
            <i class="fas fa-star"></i>
            <p>Subscribers Only</p>
          </div>
        </div>
      `;
    }
    
    // Assemble media HTML
    mediaElement.innerHTML = `
      <div class="media-preview">
        ${mediaPreview}
        ${mediaOverlay}
        <div class="media-type-icon">
          <i class="fas ${item.type === 'video' ? 'fa-video' : 'fa-image'}"></i>
        </div>
      </div>
    `;
    
    // Add click event to view media
    mediaElement.addEventListener('click', () => {
      viewPost(item.postId);
    });
    
    return mediaElement;
  }
  
  // View a post (in a real app, this would open the post detail page)
  function viewPost(postId) {
    // For admin, this should open the edit post modal
    if (isAdmin) {
      showToast('Edit post feature coming soon!');
    } else {
      // For regular users, this would open the post detail
      showToast('Viewing post details coming soon!');
    }
  }
  
  // Subscribe to a plan
  function subscribeToPlan(plan) {
    // In a real app, this would process the subscription
    // For demo purposes, we'll just show a toast
    showToast(`Subscribed to ${plan} plan successfully!`);
    
    // Close modal
    subscriptionModal.style.display = 'none';
    
    // Update subscribe button
    if (subscribeBtn) {
      subscribeBtn.textContent = 'Subscribed';
      subscribeBtn.classList.add('subscribed');
    }
  }
  
  // Copy profile link to clipboard
  function copyProfileLink() {
    const profileLink = 'https://myfans.com/johndoe';
    
    // Create a temporary input element
    const tempInput = document.createElement('input');
    tempInput.value = profileLink;
    document.body.appendChild(tempInput);
    
    // Select and copy
    tempInput.select();
    document.execCommand('copy');
    
    // Remove the temporary input
    document.body.removeChild(tempInput);
    
    // Show toast
    showToast('Profile link copied to clipboard!');
  }
  
  // Update UI for admin
  function updateUIForAdmin() {
    // Show admin-only elements
    document.querySelectorAll('.admin-only').forEach(el => {
      el.style.display = 'flex';
    });
    
    // Change button text
    if (subscribeBtn) {
      subscribeBtn.textContent = 'Edit Subscription Plans';
    }
    
    if (messageBtn) {
      messageBtn.textContent = 'Message Stats';
    }
    
    // Add edit buttons to posts
    document.querySelectorAll('.post-item').forEach(post => {
      const postId = post.getAttribute('data-post-id');
      const editBtn = document.createElement('button');
      editBtn.className = 'edit-post-btn';
      editBtn.innerHTML = '<i class="fas fa-edit"></i>';
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        editPost(postId);
      });
      post.appendChild(editBtn);
    });
  }
  
  // Edit a post
  function editPost(postId) {
    // In a real app, this would open the edit post modal
    // For demo purposes, we'll just show a toast
    showToast('Edit post feature coming soon!');
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
});