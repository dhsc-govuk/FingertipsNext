# fingertips-db

This directory contains a [SQL database project](https://learn.microsoft.com/en-us/sql/tools/sql-database-projects/sql-database-projects) that defines the structure of the Fingertips database, as well as any pre or post-deployment scripts used. It can be built into a .dacpac file that can be applied to a SQL Server database to allow for repeatable database deployments.

## Prerequisites

You'll need to following tools to work on the database project:

- [.Net 8](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- A suitable IDE
  - On Windows, if you have Visual Studio, you can use [SQL Server Data Tools](https://learn.microsoft.com/en-us/sql/ssdt/sql-server-data-tools)
  - You can also use [Visual Studio Code](https://code.visualstudio.com/) or [Azure Data Studio](https://learn.microsoft.com/en-us/azure-data-studio/download-azure-data-studio) with the [SQL Database Projects extension](https://learn.microsoft.com/en-gb/azure-data-studio/extensions/sql-database-project-extension) on all platforms.
- [SqlPackage CLI](https://learn.microsoft.com/en-us/sql/tools/sqlpackage/sqlpackage-download) (if you want to deploy the .dacpac from the command line)

## Building

You can build a .dacpac file from this project by running the following command from this directory:

```bash
dotnet build fingertips-db.sqlproj
```

This will produce a `fingertips-db.dacpac` file in the [bin/Debug/](bin/Debug/) directory.

## Deploying

Once you have built a .dacpac file (see [building](#building) above) you can deploy it to a SQL Server instance using SqlPackage using the following command:

```bash
sqlpackage \
    /Action:publish \
    /SourceFile:bin/Debug/fingertips-db.dacpac \
    /TargetServerName:<DB server hostname>,<DB server port> \
    /TargetDatabaseName:<database name> \
    /TargetUser:<DB username> \
    /TargetPassword:<DB password>
```

If your database server is using a self-signed certificate (e.g. you are running one locally in a container) you will need to add the `/TargetTrustServerCertificate:True` option to disable certificate verification.

## Build/Deployment Using a Container

A [Dockerfile](Dockerfile) is provided to build a .dacpac file and produce a container image that will run the .dacpac against a SQL Server. You can build and run a container by doing the following:

1. [Install Docker](https://docs.docker.com/get-docker/) on your machine, if required
1. Build the container: `docker build -t fingertips-db .`
1. Run your container: `docker run -e DB_SERVER="<DB server hostname>" -e DB_PORT="<DB server port>" -e DB_NAME="<database name>" -e SA_USERNAME="DB username" -e SA_PASSWORD="DB password" fingertips-db`

Note: If your database server is using a self-signed certificate (e.g. you are running one locally in a container) you will need to add the `-e TRUST_CERT="True"` flag to disable certificate verification.
