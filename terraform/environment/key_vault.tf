data "azurerm_client_config" "current" {}

resource "azurerm_resource_group" "kv_rg" {
  name     = "${local.resource_prefix}-rg-kv"
  location = var.region
  tags     = local.tags
}

resource "azurerm_key_vault" "kv" {
  name                = "${local.resource_prefix}-kv"
  location            = var.region
  resource_group_name = azurerm_resource_group.kv_rg.name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  sku_name            = "standard"

  tags = local.tags
}

resource "azurerm_key_vault_access_policy" "terraform_kv_access_policy" {
  key_vault_id = azurerm_key_vault.kv.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = data.azurerm_client_config.current.object_id

  secret_permissions = [
    "Set",
    "Get",
    "Delete",
    "Purge"
  ]
}
