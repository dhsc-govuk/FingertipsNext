# FingertipsNext

FingerTipsNext is the next version of Fingertips, a comprehensive public health data collection platform managed by the Department of Health and Social Care (DHSC) in the UK.

## Starting the Application Locally

A [Docker compose](https://docs.docker.com/compose/) definition is provided (see [compose.yaml](compose.yaml)) to allow the individual application containers to be run locally.

To build the application containers you will need Docker installed: <https://docs.docker.com/engine/install/>. You will also need to copy the `.env.template` file to one called `.env` and populate the `DB_PASSWORD` environment variable with a password value that meets the [SQL Server password policy](https://learn.microsoft.com/en-us/sql/relational-databases/security/password-policy?view=sql-server-ver16).

Once Docker is installed and the `.env` file is in place, you can start the whole application with the following command:

```bash
docker compose --profile all up --build --remove-orphans -d
```

This will build and then start the containers in the background. You can view the frontend application at [http://localhost:3000/](http://localhost:3000/) and the API at [http://localhost:5144/](http://localhost:5144/).

It is also possible to start a subset of the application's containers using Docker's support for profiles. The following profiles have been defined:

| Profile Name | Services Included              |
| ------------ | ------------------------------ |
| all          | All application services       |
| frontend     | The frontend application       |
| api          | The API application & database |
| db           | The SQL Server database        |

You can start a specific profile by providing the `--profile <profile_name>` argument to the `docker compose` command. For example the following command will start only the API:

```bash
docker compose --profile api up --build -d
```

Finally, you can stop all of the running containers with the following command, where `<profile_name>` is the profile name you provided to the `up` command:

```bash
docker compose down --profile <profile_name>
```

## Making Changes to the Application

There are several components to the application:

- The [frontend](frontend/fingertips-frontend/), a Next.js application which provides the UI
- The [api](api/DHSC.FingertipsNext.Api/), a .NET application which provides the API layer
- The [database](database/fingertips-db/) project, a SQL Server Database Project that defines the database structure
- The [terraform](terraform/), which provides the Infrastructure as Code used to deploy the application to Azure

Each component directory has a README.md file providing details of how to contribute to it.

## Workflows

Workflows are provided for building and deploying the Fingertips application. These workflows are implemented using [Github Actions](https://github.com/features/actions) and can be found in [.github/workflows/](.github/workflows/).

### The Continuous Integration Workflow

The continuous integration (CI) workflow performs automated checks on the various components of the application and then builds them and publishes the resulting containers to a container registry. It is is defined in [.github/workflows/ci.yml](.github/workflows/ci.yml).

#### Pre-requisites

In order to run the CI workflow you must have the following [variables](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables) set for your Github Action:

| Variable Name      | Description                                                                            |
| ------------------ | -------------------------------------------------------------------------------------- |
| CONTAINER_REGISTRY | The domain of the container registry to push images to. E.g. `registryname.azurecr.io` |

You must also set the following [secrets](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions):

| Secret Name                 | Description                                                                                                     |
| --------------------------- | --------------------------------------------------------------------------------------------------------------- |
| CONTAINER_REGISTRY_USERNAME | The username to use when authenticating to the container registry defined in the `CONTAINER_REGISTRY` variable. |
| CONTAINER_REGISTRY_PASSWORD | The password to use when authenticating to the container registry defined in the `CONTAINER_REGISTRY` variable. |
