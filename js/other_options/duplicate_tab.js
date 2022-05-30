chrome.commands.onCommand.addListener(function(command) {
  if (command == "duplicate-tab") {

    /*
    chrome.tabs.query({ 
      currentWindow: true, active: true
    },
    (tabs) => {
      browser.tabs.duplicate(tabs[0].id);
    })
    */

    chrome.tabs.query({
      currentWindow: true,
      active: true,
    },
    function(tabs) {
      const tab = tabs[0];
      chrome.tabs.duplicate(tab.id);
    });
  }
});