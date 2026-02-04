// activity_search.js

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search');
    const activityCards = document.querySelectorAll('.card');
    const tabs = document.querySelectorAll('.tab');

    let currentCategory = 'all';

    // Category mapping based on actual activity titles
    const categoryMap = {
        'reading': ['reading', 'book'],
        'exercise': ['walk', 'jogging', 'workout', 'nature'],
        'creative': ['drawing', 'writing', 'musical', 'music', 'creative'],
        'social': ['game', 'family', 'volunteering', 'volunteer', 'social'],
        'mindfulness': ['mindfulness', 'meditation', 'yoga', 'detox', 'mind'],
        'music': ['musical', 'music', 'practice'],
        // Medium level activities
        'jogging': ['jogging'],
        'journaling': ['journal'],
        'cooking practice': ['cooking'],
        'project build': ['project'],
        'gardening': ['garden'],
        'new skill': ['skill', 'new_skill'],
        // High level activities
        'intense workout': ['workout', 'intense'],
        'creative writing': ['writing', 'creative'],
        'community volunteering': ['volunteering', 'community'],
        'detox': ['detox'],
        'deep work': ['deep', 'work'],
        'brain exercise': ['brain', 'exercise']
    };

    // Tab click handlers
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');

            const tabText = tab.textContent.trim().toLowerCase();

            if (tabText === 'all activities') {
                currentCategory = 'all';
            } else {
                currentCategory = tabText;
            }

            filterActivities();
        });
    });

    // Search input handler
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterActivities(e.target.value);
        });
    }

    function filterActivities(searchTerm = '') {
        searchTerm = searchTerm.toLowerCase().trim();

        activityCards.forEach(card => {
            const title = card.querySelector('.card-title');
            const description = card.querySelector('.card-desc');

            if (!title) return;

            const titleText = title.textContent.toLowerCase();
            const descText = description ? description.textContent.toLowerCase() : '';

            // Check search match
            const searchMatches = searchTerm === '' ||
                titleText.includes(searchTerm) ||
                descText.includes(searchTerm);

            // Check category match
            let categoryMatches = currentCategory === 'all';

            if (!categoryMatches) {
                // Check if activity belongs to selected category
                const keywords = categoryMap[currentCategory] || [currentCategory];
                categoryMatches = keywords.some(keyword =>
                    titleText.includes(keyword) || descText.includes(keyword)
                );
            }

            // Show card only if both search and category match
            if (searchMatches && categoryMatches) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }
});
