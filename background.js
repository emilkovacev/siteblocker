'use strict'


const unblocked = [
    new RegExp('^https?://github.com/makeopensource/?.*')
]

const blocked = [
    new RegExp('^https?://github.com/?.*$')
]

chrome.webNavigation.onCommitted.addListener((details) => {
    const url = details.url;
    for (let ws of unblocked) {
        if (url.match(ws)) {
            console.log(`allowed ${url}`);
            return;
        }
    }

    for (let ws of blocked) {
        if (url.match(ws)) {
            chrome.tabs.update({url: "./redirect.html"});
            console.log(`blocked ${url}`);
            return;
        }
    }
    console.log(`allowed ${url}`);
});
