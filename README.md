# fingertipsnext

Temporary home for FingerTipsNext.

## Pre-requisites for Development

- To build the application containers you will need Docker installed: <https://docs.docker.com/engine/install/>
- To deploy the application from your local machine you will need:
  - Terraform: <https://developer.hashicorp.com/terraform/install>
  - The Azure CLI: <https://learn.microsoft.com/en-us/cli/azure/install-azure-cli>

## Starting the Application Locally

A [Docker compose](https://docs.docker.com/compose/) definition is provided (see [compose.yaml](compose.yaml)) to allow the individual application containers to be run locally.

With Docker installed, you can start the application with the following command:

```bash
docker compose up --build -d
```

This will build and then start the containers in the background. You can view the frontend application at [http://localhost:3000/](http://localhost:3000/) and the API at [http://localhost:5144/](http://localhost:5144/).

You can stop all of the containers with the following command:

```bash
docker compose down
```

## Deploying the Application Locally

[Terraform](https://developer.hashicorp.com/terraform) is used to define the infrastructure for the Fingertips application and allow for repeatable deployments of Fingertips environments. Fingertips' Terraform is defined in the [terraform](terraform) directory.

### Prerequisites

In order to store the Terraform state remotely we use an Azure storage container. You will need to create or locate one to be used to store the state and then create a `terraform/backend.tfvars` file with the following contents:

```terraform
resource_group_name  = "<state storage account's resource group>"
storage_account_name = "<state storage account name>"
```

Do not commit this file!

### Running the Terraform

With Terraform and the Azure CLI installed, you can do the following to deploy Fingertips from your local machine:

1. `cd terraform`
1. `az login` - Login to your Azure account (only required the first time you do this)
1. `terraform init -backend-config=backend.tfvars` - Initialise Terraform (only required the first time you do this)
1. `terraform plan -var=subscription_id=<Azure Subscription ID> -var=region=<Azure Region> -var=project=fingertips -var=docker_registry_server_url=<ACR registry server URL> -var=docker_registry_server_username=<ACR registry username> -var=docker_registry_server_password=<ACR registry password> -var=api_repository_name=<ACR repository name for API container> -var=frontend_repository_name=<ACR repository name for API container> -var=environment=<environment name>` - Show the changes that Terraform will make when `terraform apply` is run
1. `terraform apply -var=subscription_id=<Azure Subscription ID> -var=region=<Azure Region> -var=project=fingertips -var=docker_registry_server_url=<ACR registry server URL> -var=docker_registry_server_username=<ACR registry username> -var=docker_registry_server_password=<ACR registry password> -var=api_repository_name=<ACR repository name for API container> -var=frontend_repository_name=<ACR repository name for API container> -var=environment=<environment name>` - Deploy the infrastructure as defined in the Terraform files
1. `terraform destroy` - Remove the deployed infrastructure again

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
