 const button = document.getElementById("block-button");  // click button to block url
 const blocked_items = Array.from(document.getElementsByClassName("blocked-item"));  // array of blocked urls
 const url_input = document.getElementById("url-input");  // input for new blocked urls
 const block_status = document.getElementById("block-status");  // status message of blocked urls
 const blocked_list = document.getElementById("blocked");  // list of urls that are already blocked


// convert array of blocked urls to html string
function blocked_to_html(blocked) {
    const blocked_map = blocked.map((b) => {
        return `<div class="blocked-item">${b}</div>`
    })

    return blocked_map.join("")
}

// add blocked url to sync storage
function blockSite() {
    let text = url_input.value;
    if (text.length == 0) {
        return;
    }
 
    chrome.storage.sync.clear();
    chrome.storage.sync.get(["blocked"], function (results) {

        if (results.blocked == undefined) {
            results.blocked = [text]
            chrome.storage.sync.set({ "blocked": [text] })
        } else {
            results.blocked.push(text);
            chrome.storage.sync.set({ "blocked": results.blocked })
        }
        block_status.innerHTML = `<p>Blocked ${text}</p>`
        blocked_list.innerHTML = blocked_to_html(results.blocked)
    });
}

function loadSite() {
    chrome.storage.sync.get(["blocked"], function (results) {
        blocked_list.innerHTML = blocked_to_html(results.blocked)
    });
}

function removeBlocked(blocked) {
    let name = blocked.innerHTML;

    chrome.storage.sync.get(["blocked"], function (results) {
        if (results.blocked == undefined) {
            return
        } else {
            const new_blocked = results.blocked.filter((elem) => {
                return name != elem
            });
            chrome.storage.sync.set({ "blocked": new_blocked })
        }
        block_status.innerHTML = `<p>Unblocked ${name}</p>`
        blocked_list.innerHTML = blocked_to_html(new_blocked)
    });
}

document.addEventListener("DOMContentLoaded", loadSite)
button.addEventListener("click", blockSite)

blocked_list.addEventListener("change", () => {
    blocked_items.forEach((blocked_item) => (
        blocked_item.addEventListener("click", removeBlocked)
    ))
})

