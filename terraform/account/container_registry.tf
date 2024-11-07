resource "azurerm_resource_group" "acrrg" {
  name     = "${var.project}-rg-acr"
  location = var.region
  tags     = local.tags
}

resource "azurerm_container_registry" "acr" {
  name                = "${var.project}Registry"
  resource_group_name = azurerm_resource_group.acrrg.name
  location            = azurerm_resource_group.acrrg.location
  sku                 = "Basic"
  admin_enabled       = true
  tags                = local.tags
}
