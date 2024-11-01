# Environment-Scoped Resources

This directory contains Fingertips' environment-scoped Terraform resources. These are resources that are deployed for each individual Fingertips environment.

## Deploying Resources from a Local Machine

It is possible to deploy the environment-scoped resources from your local machine.

First, you will need to create or locate an Azure storage container to be used to store the state and then create a `backend.tfvars` file in this directory with the following contents:

```terraform
resource_group_name  = "<state storage account's resource group>"
storage_account_name = "<state storage account's name>"
container_name       = "<state storage container's name>
key                  = "terraform-<environment name>.tfstate"
```

The environment name set in the `key` value must be a unique name for this environment within the Azure subscription, to prevent Terraform from attempting to use the state for an existing environment.

Next, to avoid having to specify configuration variables on the command line repeatedly, you will need to create a `.tfvars` file containing your configuration values. The easiest way is to copy the [example.tfvars](example.tfvars) file to one named for the environment you want to deploy to (e.g. `environment-name.tfvars`) and update the values specified in it to match your subscription.

Neither of these `.tfvars` files should be comitted (they will be automatically ignored by Git due to our .gitignore configuration), as they will contain sensitive information.

### Running the Terraform

Run the following commands from this directory to deploy Fingertips' account-scoped resources from your local machine.

#### Log into Azure

Only required the first time you do this, or if your authentication has expired.

```bash
az login
```

#### Initialise Terraform

Only required the first time you do this.

```bash
terraform init -backend-config="backend.tfvars"
```

#### Create Resources

Assuming you have created a variable definitions file called `environment-name.tfvars` the following command will create resources in Azure for you. You'll be given a chance to preview the changes first, but you can always use the `terraform plan` command (by substituting `plan` for `apply` in the below command) to see a preview as well.

```bash
terraform apply -var-file="environment-name.tfvars"
```

#### Removing Resources

You can use the `terraform destroy` command to delete the Azure resources created by this terraform.

```bash
terraform destroy -var-file="environment-name.tfvars"
```
