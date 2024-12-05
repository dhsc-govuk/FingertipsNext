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

Recommend you configure prettier as part of your IDE using the recommeded [extension](https://prettier.io/docs/en/editors.html)

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

We use Jest + React Testing Library for unit testing and Cypress for e2e testing.

### Running the Unit tests

```bash
npm run test
```

### Running the E2E tests

Once you have the web application running on http://localhost:3000 do:

```bash
npm run test-e2e
```

If you wish to run the E2E tests headless do:

```bash
npx cypress run
```

Note that this command will use the bundled Electron browser when executing the tests headlessly. In the CI job these tests will execute using chrome, safari will be added in a future PR.

### Accessibility Testing:

Currently performed at the E2E stage. Libraries used: axe-core (https://github.com/dequelabs/axe-core) and cypress-axe (https://github.com/component-driven/cypress-axe). 

Configured to the WCAG2.2 AA standard in the following file cypress/support/a11y.ts.

To check accessibility call .checkA11Y() from the basePage.

Any violations of this standard cause a test failure unless the rule violated has been accepted in cypress/support/a11y.ts.

## Code structure

The `app` folder contains the pages that are rendered server side. The pages are in folders that will correspond to the route.
These server pages are responsible for making any calls to fetch any data. Then passing this data to a corresponding page component via props.

The page components are pure react components and must have the `use client` directive at the top. This is needed for the purpose of using the `govuk-react` component library. This library uses `styled-components` and react hooks and therefore need to be client components.

However, Next.js will still use these component to render the page server-side.
