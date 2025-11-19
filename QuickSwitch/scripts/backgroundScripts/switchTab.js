function getCurrentIndex(tabsArray) {
    let currentTab;
    for (let tab of tabsArray) {
        if (tab.active === true) {
            currentTab = tab;
        }
    }
    return currentTab.index;
}

async function switchToNextTab(tabs) {
    const currentIndex = getCurrentIndex(tabs);
    let nextIndex = (currentIndex + 1 >= tabs.length) ? 0 : currentIndex + 1
    while (tabs[nextIndex].url.indexOf("about") !== -1) {
        nextIndex = (nextIndex + 1 > tabs.length - 1) ? 0 : nextIndex + 1;
    }

    await browser.tabs.update(tabs[nextIndex].id, { active: true });
}
async function switchToPrevTab(tabs) {
    const currentIndex = getCurrentIndex(tabs);
    let prevIndex = (currentIndex - 1 < 0) ? tabs.length - 1 : currentIndex - 1;
    while (tabs[prevIndex].url.indexOf("about") !== -1) {
        prevIndex = (prevIndex - 1 < 0) ? tabs.length - 1 : prevIndex - 1;
    }

    await browser.tabs.update(tabs[prevIndex].id, { active: true });
}