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

// Initialize the Home Grid
function renderHome() {
    let html = "";
    categories.forEach(cat => {
        html += `
            <div class="card" onclick="fetchLiveLesson('${cat.title}')">
                <div class="card-icon" style="background-color: ${cat.color};">${cat.icon}</div>
                <div class="card-content">
                    <div class="card-title">${cat.title}</div>
                    <div class="card-desc">${cat.description}</div>
                    <div class="progress-bg">
                        <div class="progress-fill" style="width: 0%; background-color: ${cat.color};"></div>
                    </div>
                </div>
                <div class="card-arrow">›</div>
            </div>
        `;
    });
    container.innerHTML = html;
}

async function fetchLiveLesson(topicName) {
    // UI Transitions
    homeView.style.display = 'none';
    lessonView.style.display = 'block';
    lessonContent.innerHTML = `<p style="text-align:center;">Crunching C code for ${topicName}... 🚀</p>`;

    try {
        // We use 127.0.0.1 to avoid local DNS issues
        const response = await fetch('http://127.0.0.1:3000/api/get-lesson', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic: topicName })
        });

        if (!response.ok) throw new Error("Server response was not ok");

        const data = await response.json();
        
        if (data.lessonContent) {
            lessonContent.innerHTML = data.lessonContent;
        } else {
            throw new Error("Empty content received");
        }

    } catch (error) {
        console.error("Fetch Error:", error);
        lessonContent.innerHTML = `
            <div style="text-align:center; color: var(--pastel-pink);">
                <p>Oops! Could not connect to the Brain.</p>
                <p style="font-size:0.8rem; margin-top:10px;">Check if your CMD window is still open and running 'node server.js'</p>
            </div>
        `;
    }
}

function goBack() {
    lessonView.style.display = 'none';
    homeView.style.display = 'block';
}

// Kickstart the app
renderHome();
