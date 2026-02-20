/* ===========================
   SCROLL FRAME ANIMATION
=========================== */

const frameCount = 240;
const canvas = document.getElementById("animationCanvas");
const context = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const currentFrame = (index) =>
  `frames/ezgif-frame-${index.toString().padStart(3, "0")}.jpg`;

const images = [];
let imagesLoaded = 0;

// Preload images
for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  img.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === 1) {
      // Draw first frame immediately
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  };
  images.push(img);
}

// Scroll event
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const maxScroll =
    document.body.scrollHeight - window.innerHeight;

  const scrollFraction = scrollTop / maxScroll;
  const frameIndex = Math.min(
    frameCount - 1,
    Math.floor(scrollFraction * frameCount)
  );

  requestAnimationFrame(() => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(
      images[frameIndex],
      0,
      0,
      canvas.width,
      canvas.height
    );
  });
});

/* ===========================
   GEMINI CHATBOT
=========================== */

const API_KEY = "YOUR_GEMINI_API_KEY";

const SYSTEM_PROMPT = `
You are a strict resume assistant chatbot.
You MUST answer ONLY using the resume details below.
If question is unrelated, reply:
"I can only answer questions related to Ranjith Kumar's resume."

Resume Content:
Name: Ranjith Kumar P
ECE Engineer
CGPA: 7.2
Government College of Engineering, Tirunelveli
Skills: Leadership, Analytics, Basics Python, Teamwork,
Communication, Problem Solving, Innovation, Collaboration
Languages: Tamil, English
Interests: Cricket, Listening Music
Phone: +91 63815 87076
Email: ranjithkumarlcu143@gmail.com
Location: Kallakurichi (D.T), Tamil Nadu, India
`;

async function sendMessage() {
  const inputField = document.getElementById("userInput");
  const chatBody = document.getElementById("chatBody");
  const userText = inputField.value.trim();
  if (!userText) return;

  chatBody.innerHTML += `<div><strong>You:</strong> ${userText}</div>`;
  inputField.value = "";

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: SYSTEM_PROMPT + "\nUser Question: " + userText }]
          }
        ]
      })
    }
  );

  const data = await response.json();
  const botReply =
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "No response.";

  chatBody.innerHTML += `<div><strong>Bot:</strong> ${botReply}</div>`;
  chatBody.scrollTop = chatBody.scrollHeight;
}
