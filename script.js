const canvas = document.getElementById('scroll-canvas');
const context = canvas.getContext('2d');

// Configuration
const frameCount = 240;
const currentFrame = index => ./frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg;

// Resume Content [cite: 1, 3, 5, 7, 14, 23]
const resumeText = `
Name: Ranjith Kumar P. 
Contact: +91 63815 87076, ranjithkumarlcu143@gmail.com. 
Location: Kallakurichi, Tamil Nadu. 
Education: BE in Electronics and Communication Engineering from Government College of Engineering, Tirunelveli (CGPA: 7.2). 
Skills: Basic Python, C, Leadership, Communication, Analytics, Teamwork, Innovation, Problem Solving, Collaboration. 
Interests: Cricket, Listening Music.
Summary: Detail-oriented ECE engineer focused on microcontrollers and communication systems.
`;

// 1. SCROLL ANIMATION
const img = new Image();
img.src = currentFrame(1);
canvas.width = 1920; 
canvas.height = 1080;

img.onload = () => context.drawImage(img, 0, 0);

const updateImage = index => {
    img.src = currentFrame(index);
    context.drawImage(img, 0, 0);
}

window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = scrollTop / maxScrollTop;
    const frameIndex = Math.min(frameCount - 1, Math.ceil(scrollFraction * frameCount));
    
    requestAnimationFrame(() => updateImage(frameIndex + 1));
});

// 2. CHATBOT LOGIC
const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const chatInput = document.getElementById('chat-input');
const chatBody = document.getElementById('chat-body');
const sendBtn = document.getElementById('chat-send');

chatToggle.onclick = () => chatWindow.classList.toggle('hidden');

async function callGemini(userMessage) {
    const API_KEY = "YOUR_GEMINI_API_KEY"; // Replace with your actual key
    const url = https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY};

    const systemPrompt = `You are an AI assistant representing Ranjith Kumar P. 
    STRICT RULE: Answer ONLY using the following resume information: ${resumeText}. 
    If the answer is not in the text, say: "I'm sorry, that information is not available in Ranjith's resume."`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: ${systemPrompt}\nUser: ${userMessage} }] }]
        })
    });

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

sendBtn.onclick = async () => {
    const message = chatInput.value;
    if (!message) return;

    chatBody.innerHTML += <div><b>You:</b> ${message}</div>;
    chatInput.value = '';

    const aiResponse = await callGemini(message);
    chatBody.innerHTML += <div><b>AI:</b> ${aiResponse}</div>;
    chatBody.scrollTop = chatBody.scrollHeight;
};
