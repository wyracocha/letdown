#!/bin/bash

script_configure_env () 
{
    REPONAME="${GITHUB_REPOSITORY:-owner/repo}"
    export IMAGE_TAG="${GITHUB_SHA:-latest}"
    export PROJECT_NAME=$(echo $REPONAME | cut -d "/" -f2)
    export REGION="${REGION:-EASTUS}"
    export IMAGE_NAME=$REPONAME 
}

"$@"