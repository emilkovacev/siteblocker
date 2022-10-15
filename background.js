'use strict'


const unblocked = []

const blocked = [
    new RegExp('youtube.com'),
    new RegExp('discord.com'),
    new RegExp('twitch.tv'),
    new RegExp('reddit.com'),
    new RegExp('twitter.com'),
    new RegExp('stackoverflow.com')
]

// detect whether a site should be blocked
function scan_url(details) {
    chrome.storage.sync.get(["blocked"], function (results) {
        const url = details.url;
        const tabId = details.tabId;
        for (let regex of unblocked) {
            if (url.match(regex)) {
                console.log(`allowed ${url}`);
                return;
            }
        }

        for (let b of results.blocked) {
            const regex = new RegExp(b);
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
