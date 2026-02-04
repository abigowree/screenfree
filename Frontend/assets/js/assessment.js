// assessment.js
// Requires auth.js for API_URL

// Map of options to scores
const scores = {
    // Assessment 1: How many hours on phone daily
    "Less than 2 hours": 1,
    "2 - 4 hours": 2,
    "4 - 6 hours": 3,
    "More than 6 hours": 4,
    // Assessment 2: How quickly check phone after waking
    "After an hour or more": 1,
    "Within an hour": 2,
    "Within 10 minutes": 3,
    "Immediately": 4,
    // Assessment 3: Anxiety when phone not with you
    "Never": 1,
    "Sometimes": 3,
    "Often": 3,
    "Always": 4,
    // Assessment 4: Phone usage affect sleep
    "No Impact": 1,
    "Slight Impact": 2,
    "Moderate Impact": 3,
    "Severe Impact": 4,
    // Assessment 5: Phone interrupts social interactions
    "Rarely": 2,
    "Constantly": 4,
    // Assessment 6: Difficulty controlling usage
    "Very Easy": 1,
    "Somewhat Easy": 2,
    "Difficult": 3,
    "Very Difficult": 4,
    // Legacy/fallback options
    "Frequently": 4,
    "Very Frequently": 5,
    "Not at all": 1,
    "Low": 2,
    "Moderate": 3,
    "High": 4,
    "Very High": 5
};

function initAssessment() {
    const options = document.querySelectorAll('.option');
    const nextBtn = document.querySelector('.btn-next');
    const prevBtn = document.querySelector('.btn-prev');

    let selectedScore = null;

    options.forEach(option => {
        option.addEventListener('click', () => {
            // Remove selection from others
            options.forEach(opt => opt.style.backgroundColor = '');
            options.forEach(opt => opt.style.color = '');

            // Add selection to current
            option.style.backgroundColor = '#2c7cfb';
            option.style.color = 'white';

            const text = option.querySelector('p').innerText;
            selectedScore = scores[text] || 2; // Default to 2 if not found
        });
    });

    if (nextBtn) {
        nextBtn.parentElement.addEventListener('click', (e) => {
            if (selectedScore === null) {
                e.preventDefault();
                alert("Please select an option");
                return;
            }

            // Save score for this step
            const currentPath = window.location.pathname;
            const step = currentPath.split('/').pop().replace('.html', '');
            localStorage.setItem(step, selectedScore);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            window.history.back();
        });
    }

    // Special logic for complete.html or the last assessment page
    if (window.location.pathname.includes('complete.html')) {
        calculateResult();
    }
}

async function calculateResult() {
    const steps = ['assesment', 'assesment2', 'assesment3', 'assesment4', 'assesment5', 'assesment6'];
    const answers = {};
    let allAnswered = true;

    steps.forEach((step, index) => {
        const score = localStorage.getItem(step);
        if (score) {
            answers[`q${index + 1}`] = parseFloat(score);
        } else {
            allAnswered = false;
        }
    });

    if (!allAnswered) {
        alert("Please complete all assessment questions first.");
        return;
    }

    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert("No login token found. Please login again.");
            window.location.href = "login.html";
            return;
        }

        // Ensure API_URL is available. If auth.js is loaded, it is.
        // If not, define it (fallback).
        const apiUrl = (typeof API_URL !== 'undefined') ? API_URL : "http://localhost:8000";

        const response = await fetch(`${apiUrl}/self-assessment/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(answers)
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || "Submission failed");
        }

        const data = await response.json();
        const level = data.risk_level; // "Low", "Medium", "High"

        // Update the UI with the risk level
        const resultElement = document.getElementById('risk-level');
        if (resultElement) {
            resultElement.innerText = `Your Addiction Level: ${level}`;
        }

        let redirectPage = "activities.html";
        if (level === "High") {
            redirectPage = "high.html";
        } else if (level === "Medium") {
            redirectPage = "medium.html";
        }

        const viewActivitiesBtn = document.getElementById('view-activities');
        if (viewActivitiesBtn) {
            // Remove any old listeners (by cloning logic or just setting onclick)
            // Ideally we just set it now since we are in async flow
            viewActivitiesBtn.onclick = () => {
                window.location.href = redirectPage;
            };
        }

    } catch (error) {
        console.error("Error submitting assessment:", error);
        const resultElement = document.getElementById('risk-level');
        if (resultElement) resultElement.innerText = "Error calculating results";
        alert("Failed to save assessment: " + error.message);
    }
}

document.addEventListener('DOMContentLoaded', initAssessment);

