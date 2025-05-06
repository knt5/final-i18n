"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = init;
exports.getLocale = getLocale;
exports.setLocale = setLocale;
exports.isInitialized = isInitialized;
var store = { initialized: false };
function init(_a) {
    var locale = _a.locale;
    store.initialized = true;
    setLocale(locale);
}
function getLocale() {
    return store.locale;
}
function setLocale(locale) {
    store.locale = locale;
}
function isInitialized() {
    return store.initialized;
}
