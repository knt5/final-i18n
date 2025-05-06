"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTranslation = useTranslation;
exports.getT = getT;
var react_1 = require("react");
var store_1 = require("./store");
var PATTERN = /(\{\{.+?\}\})/;
function useTranslation(translations) {
    var locale = (0, store_1.getLocale)();
    var flattenTranslation = (0, react_1.useMemo)(function () { return flat({ translation: locale ? translations[locale] : undefined }); }, [locale, translations]);
    var t = (0, react_1.useCallback)(createT(flattenTranslation), [flattenTranslation]);
    return { t: t, locale: locale };
}
/** Not recommended. Use useTranslation() instead. */
function getT(translations) {
    var locale = (0, store_1.getLocale)();
    var flattenTranslation = flat({
        translation: locale ? translations[locale] : undefined,
    });
    var t = createT(flattenTranslation);
    return { t: t, locale: locale };
}
function createT(flattenTranslation) {
    function t(key, params) {
        var value = flattenTranslation[key];
        if (!value) {
            return key;
        }
        if (!params) {
            return value;
        }
        return render({ key: key, value: value, params: params });
    }
    return t;
}
function flat(_a) {
    var translation = _a.translation, _b = _a.prefix, prefix = _b === void 0 ? '' : _b;
    var flatten = {};
    if (!translation) {
        return flatten;
    }
    Object.entries(translation).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        var flattenKey = "".concat(prefix).concat(key);
        if (typeof value === 'string') {
            flatten[flattenKey] = value;
        }
        else {
            Object.entries(flat({ translation: value, prefix: "".concat(flattenKey, ".") })).forEach(function (_a) {
                var key = _a[0], value = _a[1];
                flatten[key] = value;
            });
        }
    });
    return flatten;
}
function render(_a) {
    var key = _a.key, value = _a.value, params = _a.params;
    var stringOnly = true;
    var nodeList = value.split(PATTERN).filter(function (node) { return node; });
    var elementList = nodeList.map(function (node) {
        if (!node.startsWith('{{') || !node.endsWith('}}')) {
            return node;
        }
        var paramKey = node.replace('{{', '').replace('}}', '').trim();
        var paramValue = params[paramKey];
        if (!paramValue) {
            return node;
        }
        if (typeof paramValue !== 'string') {
            stringOnly = false;
        }
        return (0, react_1.isValidElement)(paramValue)
            ? (0, react_1.cloneElement)(paramValue, { key: "".concat(key, "\t").concat(node) })
            : paramValue;
    });
    return stringOnly ? elementList.join('') : elementList;
}
