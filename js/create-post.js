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