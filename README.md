# refaktor

This is a tool to avoid errors during refactoring. It aims to create screenshots of given urls and you can compare them
with a later run to ensure that you don't break the UI while refactoring code.

# installation

```bash
npm install refaktor-cli -g
```

## Generate snapshots

Setup you config file. [Example](https://github.com/faebeee/refactor/blob/v1.2.0/packages/refactor-cli/template/pages.js)

__test.js__
```javascript
module.exports = [{
  id: "test",
  url: "https://example.com",
  viewport: [1080, 1024],
  output: "./screenshots",
  pages: [
    {
      path: "/",
      id: "home",
    },
      {
      path: "/hello-world",
      id: "hello-world",
    },
  ],
}];
```

```bash
refaktor generate ./path-to-config.js
```

## Compare current state agains new taken screenshots

```bash
refaktor compare ./path-to-config.js --ui
```

## Commands

### generate
Generates the sources for later comparinson

```bash
refaktor inspect ./out.json
```

### compare
Compares screenshots and reports the result to the CLI

```bash
refaktor compare ./test.js --cli
```

### inspect
Opens up an UI for inspecting the result
```bash
refaktor inspect ./out.json
```
### help

```bash
refaktor help
```