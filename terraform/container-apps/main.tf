resource "azurerm_container_app" "this" {
  container_app_environment_id = var.container_apps.container_app_environment_id
  name                         = var.container_apps.name
  resource_group_name          = var.container_apps.resource_group_name
  revision_mode                = var.container_apps.revision_mode
  workload_profile_name        = var.container_apps.workload_profile_name
  tags                         = var.container_apps.tags

  template {
    max_replicas    = var.container_apps.template.max_replicas
    min_replicas    = var.container_apps.template.min_replicas
    revision_suffix = var.container_apps.template.revision_suffix

    dynamic "container" {
      for_each = var.container_apps.template.containers

      content {
        cpu     = container.value.cpu
        image   = container.value.image
        memory  = container.value.memory
        name    = container.value.name
        args    = container.value.args
        command = container.value.command

        dynamic "env" {
          for_each = container.value.env == null ? [] : container.value.env

          content {
            name        = env.value.name
            secret_name = env.value.secret_name
            value       = env.value.value
          }
        }
        dynamic "liveness_probe" {
          for_each = container.value.liveness_probe == null ? [] : [container.value.liveness_probe]

          content {
            port                    = liveness_probe.value.port
            transport               = liveness_probe.value.transport
            failure_count_threshold = liveness_probe.value.failure_count_threshold
            host                    = liveness_probe.value.host
            initial_delay           = liveness_probe.value.initial_delay
            interval_seconds        = liveness_probe.value.interval_seconds
            path                    = liveness_probe.value.path
            timeout                 = liveness_probe.value.timeout

            dynamic "header" {
              for_each = liveness_probe.value.header == null ? [] : [liveness_probe.value.header]

              content {
                name  = header.value.name
                value = header.value.value
              }
            }
          }
        }
        dynamic "readiness_probe" {
          for_each = container.value.readiness_probe == null ? [] : [container.value.readiness_probe]

          content {
            port                    = readiness_probe.value.port
            transport               = readiness_probe.value.transport
            failure_count_threshold = readiness_probe.value.failure_count_threshold
            host                    = readiness_probe.value.host
            interval_seconds        = readiness_probe.value.interval_seconds
            path                    = readiness_probe.value.path
            success_count_threshold = readiness_probe.value.success_count_threshold
            timeout                 = readiness_probe.value.timeout

            dynamic "header" {
              for_each = readiness_probe.value.header == null ? [] : [readiness_probe.value.header]

              content {
                name  = header.value.name
                value = header.value.value
              }
            }
          }
        }
        dynamic "startup_probe" {
          for_each = container.value.startup_probe == null ? [] : [container.value.startup_probe]

          content {
            port                    = startup_probe.value.port
            transport               = startup_probe.value.transport
            failure_count_threshold = startup_probe.value.failure_count_threshold
            host                    = startup_probe.value.host
            interval_seconds        = startup_probe.value.interval_seconds
            path                    = startup_probe.value.path
            timeout                 = startup_probe.value.timeout

            dynamic "header" {
              for_each = startup_probe.value.header == null ? [] : [startup_probe.value.header]

              content {
                name  = header.value.name
                value = header.value.name
              }
            }
          }
        }
        dynamic "volume_mounts" {
          for_each = container.value.volume_mounts == null ? [] : container.value.volume_mounts

          content {
            name = volume_mounts.value.name
            path = volume_mounts.value.path
          }
        }
      }
    }
    dynamic "init_container" {
      for_each = var.container_apps.template.init_containers == null ? [] : var.container_apps.template.init_containers

      content {
        args    = init_container.value.args
        command = init_container.value.command
        cpu     = init_container.value.cpu
        image   = init_container.value.image
        memory  = init_container.value.memory
        name    = init_container.value.name

        dynamic "env" {
          for_each = init_container.value.env == null ? [] : init_container.value.env
          content {
            name        = env.value.name
            secret_name = env.value.secret_name
            value       = env.value.value
          }
        }
        dynamic "volume_mounts" {
          for_each = init_container.value.volume_mounts == null ? [] : init_container.value.volume_mounts
          content {
            name = volume_mounts.value.name
            path = volume_mounts.value.path
          }
        }
      }
    }
    dynamic "volume" {
      for_each = var.container_apps.template.volume == null ? [] : var.container_apps.template.volume

      content {
        name         = volume.value.name
        storage_name = volume.value.storage_name
        storage_type = volume.value.storage_type
      }
    }

    dynamic "custom_scale_rule" {
      for_each = var.container_apps.template.custom_scale_rules == null ? [] : var.container_apps.template.custom_scale_rules

      content {
        name             = custom_scale_rule.value.name
        custom_rule_type = custom_scale_rule.value.custom_rule_type
        metadata         = custom_scale_rule.value.metadata
      }

    }
  }
  dynamic "dapr" {
    for_each = var.container_apps.dapr == null ? [] : [var.container_apps.dapr]

    content {
      app_id       = dapr.value.app_id
      app_port     = dapr.value.app_port
      app_protocol = dapr.value.app_protocol
    }
  }
  dynamic "identity" {
    for_each = var.container_apps.identity == null ? [] : [var.container_apps.identity]

    content {
      type         = identity.value.type
      identity_ids = identity.value.identity_ids
    }
  }
  dynamic "ingress" {
    for_each = var.container_apps.ingress == null ? [] : [var.container_apps.ingress]

    content {
      target_port                = ingress.value.target_port
      allow_insecure_connections = ingress.value.allow_insecure_connections
      external_enabled           = ingress.value.external_enabled
      transport                  = ingress.value.transport
      exposed_port               = ingress.value.transport == "tcp" ? ingress.value.exposed_port : null
      dynamic "traffic_weight" {
        for_each = ingress.value.traffic_weight == null ? [] : [ingress.value.traffic_weight]

        content {
          percentage      = traffic_weight.value.percentage
          label           = traffic_weight.value.label
          latest_revision = traffic_weight.value.latest_revision
          revision_suffix = traffic_weight.value.revision_suffix
        }
      }

      dynamic "custom_domain" {
        for_each = ingress.value.custom_domain == null ? [] : ingress.value.custom_domain

        content {
          certificate_binding_type = custom_domain.value.certificate_binding_type
          certificate_id           = custom_domain.value.certificate_id
          name                     = custom_domain.value.name
        }
      }
    }
  }
  dynamic "registry" {
    for_each = var.container_apps.registry == null ? [] : var.container_apps.registry

    content {
      server               = registry.value.server
      identity             = registry.value.identity
      password_secret_name = registry.value.password_secret_name
      username             = registry.value.username
    }
  }

  dynamic "secret" {
    for_each = nonsensitive(var.container_app_secrets)

    content {
      name                = secret.value.name
      key_vault_secret_id = secret.value.key_vault_secret_id
      identity            = secret.value.identity
    }
  }
}

resource "azurerm_private_dns_a_record" "this" {
  name                = azurerm_container_app.this.name
  resource_group_name = var.core_resource_group_name
  zone_name           = var.container_app_environment_domain_suffix
  ttl                 = 300
  records             = [var.container_app_environment_private_ip]
}