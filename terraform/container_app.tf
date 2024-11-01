
resource "azurerm_resource_group" "acarg" {
  name     = "${var.project}-rg-aca"
  location = var.region
}

resource "azurerm_container_app_environment" "container_app_environment" {
  name                = "${var.project}-container-app-environment"
  location            = var.region
  resource_group_name = azurerm_resource_group.acarg.name
}

resource "azurerm_container_app" "api_container_app" {
  name                         = "${var.project}-api-container-app"
  container_app_environment_id = azurerm_container_app_environment.container_app_environment.id
  resource_group_name          = azurerm_resource_group.acarg.name
  revision_mode                = "Single"

  secret {
    name  = "${var.project}-api-container-app-secret"
    value = var.docker_registry_server_password
  }

  registry {
    server               = var.docker_registry_server_url
    username             = var.docker_registry_server_username
    password_secret_name = "${var.project}-api-container-app-secret"
  }

  template {
    container {
      name   = "${var.project}-api"
      image  = "${var.docker_registry_server_url}/${var.api_repository_name}:${var.api_container_tag}"
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
  name                         = "${var.project}-fe-container-app"
  container_app_environment_id = azurerm_container_app_environment.container_app_environment.id
  resource_group_name          = azurerm_resource_group.acarg.name
  revision_mode                = "Single"

  secret {
    name  = "${var.project}-frontend-container-app-secret"
    value = var.docker_registry_server_password
  }

  registry {
    server               = var.docker_registry_server_url
    username             = var.docker_registry_server_username
    password_secret_name = "${var.project}-frontend-container-app-secret"
  }

  template {
    container {
      name   = "${var.project}-api"
      image  = "${var.docker_registry_server_url}/${var.frontend_repository_name}:${var.frontend_container_tag}"
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
  value = azurerm_container_app.api_container_app.latest_revision_fqdn
}

output "frontend_container_app_fqdn" {
  value = azurerm_container_app.frontend_container_app.latest_revision_fqdn
}
