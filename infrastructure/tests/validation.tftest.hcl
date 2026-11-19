mock_provider "azurerm" {}

variables {
  environment = "stag"
  app_name    = "service-manual"
}

run "reject_unknown_environment" {
  command = plan

  variables {
    environment = "unknown"
  }

  expect_failures = [var.environment]
}

run "reject_other_region" {
  command = plan

  variables {
    location = {
      short = "ukw"
      long  = "ukwest"
    }
  }

  expect_failures = [var.location]
}

run "reject_invalid_location_suffix" {
  command = plan

  variables {
    location = {
      short = "uk"
      long  = "uksouth"
    }
  }

  expect_failures = [var.location]
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

run "reject_empty_name" {
  command = plan

  variables {
    app_name = ""
  }

  expect_failures = [var.app_name]
}

run "reject_name_with_invalid_characters" {
  command = plan

  variables {
    app_name = "service_manual"
  }

  expect_failures = [var.app_name]
}

run "reject_name_that_would_exceed_azure_limit" {
  command = plan

  variables {
    app_name = join("", [for i in range(39) : "a"])
  }

  expect_failures = [var.app_name]
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
