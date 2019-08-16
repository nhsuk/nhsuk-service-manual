provider "azurerm" {
  version = "=1.32.1"
}

variable "environment" {
  type = string
}

variable "app_service_names" {
  default = {
    production = "nhsuk-service-manual"
    staging    = "nhsuk-service-manual-staging"
  }
}

variable "app_service_node_env" {
  default = {
    production = "production"
    staging    = "staging"
  }
}

variable "manual_username" {
  type = string
}

variable "manual_password" {
  type = string
}

data "azurerm_resource_group" "nhsuk-service-manual" {
  name     = "nhsuk-service-manual"
}

data "azurerm_app_service_plan" "nhsuk-service-manual" {
  name                = "nhsuk-service-manual"
  resource_group_name = data.azurerm_resource_group.nhsuk-service-manual.name
}

resource "azurerm_app_service" "nhsuk-service-manual" {
  name                = lookup(var.app_service_names, var.environment, "nhsuk-service-manual-${var.environment}")
  location            = data.azurerm_resource_group.nhsuk-service-manual.location
  resource_group_name = data.azurerm_resource_group.nhsuk-service-manual.name
  app_service_plan_id = data.azurerm_app_service_plan.nhsuk-service-manual.id
  https_only          = true

  site_config {
    http2_enabled    = true
    linux_fx_version = "NODE|lts"
  }

  app_settings = {
    "NODE_ENV"        = lookup(var.app_service_node_env, var.environment, "staging")
    "MANUAL_USERNAME" = var.manual_username
    "MANUAL_PASSWORD" = var.manual_password
  }
}

