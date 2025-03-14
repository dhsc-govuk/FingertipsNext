locals {
  container_apps = {
    name                         = var.container_name
    resource_group_name          = data.azurerm_resource_group.workload.name
    tags                         = local.common_tags
    revision_mode                = "Single"
    container_app_environment_id = data.azurerm_container_app_environment.fingertips.id
    template = {
      init_containers = []
      containers = [
        {
          name    = var.container_name
          image   = "${data.azurerm_container_registry.fingertips.login_server}/${var.container_image_tag}"
          args    = []
          command = []
          cpu     = var.container_cpu
          memory  = var.container_memory
          env     = var.environment_variables

          liveness_probe = var.liveness_probe

          volume_mounts = []
        }
      ]
      min_replicas    = var.min_replicas
      max_replicas    = var.max_replicas
      revision_suffix = var.revision_suffix
      volume          = []
    }

    ingress = {
      allow_insecure_connections = true
      external_enabled           = true
      target_port                = var.container_port
      exposed_port               = var.container_port
      transport                  = "http"
      traffic_weight = {
        percentage      = 100
        latest_revision = true
      }
      custom_domain = []
    }

    identity = {
      type = "UserAssigned"
      identity_ids = [
        data.azurerm_user_assigned_identity.fingertips.id
      ]
    }

    registry = [
      {
        server   = data.azurerm_container_registry.fingertips.login_server
        identity = data.azurerm_user_assigned_identity.fingertips.id
      }
    ]
  }
}
