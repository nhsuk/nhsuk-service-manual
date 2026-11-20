mock_provider "azurerm" {}

variables {
  environment = "stag"
  app_name    = "service-manual"
}

run "use_configured_location_suffix" {
  command = plan

  variables {
    location = {
      short = "sou"
      long  = "uksouth"
    }
  }

  assert {
    condition = (
      output.web_app_name == "nhsuk-service-manual-app-stag-sou" &&
      azurerm_linux_web_app.app.location == "uksouth"
    )
    error_message = "The short location must determine the name suffix independently of the Azure region."
  }
}

run "accept_longest_staging_names" {
  command = plan

  variables {
    app_name = join("", [for i in range(38) : "a"])
  }

  assert {
    condition = (
      length(azurerm_service_plan.app.name) <= 60 &&
      length(azurerm_linux_web_app.app.name) <= 60
    )
    error_message = "A 38-character app name should produce staging plan and web app names within Azure's 60-character limit."
  }
}
