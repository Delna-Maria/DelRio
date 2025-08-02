let lastX = 0;
let lastY = 0;
let moveBurst = 0;
let lastMoveTime = Date.now();
const distanceThreshold = 200;         // Minimum distance for it to count
const movementBurstLimit = 6;          // How many wild moves before reaction
const movementCooldown = 1000;         // 1 second cooldown


let messages = {};
let idleTimer;

fetch(chrome.runtime.getURL("dialogues.json"))
  .then(res => res.json())
  .then(data => {
    messages = data;
    showFloatingDialogue(getRandomMessage("greeting"));
    setupListeners();
  });

function getRandomMessage(type = "move") {
  const set = messages[type] || ["💀"];
  return set[Math.floor(Math.random() * set.length)];
}

function showFloatingDialogue(text) {
  const bubble = document.createElement("div");
  bubble.className = "floating-dialogue";
  bubble.innerText = text;
  document.body.appendChild(bubble);

  const { x, y } = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  bubble.style.transform = `translate(${x + Math.random() * 100}px, ${y + Math.random() * 100}px)`;

  setTimeout(() => bubble.remove(), 3000);
}

function setupListeners() {
  setupClickDetector();
  setupScrollDetector();
  setupIdleDetector();
  setupMoveDetector();
}

function setupClickDetector() {
  let clickCount = 0;
  let clickTimer;

  document.addEventListener("click", () => {
    clickCount++;
    if (clickCount >= 5) {
      showFloatingDialogue(getRandomMessage("click"));
      clickCount = 0;
    }
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => (clickCount = 0), 400);
  });
}

function setupScrollDetector() {
  let scrollCount = 0;
  let lastScroll = 0;

  window.addEventListener("wheel", () => {
    const now = Date.now();
    if (now - lastScroll < 100) {
      scrollCount++;
      if (scrollCount > 8) {
        showFloatingDialogue(getRandomMessage("scroll"));
        scrollCount = 0;
      }
    } else scrollCount = 0;
    lastScroll = now;
  });
}

function setupIdleDetector() {
  const resetIdle = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      showFloatingDialogue(getRandomMessage("idle"));
    }, 10000);
  };

  ["mousemove", "keydown", "click"].forEach(e =>
    document.addEventListener(e, resetIdle)
  );

  resetIdle();
}

function setupMoveDetector() {
  let lastX = 0;
  let lastY = 0;
  let moveBurst = 0;

  document.addEventListener("mousemove", (e) => {
  const now = Date.now();

  const dx = Math.abs(e.clientX - lastX);
  const dy = Math.abs(e.clientY - lastY);
  const distance = Math.sqrt(dx * dx + dy * dy);

  const timeDiff = now - lastMoveTime;

  // Only count bursts if movement is fast and far enough
  if (distance > distanceThreshold && timeDiff < 200) {
    moveBurst++;
  } else {
    moveBurst = Math.max(0, moveBurst - 1); // decay burst slowly
  }

  if (moveBurst >= movementBurstLimit && now - lastReactionTime > movementCooldown) {
    showFloatingDialogue(getRandomMessage("move"));
    moveBurst = 0;
    lastReactionTime = now;
  }

  lastX = e.clientX;
  lastY = e.clientY;
  lastMoveTime = now;
});

}
