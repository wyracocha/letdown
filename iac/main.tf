resource "azurerm_resource_group" "rg" {
  name     = "rsg-${var.PROJECT_NAME}"
  location = var.REGION
}

resource "azurerm_log_analytics_workspace" "example" {
  name                = "law-${var.PROJECT_NAME}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 =  "PerGB2018"
  retention_in_days   = var.LAW_RETENTION
}

resource "azurerm_container_app_environment" "example" {
  name                       = "cae-${var.PROJECT_NAME}"
  location                   = azurerm_resource_group.rg.location
  resource_group_name        = azurerm_resource_group.rg.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.example.id
}
resource "azurerm_container_app" "example" {
  name                         = "cap-${var.PROJECT_NAME}"
  container_app_environment_id = azurerm_container_app_environment.example.id
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Multiple"

  template {
    container {
      name   = "container-${var.PROJECT_NAME}"
      image  = "${var.CR_HOST}/${var.IMAGE_NAME}:${var.IMAGE_TAG}"
      cpu    = var.CONTAINER_CPU
      memory = var.CONTAINER_MEMORY
      env {
        name = "PORT"
        value = 80
      }
      env {
        name = "JWT_SECRET"
        value = var.JWT_SECRET
      }
      env {
        name = "MONGO_URI"
        value = var.MONGO_URI
      }
      env {
        name = "ADMIN_USER"
        value = var.ADMIN_USER
      }
      env {
        name = "ADMIN_PASS"
        value = var.ADMIN_PASS
      }
      env {
        name = "AZURE_STORAGE_ACCOUNT"
        value = var.AZURE_STORAGE_ACCOUNT
      }
      env {
        name = "AZURE_STORAGE_KEY"
        value = var.AZURE_STORAGE_KEY
      }
      env {
        name = "AZURE_CONTAINER_NAME"
        value = var.AZURE_CONTAINER_NAME
      }
    }
  }

  ingress {
    allow_insecure_connections = false
    external_enabled = true
    target_port = 80
    transport = "http"
    traffic_weight {
      percentage = 100
      latest_revision = true
    }
  }

  secret {
    name = "pat"
    value = var.PAT
  }
  registry {
    server = var.CR_HOST
    password_secret_name = "pat"
    username = var.USERNAME
  }
}