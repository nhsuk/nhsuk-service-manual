output "resource_group_name" {
  description = "Resource group containing the plan and web app."
  value       = azurerm_resource_group.app.name
}

output "web_app_name" {
  description = "Name of the web app to deploy the application to."
  value       = azurerm_linux_web_app.app.name
}

output "web_app_default_hostname" {
  description = "Default Azure hostname of the web app."
  value       = azurerm_linux_web_app.app.default_hostname
}
