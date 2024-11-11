resource "azurerm_resource_group" "sql_rg" {
  name     = "${local.resource_prefix}-rg-sql"
  location = var.region
  tags     = local.tags
}

resource "random_string" "sql_server_username" {
  length = 16
}

resource "azurerm_key_vault_secret" "sql_server_username_secret" {
  depends_on = [azurerm_key_vault_access_policy.terraform_kv_access_policy]

  name         = "${local.resource_prefix}-kvs-sql-username"
  value        = random_string.sql_server_username.result
  key_vault_id = azurerm_key_vault.kv.id
  tags         = local.tags
}

resource "random_password" "sql_server_password" {
  length      = 16
  lower       = true
  min_lower   = 1
  numeric     = true
  min_numeric = 1
  upper       = true
  min_upper   = 1
  special     = true
  min_special = 1
}

resource "azurerm_key_vault_secret" "sql_server_password_secret" {
  depends_on = [azurerm_key_vault_access_policy.terraform_kv_access_policy]

  name         = "${local.resource_prefix}-kvs-sql-password"
  value        = random_password.sql_server_password.result
  key_vault_id = azurerm_key_vault.kv.id
  tags         = local.tags
}

resource "azurerm_mssql_server" "sql_server" {
  name                = "${local.resource_prefix}-sql"
  resource_group_name = azurerm_resource_group.sql_rg.name
  location            = var.region

  administrator_login           = random_string.sql_server_username.result
  administrator_login_password  = random_password.sql_server_password.result
  public_network_access_enabled = true
  version                       = "12.0"

  tags = local.tags
}

resource "azurerm_mssql_firewall_rule" "sql_server_firewall_rule_allow_azure_services" {
  name             = "${local.resource_prefix}-sql-fwr-azure-services"
  server_id        = azurerm_mssql_server.sql_server.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}
