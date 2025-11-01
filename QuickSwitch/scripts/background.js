chrome.runtime.onMessage.addListener( (req, sender, sendResp) => {
    switch (req.type) {
        case "q":
            switchToPrevTab();
            break;
        case "e":
            switchToNextTab();
            break;
    }
});

function getCurrentIndex(tabsArray) {
    let currentTab;
    for (let tab of tabsArray) {
        if (tab.url === "about:firefoxview" && tab.index != 0) {
            chrome.tabs.move(tab.id, { index: 0 })
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