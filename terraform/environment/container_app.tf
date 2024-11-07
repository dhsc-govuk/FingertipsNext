
resource "azurerm_resource_group" "aca_rg" {
  name     = "${local.resource_prefix}-rg-ca"
  location = var.region
  tags     = local.tags
}

resource "azurerm_container_app_environment" "container_app_environment" {
  name                = "${local.resource_prefix}-cae"
  location            = var.region
  resource_group_name = azurerm_resource_group.aca_rg.name
  tags                = local.tags
}

resource "azurerm_container_app" "api_container_app" {
  name                         = "${local.resource_prefix}-ca-api"
  container_app_environment_id = azurerm_container_app_environment.container_app_environment.id
  resource_group_name          = azurerm_resource_group.aca_rg.name
  revision_mode                = "Single"
  tags                         = local.tags

  secret {
    name  = "${local.resource_prefix}-ca-api-secret"
    value = var.registry_server_password
  }

  registry {
    server               = var.registry_server_url
    username             = var.registry_server_username
    password_secret_name = "${local.resource_prefix}-ca-api-secret"
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
  name                         = "${local.resource_prefix}-ca-fe"
  container_app_environment_id = azurerm_container_app_environment.container_app_environment.id
  resource_group_name          = azurerm_resource_group.aca_rg.name
  revision_mode                = "Single"
  tags                         = local.tags

  secret {
    name  = "${local.resource_prefix}-ca-frontend-secret"
    value = var.registry_server_password
  }

  registry {
    server               = var.registry_server_url
    username             = var.registry_server_username
    password_secret_name = "${local.resource_prefix}-ca-frontend-secret"
  }

  template {
    container {
      name   = "${local.resource_prefix}-api"
      image  = "${var.registry_server_url}/${var.frontend_repository_name}:${var.frontend_container_tag}"
      cpu    = 0.25
      memory = "0.5Gi"
      env {
        name  = "FINGERTIPS_API_URL"
        value = "http://${azurerm_container_app.api_container_app.ingress[0].fqdn}"
      }
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
