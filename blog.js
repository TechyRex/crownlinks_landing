// Blog JavaScript

// Blog data storage (in a real app, this would be a database)
let blogPosts = JSON.parse(localStorage.getItem('crownlinks_blog_posts')) || [];

// DOM elements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize based on current page
    const path = window.location.pathname;
    
    if (path.includes('blog.html') || path.endsWith('/')) {
        // Blog listing page
        loadBlogPosts();
    } else if (path.includes('blog-post.html')) {
        // Individual blog post page
        loadBlogPost();
    } else if (path.includes('adminblog.html')) {
        // Admin page
        initializeAdminPage();
    }
});

// Load blog posts for listing page
function loadBlogPosts() {
    const blogGrid = document.getElementById('blogGrid');
    const blogLoading = document.getElementById('blogLoading');
    const noPosts = document.getElementById('noPosts');
    
    if (!blogGrid) return;
    
    // Simulate loading delay
    setTimeout(() => {
        blogLoading.style.display = 'none';
        
        if (blogPosts.length === 0) {
            noPosts.style.display = 'block';
            return;
        }
        
        // Sort posts by date (newest first)
        const sortedPosts = [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Generate blog post cards
        blogGrid.innerHTML = sortedPosts.map(post => `
            <div class="blog-card">
                <div class="blog-card-image">
                    <img src="${post.image || 'assets/blog-placeholder.jpg'}" alt="${post.title}">
                </div>
                <div class="blog-card-content">
                    <span class="blog-card-category">${post.category}</span>
                    <h3 class="blog-card-title">
                        <a href="blog-post.html?id=${post.id}">${post.title}</a>
                    </h3>
                    <p class="blog-card-excerpt">${post.excerpt}</p>
                    <div class="blog-card-meta">
                        <div class="blog-card-author">
                            <img src="assets/author-placeholder.jpg" alt="${post.author}">
                            <span>${post.author}</span>
                        </div>
                        <span>${formatDate(post.date)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }, 1000);
}

// Load individual blog post
function loadBlogPost() {
    const blogPost = document.getElementById('blogPost');
    const blogLoading = document.getElementById('blogLoading');
    const postNotFound = document.getElementById('postNotFound');
    
    if (!blogPost) return;
    
    // Get post ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    // Simulate loading delay
    setTimeout(() => {
        blogLoading.style.display = 'none';
        
        if (!postId) {
            postNotFound.style.display = 'block';
            return;
        }
        
        const post = blogPosts.find(p => p.id === postId);
        
        if (!post) {
            postNotFound.style.display = 'block';
            return;
        }
        
        // Generate blog post content
        blogPost.innerHTML = `
            <div class="post-header">
                <span class="post-category">${post.category}</span>
                <h1 class="post-title">${post.title}</h1>
                <div class="post-meta">
                    <div class="post-author">
                        <img src="assets/author-placeholder.jpg" alt="${post.author}">
                        <span>By ${post.author}</span>
                    </div>
                    <span>${formatDate(post.date)}</span>
                </div>
            </div>
            <div class="post-image">
                <img src="${post.image || 'assets/blog-placeholder.jpg'}" alt="${post.title}">
            </div>
            <div class="post-content">
                ${post.content}
            </div>
            <div class="post-actions">
                <a href="blog.html" class="back-to-blog">
                    <i class="fas fa-arrow-left"></i> Back to Blog
                </a>
            </div>
        `;
    }, 1000);
}

// Initialize admin page
function initializeAdminPage() {
    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show active tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}-tab`) {
                    content.classList.add('active');
                }
            });
            
            // Load posts if manage tab is active
            if (tabId === 'manage') {
                loadAdminPosts();
            }
        });
    });
    
    // Image upload preview
    const imageInput = document.getElementById('post-image');
    const imagePreview = document.getElementById('imagePreview');
    const uploadBtn = document.getElementById('upload-btn');
    
    if (uploadBtn) {
        uploadBtn.addEventListener('click', () => {
            imageInput.click();
        });
    }
    
    if (imageInput) {
        imageInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Blog form submission
    const blogForm = document.getElementById('blog-form');
    const formMessage = document.getElementById('form-message');
    
    if (blogForm) {
        blogForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveBlogPost(false);
        });
        
        // Save as draft
        const saveDraftBtn = document.getElementById('save-draft');
        if (saveDraftBtn) {
            saveDraftBtn.addEventListener('click', function() {
                saveBlogPost(true);
            });
        }
    }
    
    // Load posts for management
    loadAdminPosts();
}

