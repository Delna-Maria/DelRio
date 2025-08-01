document.getElementById("saveBtn").addEventListener("click", () => {
  const color = document.getElementById("cursorColor").value;
  const trail = document.getElementById("trailToggle").checked;

  chrome.storage.sync.set({ color, trail }, () => {
    alert("Theme saved!");
  });
});
