variable "project" {
  type        = string
  sensitive   = false
  description = "The name of the project being deployed."
  default     = "fingertips"
}

variable "region" {
  type        = string
  sensitive   = false
  description = "The Azure region that resources will be deployed to."
  default     = "uksouth"
}

variable "environment" {
  type        = string
  sensitive   = false
  description = "The name of the environment to be deployed."
}

variable "subscription_id" {
  type        = string
  sensitive   = true
  description = "The ID of the Azure subscription that resources will be deployed to."
}

variable "registry_server_url" {
  type        = string
  sensitive   = false
  description = "The URL of the registry to pull container images from. E.g. <registry-name>.azurecr.io"
}

variable "registry_server_username" {
  type        = string
  sensitive   = true
  description = "The username to authenticate to the container registry server with."
}

variable "registry_server_password" {
  type        = string
  sensitive   = true
  description = "The password to authenticate to the container registry server with."
}

variable "api_repository_name" {
  type        = string
  sensitive   = false
  description = "The name of the repository within the container registry to pull API container images from."
  default     = "dhsc.fingertipsnext.api"
}

variable "api_container_tag" {
  type        = string
  sensitive   = false
  description = "The tag of the image to pull from the repository for the API container."
  default     = "latest"
}

variable "frontend_repository_name" {
  type        = string
  sensitive   = false
  description = "The name of the repository within the container registry to pull frontend container images from."
  default     = "dhsc.fingertipsnext.frontend"
}

variable "frontend_container_tag" {
  type        = string
  sensitive   = false
  description = "The tag of the image to pull from the repository for the frontend container."
  default     = "latest"
}


variable "ai_search_sku" {
  type        = string
  sensitive   = false
  description = "The pricing tier of the search service you want to create (for example, basic or standard)."
  default     = "free"
  validation {
    condition     = contains(["free", "basic", "standard", "standard2", "standard3", "storage_optimized_l1", "storage_optimized_l2"], var.ai_search_sku)
    error_message = "The sku must be one of the following values: free, basic, standard, standard2, standard3, storage_optimized_l1, storage_optimized_l2."
  }
}

variable "ai_search_replica_count" {
  type        = number
  sensitive   = false
  description = "Replicas distribute search workloads across the service. You need at least two replicas to support high availability of query workloads (not applicable to the free tier)."
  default     = 1
  validation {
    condition     = var.ai_search_replica_count >= 1 && var.ai_search_replica_count <= 12
    error_message = "The replica_count must be between 1 and 12."
  }
}

variable "ai_search_partition_count" {
  type        = number
  sensitive   = false
  description = "Partitions allow for scaling of document count as well as faster indexing by sharding your index over multiple search units."
  default     = 1
  validation {
    condition     = contains([1, 2, 3, 4, 6, 12], var.ai_search_partition_count)
    error_message = "The partition_count must be one of the following values: 1, 2, 3, 4, 6, 12."
  }
}

