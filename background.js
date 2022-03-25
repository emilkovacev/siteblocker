'use strict'


const unblocked = [
    new RegExp('^https?://github.com/makeopensource/?.*')
]

const blocked = [
    new RegExp('^https?://github.com/?.*')
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
            chrome.scripting.executeScript({
                target: {tabId: tabId}, 
                func: setup_redirect,
                args: [url, unblocked_serialized],
            });
            console.log(`blocked ${url}`);
            return;
        }
    }
    console.log(`allowed ${url}`);
}


function setup_redirect(url, unblocked) {
    let content = document.documentElement;

    content.innerHTML = `<p>${url} is blocked</p>`;

    content.innerHTML += '<h1>Allowed pages</h1>';
    content.innerHTML += '<ul>';

    for (let regex of unblocked) {
        content.innerHTML += `<li>${regex}</li>`; 
    }
    content.innerHTML += '</ul>';
}

chrome.webNavigation.onCommitted.addListener(scan_url);
