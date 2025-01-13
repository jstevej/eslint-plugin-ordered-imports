"use strict";
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNameKey = getNameKey;
exports.getSourceKey = getSourceKey;
exports.getType = getType;
exports.getTypeKey = getTypeKey;
/** Returns a key to sort the supplied import name in the supplied ordering. */
function getNameKey(name, ordering, symbolsFirst) {
    // Sort names that start with symbols before other names (if requested).
    if (symbolsFirst && !!name.match(/^[_$]/)) {
        name = "\0".concat(name);
    }
    switch (ordering) {
        case "case-insensitive":
            return name.toUpperCase();
        case "lowercase-last":
            return name;
        case "any":
            return "";
    }
}
/** Returns a key to sort the supplied import source in the supplied ordering. */
function getSourceKey(source, ordering, symbolsFirst) {
    var high = source[0] === "." || source[0] === "/" ? 1 : 0;
    var key = getNameKey(source, ordering, symbolsFirst);
    return "".concat(high).concat(key);
}
/** Returns the type of the supplied import declaration. */
function getType(declaration) {
    if (declaration.specifiers.length === 0) {
        return "side-effect";
    }
    switch (declaration.specifiers[0].type) {
        case "ImportDefaultSpecifier":
            return "default";
        case "ImportNamespaceSpecifier":
            return "namespace";
        case "ImportSpecifier":
            return "destructured";
    }
}
/** Returns a key to sort the supplied import declaration in the supplied ordering. */
function getTypeKey(declaration, ordering) {
    return ordering.indexOf(getType(declaration)).toString();
}
