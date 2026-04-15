#!/bin/bash

# Build the Nuxt module
pnpm exec nuxt-module-build

# Compile the CLI script
tsc --project tsconfig.cli.json
