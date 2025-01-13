"use strict";
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
var eslint_1 = require("eslint");
var rule_1 = require("./rule");
var groups = [
    { name: "parent directories", match: "^\\.\\.", order: 10 },
    { name: "current directory", match: "^\\.", order: 20 },
    { name: "third-party", match: ".*", order: 5 },
];
var tester = new eslint_1.RuleTester({
    languageOptions: {
        ecmaVersion: 6,
        sourceType: "module",
    },
});
tester.run("ordered-imports", rule_1.rule, {
    valid: [
        // "declaration-ordering": ["any"]
        {
            options: [{ "declaration-ordering": ["any"] }],
            code: "\nimport e from \"e\";\nimport { b, c, d } from \"bcd\";\nimport a from \"a\";\nimport _ from \"lodash\";\n      ",
        },
        // "declaration-ordering": ["name", ?]
        {
            options: [{ "declaration-ordering": ["name", "case-insensitive"] }],
            code: "\nimport _ from \"lodash\";\nimport a from \"e\";\nimport A from \"E\";\nimport { b, c, d } from \"bcd\";\nimport e from \"a\";\nimport E from \"A\";\n      ",
        },
        {
            options: [{ "declaration-ordering": ["name", "lowercase-last"] }],
            code: "\nimport _ from \"lodash\";\nimport A from \"E\";\nimport E from \"A\";\nimport { b, c, d } from \"bcd\";\nimport a from \"e\";\nimport e from \"a\";\n      ",
        },
        // "symbols-first": false
        // "declaration-ordering": ["name", ?]
        {
            options: [{ "symbols-first": false, "declaration-ordering": ["name", "case-insensitive"] }],
            code: "\nimport a from \"e\";\nimport A from \"E\";\nimport { b, c, d } from \"bcd\";\nimport e from \"a\";\nimport E from \"A\";\nimport _ from \"lodash\";\n      ",
        },
        {
            options: [{ "symbols-first": false, "declaration-ordering": ["name", "lowercase-last"] }],
            code: "\nimport A from \"E\";\nimport E from \"A\";\nimport { b, c, d } from \"bcd\";\nimport _ from \"lodash\";\nimport a from \"e\";\nimport e from \"a\";\n      ",
        },
        // "declaration-ordering": ["source", ?]
        {
            options: [{ "declaration-ordering": ["source", "case-insensitive"] }],
            code: "\nimport * as A from \"A\";\nimport b from \"b\";\nimport \"C\";\nimport { d } from \"d\";\nimport _ from \"lodash\";\nimport a from \"./a\";\nimport B from \"./B\";\n      ",
        },
        {
            options: [{ "declaration-ordering": ["source", "lowercase-last"] }],
            code: "\nimport * as A from \"A\";\nimport \"C\";\nimport b from \"b\";\nimport { d } from \"d\";\nimport _ from \"lodash\";\nimport B from \"./B\";\nimport a from \"./a\";\n      ",
        },
        // "declaration-ordering": ["type", ?]
        {
            options: [
                { "declaration-ordering": ["type", { secondaryOrdering: ["name", "case-insensitive"] }] },
            ],
            code: "\nimport \"d\";\nimport \"D\";\nimport _ from \"lodash\";\nimport a from \"A\";\nimport A from \"a\";\nimport * as b from \"b\";\nimport * as B from \"B\";\nimport { c } from \"c\";\nimport { C } from \"C\";\n      ",
        },
        {
            options: [
                { "declaration-ordering": ["type", { secondaryOrdering: ["name", "lowercase-last"] }] },
            ],
            code: "\nimport \"D\";\nimport \"d\";\nimport _ from \"lodash\";\nimport A from \"a\";\nimport a from \"A\";\nimport * as B from \"B\";\nimport * as b from \"b\";\nimport { c } from \"c\";\nimport { C } from \"C\";\n      ",
        },
        {
            options: [
                { "declaration-ordering": ["type", { secondaryOrdering: ["source", "case-insensitive"] }] },
            ],
            code: "\nimport \"g\";\nimport \"H\";\nimport a from \"a\";\nimport B from \"B\";\nimport _ from \"lodash\";\nimport * as c from \"c\";\nimport * as D from \"D\";\nimport { e } from \"e\";\nimport { E } from \"F\";\n      ",
        },
        {
            options: [
                { "declaration-ordering": ["type", { secondaryOrdering: ["source", "lowercase-last"] }] },
            ],
            code: "\nimport \"H\";\nimport \"g\";\nimport B from \"B\";\nimport a from \"a\";\nimport _ from \"lodash\";\nimport * as D from \"D\";\nimport * as c from \"c\";\nimport { E } from \"F\";\nimport { e } from \"e\";\n      ",
        },
        {
            options: [{ "declaration-ordering": ["type", { secondaryOrdering: ["any"] }] }],
            code: "\nimport \"z1\";\nimport \"a1\";\nimport z2 from \"z2\";\nimport a2 from \"a2\";\nimport _ from \"lodash\";\nimport * as z3 from \"z3\";\nimport * as a3 from \"a3\";\nimport { z4 } from \"z4\";\nimport { a4 } from \"a4\";\n      ",
        },
        // "specifier-ordering": "any"
        {
            options: [{ "specifier-ordering": "any" }],
            code: "import { _, c, b, a, C, B, A } from \"a\";",
        },
        // "specifier-ordering": "lowercase-last"
        {
            options: [{ "specifier-ordering": "lowercase-last" }],
            code: "import { _, A, B, C, a, b, c } from \"a\";",
        },
        // "specifier-ordering": "case-insensitive"
        {
            options: [{ "specifier-ordering": "case-insensitive" }],
            code: "import { _, A, a, B, b, C, c } from \"a\";",
        },
        // "symbols-first": false
        // "specifier-ordering": "lowercase-last"
        {
            options: [{ "symbols-first": false, "specifier-ordering": "lowercase-last" }],
            code: "import { A, B, C, _, a, b, c } from \"a\";",
        },
        // "symbols-first": false
        // "specifier-ordering": "case-insensitive"
        {
            options: [{ "symbols-first": false, "specifier-ordering": "case-insensitive" }],
            code: "import { A, a, B, b, C, c, _ } from \"a\";",
        },
        // "group-ordering"
        {
            options: [{ "group-ordering": groups }],
            code: "\nimport \"b1\";\nimport \"b2\";\n\nimport \"../a1\";\nimport \"../a2\";\n\nimport \"./b1\";\nimport \"./b2\";\n      ",
        },
    ],
    invalid: [
        // "declaration-ordering": ["name", ?]
        {
            options: [{ "declaration-ordering": ["name", "case-insensitive"] }],
            code: "\nimport D from \"z1\";\nimport c from \"z2\";\nimport { foo } from \"foo\";\nimport B from \"z3\";\nimport a from \"z4\";\nimport _ from \"lodash\";\n      ",
            output: "\nimport _ from \"lodash\";\nimport a from \"z4\";\nimport { foo } from \"foo\";\nimport B from \"z3\";\nimport c from \"z2\";\nimport D from \"z1\";\n      ",
            errors: [
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
            ],
        },
        {
            options: [{ "declaration-ordering": ["name", "lowercase-last"] }],
            code: "\nimport D from \"z1\";\nimport c from \"z2\";\nimport { foo } from \"foo\";\nimport B from \"z3\";\nimport a from \"z4\";\nimport _ from \"lodash\";\n      ",
            output: "\nimport _ from \"lodash\";\nimport B from \"z3\";\nimport { foo } from \"foo\";\nimport D from \"z1\";\nimport a from \"z4\";\nimport c from \"z2\";\n      ",
            errors: [
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
            ],
        },
        // "declaration-ordering": ["source", ?]
        {
            options: [{ "declaration-ordering": ["source", "case-insensitive"] }],
            code: "\nimport _ from \"lodash\";\nimport z1 from \"D\";\nimport z2 from \"c\";\nimport { foo } from \"foo\";\nimport z3 from \"B\";\nimport z4 from \"a\";\n      ",
            output: "\nimport z4 from \"a\";\nimport z3 from \"B\";\nimport z2 from \"c\";\nimport z1 from \"D\";\nimport { foo } from \"foo\";\nimport _ from \"lodash\";\n      ",
            errors: [
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
            ],
        },
        {
            options: [{ "declaration-ordering": ["source", "lowercase-last"] }],
            code: "\nimport _ from \"lodash\";\nimport z1 from \"D\";\nimport z2 from \"c\";\nimport { foo } from \"foo\";\nimport z3 from \"B\";\nimport z4 from \"a\";\n      ",
            output: "\nimport z3 from \"B\";\nimport z1 from \"D\";\nimport z4 from \"a\";\nimport z2 from \"c\";\nimport { foo } from \"foo\";\nimport _ from \"lodash\";\n      ",
            errors: [
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
            ],
        },
        // "declaration-ordering": ["type", ?]
        {
            options: [
                { "declaration-ordering": ["type", { secondaryOrdering: ["name", "case-insensitive"] }] },
            ],
            code: "\nimport { B } from \"z1\";\nimport { a } from \"z2\";\nimport * as D from \"z3\";\nimport * as c from \"z4\";\nimport F from \"z5\";\nimport e from \"z6\";\nimport _ from \"lodash\";\nimport \"z7\";\nimport \"z8\";\n      ",
            output: "\nimport \"z7\";\nimport \"z8\";\nimport _ from \"lodash\";\nimport e from \"z6\";\nimport F from \"z5\";\nimport * as c from \"z4\";\nimport * as D from \"z3\";\nimport { B } from \"z1\";\nimport { a } from \"z2\";\n      ",
            errors: [
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
            ],
        },
        {
            options: [
                { "declaration-ordering": ["type", { secondaryOrdering: ["name", "lowercase-last"] }] },
            ],
            code: "\nimport { a } from \"z1\";\nimport { B } from \"z2\";\nimport * as c from \"z3\";\nimport * as D from \"z4\";\nimport e from \"z5\";\nimport F from \"z6\";\nimport _ from \"lodash\";\nimport \"z7\";\nimport \"z8\";\n      ",
            output: "\nimport \"z7\";\nimport \"z8\";\nimport _ from \"lodash\";\nimport F from \"z6\";\nimport e from \"z5\";\nimport * as D from \"z4\";\nimport * as c from \"z3\";\nimport { a } from \"z1\";\nimport { B } from \"z2\";\n      ",
            errors: [
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
            ],
        },
        {
            options: [
                { "declaration-ordering": ["type", { secondaryOrdering: ["source", "case-insensitive"] }] },
            ],
            code: "\nimport { z1 } from \"B\";\nimport { z2 } from \"a\";\nimport * as z3 from \"D\";\nimport * as z4 from \"c\";\nimport _ from \"lodash\";\nimport z5 from \"F\";\nimport z6 from \"e\";\nimport \"H\";\nimport \"g\";\n      ",
            output: "\nimport \"g\";\nimport \"H\";\nimport z6 from \"e\";\nimport z5 from \"F\";\nimport _ from \"lodash\";\nimport * as z4 from \"c\";\nimport * as z3 from \"D\";\nimport { z2 } from \"a\";\nimport { z1 } from \"B\";\n      ",
            errors: [
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
            ],
        },
        {
            options: [
                { "declaration-ordering": ["type", { secondaryOrdering: ["source", "lowercase-last"] }] },
            ],
            code: "\nimport { z1 } from \"a\";\nimport { z2 } from \"B\";\nimport * as z3 from \"c\";\nimport * as z4 from \"D\";\nimport _ from \"lodash\";\nimport z5 from \"e\";\nimport z6 from \"F\";\nimport \"g\";\nimport \"H\";\n      ",
            output: "\nimport \"H\";\nimport \"g\";\nimport z6 from \"F\";\nimport z5 from \"e\";\nimport _ from \"lodash\";\nimport * as z4 from \"D\";\nimport * as z3 from \"c\";\nimport { z2 } from \"B\";\nimport { z1 } from \"a\";\n      ",
            errors: [
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
            ],
        },
        {
            options: [{ "declaration-ordering": ["type", { secondaryOrdering: ["any"] }] }],
            code: "\nimport { z4 } from \"z4\";\nimport { a4 } from \"a4\";\nimport * as z3 from \"z3\";\nimport * as a3 from \"a3\";\nimport z2 from \"z2\";\nimport a2 from \"a2\";\nimport _ from \"lodash\";\nimport \"z1\";\nimport \"a1\";\n      ",
            output: "\nimport \"z1\";\nimport \"a1\";\nimport z2 from \"z2\";\nimport a2 from \"a2\";\nimport _ from \"lodash\";\nimport * as z3 from \"z3\";\nimport * as a3 from \"a3\";\nimport { z4 } from \"z4\";\nimport { a4 } from \"a4\";\n      ",
            errors: [
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
                { message: "unordered import declaration" },
            ],
        },
        // "specifier-ordering": "lowercase-last"
        {
            options: [{ "specifier-ordering": "lowercase-last" }],
            code: "import { c, b, a, C, B, A } from \"a\";",
            output: "import { A, B, C, a, b, c } from \"a\";",
            errors: [
                { message: "unordered import specifier" },
                { message: "unordered import specifier" },
                { message: "unordered import specifier" },
                { message: "unordered import specifier" },
                { message: "unordered import specifier" },
                { message: "unordered import specifier" },
            ],
        },
        // "specifier-ordering": "case-insensitive"
        {
            options: [{ "specifier-ordering": "case-insensitive" }],
            code: "import { c, b, a, C, B, A } from \"a\";",
            output: "import { a, A, b, B, c, C } from \"a\";",
            errors: [
                { message: "unordered import specifier" },
                { message: "unordered import specifier" },
                { message: "unordered import specifier" },
                { message: "unordered import specifier" },
                { message: "unordered import specifier" },
                { message: "unordered import specifier" },
            ],
        },
        // "group-ordering"
        {
            options: [{ "group-ordering": groups }],
            code: "\nimport a30 from \"./a\";\nimport b30 from \"./b\";\n\nimport a10 from \"a\";\nimport b10 from \"b\";\n\nimport a20 from \"../a\";\nimport b20 from \"../b\";\n      ",
            output: "\nimport a10 from \"a\";\nimport b10 from \"b\";\n\nimport a20 from \"../a\";\nimport b20 from \"../b\";\n\nimport a30 from \"./a\";\nimport b30 from \"./b\";\n      ",
            errors: [
                { message: "unordered import group" },
                { message: "unordered import group" },
                { message: "unordered import group" },
            ],
        },
        {
            options: [{ "group-ordering": groups }],
            code: "\nimport a10 from \"a\";\n\nimport b10 from \"b\";\n\nimport a20 from \"../a\";\n\nimport b20 from \"../b\";\n\nimport a30 from \"./a\";\n\nimport b30 from \"./b\";\n      ",
            errors: [
                { message: "unmerged import group" },
                { message: "unmerged import group" },
                { message: "unmerged import group" },
            ],
        },
        {
            options: [{ "declaration-ordering": ["any"], "group-ordering": groups }],
            code: "\nimport a10 from \"a\";\nimport b30 from \"./b\";\n\nimport a20 from \"../a\";\nimport b10 from \"b\";\n\nimport a30 from \"./a\";\nimport b20 from \"../b\";\n      ",
            errors: [
                { message: "invalid import group member" },
                { message: "invalid import group member" },
                { message: "invalid import group member" },
            ],
        },
    ],
});
