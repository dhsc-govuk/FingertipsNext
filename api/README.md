# fingertips-api

This directory contains a .Net C# API project which exposes services implementing the fingertips API defined in swagger.yaml

## Prerequisites

You'll need to following tools to work on the api project:

- [.Net 9](https://dotnet.microsoft.com/en-us/download/dotnet/9.0)
- A suitable IDE

## Building

The project has a VS solution file which should be used for opening the project

## Deploying

This is principally as a container using the Dockerfile in this directory and started alongside other containers in the project using the compose file in the root of the directory.

It can also be run directly in Visual Studio during development.

## Testing

This project includes unit tests which must be run and extended as needed. They are automatically executed in push and pull_request pipelines, any failures will cause the job to fail.

The project also includes .http files which define API requests and validation which should be run as integration tests with the DB. These can be run using the VSCode "REST Client" plugin.

The .http files include embedded scripts to validate the responses. To execute these tests locally, first spin up the docker environment and then, from the api directory run:

`npx httpyac send ./**/*.http --all --json --filter only-failed --output-failed exchange > httpyacresults.json`

This will execute the .http test files and direct the output to the `httpyacresults.json` file. The report will only include failed tests
and will provide the full failing response body and headers etc.

The same command is also executed in the push and pull_request pipelines once the docker services have been started, and before the e2e tests run.

Alternatively, if you would like a high-level report of all the tests, you can run:
`npx httpyac send ./**/*.http --all --json --output-failed short --output short > httpyacresults.json`

For more info on this tool, please visit: [httpyac](https://www.npmjs.com/package/httpyac)
