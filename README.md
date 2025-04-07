:desktop_computer: A Mysteryverse Web Extension built with React, TypeScript, Storybook, EsLint, Prettier, Jest, TailwindCSS, &amp; Webpack. Compatible with Google Chrome, Mozilla Firefox, Brave, and Microsoft Edge.

**Installation**

Run the following commands to install dependencies and start using the extension:

```
yarn install
yarn dev
```

**Available Scripts**

- `yarn dev` - run `webpack` in `watch` mode
- `yarn storybook` - runs the Storybook server
- `yarn build` - builds the production-ready unpacked extension
- `yarn test -u` - runs Jest + updates test snapshots
- `yarn lint` - runs EsLint
- `yarn prettify` - runs Prettier

<details>
  <summary>Loading the extension in Google Chrome</summary>

In [Google Chrome](https://www.google.com/chrome/), open up [chrome://extensions](chrome://extensions) in a new tab. Make sure the `Developer Mode` checkbox in the upper-right corner is turned on. Click `Load unpacked` and select the `dist` directory in this repository - your extension should now be loaded.

![Installed Extension in Google Chrome](https://i.imgur.com/Y2dQFte.png "Installed Extension in Google Chrome")

</details>

<details>
  <summary>Loading the extension in Brave</summary>

In [Brave](https://brave.com/), open up [brave://extensions](brave://extensions) in a new tab. Make sure the `Developer Mode` checkbox in the upper-right corner is turned on. Click `Load unpacked` and select the `dist` directory in this repository - your extension should now be loaded.

![Installed Extension in Brave](https://i.imgur.com/rKsbtcO.png "Installed Extension in Brave")

</details>

<details>
  <summary>Loading the extension in Mozilla Firefox</summary>

In [Mozilla Firefox](https://www.mozilla.org/en-US/firefox/new/), open up the [about:debugging](about:debugging) page in a new tab. Click the `This Firefox` link in the sidebar. On the `This Firefox` page, click the `Load Temporary Add-on...` button and select the `manifest.json` from the `dist` directory in this repository - your extension should now be loaded.

![Installed Extension in Mozilla Firefox](https://i.imgur.com/FKfTw4B.png "Installed Extension in Mozilla Firefox")

</details>

<details>
  <summary>Loading the extension in Microsoft Edge</summary>

In [Microsoft Edge](https://www.microsoft.com/en-us/edge), open up [edge://extensions](edge://extensions) in a new tab. Make sure the `Developer Mode` checkbox in the lower-left corner is turned on. Click `Load unpacked` and select the `dist` directory in this repository - your extension should now be loaded.

![Installed Extension in Microsoft Edge](https://i.imgur.com/ykesx0g.png "Installed Extension in Microsoft Edge")

</details>

**Notes**

- Includes ESLint configured to work with TypeScript and Prettier.

- Includes tests with Jest - note that the `babel.config.js` and associated dependencies are only necessary for Jest to work with TypeScript.

- Recommended to use `Visual Studio Code` with the `Format on Save` setting turned on.

- Example icons courtesy of [Heroicons](https://heroicons.com/).

- Includes Storybook configured to work with React + TypeScript. Note that it maintains its own `webpack.config.js` and `tsconfig.json` files. See example story in `src/components/hello/__tests__/hello.stories.tsx`.

- Includes a custom mock for the [webextension-polyfill-ts](https://github.com/Lusito/webextension-polyfill-ts) package in `src/__mocks__`. This allows you to mock any browser APIs used by your extension so you can develop your components inside Storybook.

**Built with**

- [React](https://reactjs.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Storybook](https://storybook.js.org/)
- [Jest](https://jestjs.io)
- [Eslint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Webpack](https://webpack.js.org/)
- [Babel](https://babeljs.io/)
- [TailwindCSS](https://tailwindcss.com/)
- [webextension-polyfill](https://github.com/mozilla/webextension-polyfill)

**References**

- [Chrome Extension Developer Guide](https://developer.chrome.com/extensions/devguide)
- [Firefox Extension Developer Guide](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension)
- [Eslint + Prettier + Typescript Guide](https://dev.to/robertcoopercode/using-eslint-and-prettier-in-a-typescript-project-53jb)
