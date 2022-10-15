 const button = document.getElementById("block-button");  // click button to block url
 const blocked_items = Array.from(document.getElementsByClassName("blocked-item"));  // array of blocked urls
 const url_input = document.getElementById("url-input");  // input for new blocked urls
 const block_status = document.getElementById("block-status");  // status message of blocked urls
 const blocked_list = document.getElementById("blocked");  // list of urls that are already blocked


// convert array of blocked urls to html string
function blocked_to_html(blocked) {
    blocked_list.innerHTML = ""  // clear blocked list

    // repopulate blocked list
    blocked.forEach((b) => {
        const node = document.createElement("div")
        const url = document.createTextNode(b)
        node.appendChild(url)
        node.className = "blocked-item"
        node.addEventListener("click", () => removeBlocked(node))
        blocked_list.appendChild(node)
    })
}

// add blocked url to sync storage
function blockSite() {
    let text = url_input.value;
    if (text.length == 0) {
        return;
    }
 
    chrome.storage.sync.get(["blocked"], function (results) {

        if (results.blocked == undefined) {
            results.blocked = [text]
            chrome.storage.sync.set({ "blocked": [text] })
        } 

        else if (text in results.blocked) {
            block_status.innerHTML = `<p>${text} already blocked!</p>`
        }

        else {
            results.blocked.push(text);
            chrome.storage.sync.set({ "blocked": results.blocked })
        }
        block_status.innerHTML = `<p>Blocked ${text}</p>`
        blocked_to_html(results.blocked)
        url_input.innerHTML = ""
    });
}

function loadSite() {
    chrome.storage.sync.get(["blocked"], function (results) {
        blocked_to_html(results.blocked)
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
            block_status.innerHTML = `<p>Unblocked ${name}</p>`
            blocked_to_html(new_blocked)
            loadSite()
        }
    });
}

document.addEventListener("DOMContentLoaded", loadSite)
button.addEventListener("click", blockSite)

blocked_list.addEventListener("change", () => {
    blocked_items.forEach((blocked_item) => (
        blocked_item.addEventListener("click", removeBlocked)
    ))
})

url_input.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        e.preventDefault()
        button.click()
    }
})
