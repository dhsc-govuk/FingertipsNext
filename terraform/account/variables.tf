variable "project" {
  type        = string
  sensitive   = false
  description = "The name of the project being deployed."
  default     = "fingertips"
}

variable "region" {
  type        = string
  sensitive   = false
  description = "The Azure region to deploy resources to."
  default     = "uksouth"
}

variable "subscription_id" {
  type        = string
  sensitive   = true
  description = "The ID of the Azure subscription to deploy resources to."
}
