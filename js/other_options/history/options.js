/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const $ = document.getElementById.bind(document);
const logError = console.exception.bind(console);

const saveOptions = () => {
    const domains = $("domains").value.split(/\s*,\s*/).filter(v => !!v);
    $("domains").value = domains.join(", ");

    const mode = $("mode").value;

    browser.storage.local.set({ domains, mode }).then(() => {
        console.info("Settings saved", { domains, mode });
        $("status").textContent = "Settings saved!";
        setTimeout(() => { $("status").textContent = ""; }, 750);
    }).catch(logError);
};

const restoreOptions = () => {
    browser.storage.local.get({ domains: [], mode: "blacklist" }).then(({ domains, mode }) => {
        $("domains").value = domains.filter(v => !!v).join(", ");
        $("mode").value = mode;
    }).catch(logError);
};

document.addEventListener("DOMContentLoaded", restoreOptions);

$("save").addEventListener("click", saveOptions);




/* Keyword script */

function onError(error) {
    console.log(error);
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function storeKeywords() {
    browser.storage.local.get('keywords')
        .then(existing_kw => {
            const old_kw = existing_kw.keywords || [];

            const keywords_input = document.getElementById('keywords');
            var keywords_list = keywords_input.value.split(/\s+/);

            if (isEmpty(keywords_list[0])) { 
                keywords_list = old_kw;
            } else {
                keywords_list = [...new Set([...old_kw, ...keywords_list])];
            }

            if (keywords_list.length > 0 && !isEmpty(keywords_list[0])) {
                browser.storage.local
                    .set({keywords: keywords_list})
                    .catch(onError);
            }

            if (document.getElementById('content').style.display === "block") {
                renderLI(keywords_list);
            }

            keywords_input.value = '';
        }).catch(onError);
}

function deleteKeyword(kw) {
    browser.storage.local.get('keywords')
        .then(item => {
            const keywords = item.keywords;
            keywords.forEach((el, index) => {
                if (el === kw) {
                    keywords.splice(index, 1);
                }
            })
            renderLI(keywords);
            browser.storage.local
                .set({keywords: keywords});
        }).catch(onError);
}

function renderLI(elements) {
    const list = document.getElementById('list');
    list.innerText = '';

    elements.forEach(el => {
        const li = document.createElement('li');
        const delete_btn = document.createElement('div');

        delete_btn.innerText = '×';
        delete_btn.addEventListener('click', () => {
            deleteKeyword(el);
        });
        delete_btn.className = 'del-button';
        delete_btn.setAttribute('title', `Delete keyword ${el}`)

        li.innerText = el;
        li.appendChild(delete_btn);
        li.className = 'li-button';

        list.appendChild(li);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('button');

    button.addEventListener('click', storeKeywords);

    const collapsible = document.getElementById('collapsible');

    collapsible.addEventListener('click', () => {
        browser.storage.local
            .get('keywords')
            .then((item) => {
                const keywords = item.keywords;
                const content = document.getElementById('content');

                collapsible.classList.toggle("active");
            
                if (content.style.maxHeight) {
                    document.getElementById('list').innerText = '';
                    content.style.maxHeight = null;
                } else {
                    renderLI(keywords);
                    content.style.maxHeight = content.scrollHeight + "px";
                } 
            }).catch(onError);
    });
});
