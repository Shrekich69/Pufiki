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

function getCurrentTab(tabsArray) {
    let currentTab;
    for (const element of tabsArray) {
        if (element.active === true) {
            currentTab = element;
            break;
        }
    }
    return currentTab;
}

function switchToNextTab() {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
        const currentTab = getCurrentTab(tabs);
        
        const currentIndex = tabs.findIndex(tab => {
            if (tab.id === currentTab.id) {
                return tab;
            }
        });
        const nextIndex = currentIndex + 1;

        if (nextIndex < tabs.length) {
            chrome.tabs.update(tabs[nextIndex].id, { active: true });
            console.log("Switched to the next tab");
        } else {
            window.open();
            console.log("Opened home page");
        }
    });
}

function switchToPrevTab() {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
        const currentTab = getCurrentTab(tabs);
        
        const currentIndex = tabs.findIndex(tab => {
            if (tab.id === currentTab.id) {
                return tab;
            }
        });
        const prevIndex = (currentIndex - 1 < 0) ? 0 : currentIndex - 1;

        chrome.tabs.update(tabs[prevIndex].id, { active: true });
        console.log("Switched to the previous tab");
    });
}