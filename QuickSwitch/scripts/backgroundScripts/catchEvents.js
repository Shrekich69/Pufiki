chrome.runtime.onMessage.addListener( (mess) => {
    browser.tabs.query({ currentWindow: true }, (tabs) => {
        switch (mess) {
            //Управление вкладками
            case "E":
                switchToPrevTab(tabs);
                break;
            case "Q":
                let beggining = (tabs[0].url === "about:firefoxview") ? 1 : 0;
                browser.tabs.update(tabs[beggining].id, { active: true });
                break;
            case "e":
                switchToNextTab(tabs);
                break;
            case "q":
                browser.tabs.update(tabs[tabs.length - 1].id, { active: true });
                break;
            //Создание вкладок
            case "t":
                browser.tabs.create({});
                break;
            case "s":
                restoreClosedTab()
                break;
        }
    });
});