let tabs;
browser.tabs.onCreated.addListener( () => {
    browser.tabs.query({ currentWindow: true }, (tabes) => { tabs = tabes; });
});
browser.tabs.onUpdated.addListener( (tabId, changeInfo, tab) => {
    if (tabs != undefined) {
        tabs[tab.index] = tab;
    } else {
        browser.tabs.query({ currentWindow: true }, (tabes) => { tabs = tabes; });
    }
});

let last_closed_tabs = new Array();
browser.tabs.onRemoved.addListener( (tabId) => {
    if (tabs != undefined) {
        for (const tab of tabs) {
            if (tab.id === tabId) {
                last_closed_tabs.push({ index: tab.index, url: tab.url });
                break;
            }
        }
    }
});

function restoreClosedTab() {
    let last_tab = last_closed_tabs[last_closed_tabs.length - 1];
    if (last_tab != undefined) {
        browser.tabs.create({ index: last_tab.index, url: last_tab.url, active: false })
        .then( () => { last_closed_tabs.pop(); })
    } else console.log("Нет истории вкладок");
}