terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=4.14.0"
    }
  }
  backend "azurerm" {}
}

provider "azurerm" {
  resource_provider_registrations = "none"
  subscription_id                 = "004cc465-f42b-4193-b4f5-896b4295792b"
  features {}
}