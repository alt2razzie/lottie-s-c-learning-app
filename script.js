async function getLesson(topic) {
    const lessonBox = document.getElementById('lesson-box');
    const loading = document.getElementById('loading');

    // Show loading, hide old lesson
    loading.style.display = 'block';
    lessonBox.style.display = 'none';

    try {
        const response = await fetch('http://127.0.0.1:3000/api/get-lesson', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic: topic })
        });

        const data = await response.json();

        // Convert Markdown to HTML and inject
        lessonBox.innerHTML = marked.parse(data.lessonContent);
        
        // Final Polish
        loading.style.display = 'none';
        lessonBox.style.display = 'block';
        
        // Trigger Prism to color the C code blocks
        Prism.highlightAll();

    } catch (error) {
        loading.innerHTML = "❌ Oops! The cat got stuck. Check your server.";
        console.error(error);
    }
}
