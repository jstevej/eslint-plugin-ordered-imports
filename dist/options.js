"use strict";
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.Options = void 0;
/** The rule options. */
var Options = /** @class */ (function () {
    function Options(input) {
        var _a, _b, _c;
        this.symbolsFirst = (_a = input["symbols-first"]) !== null && _a !== void 0 ? _a : true;
        var declarationOrdering = input["declaration-ordering"];
        if (declarationOrdering) {
            if (declarationOrdering[0] === "name") {
                var ordering = declarationOrdering[1];
                this.declarationOrdering = { kind: "name", ordering: ordering };
            }
            else if (declarationOrdering[0] === "source") {
                var ordering = declarationOrdering[1];
                this.declarationOrdering = { kind: "source", ordering: ordering };
            }
            else if (declarationOrdering[0] === "type") {
                var _d = declarationOrdering[1], ordering = _d.ordering, secondaryOrdering = _d.secondaryOrdering;
                var secondary = void 0;
                if (secondaryOrdering) {
                    if (secondaryOrdering[0] === "name") {
                        secondary = { kind: "name", ordering: secondaryOrdering[1] };
                    }
                    else if (secondaryOrdering[0] === "source") {
                        secondary = { kind: "source", ordering: secondaryOrdering[1] };
                    }
                }
                else {
                    secondary = { kind: "source", ordering: "lowercase-last" };
                }
                this.declarationOrdering = {
                    kind: "type",
                    ordering: ordering || ["side-effect", "default", "namespace", "destructured"],
                    secondaryOrdering: secondary,
                };
            }
        }
        else {
            this.declarationOrdering = { kind: "source", ordering: "lowercase-last" };
        }
        this.specifierOrdering = input["specifier-ordering"] || "lowercase-last";
        this.groupOrdering = (_b = input["group-ordering"]) === null || _b === void 0 ? void 0 : _b.map(function (g) { return ({
            name: g.name,
            match: new RegExp(g.match),
            order: g.order,
        }); });
        (_c = this.groupOrdering) === null || _c === void 0 ? void 0 : _c.push({
            name: "fallback",
            match: /.*/,
            order: Number.MAX_SAFE_INTEGER,
        });
    }
    return Options;
}());
exports.Options = Options;
