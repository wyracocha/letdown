output "fqdn" {
  value = azurerm_container_app.example.latest_revision_fqdn
  description = "service url"
}