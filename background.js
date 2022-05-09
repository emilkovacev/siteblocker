'use strict'


const unblocked = [
]

const blocked = [
        new RegExp('^https?://.*youtube.com.*'),
        new RegExp('^https?://.*discord.com.*'),
        new RegExp('^https?://.*twitch.tv.*'),
        new RegExp('^https?://.*reddit.com.*'),
        new RegExp('^https?://.*twitter.com.*'),
        new RegExp('^https?://.*stackoverflow.com.*')
]

// detect whether a site should be blocked
function scan_url(details) {
        const url = details.url;
        const tabId = details.tabId;
        for (let regex of unblocked) {
                if (url.match(regex)) {
                        console.log(`allowed ${url}`);
                        return;
                }
        }

        for (let regex of blocked) {
                if (!url.startsWith('chrome://') && url.match(regex)) {
                        let unblocked_serialized = unblocked.map(_ => _.toString());
                        chrome.tabs.update({url: chrome.runtime.getURL("redirect.html")});
                        console.log(`blocked ${url}`);
                        return;
                }
        }
        console.log(`allowed ${url}`);
}

chrome.webNavigation.onBeforeNavigate.addListener(scan_url);
