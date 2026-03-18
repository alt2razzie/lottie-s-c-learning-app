let xp = 35;
let lessonsDone = 0;

// 1. Theme Toggle
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}

// Load Theme
if (localStorage.getItem('theme') === 'light') document.body.classList.add('light-mode');

// 2. Fetch Lesson from Groq Backend
async function fetchLesson(topic) {
    const display = document.getElementById('lesson-display');
    const loading = document.getElementById('loading');
    
    loading.style.display = 'block';
    display.style.display = 'none';
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

    try {
        const response = await fetch('http://127.0.0.1:3000/api/get-lesson', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic: topic })
        });

        const data = await response.json();

        // Use Marked to parse AI markdown
        display.innerHTML = marked.parse(data.lessonContent);
        display.style.display = 'block';
        loading.style.display = 'none';

        // Highlight Code
        Prism.highlightAll();

        // Update Gamification
        updateProgress();

    } catch (error) {
        loading.innerHTML = "❌ Error connecting to server.";
        console.error(error);
    }
}

// 3. Update XP and Stats
function updateProgress() {
    xp += 15;
    lessonsDone += 1;
    
    if (xp > 100) xp = 100; // Cap for Lv 1

    document.getElementById('xp-bar').style.width = xp + '%';
    document.getElementById('xp-text').innerText = `${xp}/100 XP`;
    document.getElementById('total-xp').innerText = xp;
    document.getElementById('lessons-count').innerText = lessonsDone;
}
