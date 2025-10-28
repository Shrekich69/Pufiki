chrome.commands.onCommand.addListener( (command) => {
    switch (command) {
        case "next_tab":
            switchToNextTab();
            break;
        case "prev_tab":
            switchToPrevTab();
            break;
    }
})

function getCurrentIndex(tabsArray) {
    let currentTab;
    for (const element of tabsArray) {
        if (element.active === true) {
            currentTab = element;
            break;
        }
    }
    const currentIndex = tabsArray.findIndex( (tab) => tab.id === currentTab.id);
    return currentIndex;
}

function switchToNextTab() {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
        const currentIndex = getCurrentIndex(tabs);
        const nextIndex = (currentIndex + 1 >= tabs.length) ? 0 : currentIndex + 1;

        chrome.tabs.update(tabs[nextIndex].id, { active: true });
        console.log("Switched to the next tab");
    });
}

function switchToPrevTab() {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
        const currentIndex = getCurrentIndex(tabs);
        const prevIndex = (currentIndex - 1 < 0) ? tabs.length - 1 : currentIndex - 1;

        chrome.tabs.update(tabs[prevIndex].id, { active: true });
        console.log("Switched to the previous tab");
    });
}