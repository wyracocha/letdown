variable "PROJECT_NAME" {
  type = string
  description = "project name: cant contain special characters"
    validation {
      condition = can(regex("^[^<>'\"/;`%]*$", var.PROJECT_NAME))
      error_message = "value"
    }
}

variable "REGION" {
  type = string
  description = "Region allowed:  EASTUS, EASTUS2"
  validation {
    condition = contains(["EASTUS", "EASTUS2"], var.REGION)
    error_message = "REGION NOW ALLOWED"
  }
}

variable "LAW_RETENTION" {
  type = number
  default = 30
  description = "Log analytics workspace retention days"
}

variable "IMAGE_NAME" {
  type = string
}

variable "IMAGE_TAG" {
  type = string
}

variable "CONTAINER_CPU" {
  type = number
  default = 0.25
}

variable "CONTAINER_MEMORY" {
    type = string
    default = "0.5Gi"
}

variable "CR_HOST" {
  type = string
  default = "ghcr.io"
  description = "container registry name"
}

variable "PAT" {
  type = string
  description = "token secret for container registry"
}

variable "USERNAME" {
  type = string
  description = "container registry username"
  default = "maliaga-pantoja"
}



# CONTAINER ENV VARS
variable "JWT_SECRET" {
  type = string
  description = "JWT SECRET"
}

variable "MONGO_URI" {
  type = string
  description = "mongodb uri"
}

variable "ADMIN_USER" {
  type = string
  description = "mongodb uri"
}
variable "ADMIN_PASS" {
  type = string
  description = "mongodb uri"
}

variable "AZURE_STORAGE_ACCOUNT" {
  type = string
  description = "mongodb uri"
}
variable "AZURE_STORAGE_KEY" {
  type = string
  description = "mongodb uri"
}
variable "AZURE_CONTAINER_NAME" {
  type = string
  description = "mongodb uri"
}


#--------------- FRONT
locals {
  mimetype = {
    html  = "text/html"
    css   = "text/css"
    js    = "application/javascript"
    png   = "image/png"
    jpg   = "image/jpeg"
    jpeg  = "image/jpeg"
    gif   = "image/gif"
    svg   = "image/svg+xml"
    ico   = "image/x-icon"
    json  = "application/json"
  }
}