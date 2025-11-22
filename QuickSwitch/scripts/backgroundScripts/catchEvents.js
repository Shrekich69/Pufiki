let specialKey = false;
browser.runtime.onMessage.addListener( async (mess) => {
    await browser.tabs.query({ currentWindow: true }, async (tabs) => {
        switch (mess) {

            //Управление вкладками
            case "g":
            case "G":
                specialKey = true;
                break;
            case "E":
                if (specialKey)
                    switchToPrevTab(tabs);
                specialKey = false;
                break;
            case "Q":
                if (specialKey) {
                    let beggining = (tabs[0].url.indexOf("about") !== -1)
                    ? 1 : 0;
                    await browser.tabs.update(tabs[beggining].id, { active: true });
                }
                specialKey = false;
                break;
            case "e":
                if (specialKey)
                    switchToNextTab(tabs);
                specialKey = false;
                break;
            case "q":
                if (specialKey) {
                    let end = (tabs[tabs.length - 1].url.indexOf("about") !== -1)
                    ? tabs.length - 2 : tabs.length - 1;
                    await browser.tabs.update(tabs[end].id, { active: true });
                }
                specialKey = false;
                break;

            //Создание вкладок
            case "t":
                if (specialKey)
                    await browser.tabs.create({});
                specialKey = false;
                break;
            case "s":
                if (specialKey)
                    await browser.sessions.restore();
                specialKey = false;
                break;
            
            default:
                specialKey = false;
                break;
        }
    });

});

browser.tabs.onUpdated.addListener( async () => {
    await groupTabs();
    await ungroupIfOne();
});

browser.runtime.onConnect.addListener( (port) => {
    console.assert(port.name === 'content-script');

    port.onMessage.addListener( (message) => {
        if (message === 'getGroups') {
            browser.tabGroups.query({}, (groups) => {
                port.postMessage(groups);
            });
        } else switch (message.type) {
            case "text":
                browser.tabGroups.update(message.id, { title: message.value });
                break;
            case "color":
                browser.tabGroups.update(message.id, { color: message.value });
                break;
        }
    });
});