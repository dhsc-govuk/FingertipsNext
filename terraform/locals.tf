locals {
  region_short    = "uks"
  naming_standard = "fingertips-${var.environment}-${local.region_short}"
  naming_short    = "ftn-${var.environment}-${local.region_short}"
  naming_shortest = "fingertips${local.region_short}"

  resource_group_core_resource_name         = "rg-fingertips-core-uks-001"
  resource_group_workload_resource_name     = "rg-${local.naming_standard}-001"
  container_app_user_assigned_identity_name = "uai-fingertips-core-uks-001"
  container_app_environment_resource_name   = "cae-${local.naming_standard}-002"
  key_vault_resource_name                   = "kv-${local.naming_short}-002"
  container_registry_resource_name          = "acrfingertipsuks001"

  secret_names = [
    for env_var in var.environment_variables :
    env_var.secret_name if env_var.secret_name != null
  ]

  container_app_secrets = [
    for secret_name in local.secret_names : {
      name                = secret_name
      key_vault_secret_id = data.azurerm_key_vault_secret.container_secrets[secret_name].id
      identity            = data.azurerm_user_assigned_identity.fingertips.id
    }
  ]

  common_tags = {
    "Cost Centre" = "24861 (Capital)"
    CreatedOnDate = var.build_time
    Department    = "Data Access and Platforms"
    Domain        = "dhscacp"
    Environment   = var.environment
    Project       = "FingertipsNext"
  }
}