/* ==============================
   Scroll Frame Animation
============================== */

const frameCount = 240;
const canvas = document.getElementById("frameCanvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const currentFrame = index => 
  `frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;

const images = [];
const img = new Image();

for (let i = 1; i <= frameCount; i++) {
  const image = new Image();
  image.src = currentFrame(i);
  images.push(image);
}

window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const frameIndex = Math.min(
    frameCount - 1,
    Math.floor((scrollTop / maxScroll) * frameCount)
  );

  requestAnimationFrame(() => updateImage(frameIndex));
});

function updateImage(index) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(images[index], 0, 0, canvas.width, canvas.height);
}

/* ==============================
   Chatbot (Gemini 2.5 Flash)
============================== */

const API_KEY = "YOUR_GEMINI_API_KEY";

const SYSTEM_PROMPT = `
You are a resume assistant chatbot.
You MUST answer ONLY using the information below.
If the question is not related to this resume, reply:
"I can only answer questions related to Ranjith Kumar's resume."

Resume Content:

Name: Ranjith Kumar P

Professional Summary:
Detail-oriented ECE engineer with a solid understanding of analog and digital electronics,
microcontrollers, and communication systems. Proficient in C and Python, with hands-on exposure to
simulation tools and hardware interfacing. Seeking an opportunity to apply technical knowledge in
real-world engineering applications.

Education:
BE - Electronics and Communication Engineering
Government College of Engineering, Tirunelveli
CGPA: 7.2
2023 - Now

HSC - SRM Muthamizhil Hr Secondary School
2022 - 2023

Skills:
Leadership
Analytics
Basics Python
Teamwork
Communication
Problem Solving
Innovation
Collaboration

Languages:
Tamil
English

Interests:
Cricket
Listening Music

Contact:
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
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + API_KEY,
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
  const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

  chatBody.innerHTML += `<div><strong>Bot:</strong> ${botReply}</div>`;
  chatBody.scrollTop = chatBody.scrollHeight;
}
