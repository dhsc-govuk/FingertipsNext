variable "core_resource_group_name" {
  type        = string
  description = "Core Resource Group Name"
}

variable "container_app_environment_domain_suffix" {
  type        = string
  description = "Domain Suffix of the Container App Environment used for DNS registration"
}

variable "container_app_environment_private_ip" {
  type        = string
  description = "Private IP of the Container App Environment used for DNS registration"
}

variable "container_app_secrets" {
  description = "(Optional) The secrets of the container apps hosted in Key Vault."
  type = list(object({
    name                = string
    key_vault_secret_id = string
    identity            = string
  }))
  default   = []
  nullable  = false
  sensitive = true
}

variable "container_apps" {
  type = object({
    name                         = string
    tags                         = optional(map(string))
    revision_mode                = string
    workload_profile_name        = optional(string)
    container_app_environment_id = string
    resource_group_name          = string

    template = object({
      init_containers = optional(set(object({
        args    = optional(list(string))
        command = optional(list(string))
        cpu     = optional(number)
        image   = string
        name    = string
        memory  = optional(string)
        env = optional(list(object({
          name        = string
          secret_name = optional(string)
          value       = optional(string)
        })))
        volume_mounts = optional(list(object({
          name = string
          path = string
        })))
      })), [])
      containers = set(object({
        name    = string
        image   = string
        args    = optional(list(string))
        command = optional(list(string))
        cpu     = string
        memory  = string
        env = optional(set(object({
          name        = string
          secret_name = optional(string)
          value       = optional(string)
        })))
        liveness_probe = optional(object({
          failure_count_threshold = optional(number)
          header = optional(object({
            name  = string
            value = string
          }))
          host             = optional(string)
          initial_delay    = optional(number, 1)
          interval_seconds = optional(number, 10)
          path             = optional(string)
          port             = number
          timeout          = optional(number, 1)
          transport        = string
        }))
        readiness_probe = optional(object({
          failure_count_threshold = optional(number)
          header = optional(object({
            name  = string
            value = string
          }))
          host                    = optional(string)
          interval_seconds        = optional(number, 10)
          path                    = optional(string)
          port                    = number
          success_count_threshold = optional(number, 3)
          timeout                 = optional(number)
          transport               = string
        }))
        startup_probe = optional(object({
          failure_count_threshold = optional(number)
          header = optional(object({
            name  = string
            value = string
          }))
          host             = optional(string)
          interval_seconds = optional(number, 10)
          path             = optional(string)
          port             = number
          timeout          = optional(number)
          transport        = string
        }))
        volume_mounts = optional(list(object({
          name = string
          path = string
        })))
      }))
      max_replicas    = optional(number)
      min_replicas    = optional(number)
      revision_suffix = optional(string)

      volume = optional(set(object({
        name         = string
        storage_name = optional(string)
        storage_type = optional(string)
      })))

      custom_scale_rules = optional(list(object({
        name             = string
        custom_rule_type = string
        metadata         = map(string)
        }))
      )
    })

    ingress = optional(object({
      allow_insecure_connections = optional(bool, false)
      external_enabled           = optional(bool, false)
      target_port                = number
      exposed_port               = optional(number)
      transport                  = optional(string)
      traffic_weight = object({
        label           = optional(string)
        latest_revision = optional(string)
        revision_suffix = optional(string)
        percentage      = number
      })
      custom_domain = optional(list(object({
        certificate_binding_type = optional(string)
        certificate_id           = string
        name                     = string
      })))
    }))

    identity = optional(object({
      type         = string
      identity_ids = optional(list(string))
    }))

    dapr = optional(object({
      app_id       = string
      app_port     = number
      app_protocol = optional(string)
    }))

    registry = optional(list(object({
      server               = string
      username             = optional(string)
      password_secret_name = optional(string)
      identity             = optional(string)
    })))
  })
  description = "The container apps to deploy."
  nullable    = false

  validation {
    condition     = length(var.container_apps) >= 1
    error_message = "At least one container should be provided."
  }
}