// Save blog post
function saveBlogPost(isDraft = false) {
    const form = document.getElementById('blog-form');
    const formMessage = document.getElementById('form-message');
    
    const formData = new FormData(form);
    const imageInput = document.getElementById('post-image');
    
    // Get image as base64 if selected
    let imageBase64 = null;
    if (imageInput.files.length > 0) {
        const file = imageInput.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            imageBase64 = e.target.result;
            completeSave(formData, imageBase64, isDraft, formMessage);
        };
        reader.readAsDataURL(file);
    } else {
        completeSave(formData, null, isDraft, formMessage);
    }
}

function completeSave(formData, imageBase64, isDraft, formMessage) {
    const newPost = {
        id: generateId(),
        title: formData.get('title'),
        excerpt: formData.get('excerpt'),
        content: formData.get('content'),
        category: formData.get('category'),
        author: formData.get('author'),
        image: imageBase64,
        date: new Date().toISOString(),
        status: isDraft ? 'draft' : 'published'
    };
    
    // Add to posts array
    blogPosts.push(newPost);
    
    // Save to localStorage
    localStorage.setItem('crownlinks_blog_posts', JSON.stringify(blogPosts));
    
    // Show success message
    formMessage.innerHTML = `
        <div class="message success">
            <i class="fas fa-check-circle"></i>
            <p>Blog post ${isDraft ? 'saved as draft' : 'published'} successfully!</p>
        </div>
    `;
    
    // Reset form
    document.getElementById('blog-form').reset();
    document.getElementById('imagePreview').innerHTML = `
        <i class="fas fa-image"></i>
        <p>No image selected</p>
    `;
    
    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth' });
    
    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.innerHTML = '';
    }, 5000);
}

// Load posts for admin management
function loadAdminPosts() {
    const postsList = document.getElementById('postsList');
    const postsLoading = document.getElementById('postsLoading');
    const noPosts = document.getElementById('noPosts');
    
    if (!postsList) return;
    
    // Simulate loading delay
    setTimeout(() => {
        postsLoading.style.display = 'none';
        
        if (blogPosts.length === 0) {
            noPosts.style.display = 'block';
            return;
        }
        
        // Sort posts by date (newest first)
        const sortedPosts = [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Generate posts list
        postsList.innerHTML = sortedPosts.map(post => `
            <div class="post-item">
                <div class="post-item-image">
                    <img src="${post.image || 'assets/blog-placeholder.jpg'}" alt="${post.title}">
                </div>
                <div class="post-item-content">
                    <div class="post-item-title">${post.title}</div>
                    <div class="post-item-meta">
                        ${formatDate(post.date)} • ${post.category} • 
                        <span style="color: ${post.status === 'published' ? '#4caf50' : '#ff9800'}">
                            ${post.status}
                        </span>
                    </div>
                </div>
                <div class="post-item-actions">
                    <button class="btn-edit" onclick="editPost('${post.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deletePost('${post.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }, 1000);
}

// Edit post
function editPost(postId) {
    const post = blogPosts.find(p => p.id === postId);
    if (!post) return;
    
    // Switch to create tab
    document.querySelector('[data-tab="create"]').click();
    
    // Fill form with post data
    document.getElementById('post-title').value = post.title;
    document.getElementById('post-excerpt').value = post.excerpt;
    document.getElementById('post-content').value = post.content;
    document.getElementById('post-category').value = post.category;
    document.getElementById('post-author').value = post.author;
    
    if (post.image) {
        document.getElementById('imagePreview').innerHTML = `<img src="${post.image}" alt="Preview">`;
    }
    
    // Update form to indicate editing
    const form = document.getElementById('blog-form');
    form.setAttribute('data-editing', postId);
    
    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth' });
}

// Delete post
function deletePost(postId) {
    if (confirm('Are you sure you want to delete this blog post?')) {
        blogPosts = blogPosts.filter(p => p.id !== postId);
        localStorage.setItem('crownlinks_blog_posts', JSON.stringify(blogPosts));
        loadAdminPosts();
    }
}

// Utility functions
function generateId() {
    return 'post_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}
