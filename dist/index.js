"use strict";
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
var rule_1 = require("./rule");
module.exports = {
    rules: { "ordered-imports": rule_1.rule },
    configs: {
        recommended: {
            plugins: ["ordered-imports"],
            rules: {
                "ordered-imports/ordered-imports": [
                    "error",
                    {
                        "declaration-ordering": [
                            "type",
                            {
                                ordering: ["side-effect", "default", "namespace", "destructured"],
                                secondaryOrdering: ["name", "lowercase-last"],
                            },
                        ],
                        "specifier-ordering": "lowercase-last",
                        "group-ordering": [
                            { name: "project root", match: "^@", order: 20 },
                            { name: "parent directories", match: "^\\.\\.", order: 30 },
                            { name: "current directory", match: "^\\.", order: 40 },
                            { name: "third-party", match: ".*", order: 10 },
                        ],
                    },
                ],
            },
        },
    },
};
