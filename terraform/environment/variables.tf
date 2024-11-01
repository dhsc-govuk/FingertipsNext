variable "region" {
  type      = string
  sensitive = false
}

variable "project" {
  type      = string
  sensitive = false
}

variable "environment" {
  type      = string
  sensitive = false
}

variable "subscription_id" {
  type      = string
  sensitive = true
}

variable "docker_registry_server_url" {
  type      = string
  sensitive = false
}

variable "docker_registry_server_username" {
  type      = string
  sensitive = true
}

variable "docker_registry_server_password" {
  type      = string
  sensitive = true
}

variable "api_repository_name" {
  type      = string
  sensitive = false
}

variable "api_container_tag" {
  type      = string
  sensitive = false
}

variable "frontend_repository_name" {
  type      = string
  sensitive = false
}

variable "frontend_container_tag" {
  type      = string
  sensitive = false
}

