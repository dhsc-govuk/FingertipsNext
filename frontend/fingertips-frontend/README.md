# fingertips-frontend

The Fingertips frontend. A [Next.js](https://nextjs.org) project.

## Developing

### Prerequisites

Before starting development on this application you need to do the following:

1. Ensure that you are using the correct Node.js version. The currently-supported version is specified in the [.nvmrc](.nvmrc) file. It is recommended you install nvm and use it to manage your Node.js version. With nvm installed you can install and use the correct Node.js version by running `nvm install` in this directory. This applies to a Mac but doesn't work on Windows. If you use Windows use [nvm-windows](https://github.com/coreybutler/nvm-windows) and follow [this](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/). Unfortunately this tool doesn't recognise the .nvmrc file, so use the `nvm install` and `nvm use` commands and specify the node version explicitly e.g. `nvm use 20.18.0`.
2. Install the necessary dependencies: `npm install`

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

Recommend you configure prettier as part of your IDE using the recommended [extension](https://prettier.io/docs/en/editors.html)

### Type Checking

You can type check the code base (using the Typescript compiler) by running:

```bash
npm run typecheck
```

### Running the Development Server

To run the Next development server, as well as the containers required for the API backend, you will need to have Docker running and then run the following NPM script:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can then start editing the application and your browser will auto-update as you edit the files.

You can also run the Next development server without running the API containers by using the following command:

```bash
npm run dev:standalone
```

## Building

### Building the Next Application

To perform a production build of the application, do the following:

1. Install dependencies: `npm install`
1. Build the application: `npm run build`. This will build the application into the `.next` directory.
1. [Optionally] To run the production server: `npm run start` and open [http://localhost:3000](http://localhost:3000) with your browser to see the result. Note: this server does not auto-update when you change files.

### Building the Container

A [Dockerfile](Dockerfile) is provided to allow a container image to be built for the application. You can build and run a container by doing the following:

1. [Install Docker](https://docs.docker.com/get-docker/) on your machine, if required
1. Build your container: `docker build -t fingertips-frontend .`
1. Run your container: `docker run -p 3000:3000 fingertips-frontend`

You can then open [http://localhost:3000](http://localhost:3000) with your browser to see the application. You can also view the images created with `docker images`.

## Testing

This project uses Jest + React Testing Library for unit testing and Playwright for e2e testing.

### Running the Unit tests

```bash
npm run test
```

### Running the E2E tests

To run the e2e tests headless do:

```bash
npm run test-e2e
```

To run the e2e tests headed do:

```bash
npx playwright test --headed
```

Note that each test will be executed in parallel using Chromium and Webkit as defined in playwright.config.ts.

### Accessibility Testing:

Currently performed at the E2E stage. Libraries used: @axe-core/playwright and axe-playwright. 

Configured to the WCAG2.2 AA standard in the following file playwright/page-objects/pageFactory.ts.

To check there are 0 accessibility violations call expect((await axeBuilder.analyze()).violations).toEqual([]);.

Any violations of this standard cause a test failure unless the rule violated has been accepted in pageFactory.ts.

## Code structure

The `app` folder contains the pages that are rendered server side. The pages are in folders that will correspond to the route.
These server pages are responsible for making any calls to fetch any data. Then passing this data to a corresponding page component via props.

The page components are pure react components and must have the `use client` directive at the top. This is needed for the purpose of using the `govuk-react` component library. This library uses `styled-components` and react hooks and therefore need to be client components.

However, Next.js will still use these component to render the page server-side.

## Auto generate scripts

CAUTION: Running these scripts will overwrite previously generated code.

### Generating the API Client

The following script will autogenerate the api client code from an openapi spec.

```bash
npm run generate:api-client"
```

The generated code is held within `generated-sources/api-client` folder. Please do not make any manual changes to code within this folder. This is auto-generated and will be overwritten if the script is ran again.

`openapitools.json` contains configuration that the script uses. This includes where to find the open-api spec as input and where the output is generated. You can change the output path if you wish to see the generated code and not overwrite the previous version.

### Generating mock handlers

The following script will autogenerate mock handlers from an open-api spec.

The autogenerated code is held within `mock/server` folder. This script generates a skeleton of endpoints that the API returns with the intention of updating the handlers with the responses you wish the mock service worker to return. Therefore, re-reunning this script will overwrite any changes made to this file.

If you wish to autogenerate the mock handlers again the preferred method is to change the output path (-o) to a new path of the script.

```bash
npx msw-auto-mock ./../../api/definition/weather.json -o .{SOME/OTHER/PATH}
```
