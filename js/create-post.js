document.addEventListener('DOMContentLoaded', function() {
    // Mock Auth object for demonstration purposes. Replace with your actual authentication logic.
    const Auth = {
      getCurrentUser: () => {
        // Replace this with your actual authentication check.
        // This is just a placeholder.
        const isAdmin = true; // Set to true or false based on your logic
        return isAdmin ? { isAdmin: true } : null;
      }
    };
  
    // Check if user is admin
    const currentUser = Auth.getCurrentUser();
    if (!currentUser || !currentUser.isAdmin) {
      // Redirect non-admin users to home page
      window.location.href = 'index.html';
      return;
    }
    
    // Get DOM elements
    const createPostForm = document.getElementById('create-post-form');
    const postTitle = document.getElementById('post-title');
    const postContent = document.getElementById('post-content');
    const mediaUploadBtns = document.querySelectorAll('.media-upload-btn');
    const mediaUploadInput = document.getElementById('media-upload');
    const mediaPreview = document.getElementById('media-preview');
    const mediaPreviewContainer = document.querySelector('.media-upload-container');
    const visibilityOptions = document.querySelectorAll('input[name="visibility"]');
    const ppvSettings = document.getElementById('ppv-settings');
    const scheduleOptions = document.querySelectorAll('input[name="schedule"]');
    const scheduleDatetime = document.getElementById('schedule-datetime');
    const previewTitle = document.getElementById('preview-title');
    const previewContent = document.getElementById('preview-content');
    const previewMedia = document.getElementById('preview-media');
    const previewVisibility = document.querySelector('.post-preview-visibility i');
    const saveDraftBtn = document.getElementById('save-draft-btn');
    const publishBtn = document.getElementById('publish-btn');
    
    // Selected media files
    let selectedFiles = [];
    
    // Media upload buttons
    mediaUploadBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const mediaType = this.getAttribute('data-type');
        
        // Set accepted file types based on media type
        switch (mediaType) {
          case 'image':
            mediaUploadInput.accept = 'image/*';
            break;
          case 'video':
            mediaUploadInput.accept = 'video/*';
            break;
          case 'audio':
            mediaUploadInput.accept = 'audio/*';
            break;
          case 'file':
            mediaUploadInput.accept = '.pdf,.doc,.docx,.zip';
            break;
        }
        
        // Trigger file input click
        mediaUploadInput.click();
      });
    });
    
    // Handle file selection
    mediaUploadInput.addEventListener('change', function() {
      handleFiles(this.files);
    });
    
    // Drag and drop functionality
    mediaPreviewContainer.addEventListener('dragover', function(e) {
      e.preventDefault();
      this.classList.add('dragover');
    });
    
    mediaPreviewContainer.addEventListener('dragleave', function() {
      this.classList.remove('dragover');
    });
    
    mediaPreviewContainer.addEventListener('drop', function(e) {
      e.preventDefault();
      this.classList.remove('dragover');
      handleFiles(e.dataTransfer.files);
    });
    
    // Handle selected files
    function handleFiles(files) {
      if (files.length === 0) return;
      
      // Add files to selected files array
      for (let i = 0; i < files.length; i++) {
        selectedFiles.push(files[i]);
      }
      
      // Update media preview
      updateMediaPreview();
      
      // Update post preview
      updatePostPreview();
    }
    
    // Update media preview
    function updateMediaPreview() {
      // Clear placeholder if there are files
      if (selectedFiles.length > 0) {
        mediaPreview.innerHTML = '';
      } else {
        mediaPreview.innerHTML = `
          <div class="media-placeholder">
            <i class="fas fa-cloud-upload-alt"></i>
            <p>Drag & drop files here or click on the buttons above</p>
          </div>
        `;
        return;
      }
      
      // Add preview for each file
      selectedFiles.forEach((file, index) => {
        const previewItem = document.createElement('div');
        previewItem.className = 'media-preview-item';
        
        // Create preview based on file type
        if (file.type.startsWith('image/')) {
          const img = document.createElement('img');
          img.src = URL.createObjectURL(file);
          img.alt = 'Image Preview';
          previewItem.appendChild(img);
        } else if (file.type.startsWith('video/')) {
          const video = document.createElement('video');
          video.src = URL.createObjectURL(file);
          video.controls = true;
          previewItem.appendChild(video);
        } else {
          // For other file types, show an icon
          const fileIcon = document.createElement('div');
          fileIcon.className = 'file-icon';
          fileIcon.innerHTML = `
            <i class="fas fa-file"></i>
            <span>${file.name}</span>
          `;
          previewItem.appendChild(fileIcon);
        }
        
        // Add remove button
        const removeBtn = document.createElement('div');
        removeBtn.className = 'media-remove';
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.addEventListener('click', function() {
          selectedFiles.splice(index, 1);
          updateMediaPreview();
          updatePostPreview();
        });
        
        previewItem.appendChild(removeBtn);
        mediaPreview.appendChild(previewItem);
      });
    }
    
    // Visibility change handler
    visibilityOptions.forEach(option => {
      option.addEventListener('change', function() {
        // Show/hide PPV settings
        if (this.value === 'ppv') {
          ppvSettings.classList.add('show');
        } else {
          ppvSettings.classList.remove('show');
        }
        
        // Update visibility icon in preview
        updateVisibilityIcon(this.value);
        
        // Update post preview
        updatePostPreview();
      });
    });
    
    // Update visibility icon
    function updateVisibilityIcon(visibility) {
      switch (visibility) {
        case 'public':
          previewVisibility.className = 'fas fa-globe';
          break;
        case 'subscribers':
          previewVisibility.className = 'fas fa-user-check';
          break;
        case 'ppv':
          previewVisibility.className = 'fas fa-lock';
          break;
      }
    }
    
    // Schedule change handler
    scheduleOptions.forEach(option => {
      option.addEventListener('change', function() {
        // Show/hide schedule datetime
        if (this.value === 'later') {
          scheduleDatetime.classList.add('show');
        } else {
          scheduleDatetime.classList.remove('show');
        }
      });
    });
    
    // Live preview updates
    postTitle.addEventListener('input', updatePostPreview);
    postContent.addEventListener('input', updatePostPreview);
    
    // Update post preview
    function updatePostPreview() {
      // Update title
      if (postTitle.value.trim()) {
        previewTitle.textContent = postTitle.value;
        previewTitle.style.display = 'block';
      } else {
        previewTitle.textContent = '';
        previewTitle.style.display = 'none';
      }
      
      // Update content
      if (postContent.value.trim()) {
        previewContent.innerHTML = `<p>${postContent.value.replace(/\n/g, '<br>')}</p>`;
      } else {
        previewContent.innerHTML = '<p>Your post content will appear here...</p>';
      }
      
      // Update media
      previewMedia.innerHTML = '';
      selectedFiles.forEach(file => {
        if (file.type.startsWith('image/')) {
          const img = document.createElement('img');
          img.src = URL.createObjectURL(file);
          img.alt = 'Image Preview';
          previewMedia.appendChild(img);
        } else if (file.type.startsWith('video/')) {
          const video = document.createElement('video');
          video.src = URL.createObjectURL(file);
          video.controls = true;
          previewMedia.appendChild(video);
        }
      });
    }
    
    // Save draft button
    saveDraftBtn.addEventListener('click', function() {
      // In a real app, you would save the draft to the server
      // For demo purposes, we'll just show a toast notification
      showToast('Draft saved successfully!', 'success');
    });
    
    // Publish button
    createPostForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validate form
      if (!postContent.value.trim() && selectedFiles.length === 0) {
        showToast('Please add some content or media to your post', 'error');
        return;
      }
      
      // Show loading state
      publishBtn.disabled = true;
      publishBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publishing...';
      
      // In a real app, you would submit the form data to the server
      // For demo purposes, we'll simulate a server request
      setTimeout(() => {
        showToast('Post published successfully!', 'success');
        
        // Reset form after successful submission
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
      }, 2000);
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
    
    // Initialize preview
    updatePostPreview();
  });

  // Create Post functionality for MyFans admin page

