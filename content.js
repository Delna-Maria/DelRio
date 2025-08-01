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
    const dx = Math.abs(e.clientX - lastX);
    const dy = Math.abs(e.clientY - lastY);
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 80) {
      moveBurst++;
      if (moveBurst > 12) {
        showFloatingDialogue(getRandomMessage("move"));
        moveBurst = 0;
      }
    }

    lastX = e.clientX;
    lastY = e.clientY;
  });
}
