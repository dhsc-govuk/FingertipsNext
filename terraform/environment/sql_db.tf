resource "azurerm_mssql_database" "sql_db" {
  name                                = "${local.resource_prefix}-sqldb"
  server_id                           = azurerm_mssql_server.sql_server.id
  auto_pause_delay_in_minutes         = 60
  min_capacity                        = 0.5
  max_size_gb                         = 1
  sku_name                            = "GP_S_Gen5_1"
  storage_account_type                = "Local"
  transparent_data_encryption_enabled = true
  zone_redundant                      = false

  tags = local.tags
}
