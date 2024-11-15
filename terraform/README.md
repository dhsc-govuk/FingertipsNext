# Fingertips Terraform

Fingertips uses [Terraform](https://developer.hashicorp.com/terraform) to define the infrastructure for the application and allow for repeatable deployments of environments. The Fingertips Terraform configuration is split into two parts:

- Account-scoped resources, deployed once and shared between all Fingertips environments, defined in the [account](account) directory
- Environment-scoped resources, deployed for each Fingertips environment, defined in the [environment](environment) directory

## Prerequisites

To deploy the application from your local machine you will need the following tools:

- Terraform: <https://developer.hashicorp.com/terraform/install>
- The Azure CLI: <https://learn.microsoft.com/en-us/cli/azure/install-azure-cli>

In order to store the Terraform state remotely we use an Azure storage container. You will need to either create or locate a container to use, and then collect the following details:

- The container's name
- The name of the storage account the container belongs to
- The name of the resource group the storage account belongs to
