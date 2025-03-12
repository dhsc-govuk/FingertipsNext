variable "environment" {
  type        = string
  default     = "uksouth"
  description = "Region where the resources are deployed to."
}

variable "build_time" {
  type        = string
  default     = "null"
  description = "Build time passed through from GitHub Actions."
}

variable "container_name" {
  description = "The name of the container app."
  type        = string
}

variable "container_image_tag" {
  description = "The tag of the container image to deploy."
  type        = string
}

variable "container_cpu" {
  description = "The CPU allocation for the container."
  type        = number
  default     = 0.5
}

variable "container_memory" {
  description = "The memory allocation for the container."
  type        = string
  default     = "1Gi"
}

variable "environment_variables" {
  description = "A list of environment variables for the container."
  type = list(object({
    name        = string
    value       = optional(string)
    secret_name = optional(string)
  }))
  default = []
}

variable "liveness_probe" {
  description = "Configuration for the container's liveness probe."
  type = object({
    path      = optional(string)
    port      = optional(number)
    transport = optional(string)
  })
  default = {}
}

variable "readiness_probe" {
  description = "Configuration for the container's readiness probe."
  type = object({
    path      = optional(string)
    port      = optional(number)
    transport = optional(string)
  })
  default = {}
}

variable "startup_probe" {
  description = "Configuration for the container's startup probe."
  type = object({
    path      = optional(string)
    port      = optional(number)
    transport = optional(string)
  })
  default = {}
}

variable "min_replicas" {
  description = "The minimum number of replicas for the container app."
  type        = number
  default     = 1
}

variable "max_replicas" {
  description = "The maximum number of replicas for the container app."
  type        = number
  default     = 10
}

variable "revision_suffix" {
  description = "The revision suffix for the container app."
  type        = string
  default     = ""
}

variable "container_port" {
  description = "The port on which the container listens."
  type        = number
}

variable "container_app_secrets" {
  description = "A space-separated list of Key Vault secret names to look up."
  type        = string
  default     = ""
}