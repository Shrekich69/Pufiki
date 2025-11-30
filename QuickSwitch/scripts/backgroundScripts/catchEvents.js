let specialKey = false;
browser.runtime.onMessage.addListener( async (mess) => {

    const tabs = await browser.tabs.query({ currentWindow: true });
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
                browser.tabs.update(tabs[beggining].id, { active: true });
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
                browser.tabs.update(tabs[end].id, { active: true });
            }
            specialKey = false;
            break;

        //Создание вкладок
        case "t":
            if (specialKey)
                browser.tabs.create({});
            specialKey = false;
            break;
        case "s":
            if (specialKey)
                browser.sessions.restore();
            specialKey = false;
            break;
        
        default:
            specialKey = false;
            break;
    }

});

browser.tabs.onUpdated.addListener( () => {

    groupTabs();
    ungroupIfOne();

});
browser.tabs.onRemoved.addListener( () => {

    ungroupIfOne();

});

browser.runtime.onConnect.addListener( (port) => {

    console.assert(port.name === 'popup_content-script');

    port.onMessage.addListener( async (message) => {
        if (message.action === 'getGroups') {

            const groups = await browser.tabGroups.query({});
            port.postMessage(groups);

        } else if (message.action === 'toggle_grouping') {

            if (message.object[1] === false){
                const domain = await getDomainFromId(message.object[0])
                toggleGrouping(domain, false, message.object[0]);
            } else {
                const domain = await getDomainFromId(message.object[0])
                const newId = await toggleGrouping(domain, true);

                port.postMessage({
                    action: 'change_id',
                    data: {
                        oldId: message.object[0],
                        newId: newId 
                    }
                });
            }

        } else {

            switch (message.type) {
                case "text":
                    browser.tabGroups.update(message.id, { title: message.value });
                    break;
                case "color":
                    browser.tabGroups.update(message.id, { color: message.value });
                    break;
            }
            
        }
    });

});