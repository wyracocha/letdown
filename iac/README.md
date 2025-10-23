## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_azurerm"></a> [azurerm](#requirement\_azurerm) | 3.79.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_azurerm"></a> [azurerm](#provider\_azurerm) | 3.79.0 |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [azurerm_container_app.example](https://registry.terraform.io/providers/hashicorp/azurerm/3.79.0/docs/resources/container_app) | resource |
| [azurerm_container_app_environment.example](https://registry.terraform.io/providers/hashicorp/azurerm/3.79.0/docs/resources/container_app_environment) | resource |
| [azurerm_log_analytics_workspace.example](https://registry.terraform.io/providers/hashicorp/azurerm/3.79.0/docs/resources/log_analytics_workspace) | resource |
| [azurerm_resource_group.rg](https://registry.terraform.io/providers/hashicorp/azurerm/3.79.0/docs/resources/resource_group) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_CONTAINER_CPU"></a> [CONTAINER\_CPU](#input\_CONTAINER\_CPU) | n/a | `number` | `0.25` | no |
| <a name="input_CONTAINER_MEMORY"></a> [CONTAINER\_MEMORY](#input\_CONTAINER\_MEMORY) | n/a | `string` | `"0.5Gi"` | no |
| <a name="input_CR_HOST"></a> [CR\_HOST](#input\_CR\_HOST) | container registry name | `string` | `"ghcr.io"` | no |
| <a name="input_IMAGE_NAME"></a> [IMAGE\_NAME](#input\_IMAGE\_NAME) | n/a | `string` | n/a | yes |
| <a name="input_IMAGE_TAG"></a> [IMAGE\_TAG](#input\_IMAGE\_TAG) | n/a | `string` | n/a | yes |
| <a name="input_JWT_SECRET"></a> [JWT\_SECRET](#input\_JWT\_SECRET) | JWT SECRET | `string` | n/a | yes |
| <a name="input_LAW_RETENTION"></a> [LAW\_RETENTION](#input\_LAW\_RETENTION) | Log analytics workspace retention days | `number` | `30` | no |
| <a name="input_MONGODB_URI"></a> [MONGODB\_URI](#input\_MONGODB\_URI) | mongodb uri | `string` | n/a | yes |
| <a name="input_PAT"></a> [PAT](#input\_PAT) | token secret for container registry | `string` | n/a | yes |
| <a name="input_PROJECT_NAME"></a> [PROJECT\_NAME](#input\_PROJECT\_NAME) | project name: cant contain special characters | `string` | n/a | yes |
| <a name="input_REGION"></a> [REGION](#input\_REGION) | Region allowed:  EASTUS, EASTUS2 | `string` | n/a | yes |
| <a name="input_USERNAME"></a> [USERNAME](#input\_USERNAME) | container registry username | `string` | `"maliaga-pantoja"` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_fqdn"></a> [fqdn](#output\_fqdn) | service url |
