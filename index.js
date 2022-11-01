require('dotenv').config();
const Client = require('mppclone-client');
const Cmapi = require('mppclone-cmapi');
const fs = require('fs');
const path = require('path');

let cl = new Client('wss://mppclone.com:8443', process.env.MPPCLONE_TOKEN);
let cmapi = new Cmapi(cl);

let knownUsers = [];

function userIsKnown(id) {
    return knownUsers.indexOf(id) !== -1;
}

function addKnownUser(id) {
    if (!userIsKnown(id)) knownUsers.push(id);
}

function removeKnownUser(id) {
    if (userIsKnown(id)) knownUsers.splice(knownUsers.indexOf(id), 1);
}

let accounts;

try {
    accounts = require('./accounts');
} catch (err) {
    accounts = {};
    saveAccounts();
}

function createAccount(id) {
    let acc = {
        id: id,
        bal: 500
    }

    accounts[id] = acc;
}

function saveAccounts() {
    fs.writeFileSync(path.resolve(__dirname, 'accounts.json'), JSON.stringify(accounts, undefined, 4));
}

function getAccount(id) {
    return accounts[id];
}

cl.start();
cl.setChannel('✧𝓓𝓔𝓥 𝓡𝓸𝓸𝓶✧');

cl.on('hi', msg => {
    console.log('Connected');

    if (msg.u.name !== 'cmapi test') {
        cl.sendArray([{ m: 'userset', set: { name: 'cmapi test' } }]);
    }
});

cmapi.on('?cmapi_info', msg => {
    cmapi.sendArray([{
        m: '?test_hi'
    }], { mode: 'id', id: msg._original_sender, global: false });
});

cmapi.on('test_hi', msg => {
    // now we know that user is running script
    console.log(msg);
    addKnownUser(msg._original_sender);
    console.log(knownUsers);

    let acc;

    while (!acc) {
        createAccount(msg._original_sender);
        acc = getAccount(msg._original_sender);
    }

    cmapi.sendArray([{ m: 'test_balance', bal: acc.bal }], { mode: 'id', id: msg._original_sender, global: false });
});

cl.on('participant removed', p => {
    // user left, possibly still subscribed
    if (userIsKnown(p.id)) removeKnownUser(id);
});

cmapi.on('test_start_working', msg => {
    cl.sendArray([{}])
});

