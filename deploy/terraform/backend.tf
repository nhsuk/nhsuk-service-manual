terraform {
    backend "azurerm" {
        resource_group_name  = "tfbackends-uks"
        storage_account_name = "tfbackends"
        container_name       = "tfstate"
    }
}
