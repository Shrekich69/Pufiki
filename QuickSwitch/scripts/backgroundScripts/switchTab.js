function getCurrentIndex(tabsArray) {
    let currentTab;
    for (let tab of tabsArray) {
        if (tab.url === "about:firefoxview") {
            browser.tabs.move(tab.id, { index: 0 })
        }
        if (tab.active === true) {
            currentTab = tab;
        }
    }
    return currentTab.index;
}

function switchToNextTab(tabs) {
    const currentIndex = getCurrentIndex(tabs);
    const nextIndex = (currentIndex + 1 >= tabs.length) ? 0 : currentIndex + 1;

    browser.tabs.update(tabs[nextIndex].id, { active: true });
}
function switchToPrevTab(tabs) {
    const currentIndex = getCurrentIndex(tabs);
    const prevIndex = (currentIndex - 1 < 0) ? tabs.length - 1 : currentIndex - 1;

    browser.tabs.update(tabs[prevIndex].id, { active: true });
}