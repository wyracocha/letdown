#!/bin/bash

script_load_env ()
{
    source ./devops/scripts/env.sh
}

script_front_install ()
{
  docker run --rm -w /app \
    -v "$PWD/app/frontend:/app"  \
    node:slim npm install
}

script_front_build ()
{
  docker run --rm -w /app \
    -v "$PWD/app/frontend:/app"  \
    node:slim npm run build
}
"$@"