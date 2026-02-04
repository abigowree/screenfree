// activity_tracker.js

const ActivityTracker = {
    // Key for localStorage
    STORAGE_KEY: 'completed_activities',

    // Get all completed activities
    getCompleted: function () {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    },

    // Mark an activity as complete
    markComplete: function (activityId) {
        if (!activityId) return;

        const completed = this.getCompleted();
        const today = new Date().toLocaleDateString('en-GB'); // DD/MM/YYYY format

        completed[activityId] = {
            date: today,
            timestamp: Date.now()
        };

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(completed));
        console.log(`Activity ${activityId} marked as complete on ${today}`);
    },

    // Check if an activity is complete
    isComplete: function (activityId) {
        const completed = this.getCompleted();
        return !!completed[activityId];
    },

    // Get completion date
    getDate: function (activityId) {
        const completed = this.getCompleted();
        return completed[activityId] ? completed[activityId].date : null;
    },

    // Update UI elements on list pages
    updateUI: function () {
        const cards = document.querySelectorAll('.card');
        let completedOnThisPage = 0;

        cards.forEach(card => {
            const wrapper = card.firstElementChild; // Assumes structure: .card > div > img...
            if (!wrapper) return;

            // Look for data-activity-id on the wrapper or the card itself
            const activityId = card.getAttribute('data-activity-id') || wrapper.getAttribute('data-activity-id');

            if (activityId && this.isComplete(activityId)) {
                // Count this completed activity
                completedOnThisPage++;

                // 1. Add checkmark to image provided it doesn't already have one
                if (!wrapper.querySelector('.check')) {
                    const checkSpan = document.createElement('span');
                    checkSpan.className = 'check';
                    checkSpan.innerText = '✓';
                    wrapper.appendChild(checkSpan);
                }

                // 2. Update Footer (Button and Time/Date)
                const footer = card.querySelector('.card-footer');
                if (footer) {
                    const btn = footer.querySelector('button');
                    const timeSpan = footer.querySelector('.time');

                    if (btn) {
                        btn.className = 'btn btn-done'; // Change style
                        btn.innerText = '✓ Done';
                        // Disable the link if wrapped in one
                        const link = btn.closest('a');
                        if (link) {
                            link.href = 'javascript:void(0)';
                            link.style.cursor = 'default';
                        }
                    }

                    if (timeSpan) {
                        // Replace time with completion date
                        timeSpan.innerText = this.getDate(activityId);
                        timeSpan.style.color = 'green';
                        timeSpan.style.fontWeight = 'bold';
                    }
                }
            }
        });

        // Update header count - only count activities on THIS page
        const countSpan = document.querySelector('.header .count');
        if (countSpan) {
            countSpan.innerText = `${completedOnThisPage} activities completed`;
        }
    }
};

// Auto-run UI update on load
document.addEventListener('DOMContentLoaded', () => {
    ActivityTracker.updateUI();
});
