terraform {
  backend "azurerm" {
    container_name = "tfstate"
    key            = "terraform.tfstate"
  }
}

provider "azurerm" {
  subscription_id = var.subscription_id
  features {}
}
