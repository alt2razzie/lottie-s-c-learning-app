// --- 1. Global State (Gamification) ---
let xp = 35;
let lessonsDone = 0;

// --- 2. Theme Management ---
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

// Load saved theme on startup
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
}

// --- 3. The "Brain" Connection (AI Fetch) ---
async function fetchLesson(topic) {
    const display = document.getElementById('lesson-display');
    const loading = document.getElementById('loading');
    
    // UI Housekeeping: Show loading, hide old lesson
    loading.style.display = 'block';
    display.style.display = 'none';
    
    // Smooth scroll to the bottom so user sees the loading cat
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

    try {
        // CRITICAL: Notice the "/api/get-lesson" at the end of the URL
        const response = await fetch('https://c-learning-backend.onrender.com/api/get-lesson', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic: topic })
        });

        if (!response.ok) throw new Error("Server is sleeping or busy.");

        const data = await response.json();

        // Convert AI Markdown to HTML and inject into the page
        display.innerHTML = marked.parse(data.lessonContent);
        
        // Show the content and hide loading
        display.style.display = 'block';
        loading.style.display = 'none';

        // Trigger Prism to color the C code blocks (Blue/Green/Red)
        Prism.highlightAll();

        // Update the XP bar and stats
        updateProgress();

    } catch (error) {
        loading.innerHTML = "❌ The cat is taking a long nap. Try again in 30 seconds!";
        console.error("Fetch Error:", error);
    }
}

// --- 4. Gamification Logic ---
function updateProgress() {
    // Increase stats
    xp += 15;
    lessonsDone += 1;
    
    // Keep XP within 100 for Level 1
    if (xp > 100) xp = 100; 

    // Update the UI elements
    const xpBar = document.getElementById('xp-bar');
    const xpText = document.getElementById('xp-text');
    const totalXpDisplay = document.getElementById('total-xp');
    const lessonsDisplay = document.getElementById('lessons-count');

    if (xpBar) xpBar.style.width = xp + '%';
    if (xpText) xpText.innerText = `${xp}/100 XP`;
    if (totalXpDisplay) totalXpDisplay.innerText = xp;
    if (lessonsDisplay) lessonsDisplay.innerText = lessonsDone;
}
// --- Theme Management (Dark/Cute Mode) ---
function toggleTheme() {
    // 1. Check if we are currently in light mode
    const isLight = document.body.classList.contains('light-mode');
    
    if (isLight) {
        // Switch to Dark Mode
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
        console.log("🌙 Dark Mode Activated");
    } else {
        // Switch to Cute (Light) Mode
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
        console.log("🌸 Cute Mode Activated");
    }
}

// 2. Run this IMMEDIATELY when the page loads
(function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }
})();

// Function to make the Quiz clickable
function makeQuizInteractive() {
    const display = document.getElementById('lesson-display');
    const text = display.innerHTML;

    // This looks for "A) ... B) ... C) ... D) ..."
    const quizRegex = /([A-D])\)\s*([^<]+)/g;
    
    display.innerHTML = text.replace(quizRegex, (match, letter, answer) => {
        return `<button class="quiz-btn" onclick="checkAnswer('${letter}')">${letter}) ${answer}</button>`;
    });
}

// Function to check if you got it right!
function checkAnswer(selected) {
    // Most AI quizzes have 'C' as the common answer for #include, 
    // but for now, let's just make it show a result:
    if (selected === 'C') {
        alert("🎉 Purr-fect! You got it right! +5 Bonus XP");
        // You can add logic here to increase XP further
    } else {
        alert("😿 Not quite! Try reading the cat metaphor again.");
    }
}
