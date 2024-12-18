resource "azurerm_resource_group" "az_search_rg" {
  name     = "${local.resource_prefix}-rg-search"
  location = var.region
  tags = local.tags
}

resource "azurerm_search_service" "search" {
  name                = "${local.resource_prefix}-az-search"
  resource_group_name = azurerm_resource_group.az_search_rg.name
  location            = azurerm_resource_group.az_search_rg.location
  sku                 = var.ai_search_sku
  replica_count       = var.ai_search_replica_count
  partition_count     = var.ai_search_partition_count
}
