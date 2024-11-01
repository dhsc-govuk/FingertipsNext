terraform {
  backend "azurerm" {
    container_name = "tfstate"
  }
}

provider "azurerm" {
  subscription_id = var.subscription_id
  features {}
}
