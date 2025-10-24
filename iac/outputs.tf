output "fqdn" {
  value = azurerm_container_app.example.latest_revision_fqdn
  description = "service url"
}

# Outputs - URLs para acceder al sitio
output "website_url" {
  value       = azurerm_storage_account.stfront.primary_web_endpoint
  description = "URL pública del sitio web"
}

output "website_host" {
  value       = azurerm_storage_account.stfront.primary_web_host
  description = "Host del sitio web (para CNAME)"
}

output "storage_account_name" {
  value = azurerm_storage_account.stfront.name
}

# Mostrar la URL completa
output "acceso_directo" {
  value = "Accede a tu sitio en: ${azurerm_storage_account.stfront.primary_web_endpoint}"
}