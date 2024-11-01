
resource "azurerm_resource_group" "acarg" {
  name     = "${local.resource_prefix}-rg-aca"
  location = var.region
  tags     = local.tags
}

resource "azurerm_container_app_environment" "container_app_environment" {
  name                = "${local.resource_prefix}-container-app-environment"
  location            = var.region
  resource_group_name = azurerm_resource_group.acarg.name
  tags                = local.tags
}

resource "azurerm_container_app" "api_container_app" {
  name                         = "${local.resource_prefix}-api-ca"
  container_app_environment_id = azurerm_container_app_environment.container_app_environment.id
  resource_group_name          = azurerm_resource_group.acarg.name
  revision_mode                = "Single"
  tags                         = local.tags

  secret {
    name  = "${local.resource_prefix}-api-container-app-secret"
    value = var.registry_server_password
  }

  registry {
    server               = var.registry_server_url
    username             = var.registry_server_username
    password_secret_name = "${local.resource_prefix}-api-container-app-secret"
  }

  template {
    container {
      name   = "${local.resource_prefix}-api"
      image  = "${var.registry_server_url}/${var.api_repository_name}:${var.api_container_tag}"
      cpu    = 0.25
      memory = "0.5Gi"
    }
  }

  ingress {
    target_port      = 8080
    external_enabled = true
    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }
}

resource "azurerm_container_app" "frontend_container_app" {
  name                         = "${local.resource_prefix}-fe-ca"
  container_app_environment_id = azurerm_container_app_environment.container_app_environment.id
  resource_group_name          = azurerm_resource_group.acarg.name
  revision_mode                = "Single"
  tags                         = local.tags

  secret {
    name  = "${local.resource_prefix}-frontend-container-app-secret"
    value = var.registry_server_password
  }

  registry {
    server               = var.registry_server_url
    username             = var.registry_server_username
    password_secret_name = "${local.resource_prefix}-frontend-container-app-secret"
  }

  template {
    container {
      name   = "${local.resource_prefix}-api"
      image  = "${var.registry_server_url}/${var.frontend_repository_name}:${var.frontend_container_tag}"
      cpu    = 0.25
      memory = "0.5Gi"
    }
  }

  ingress {
    target_port      = 3000
    external_enabled = true
    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }
}

output "api_container_app_fqdn" {
  value = azurerm_container_app.api_container_app.ingress[*].fqdn
}

output "frontend_container_app_fqdn" {
  value = azurerm_container_app.frontend_container_app.ingress[*].fqdn
}
