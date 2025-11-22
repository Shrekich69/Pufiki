function anyActiveField() {
    const activeField = document.activeElement;
    console.log(activeField);
    const inputTypes = ['INPUT', 'TEXTAREA', 'SELECT', 'DIV', 'MDN-SEARCH-MODAL'];
    return inputTypes.includes(activeField.tagName);
}

document.addEventListener('keypress', async (event) => {
    const activeField = anyActiveField();
    if (!activeField)
        await browser.runtime.sendMessage(event.key);
});