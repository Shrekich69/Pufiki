document.addEventListener('keypress', (event) => {
    chrome.runtime.sendMessage({ type: event.key });
});