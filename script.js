const categories = [
    { id: "basics", title: "C Basics", description: "Hello World, variables & types", icon: "🐱", color: "var(--pastel-yellow)", progress: 0, total: 11 },
    { id: "control-flow", title: "Control Flow", description: "If/else, loops & switches", icon: "🎀", color: "var(--pastel-pink)", progress: 0, total: 7 },
    { id: "functions", title: "Functions", description: "Function basics & recursion", icon: "🌿", color: "var(--pastel-mint)", progress: 0, total: 2 },
    { id: "pointers", title: "Pointers", description: "Memory addresses & dereferencing", icon: "🍑", color: "var(--pastel-peach)", progress: 0, total: 2 },
    { id: "structs", title: "Structs & Enums", description: "Custom data types", icon: "☁️", color: "var(--pastel-sky)", progress: 0, total: 2 },
    { id: "advanced", title: "Advanced C", description: "File I/O, macros & more", icon: "⭐", color: "var(--pastel-yellow)", progress: 0, total: 2 }
];

const container = document.getElementById('categories-container');

categories.forEach(cat => {
    // Calculate percentage for the progress bar width
    const percent = cat.total > 0 ? (cat.progress / cat.total) * 100 : 0;

    // Create the HTML string for a single card
    const cardHTML = `
        <div class="card">
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
    
    // Inject the card into the page
    container.innerHTML += cardHTML;
});
