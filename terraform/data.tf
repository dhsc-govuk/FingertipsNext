data "azurerm_client_config" "current" {}

data "azurerm_resource_group" "workload" {
  name = local.resource_group_workload_resource_name
}

data "azurerm_resource_group" "core" {
  name = local.resource_group_core_resource_name
}

data "azurerm_user_assigned_identity" "fingertips" {
  name                = local.container_app_user_assigned_identity_name
  resource_group_name = data.azurerm_resource_group.core.name
}

data "azurerm_container_app_environment" "fingertips" {
  name                = local.container_app_environment_resource_name
  resource_group_name = data.azurerm_resource_group.workload.name
}

data "azurerm_container_registry" "fingertips" {
  name                = local.container_registry_resource_name
  resource_group_name = data.azurerm_resource_group.core.name
}

data "azurerm_key_vault" "fingertips" {
  name                = local.key_vault_resource_name
  resource_group_name = data.azurerm_resource_group.workload.name
}

data "azurerm_key_vault_secret" "container_secrets" {
  for_each = toset(local.secret_names)

  name         = each.key
  key_vault_id = data.azurerm_key_vault.fingertips.id
}