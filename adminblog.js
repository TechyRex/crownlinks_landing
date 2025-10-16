// DOM Elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const blogPostForm = document.getElementById('blog-post-form');
const saveDraftBtn = document.getElementById('save-draft');
const postsTableBody = document.getElementById('posts-table-body');
const postSearch = document.getElementById('post-search');
const noPostsMessage = document.getElementById('no-posts');
const editModal = document.getElementById('edit-modal');
const editPostForm = document.getElementById('edit-post-form');
const closeModalBtns = document.querySelectorAll('.close-modal');
const uploadArea = document.getElementById('upload-area');
const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const createFirstPostLink = document.querySelector('.create-first-post');

// Initialize blog posts from localStorage
let blogPosts = JSON.parse(localStorage.getItem('crownlinksBlogPosts')) || [];

// Tab switching
function switchTab(tabName) {
    // Update tab buttons
    tabBtns.forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update tab content
    tabContents.forEach(content => {
        if (content.id === `${tabName}-tab`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
    
    // If switching to manage tab, refresh the table
    if (tabName === 'manage') {
        loadPostsTable();
    }
}

// Generate unique ID for new posts
function generateId() {
    return blogPosts.length > 0 ? Math.max(...blogPosts.map(post => post.id)) + 1 : 1;
}

// Handle blog post form submission
function handleBlogPostSubmit(e, isDraft = false) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const postData = {
        id: generateId(),
        title: formData.get('title'),
        category: formData.get('category'),
        author: formData.get('author'),
        excerpt: formData.get('excerpt'),
        content: formData.get('content'),
        image: formData.get('image') || 'assets/blog-default.jpg',
        date: new Date().toISOString().split('T')[0],
        status: isDraft ? 'draft' : 'published'
    };
    
    // Add to blog posts array
    blogPosts.unshift(postData);
    
    // Save to localStorage
    localStorage.setItem('crownlinksBlogPosts', JSON.stringify(blogPosts));
    
    // Show success message
    alert(isDraft ? 'Post saved as draft!' : 'Post published successfully!');
    
    // Reset form
    e.target.reset();
    
    // Switch to manage tab
    switchTab('manage');
}

// Load posts into the management table
function loadPostsTable(filter = '') {
    const filteredPosts = blogPosts.filter(post => 
        post.title.toLowerCase().includes(filter.toLowerCase()) ||
        post.category.toLowerCase().includes(filter.toLowerCase()) ||
        post.author.toLowerCase().includes(filter.toLowerCase())
    );
    
    if (filteredPosts.length === 0) {
        postsTableBody.innerHTML = '';
        noPostsMessage.style.display = 'block';
        return;
    }
    
    noPostsMessage.style.display = 'none';
    
    postsTableBody.innerHTML = filteredPosts.map(post => `
        <tr>
            <td class="post-title-cell">
                <a href="blog-post.html?id=${post.id}" class="post-title" target="_blank">${post.title}</a>
            </td>
            <td>
                <span class="post-category">${post.category.replace('-', ' ')}</span>
            </td>
            <td>${formatDate(post.date)}</td>
            <td>
                <span class="status-${post.status}">${post.status === 'published' ? 'Published' : 'Draft'}</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" data-id="${post.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn delete-btn" data-id="${post.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                    <a href="blog-post.html?id=${post.id}" class="action-btn view-btn" target="_blank">
                        <i class="fas fa-eye"></i> View
                    </a>
                </div>
            </td>
        </tr>
    `).join('');
    
    // Add event listeners to action buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => openEditModal(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deletePost(parseInt(btn.dataset.id)));
    });
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Open edit modal with post data
function openEditModal(postId) {
    const post = blogPosts.find(p => p.id === postId);
    
    if (!post) return;
    
    // Fill form with post data
    document.getElementById('edit-post-id').value = post.id;
    document.getElementById('edit-post-title').value = post.title;
    document.getElementById('edit-post-category').value = post.category;
    document.getElementById('edit-post-excerpt').value = post.excerpt;
    document.getElementById('edit-post-content').value = post.content;
    document.getElementById('edit-post-image').value = post.image;
    
    // Show modal
    editModal.classList.add('active');
}

// Handle edit form submission
function handleEditPostSubmit(e) {
    e.preventDefault();
    
    const postId = parseInt(document.getElementById('edit-post-id').value);
    const postIndex = blogPosts.findIndex(p => p.id === postId);
    
    if (postIndex === -1) return;
    
    // Update post data
    blogPosts[postIndex] = {
        ...blogPosts[postIndex],
        title: document.getElementById('edit-post-title').value,
        category: document.getElementById('edit-post-category').value,
        excerpt: document.getElementById('edit-post-excerpt').value,
        content: document.getElementById('edit-post-content').value,
        image: document.getElementById('edit-post-image').value
    };
    
    // Save to localStorage
    localStorage.setItem('crownlinksBlogPosts', JSON.stringify(blogPosts));
    
    // Close modal and refresh table
    closeModal();
    loadPostsTable();
    
    alert('Post updated successfully!');
}

// Delete post
function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    blogPosts = blogPosts.filter(post => post.id !== postId);
    localStorage.setItem('crownlinksBlogPosts', JSON.stringify(blogPosts));
    loadPostsTable();
    
    alert('Post deleted successfully!');
}

// Close modal
function closeModal() {
    editModal.classList.remove('active');
}

// Handle image upload
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.match('image.*')) {
        alert('Please select an image file.');
        return;
    }
    
    // Create a preview (in a real app, you would upload to a server)
    const reader = new FileReader();
    reader.onload = function(e) {
        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        imagePreview.style.display = 'block';
        
        // Set the image URL in the form (in a real app, this would be the uploaded image URL)
        document.getElementById('post-image').value = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // Blog post form
    blogPostForm.addEventListener('submit', (e) => handleBlogPostSubmit(e, false));
    saveDraftBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleBlogPostSubmit(new Event('submit'), true);
    });
    
    // Search functionality
    postSearch.addEventListener('input', (e) => {
        loadPostsTable(e.target.value);
    });
    
    // Edit post form
    editPostForm.addEventListener('submit', handleEditPostSubmit);
    
    // Modal close buttons
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Image upload
    uploadArea.addEventListener('click', () => imageUpload.click());
    imageUpload.addEventListener('change', handleImageUpload);
    
    // Create first post link
    if (createFirstPostLink) {
        createFirstPostLink.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab('create');
        });
    }
    
    // Load initial data
    loadPostsTable();
});

// Close modal when clicking outside
editModal.addEventListener('click', (e) => {
    if (e.target === editModal) {
        closeModal();
    }
});
