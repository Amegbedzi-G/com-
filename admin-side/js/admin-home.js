document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const createPostBtn = document.getElementById('create-post-btn');
  const mobileCreatePostBtn = document.getElementById('mobile-create-post');
  const createPostModal = document.getElementById('create-post-modal');
  const closeModalBtn = document.querySelector('.close-modal');
  const quickPostForm = document.getElementById('quick-post-form');
  const postTitleInput = document.getElementById('post-title');
  const postContentInput = document.getElementById('post-content');
  const mediaUpload = document.getElementById('media-upload');
  const mediaPreview = document.getElementById('media-preview');
  const mediaUploadBtns = document.querySelectorAll('.media-upload-btn');
  const visibilityOptions = document.querySelectorAll('input[name="visibility"]');
  const ppvSettings = document.getElementById('ppv-settings');
  const ppvPrice = document.getElementById('ppv-price');
  const saveDraftBtn = document.getElementById('save-draft-btn');
  const publishBtn = document.getElementById('publish-btn');
  const quickActionBtns = document.querySelectorAll('.quick-action-card .btn, [data-post-type]');
  const adminPostsContainer = document.getElementById('admin-posts');
  const performanceTimeframe = document.getElementById('performance-timeframe');
  
  // State
  let selectedFiles = [];
  let currentMediaType = 'image';
  let performanceChart = null;
  
  // Initialize
  initAdminHome();
  
  function initAdminHome() {
    // Set up event listeners
    setupEventListeners();
    
    // Load admin posts
    loadAdminPosts();
    
    // Initialize performance chart
    initPerformanceChart();
    
    // Load drafts
    loadDrafts();
  }
  
  function setupEventListeners() {
    // Create post button
    if (createPostBtn) {
      createPostBtn.addEventListener('click', () => openCreatePostModal());
    }
    
    // Mobile create post button
    if (mobileCreatePostBtn) {
      mobileCreatePostBtn.addEventListener('click', () => openCreatePostModal());
    }
    
    // Close modal button
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', closeCreatePostModal);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
      if (e.target === createPostModal) {
        closeCreatePostModal();
      }
    });
    
    // Media upload buttons
    mediaUploadBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        currentMediaType = this.getAttribute('data-type') || 'image';
        mediaUpload.click();
      });
    });
    
    // Media file selection
    if (mediaUpload) {
      mediaUpload.addEventListener('change', handleFileSelection);
    }
    
    // Drag and drop for media
    setupDragAndDrop();
    
    // Visibility options
    visibilityOptions.forEach(option => {
      option.addEventListener('change', function() {
        // Show/hide PPV settings
        if (this.value === 'ppv') {
          ppvSettings.style.display = 'block';
        } else {
          ppvSettings.style.display = 'none';
        }
      });
    });
    
    // Save draft button
    if (saveDraftBtn) {
      saveDraftBtn.addEventListener('click', saveDraft);
    }
    
    // Form submission
    if (quickPostForm) {
      quickPostForm.addEventListener('submit', publishPost);
    }
    
    // Quick action buttons
    quickActionBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const postType = this.getAttribute('data-post-type');
        openCreatePostModal(postType);
      });
    });
    
    // Performance timeframe change
    if (performanceTimeframe) {
      performanceTimeframe.addEventListener('change', updatePerformanceChart);
    }
  }
  
  // Open create post modal
  function openCreatePostModal(postType) {
    // Reset form
    if (quickPostForm) {
      quickPostForm.reset();
    }
    selectedFiles = [];
    updateMediaPreview();
    
    if (ppvSettings) {
      ppvSettings.style.display = 'none';
    }
    
    // Set post type if provided
    if (typeof postType === 'string') {
      // Set visibility based on post type
      if (postType === 'ppv') {
        document.getElementById('visibility-ppv').checked = true;
        if (ppvSettings) {
          ppvSettings.style.display = 'block';
        }
      } else if (postType === 'subscribers') {
        document.getElementById('visibility-subscribers').checked = true;
      } else {
        document.getElementById('visibility-public').checked = true;
      }
    }
    
    // Show modal
    if (createPostModal) {
      createPostModal.classList.add('show');
      createPostModal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
    
    // Focus on title input
    if (postTitleInput) {
      setTimeout(() => {
        postTitleInput.focus();
      }, 100);
    }
  }
  
  // Close create post modal
  function closeCreatePostModal() {
    if (createPostModal) {
      createPostModal.classList.remove('show');
      createPostModal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }
  
  // Handle file selection from the file input
  function handleFileSelection(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Clear previous files if not a gallery
    if (currentMediaType !== 'gallery') {
      selectedFiles = [];
    }
    
    // Process each file
    files.forEach(file => {
      // Validate file type
      if (!validateFileType(file, currentMediaType)) {
        showToast(`Invalid file type for ${currentMediaType}`, 'error');
        return;
      }
      
      // Add to selected files
      selectedFiles.push({
        file: file,
        type: currentMediaType,
        url: URL.createObjectURL(file)
      });
    });
    
    // Update the media preview
    updateMediaPreview();
  }
  
  // Set up drag and drop functionality
  function setupDragAndDrop() {
    if (!mediaPreview) return;
    
    const dropArea = mediaPreview;
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
      dropArea.classList.add('highlight');
    }
    
    function unhighlight() {
      dropArea.classList.remove('highlight');
    }
    
    dropArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
      const dt = e.dataTransfer;
      const files = Array.from(dt.files);
      
      // Determine media type based on first file
      if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
          currentMediaType = 'image';
        } else if (file.type.startsWith('video/')) {
          currentMediaType = 'video';
        } else if (file.type.startsWith('audio/')) {
          currentMediaType = 'audio';
        } else {
          currentMediaType = 'file';
        }
        
        // Simulate file input change
        const dataTransfer = new DataTransfer();
        files.forEach(file => dataTransfer.items.add(file));
        mediaUpload.files = dataTransfer.files;
        
        // Trigger the change event
        const event = new Event('change', { bubbles: true });
        mediaUpload.dispatchEvent(event);
      }
    }
  }
  
  // Update the media preview container
  function updateMediaPreview() {
    if (!mediaPreview) return;
    
    if (selectedFiles.length === 0) {
      mediaPreview.innerHTML = `
        <div class="media-placeholder">
          <i class="fas fa-cloud-upload-alt"></i>
          <p>Drag & drop files here or click on the buttons above</p>
        </div>
      `;
      return;
    }
    
    mediaPreview.innerHTML = '';
    
    // Create preview elements based on media type
    selectedFiles.forEach((fileObj, index) => {
      const previewItem = document.createElement('div');
      previewItem.className = 'media-preview-item';
      
      // Add remove button
      const removeBtn = document.createElement('button');
      removeBtn.className = 'media-remove-btn';
      removeBtn.innerHTML = '<i class="fas fa-times"></i>';
      removeBtn.addEventListener('click', () => removeMedia(index));
      
      // Create preview based on type
      if (fileObj.type === 'image') {
        previewItem.innerHTML = `
          <img src="${fileObj.url}" alt="Image Preview">
          <div class="media-info">${fileObj.file.name}</div>
        `;
      } else if (fileObj.type === 'video') {
        previewItem.innerHTML = `
          <video controls>
            <source src="${fileObj.url}" type="${fileObj.file.type}">
          </video>
          <div class="media-info">${fileObj.file.name}</div>
        `;
      } else if (fileObj.type === 'audio') {
        previewItem.innerHTML = `
          <audio controls>
            <source src="${fileObj.url}" type="${fileObj.file.type}">
          </audio>
          <div class="media-info">${fileObj.file.name}</div>
        `;
      } else {
        previewItem.innerHTML = `
          <div class="file-preview">
            <i class="fas fa-file"></i>
            <div class="media-info">${fileObj.file.name}</div>
          </div>
        `;
      }
      
      previewItem.appendChild(removeBtn);
      mediaPreview.appendChild(previewItem);
    });
  }
  
  // Remove a media item
  function removeMedia(index) {
    // Revoke the object URL to free up memory
    URL.revokeObjectURL(selectedFiles[index].url);
    
    // Remove from array
    selectedFiles.splice(index, 1);
    
    // Update preview
    updateMediaPreview();
  }
  
  // Save the post as a draft
  function saveDraft() {
    // Validate form
    if (!validateForm(true)) {
      return;
    }
    
    // Get form data
    const postData = getPostData();
    
    // Add draft status
    postData.status = 'draft';
    
    // Save to local storage (in a real app, this would be sent to the server)
    const drafts = JSON.parse(localStorage.getItem('postDrafts') || '[]');
    drafts.push(postData);
    localStorage.setItem('postDrafts', JSON.stringify(drafts));
    
    // Show success message
    showToast('Post saved as draft');
    
    // Close modal
    closeCreatePostModal();
    
    // Reload drafts
    loadDrafts();
  }
  
  // Publish the post
  function publishPost(e) {
    if (e) e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Get form data
    const postData = getPostData();
    
    // Add published status
    postData.status = 'published';
    
    // In a real app, this would be sent to the server
    // For demo purposes, we'll save to local storage
    const posts = JSON.parse(localStorage.getItem('publishedPosts') || '[]');
    posts.push(postData);
    localStorage.setItem('publishedPosts', JSON.stringify(posts));
    
    // Show success message
    showToast('Post published successfully!');
    
    // Close modal
    closeCreatePostModal();
    
    // Reload posts
    loadAdminPosts();
  }
  
  // Get all form data as an object
  function getPostData() {
    // Get visibility
    const visibilityElement = document.querySelector('input[name="visibility"]:checked');
    const visibility = visibilityElement ? visibilityElement.value : 'public';
    
    // Create post data object
    return {
      id: generateId(),
      title: postTitleInput ? postTitleInput.value.trim() : '',
      content: postContentInput ? postContentInput.value.trim() : '',
      media: selectedFiles.map(fileObj => ({
        type: fileObj.type,
        name: fileObj.file.name,
        // In a real app, this would be a URL after uploading to server
        url: fileObj.url
      })),
      visibility: visibility,
      price: visibility === 'ppv' && ppvPrice ? parseFloat(ppvPrice.value) : 0,
      createdAt: new Date(),
      author: {
        name: 'John Smith', // In a real app, this would come from the user's profile
        avatar: '/images/image1.png'
      },
      stats: {
        likes: 0,
        comments: 0,
        bookmarks: 0,
        shares: 0
      }
    };
  }
  
  // Validate the form before submission
  function validateForm(isDraft = false) {
    // For drafts, we don't need to validate as strictly
    if (isDraft) {
      return true;
    }
    
    // Content is required
    if (postContentInput && !postContentInput.value.trim()) {
      showToast('Post content is required', 'error');
      postContentInput.focus();
      return false;
    }
    
    // If PPV, price is required
    const visibilityElement = document.querySelector('input[name="visibility"]:checked');
    const visibility = visibilityElement ? visibilityElement.value : 'public';
    
    if (visibility === 'ppv' && ppvPrice) {
      if (!ppvPrice.value || parseFloat(ppvPrice.value) <= 0) {
        showToast('Please enter a valid price for pay-per-view content', 'error');
        ppvPrice.focus();
        return false;
      }
    }
    
    return true;
  }
  
  // Load admin posts
  function loadAdminPosts() {
    if (!adminPostsContainer) return;
    
    // Get published posts from local storage
    const publishedPosts = JSON.parse(localStorage.getItem('publishedPosts') || '[]');
    
    // Sort by date (newest first)
    publishedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Take only the first 6 posts
    const recentPosts = publishedPosts.slice(0, 6);
    
    // Clear container
    adminPostsContainer.innerHTML = '';
    
    // If no posts, show message
    if (recentPosts.length === 0) {
      adminPostsContainer.innerHTML = `
        <div class="no-posts">
          <i class="fas fa-inbox"></i>
          <p>No posts yet. Create your first post!</p>
        </div>
      `;
      return;
    }
    
    // Render posts
    recentPosts.forEach(post => {
      const postElement = createPostElement(post);
      adminPostsContainer.appendChild(postElement);
    });
  }
  
  // Create a post element
  function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    postDiv.setAttribute('data-post-id', post.id);
    
    // Format date
    const postDate = new Date(post.createdAt);
    const formattedDate = formatTimeAgo(postDate);
    
    // Create media content
    let mediaContent = '';
    
    if (post.media && post.media.length > 0) {
      const media = post.media[0];
      
      if (media.type === 'image') {
        mediaContent = `
          <div class="post-media">
            <img src="${media.url}" alt="Post Image" class="post-image">
          </div>
        `;
      } else if (media.type === 'video') {
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
    }
    
    // Create visibility badge
    let visibilityBadge = '';
    if (post.visibility === 'subscribers') {
      visibilityBadge = '<span class="post-visibility-badge subscribers">Subscribers Only</span>';
    } else if (post.visibility === 'ppv') {
      visibilityBadge = `<span class="post-visibility-badge ppv">PPV $${post.price.toFixed(2)}</span>`;
    }
    
    // Assemble post HTML
    postDiv.innerHTML = `
      <div class="post-header">
        <div class="post-user">
          <div class="post-avatar">
            <img src="${post.author.avatar}" alt="${post.author.name} Avatar">
          </div>
          <div class="post-user-info">
            <div class="post-username">
              ${post.author.name} <span class="verified-badge admin"><i class="fas fa-check-circle"></i></span>
            </div>
            <div class="post-time">${formattedDate}</div>
          </div>
        </div>
        <div class="post-actions">
          <button class="btn btn-icon post-menu-btn">
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
          <span>${post.stats.likes || 0}</span>
        </div>
        <div class="post-stat">
          <i class="fas fa-comment"></i>
          <span>${post.stats.comments || 0}</span>
        </div>
        <div class="post-stat">
          <i class="fas fa-bookmark"></i>
          <span>${post.stats.bookmarks || 0}</span>
        </div>
        <div class="post-stat">
          <i class="fas fa-share"></i>
          <span>${post.stats.shares || 0}</span>
        </div>
      </div>
      
      <div class="post-actions-bar">
        <button class="post-action-btn edit-post-btn" data-post-id="${post.id}">
          <i class="fas fa-edit"></i>
          <span>Edit</span>
        </button>
        <button class="post-action-btn delete-post-btn" data-post-id="${post.id}">
          <i class="fas fa-trash"></i>
          <span>Delete</span>
        </button>
        <button class="post-action-btn view-stats-btn" data-post-id="${post.id}">
          <i class="fas fa-chart-bar"></i>
          <span>Stats</span>
        </button>
      </div>
    `;
    
    // Add event listeners
    const editBtn = postDiv.querySelector('.edit-post-btn');
    const deleteBtn = postDiv.querySelector('.delete-post-btn');
    const viewStatsBtn = postDiv.querySelector('.view-stats-btn');
    
    if (editBtn) editBtn.addEventListener('click', () => editPost(post.id));
    if (deleteBtn) deleteBtn.addEventListener('click', () => deletePost(post.id));
    if (viewStatsBtn) viewStatsBtn.addEventListener('click', () => viewPostStats(post.id));
    
    return postDiv;
  }
  
  // Edit a post
  function editPost(postId) {
    // Get published posts from local storage
    const publishedPosts = JSON.parse(localStorage.getItem('publishedPosts') || '[]');
    
    // Find the post
    const post = publishedPosts.find(p => p.id === postId);
    
    if (!post) {
      showToast('Post not found', 'error');
      return;
    }
    
    // Open create post modal
    openCreatePostModal();
    
    // Fill form with post data
    if (postTitleInput) postTitleInput.value = post.title || '';
    if (postContentInput) postContentInput.value = post.content || '';
    
    // Set visibility
    const visibilityInput = document.querySelector(`input[name="visibility"][value="${post.visibility}"]`);
    if (visibilityInput) visibilityInput.checked = true;
    
    // Show/hide PPV settings
    if (post.visibility === 'ppv' && ppvSettings) {
      ppvSettings.style.display = 'block';
      if (ppvPrice) ppvPrice.value = post.price;
    }
    
    // Handle media (in a real app, you would need to handle this differently)
    // For demo purposes, we'll just show a message
    if (mediaPreview && post.media && post.media.length > 0) {
      mediaPreview.innerHTML = `
        <div class="media-placeholder">
          <i class="fas fa-image"></i>
          <p>Your existing media will be preserved</p>
        </div>
      `;
    }
    
    // Change publish button text
    if (publishBtn) publishBtn.textContent = 'Update Post';
    
    // Add event listener for form submission
    if (quickPostForm) {
      const originalSubmitHandler = quickPostForm.onsubmit;
      quickPostForm.onsubmit = function(e) {
        e.preventDefault();
        
        // Update post
        updatePost(postId);
        
        // Restore original handler
        quickPostForm.onsubmit = originalSubmitHandler;
      };
    }
  }
  
  // Update a post
  function updatePost(postId) {
    // Get published posts from local storage
    const publishedPosts = JSON.parse(localStorage.getItem('publishedPosts') || '[]');
    
    // Find the post index
    const postIndex = publishedPosts.findIndex(p => p.id === postId);
    
    if (postIndex === -1) {
      showToast('Post not found', 'error');
      return;
    }
    
    // Get form data
    const postData = getPostData();
    
    // Preserve original data
    postData.id = postId;
    postData.createdAt = publishedPosts[postIndex].createdAt;
    postData.stats = publishedPosts[postIndex].stats;
    
    // If no new media was selected, preserve original media
    if (selectedFiles.length === 0 && publishedPosts[postIndex].media) {
      postData.media = publishedPosts[postIndex].media;
    }
    
    // Update post
    publishedPosts[postIndex] = postData;
    
    // Save to local storage
    localStorage.setItem('publishedPosts', JSON.stringify(publishedPosts));
    
    // Show success message
    showToast('Post updated successfully!');
    
    // Close modal
    closeCreatePostModal();
    
    // Reload posts
    loadAdminPosts();
  }
  
  // Delete a post
  function deletePost(postId) {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }
    
    // Get published posts from local storage
    const publishedPosts = JSON.parse(localStorage.getItem('publishedPosts') || '[]');
    
    // Filter out the post
    const updatedPosts = publishedPosts.filter(p => p.id !== postId);
    
    // Save to local storage
    localStorage.setItem('publishedPosts', JSON.stringify(updatedPosts));
    
    // Show success message
    showToast('Post deleted successfully!');
    
    // Reload posts
    loadAdminPosts();
  }
  
  // View post stats
  function viewPostStats(postId) {
    // In a real app, this would open a detailed stats view
    // For demo purposes, we'll just show a message
    showToast('Post stats feature coming soon!');
  }
  
  // Load drafts
  function loadDrafts() {
    const draftsList = document.getElementById('drafts-list');
    if (!draftsList) return;
    
    // Get drafts from local storage
    const drafts = JSON.parse(localStorage.getItem('postDrafts') || '[]');
    
    // Sort by date (newest first)
    drafts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Take only the first 2 drafts
    const recentDrafts = drafts.slice(0, 2);
    
    // Clear container
    draftsList.innerHTML = '';
    
    // If no drafts, show message
    if (recentDrafts.length === 0) {
      draftsList.innerHTML = `
        <div class="no-drafts">
          <p>No drafts yet. Save a post as draft to see it here.</p>
        </div>
      `;
      return;
    }
    
    // Render drafts
    recentDrafts.forEach(draft => {
      const draftElement = createDraftElement(draft);
      draftsList.appendChild(draftElement);
    });
  }
  
  // Create a draft element
  function createDraftElement(draft) {
    const draftDiv = document.createElement('div');
    draftDiv.className = 'draft-item';
    draftDiv.setAttribute('data-draft-id', draft.id);
    
    // Format date
    const draftDate = new Date(draft.createdAt);
    const formattedDate = formatTimeAgo(draftDate);
    
    // Determine preview image
    let previewHtml = '';
    if (draft.media && draft.media.length > 0 && draft.media[0].type === 'image') {
      previewHtml = `<img src="${draft.media[0].url}" alt="Draft Preview">`;
    } else if (draft.media && draft.media.length > 0 && draft.media[0].type === 'video') {
      previewHtml = `
        <div class="video-preview">
          <i class="fas fa-play-circle"></i>
        </div>
      `;
    } else {
      previewHtml = `
        <div class="text-preview">
          <i class="fas fa-file-alt"></i>
        </div>
      `;
    }
    
    // Assemble draft HTML
    draftDiv.innerHTML = `
      <div class="draft-preview">
        ${previewHtml}
      </div>
      <div class="draft-info">
        <h4>${draft.title || 'Untitled Draft'}</h4>
        <p>Last edited: ${formattedDate}</p>
      </div>
      <div class="draft-actions">
        <button class="btn btn-icon edit-draft-btn" title="Edit Draft" data-draft-id="${draft.id}">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-icon delete-draft-btn" title="Delete Draft" data-draft-id="${draft.id}">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    
    // Add event listeners
    const editBtn = draftDiv.querySelector('.edit-draft-btn');
    const deleteBtn = draftDiv.querySelector('.delete-draft-btn');
    
    if (editBtn) editBtn.addEventListener('click', () => editDraft(draft.id));
    if (deleteBtn) deleteBtn.addEventListener('click', () => deleteDraft(draft.id));
    
    return draftDiv;
  }
  
  // Edit a draft
  function editDraft(draftId) {
    // Get drafts from local storage
    const drafts = JSON.parse(localStorage.getItem('postDrafts') || '[]');
    
    // Find the draft
    const draft = drafts.find(d => d.id === draftId);
    
    if (!draft) {
      showToast('Draft not found', 'error');
      return;
    }
    
    // Open create post modal
    openCreatePostModal();
    
    // Fill form with draft data
    if (postTitleInput) postTitleInput.value = draft.title || '';
    if (postContentInput) postContentInput.value = draft.content || '';
    
    // Set visibility
    const visibilityInput = document.querySelector(`input[name="visibility"][value="${draft.visibility}"]`);
    if (visibilityInput) visibilityInput.checked = true;
    
    // Show/hide PPV settings
    if (draft.visibility === 'ppv' && ppvSettings) {
      ppvSettings.style.display = 'block';
      if (ppvPrice) ppvPrice.value = draft.price;
    }
    
    // Handle media (in a real app, you would need to handle this differently)
    // For demo purposes, we'll just show a message
    if (mediaPreview && draft.media && draft.media.length > 0) {
      mediaPreview.innerHTML = `
        <div class="media-placeholder">
          <i class="fas fa-image"></i>
          <p>Your existing media will be preserved</p>
        </div>
      `;
    }
    
    // Change buttons text
    if (saveDraftBtn) saveDraftBtn.textContent = 'Update Draft';
    if (publishBtn) publishBtn.textContent = 'Publish Draft';
    
    // Add event listeners for buttons
    if (saveDraftBtn) {
      const originalDraftHandler = saveDraftBtn.onclick;
      saveDraftBtn.onclick = function() {
        // Update draft
        updateDraft(draftId);
        
        // Restore original handler
        saveDraftBtn.onclick = originalDraftHandler;
      };
    }
    
    if (quickPostForm) {
      const originalSubmitHandler = quickPostForm.onsubmit;
      quickPostForm.onsubmit = function(e) {
        e.preventDefault();
        
        // Publish draft
        publishDraft(draftId);
        
        // Restore original handler
        quickPostForm.onsubmit = originalSubmitHandler;
      };
    }
  }