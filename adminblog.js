// Admin blog functionality for adminblog.html
document.addEventListener('DOMContentLoaded', function() {
    const blogPostForm = document.getElementById('blog-post-form');
    const editPostForm = document.getElementById('edit-post-form');
    const postsTableBody = document.getElementById('posts-table-body');
    const postsSearch = document.getElementById('posts-search');
    const postsPagination = document.getElementById('postsPagination');
    const uploadImageBtn = document.getElementById('upload-image-btn');
    const imagePreview = document.getElementById('imagePreview');
    const editImagePreview = document.getElementById('editImagePreview');
    const formMessage = document.getElementById('form-message');
    const modal = document.getElementById('edit-post-modal');
    
    let currentPage = 1;
    const postsPerPage = 10;
    let allPosts = [];
    let filteredPosts = [];
    
    // Initialize admin panel
    function initAdminPanel() {
        // Load posts from localStorage
        allPosts = JSON.parse(localStorage.getItem('blogPosts')) || getDefaultPosts();
        filteredPosts = [...allPosts];
        
        // Set up tab functionality
        setupTabs();
        
        // Set up form submission
        setupFormSubmission();
        
        // Set up image upload simulation
        setupImageUpload();
        
        // Set up search functionality
        setupSearch();
        
        // Set up modal functionality
        setupModal();
        
        // Load posts table
        loadPostsTable();
    }
    
    // Set up tab functionality
    function setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all tabs
                tabBtns.forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // Add active class to clicked tab
                this.classList.add('active');
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    // Set up form submission
    function setupFormSubmission() {
        blogPostForm.addEventListener('submit', function(e) {
            e.preventDefault();
            createNewPost();
        });
        
        editPostForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updatePost();
        });
        
        // Save as draft button
        document.getElementById('save-draft-btn').addEventListener('click', function() {
            createNewPost(true);
        });
    }
    
    // Create new blog post
    function createNewPost(isDraft = false) {
        const formData = new FormData(blogPostForm);
        const title = formData.get('title');
        const category = formData.get('category');
        const author = formData.get('author');
        const excerpt = formData.get('excerpt');
        const content = formData.get('content');
        const image = formData.get('image');
        
        // Validate form
        if (!title || !category || !author || !excerpt || !content || !image) {
            showMessage('Please fill in all required fields.', 'error');
            return;
        }
        
        // Create new post object
        const newPost = {
            id: generateId(),
            title,
            category,
            author,
            excerpt,
            content,
            image,
            date: new Date().toISOString().split('T')[0],
            status: isDraft ? 'draft' : 'published'
        };
        
        // Add to posts array
        allPosts.unshift(newPost);
        
        // Save to localStorage
        localStorage.setItem('blogPosts', JSON.stringify(allPosts));
        
        // Show success message
        showMessage(`Post ${isDraft ? 'saved as draft' : 'published'} successfully!`, 'success');
        
        // Reset form
        blogPostForm.reset();
        imagePreview.classList.remove('visible');
        
        // Update posts table if on manage tab
        if (document.getElementById('manage-tab').classList.contains('active')) {
            filteredPosts = [...allPosts];
            loadPostsTable();
        }
    }
    
    // Update existing post
    function updatePost() {
        const formData = new FormData(editPostForm);
        const postId = parseInt(document.getElementById('edit-post-id').value);
        const title = formData.get('title');
        const category = formData.get('category');
        const author = formData.get('author');
        const excerpt = formData.get('excerpt');
        const content = formData.get('content');
        const image = formData.get('image');
        
        // Find post index
        const postIndex = allPosts.findIndex(post => post.id === postId);
        
        if (postIndex === -1) {
            showMessage('Post not found.', 'error');
            return;
        }
        
        // Update post
        allPosts[postIndex] = {
            ...allPosts[postIndex],
            title,
            category,
            author,
            excerpt,
            content,
            image
        };
        
        // Save to localStorage
        localStorage.setItem('blogPosts', JSON.stringify(allPosts));
        
        // Show success message
        showMessage('Post updated successfully!', 'success');
        
        // Close modal
        closeModal();
        
        // Update posts table
        filteredPosts = [...allPosts];
        loadPostsTable();
    }
    
    // Set up image upload simulation
    function setupImageUpload() {
        uploadImageBtn.addEventListener('click', function() {
            // In a real application, this would open a file picker and upload to a server
            // For this demo, we'll just show a prompt for a URL
            const imageUrl = prompt('Enter image URL:');
            if (imageUrl) {
                document.getElementById('post-image').value = imageUrl;
                updateImagePreview(imageUrl, imagePreview);
            }
        });
        
        // Update preview when URL changes
        document.getElementById('post-image').addEventListener('input', function() {
            if (this.value) {
                updateImagePreview(this.value, imagePreview);
            } else {
                imagePreview.classList.remove('visible');
            }
        });
        
        // For edit form
        document.getElementById('edit-post-image').addEventListener('input', function() {
            if (this.value) {
                updateImagePreview(this.value, editImagePreview);
            } else {
                editImagePreview.classList.remove('visible');
            }
        });
    }
    
    // Update image preview
    function updateImagePreview(url, previewElement) {
        previewElement.innerHTML = `<img src="${url}" alt="Preview">`;
        previewElement.classList.add('visible');
    }
    
    // Set up search functionality
    function setupSearch() {
        postsSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            if (searchTerm) {
                filteredPosts = allPosts.filter(post => 
                    post.title.toLowerCase().includes(searchTerm) ||
                    post.category.toLowerCase().includes(searchTerm) ||
                    post.author.toLowerCase().includes(searchTerm)
                );
            } else {
                filteredPosts = [...allPosts];
            }
            
            currentPage = 1;
            loadPostsTable();
        });
    }
    
    // Set up modal functionality
    function setupModal() {
        // Close modal when clicking X or cancel button
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', closeModal);
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Open edit modal
    function openEditModal(postId) {
        const post = allPosts.find(p => p.id === postId);
        
        if (!post) {
            showMessage('Post not found.', 'error');
            return;
        }
        
        // Fill form with post data
        document.getElementById('edit-post-id').value = post.id;
        document.getElementById('edit-post-title').value = post.title;
        document.getElementById('edit-post-category').value = post.category;
        document.getElementById('edit-post-author').value = post.author;
        document.getElementById('edit-post-excerpt').value = post.excerpt;
        document.getElementById('edit-post-content').value = post.content;
        document.getElementById('edit-post-image').value = post.image;
        
        // Update image preview
        if (post.image) {
            updateImagePreview(post.image, editImagePreview);
        } else {
            editImagePreview.classList.remove('visible');
        }
        
        // Show modal
        modal.classList.add('active');
    }
    
    // Close modal
    function closeModal() {
        modal.classList.remove('active');
    }
    
    // Load posts table
    function loadPostsTable() {
        // Calculate pagination
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const postsToShow = filteredPosts.slice(startIndex, endIndex);
        
        // Clear table
        postsTableBody.innerHTML = '';
        
        if (postsToShow.length === 0) {
            postsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 40px;">
                        No posts found.
                    </td>
                </tr>
            `;
            postsPagination.innerHTML = '';
            return;
        }
        
        // Add posts to table
        postsToShow.forEach(post => {
            const row = document.createElement('tr');
            
            // Format date
            const date = new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            row.innerHTML = `
                <td>${post.title}</td>
                <td>${post.category}</td>
                <td>${date}</td>
                <td>
                    <span class="post-status status-${post.status || 'published'}">
                        ${(post.status || 'published').charAt(0).toUpperCase() + (post.status || 'published').slice(1)}
                    </span>
                </td>
                <td>
                    <div class="post-actions">
                        <button class="action-btn edit-btn" data-id="${post.id}" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" data-id="${post.id}" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            postsTableBody.appendChild(row);
        });
        
        // Set up action buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const postId = parseInt(this.getAttribute('data-id'));
                openEditModal(postId);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const postId = parseInt(this.getAttribute('data-id'));
                deletePost(postId);
            });
        });
        
        // Set up pagination
        setupPagination();
    }
    
    // Set up pagination
    function setupPagination() {
        const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
        
        if (totalPages <= 1) {
            postsPagination.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <button class="pagination-btn prev-btn" ${currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <button class="pagination-btn ${i === currentPage ? 'active' : ''}">
                    ${i}
                </button>
            `;
        }
        
        // Next button
        paginationHTML += `
            <button class="pagination-btn next-btn" ${currentPage === totalPages ? 'disabled' : ''}>
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        postsPagination.innerHTML = paginationHTML;
        
        // Set up pagination event listeners
        document.querySelector('.prev-btn').addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                loadPostsTable();
            }
        });
        
        document.querySelector('.next-btn').addEventListener('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                loadPostsTable();
            }
        });
        
        document.querySelectorAll('.pagination-btn:not(.prev-btn):not(.next-btn)').forEach(btn => {
            btn.addEventListener('click', function() {
                currentPage = parseInt(this.textContent);
                loadPostsTable();
            });
        });
    }
    
    // Delete post
    function deletePost(postId) {
        if (!confirm('Are you sure you want to delete this post?')) {
            return;
        }
        
        // Remove post from array
        allPosts = allPosts.filter(post => post.id !== postId);
        
        // Save to localStorage
        localStorage.setItem('blogPosts', JSON.stringify(allPosts));
        
        // Show success message
        showMessage('Post deleted successfully!', 'success');
        
        // Update posts table
        filteredPosts = [...allPosts];
        loadPostsTable();
    }
    
    // Show message
    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
    
    // Generate unique ID
    function generateId() {
        return Date.now() + Math.floor(Math.random() * 1000);
    }
    
    // Initialize
    initAdminPanel();
});
