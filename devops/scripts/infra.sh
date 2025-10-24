#!/bin/bash

script_load_env ()
{
    source ./devops/scripts/env.sh
}

script_terraform ()
{
    # loading env file
    script_load_env 
    # configure local env vars
    script_configure_env
    # running base tf script
    docker run -v "$PWD/iac:/app" \
        -e ARM_CLIENT_ID=$ARM_CLIENT_ID \
        -e ARM_CLIENT_SECRET=$ARM_CLIENT_SECRET \
        -e ARM_TENANT_ID=$ARM_TENANT_ID \
        -e ARM_SUBSCRIPTION_ID=$ARM_SUBSCRIPTION_ID \
        -e TF_VAR_PROJECT_NAME=$PROJECT_NAME  \
        -e TF_VAR_REGION=$REGION \
        -e TF_VAR_IMAGE_NAME=$IMAGE_NAME \
        -e TF_VAR_PAT=$PAT \
        -e TF_VAR_IMAGE_TAG=$IMAGE_TAG  \
        -e TF_VAR_JWT_SECRET=$JWT_SECRET \
        -e TF_VAR_MONGO_URI=$MONGO_URI \
        -w /app \
    hashicorp/terraform:latest $1
}

script_terraform_init ()
{
    script_terraform "init"
}

script_terraform_plan ()
{
    script_terraform "plan"
}

script_terraform_apply ()
{
    script_terraform "apply -auto-approve"
}

script_terraform_destroy ()
{
    script_terraform "destroy -auto-approve"
}

script_terraform_output ()
{
    script_terraform "output"
}

script_terraform_doc ()
{
    # loading env file
    script_load_env 
    # configure local env vars
    script_configure_env
    # running base tf script
    docker run --rm -v "$PWD/iac:/terraform-docs" -u $(id -u) quay.io/terraform-docs/terraform-docs:0.16.0 markdown /terraform-docs > ./iac/README.md
}

script_security ()
{
    docker run --rm -it -e SNYK_TOKEN=$SNYK_TOKEN -v "$PWD/iac:/app" snyk/snyk:linux
}

"$@"