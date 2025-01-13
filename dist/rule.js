"use strict";
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
exports.sort = sort;
var options_1 = require("./options");
var ordering_1 = require("./ordering");
function getSchema() {
    var schema = require("../input.json");
    delete schema["$schema"];
    return schema;
}
/** The `"ordered-imports"` rule. */
exports.rule = {
    meta: {
        type: "layout",
        fixable: "code",
        schema: getSchema(),
    },
    create: function (context) {
        var _a;
        var options = new options_1.Options((_a = context.options[0]) !== null && _a !== void 0 ? _a : {});
        var groups = [];
        return {
            Program: function (node) { return (groups = getGroups(node, options)); },
            "Program:exit": function () { return checkGroups(context, options, groups); },
        };
    },
};
/** Returns the import groups in the supplied program. */
function getGroups(program, options) {
    var groups = [];
    var imports = [];
    for (var _i = 0, _a = program.body.filter(function (n) { return n.type === "ImportDeclaration"; }); _i < _a.length; _i++) {
        var node = _a[_i];
        var next = new Import(node, options);
        if (imports.length === 0 || imports[imports.length - 1].isAdjacent(next)) {
            imports.push(next);
        }
        else {
            groups.push(new ImportGroup(imports));
            imports = [next];
        }
    }
    if (imports.length !== 0) {
        groups.push(new ImportGroup(imports));
    }
    return groups;
}
/** Checks the members and ordering in the supplied import groups. */
function checkGroups(context, options, groups) {
    if (options.groupOrdering) {
        var source_1 = context.getSourceCode();
        reorder(context, groups, function (g) { var _a, _b; return (_b = (_a = g.group) === null || _a === void 0 ? void 0 : _a.order) !== null && _b !== void 0 ? _b : Number.MAX_SAFE_INTEGER; }, function (g) { return [
            source_1.getIndexFromLoc(g.imports[0].declaration.loc.start),
            source_1.getIndexFromLoc(g.imports[g.imports.length - 1].declaration.loc.end),
        ]; }, "unordered import group");
        var seen = new Set();
        for (var _i = 0, groups_1 = groups; _i < groups_1.length; _i++) {
            var group = groups_1[_i];
            if (seen.has(group.group)) {
                context.report({
                    loc: group.loc,
                    message: "unmerged import group",
                });
            }
            else {
                seen.add(group.group);
            }
        }
    }
    for (var _a = 0, groups_2 = groups; _a < groups_2.length; _a++) {
        var group = groups_2[_a];
        group.checkMembers(context);
        group.checkDeclarations(context, options);
        for (var _b = 0, _c = group.imports; _b < _c.length; _b++) {
            var import_ = _c[_b];
            import_.checkSpecifiers(context, options);
        }
    }
}
/** An import declaration. */
var Import = /** @class */ (function () {
    function Import(declaration, options) {
        var _a;
        this.declaration = declaration;
        var source = declaration.source.value;
        this.group = (_a = options.groupOrdering) === null || _a === void 0 ? void 0 : _a.find(function (g) { return g.match.test(source); });
    }
    /** Returns whether this import and the supplied import are adjacent. */
    Import.prototype.isAdjacent = function (other) {
        var endLine = this.declaration.loc.end.line;
        var startLine = other.declaration.loc.start.line;
        return endLine + 1 >= startLine;
    };
    /** Checks the ordering of the import specifiers in this import. */
    Import.prototype.checkSpecifiers = function (context, options) {
        reorder(context, this.declaration.specifiers.filter(function (s) { return s.type === "ImportSpecifier"; }), function (s) {
            return (0, ordering_1.getNameKey)(s.imported.type === "Identifier" ? s.imported.name : String(s.imported.value), options.specifierOrdering, options.symbolsFirst);
        }, function (s) { return s.range; }, "unordered import specifier");
    };
    return Import;
}());
/** A group of adjacent import declarations. */
var ImportGroup = /** @class */ (function () {
    function ImportGroup(imports) {
        this.imports = imports;
    }
    Object.defineProperty(ImportGroup.prototype, "group", {
        get: function () {
            return this.imports[0].group;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImportGroup.prototype, "loc", {
        get: function () {
            var start = this.imports[0].declaration.loc.start;
            var end = this.imports[this.imports.length - 1].declaration.loc.end;
            return { start: start, end: end };
        },
        enumerable: false,
        configurable: true
    });
    /** Checks that the members of this group belong in this group. */
    ImportGroup.prototype.checkMembers = function (context) {
        if (this.group) {
            for (var _i = 0, _a = this.imports.slice(1); _i < _a.length; _i++) {
                var import_ = _a[_i];
                if (import_.group !== this.group) {
                    context.report({
                        loc: import_.declaration.loc,
                        message: "invalid import group member",
                    });
                }
            }
        }
    };
    /** Checks the ordering of the import declarations in this group. */
    ImportGroup.prototype.checkDeclarations = function (context, options) {
        if (!options.declarationOrdering) {
            return;
        }
        // Filter out the side-effect and destructed import declarations for the name ordering.
        var declarations = this.imports.map(function (i) { return i.declaration; });
        if (options.declarationOrdering.kind === "name") {
            declarations = declarations.filter(function (d) {
                var type = (0, ordering_1.getType)(d);
                return type === "default" || type === "namespace";
            });
        }
        reorder(context, declarations, function (s) { return getDeclarationKey(s, options.declarationOrdering, options.symbolsFirst); }, function (s) { return s.range; }, "unordered import declaration");
    };
    return ImportGroup;
}());
/** Returns a key to sort the supplied import declaration in the supplied ordering. */
function getDeclarationKey(declaration, ordering, symbolsFirst) {
    var _a, _b, _c;
    var name = (_a = declaration.specifiers.map(function (d) { return d.local.name; }).find(function (n) { return n; })) !== null && _a !== void 0 ? _a : "";
    var source = (_c = (_b = declaration.source.value) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : "";
    switch (ordering.kind) {
        case "name":
            return (0, ordering_1.getNameKey)(name, ordering.ordering, symbolsFirst);
        case "source":
            return (0, ordering_1.getSourceKey)(source, ordering.ordering, symbolsFirst);
        case "type":
            var primary = (0, ordering_1.getTypeKey)(declaration, ordering.ordering);
            var secondary = "";
            if (ordering.secondaryOrdering) {
                if (ordering.secondaryOrdering.kind === "name") {
                    var type = (0, ordering_1.getType)(declaration);
                    if (type === "default" || type === "namespace") {
                        secondary = (0, ordering_1.getNameKey)(name, ordering.secondaryOrdering.ordering, symbolsFirst);
                    }
                    else {
                        secondary = "";
                    }
                }
                else {
                    secondary = (0, ordering_1.getSourceKey)(source, ordering.secondaryOrdering.ordering, symbolsFirst);
                }
            }
            return "".concat(primary, ":").concat(secondary);
    }
}
/** Reorders a list of values with AST ranges to be in a particular order. */
function reorder(context, values, key, range, message) {
    // Get the original order of the values.
    var original = values.map(function (v, i) { return ({ index: i, value: v }); });
    // Get the sorted order of the values.
    var sorted = sort(original, function (p) { return key(p.value); });
    var _loop_1 = function (i) {
        var _a;
        if (sorted[i].index !== i) {
            var _b = range(original[i].value), start = _b[0], end = _b[1];
            var destination = {
                start: context.getSourceCode().getLocFromIndex(start),
                end: context.getSourceCode().getLocFromIndex(end),
            };
            var replacement_1 = (_a = context
                .getSourceCode()
                .getText())
                .substring.apply(_a, range(sorted[i].value));
            context.report({
                loc: destination,
                message: message,
                fix: function (f) { return f.replaceTextRange(range(original[i].value), replacement_1); },
            });
        }
    };
    // Replace any unsorted values with the sorted value for that index.
    for (var i = 0; i < original.length; ++i) {
        _loop_1(i);
    }
}
/** Returns a sorted copy of the supplied import values using the supplied key mapper. */
function sort(values, key) {
    return values.slice().sort(function (a, b) {
        var aKey = key(a);
        var bKey = key(b);
        if (aKey > bKey) {
            return 1;
        }
        else if (aKey < bKey) {
            return -1;
        }
        else {
            return 0;
        }
    });
}
