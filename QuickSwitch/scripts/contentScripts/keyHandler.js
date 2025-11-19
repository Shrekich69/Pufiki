document.addEventListener('keypress', async (event) => {
    await browser.runtime.sendMessage(event.key);
});