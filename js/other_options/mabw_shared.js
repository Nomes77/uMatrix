'use strict'

//  runtime.getManifest
//  https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/getManifest
//  Get the complete manifest.json file, serialized to a JSON object.
const version = browser.runtime.getManifest().version

//  The function that handles maximizing all of the browser's windows.
function maximize_all_windows () {
  //  windows.getAll
  //  https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/getAll
  //  Gets information about all open windows, passing them into a callback.
  browser.windows
    .getAll({ windowTypes: ['normal', 'popup', 'panel', 'devtools'] })
    .then(maximize_all)
    .then(minimize_necessary)
    .then(bring_back_focus)
}
// function maximize_normal () {
//   browser.windows
//     .getAll({ windowTypes: ['normal'] })
//     .then(maximize_all)
//     .then(minimize_necessary)
//     .then(bring_back_focus)
// }
// function maximize_popup () {
//   browser.windows
//     .getAll({ windowTypes: ['popup'] })
//     .then(maximize_all)
//     .then(minimize_necessary)
//     .then(bring_back_focus)
// }
// function maximize_panel () {
//   browser.windows
//     .getAll({ windowTypes: ['panel'] })
//     .then(maximize_all)
//     .then(minimize_necessary)
//     .then(bring_back_focus)
// }
// function maximize_devtools () {
//   browser.windows
//     .getAll({ windowTypes: ['devtools'] })
//     .then(maximize_all)
//     .then(minimize_necessary)
//     .then(bring_back_focus)
// }

//  Each of these functions acts like part of a stream. No matter what happens, they return the
//  arguments they receive without changing them. By doing this, it becomes very easy to chain
//  multiple functions together that alter the environment, but not the arguments.
function maximize_all (windows) {
  return new Promise(function (resolve) {
    return Promise.all(
      windows.filter(window => window.state !== 'maximized').map(maximize)
    )
      .then(() => resolve(windows))
      .catch(() => resolve(windows))
  })
}
function minimize_necessary (windows) {
  return new Promise(function (resolve) {
    return browser.storage.local
      .get('minimize-after-action')
      .then(result => {
        if (result['minimize-after-action'] === true) {
          return Promise.all(
            windows
              .filter(window => window.state === 'minimized')
              .map(minimize)
          ).then(() => resolve(windows))
        }
      })
      .catch(() => resolve(windows))
  })
}

//  bring the previously focused window back into focus
function bring_back_focus (windows) {
  return new Promise(function (resolve) {
    return Promise.all(
      windows
        .filter(window => window.focused)
        .map(window =>
          browser.windows
            .update(window.id, { focused: true })
        )
    )
      .then(() => resolve(windows))
      .catch(() => resolve(windows))
  })
}

//  browser.windows.update(windowId, updateInfo)
//  https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/update
//  Updates the properties of a window. Use this to move, resize, and (un)focus a window, etc.
//
//  return value -> A Promise that will be fulfilled with a windows.Window object containing
//                  the details of the updated window. If any error occurs, the promise will be
//                  rejected with an error message.
//
//  updateInfo: object
//  {
//    state: string -> The new state of the window. One of the following:
//    {
//      "normal"
//      "minimized"
//      "maximized"
//      "fullscreen"
//      "docked" (deprecated)
//    }
//  }
function maximize (window) {
  return browser.windows
    .update(window.id, {
      state: 'maximized'
    })
}
function minimize (window) {
  return browser.windows
    .update(window.id, {
      state: 'minimized'
    })
}
