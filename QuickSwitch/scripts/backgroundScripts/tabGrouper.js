async function groupTabs() {
    await browser.tabs.query({ currentWindow: true, status: "complete" }, async (tabs) => {

        //Парсит юрл для названия группы
        function getDomain(url) {
            if (url.startsWith("https://")) url = url.substring(8);
            else if (url.startsWith("http://")) url = url.substring(7);

            url = url.substring(0, url.indexOf('/'));
            
            return url;
        }

        //Группирование вкладок
        for (const tab of tabs) {
            if (tab.url === "about:firefoxview") {
                browser.tabs.remove(tab.id);
                continue;
            }

            let sameUrlTabs = new Array;

            let groupId = -1;
            let count = 0;
            for (let sTab of tabs) {
                if (getDomain(sTab.url) === getDomain(tab.url)) {
                    count += 1;
                    if (sTab.groupId !== -1)
                        groupId = sTab.groupId;
                    else
                        sameUrlTabs.push(sTab.id);
                } else continue;
            }
            if (count = 0) break;

            if (groupId !== -1 && sameUrlTabs.length > 0)
                await browser.tabs.group({
                    groupId: groupId,
                    tabIds: sameUrlTabs
                });
            else if (sameUrlTabs.length > 1)
                await browser.tabs.group({
                    tabIds: sameUrlTabs
                }).then( async (groupId) => {
                    try {
                        await browser.tabGroups.update(groupId,
                            { title: getDomain(tab.url) }
                        );
                    } catch {}
                });
        }
    });
}

async function ungroupIfOne(Id) {
    await browser.tabGroups.query({}, async (groups) => {
        for (const group of groups) {
            await browser.tabs.query({ groupId: group.id }, async (tabs) => {
                let tabIds = tabs.map(tab => tab.id);
                if (tabIds.length <= 1)
                    await browser.tabs.ungroup(tabIds);
                return;
            });
        }
    });
}