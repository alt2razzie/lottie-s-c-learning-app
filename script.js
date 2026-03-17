const categories = [
    { id: "basics", title: "C Basics", description: "Hello World, variables & types", icon: "🐱", color: "var(--pastel-yellow)", progress: 0, total: 11 },
    { id: "control-flow", title: "Control Flow", description: "If/else, loops & switches", icon: "🎀", color: "var(--pastel-pink)", progress: 0, total: 7 },
    { id: "functions", title: "Functions", description: "Function basics & recursion", icon: "🌿", color: "var(--pastel-mint)", progress: 0, total: 2 },
    { id: "pointers", title: "Pointers", description: "Memory addresses & dereferencing", icon: "🍑", color: "var(--pastel-peach)", progress: 0, total: 2 },
    { id: "structs", title: "Structs & Enums", description: "Custom data types", icon: "☁️", color: "var(--pastel-sky)", progress: 0, total: 2 },
    { id: "advanced", title: "Advanced C", description: "File I/O, macros & more", icon: "⭐", color: "var(--pastel-yellow)", progress: 0, total: 2 }
];

const container = document.getElementById('categories-container');
const homeView = document.getElementById('home-view');
const lessonView = document.getElementById('lesson-view');
const lessonContent = document.getElementById('lesson-content');

// 1. Render the cards
let cardsHTML = "";
categories.forEach(cat => {
    const percent = cat.total > 0 ? (cat.progress / cat.total) * 100 : 0;
    
    // Notice we added onclick="fetchLiveLesson('${cat.title}')" to the card
    cardsHTML += `
        <div class="card" onclick="fetchLiveLesson('${cat.title}')">
            <div class="card-icon" style="background-color: ${cat.color};">${cat.icon}</div>
            <div class="card-content">
                <div class="card-title">${cat.title}</div>
                <div class="card-desc">${cat.description}</div>
                <div class="progress-bg">
                    <div class="progress-fill" style="width: ${percent}%; background-color: ${cat.color};"></div>
                </div>
                <div class="progress-text">${cat.progress}/${cat.total}</div>
            </div>
            <div class="card-arrow">›</div>
        </div>
    `;
});
container.innerHTML = cardsHTML;

// 2. The function that talks to your backend!
async function fetchLiveLesson(topicName) {
    // Hide the home screen and show the loading screen
    homeView.style.display = 'none';
    lessonView.style.display = 'block';
    lessonContent.innerHTML = `<h3 style="text-align: center; margin-bottom: 1rem;">Asking Gemini about ${topicName}... 🤖</h3><div class="progress-bg"><div class="progress-fill" style="width: 100%; background-color: var(--pastel-sky); animation: pulse 1s infinite;"></div></div>`;

    try {
        // Send the request to your local Node.js server
        const response = await fetch('http://localhost:3000/api/get-lesson', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic: topicName })
        });

        const data = await response.json();
        
        // Display the AI's response (using pre-wrap so formatting stays intact)
        if (data.lessonContent) {
            lessonContent.innerHTML = `<div style="white-space: pre-wrap; line-height: 1.6; font-size: 0.9rem;">${data.lessonContent}</div>`;
        } else {
            lessonContent.innerHTML = `<p style="color: var(--pastel-pink);">Error: ${data.error}</p>`;
        }
        
    } catch (error) {
        console.error("Connection failed:", error);
        lessonContent.innerHTML = `<p style="color: var(--pastel-pink); text-align: center;">Oops! Could not connect to the Brain. Make sure your server.js is running!</p>`;
    }
}

// 3. Back Button functionality
function goBack() {
    lessonView.style.display = 'none';
    homeView.style.display = 'block';
}
