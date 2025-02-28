# fingertips-api

This directory contains a .Net C# API project which exposes services implementing the fingertips API defined in swagger.yaml

## Prerequisites

You'll need to following tools to work on the database project:

- [.Net 8](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- A suitable IDE
  - On Windows, if you have Visual Studio, you can use [SQL Server Data Tools](https://learn.microsoft.com/en-us/sql/ssdt/sql-server-data-tools)

## Building

The project has a VS solution file which should be used for opening the project

## Deploying

This is principally as a container using the Dockerfile in this directory and started alongside other containers in the project using the compose file in the root of the directory.

It can also be run directly in Visual Studio during development.

## Testing

The project included unit tests which must be run and extended as needed.The project also includes .http files which define API requests and validation which should be run as integration tests with the DB. These can be run using the VSCode "REST Client" plugin

The .http files include embedded scripts to validate the responses.These require the use of paid for IntelliJ subscriptions.

