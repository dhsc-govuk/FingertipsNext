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

