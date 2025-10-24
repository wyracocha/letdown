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
#--------------- FRONT

# 3. Crea la cuenta de almacenamiento
resource "azurerm_storage_account" "stfront" {
  name                     = "st${var.PROJECT_NAME}" # Debe ser globalmente único
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  account_kind             = "StorageV2"

}

resource "azurerm_storage_account_static_website" "website" {
  storage_account_id = azurerm_storage_account.stfront.id
  error_404_document = "404.html"
  index_document     = "index.html"
}
# 4. Sube todos los archivos del sitio web
resource "azurerm_storage_blob" "site_blobs" { 
  # fileset() busca de forma recursiva todos los archivos en la carpeta
  for_each               = fileset("dist/", "**")
  name                   = each.value
  storage_account_name   = azurerm_storage_account.stfront.name
  storage_container_name = "$web"
  type                   = "Block"
  source                 = "dist/${each.value}"

  # Asigna el tipo de contenido basándose en la extensión del archivo
  content_type = lookup(local.mimetype, split(".", each.value)[length(split(".", each.value)) - 1], "application/octet-stream")
  depends_on = [ azurerm_storage_account_static_website.website ]
}