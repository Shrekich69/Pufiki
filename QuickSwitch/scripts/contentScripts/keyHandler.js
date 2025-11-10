document.addEventListener('keypress', (event) => {
    chrome.runtime.sendMessage(event.key);
});