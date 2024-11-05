# fingertips-frontend

The Fingertips frontend. A [Next.js](https://nextjs.org) project.

## Developing

### Prerequisites

Before starting development on this application you need to do the following:

1. Install the necessary dependencies: `npm install`

### Linting

You can lint the code base (using [ESLint](https://eslint.org/)) by running:

```bash
npm run lint
```

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

A Dockerfile is provided to allow a container image to be built for the application. You can build and run a container by doing the following:

1. [Install Docker](https://docs.docker.com/get-docker/) on your machine, if required
1. Build your container: `docker build -t fingertipsnext-frontend .`
1. Run your container: `docker run -p 3000:3000 fingertipsnext-frontend`

You can then open [http://localhost:3000](http://localhost:3000) with your browser to see the application. You can also view the images created with `docker images`.
