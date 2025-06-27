# fingertips-frontend

The Fingertips frontend. A [Next.js](https://nextjs.org) project.

## Developing

### Prerequisites

Before starting development on this application you need to do the following:

1. Ensure that you are using the correct Node.js version. The currently-supported version is specified in the [.nvmrc](.nvmrc) file. It is recommended you install nvm and use it to manage your Node.js version. With nvm installed you can install and use the correct Node.js version by running `nvm install` in this directory. This applies to a Mac but doesn't work on Windows. If you use Windows use [nvm-windows](https://github.com/coreybutler/nvm-windows) and follow [this](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/). Unfortunately this tool doesn't recognise the .nvmrc file, so use the `nvm install` and `nvm use` commands and specify the node version defined in the [.nvmrc](.nvmrc) file explicitly e.g. `nvm use 20.18.0`.
2. Install the necessary dependencies: `npm install`.

### Linting

You can lint the code base (using [ESLint](https://eslint.org/)) by running:

```bash
npm run lint
```

### Prettier

You can format the code base (using [Prettier](https://prettier.io/docs/en/)) by running:

```bash
npm run prettier
```
 
Recommend you configure prettier as part of your IDE using the recommended [extension](https://prettier.io/docs/en/editors.html).

### Type Checking

You can type check the code base (using the Typescript compiler) by running:

```bash
npm run typecheck
```

### Running the Development Server

To run the Next development server, as well as the containers required for the API backend, you will need to have Docker running and then run the following NPM script:

```bash
npm run dev:local-api
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can then start editing the application and your browser will auto-update as you edit the files.

### Running the NextJS application against MSW

To run the Next development server against the MSW (Mock Service Worker) rather than the real api, run the following command:

```bash
npm run dev
```

## Building

### Building the Next Application

To perform a production build of the application, do the following:

1. Install dependencies: `npm install`.
1. Build the application: `npm run build`. This will build the application into the `.next` directory.
1. [Optionally] To run the production server: `npm run start` and open [http://localhost:3000](http://localhost:3000) with your browser to see the result. Note: this server does not auto-update when you change files.

### Building the Container

A [Dockerfile](Dockerfile) is provided to allow a container image to be built for the application. You can build and run a container by doing the following:

1. [Install Docker](https://docs.docker.com/get-docker/) on your machine, if required.
1. Build your container: `docker build -t fingertips-frontend .`.
1. Run your container: `docker run -p 3000:3000 fingertips-frontend`.

You can then open [http://localhost:3000](http://localhost:3000) with your browser to see the application. You can also view the images created with `docker images`.

## Testing

This project uses Vitest + React Testing Library for unit testing and Playwright for ui and e2e testing.

Isolated ui testing, covering accessibility, page navigation and validations occurs in both CI on push and pull requests, as well in CD as when code merges to main.

For e2e tests there is a difference between where and how the tests are executed:

 1. In CI, which occurs on push and in pull requests, we execute the e2e tests against a dockerised container instance of fingertips, using chromium browser, running in the github runner agent. Note that we also perform visual screenshot snapshot testing of all the chart components at this point.

 2. In CD, which occurs when code merges into main, we execute the e2e tests against the deployed azure instance of fingertips, using both chromium and webkit browsers. Note we do not perform visual screenshot snapshot testing at this point.

We use tags to tag our tests to control whether they run in both CI and CD, or just one of these. This depends on what the e2e test is testing as certain data and infrastructure only exists in the CD environment.

For local development we also have the option to run the tests locally against mocks or against a containerised instance of fingertips using docker.

### Running the unit tests

```bash
npm run test
```

### Running the Playwright UI and E2E tests

To run playwright tests locally, you will first need to install the playwright browser dependencies:

```bash
npx playwright install --with-deps chromium webkit
```

To run the ui tests locally against mock data headlessly:

```bash
npm run test-ui-local-mocks
```

To debug ui test failures its best to run them using UI Mode:

```bash
npx playwright test --ui
```

To run the e2e tests locally, headlessly, which uses a local dockerised container fingertips instance:

```bash
npm run test-e2e-local-docker
```
You will need to have all the docker services running first before executing this command.

To run the e2e tests locally but pointing at the deployed CD environment, rather than using the local docker stack, headlessly uou will need to connect to the VPN then add FINGERTIPS_FRONTEND_URL={enter url here} after MOCK_SERVER=false. Then run the following command:

```bash
npm run test-e2e-cd
```
Note - Do not commit/push the FINGERTIPS_FRONTEND_URL as the url is a github secret.

To run the e2e tests locally, headed allowing debug:

```bash
npm run test-e2e-ui-mode
```

Each test will be executed in parallel using Chromium and Webkit as defined in playwright.config.ts, except for in --ui mode which launches the playwright test runner. 

To make our isolated ui testing and fully integrated e2e testing as close to real world as possible, we use the full chromium headless mode offered by recent playwright versions see https://playwright.dev/docs/release-notes#try-new-chromium-headless.

### Accessibility Testing

Performed in the ui tests, libraries used: @axe-core/playwright and axe-playwright. 

Configured to the WCAG2.2 AA standard in the following file playwright/page-objects/pageFactory.ts. Any violations of this standard cause a test failure unless the rule violated has been accepted in pageFactory.ts.

To check there are 0 accessibility violations on the page the test is currently on call expectNoAccessibilityViolations().

### Visual Screenshot Snapshot Testing

Performed in the e2e tests when they are run in CI. They are not performed locally or in CD when we merge into main, this is to keep the environment where we execute the screenshot tests consistent and therefore the tests deterministic and stable. All base screenshot snapshots are stored directly in the repository.

If you have made changes in your branch that have correctly resulted in the screenshots generated not matching the base screenshots within the tolerance ratio (see `maxDiffPixelRatio` in the playwright config file), then the e2e tests will fail in CI and you will need to update the base screenshots.

In your failed job you will see the following message:

`Screenshot match failed: ${visibleComponent.componentLocator} - you may need to run the update screenshot manual CI job - see Visual Screenshot Snapshot Testing in frontend/fingertips-frontend/README.md for details.`

Follow these steps to update the screenshots (or add new ones where needed):

1. Download `playwright-artefacts` from the github workflow summary page, and open the `index.html` file in the `playwright-report` folder, then in the Playwright report open the failed test and you will be presented with a 'Diff' page that shows the before and after.
2. Review and compare the expected base screenshots and actual current screenshots in the playwright report with a BA to confirm the new screenshots are correct.
3. Once the changes have been confirmed as correct go to `https://github.com/dhsc-govuk/FingertipsNext/actions/workflows/update-screenshots.yml` and click run workflow in the top right of the window and click `Run workflow`, selecting your branch in the dropdown.
4. Once this workflow has finished it will have automatically committed the changes to your branch and/or PR. Please review them again at this point in time.
5. Ensure that you kick off a fresh workflow on your PR as this wont automatically happen with the automatically committed screenshots.
6. When you put your PR up for review, make sure you explicitly state that your changes caused the base screenshots to need to be updated.

## Code structure

The `app` folder contains the pages that are rendered server side. The pages are in folders that will correspond to the route.
These server pages are responsible for making any calls to fetch any data. Then passing this data to a corresponding page component via props.

The page components are pure react components and must have the `use client` directive at the top. This is needed for the purpose of using the `govuk-react` component library. This library uses `styled-components` and react hooks and therefore need to be client components.

However, Next.js will still use these component to render the page server-side.

## Auto generate scripts

CAUTION: Running these scripts will overwrite previously generated code. This should only need to be done when the API contract has been updated and we need to re-generate the api client and mocks based upon the new contract as defined by the openapi specification.

### Generating the API Client

The following script will autogenerate the api client code from an openapi spec.
NOTE: this will require Java configured on your path in order for this to work. See https://www.npmjs.com/package/@openapitools/openapi-generator-cli for details.

```bash
npm run generate:api-client
```

The generated code is held within `generated-sources/api-client` folder. Please do not make any manual changes to code within this folder. This is auto-generated and will be overwritten if the script is ran again.

`openapitools.json` contains configuration that the script uses. This includes where to find the open-api spec as input and where the output is generated. You can change the output path if you wish to see the generated code and not overwrite the previous version.

### Generating mock handlers

The following script will autogenerate mock handlers from an open-api spec. See https://github.com/zoubingwu/msw-auto-mock for details:

```bash
npm run generate:mocks
```

The autogenerated code is held within `mock/server` folder. This script generates a skeleton of endpoints that the API returns with the intention of updating the handlers with the responses you wish the mock service worker to return. Therefore, re-rerunning this script will overwrite any changes made to this file.

If you wish to autogenerate the mock handlers again, use the following command:

```bash
npm run generate:ft-mocks
```

`msw-auto-mock` will generate mock service workers for `browser`, `native`, `handlers` and `node`. 
- We do not need `browser` or `native` so these should be deleted.
- Since the project is using Typescript `node.js` should be renamed `node.ts`.
- The project uses the `handlers.ts` file, and a number of manual edits will have been made to this file. Any additional code from the generated `handlers.js` file should be transposed into this existing `.ts` file. `handlers.js` can then be deleted. 

