module.exports = {
   
  env: {
   
    browser: true,
    es2020: true,
    node: true,
  },
  extends: ["plugin:vue/vue3-recommended", "plugin:prettier/recommended"],
  parserOptions: {
   
    ecmaVersion: "latest",
    parser: "@typescript-eslint/parser", // 指定ESlint的解析器
    sourceType: "module",
  },
  plugins: ["vue", "@typescript-eslint", "prettier"],
  rules: {
   
    "prettier/prettier": "error",
  },
}