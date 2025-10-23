#!/bin/bash

script_load_env ()
{
    source ./devops/scripts/env.sh
}


script_login ()
{
    # loading env file
    script_load_env 
    # configure local env vars
    script_configure_env
    # login to container registry: github
    # echo " .. $PAT - $CR_HOST - $GITHUB_ACTOR"
    echo $PAT | docker login $CR_HOST -u $GITHUB_ACTOR --password-stdin
}

script_build ()
{
    # loading env file 
    script_load_env
    # configure local env vars
    script_configure_env
    docker build -t $CR_HOST/$IMAGE_NAME:$IMAGE_TAG ./app/backend
    docker tag $CR_HOST/$IMAGE_NAME:$IMAGE_TAG $CR_HOST/$IMAGE_NAME:latest
}

script_deploy ()
{
    # loading env file 
    script_load_env
    # configure local env vars
    script_configure_env
    # push
    docker push -a $CR_HOST/$IMAGE_NAME
}

script_lint ()
{
    # loading env file 
    script_load_env
    # configure local env vars
    script_configure_env
    docker run --rm -i ghcr.io/hadolint/hadolint < app/backend/Dockerfile
}

"$@"