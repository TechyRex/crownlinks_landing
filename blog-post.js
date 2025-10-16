// Get blog post ID from URL
function getBlogPostId() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'));
}

// Load blog post data
function loadBlogPost() {
    const postId = getBlogPostId();
    const blogPosts = JSON.parse(localStorage.getItem('crownlinksBlogPosts')) || [];
    const post = blogPosts.find(p => p.id === postId);
    
    if (!post) {
        document.querySelector('.blog-post-content').innerHTML = `
            <div class="error-message">
                <h2>Blog Post Not Found</h2>
                <p>The blog post you're looking for doesn't exist or has been removed.</p>
                <a href="blog.html" class="btn primary">Back to Blog</a>
            </div>
        `;
        return;
    }
    
    // Update page title
    document.title = `${post.title} - Crownlinks Education Consultancy`;
    
    // Update breadcrumb
    document.getElementById('breadcrumb-category').textContent = post.category.replace('-', ' ');
    
    // Update post content
    document.getElementById('blog-post-title').textContent = post.title;
    document.getElementById('post-author').textContent = post.author;
    document.getElementById('post-date').textContent = formatDate(post.date);
    document.getElementById('post-category').textContent = post.category.replace('-', ' ');
    document.getElementById('post-image').src = post.image;
    document.getElementById('post-image').alt = post.title;
    document.getElementById('blog-post-body').innerHTML = post.content;
    
    // Update tags
    const tagsContainer = document.getElementById('post-tags');
    tagsContainer.innerHTML = `<span class="tag">${post.category.replace('-', ' ')}</span>`;
    
    // Load navigation
    loadPostNavigation(postId, blogPosts);
    
    // Load recent posts
    loadRecentPosts(blogPosts, postId);
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Load post navigation (previous/next)
function loadPostNavigation(currentPostId, blogPosts) {
    const sortedPosts = [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));
    const currentIndex = sortedPosts.findIndex(post => post.id === currentPostId);
    
    const prevPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
    const nextPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;
    
    if (prevPost) {
        document.getElementById('prev-post').href = `blog-post.html?id=${prevPost.id}`;
        document.getElementById('prev-title').textContent = prevPost.title;
    } else {
        document.getElementById('prev-post').style.display = 'none';
    }
    
    if (nextPost) {
        document.getElementById('next-post').href = `blog-post.html?id=${nextPost.id}`;
        document.getElementById('next-title').textContent = nextPost.title;
    } else {
        document.getElementById('next-post').style.display = 'none';
    }
}

// Load recent posts in sidebar
function loadRecentPosts(blogPosts, currentPostId) {
    const recentPostsContainer = document.getElementById('recent-posts');
    const recentPosts = blogPosts
        .filter(post => post.id !== currentPostId)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);
    
    if (recentPosts.length === 0) {
        recentPostsContainer.innerHTML = '<p>No recent posts available.</p>';
        return;
    }
    
    recentPostsContainer.innerHTML = recentPosts.map(post => `
        <div class="recent-post">
            <div class="recent-post-image">
                <img src="${post.image}" alt="${post.title}">
            </div>
            <div class="recent-post-content">
                <h4><a href="blog-post.html?id=${post.id}">${post.title}</a></h4>
                <span class="recent-post-date">${formatDate(post.date)}</span>
            </div>
        </div>
    `).join('');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', loadBlogPost);
