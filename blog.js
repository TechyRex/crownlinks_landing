// Blog data structure (in a real app, this would come from a backend)
let blogPosts = JSON.parse(localStorage.getItem('crownlinksBlogPosts')) || [
    {
        id: 1,
        title: "Understanding JAMB Cut-off Marks for 2023 Admissions",
        excerpt: "Learn about the latest JAMB cut-off marks and how they affect your chances of admission into Nigerian universities.",
        content: "<p>This is the full content of the blog post about JAMB cut-off marks...</p>",
        category: "admissions",
        date: "2023-10-15",
        image: "assets/blog-jamb.jpg",
        author: "Crownlinks Team",
        featured: true
    },
    {
        id: 2,
        title: "5 Effective Study Techniques for University Students",
        excerpt: "Discover proven study methods that can help you excel in your university courses and improve your academic performance.",
        content: "<p>This is the full content of the blog post about study techniques...</p>",
        category: "study-tips",
        date: "2023-10-10",
        image: "assets/blog-study.jpg",
        author: "Crownlinks Team",
        featured: false
    },
    {
        id: 3,
        title: "New Universities Approved by NUC in 2023",
        excerpt: "Get the latest information on newly approved universities in Nigeria and what this means for prospective students.",
        content: "<p>This is the full content of the blog post about new universities...</p>",
        category: "university-news",
        date: "2023-10-05",
        image: "assets/blog-university.jpg",
        author: "Crownlinks Team",
        featured: false
    }
];

// DOM Elements
const blogGrid = document.getElementById('blogGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const loadMoreBtn = document.getElementById('loadMoreBtn');

// Initialize variables
let currentFilter = 'all';
let visiblePosts = 6;
const postsPerLoad = 6;

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Generate blog card HTML
function generateBlogCard(post) {
    return `
        <div class="blog-card" data-category="${post.category}">
            <div class="blog-card-image">
                <img src="${post.image}" alt="${post.title}">
            </div>
            <div class="blog-card-content">
                <div class="blog-card-meta">
                    <span class="blog-card-category">${post.category.replace('-', ' ')}</span>
                    <span class="blog-card-date">
                        <i class="far fa-calendar"></i> ${formatDate(post.date)}
                    </span>
                </div>
                <h3 class="blog-card-title">
                    <a href="blog-post.html?id=${post.id}">${post.title}</a>
                </h3>
                <p class="blog-card-excerpt">${post.excerpt}</p>
                <div class="blog-card-footer">
                    <span class="author">By ${post.author}</span>
                    <a href="blog-post.html?id=${post.id}" class="read-more">
                        Read More <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Display blog posts
function displayBlogPosts() {
    blogGrid.innerHTML = '';
    
    // Filter posts
    let filteredPosts = blogPosts;
    if (currentFilter !== 'all') {
        filteredPosts = blogPosts.filter(post => post.category === currentFilter);
    }
    
    // Limit visible posts
    const postsToShow = filteredPosts.slice(0, visiblePosts);
    
    // Generate HTML
    if (postsToShow.length === 0) {
        blogGrid.innerHTML = '<p class="no-posts">No blog posts found for this category.</p>';
    } else {
        postsToShow.forEach(post => {
            blogGrid.innerHTML += generateBlogCard(post);
        });
    }
    
    // Show/hide load more button
    if (visiblePosts >= filteredPosts.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'inline-block';
    }
}

// Filter posts by category
function filterPosts(category) {
    currentFilter = category;
    visiblePosts = postsPerLoad;
    displayBlogPosts();
    
    // Update active filter button
    filterBtns.forEach(btn => {
        if (btn.dataset.filter === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Load more posts
function loadMorePosts() {
    visiblePosts += postsPerLoad;
    displayBlogPosts();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    displayBlogPosts();
    
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterPosts(btn.dataset.filter);
        });
    });
    
    // Load more button
    loadMoreBtn.addEventListener('click', loadMorePosts);
});
