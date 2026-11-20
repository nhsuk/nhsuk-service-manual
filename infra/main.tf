locals {
  resource_name_format = "${var.organisation}-${var.app_name}-%s-${var.environment}-${var.location.short}"
}

resource "azurerm_resource_group" "app" {
  name     = format(local.resource_name_format, "rg")
  location = var.location.long
  tags     = var.tags
}

resource "azurerm_service_plan" "app" {
  # checkov:skip=CKV_AZURE_212:Both environments intentionally run on a single worker without failover.
  # checkov:skip=CKV_AZURE_225:Zone redundancy requires more than the single worker specified for each environment.
  name                   = format(local.resource_name_format, "asp")
  resource_group_name    = azurerm_resource_group.app.name
  location               = azurerm_resource_group.app.location
  os_type                = "Linux"
  sku_name               = var.app_service_sku
  worker_count           = 1
  zone_balancing_enabled = false
  tags                   = var.tags
}

resource "azurerm_linux_web_app" "app" {
  # checkov:skip=CKV_AZURE_13:The service manual is public and does not require visitor sign-in.
  # checkov:skip=CKV_AZURE_17:Public visitors are not required to present client certificates.
  # checkov:skip=CKV_AZURE_222:The service manual is intentionally accessible over public HTTPS.
  # checkov:skip=CKV_AZURE_16:The app does not authenticate to other Azure resources.
  # checkov:skip=CKV_AZURE_71:The app does not need a managed identity because it does not access other Azure resources.
  # checkov:skip=CKV_AZURE_63:App Service HTTP request logging is outside the agreed diagnostics scope.
  # checkov:skip=CKV_AZURE_65:Detailed App Service error logging is outside the agreed diagnostics scope.
  # checkov:skip=CKV_AZURE_66:App Service failed-request tracing is outside the agreed diagnostics scope.
  # checkov:skip=CKV_AZURE_88:The read-only deployment package does not need an Azure Files mount.
  name                                           = format(local.resource_name_format, "app")
  resource_group_name                            = azurerm_resource_group.app.name
  location                                       = azurerm_resource_group.app.location
  service_plan_id                                = azurerm_service_plan.app.id
  https_only                                     = true
  public_network_access_enabled                  = true
  ftp_publish_basic_authentication_enabled       = false
  webdeploy_publish_basic_authentication_enabled = false
  tags                                           = var.tags

  app_settings = {
    NODE_ENV                 = "production"
    WEBSITE_RUN_FROM_PACKAGE = "1"
  }

  site_config {
    always_on                         = true
    app_command_line                  = "npm start"
    ftps_state                        = "Disabled"
    health_check_path                 = "/"
    health_check_eviction_time_in_min = 10
    http2_enabled                     = true
    minimum_tls_version               = "1.2"
    scm_minimum_tls_version           = "1.2"

    application_stack {
      node_version = var.node_version
    }
  }
}
