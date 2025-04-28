// This script adds interactivity to the recipe collection website

document.addEventListener('DOMContentLoaded', function() {
    // Recipe card interaction
    const recipeCards = document.querySelectorAll('.recipe-card');
    
    recipeCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.borderLeft = '4px solid #d35400';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.borderLeft = 'none';
        });
    });
    
    // Recipe filtering functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active button styling
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                // Show/hide recipe cards based on filter
                recipeCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Recipe search functionality
    const searchInput = document.getElementById('recipe-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            recipeCards.forEach(card => {
                const title = card.querySelector('h2').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
                
                // If a filter is active, respect that too
                const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
                if (activeFilter !== 'all' && card.getAttribute('data-category') !== activeFilter) {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // Add smooth scrolling for instruction navigation
    if (document.querySelector('.recipe-instructions')) {
        // Create quick navigation for recipe steps
        const instructionsSection = document.querySelector('.recipe-instructions');
        const steps = instructionsSection.querySelectorAll('li');
        
        const navElement = document.createElement('div');
        navElement.className = 'steps-navigation';
        navElement.innerHTML = '<p>Jump to step: </p>';
        
        steps.forEach((step, index) => {
            const stepLink = document.createElement('a');
            stepLink.href = '#';
            stepLink.textContent = index + 1;
            stepLink.addEventListener('click', function(e) {
                e.preventDefault();
                step.scrollIntoView({ behavior: 'smooth' });
                // Add highlight effect
                step.style.backgroundColor = '#fff4e8';
                setTimeout(() => {
                    step.style.backgroundColor = 'transparent';
                }, 1500);
            });
            
            navElement.appendChild(stepLink);
            
            // Add separator except for the last item
            if (index < steps.length - 1) {
                const separator = document.createTextNode(' • ');
                navElement.appendChild(separator);
            }
        });
        
        // Insert navigation before instructions list
        instructionsSection.insertBefore(navElement, instructionsSection.querySelector('ol'));
    }
    
    // Add print recipe functionality
    if (document.querySelector('.recipe-detail')) {
        const recipeDetail = document.querySelector('.recipe-detail');
        const printButton = document.createElement('button');
        printButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"></path><path d="M6 14h12v8H6z"></path></svg> Print Recipe';
        printButton.className = 'print-button';
        printButton.addEventListener('click', function() {
            window.print();
        });
        
        recipeDetail.insertBefore(printButton, recipeDetail.firstChild);
    }
    
    // Add recipe rating functionality
    const recipeDetailPage = document.querySelector('.recipe-detail');
    if (recipeDetailPage) {
        // Create rating element
        const ratingSection = document.createElement('div');
        ratingSection.className = 'recipe-rating';
        ratingSection.innerHTML = `
            <h2>Rate this Recipe</h2>
            <div class="star-rating">
                <span class="star" data-rating="1">★</span>
                <span class="star" data-rating="2">★</span>
                <span class="star" data-rating="3">★</span>
                <span class="star" data-rating="4">★</span>
                <span class="star" data-rating="5">★</span>
                <span class="rating-value">0/5</span>
            </div>
            <p class="rating-thanks" style="display: none;">Thanks for your rating!</p>
        `;
        
        // Add it to the page before the footer
        const footer = document.querySelector('footer');
        document.body.insertBefore(ratingSection, footer);
        
        // Add styles for the rating
        const style = document.createElement('style');
        style.textContent = `
            .recipe-rating {
                background-color: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                padding: 30px;
                margin-top: 30px;
                text-align: center;
            }
            
            .star-rating {
                font-size: 2rem;
                display: inline-flex;
                align-items: center;
                gap: 5px;
            }
            
            .star {
                color: #ddd;
                cursor: pointer;
                transition: color 0.3s ease;
            }
            
            .star.active {
                color: gold;
            }
            
            .star:hover, .star:hover ~ .star {
                color: #ffdd76;
            }
            
            .rating-value {
                font-size: 1rem;
                margin-left: 10px;
                color: #666;
            }
            
            .rating-thanks {
                margin-top: 10px;
                color: green;
                font-weight: bold;
            }
            
            @media print {
                .recipe-rating {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Add rating functionality
        const stars = document.querySelectorAll('.star');
        const ratingValue = document.querySelector('.rating-value');
        const ratingThanks = document.querySelector('.rating-thanks');
        
        // Fix the star hover issue with this approach
        const starRating = document.querySelector('.star-rating');
        let currentRating = 0;
        
        stars.forEach(star => {
            // When clicking a star
            star.addEventListener('click', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                currentRating = rating;
                updateStars();
                ratingValue.textContent = `${rating}/5`;
                ratingThanks.style.display = 'block';
                
                // Disable further ratings
                stars.forEach(s => s.style.pointerEvents = 'none');
                
                // Save rating (in a real application, this would send data to a server)
                console.log(`Recipe rated: ${rating} stars`);
            });
        });
        
        function updateStars() {
            stars.forEach(star => {
                const rating = parseInt(star.getAttribute('data-rating'));
                if (rating <= currentRating) {
                    star.classList.add('active');
                } else {
                    star.classList.remove('active');
                }
            });
        }
    }
});