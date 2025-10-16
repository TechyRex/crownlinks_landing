// Blog functionality for blog.html
document.addEventListener('DOMContentLoaded', function() {
    const blogGrid = document.getElementById('blogGrid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    let currentPage = 1;
    const postsPerPage = 6;
    
    // Load blog posts
    function loadBlogPosts(page = 1, append = false) {
        // Get posts from localStorage or use default data
        let posts = JSON.parse(localStorage.getItem('blogPosts')) || getDefaultPosts();
        
        // Calculate start and end indices for pagination
        const startIndex = (page - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const postsToShow = posts.slice(0, endIndex);
        
        // Clear grid if not appending
        if (!append) {
            blogGrid.innerHTML = '';
        }
        
        // Display posts
        postsToShow.forEach(post => {
            const blogCard = createBlogCard(post);
            blogGrid.appendChild(blogCard);
        });
        
        // Show/hide load more button
        if (endIndex >= posts.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }
    
    // Create blog card HTML
    function createBlogCard(post) {
        const card = document.createElement('div');
        card.className = 'blog-card';
        card.setAttribute('data-id', post.id);
        
        // Format date
        const date = new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        card.innerHTML = `
            <div class="blog-card-image">
                <img src="${post.image}" alt="${post.title}">
            </div>
            <div class="blog-card-content">
                <div class="blog-card-meta">
                    <span class="blog-card-date">
                        <i class="far fa-calendar"></i> ${date}
                    </span>
                    <span class="blog-card-category">${post.category}</span>
                </div>
                <h3>${post.title}</h3>
                <p class="blog-card-excerpt">${post.excerpt}</p>
                <div class="blog-card-footer">
                    <a href="blog-post.html?id=${post.id}" class="read-more">
                        Read More <i class="fas fa-arrow-right"></i>
                    </a>
                    <div class="blog-card-actions">
                        <i class="far fa-heart" data-id="${post.id}"></i>
                        <i class="far fa-share-square" data-id="${post.id}"></i>
                    </div>
                </div>
            </div>
        `;
        
        // Add click event to card
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('blog-card-actions') && 
                !e.target.classList.contains('fa-heart') && 
                !e.target.classList.contains('fa-share-square')) {
                window.location.href = `blog-post.html?id=${post.id}`;
            }
        });
        
        // Add like functionality
        const likeBtn = card.querySelector('.fa-heart');
        likeBtn.addEventListener('click', function() {
            toggleLike(post.id, likeBtn);
        });
        
        // Add share functionality
        const shareBtn = card.querySelector('.fa-share-square');
        shareBtn.addEventListener('click', function() {
            sharePost(post);
        });
        
        return card;
    }
    
    // Toggle like for a post
    function toggleLike(postId, likeBtn) {
        let likedPosts = JSON.parse(localStorage.getItem('likedPosts')) || [];
        const index = likedPosts.indexOf(postId);
        
        if (index === -1) {
            // Like the post
            likedPosts.push(postId);
            likeBtn.classList.remove('far');
            likeBtn.classList.add('fas');
            likeBtn.style.color = '#b21f1f';
        } else {
            // Unlike the post
            likedPosts.splice(index, 1);
            likeBtn.classList.remove('fas');
            likeBtn.classList.add('far');
            likeBtn.style.color = '';
        }
        
        localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
    }
    
    // Share post
    function sharePost(post) {
        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: post.excerpt,
                url: `${window.location.origin}/blog-post.html?id=${post.id}`
            })
            .catch(error => console.log('Error sharing:', error));
        } else {
            // Fallback for browsers that don't support Web Share API
            const shareUrl = `${window.location.origin}/blog-post.html?id=${post.id}`;
            navigator.clipboard.writeText(shareUrl)
                .then(() => alert('Link copied to clipboard!'))
                .catch(err => console.error('Failed to copy: ', err));
        }
    }
    
    // Load more posts
    loadMoreBtn.addEventListener('click', function() {
        currentPage++;
        loadBlogPosts(currentPage, true);
    });
    
    // Initialize
    loadBlogPosts(currentPage);
    
    // Check for liked posts and update UI
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts')) || [];
    setTimeout(() => {
        likedPosts.forEach(postId => {
            const likeBtn = document.querySelector(`.fa-heart[data-id="${postId}"]`);
            if (likeBtn) {
                likeBtn.classList.remove('far');
                likeBtn.classList.add('fas');
                likeBtn.style.color = '#b21f1f';
            }
        });
    }, 100);
});

// Default blog posts
function getDefaultPosts() {
    return [
        {
            id: 1,
            title: "How to Prepare for University Screening Exercises",
            excerpt: "Learn the essential steps to ace your university screening and increase your chances of admission.",
            content: "<p>University screening exercises are a critical part of the admission process in Nigerian universities. Proper preparation can significantly increase your chances of success.</p><p>Start by understanding the screening format for your chosen institution. Some universities conduct written tests, while others focus on oral interviews or document verification.</p><p>Gather all required documents well in advance, including your O'level results, JAMB registration details, and any other certificates. Make multiple copies and keep them organized.</p><p>Practice common interview questions and prepare concise, honest answers about your academic background, career goals, and why you chose the specific course and university.</p><p>Remember to dress appropriately and arrive early on the screening day to avoid unnecessary stress.</p>",
            image: "assets/blog1.jpg",
            category: "Admission Tips",
            date: "2023-10-15",
            author: "Crownlinks Team"
        },
        {
            id: 2,
            title: "Understanding JAMB and Direct Entry Requirements",
            excerpt: "A comprehensive guide to JAMB registration, subject combinations, and Direct Entry requirements.",
            content: "<p>Navigating JAMB requirements can be challenging for prospective university students. Understanding the process is crucial for a successful application.</p><p>For UTME candidates, ensure you meet the minimum O'level requirements for your chosen course. Pay attention to subject combinations as specified by your preferred institution.</p><p>Direct Entry applicants must have at least an OND, HND, NCE, or A'level qualification. Check if your institution accepts your specific qualification for the course you're applying for.</p><p>Registration typically opens in November/December, so start preparing early. Keep track of deadlines and have all necessary documents ready before beginning the registration process.</p>",
            image: "assets/blog2.jpg",
            category: "Admission Process",
            date: "2023-10-10",
            author: "Crownlinks Team"
        },
        {
            id: 3,
            title: "Writing Winning Project Proposals",
            excerpt: "Expert tips on crafting compelling project proposals that get approved by your department.",
            content: "<p>A well-written project proposal is the foundation of a successful academic project. Follow these guidelines to create proposals that impress your supervisors.</p><p>Start with a clear, concise title that accurately reflects your research focus. Your introduction should establish the context and significance of your study.</p><p>Develop specific, measurable research objectives and questions. These will guide your entire project and help maintain focus.</p><p>Conduct a thorough literature review to situate your research within existing scholarship. Identify gaps that your study will address.</p><p>Detail your methodology, including research design, population, sampling techniques, and data collection methods. Be specific about how you'll analyze your data.</p><p>Finally, include a realistic timeline and budget if required. Proofread carefully before submission to ensure clarity and professionalism.</p>",
            image: "assets/blog3.jpg",
            category: "Academic Writing",
            date: "2023-10-05",
            author: "Crownlinks Team"
        }
    ];
}
