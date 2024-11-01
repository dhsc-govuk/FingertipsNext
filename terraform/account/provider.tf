terraform {
  backend "azurerm" {
    key = "terraform-account.tfstate"
  }
}

provider "azurerm" {
  subscription_id = var.subscription_id
  features {}
}
