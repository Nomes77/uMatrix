'use strict'

browser.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    browser.storage.local
      .set({
        'no-history': false
      })
  }
});

chrome.history.onVisited.addListener(function(historyItem) {
  browser.storage.local
    .get('no-history')
    .then(results => {
      if (results['no-history'] === true) {
        chrome.history.deleteUrl({ "url": historyItem.url });
      }
    })
});

chrome.commands.onCommand.addListener(function(command) {
  if (command == "no-history") {
    browser.storage.local
      .set({
        'no-history': true
      })
  }
  else if (command == "history") {
    browser.storage.local
      .set({
        'no-history': false
      })
  }
});