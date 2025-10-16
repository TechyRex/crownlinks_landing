// Blog post functionality for blog-post.html
document.addEventListener('DOMContentLoaded', function() {
    const blogPostContent = document.getElementById('blogPostContent');
    const relatedPostsGrid = document.getElementById('relatedPostsGrid');
    
    // Get post ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get('id'));
    
    if (!postId) {
        // Redirect to blog page if no ID provided
        window.location.href = 'blog.html';
        return;
    }
    
    // Load blog post
    function loadBlogPost() {
        const posts = JSON.parse(localStorage.getItem('blogPosts')) || getDefaultPosts();
        const post = posts.find(p => p.id === postId);
        
        if (!post) {
            // Redirect if post not found
            window.location.href = 'blog.html';
            return;
        }
        
        // Update page title
        document.title = `${post.title} - Crownlinks Blog`;
        
        // Format date
        const date = new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Create blog post HTML
        blogPostContent.innerHTML = `
            <div class="blog-post-header">
                <div class="blog-post-meta">
                    <div>
                        <span class="blog-post-date">
                            <i class="far fa-calendar"></i> ${date}
                        </span>
                        <span class="blog-post-author">
                            <i class="far fa-user"></i> ${post.author}
                        </span>
                    </div>
                    <span class="blog-post-category">${post.category}</span>
                </div>
                <h1 class="blog-post-title">${post.title}</h1>
            </div>
            <div class="blog-post-image">
                <img src="${post.image}" alt="${post.title}">
            </div>
            <div class="blog-post-body">
                <div class="blog-post-text">
                    ${post.content}
                </div>
            </div>
            <div class="blog-post-actions">
                <div class="blog-post-social">
                    <a href="#" class="share-facebook" title="Share on Facebook">
                        <i class="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" class="share-twitter" title="Share on Twitter">
                        <i class="fab fa-twitter"></i>
                    </a>
                    <a href="#" class="share-linkedin" title="Share on LinkedIn">
                        <i class="fab fa-linkedin-in"></i>
                    </a>
                    <a href="#" class="share-whatsapp" title="Share on WhatsApp">
                        <i class="fab fa-whatsapp"></i>
                    </a>
                </div>
                <div class="blog-post-navigation">
                    <a href="blog.html" class="blog-post-nav-btn">
                        <i class="fas fa-arrow-left"></i> Back to Blog
                    </a>
                </div>
            </div>
        `;
        
        // Set up social sharing
        setupSocialSharing(post);
        
        // Load related posts
        loadRelatedPosts(post);
    }
    
    // Set up social sharing buttons
    function setupSocialSharing(post) {
        const shareUrl = encodeURIComponent(window.location.href);
        const shareTitle = encodeURIComponent(post.title);
        const shareText = encodeURIComponent(post.excerpt);
        
        // Facebook
        document.querySelector('.share-facebook').href = 
            `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
        
        // Twitter
        document.querySelector('.share-twitter').href = 
            `https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`;
        
        // LinkedIn
        document.querySelector('.share-linkedin').href = 
            `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
        
        // WhatsApp
        document.querySelector('.share-whatsapp').href = 
            `https://api.whatsapp.com/send?text=${shareTitle} ${shareUrl}`;
        
        // Open share links in new window
        document.querySelectorAll('.blog-post-social a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                window.open(this.href, 'share', 'width=600,height=400');
            });
        });
    }
    
    // Load related posts
    function loadRelatedPosts(currentPost) {
        const posts = JSON.parse(localStorage.getItem('blogPosts')) || getDefaultPosts();
        
        // Filter posts by same category, excluding current post
        const relatedPosts = posts
            .filter(post => post.category === currentPost.category && post.id !== currentPost.id)
            .slice(0, 3); // Show max 3 related posts
        
        if (relatedPosts.length === 0) {
            // If no related posts by category, show latest posts
            const latestPosts = posts
                .filter(post => post.id !== currentPost.id)
                .slice(0, 3);
            
            displayRelatedPosts(latestPosts);
        } else {
            displayRelatedPosts(relatedPosts);
        }
    }
    
    // Display related posts
    function displayRelatedPosts(posts) {
        if (posts.length === 0) {
            relatedPostsGrid.innerHTML = '<p>No related articles found.</p>';
            return;
        }
        
        relatedPostsGrid.innerHTML = '';
        
        posts.forEach(post => {
            const relatedPostCard = document.createElement('div');
            relatedPostCard.className = 'related-post-card';
            
            relatedPostCard.innerHTML = `
                <div class="related-post-image">
                    <img src="${post.image}" alt="${post.title}">
                </div>
                <div class="related-post-content">
                    <h4 class="related-post-title">${post.title}</h4>
                    <a href="blog-post.html?id=${post.id}" class="related-post-link">
                        Read More <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            `;
            
            relatedPostsGrid.appendChild(relatedPostCard);
        });
    }
    
    // Initialize
    loadBlogPost();
});
