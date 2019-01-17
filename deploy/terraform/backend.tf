terraform {
    backend "azurerm" {
        resource_group_name  = "tfbackends"
        storage_account_name = "tfbackends"
        container_name       = "tfstate"
    }
}
