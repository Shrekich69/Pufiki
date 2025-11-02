browser.commands.onCommand.addListener( (cmd) => {
    browser.tabs.query({ currentWindow: true }, (tabs) => {
        switch (cmd) {
            //Управление вкладками
            case 'prev_tab':
                switchToPrevTab(tabs);
                break;
            case 'first_tab':
                let beggining = (tabs[0].url === "about:firefoxview") ? 1 : 0;
                browser.tabs.update(tabs[beggining].id, { active: true });
                break;
            case 'next_tab':
                switchToNextTab(tabs);
                break;
            case 'last_tab':
                browser.tabs.update(tabs[tabs.length - 1].id, { active: true });
                break;
            //Создание вкладок
            case 'new_tab':
                browser.tabs.create({});
                break;
            case 'restore_tab':
                restoreClosedTab()
                break;
        }
    });
});