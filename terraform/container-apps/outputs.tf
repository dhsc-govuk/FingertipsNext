output "container_app_fqdn" {
  description = "The FQDN of the Container App's ingress."
  value       = azurerm_private_dns_a_record.this.fqdn
}

output "container_app_resource_id" {
  description = "The Resource ID of the container app."
  value       = azurerm_container_app.this.id
}
