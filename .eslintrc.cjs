module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
    },
    "plugins": ["jsdoc"],
    "extends": ["eslint:recommended", "plugin:jsdoc/recommended-typescript-flavor-error"],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
    }
}
