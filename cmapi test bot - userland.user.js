// ==UserScript==
// @name         cmapi test bot - userland
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://mppclone.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mppclone.com
// @grant        none
// @require      https://unpkg.com/mppclone-cmapi@latest/dist/cmapi.dist.js
// ==/UserScript==

MPP.cmapi = new cmapi(MPP.client);
let server = 'a2516b4d88f22b45056f270b';

$("body").prepend($(`<div id="test-balance">Not Connected</div>`));

$('#test-balance').css({
    position: 'absolute',
    bottom: '10vh',
    right: '5vh',
    'font-weight': '800',
    'font-size': '20px',
    'z-index': '901'
});

$('body').prepend($(`<div id="test-job-work" class="ugly-button">Work</div>`));

$('#test-job-work').css({
    position: 'absolute',
    bottom: '12.5vh',
    right: '5vh',
    'z-index': '901'
});

$('#test-job-work').on('click', evt => {
    MPP.cmapi.sendArray([{ m: 'test_start_working' }], { mode: 'id', id: server, global: false });
});

MPP.cmapi.on("?test_hi", msg => {
    if (msg._original_sender !== server) return;
    MPP.cmapi.sendArray([{ m: "test_hi" }], { mode: "id", id: msg._original_sender, global: false });
});

function formatBalance(bal) {
    return `$${bal.toFixed(2)}`;
}

MPP.cmapi.on('test_balance', msg => {
    console.log(msg);
    if (msg._original_sender !== server) return;
    $('#test-balance').text('Money: ' + formatBalance(msg.bal));
});
