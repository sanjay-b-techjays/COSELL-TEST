# CoSell

The Co - Sell platform allows Alliance Managers of the various organizations to Co - Sell their products/services along with complementary products/services

## Technologies

- [@reduxjs/toolkit](https://redux-toolkit.js.org/)
- [Formik](https://formik.org/) - Used for form management.
- [react-redux](https://react-redux.js.org/)
- [react-router](https://reactrouter.com/web/guides/quick-start)
- [Typescript](https://www.typescriptlang.org/)
- [Storybook](https://storybook.js.org/docs/react/get-started/introduction)
- [React](https://reactjs.org/) - created via Vite, not ejected
- [Vite](https://vitejs.dev/)

# Developer Setup

## Prerequisites

- [Visual Studio Code](https://code.visualstudio.com/) with the following extensions
  - [Babel ES6/ES7](https://marketplace.visualstudio.com/items?itemName=dzannotti.vscode-babel-coloring)
  - [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [npm Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense)
  - [Path Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense)
  - [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  - [SVG Viewer](https://marketplace.visualstudio.com/items?itemName=cssho.vscode-svgviewer)
  - [vscode-icons](https://marketplace.visualstudio.com/items?itemName=vscode-icons-team.vscode-icons) (optional, just makes things look a bit nicer)
  - [vscode-styled-components](https://marketplace.visualstudio.com/items?itemName=jpoissonnier.vscode-styled-components)

## Quick Start

### Installation

CoSell requires [Node.js](https://nodejs.org/) v15+ to run.

Install the dependencies and devDependencies and start the server.

```sh
cd cosellweb
yarn install
yarn run dev
```

### Storybook

To start storybook...

```sh
yarn storybook
```

### Linting error fix

To auto fix lint error in particular file...

```sh
npx eslint <targetFile> --fix
```

To auto fix lint error in multiple files...

```sh
npx eslint src/* --fix
```
