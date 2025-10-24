terraform {
  backend "azurerm" {
    resource_group_name  = "rg_global_tfstate"
    storage_account_name = "letdowntfstates"
    container_name       = "tfstates"
    key                  = "dev.terraform.tfstate"
  }
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = "=4.0.0"
    }
  }
}

provider "azurerm" {
  # Configuration options
  features {
    
  }
}