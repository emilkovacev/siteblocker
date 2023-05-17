'use strict'


const unblocked = []

// detect whether a site should be blocked
function scan_url(details) {
    const url = details.url;
 
    chrome.storage.sync.get(["unblocked"], function (results) {
        for (let regex of results.unblocked) {
            if (url.match(regex)) {
                console.log(`allowed ${url}`);
                return;
            }
        }
    });

    chrome.storage.sync.get(["blocked"], function (results) {
        for (let b of results.blocked) {
            const regex = new RegExp(b);
            if (details.parentFrameId != -1) return;

            if (!url.startsWith('chrome://') && url.match(regex)) {
                chrome.tabs.update({url: chrome.runtime.getURL("redirect.html")});
                console.log(`blocked ${url}`);
                return;
            }
        }
        console.log(`allowed ${url}`);
    });
}

chrome.webNavigation.onBeforeNavigate.addListener(scan_url);
