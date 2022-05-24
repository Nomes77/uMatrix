chrome.commands.onCommand.addListener(function(command) {
  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    browser.tabs.duplicate(tabs[0].id);
    })
});
