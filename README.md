### Prod Badges

[![build](https://img.shields.io/github/actions/workflow/status/jemccarthy13/parrotsour/build.yml?style=for-the-badge)](https://github.com/jemccarthy13/parrotsour/actions/workflows/build.yml)
[![tests](https://img.shields.io/github/actions/workflow/status/jemccarthy13/parrotsour/tests.yml?branch=main&style=for-the-badge&label=Tests)](https://github.com/jemccarthy13/parrotsour/actions/workflows/tests.yml)
[![dependencies](https://img.shields.io/librariesio/github/jemccarthy13/parrotsour?style=for-the-badge)](https://libraries.io/github/jemccarthy13/parrotsour)
[![repo size](https://img.shields.io/github/repo-size/jemccarthy13/parrotsour?style=for-the-badge)](https://github.com/jemccarthy13/parrotsour)
[![CodeQL](https://img.shields.io/github/actions/workflow/status/jemccarthy13/parrotsour/codeql-analysis.yml?label=CodeQL&style=for-the-badge)](https://github.com/jemccarthy13/parrotsour/security/code-scanning)

[![codecov](https://codecov.io/gh/jemccarthy13/parrotsour/branch/main/graph/badge.svg?token=QFWAC2CEQT)](https://codecov.io/gh/jemccarthy13/parrotsour)

### Dev Badges

[![devtests](https://img.shields.io/github/actions/workflow/status/jemccarthy13/parrotsour/tests.yml?branch=ps-dev&label=Devtests&style=for-the-badge)](https://github.com/jemccarthy13/parrotsour/actions/workflows/tests.yml)

[![devcoverage](https://codecov.io/gh/jemccarthy13/parrotsour/branch/ps-dev/graph/badge.svg?token=QFWAC2CEQT)](https://app.codecov.io/gh/jemccarthy13/parrotsour/branch/ps-dev)

ParrotSour has changed drastically in version 4.

Much of the underlying 'core' library (i.e. math computations and drawing)
has been updated for stability. Components of the library should now be easier
to use/modify/extend. This README will explain the new thought process at the end.

### Install

Clone the repository \
Download [canvas dependencies](https://www.npmjs.com/package/canvas), depending on OS architecture
npm || yarn install
Run tests/coverage

## Available Scripts

In the project directory with yarn or npm, you can run:

### `yarn start` || `npm run start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test` || `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn coverage` || `npm run coverage`

Launches the tests with coverage in the interactive watch mode - produces coverage report.\
See above for more information.

### `yarn build` || `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn build-standalone` || `yarn build-standalone`

Builds a 'standalone' version of the app to the `build` folder.\
This optimizes the build for best performance while ensuring the app can run locally without hosting
on a webserver. Designed for offline app functionality.

### `yarn clint` || `npm run clint`

Execute the linter and provide feedback based on custom ruleset.

### `yarn eject` || `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

See the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).https://create-react-app.dev/docs/available-scripts)

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

### Upgrading to v4

Many of the forward-facing components remain the same. You may need to provide additional props,
but the behavior should remain compatible with previous versions.

In the backend, many of the data structures have been transformed to a class structure for
stability and readability, and testing.

Many of the "draw"ing aspects have changed dramatically - in the shift to classes, more items
can 'draw' themselves, rather than relying on external helper functions.

This does mean the Object will have additional functions included (i.e. heavier objects),
but in the author's opinion, this API is easier to code with.
-- This will continuously be evaluated on performance, to see if future versions should revert \
-- to save resources
