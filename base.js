function insertResult(data) {
    toggleLoader(false);

    const resultDiv = document.getElementById('result');
    const divName = [];

    data.forEach(item => {
        if (! divName.includes(item.type)) {
            divName.push(item.type);
            const nameStream = document.createElement('div');
            nameStream.className = 'nameStream';
            nameStream.textContent = item.type.replace("_", " ");
            resultDiv.appendChild(nameStream);
        }
        const card = document.createElement('div');
        card.className = 'card';
        
        const link = document.createElement('a');
        link.href = item.link;
        link.target = "_blank"
        link.rel = "noopener noreferrer";
        

        const img = document.createElement('img');
        img.src = item.img;
        img.alt = item.name;

        const title = document.createElement('p');
        title.textContent = item.name;
        
        link.appendChild(img);
        link.appendChild(title);
        card.appendChild(link);
        resultDiv.appendChild(card);
    })
}
  
function clearDataResult() {
    localStorage.removeItem('prime-pagination');
    localStorage.removeItem('hbo-max-pagination');
}

chrome.runtime.onInstalled.addListener(reason => {
    if (reason.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        let thankYouPage = 'https://romulo126.github.io/My-Browser-Extensions/';
        chrome.tabs.create({ url: thankYouPage });
    }
    reloadTabs();
});
chrome.runtime.setUninstallURL("https://romulo126.github.io/My-Browser-Extensions/", () => {
    if (chrome.runtime.lastError) {
        console.error("Error setting uninstall URL:", chrome.runtime.lastError);
    }
});