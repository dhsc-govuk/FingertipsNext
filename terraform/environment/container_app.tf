
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

resource "azurerm_container_app" "frontend_container_app" {
  name                         = "${local.resource_prefix}-ca-fe"
  container_app_environment_id = azurerm_container_app_environment.container_app_environment.id
  resource_group_name          = azurerm_resource_group.aca_rg.name
  revision_mode                = "Single"
  tags                         = local.tags

  secret {
    name  = "${local.resource_prefix}-ca-frontend-registry-password"
    value = var.registry_server_password
  }

  registry {
    server               = var.registry_server_url
    username             = var.registry_server_username
    password_secret_name = "${local.resource_prefix}-ca-frontend-registry-password"
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

resource "azurerm_user_assigned_identity" "api_container_app_identity" {
  name                = "${local.resource_prefix}-ca-api-identity"
  location            = var.region
  resource_group_name = azurerm_resource_group.aca_rg.name

  tags = local.tags
}

resource "azurerm_key_vault_access_policy" "api_container_app_kv_access_policy" {
  key_vault_id = azurerm_key_vault.kv.id
  tenant_id    = azurerm_key_vault.kv.tenant_id
  object_id    = azurerm_user_assigned_identity.api_container_app_identity.principal_id

  secret_permissions = [
    "Get",
  ]
}

resource "azurerm_container_app" "api_container_app" {
  depends_on = [azurerm_key_vault_access_policy.api_container_app_kv_access_policy]

  name                         = "${local.resource_prefix}-ca-api"
  container_app_environment_id = azurerm_container_app_environment.container_app_environment.id
  resource_group_name          = azurerm_resource_group.aca_rg.name
  revision_mode                = "Single"
  tags                         = local.tags

  secret {
    name  = "${local.resource_prefix}-ca-api-registry-password"
    value = var.registry_server_password
  }

  secret {
    name                = "${local.resource_prefix}-ca-api-db-username"
    identity            = azurerm_user_assigned_identity.api_container_app_identity.id
    key_vault_secret_id = azurerm_key_vault_secret.sql_server_username_secret.id
  }

  secret {
    name                = "${local.resource_prefix}-ca-api-db-password"
    identity            = azurerm_user_assigned_identity.api_container_app_identity.id
    key_vault_secret_id = azurerm_key_vault_secret.sql_server_password_secret.id
  }

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.api_container_app_identity.id]
  }

  registry {
    server               = var.registry_server_url
    username             = var.registry_server_username
    password_secret_name = "${local.resource_prefix}-ca-api-registry-password"
  }

  template {
    container {
      name   = "${local.resource_prefix}-api"
      image  = "${var.registry_server_url}/${var.api_repository_name}:${var.api_container_tag}"
      cpu    = 0.25
      memory = "0.5Gi"

      env {
        name        = "DB_USER"
        secret_name = "${local.resource_prefix}-ca-api-db-username"
      }
      env {
        name        = "DB_PASSWORD"
        secret_name = "${local.resource_prefix}-ca-api-db-password"
      }
      env {
        name  = "DB_SERVER"
        value = azurerm_mssql_server.sql_server.fully_qualified_domain_name
      }
      env {
        name  = "DB_NAME"
        value = azurerm_mssql_database.sql_db.name
      }
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

output "frontend_container_app_fqdn" {
  value = azurerm_container_app.frontend_container_app.ingress[*].fqdn
}
output "api_container_app_fqdn" {
  value = azurerm_container_app.api_container_app.ingress[*].fqdn
}
