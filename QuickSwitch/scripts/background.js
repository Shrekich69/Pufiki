chrome.runtime.onMessage.addListener( (req, sender, sendResp) => {
    switch (req.type) {
        case "q":
        case "й":
            switchToPrevTab();
            break;
        case "e":
        case "у":
            switchToNextTab();
            break;
    }
});

function getCurrentIndex(tabsArray) {
    let currentTab;
    for (let tab of tabsArray) {
        if (tab.url === "about:firefoxview") {
            chrome.tabs.remove(tab.id);
        }
        if (tab.active === true) {
            currentTab = tab;
        }
    }
    return currentTab.index;
}

function switchToNextTab() {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
        const currentIndex = getCurrentIndex(tabs);
        const nextIndex = (currentIndex + 1 >= tabs.length) ? 0 : currentIndex + 1;

        chrome.tabs.update(tabs[nextIndex].id, { active: true });
    });
}

function switchToPrevTab() {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
        const currentIndex = getCurrentIndex(tabs);
        const prevIndex = (currentIndex - 1 < 0) ? tabs.length - 1 : currentIndex - 1;

        chrome.tabs.update(tabs[prevIndex].id, { active: true });
    });
}