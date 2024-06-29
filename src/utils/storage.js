const electron = require('electron');
const path = require('path');
const fs = require('fs');
const ldSet = require('lodash/set');
const ldGet = require('lodash/get');
const ldUnset = require('lodash/unset');

class Storage {
  #path;
  #defaults;
  #settings;
  
  constructor(name, defaults = {}) {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    this.#path = path.join(userDataPath, `${name}.json`);
    this.#defaults = defaults;
    this.#settings = this.#read(this.#path);
  }

  get(key) {
    return ldGet(this.#settings, key);
  }

  get getAll() {
    return () => this.#read();
  }

  restoreDefaults() {
    this.#reset();
  }

  set(key, val) {
    ldSet(this.#settings, key, val);
    this.#write()
  }

  unset(key) {
    ldUnset(this.#settings, key);
    this.#write();
  }

  #read = () => {
    try {
      return JSON.parse(fs.readFileSync(this.#path));
    } catch (err) {
      return this.#defaults;
    }
  }

  #reset = () => {
    this.#settings = JSON.parse(JSON.stringify(this.#defaults));
    this.#write();
  }

  #write = () => {
    try {
      fs.writeFileSync(this.#path, JSON.stringify(this.#settings));
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = Storage;