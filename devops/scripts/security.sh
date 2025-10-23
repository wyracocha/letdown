#!/bin/bash

script_load_env ()
{
    source ./devops/scripts/env.sh
}

script_security_iac ()
{
    # loading env file
    script_load_env 
    # configure local env vars
    script_configure_env
    # running base tf script
    docker run --rm -e SNYK_TOKEN=$SNYK_TOKEN -v "$PWD/iac:/app" \
        -w /app snyk/snyk:alpine "/usr/local/bin/snyk iac test --org=123b175c-264a-4a8f-907a-b562b92fe0b6 --json --json-file-output=iac_report.json"
}

script_security_app ()
{
    # loading env file
    script_load_env 
    # configure local env vars
    script_configure_env
    # running base tf script
    docker run --rm -e SNYK_TOKEN=$SNYK_TOKEN -v "$PWD/app:/app" \
        -w /app snyk/snyk:alpine "/usr/local/bin/snyk code test --org=123b175c-264a-4a8f-907a-b562b92fe0b6 --json --json-file-output=app_report.json"
}

"$@"