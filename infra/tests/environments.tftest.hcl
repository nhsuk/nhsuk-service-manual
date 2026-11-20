mock_provider "azurerm" {
  mock_resource "azurerm_service_plan" {
    defaults = {
      id = "/subscriptions/00000000-0000-0000-0000-000000000001/resourceGroups/rg-test/providers/Microsoft.Web/serverFarms/asp-test"
    }
  }

  mock_resource "azurerm_linux_web_app" {
    defaults = {
      default_hostname = "service-manual-test.azurewebsites.net"
    }
  }
}

run "app_service_configuration" {
  command = apply

  variables {
    organisation = "example"
    tags         = { purpose = "terraform-tests" }
  }

  assert {
    condition = (
      azurerm_resource_group.app.name == "${var.organisation}-${var.app_name}-rg-${var.environment}-uks" &&
      azurerm_service_plan.app.name == "${var.organisation}-${var.app_name}-asp-${var.environment}-uks" &&
      azurerm_linux_web_app.app.name == "${var.organisation}-${var.app_name}-app-${var.environment}-uks"
    )
    error_message = "Names must follow the NHS.UK convention with the correct Azure resource abbreviation and UK South suffix."
  }

  assert {
    condition = alltrue([
      for resource in [azurerm_resource_group.app, azurerm_service_plan.app, azurerm_linux_web_app.app] :
      resource.location == "uksouth" && resource.tags == var.tags
    ])
    error_message = "All resources must be in UK South and carry the supplied tags."
  }

  assert {
    condition = (
      azurerm_service_plan.app.resource_group_name == azurerm_resource_group.app.name &&
      azurerm_linux_web_app.app.resource_group_name == azurerm_resource_group.app.name &&
      azurerm_linux_web_app.app.service_plan_id == azurerm_service_plan.app.id
    )
    error_message = "The app and plan must be in the same resource group, and the app must use that plan."
  }

  assert {
    condition = (
      azurerm_service_plan.app.os_type == "Linux" &&
      azurerm_service_plan.app.sku_name == (var.environment == "dev" ? "B1" : "P0v4") &&
      azurerm_service_plan.app.worker_count == 1 &&
      !azurerm_service_plan.app.zone_balancing_enabled
    )
    error_message = "The plan must use Linux with one worker, no zone balancing, and B1 for dev or P0v4 otherwise."
  }

  assert {
    condition = (
      azurerm_linux_web_app.app.site_config[0].application_stack[0].node_version == "26" &&
      azurerm_linux_web_app.app.site_config[0].app_command_line == "npm start" &&
      azurerm_linux_web_app.app.site_config[0].always_on &&
      azurerm_linux_web_app.app.app_settings["NODE_ENV"] == "production" &&
      azurerm_linux_web_app.app.app_settings["WEBSITE_RUN_FROM_PACKAGE"] == "1"
    )
    error_message = "The app must run the deployed package on Node 26 with npm start, production settings and Always On."
  }

  assert {
    condition = (
      azurerm_linux_web_app.app.public_network_access_enabled &&
      azurerm_linux_web_app.app.https_only &&
      azurerm_linux_web_app.app.site_config[0].http2_enabled &&
      contains(["1.2", "1.3"], azurerm_linux_web_app.app.site_config[0].minimum_tls_version) &&
      contains(["1.2", "1.3"], azurerm_linux_web_app.app.site_config[0].scm_minimum_tls_version) &&
      azurerm_linux_web_app.app.site_config[0].ftps_state == "Disabled" &&
      !azurerm_linux_web_app.app.ftp_publish_basic_authentication_enabled &&
      !azurerm_linux_web_app.app.webdeploy_publish_basic_authentication_enabled
    )
    error_message = "The app must offer public HTTPS using TLS 1.2 or higher, with HTTP/2 and without FTP or publishing basic auth."
  }

  assert {
    condition     = azurerm_linux_web_app.app.site_config[0].health_check_path == "/"
    error_message = "App Service must use the existing homepage as its health check."
  }

  assert {
    condition = (
      output.resource_group_name == azurerm_resource_group.app.name &&
      output.web_app_name == azurerm_linux_web_app.app.name &&
      output.web_app_default_hostname == "service-manual-test.azurewebsites.net"
    )
    error_message = "The outputs must identify the resource group, web app and its Azure hostname."
  }
}
