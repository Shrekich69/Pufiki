//Парсит юрл для названия группы
function getDomain(url) {

    if (url.startsWith("https://"))
        url = url.substring(8);
    else if (url.startsWith("http://"))
        url = url.substring(7);

    url = url.substring(0, url.indexOf('/'));
    
    return url;

}
async function getDomainFromId(groupId) {

    try {
        const tabs = await browser.tabs.query({ groupId: groupId });
        const domain = getDomain(tabs[0].url);

        return domain;
    } catch (error) {
        console.error("Can't parse a domain from url: ", error);
        return null;
    }

}

//Группирует одинаковые вкладки
async function groupTabs(domain) {

    const tabs = await browser.tabs.query({ currentWindow: true, status: "complete" });

    //Группирование вкладок
    for (const tab of tabs) {

        const storage = await browser.storage.local.get('excludedUrls');
        if ( 'excludedUrls' in storage ) {
            let exclUrl = false;

            for (const domain of storage.excludedUrls) {
                if ( getDomain(tab.url) === domain )
                    exclUrl = true;
            } if (exclUrl) continue;
        }
    
        let sameUrlTabs = new Array;

        let groupId = -1;
        let count = 0;

        for (const tab2 of tabs) {

            if (domain) {
                if ( getDomain(tab2.url) === domain ) {
                    count += 1;

                    sameUrlTabs.push(tab2.id);
                }
            } else {
                if ( getDomain(tab2.url) === getDomain(tab.url) ) {
                    count += 1;

                    if (tab2.groupId !== -1)
                        groupId = tab2.groupId;
                    else
                        sameUrlTabs.push(tab2.id);

                } else continue;
            }

        } if (count = 0) continue;
        

        if ( groupId !== -1 && sameUrlTabs.length > 0 )
            browser.tabs.group({
                groupId: groupId,
                tabIds: sameUrlTabs
            });
        else if ( sameUrlTabs.length > 1 ) {

            const newGroupId = await browser.tabs.group({ tabIds: sameUrlTabs });
            
            try {
                if (domain)
                    browser.tabGroups.update(newGroupId, { title: domain });
                else
                    browser.tabGroups.update(newGroupId,
                        { title: getDomain(tab.url) }
                    );
                groupId = newGroupId;
            } catch {}

            if ( domain !== '' ) {
                return newGroupId;
            }
        
        }
    }

}

//Разгруппировывает одиночные вкладки
async function ungroupIfOne(tabId) {

    const groups = await browser.tabGroups.query({});

    for (let group of groups) {
        const tabsInGroup = await browser.tabs.query({ groupId: group.id });

        const tabsToUngr = tabsInGroup.map( tab => tab.id );
        
        if (tabsInGroup.length < 2 && tabsInGroup !== 0) {
            browser.tabs.ungroup(tabsToUngr);
        }
    }

}

//Переключает группирование вкладок с одним юрл
async function toggleGrouping(domain, boolen, oldId) {

    try {
        let storage = await browser.storage.local.get('excludedUrls');

        if (!boolen) {

            if ('excludedUrls' in storage && !storage.excludedUrls.includes(domain)) {
                storage.excludedUrls.push(domain);
                browser.storage.local.set({ excludedUrls: storage.excludedUrls });
            } else if (!('excludedUrls' in storage)) {
                browser.storage.local.set({ excludedUrls: [domain] });
            }

            let tabsToUngr = await browser.tabs.query({ groupId: oldId });
            tabsToUngr = tabsToUngr.map( tab => tab.id );
            browser.tabs.ungroup(tabsToUngr);

        } else {

            storage.excludedUrls.pop(domain);
            browser.storage.local.set({ excludedUrls: storage.excludedUrls })

            const newId = await groupTabs(domain);

            return newId;
            
        }

    } catch (error) {
        console.error("Can't change urls array: ", error);
        return -1;
    }

}