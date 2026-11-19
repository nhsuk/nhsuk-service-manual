variable "environment" {
  description = "Environment to provision."
  type        = string
  nullable    = false

  validation {
    condition     = contains(["dev", "stag", "prod"], var.environment)
    error_message = "The environment must be dev, stag, or prod."
  }
}

variable "app_name" {
  description = "Application segment of the Azure resource name, without the nhsuk prefix."
  type        = string
  nullable    = false

  validation {
    condition     = can(regex("^[a-z0-9]([a-z0-9-]{0,36}[a-z0-9])?$", var.app_name))
    error_message = "The app name must be 1 to 38 lowercase letters, digits or hyphens, and start and end with a letter or digit. The limit keeps staging resource names within 60 characters."
  }
}

variable "location" {
  description = "Three-letter suffix for resource names and full Azure region identifier."
  type = object({
    short = string
    long  = string
  })
  default = {
    short = "uks"
    long  = "uksouth"
  }
  nullable = false

  validation {
    condition     = var.location.long == "uksouth"
    error_message = "The long location must be uksouth."
  }

  validation {
    condition     = can(regex("^[a-z]{3}$", var.location.short))
    error_message = "The short location must be exactly three lowercase letters."
  }
}

variable "app_service_sku" {
  description = "Azure App Service plan SKU."
  type        = string
  default     = "P0v4"
  nullable    = false
}

variable "node_version" {
  description = "Azure App Service's built-in Linux Node.js runtime version."
  type        = string
  default     = "26"
  nullable    = false
}

variable "tags" {
  description = "Additional Azure tags for all resources."
  type        = map(string)
  default     = {}
  nullable    = false
}
