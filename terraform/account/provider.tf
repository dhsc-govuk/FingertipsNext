terraform {
  backend "azurerm" {
    container_name = "tfstate"
    key            = "terraform-account.tfstate"
  }
}

provider "azurerm" {
  subscription_id = var.subscription_id
  features {}
}
