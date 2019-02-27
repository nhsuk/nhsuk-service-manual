provider "azurerm" {
  version = "=1.21.0"
}

variable "environment" {
  type = "string"
}

variable "app_service_names" {
  default = {
    production = "nhsuk-service-manual"
    staging = "nhsuk-service-manual-staging"
  }
}

variable "app_service_node_env" {
  default = {
    production = "production"
    staging = "staging"
  }
}

variable "manual_username" {
  type = "string"
}

variable "manual_password" {
  type = "string"
}

resource "azurerm_resource_group" "nhsuk-service-manual" {
  name     = "nhsuk-service-manual"
  location = "West Europe"
}

resource "azurerm_app_service_plan" "nhsuk-service-manual" {
  name                = "nhsuk-service-manual"
  location            = "${azurerm_resource_group.nhsuk-service-manual.location}"
  resource_group_name = "${azurerm_resource_group.nhsuk-service-manual.name}"
  kind                = "Linux"
  reserved            = true

  sku {
    tier = "Basic"
    size = "B1"
  }
}

resource "azurerm_app_service" "nhsuk-service-manual" {
  name                = "${var.app_service_names[var.environment]}"
  location            = "${azurerm_resource_group.nhsuk-service-manual.location}"
  resource_group_name = "${azurerm_resource_group.nhsuk-service-manual.name}"
  app_service_plan_id = "${azurerm_app_service_plan.nhsuk-service-manual.id}"
  https_only          = true

  site_config {
    http2_enabled    = true
    linux_fx_version = "NODE|lts"
  }

  app_settings {
    "NODE_ENV" = "${var.app_service_node_env[var.environment]}"
    "MANUAL_USERNAME" = "${var.manual_username}"
    "MANUAL_PASSWORD" = "${var.manual_password}"
  }
}