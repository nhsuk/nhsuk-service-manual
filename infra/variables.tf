variable "organisation" {
  description = "Organisation segment of the Azure resource name."
  type        = string
  default     = "nhsuk"
  nullable    = false
}

variable "environment" {
  description = "Environment to provision."
  type        = string
  nullable    = false
}

variable "app_name" {
  description = "Application segment of the Azure resource name, without the organisation prefix."
  type        = string
  nullable    = false
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
