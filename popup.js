function storeConfig() {
    console.log("Hello world!");

    const config = document.getElementById("configFile");
    console.log(config);
    chrome.storage.sync.set({"config_url": config});
}


const button = document.getElementById("submit")
button.addEventListener("click", storeConfig);