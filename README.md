# fingertipsnext

Temporary home for FingerTipsNext.

## Starting the Application Locally

A [Docker compose](https://docs.docker.com/compose/) definition is provided (see [compose.yaml](compose.yaml)) to allow the individual application containers to be run locally.

To build the application containers you will need Docker installed: <https://docs.docker.com/engine/install/>. You will also need to copy of the `.env.template` file to one called `.env` and populate the `DB_PASSWORD` environment variable with a password value that meets the [SQL Server password policy](https://learn.microsoft.com/en-us/sql/relational-databases/security/password-policy?view=sql-server-ver16).

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

## Deploying the Application

[Terraform](https://developer.hashicorp.com/terraform) is used to define the infrastructure for the Fingertips application and allow for repeatable deployments of Fingertips environments. Fingertips' Terraform is defined in the [terraform](terraform) directory, along with details of how to run it locally.

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
