// --- 1. Global State ---
let xp = 35;
let lessonsDone = 0;

// --- 2. Theme Management ---
function toggleTheme() {
    const isLight = document.body.classList.contains('light-mode');
    if (isLight) {
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
    }
}

(function loadSavedTheme() {
    if (localStorage.getItem('theme') === 'light') document.body.classList.add('light-mode');
})();

// --- 3. The Brain Connection ---
async function fetchLesson(topic) {
    const display = document.getElementById('lesson-display');
    const loading = document.getElementById('loading');
    
    loading.style.display = 'block';
    display.style.display = 'none';
    
    window.scrollTo({ top: display.offsetTop - 50, behavior: 'smooth' });

    try {
        const response = await fetch('https://c-learning-backend.onrender.com/api/get-lesson', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic: topic })
        });

        const data = await response.json();
        display.innerHTML = marked.parse(data.lessonContent);
        
        display.style.display = 'block';
        loading.style.display = 'none';

        Prism.highlightAll();
        updateProgress();

    } catch (error) {
        loading.innerHTML = "😿 Server is napping. Try again!";
    }
}

// --- 4. Progress System ---
function updateProgress() {
    lessonsDone += 1;
    xp += 20; // More XP for coding!
    if (xp > 100) xp = 100;

    document.getElementById('xp-bar').style.width = xp + '%';
    document.getElementById('xp-text').innerText = `${xp}/100 XP`;
    document.getElementById('total-xp').innerText = xp;
    document.getElementById('lessons-count').innerText = lessonsDone;
}
