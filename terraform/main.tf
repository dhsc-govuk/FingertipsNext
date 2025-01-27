module "container_app" {
  source                                  = "./container-apps"
  container_app_secrets                   = local.container_app_secrets
  container_apps                          = local.container_apps
  container_app_environment_domain_suffix = data.azurerm_container_app_environment.fingertips.default_domain
  container_app_environment_private_ip    = data.azurerm_container_app_environment.fingertips.static_ip_address
  core_resource_group_name                = data.azurerm_resource_group.core.name
}