document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const createPostForm = document.getElementById('create-post-form');
  const postTitleInput = document.getElementById('post-title');
  const postContentInput = document.getElementById('post-content');
  const mediaUpload = document.getElementById('media-upload');
  const mediaPreview = document.getElementById('media-preview');
  const mediaUploadBtns = document.querySelectorAll('.media-upload-btn');
  const visibilityOptions = document.querySelectorAll('input[name="visibility"]');
  const ppvSettings = document.getElementById('ppv-settings');
  const ppvPrice = document.getElementById('ppv-price');
  const postTags = document.getElementById('post-tags');
  const scheduleOptions = document.querySelectorAll('input[name="schedule"]');
  const scheduleDateTime = document.getElementById('schedule-datetime');
  const scheduledTime = document.getElementById('scheduled-time');
  const saveDraftBtn = document.getElementById('save-draft-btn');
  const publishBtn = document.getElementById('publish-btn');
  
  // Preview elements
  const previewTitle = document.getElementById('preview-title');
  const previewContent = document.getElementById('preview-content');
  const previewMedia = document.getElementById('preview-media');
  const previewVisibility = document.querySelector('.post-preview-visibility i');
  
  // State
  let selectedFiles = [];
  let currentMediaType = 'image';
  
  // Initialize
  initCreatePost();
  
  function initCreatePost() {
    // Set default scheduled time to now + 1 hour
    const defaultTime = new Date();
    defaultTime.setHours(defaultTime.getHours() + 1);
    scheduledTime.value = formatDateTimeForInput(defaultTime);
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize preview
    updatePreview();
  }
  
  function setupEventListeners() {
    // Media upload buttons
    mediaUploadBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        currentMediaType = this.getAttribute('data-type');
        mediaUpload.click();
      });
    });
    
    // Media file selection
    mediaUpload.addEventListener('change', handleFileSelection);
    
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
        
        // Update preview
        updatePreviewVisibility(this.value);
      });
    });
    
    // Schedule options
    scheduleOptions.forEach(option => {
      option.addEventListener('change', function() {
        if (this.value === 'later') {
          scheduleDateTime.style.display = 'block';
        } else {
          scheduleDateTime.style.display = 'none';
        }
      });
    });
    
    // Live preview updates
    postTitleInput.addEventListener('input', updatePreview);
    postContentInput.addEventListener('input', updatePreview);
    
    // Save draft button
    saveDraftBtn.addEventListener('click', saveDraft);
    
    // Form submission
    createPostForm.addEventListener('submit', publishPost);
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
    
    // Update the post preview
    updatePreview();
  }
  
  // Set up drag and drop functionality
  function setupDragAndDrop() {
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
    
    // Update previews
    updateMediaPreview();
    updatePreview();
  }
  
  // Update the post preview
  function updatePreview() {
    // Update title
    if (postTitleInput.value.trim()) {
      previewTitle.textContent = postTitleInput.value;
      previewTitle.style.display = 'block';
    } else {
      previewTitle.style.display = 'none';
    }
    
    // Update content
    if (postContentInput.value.trim()) {
      previewContent.innerHTML = `<p>${postContentInput.value.replace(/\n/g, '<br>')}</p>`;
    } else {
      previewContent.innerHTML = '<p>Your post content will appear here...</p>';
    }
    
    // Update media preview
    updatePreviewMedia();
  }
  
  // Update the preview media
  function updatePreviewMedia() {
    previewMedia.innerHTML = '';
    
    if (selectedFiles.length === 0) return;
    
    // Single image
    if (selectedFiles.length === 1 && selectedFiles[0].type === 'image') {
      previewMedia.innerHTML = `
        <img src="${selectedFiles[0].url}" alt="Preview Image" class="preview-image">
      `;
    }
    // Single video
    else if (selectedFiles.length === 1 && selectedFiles[0].type === 'video') {
      previewMedia.innerHTML = `
        <div class="video-container">
          <video controls>
            <source src="${selectedFiles[0].url}" type="${selectedFiles[0].file.type}">
          </video>
        </div>
      `;
    }
    // Single audio
    else if (selectedFiles.length === 1 && selectedFiles[0].type === 'audio') {
      previewMedia.innerHTML = `
        <div class="audio-container">
          <audio controls>
            <source src="${selectedFiles[0].url}" type="${selectedFiles[0].file.type}">
          </audio>
        </div>
      `;
    }
    // Gallery (multiple images)
    else if (selectedFiles.length > 1 && selectedFiles.every(f => f.type === 'image')) {
      const galleryHTML = `
        <div class="image-gallery">
          <div class="image-gallery-row">
            ${selectedFiles.slice(0, Math.ceil(selectedFiles.length / 2)).map(f => 
              `<img src="${f.url}" alt="Gallery Image" class="gallery-image">`
            ).join('')}
          </div>
          ${selectedFiles.length > Math.ceil(selectedFiles.length / 2) ? `
            <div class="image-gallery-row">
              ${selectedFiles.slice(Math.ceil(selectedFiles.length / 2)).map(f => 
                `<img src="${f.url}" alt="Gallery Image" class="gallery-image">`
              ).join('')}
            </div>
          ` : ''}
        </div>
      `;
      previewMedia.innerHTML = galleryHTML;
    }
    // File
    else if (selectedFiles.length === 1 && selectedFiles[0].type === 'file') {
      previewMedia.innerHTML = `
        <div class="file-preview">
          <i class="fas fa-file"></i>
          <p>${selectedFiles[0].file.name}</p>
        </div>
      `;
    }
  }
  
  // Update the preview visibility icon
  function updatePreviewVisibility(visibility) {
    switch (visibility) {
      case 'public':
        previewVisibility.className = 'fas fa-globe';
        break;
      case 'subscribers':
        previewVisibility.className = 'fas fa-user-check';
        break;
      case 'ppv':
        previewVisibility.className = 'fas fa-lock';
        break;
    }
  }
  
  // Save the post as a draft
  function saveDraft() {
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
  }
  
  // Publish the post
  function publishPost(e) {
    e.preventDefault();
    
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
    
    // Reset form
    resetForm();
  }
  
  // Get all form data as an object
  function getPostData() {
    // Get visibility
    const visibility = document.querySelector('input[name="visibility"]:checked').value;
    
    // Get schedule
    const scheduleType = document.querySelector('input[name="schedule"]:checked').value;
    const scheduledDateTime = scheduleType === 'later' ? new Date(scheduledTime.value) : new Date();
    
    // Get tags
    const tags = postTags.value.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    // Create post data object
    return {
      id: generateId(),
      title: postTitleInput.value.trim(),
      content: postContentInput.value.trim(),
      media: selectedFiles.map(fileObj => ({
        type: fileObj.type,
        name: fileObj.file.name,
        // In a real app, this would be a URL after uploading to server
        url: fileObj.url
      })),
      visibility: visibility,
      price: visibility === 'ppv' ? parseFloat(ppvPrice.value) : 0,
      tags: tags,
      schedule: {
        type: scheduleType,
        datetime: scheduledDateTime
      },
      createdAt: new Date(),
      author: {
        name: 'Your Name', // In a real app, this would come from the user's profile
        avatar: '/placeholder.svg?height=40&width=40'
      }
    };
  }
  
  // Validate the form before submission
  function validateForm() {
    // Content is required
    if (!postContentInput.value.trim()) {
      showToast('Post content is required', 'error');
      postContentInput.focus();
      return false;
    }
    
    // If PPV, price is required
    const visibility = document.querySelector('input[name="visibility"]:checked').value;
    if (visibility === 'ppv') {
      if (!ppvPrice.value || parseFloat(ppvPrice.value) <= 0) {
        showToast('Please enter a valid price for pay-per-view content', 'error');
        ppvPrice.focus();
        return false;
      }
    }
    
    // If scheduled for later, date is required
    const scheduleType = document.querySelector('input[name="schedule"]:checked').value;
    if (scheduleType === 'later') {
      if (!scheduledTime.value) {
        showToast('Please select a scheduled time', 'error');
        scheduledTime.focus();
        return false;
      }
      
      // Scheduled time must be in the future
      const scheduledDateTime = new Date(scheduledTime.value);
      if (scheduledDateTime <= new Date()) {
        showToast('Scheduled time must be in the future', 'error');
        scheduledTime.focus();
        return false;
      }
    }
    
    return true;
  }
  
  // Reset the form after submission
  function resetForm() {
    createPostForm.reset();
    selectedFiles = [];
    updateMediaPreview();
    updatePreview();
    ppvSettings.style.display = 'none';
    scheduleDateTime.style.display = 'none';
    
    // Reset scheduled time to now + 1 hour
    const defaultTime = new Date();
    defaultTime.setHours(defaultTime.getHours() + 1);
    scheduledTime.value = formatDateTimeForInput(defaultTime);
  }
  
  // Validate file type based on media type
  function validateFileType(file, mediaType) {
    const fileType = file.type;
    
    switch (mediaType) {
      case 'image':
        return fileType.startsWith('image/');
      case 'video':
        return fileType.startsWith('video/');
      case 'audio':
        return fileType.startsWith('audio/');
      case 'file':
        return true; // Accept any file type
      default:
        return false;
    }
  }
  
  // Format date for datetime-local input
  function formatDateTimeForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
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
  
  // Generate a random ID
  function generateId() {
    return Math.random().toString(36).substring(2, 15);
  }
});