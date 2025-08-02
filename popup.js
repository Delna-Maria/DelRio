const toggleBtn = document.getElementById('toggle');
const colorPicker = document.getElementById('color');

chrome.storage.sync.get(["enabled", "theme"], (data) => {
  toggleBtn.textContent = data.enabled ? "Disable" : "Enable";
  colorPicker.value = data.theme || "red";
});

toggleBtn.onclick = () => {
  chrome.storage.sync.get(["enabled"], (data) => {
    const newState = !data.enabled;
    chrome.storage.sync.set({ enabled: newState });
    toggleBtn.textContent = newState ? "Disable" : "Enable";
  });
};

colorPicker.onchange = () => {
  chrome.storage.sync.set({ theme: colorPicker.value });
};