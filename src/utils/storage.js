const defaults = require('../settings.json');
const electron = require('electron');
const path = require('path');
const fs = require('fs');
const ldSet = require('lodash/set');
const ldGet = require('lodash/get');

class Storage {
    constructor() {
        const userDataPath = (electron.app || electron.remote.app).getPath('userData');
        this.path = path.join(userDataPath, 'settings.json');
        this.settings = this.read(this.path);
    }

    set(key, val) {
        ldSet(this.settings, key, val);
        this.write()
    }

    get(key) {
        return ldGet(this.settings, key);
    }

    getAll() {
        return this.settings;
    }

    read = () => {
        try {
            return JSON.parse(fs.readFileSync(this.path));
        } catch (err) {
            return defaults;
        }
    }

    write = () => {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.settings));
        } catch(err) {
            console.error(err);
        }
    }
}

module.exports = Storage;